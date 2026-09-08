import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { 
  Truck, ShieldCheck, CheckCircle, ArrowRight, 
  IndianRupee, Clock, HelpCircle, ChevronDown, ChevronUp, 
  Zap, Bell, Briefcase, PhoneCall, Sparkles 
} from "lucide-react";
import SEOHead from "../seo/SEOHead";
import TrustBadgeRow from "../components/TrustBadgeRow";
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner";
import { SEO_CITIES } from "../lib/cities";
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

  // Simulated live load opportunities matching local context
  const simulatedLoads = [
    {
      title: `Warehouse Retail Distribution (${vehicle.shortName})`,
      location: `${cityName} Industrial Zone → City Center`,
      weight: `${vehicle.capacityKg * 0.8} kg`,
      estEarning: `₹${vehicle.baseFare * 3}`,
      posted: "15 mins ago",
      type: "Local Delivery",
    },
    {
      title: `Wholesale Market / Mandi Haulage`,
      location: `Wholesale Market → ${cityName} Suburbs`,
      weight: `${vehicle.capacityKg * 0.9} kg`,
      estEarning: `₹${vehicle.baseFare * 4}`,
      posted: "42 mins ago",
      type: "Commercial Goods",
    },
    {
      title: `Residential Relocation / 2 BHK Shifting`,
      location: `Within ${cityName} (15 km transit)`,
      weight: `${vehicle.capacityKg} kg (Full Load)`,
      estEarning: `₹${vehicle.baseFare * 5}`,
      posted: "1 hour ago",
      type: "House Shifting",
    },
    {
      title: `Intercity Return Load Dispatch`,
      location: `${cityName} → Regional District Hub`,
      weight: `${vehicle.capacityKg} kg`,
      estEarning: `₹${vehicle.baseFare * 8}`,
      posted: "2 hours ago",
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

      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-32 pb-20 mt-[68px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/80 opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/driver-partner" className="hover:text-brand-400 transition-colors">Driver Partner</Link>
            <span>/</span>
            <span className="text-white font-semibold">{cityName} {vehicle.shortName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wider uppercase mb-4">
                <Zap size={13} className="fill-current" /> Driver Supply &amp; Vehicle Attachment Funnel
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {vehicle.name} Loads <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">in {cityName}</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
                Connect directly with businesses and retail shippers across {cityName}. Attach your {vehicle.shortName} for a flat <strong>₹99 90-day subscription</strong>. 0% broker commission on direct customer deals.
              </p>

              {/* Driver Key Benefits */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Platform Brokerage</div>
                  <div className="text-base sm:text-lg font-black text-emerald-400">0% Commission</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Subscription Validity</div>
                  <div className="text-base sm:text-lg font-black text-white">90 Days (₹99)</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Trip Payments</div>
                  <div className="text-base sm:text-lg font-black text-white">Direct to Driver</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/fleet-partner-registration"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 text-base"
                >
                  <Zap size={18} className="fill-current" /> Attach Your {vehicle.shortName} · ₹99
                </Link>

                <Link
                  to="/direct-driver-contact"
                  className="border border-white/30 text-white font-bold px-6 py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                >
                  <PhoneCall size={16} /> Shipper: Hire Drivers Directly
                </Link>
              </div>
            </div>

            {/* Right: Driver Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-amber-400" size={18} />
                    <span className="font-bold text-white text-sm">Live Load Opportunities</span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active in {cityName}
                  </span>
                </div>

                {/* Simulated Load List */}
                <div className="space-y-3">
                  {simulatedLoads.map((load, idx) => (
                    <div key={idx} className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/60 hover:border-amber-500/50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs font-bold text-white leading-snug">{load.title}</h4>
                        <span className="text-xs font-black text-emerald-400 shrink-0 ml-2">{load.estEarning}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span className="flex items-center gap-1"><img src="/google-maps-icon.webp" alt="Location" width={11} height={11} className="w-3 h-3 object-contain shrink-0" /> {load.location}</span>
                        <span className="text-slate-500">{load.posted}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 text-center">
                  <Link
                    to="/fleet-partner-registration"
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1"
                  >
                    View All Live Loads &amp; Start Earning <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
