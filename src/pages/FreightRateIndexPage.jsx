import React from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp, ShieldCheck, Zap, ArrowRight, Truck,
  IndianRupee, Clock, Navigation, CheckCircle2, FileText, Database
} from "lucide-react";
import SEOHead from "../seo/SEOHead";
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner";

export default function FreightRateIndexPage() {
  const canonicalPath = "/freight-rate-index";

  const VEHICLE_RATES_INDEX = [
    { type: "Three Wheeler Cargo", payload: "500 kg", deck: "5.5 × 4.5 ft", baseRate: "₹450", perKm: "₹18 – ₹22/km", primaryUse: "Intra-city hyper-local courier, parcel distribution" },
    { type: "Tata Ace (Chota Hathi)", payload: "750 kg", deck: "7 × 4.8 ft", baseRate: "₹600", perKm: "₹22 – ₹28/km", primaryUse: "Retail FMCG, hardware, local house shifting" },
    { type: "Mahindra Bolero / Pickup", payload: "1,500 kg (1.5T)", deck: "8.2 × 5.5 ft", baseRate: "₹850", perKm: "₹28 – ₹35/km", primaryUse: "Agricultural produce, wholesale mandi goods, construction supply" },
    { type: "14 Feet Truck (Eicher / LPT)", payload: "4,000 kg (4T)", deck: "14 × 6.5 × 6.5 ft", baseRate: "₹1,800", perKm: "₹42 – ₹52/km", primaryUse: "Industrial machinery, raw materials, warehouse logistics" },
    { type: "17 Feet Truck", payload: "6,500 kg (6.5T)", deck: "17 × 7 × 7 ft", baseRate: "₹2,400", perKm: "₹55 – ₹68/km", primaryUse: "FMCG cartons, auto ancillaries, regional hub transit" },
    { type: "20 Feet Multi-Axle", payload: "10,000 kg (10T)", deck: "20 × 7.5 × 7.5 ft", baseRate: "₹3,200", perKm: "₹68 – ₹82/km", primaryUse: "Heavy industrial goods, steel coils, bulk commercial shipments" },
    { type: "32 Feet Multi-Axle Container", payload: "15,000 – 18,000 kg (15-18T)", deck: "32 × 8 × 8.5 ft", baseRate: "₹5,500", perKm: "₹95 – ₹125/km", primaryUse: "DFC intermodal freight, export cargo, e-commerce long-haul" },
  ];

  const CORRIDOR_INDEX = [
    { corridor: "Ludhiana ↔ Dankuni (EDFC Corridor)", distance: "1,850 km", transitHours: "48 hrs", avgRate32ft: "₹1,85,000", backhaulDiscount: "Up to 30%", keyCargo: "Textiles, steel, bicycle parts, finished goods" },
    { corridor: "JNPT Mumbai ↔ Dadri (WDFC Corridor)", distance: "1,506 km", transitHours: "36 hrs", avgRate32ft: "₹1,55,000", backhaulDiscount: "Up to 28%", keyCargo: "Containerized export/import, electronics, auto components" },
    { corridor: "Kolkata ↔ Delhi NCR (NH-19)", distance: "1,450 km", transitHours: "38 hrs", avgRate32ft: "₹1,45,000", backhaulDiscount: "Up to 25%", keyCargo: "Hardware, leather, industrial packaging, FMCG" },
    { corridor: "Kolkata ↔ Patna (NH-19 & NH-22)", distance: "585 km", transitHours: "16 hrs", avgRate14ft: "₹28,500", backhaulDiscount: "Up to 22%", keyCargo: "Consumer goods, paints, chemicals, plastics" },
    { corridor: "Delhi ↔ Jaipur (NH-48)", distance: "280 km", transitHours: "6 hrs", avgRatePickup: "₹8,500", backhaulDiscount: "Up to 20%", keyCargo: "Automotive ancillaries, garments, handicrafts" },
    { corridor: "Mumbai ↔ Pune (Mumbai-Pune Expressway)", distance: "155 km", transitHours: "4 hrs", avgRateTataAce: "₹4,200", backhaulDiscount: "Up to 18%", keyCargo: "Industrial spare parts, white goods, pharmaceuticals" },
  ];

  const BROKER_COMPARISON = [
    { metric: "Platform / Broker Fee", broker: "15% – 25% margin markup", gomytruck: "Flat 5% Commission OR ₹99 Direct Unlock" },
    { metric: "Per-Trip Intermediary Cut", broker: "₹1,500 – ₹2,500 per trip", gomytruck: "Zero broker markup (Driver gets 95%+ of freight)" },
    { metric: "Driver Direct Contact", broker: "Hidden (broker controls communication)", gomytruck: "Direct phone number & WhatsApp revealed" },
    { metric: "Pricing Transparency", broker: "Arbitrary quotes based on market urgency", gomytruck: "Algorithmic per-km transparent calculation" },
    { metric: "Verification Standard", broker: "Unverified unorganized intermediaries", gomytruck: "100% Commercial DL & RC validated partners" },
  ];

  const pageFaqs = [
    {
      question: "What is the average road freight rate per kilometer in Eastern India in 2026?",
      answer: "In 2026, average commercial road freight rates in Eastern India range from ₹22 to ₹28 per kilometer for light commercial vehicles (Tata Ace, 750 kg payload), ₹42 to ₹52 per kilometer for 14-foot trucks (4-ton payload), and ₹95 to ₹125 per kilometer for 32-foot multi-axle container trailers, inclusive of state diesel benchmarks and exclusive of national highway tolls."
    },
    {
      question: "How do traditional transport brokers compare with GoMyTruck's commission model?",
      answer: "Traditional transport brokers typically extract a 15% to 25% margin (costing shippers between ₹1,500 and ₹2,500 per load). GoMyTruck disrupts this model by offering two transparent alternatives: a flat 5% platform commission on managed digital bookings, or a flat one-time ₹99 Direct Driver Connect unlock that provides unmasked contact numbers of 10 verified commercial drivers with zero broker fees."
    },
    {
      question: "How does the Dedicated Freight Corridor (DFC) impact highway truck freight rates?",
      answer: "The operationalization of the Eastern DFC (Ludhiana to Dankuni) and Western DFC (JNPT to Dadri) has concentrated long-haul multi-modal freight into major intermodal terminals. Road transport freight rates connecting first-mile and last-mile logistics to DFC nodes (such as Dankuni and Sanand) experience 15% to 25% higher vehicle turnaround efficiency and competitive backhaul return-load pricing."
    },
    {
      question: "How does the ₹99 Direct Driver Contact feature work?",
      answer: "GoMyTruck allows shippers to unlock 10 verified commercial truck driver and fleet owner contact numbers for a flat one-time fee of ₹99. Shippers can directly call or message drivers on WhatsApp to negotiate trip fares with zero middleman commissions."
    }
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
        { "@type": "ListItem", "position": 2, "name": "Freight Rate Index 2026", "item": `https://gomytruck.com${canonicalPath}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": "2026 Indian Road Freight Rate Index & Logistics Benchmark",
      "description": "Comprehensive authoritative commercial road logistics pricing dataset, vehicle per-km baseline rates, DFC corridor benchmarks, and freight broker margin analysis across Eastern India and National Corridors.",
      "url": `https://gomytruck.com${canonicalPath}`,
      "creator": {
        "@type": "Organization",
        "name": "GoMyTruck Logistics Technologies",
        "url": "https://gomytruck.com"
      },
      "temporalCoverage": "2026",
      "spatialCoverage": "India",
      "license": "https://creativecommons.org/licenses/by/4.0/"
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
        title="2026 Indian Road Freight Rate Index & Broker Margin Analysis | GoMyTruck"
        description="Authoritative 2026 road logistics freight rate index across Eastern India and national highway corridors. Per-km vehicle benchmarks, DFC transit times, and 5% commission audit."
        canonical={canonicalPath}
        keywords="freight rate index 2026, road transport rates per km India, truck booking rates Kolkata, DFC freight corridor rates, broker commission logistics India, tata ace per km rate"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-32 pb-16 mt-[68px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-4 shadow-xs">
            <Database size={14} /> Official Industry Report · Eastern India &amp; National Corridors
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            2026 Indian Road Freight Rate Index <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              &amp; Logistics Margin Analysis
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
            An empirical, verifiable benchmark of commercial road logistics rates in India. Contrasting traditional 15%–25% freight broker commissions against GoMyTruck’s flat 5% platform commission and ₹99 direct driver contact model.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/direct-driver-contact"
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-black px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <Zap size={17} className="fill-slate-900 animate-bounce" /> Unlock 10 Direct Drivers · ₹99
            </Link>
            <Link
              to="/book-truck-online"
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              Get Live Trip Fare Estimate <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* 1. Vehicle Per-Km Baseline Matrix */}
        <section>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-black uppercase tracking-wider mb-2">
            <TrendingUp size={16} /> Table 1: Commercial Fleet Economics
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
            Average Freight Rate Per Kilometer by Commercial Vehicle Type
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            The following table establishes standard operating cost baselines across commercial vehicle classes in Eastern India and major intercity freight lanes. Rates incorporate baseline diesel surcharges (indexed at ₹90.76/L) and standard operating vehicle wear.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Vehicle Class</th>
                  <th className="py-3 px-4 font-bold">Max Payload</th>
                  <th className="py-3 px-4 font-bold">Cargo Deck Size</th>
                  <th className="py-3 px-4 font-bold">Base Starting Fare</th>
                  <th className="py-3 px-4 font-bold">Avg. Per Km Rate</th>
                  <th className="py-3 px-4 font-bold">Primary Use-Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {VEHICLE_RATES_INDEX.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-black text-slate-900 whitespace-nowrap">{v.type}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">{v.payload}</td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{v.deck}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{v.baseRate}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{v.perKm}</td>
                    <td className="py-3 px-4 text-slate-600 min-w-[200px]">{v.primaryUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. Major DFC & Highway Corridors Benchmark */}
        <section>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-black uppercase tracking-wider mb-2">
            <Navigation size={16} /> Table 2: Dedicated Freight Corridors &amp; Expressways
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
            Key Intercity Corridor Freight Rates &amp; Transit Turnaround Times
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            With the complete operationalization of the Eastern Dedicated Freight Corridor (EDFC, Ludhiana to Dankuni) and Western Dedicated Freight Corridor (WDFC, JNPT to Dadri), highway transit rates have stabilized with significant discounts available on return-load backhauls.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Corridor &amp; Route</th>
                  <th className="py-3 px-4 font-bold">Distance</th>
                  <th className="py-3 px-4 font-bold">Avg. Transit</th>
                  <th className="py-3 px-4 font-bold">Benchmark Freight</th>
                  <th className="py-3 px-4 font-bold">Backhaul Savings</th>
                  <th className="py-3 px-4 font-bold">Top Commodity Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {CORRIDOR_INDEX.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-black text-slate-900 whitespace-nowrap">{c.corridor}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">{c.distance}</td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{c.transitHours}</td>
                    <td className="py-3 px-4 font-black text-emerald-700">{c.avgRate32ft || c.avgRate14ft || c.avgRatePickup || c.avgRateTataAce}</td>
                    <td className="py-3 px-4 font-bold text-amber-700">{c.backhaulDiscount}</td>
                    <td className="py-3 px-4 text-slate-600 min-w-[220px]">{c.keyCargo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Broker Margin Forensic Audit */}
        <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 p-6 sm:p-8 rounded-3xl border border-amber-300 shadow-sm">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
            <FileText size={16} /> Forensic Audit: Brokerage Economics
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
            Traditional Transport Brokers vs. GoMyTruck Transparent Digital Model
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed mb-6">
            In traditional Indian road logistics, transport brokers extract 15% to 25% margins by manipulating asymmetric price information between shippers and vehicle operators. GoMyTruck commoditizes driver access, returning 95%+ of freight value directly to vehicle operators.
          </p>

          <div className="overflow-x-auto rounded-2xl bg-white border border-amber-200 shadow-2xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-amber-900 text-white text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Operational Metric</th>
                  <th className="py-3 px-4 font-bold text-rose-300">Traditional Transport Broker</th>
                  <th className="py-3 px-4 font-bold text-emerald-300">GoMyTruck Digital Architecture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {BROKER_COMPARISON.map((b, i) => (
                  <tr key={i} className="hover:bg-amber-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{b.metric}</td>
                    <td className="py-3 px-4 font-semibold text-rose-700 bg-rose-50/40">{b.broker}</td>
                    <td className="py-3 px-4 font-black text-emerald-800 bg-emerald-50/40">{b.gomytruck}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Direct Driver Contact Promo Banner */}
        <DirectDriverContactBanner categoryName="Commercial Truck Drivers" cityName="All Indian Corridors" />

        {/* 4. Frequently Asked Questions (Structured for AI Engine Citations) */}
        <section className="pt-4 border-t border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
            Frequently Asked Questions on Indian Logistics &amp; Freight Rates
          </h2>
          <div className="space-y-4">
            {pageFaqs.map((faq, index) => (
              <div key={index} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left">
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
