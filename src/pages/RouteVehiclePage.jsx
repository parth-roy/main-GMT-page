import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { 
  Truck, ArrowRight, ShieldCheck, CheckCircle, 
  HelpCircle, ChevronDown, ChevronUp, Zap, Sparkles, 
  Clock, Navigation, IndianRupee, Layers 
} from "lucide-react";
import SEOHead from "../seo/SEOHead";
import TrustBadgeRow from "../components/TrustBadgeRow";
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner";
import { getCorridorBySlug } from "../lib/corridors";
import { getVehicleBySlug, ALL_SEO_VEHICLES } from "../lib/vehicles";
import { getCargoTypeBySlug } from "../lib/cargoTypes";

export default function RouteVehiclePage() {
  const { route, vehicle: vehicleParam, cargo: cargoParam } = useParams();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route, vehicleParam, cargoParam]);

  const corridor = getCorridorBySlug(route);
  let vehicle = getVehicleBySlug(vehicleParam);
  let cargo = cargoParam ? getCargoTypeBySlug(cargoParam) : null;

  // If vehicleParam was actually a cargo slug (e.g. /transport/kolkata-to-delhi/textile-garments)
  if (!vehicle && !cargo) {
    cargo = getCargoTypeBySlug(vehicleParam);
  }

  // Fallback vehicle for cargo-only route pages
  if (!vehicle && cargo) {
    vehicle = ALL_SEO_VEHICLES[4]; // 14ft Truck baseline
  }

  // Fallback vehicle for industrial route corridors without vehicle specified
  if (!vehicle && !cargo) {
    vehicle = ALL_SEO_VEHICLES[4]; // 14ft Truck default for industrial corridors
  }

  if (!corridor || !vehicle) {
    return <Navigate to="/not-found" replace />;
  }

  const { originName, destName, distanceKm, transitHours, highway, estimatedTolls, popularCargo } = corridor;
  const canonicalPath = location.pathname;
  const isIndustrial = location.pathname.startsWith('/industrial');

  // Freight calculation modeling
  const estimatedFreight = Math.round(distanceKm * vehicle.perKmRate + estimatedTolls);
  const backhaulFreight = Math.round(estimatedFreight * 0.70); // 30% discount on return loads

  const pageTitle = cargoParam && cargo
    ? `${originName} to ${destName} ${vehicle.shortName} ${cargo.shortName} Transport | GoMyTruck`
    : (!getVehicleBySlug(vehicleParam) && cargo
      ? `${originName} to ${destName} ${cargo.name} | Commercial Freight | GoMyTruck`
      : (isIndustrial
        ? `${originName} to ${destName} Industrial Freight & Commercial Transport | GoMyTruck`
        : `${originName} to ${destName} ${vehicle.name} Transport | Freight & Booking | GoMyTruck`));

  const pageHeadline = cargoParam && cargo
    ? `${vehicle.shortName} ${cargo.shortName} Transport`
    : (!getVehicleBySlug(vehicleParam) && cargo
      ? `${cargo.name} Transport`
      : (isIndustrial
        ? `Industrial Freight & Cargo Transport`
        : `${vehicle.shortName} Transport`));

  const pageDesc = cargo
    ? `Book ${vehicle.name} for ${cargo.name} from ${originName} to ${destName}. ${distanceKm} km via ${highway}. Verified commercial carriers, upfront per-km rates, and zero broker markups.`
    : `Hire ${vehicle.name} from ${originName} to ${destName}. ${distanceKm} km route via ${highway}. Payload ${vehicle.capacityKg} kg. Verified drivers, upfront rates, and zero broker markups.`;

  const pageFaqs = [
    {
      question: `How much does a ${vehicle.name} cost from ${originName} to ${destName}?`,
      answer: `Estimated freight for a ${vehicle.name} from ${originName} to ${destName} (${distanceKm} km) is approximately ₹${estimatedFreight.toLocaleString("en-IN")}, including highway tolls (~₹${estimatedTolls}). GoMyTruck operates on a flat 5% platform commission with zero broker markups.`
    },
    {
      question: `What is the transit time from ${originName} to ${destName} for commercial trucks?`,
      answer: `The average commercial transit time between ${originName} and ${destName} is approximately ${transitHours} hours via ${highway}, depending on checkpost clearance, loading turnaround, and commercial vehicle speed limits.`
    },
    {
      question: `Can I book return loads (backhaul) on ${originName} to ${destName}?`,
      answer: `Yes. GoMyTruck matches shippers with trucks returning to ${destName} after completing outbound trips. Shippers save up to 30% on backhaul return loads (approx ₹${backhaulFreight.toLocaleString("en-IN")}), while vehicle drivers eliminate empty return trips.`
    },
    {
      question: `How do I get direct phone numbers of drivers operating ${originName} to ${destName}?`,
      answer: `Through GoMyTruck Direct Driver Connect, you can unlock the verified contact numbers of 10 commercial drivers and fleet owners active on the ${originName} to ${destName} corridor for a flat one-time fee of ₹99.`
    },
    {
      question: `What paperwork is required for commercial transport from ${originName} to ${destName}?`,
      answer: `Interstate transport requires a valid GST E-Way Bill for consignments valued over ₹50,000, Commercial Vehicle RC, National Goods Permit, Insurance, and PUC certificate. GoMyTruck verified partners carry fully validated commercial documentation.`
    }
  ];

  const isDfcCorridor = useMemo(() => {
    const dfcSlugs = ['dankuni', 'kolkata', 'asansol', 'ludhiana', 'kanpur', 'varanasi', 'mumbai', 'jnpt', 'sanand', 'ahmedabad', 'vadodara', 'surat', 'new-delhi', 'dadri', 'rewari', 'gurugram'];
    return dfcSlugs.includes(corridor?.originSlug) || dfcSlugs.includes(corridor?.destSlug);
  }, [corridor]);

  const isThinRoute = !corridor.highway || distanceKm < 15;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
        { "@type": "ListItem", "position": 2, "name": "Intercity Transport", "item": "https://gomytruck.com/intercity-transport" },
        { "@type": "ListItem", "position": 3, "name": `${originName} to ${destName}`, "item": `https://gomytruck.com/routes/${corridor.slug}` },
        { "@type": "ListItem", "position": 4, "name": vehicle.shortName, "item": `https://gomytruck.com${canonicalPath}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "TransportationService",
      "name": `${originName} to ${destName} ${vehicle.name} Transport`,
      "image": `https://gomytruck.com${vehicle.image}`,
      "telephone": "+91-9331488999",
      "serviceType": "Intercity Commercial Freight",
      "areaServed": [
        { "@type": "City", "name": originName },
        { "@type": "City", "name": destName }
      ],
      "url": `https://gomytruck.com${canonicalPath}`,
      "offers": {
        "@type": "Offer",
        "price": estimatedFreight.toString(),
        "priceCurrency": "INR",
        "description": `Estimated freight for ${vehicle.name} on ${originName} to ${destName} corridor`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `10 Direct Driver Numbers for ${originName} to ${destName} (${vehicle.name})`,
      "description": `Direct mobile numbers of 10 verified commercial drivers active on the ${originName} to ${destName} highway corridor. Flat ₹99 fee with zero broker margin.`,
      "image": `https://gomytruck.com${vehicle.image}`,
      "offers": {
        "@type": "Offer",
        "price": "99",
        "priceCurrency": "INR",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "url": `https://gomytruck.com/direct-driver-contact?city=${corridor.originSlug}&vehicle=${vehicle.slug}`
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
        title={pageTitle}
        description={pageDesc}
        canonical={canonicalPath}
        keywords={`${originName} to ${destName} truck, ${vehicle.shortName} ${originName} ${destName}, freight rate ${originName} to ${destName}, book ${vehicle.slug} intercity`}
        jsonLd={jsonLd}
        noindex={isThinRoute}
      />

      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-32 pb-20 mt-[68px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/intercity-transport" className="hover:text-brand-400 transition-colors">Intercity</Link>
            <span>/</span>
            <span className="text-white font-semibold">{originName} → {destName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wider uppercase">
                  <Navigation size={13} /> {highway} · Route Corridor
                </div>
                {isDfcCorridor && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-extrabold tracking-wider uppercase">
                    <Sparkles size={13} className="text-blue-400" /> Dedicated Freight Corridor (DFC) Node
                  </div>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {originName} <span className="text-brand-400">to</span> {destName}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">
                  {pageHeadline}
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
                Direct intercity commercial freight service. Book full truck load (FTL) {vehicle.name} with live GPS trip tracking, verified highway drivers, and guaranteed dispatch SLAs.
              </p>

              {/* Route Corridor Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Navigation size={13} className="text-emerald-400" /> Total Distance
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">{distanceKm} km</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Clock size={13} className="text-emerald-400" /> Transit Time
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">~{transitHours} Hours</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Layers size={13} className="text-emerald-400" /> Est. Tolls
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">₹{estimatedTolls}</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <IndianRupee size={13} className="text-emerald-400" /> Est. Freight
                  </div>
                  <div className="text-base sm:text-lg font-bold text-emerald-400">₹{estimatedFreight.toLocaleString("en-IN")}</div>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-truck-online"
                  state={{ pickup: originName, drop: destName, vehicleType: vehicle.slug }}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  Book {vehicle.shortName} on This Route <ArrowRight size={18} />
                </Link>

                <Link
                  to="/direct-driver-contact"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <Zap size={17} className="fill-slate-900 animate-bounce" /> Call 10 Verified {vehicle.shortName} · ₹99 (Save ₹1,500+)
                </Link>
              </div>
            </div>

            {/* Right: Route Estimate Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-4">
                  <div>
                    <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Route Fare Estimate</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{originName} → {destName}</h3>
                  </div>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full font-medium">{vehicle.shortName}</span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Base Fare + Distance ({distanceKm} km):</span>
                    <span className="font-semibold text-white">₹{(distanceKm * vehicle.perKmRate).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>National Highway Tolls ({highway}):</span>
                    <span className="font-semibold text-white">₹{estimatedTolls}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Platform Fee (Flat 5%):</span>
                    <span className="text-emerald-400 font-semibold">Included (No broker cut)</span>
                  </div>
                  <div className="pt-3 border-t border-slate-700 flex justify-between items-center text-base">
                    <span className="font-bold text-white">Estimated Total:</span>
                    <span className="font-black text-xl text-emerald-400">₹{estimatedFreight.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Backhaul Return Load Alert */}
                <div className="mt-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs leading-relaxed">
                  <span className="font-bold text-amber-400">⚡ Save up to 30% on Return Loads:</span> Trucks returning from {destName} to {originName} are available from <strong>₹{backhaulFreight.toLocaleString("en-IN")}</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto -mt-6 relative z-20">
        <TrustBadgeRow city={originName} />
      </section>

      {/* Two-Sided Direct Driver Contact Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <DirectDriverContactBanner categoryName={`${vehicle.shortName} Drivers`} cityName={`${originName} to ${destName}`} />
      </section>

      {/* GEO Citable Fact Box */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-brand-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 text-brand-700 text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles size={16} /> Highway Corridor Intelligence · {originName} to {destName}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
              Commercial Transport Guide: {originName} → {destName}
            </h2>
            <p className="text-slate-700 text-base leading-relaxed mb-6">
              The {originName} to {destName} corridor spans approximately {distanceKm} km along {highway}. Average transit time is {transitHours} hours for commercial goods trucks. Commonly transported freight includes {popularCargo}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <CheckCircle size={15} className="text-emerald-600" /> Vehicle Specs
                </h3>
                <p className="text-xs text-slate-600">
                  {vehicle.name} carries up to {vehicle.capacityKg} kg ({vehicle.capacityTons}T) with {vehicle.volumeCuFt} cu ft deck.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <ShieldCheck size={15} className="text-brand-600" /> Compliance
                </h3>
                <p className="text-xs text-slate-600">
                  Interstate GST E-Way Bill required for invoice values above ₹50,000. Fastag auto-tolling verified.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Navigation size={15} className="text-amber-600" /> Return Load
                </h3>
                <p className="text-xs text-slate-600">
                  Backhaul vehicles available on {destName} → {originName} at 25-30% lower freight rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Side CTA: Run this route? Attach for ₹99 */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-8 sm:p-10 relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                  <Truck size={13} /> Driver &amp; Transporter Supply
                </div>
                <h2 className="text-2xl sm:text-3xl font-black mb-2">
                  Do you operate on {originName} ↔ {destName}?
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Attach your {vehicle.name} with GoMyTruck for a flat <strong>₹99 90-day subscription</strong>. Get verified return-load alerts and direct shipper consignments with zero brokerage cuts.
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-center gap-2">
                <Link
                  to="/fleet-partner-registration"
                  className="bg-brand-500 hover:bg-brand-400 text-slate-950 font-black px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95 text-center whitespace-nowrap"
                >
                  Attach Truck on Route · ₹99
                </Link>
                <span className="text-xs text-slate-400">90-Day Validity · Direct Highway Loads</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Vehicles for this Route */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Other Trucks for <span className="text-brand-600">{originName} to {destName}</span>
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Select alternative commercial vehicles for different payload weights and cargo volumes on this route.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ALL_SEO_VEHICLES.filter((v) => v.slug !== vehicle.slug).map((v) => (
              <Link
                key={v.slug}
                to={`/transport/${corridor.slug}/${v.slug}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-brand-400 hover:shadow-md transition-all group"
              >
                <div className="aspect-video bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-2">
                  <img src={v.image} alt={v.name} className="max-h-full object-contain group-hover:scale-105 transition-transform" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">{v.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{v.capacityKg} kg ({v.capacityTons}T) capacity</p>
                <div className="text-xs font-bold text-brand-600 mt-2 flex items-center gap-1">
                  View Route Rate <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Corridor FAQs */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle size={14} /> Corridor FAQs
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Frequently Asked Questions: {originName} to {destName}
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
