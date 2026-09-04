import React, { useState, useEffect } from "react"
import PackersHero from "../components/packers/PackersHero"
import PackersValueProps from "../components/packers/PackersValueProps"
import PackersExtraServices from "../components/packers/PackersExtraServices"
import PackersSEOContent from "../components/packers/PackersSEOContent"
import PackersLocalSEO from "../components/packers/PackersLocalSEO"
import PackersFAQ from "../components/packers/PackersFAQ"
import AppDownloadBanner from "../components/truck/AppDownloadBanner"
import SEOHead from "../seo/SEOHead"
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner"

export default function PackersAndMoversPage() {
  const [city, setCity] = useState("Kolkata")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const packersSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `Packers and Movers in ${city}`,
      "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
      "areaServed": city,
      "serviceType": "Packers and Movers, House Shifting, Office Relocation",
      "description": `Request a packing and moving quote in ${city}. The scope and price depend on inventory, access, packing, route, workforce, and schedule.`
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
        { "@type": "ListItem", "position": 2, "name": `Packers and Movers in ${city}`, "item": "https://gomytruck.com/packers-and-movers" }
      ]
    }
  ]

  return (
    <div className="bg-slate-50 min-h-screen font-sans w-full">
      <SEOHead
        title={`Packers and Movers in ${city} | Request a Moving Quote`}
        description={`Looking for reliable packers and movers in ${city}? GoMyTruck offers careful house shifting, office relocation, and bike transport with transparent pricing.`}
        canonical="/packers-and-movers"
        keywords={`packers and movers in ${city}, house shifting request in ${city}, office relocation ${city}, moving quote near me, scoped moving services, bike transport ${city}`}
        jsonLd={packersSchema}
      />
      
      <PackersHero city={city} setCity={setCity} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DirectDriverContactBanner categoryName="Movers & Shifting Drivers" cityName={city} />
      </div>
      <PackersValueProps />
      <PackersExtraServices />
      <PackersSEOContent city={city} />
      <AppDownloadBanner />
      <PackersLocalSEO city={city} />
      <PackersFAQ city={city} />
    </div>
  )
}
