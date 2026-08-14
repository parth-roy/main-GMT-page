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
  if (serviceType === "truck-booking") urlSegment = "truck-booking";
  else if (serviceType === "pickup-rent") urlSegment = "pickup-truck-for-rent";
  else if (serviceType === "moving-truck") urlSegment = "moving-truck-hire";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  const header = seoData?.header || `Transport Services in ${cityName}`;
  const bannerText = seoData?.bannerText || `Your trusted partner for truck booking in ${cityName}`;
  const descText = seoData?.description || `Logistics services and on-demand fleet in ${cityName}.`;
  
  const keywordsArr = Array.isArray(seoData?.keywords) ? seoData.keywords : [];
  const metaKeywords = keywordsArr.join(", ");

  return (
    <CityTransportPage
      city={cityName}
      slug={city}
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
