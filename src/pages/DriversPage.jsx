import React, { useEffect } from 'react';
import SEOHead from '../seo/SEOHead';
import PartnerHero from '../components/PartnerHero';
import PartnerBenefits from '../components/PartnerBenefits';
import PartnerVehicles from '../components/PartnerVehicles';
import PartnerHowItWorks from '../components/PartnerHowItWorks';
import PartnerFAQ from '../components/PartnerFAQ';
import DirectDriverContactBanner from '../components/common/DirectDriverContactBanner';

const driverSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Truck Owner Registration & Return Load Platform — GoMyTruck",
    "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
    "areaServed": "India",
    "serviceType": "Driver Partner Onboarding, Return Load Matching, Load Board India",
    "description": "GoMyTruck lets approved truck owners and drivers review eligible loads, submit bids where enabled, and manage accepted trips. Opportunities and earnings vary by route and demand."
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
      { "@type": "ListItem", "position": 2, "name": "Driver Partner & Truck Owner", "item": "https://gomytruck.com/driver-partner" }
    ]
  }
];

export default function DriversPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <SEOHead
        title="Find Return Load Online | Attach Truck to Company — GoMyTruck Driver Partner"
        description="Truck owners can apply to attach an eligible commercial vehicle, review available loads, bid where enabled, and manage accepted trips. Work is subject to verification and demand."
        canonical="/driver-partner"
        keywords="find return load online, return load booking, return load app, load board West Bengal, attach truck to company, truck owner registration, find freight for truck, empty truck load matching"
        jsonLd={driverSchema}
      />
      
      <main className="min-h-screen bg-slate-50 font-sans">
        <PartnerHero isFleetOwner={false} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <DirectDriverContactBanner categoryName="Driver Partners & Fleet Owners" />
        </div>
        <PartnerVehicles />
        <PartnerHowItWorks />
        <PartnerBenefits />
        <PartnerFAQ isFleetOwner={false} />
      </main>
    </>
  );
}
