import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import CityTransportPage from "../components/CityTransportPage";
import { SEO_CITIES } from "../lib/cities";

export default function DynamicSeoPage({ serviceType }) {
  const { city } = useParams();
  
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Find city config
  const cityConfig = SEO_CITIES.find(c => c.slug === city);

  useEffect(() => {
    if (!cityConfig) return;
    
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
  }, [city, cityConfig]);

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
