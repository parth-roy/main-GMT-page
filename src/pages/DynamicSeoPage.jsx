import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import CityTransportPage from "../components/CityTransportPage";
import { SEO_CITIES } from "../lib/cities";
import { useCity } from "../context/CityContext";

export default function DynamicSeoPage({ serviceType }) {
  const { city } = useParams();
  const { currentCity, setCity } = useCity();
  
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Find city config
  const cityConfig = SEO_CITIES.find(c => c.slug === city);

  useEffect(() => {
    if (!cityConfig) return;
    
    // Sync global CityContext if user directly navigated to a city URL
    if (currentCity?.slug !== cityConfig.slug) {
      setCity({
        name: cityConfig.name,
        slug: cityConfig.slug,
        state: cityConfig.state || "India",
        region: cityConfig.state || "India",
      }, false);
    }

    setLoading(true);
    fetch('https://api-test.gomytruck.com/api/v1/seo/hub/' + city)
      .then(res => res.json())
      .then(data => {
        setSeoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [city, cityConfig, currentCity?.slug, setCity]);

  if (!cityConfig) {
    return <Navigate to="/not-found" replace />;
  }

  const { name: cityName, state } = cityConfig;

  let urlSegment = "";
  let serviceHeadline = `Transport Services in ${cityName}`;
  let serviceBanner = `Your trusted partner for truck booking and goods transport in ${cityName}`;
  let serviceDesc = `On-demand goods transport and commercial truck booking in ${cityName}, ${state}. Flat 5% commission, verified drivers, and transparent live pricing.`;

  if (serviceType === "truck-booking") {
    urlSegment = "truck-booking";
    serviceHeadline = `Online Truck Booking in ${cityName}`;
    serviceBanner = `Book mini trucks, Tata Ace, and commercial transport in ${cityName}`;
    serviceDesc = `Hire trucks online in ${cityName}. Fast dispatch for Tata Ace, 14ft, 20ft, and 32ft commercial freight at transparent per-km rates with zero broker margin.`;
  } else if (serviceType === "mini-truck") {
    urlSegment = "mini-truck-booking";
    serviceHeadline = `Mini Truck Booking in ${cityName}`;
    serviceBanner = `Book Tata Ace, 407, and mini trucks for quick local transport in ${cityName}`;
    serviceDesc = `Rent mini trucks online in ${cityName}. Ideal for house shifting, shop stock delivery, and commercial logistics at transparent per-km fares with verified drivers.`;
  } else if (serviceType === "14ft-truck") {
    urlSegment = "14-feet-truck-rental";
    serviceHeadline = `14 Feet Truck Rental in ${cityName}`;
    serviceBanner = `Hire 14ft Eicher and intermediate commercial trucks in ${cityName}`;
    serviceDesc = `Book 14 feet trucks in ${cityName} for up to 3.5–5 ton commercial loads, factory dispatches, wholesale distribution, and intercity freight with 5% commission.`;
  } else if (serviceType === "tata-ace") {
    urlSegment = "tata-ace-booking";
    serviceHeadline = `Tata Ace / Chota Hathi Booking in ${cityName}`;
    serviceBanner = `Rent Tata Ace / Chota Hathi (750 kg) in ${cityName}`;
    serviceDesc = `Hire Tata Ace in ${cityName} for fast city delivery, retail goods, and small household shifting. Instant booking with zero broker commission.`;
  } else if (serviceType === "pickup-rent") {
    urlSegment = "pickup-truck-for-rent";
    serviceHeadline = `Pickup Truck for Rent in ${cityName}`;
    serviceBanner = `Mahindra Bolero Pickup and 8ft / 9ft mini trucks on rent in ${cityName}`;
    serviceDesc = `Rent pickup trucks in ${cityName} for local goods delivery, furniture shifting, and wholesale transport. Upfront fares with instant booking.`;
  } else if (serviceType === "moving-truck") {
    urlSegment = "moving-truck-hire";
    serviceHeadline = `Moving Truck Hire in ${cityName}`;
    serviceBanner = `Household shifting and office relocation moving trucks in ${cityName}`;
    serviceDesc = `Hire moving trucks in ${cityName} for safe house shifting and office relocation. Dedicated closed container trucks and careful cargo transport.`;
  } else if (serviceType === "goods-transport") {
    urlSegment = "goods-transport";
    serviceHeadline = `Goods Transport Services in ${cityName}`;
    serviceBanner = `Commercial goods transport and freight logistics across ${cityName}`;
    serviceDesc = `Reliable goods transport services in ${cityName}, ${state}. Hire verified trucks for retail cargo, manufacturing consignments, and wholesale distribution with flat 5% commission.`;
  } else if (serviceType === "ftl-transport") {
    urlSegment = "ftl-transport";
    serviceHeadline = `Full Truckload (FTL) Freight in ${cityName}`;
    serviceBanner = `Dedicated full truckload (FTL) commercial freight from ${cityName}`;
    serviceDesc = `Book dedicated Full Truckload (FTL) freight services in ${cityName}. Direct point-to-point transit for 14ft to 32ft commercial trucks with guaranteed placement and live GPS tracking.`;
  }

  const routePath = serviceType === "hub" ? `/${city}` : `/${city}/${urlSegment}`;

  // Create JSON-LD TransportationService Schema
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TransportationService",
      "name": `GoMyTruck ${cityName}`,
      "image": "https://gomytruck.com/logo.png",
      "telephone": "+91-9331488999",
      "areaServed": {
        "@type": "City",
        "name": cityName
      },
      "url": `https://gomytruck.com${routePath}`
    }
  ];

  const header = seoData?.header || serviceHeadline;
  const bannerText = seoData?.bannerText || serviceBanner;
  const descText = seoData?.description || serviceDesc;
  
  const keywordsArr = Array.isArray(seoData?.keywords) ? seoData.keywords : [];
  const metaKeywords = keywordsArr.join(", ");

  return (
    <CityTransportPage
      city={cityName}
      slug={city}
      state={state}
      serviceType={serviceType}
      canonical={routePath}
      seoTitle={`${header} | GoMyTruck`}
      description={descText}
      headline={header}
      subheadline={bannerText}
      keywords={metaKeywords}
      jsonLd={jsonLd}
    >
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{header}</h2>
            <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
              <p className="font-medium text-gray-800">{bannerText}</p>
              <p>{descText}</p>
              
              {keywordsArr.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Keywords</h3>
                  <ul className="flex flex-wrap gap-2 list-none pl-0">
                    {keywordsArr.map((kw, i) => (
                      <li key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                        {kw}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CityTransportPage>
  );
}
