import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { 
  Truck, ShieldCheck, CheckCircle, ArrowRight, 
  IndianRupee, Clock, HelpCircle, ChevronDown, ChevronUp, 
  Zap, Bell, Briefcase, PhoneCall, Sparkles 
} from "lucide-react";
import SEOHead from "../seo/SEOHead";
import DynamicLocationHero from "../components/DynamicLocationHero";
import TrustBadgeRow from "../components/TrustBadgeRow";
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner";
import { SEO_CITIES, getCityBySlug } from "../lib/cities";
import { getVehicleBySlug, ALL_SEO_VEHICLES } from "../lib/vehicles";
import { useCity } from "../context/CityContext";

export default function DriverLoadHubPage() {
  const { city, vehicle: vehicleParam } = useParams();
  const location = useLocation();
  const { currentCity, setCity } = useCity();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [city, vehicleParam]);

  const cityConfig = SEO_CITIES.find((c) => c.slug === city) || (city ? {
    name: city.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    slug: city,
    state: "India"
  } : null);

  useEffect(() => {
    if (cityConfig && currentCity?.slug !== cityConfig.slug) {
      setCity({
        name: cityConfig.name,
        slug: cityConfig.slug,
        state: cityConfig.state || "India",
        region: cityConfig.state || "India",
      }, true);
    }
  }, [cityConfig, currentCity?.slug, setCity]);

  const vehicle = getVehicleBySlug(vehicleParam);

  if (!cityConfig || !vehicle) {
    return <Navigate to="/not-found" replace />;
  }

  const { name: cityName, state } = cityConfig;
  const canonicalPath = location.pathname;

  // Typical commercial load demand profiles matching local vehicle and city context
  const sampleDemandProfiles = [
    {
      title: `Warehouse Retail Distribution (${vehicle.shortName})`,
      location: `${cityName} Industrial Zone → City Center`,
      weight: `${vehicle.capacityKg * 0.8} kg`,
      estEarning: `₹${vehicle.baseFare * 3}`,
      cadence: "Daily Recurring Demand",
      type: "Local Delivery",
    },
    {
      title: `Wholesale Market & APMC Haulage`,
      location: `Wholesale Hub → ${cityName} Suburbs`,
      weight: `${vehicle.capacityKg * 0.9} kg`,
      estEarning: `₹${vehicle.baseFare * 4}`,
      cadence: "Frequent Dispatch Lane",
      type: "Commercial Goods",
    },
    {
      title: `Residential Relocation / 2 BHK Shifting`,
      location: `Within ${cityName} (15 km transit)`,
      weight: `${vehicle.capacityKg} kg (Full Load)`,
      estEarning: `₹${vehicle.baseFare * 5}`,
      cadence: "On-demand Dispatch",
      type: "House Shifting",
    },
    {
      title: `Intercity Return Load Dispatch`,
      location: `${cityName} → Regional District Hub`,
      weight: `${vehicle.capacityKg} kg`,
      estEarning: `₹${vehicle.baseFare * 8}`,
      cadence: "Backhaul Return Corridor",
      type: "Intercity Highway",
    },
  ];

  const pageFaqs = [
    {
      question: `How do I get commercial ${vehicle.shortName} loads in ${cityName}?`,
      answer: `Commercial truck drivers and fleet owners can attach their ${vehicle.name} with GoMyTruck for a flat ₹99 90-day subscription. You receive instant SMS and push notifications for loads matching your vehicle type and operating zones in ${cityName}, with direct customer phone numbers.`
    },
    {
      question: `Does GoMyTruck deduct commission on my trips in ${cityName}?`,
      answer: `No. For direct customer inquiries unlocked via the platform, GoMyTruck charges 0% freight commission. You negotiate and collect trip payments directly from the shipper via cash, UPI, or bank transfer.`
    },
    {
      question: `What documents do I need to attach a ${vehicle.shortName} in ${cityName}?`,
      answer: `To register, you need a Commercial Driver's License (DL), Vehicle Registration Certificate (RC), valid Vehicle Fitness Certificate, Commercial Insurance, and active FASTag.`
    },
    {
      question: `How much can a ${vehicle.shortName} driver earn monthly in ${cityName}?`,
      answer: `Active commercial ${vehicle.name} drivers in ${cityName} typically earn between ₹35,000 to ₹75,000 per month depending on daily trip count, intercity runs, and vehicle capacity utilization.`
    },
    {
      question: `Can customers hire my ${vehicle.shortName} directly?`,
      answer: `Yes. GoMyTruck allows shippers to unlock 10 verified driver phone numbers in ${cityName} for a flat ₹99 fee. Shippers will call you directly on your registered mobile number for load bookings.`
    }
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
        { "@type": "ListItem", "position": 2, "name": "Driver Partner", "item": "https://gomytruck.com/driver-partner" },
        { "@type": "ListItem", "position": 3, "name": `${cityName} Loads`, "item": `https://gomytruck.com/loads/${city}` },
        { "@type": "ListItem", "position": 4, "name": vehicle.shortName, "item": `https://gomytruck.com${canonicalPath}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `${vehicle.name} Driver Attachment & Commercial Loads in ${cityName}`,
      "image": `https://gomytruck.com${vehicle.image}`,
      "provider": {
        "@type": "Organization",
        "name": "GoMyTruck Partner Network",
        "url": "https://gomytruck.com"
      },
      "areaServed": {
        "@type": "City",
        "name": cityName,
        "addressRegion": state
      },
      "description": `Commercial load matching and vehicle attachment service for ${vehicle.name} drivers in ${cityName}. Flat ₹99 90-day subscription with zero brokerage on direct trips.`
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": pageFaqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer }
      }))
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEOHead
        title={`${vehicle.name} Loads in ${cityName} | Driver Jobs & Vehicle Attach | GoMyTruck`}
        description={`Find commercial ${vehicle.name} loads in ${cityName}, ${state}. Attach your vehicle for ₹99 (90 days). Zero broker commission, direct shipper phone calls, and daily trips.`}
        canonical={canonicalPath}
        keywords={`${vehicle.shortName} loads ${cityName}, attach ${vehicle.slug} ${cityName}, truck driver jobs ${cityName}, ${vehicle.name} transport work ${cityName}`}
        jsonLd={jsonLd}
      />

      {/* Hero: Light-Mode Homepage-Styled Architecture with 3 Buttons & Floating Card */}
      <DynamicLocationHero
        city={cityName}
        slug={cityConfig?.slug}
        state={state}
        headline={`${vehicle.name} Loads in ${cityName}`}
        subheadline={`Find daily commercial loads, factory dispatches, and return trips for ${vehicle.name} across ${cityName} and industrial corridors.`}
        badgeText={`${cityName}, ${state} · Daily ${vehicle.shortName} Loads`}
        pickupDefault={cityName}
        defaultVehicle={vehicle.slug === "14ft-eicher" || vehicle.slug === "truck-14ft" || vehicle.slug === "truck-17ft" || vehicle.slug === "truck-20ft" ? "open_truck" : vehicle.slug === "32ft-container" || vehicle.slug === "container-32ft" ? "trailers" : "truck"}
      />

      {/* Trust Badges */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto -mt-6 relative z-20">
        <TrustBadgeRow city={cityName} />
      </section>

      {/* Direct Driver Contact ₹99 Unlock Promo Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <DirectDriverContactBanner categoryName={`${vehicle.shortName} Drivers`} cityName={cityName} />
      </section>

      {/* Why Drivers Choose GoMyTruck in City */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 mt-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Why {vehicle.name} Drivers Choose GoMyTruck in {cityName}
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Eliminate daily broker waiting at transport nagars. Get verified trip inquiries sent straight to your phone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
                <IndianRupee className="text-amber-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">0% Commission</h3>
              <p className="text-xs text-slate-500 leading-relaxed">No 10-25% cuts taken by local brokers. Keep 100% of your negotiated trip fare.</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center mb-3">
                <PhoneCall className="text-brand-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Direct Shipper Calls</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Genuine factory managers, merchants, and house movers call your phone directly.</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                <ShieldCheck className="text-emerald-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">90-Day Coverage</h3>
              <p className="text-xs text-slate-500 leading-relaxed">A single ₹99 payment keeps your vehicle profile actively listed for a full 3 months.</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
                <Bell className="text-purple-700" size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Return Load Alerts</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Get notifications for backhaul consignments when finishing intercity trips to {cityName}.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle size={14} /> Driver FAQs
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Driver Questions: {vehicle.shortName} Loads in {cityName}
            </h2>
          </div>

          <div className="space-y-3">
            {pageFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-brand-600"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={18} className="shrink-0 text-brand-600" /> : <ChevronDown size={18} className="shrink-0 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
