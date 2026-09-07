import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { 
  Truck, ShieldCheck, CheckCircle, ArrowRight, 
  PhoneCall, Weight, Ruler, Clock, IndianRupee, HelpCircle, 
  ChevronDown, ChevronUp, Zap, Sparkles 
} from "lucide-react";
import SEOHead from "../seo/SEOHead";
import TrustBadgeRow from "../components/TrustBadgeRow";
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner";
import { SEO_CITIES } from "../lib/cities";
import { getVehicleBySlug, ALL_SEO_VEHICLES } from "../lib/vehicles";
import { generateCityFaqs } from "../lib/locationFaqHelper";

export default function CityVehiclePage() {
  const { city, vehicle: vehicleParam } = useParams();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [city, vehicleParam]);

  const cityConfig = SEO_CITIES.find((c) => c.slug === city) || (city ? {
    name: city.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    slug: city,
    state: "India"
  } : null);
  const vehicle = getVehicleBySlug(vehicleParam);

  if (!cityConfig || !vehicle) {
    return <Navigate to="/not-found" replace />;
  }

  const { name: cityName, state } = cityConfig;
  const canonicalPath = location.pathname;

  // Vehicle-specific hyper-local FAQs
  const baseFaqs = generateCityFaqs(cityConfig, "truck-booking").faqs;
  const pageFaqs = [
    {
      question: `How much does it cost to hire a ${vehicle.name} in ${cityName}?`,
      answer: `Hiring a ${vehicle.name} in ${cityName} starts at a base fare of ₹${vehicle.baseFare} for the first ${vehicle.baseDistanceKm} km, followed by an estimated ₹${vehicle.perKmRate}/km. GoMyTruck charges a flat 5% platform commission with zero hidden broker markups. Itemized fares are shown before trip confirmation.`
    },
    {
      question: `What is the payload and cargo capacity of a ${vehicle.shortName}?`,
      answer: `The ${vehicle.name} has an official payload capacity of ${vehicle.capacityKg} kg (${vehicle.capacityTons} Ton) with cargo deck dimensions of ${vehicle.lengthFt}ft length × ${vehicle.widthFt}ft width × ${vehicle.heightFt}ft height (${vehicle.volumeCuFt} cu. ft. volume). It is ideal for ${vehicle.popularFor}.`
    },
    {
      question: `Can I get direct phone numbers of ${vehicle.shortName} drivers in ${cityName} without brokers?`,
      answer: `Yes. GoMyTruck offers Direct Driver Connect. For a flat one-time fee of ₹99, you can instantly unlock 10 verified ${vehicle.shortName} drivers and vehicle owners in ${cityName} to negotiate trip rates directly with zero middleman commissions.`
    },
    {
      question: `How do commercial ${vehicle.shortName} owners attach their vehicle in ${cityName}?`,
      answer: `Commercial truck drivers and fleet partners in ${cityName} can attach their ${vehicle.name} via GoMyTruck Partner for a ₹99 90-day subscription. Partners receive direct shipper booking alerts, verified leads, and 0% commission on direct trips.`
    },
    ...baseFaqs.slice(0, 2)
  ];

  // Structured Data Schemas
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
        { "@type": "ListItem", "position": 2, "name": cityName, "item": `https://gomytruck.com/${city}` },
        { "@type": "ListItem", "position": 3, "name": `${vehicle.shortName} Booking`, "item": `https://gomytruck.com${canonicalPath}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "TransportationService",
      "name": `${vehicle.name} Rental & Transport in ${cityName}`,
      "image": `https://gomytruck.com${vehicle.image}`,
      "telephone": "+91-9331488999",
      "areaServed": {
        "@type": "City",
        "name": cityName,
        "addressRegion": state,
        "addressCountry": "IN"
      },
      "url": `https://gomytruck.com${canonicalPath}`,
      "offers": {
        "@type": "Offer",
        "price": vehicle.baseFare.toString(),
        "priceCurrency": "INR",
        "description": `Base fare for ${vehicle.name} booking in ${cityName}`
      }
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
        title={`${vehicle.name} Booking in ${cityName} | Rent & Transport | GoMyTruck`}
        description={`Rent ${vehicle.name} in ${cityName}, ${state}. ${vehicle.capacityKg} kg payload, ${vehicle.lengthFt}ft cargo deck. Transparent per-km rates, verified drivers, and zero broker markups.`}
        canonical={canonicalPath}
        keywords={`${vehicle.shortName} in ${cityName}, hire ${vehicle.slug} ${cityName}, ${vehicle.name} transport ${cityName}, ${cityName} truck booking`}
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-32 pb-20 mt-[68px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/${city}`} className="hover:text-brand-400 transition-colors">{cityName}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{vehicle.shortName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/40 text-brand-300 text-xs font-bold tracking-wider uppercase mb-4">
                <img src="/google-maps-icon.webp" alt="Location" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0" /> {cityName}, {state} · Verified Fleet
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {vehicle.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">in {cityName}</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
                On-demand {vehicle.shortName} hire and goods transport across {cityName} and nearby industrial hubs. Upfront digital rates starting at ₹{vehicle.baseFare}, verified drivers, and zero broker markups.
              </p>

              {/* Quick Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Weight size={13} className="text-brand-400" /> Max Payload
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white">{vehicle.capacityKg} kg ({vehicle.capacityTons}T)</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Ruler size={13} className="text-brand-400" /> Deck Size
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white">{vehicle.lengthFt} × {vehicle.widthFt} ft</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <IndianRupee size={13} className="text-brand-400" /> Base Fare
                  </div>
                  <div className="text-sm sm:text-base font-bold text-emerald-400">₹{vehicle.baseFare}</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Clock size={13} className="text-brand-400" /> Per Km Rate
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white">~₹{vehicle.perKmRate}/km</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-truck-online"
                  state={{ selectedCity: cityName, vehicleType: vehicle.slug }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  Book {vehicle.shortName} Now <ArrowRight size={18} />
                </Link>

                <Link
                  to="/direct-driver-contact"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <Zap size={17} className="fill-slate-900" /> Get 10 Driver Numbers · ₹99
                </Link>
              </div>
            </div>

            {/* Right: Vehicle Card Preview */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center mb-5 border border-slate-700/60">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.name} available in ${cityName}`}
                    className="max-h-full max-w-full object-contain p-4 transition-transform hover:scale-105 duration-300"
                    loading="eager"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Active in {cityName}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-slate-200 font-semibold">{vehicle.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Body Type:</span>
                    <span className="text-slate-200 font-semibold">{vehicle.bodyType}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Cargo Volume:</span>
                    <span className="text-slate-200 font-semibold">~{vehicle.volumeCuFt} cu. ft.</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Platform Commission:</span>
                    <span className="text-emerald-400 font-bold">Flat 5% (Zero Broker Cut)</span>
                  </div>
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

      {/* GEO & AI Overview Fast Facts Box */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-brand-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 text-brand-700 text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles size={16} /> Quick Fast-Facts · {vehicle.shortName} in {cityName}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
              Key Specifications for {vehicle.name} Transport in {cityName}
            </h2>
            <p className="text-slate-700 text-base leading-relaxed mb-6">
              {vehicle.geoAnswer} In {cityName}, GoMyTruck provides verified {vehicle.shortName} vehicles for local market shifting, warehouse goods distribution, and regional industrial trips.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" /> Best Suited Goods
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {vehicle.popularFor}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-600" /> Verification Standards
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Commercial vehicle registration (RC), valid fitness certificate, national goods permit, and driver background verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Supply Monitization Section: Attach Truck for ₹99 */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-8 sm:p-10 relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  <Truck size={13} /> Driver &amp; Fleet Partner Funnel
                </div>
                <h2 className="text-2xl sm:text-3xl font-black mb-2">
                  Own a {vehicle.name} in {cityName}?
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Attach your vehicle with GoMyTruck for a flat <strong>₹99 90-day subscription</strong>. Receive direct trip inquiries from shippers across {cityName}, with 0% brokerage on direct deals.
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-center gap-2">
                <Link
                  to="/fleet-partner-registration"
                  className="bg-brand-500 hover:bg-brand-400 text-slate-950 font-black px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95 text-center whitespace-nowrap"
                >
                  Attach Your Truck · ₹99
                </Link>
                <span className="text-xs text-slate-400">90-Day Validity · Direct Shipper Calls</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Vehicles in City */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Other Commercial Vehicles in <span className="text-brand-600">{cityName}</span>
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Compare payload capacities and per-km rates across our verified transport fleet in {cityName}.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ALL_SEO_VEHICLES.filter((v) => v.slug !== vehicle.slug).map((v) => (
              <Link
                key={v.slug}
                to={`/${city}/truck-booking/${v.slug}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-brand-400 hover:shadow-md transition-all group"
              >
                <div className="aspect-video bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-2">
                  <img src={v.image} alt={v.name} className="max-h-full object-contain group-hover:scale-105 transition-transform" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">{v.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{v.capacityKg} kg ({v.capacityTons}T) capacity</p>
                <div className="text-xs font-bold text-brand-600 mt-2 flex items-center gap-1">
                  Book in {cityName} <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Specific FAQs */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle size={14} /> FAQs
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Frequently Asked Questions: {vehicle.shortName} in {cityName}
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
