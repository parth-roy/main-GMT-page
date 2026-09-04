import React, { useState, useEffect } from "react"
import BikeHero from "../components/bike/BikeHero"
import BikeVehicleSelection from "../components/bike/BikeVehicleSelection"
import BikePopularRoutes from "../components/bike/BikePopularRoutes"
import AreasWeServe from "../components/truck/AreasWeServe"
import AppDownloadBanner from "../components/truck/AppDownloadBanner"
import OtherServices from "../components/truck/OtherServices"
import BikeSEOContent from "../components/bike/BikeSEOContent"
import InternalLinks from "../components/truck/InternalLinks"
import BikeFAQ from "../components/bike/BikeFAQ"
import SEOHead from "../seo/SEOHead"
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner"

export default function BikePage() {
  const [city, setCity] = useState("Kolkata")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-slate-50 min-h-screen font-sans w-full">
      <SEOHead
        title="Bike Delivery Service in Kolkata"
        description="Request two-wheeler delivery for eligible documents and small parcels in Kolkata. Review route availability and the current estimate before confirming."
        canonical="/bike"
      />
      <BikeHero city={city} setCity={setCity} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DirectDriverContactBanner categoryName="Delivery Partners & Riders" cityName={city} />
      </div>
      <BikeVehicleSelection city={city} />
      <BikePopularRoutes city={city} />
      <AreasWeServe city={city} />
      <AppDownloadBanner />
      <OtherServices currentService="bike" />
      <BikeSEOContent city={city} />
      <InternalLinks />
      <BikeFAQ city={city} />
    </div>
  )
}
