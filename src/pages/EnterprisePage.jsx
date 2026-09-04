import React, { useEffect } from "react"
import EnterpriseHero from "../components/enterprise/EnterpriseHero"
import KeyFeatures from "../components/enterprise/KeyFeatures"
import CityCoverage from "../components/enterprise/CityCoverage"
import IndustriesServed from "../components/enterprise/IndustriesServed"
import SecondaryContact from "../components/enterprise/SecondaryContact"
import EnterpriseFAQ from "../components/enterprise/EnterpriseFAQ"
import SEOHead from "../seo/SEOHead"
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner"

const enterpriseSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "B2B Enterprise Logistics & Corporate Truck Rental",
    "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
    "areaServed": "West Bengal",
    "serviceType": "B2B Logistics, FMCG Transport, Corporate Fleet, Supply Chain Management",
    "description": "Businesses can discuss scheduled transport, recurring vehicle requirements, reporting, and integration needs with GoMyTruck. Coverage and service levels are confirmed in writing."
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
      { "@type": "ListItem", "position": 2, "name": "Enterprise B2B Logistics", "item": "https://gomytruck.com/enterprise" }
    ]
  }
]

export default function EnterprisePage() {
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="w-full font-sans bg-slate-50 overflow-x-hidden pt-[72px]">
      <SEOHead
        title="B2B Enterprise Logistics | FMCG Transport, Corporate Truck Rental & Supply Chain Services"
        description="Discuss B2B transport, scheduled distribution, corporate truck requirements and logistics integration needs with GoMyTruck Enterprise."
        canonical="/enterprise"
        keywords="B2B logistics services, FMCG transport service, industrial goods transport, warehouse transport services, corporate truck rental, retail distribution logistics, heavy machinery transport, factory goods transport, enterprise logistics solutions, contract logistics companies, freight forwarding services, supply chain logistics, dedicated fleet services, commercial freight broker, logistics vendor management"
        jsonLd={enterpriseSchema}
      />
      <EnterpriseHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DirectDriverContactBanner categoryName="Corporate Fleet & Transporters" />
      </div>
      <KeyFeatures />
      <CityCoverage />
      <IndustriesServed />
      <SecondaryContact />
      <EnterpriseFAQ />
    </div>
  )
}
