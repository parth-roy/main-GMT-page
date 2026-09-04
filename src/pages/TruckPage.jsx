import React, { useState, useEffect } from "react"
import TruckHero from "../components/truck/TruckHero"
import VehicleSelection from "../components/truck/VehicleSelection"
import PopularRoutes from "../components/truck/PopularRoutes"
import AreasWeServe from "../components/truck/AreasWeServe"
import AppDownloadBanner from "../components/truck/AppDownloadBanner"
import OtherServices from "../components/truck/OtherServices"
import SEOContent from "../components/truck/SEOContent"
import InternalLinks from "../components/truck/InternalLinks"
import TruckFAQ from "../components/truck/TruckFAQ"
import SEOHead from "../seo/SEOHead"
import { CITY_HERO_IMAGES } from "../api/pricingApi"
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner"

export default function TruckPage() {
  const [city, setCity] = useState("Kolkata")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const truckSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `Truck Booking & Goods Transport in ${city}`,
      "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
      "areaServed": city,
      "serviceType": "Truck Booking, Mini Truck Rental, FTL Transport, PTL Logistics",
      "description": `Request a mini truck, Tata Ace, pickup truck, or full truck load in ${city}. Review route-based pricing and current serviceability before confirming.`
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
        { "@type": "ListItem", "position": 2, "name": `Truck Booking in ${city}`, "item": "https://gomytruck.com/truck" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Tata Ace / Mini Truck Booking",
      "description": "Mini truck and Tata Ace on rent for local goods transport.",
      "image": "https://gomytruck.com/mini_truck.webp",
      "brand": { "@type": "Brand", "name": "GoMyTruck" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "124"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "250",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock"
      }
    }
  ]

  return (
    <div className="bg-slate-50 min-h-screen font-sans w-full">
      <SEOHead
        title={`Truck Booking in ${city} | Mini Truck, Tata Ace on Rent & FTL Transport`}
        description={`Request a mini truck, Tata Ace, pickup truck, or full truck load in ${city}. Review route-based pricing, declare the goods, and check current availability before confirming.`}
        canonical="/truck"
        keywords={`truck booking ${city}, mini truck booking near me, tata ace on rent, tata ace rent per km, pickup truck booking, FTL transport services, part load transport, goods transport ${city}, intercity transport booking, commercial truck rental, PTL logistics`}
        jsonLd={truckSchema}
        preloadImage={CITY_HERO_IMAGES[city] || "/hero-bg.webp"}
      />
      <TruckHero city={city} setCity={setCity} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DirectDriverContactBanner categoryName="Truck Drivers & Transporters" cityName={city} />
      </div>
      <VehicleSelection city={city} />
      <PopularRoutes city={city} />
      <AreasWeServe city={city} />
      <AppDownloadBanner />
      <OtherServices currentService="truck" />
      <SEOContent city={city} />
      <InternalLinks />
      <TruckFAQ city={city} />
    </div>
  )
}
