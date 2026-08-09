import React from "react";
import { useParams, Navigate } from "react-router-dom";
import CityTransportPage from "../components/CityTransportPage";
import { SEO_CITIES } from "../lib/cities";

export default function DynamicSeoPage({ serviceType }) {
  const { city } = useParams();
  
  // Find city config
  const cityConfig = SEO_CITIES.find(c => c.slug === city);
  if (!cityConfig) {
    return <Navigate to="/not-found" replace />;
  }

  const { name: cityName, state } = cityConfig;

  let seoTitle, description, headline, subheadline, keywords;

  const brandKeywords = "go my truck, gomy truck, go mytruck, my truck, go truck, truck booking";

  if (serviceType === "truck-booking") {
    seoTitle = `Online Truck Booking in ${cityName}, ${state} | GoMyTruck`;
    description = `Looking for truck for hire near me in ${cityName}? GoMyTruck offers online truck load booking, truck rental service, and affordable truck rent per km.`;
    headline = `Hire Truck Online in ${cityName}`;
    subheadline = `Top-rated truck rental service & online truck load booking in ${cityName}, ${state}`;
    keywords = `truck for hire near me, truck for hire, truck rental service, truck booking online, truck rent per km, online truck load booking, hire truck online, truck to hire near me, ${brandKeywords}`;
  } else if (serviceType === "pickup-rent") {
    seoTitle = `Pickup Truck for Rent in ${cityName} Near Me | GoMyTruck`;
    description = `Need to rent pickup truck in ${cityName}? Find the best pickup rental and hire someone with a pickup truck instantly with GoMyTruck.`;
    headline = `Pickup Truck for Rent in ${cityName}`;
    subheadline = `Affordable pickup hire and delivery truck for hire in ${cityName}, ${state}`;
    keywords = `pickup truck for rent near me, rent pickup truck, pickup rental, hire pickup truck, pickup hire, pick up truck hire, rent pickup near me, hire someone with a pickup truck, ${brandKeywords}`;
  } else if (serviceType === "moving-truck") {
    seoTitle = `Moving Truck Hire & HGV Hire in ${cityName} | GoMyTruck`;
    description = `Professional moving truck hire in ${cityName}. We provide delivery truck for hire, HGV hire near me, and mini truck booking for all your logistics needs.`;
    headline = `Moving Truck Hire in ${cityName}`;
    subheadline = `Reliable delivery truck for hire and HGV hire near me in ${cityName}, ${state}`;
    keywords = `moving truck hire, delivery truck for hire, hgv hire, hgv hire near me, rent me truck hire, online mini truck booking, mini truck booking, ${brandKeywords}`;
  } else {
    // Default City Hub
    seoTitle = `Transport Services in ${cityName} | GoMyTruck`;
    description = `Best transport and truck rental service in ${cityName}. Online truck booking, moving truck hire, and pickup rental at the best truck rent per km.`;
    headline = `Transport & Logistics Services in ${cityName}`;
    subheadline = `Your trusted partner for truck booking online in ${cityName}, ${state}`;
    keywords = `truck booking online, pickup truck for rent near me, moving truck hire, truck rental service, ${brandKeywords}`;
  }

  let urlSegment = "";
  if (serviceType === "truck-booking") urlSegment = "truck-booking";
  else if (serviceType === "pickup-rent") urlSegment = "pickup-truck-for-rent";
  else if (serviceType === "moving-truck") urlSegment = "moving-truck-hire";

  const routePath = serviceType === "hub" ? `/${city}` : `/${city}/${urlSegment}`;

  // Create JSON-LD LocalBusiness Schema
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `GoMyTruck ${cityName}`,
      "image": "https://gomytruck.com/logo.png",
      "telephone": "+91-9331488999",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": cityName,
        "addressRegion": state,
        "addressCountry": "IN"
      },
      "url": `https://gomytruck.com${routePath}`
    }
  ];

  return (
    <CityTransportPage
      city={cityName}
      slug={city}
      canonical={routePath}
      seoTitle={seoTitle}
      description={description}
      headline={headline}
      subheadline={subheadline}
      keywords={keywords}
      jsonLd={jsonLd}
    >
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose GoMyTruck in {cityName}?</h2>
            <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
              <p>
                When it comes to finding a reliable <strong>truck rental service</strong> in {cityName}, GoMyTruck is the platform of choice. Whether you need a <strong>pickup truck for rent near me</strong> for small business deliveries or a complete <strong>moving truck hire</strong> for relocation, we provide an extensive fleet across {state}.
              </p>
              <p>
                Our <strong>truck rent per km</strong> is highly competitive, ensuring that when you search for <strong>"truck to hire near me"</strong> or <strong>"rent pickup near me"</strong>, you get the best rates. With our easy <strong>truck booking online</strong> system, you can even <strong>hire someone with a pickup truck</strong> in just a few clicks.
              </p>
              <p>
                Need something bigger? We also offer <strong>HGV hire</strong> and <strong>delivery truck for hire</strong> for commercial logistics. Say goodbye to the hassle of traditional transport—choose GoMyTruck for seamless <strong>online truck load booking</strong> and <strong>online mini truck booking</strong> in {cityName}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CityTransportPage>
  );
}
