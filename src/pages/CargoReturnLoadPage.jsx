import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { 
  Truck, MapPin, ArrowRight, ShieldCheck, CheckCircle, 
  HelpCircle, ChevronDown, ChevronUp, Zap, Sparkles, 
  Package, Tag, IndianRupee, RefreshCw 
} from "lucide-react";
import SEOHead from "../seo/SEOHead";
import TrustBadgeRow from "../components/TrustBadgeRow";
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner";
import { SEO_CITIES } from "../lib/cities";
import { getCorridorBySlug } from "../lib/corridors";
import { getCargoTypeBySlug, ALL_CARGO_TYPES } from "../lib/cargoTypes";
import { getVehicleBySlug } from "../lib/vehicles";

export default function CargoReturnLoadPage({ mode = "return-load" }) {
  const { route, city, cargoType } = useParams();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route, city, cargoType]);

  // Mode 1: Return Loads / Backhaul
  if (mode === "return-load") {
    const corridor = getCorridorBySlug(route);
    if (!corridor) return <Navigate to="/not-found" replace />;

    const { originName, destName, distanceKm, highway, estimatedTolls } = corridor;
    const canonicalPath = location.pathname;
    const standardFreight = Math.round(distanceKm * 32 + estimatedTolls);
    const returnFreight = Math.round(standardFreight * 0.70); // 30% discount

    const pageFaqs = [
      {
        question: `How do return loads (backhauls) work from ${originName} to ${destName}?`,
        answer: `When commercial trucks deliver goods to ${originName} from ${destName}, they often have to drive back empty. GoMyTruck connects these returning trucks with shippers needing freight transport to ${destName}, offering 25% to 35% lower freight rates compared to standard one-way bookings.`
      },
      {
        question: `How much do shippers save on ${originName} to ${destName} return trucks?`,
        answer: `Shippers save approximately 30% on transport costs. While a standard medium truck on ${originName} to ${destName} costs around ₹${standardFreight.toLocaleString("en-IN")}, a verified return load vehicle is available from approximately ₹${returnFreight.toLocaleString("en-IN")}.`
      },
      {
        question: `How can drivers find return loads from ${originName} to ${destName}?`,
        answer: `Commercial truck owners can list their return availability on GoMyTruck for a flat ₹99 90-day subscription. Shippers search for backhaul trucks and contact you directly with zero broker deductions.`
      }
    ];

    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "TransportationService",
        "name": `Return Loads & Backhaul Trucks: ${originName} to ${destName}`,
        "description": `Discounted return truck transport from ${originName} to ${destName}. Save up to 30% on empty returning freight carriers.`,
        "areaServed": [{ "@type": "City", "name": originName }, { "@type": "City", "name": destName }],
        "url": `https://gomytruck.com${canonicalPath}`
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
          title={`Return Loads ${originName} to ${destName} | Save 30% on Backhaul Freight | GoMyTruck`}
          description={`Find return loads and empty backhaul trucks from ${originName} to ${destName}. Save up to 30% on freight costs. Direct driver contact with zero broker margin.`}
          canonical={canonicalPath}
          keywords={`return loads ${originName} to ${destName}, backhaul trucks ${originName} ${destName}, cheap truck transport ${originName} to ${destName}, empty return truck hire`}
          jsonLd={jsonLd}
        />

        {/* Hero Section */}
        <section className="relative bg-slate-900 pt-32 pb-20 mt-[68px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/70 opacity-95" />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-400">
              <Link to="/" className="hover:text-brand-400">Home</Link>
              <span>/</span>
              <Link to="/intercity-transport" className="hover:text-brand-400">Intercity</Link>
              <span>/</span>
              <span className="text-white font-semibold">Return Loads: {originName} → {destName}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <RefreshCw size={13} className="animate-spin-slow" /> Backhaul Freight Optimization
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                  Return Loads <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">{originName} to {destName}</span>
                </h1>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
                  Save 25% to 35% on intercity freight. Book empty commercial trucks returning along {highway} ({distanceKm} km) with verified transport operators.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                    <div className="text-xs text-slate-400">Standard Freight</div>
                    <div className="text-base font-bold text-slate-300 line-through">₹{standardFreight.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                    <div className="text-xs text-emerald-400 font-bold">Backhaul Freight</div>
                    <div className="text-lg font-black text-emerald-400">₹{returnFreight.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                    <div className="text-xs text-slate-400">Average Savings</div>
                    <div className="text-base font-bold text-amber-400">Up to 30% OFF</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/book-truck-online"
                    state={{ pickup: originName, drop: destName, isReturnLoad: true }}
                    className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    Book Return Truck Now <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/direct-driver-contact"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Zap size={17} className="fill-slate-900" /> Unlock Return Drivers · ₹99
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400" size={18} /> Why Book Return Loads?
                  </h3>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-brand-400 shrink-0 mt-0.5" />
                      <span><strong>Massive Cost Savings:</strong> Pay near-diesel cost rather than full round-trip freight.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-brand-400 shrink-0 mt-0.5" />
                      <span><strong>Immediate Turnaround:</strong> Returning trucks want immediate cargo to start their trip.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-brand-400 shrink-0 mt-0.5" />
                      <span><strong>Verified Drivers:</strong> Full commercial DL, RC, insurance, and FASTag verified.</span>
                    </li>
                  </ul>
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
          <DirectDriverContactBanner categoryName={`Return Load Drivers`} cityName={`${originName} to ${destName}`} />
        </section>

        {/* Driver Attachment Callout */}
        <section className="py-12 bg-slate-50 border-t border-slate-200 mt-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Driving an Empty Truck from {originName} to {destName}?
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto mb-6">
              Don't burn diesel driving empty. Attach your truck with GoMyTruck for a flat ₹99 90-day pass and receive return load notifications.
            </p>
            <Link
              to="/fleet-partner-registration"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition-all"
            >
              List Your Empty Truck · ₹99 <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Mode 2: Dedicated Cargo Transport
  const cityConfig = SEO_CITIES.find((c) => c.slug === city) || (city ? {
    name: city.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    slug: city,
    state: "India"
  } : null);
  const cargo = getCargoTypeBySlug(cargoType);

  if (!cityConfig || !cargo) {
    return <Navigate to="/not-found" replace />;
  }

  const { name: cityName, state } = cityConfig;
  const canonicalPath = location.pathname;

  const recommendedVehicleObjs = cargo.recommendedVehicles
    .map((vSlug) => getVehicleBySlug(vSlug))
    .filter(Boolean);

  const pageFaqs = [
    {
      question: `How do I book ${cargo.name} in ${cityName}?`,
      answer: `You can book specialized transport for ${cargo.name} in ${cityName} via GoMyTruck. We provide verified vehicles fitted with protective tarpaulins, lashing straps, and experienced drivers at a flat 5% platform commission.`
    },
    {
      question: `Which vehicles are best suited for ${cargo.name}?`,
      answer: `For ${cargo.name}, the recommended commercial vehicles are ${recommendedVehicleObjs.map(v => v.name).join(", ")}. These vehicles ensure appropriate payload capacity and cargo protection.`
    },
    {
      question: `Can I get direct phone numbers of ${cargo.shortName} transporters in ${cityName}?`,
      answer: `Yes. GoMyTruck Direct Driver Connect provides the direct contact numbers of 10 verified commercial transporters specializing in ${cargo.shortName} in ${cityName} for a flat one-time fee of ₹99.`
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEOHead
        title={`${cargo.name} in ${cityName} | Commercial Goods Transport | GoMyTruck`}
        description={`Specialized ${cargo.name} in ${cityName}, ${state}. Verified commercial fleet, HSN code ${cargo.hsnCode} compliance, and transparent per-km rates with zero broker margin.`}
        canonical={canonicalPath}
        keywords={`${cargo.shortName} ${cityName}, ${cargo.slug} transport ${cityName}, commercial freight ${cityName}, mandi goods transport`}
      />

      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-32 pb-20 mt-[68px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 opacity-95" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link to="/" className="hover:text-brand-400">Home</Link>
            <span>/</span>
            <Link to={`/${city}`} className="hover:text-brand-400">{cityName}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{cargo.shortName}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/40 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Package size={13} /> Specialized Freight Category
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {cargo.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">in {cityName}</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              {cargo.description} On-demand vehicle dispatch across {cityName} and nearby industrial corridors with zero broker markups.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/book-truck-online"
                state={{ selectedCity: cityName, goodsType: cargo.slug }}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                Book {cargo.shortName} Transport <ArrowRight size={18} />
              </Link>
              <Link
                to="/direct-driver-contact"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <Zap size={17} className="fill-slate-900" /> Unlock Transporters · ₹99
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto -mt-6 relative z-20">
        <TrustBadgeRow city={cityName} />
      </section>

      {/* Direct Driver Contact Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <DirectDriverContactBanner categoryName={`${cargo.shortName} Transporters`} cityName={cityName} />
      </section>

      {/* Recommended Vehicles for this Cargo */}
      <section className="py-16 bg-slate-50 border-t border-slate-200 mt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Recommended Commercial Vehicles for <span className="text-brand-600">{cargo.shortName}</span>
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Selected specifically for payload capacity, deck length, and protective handling standards in {cityName}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedVehicleObjs.map((veh) => (
              <div key={veh.slug} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="aspect-video bg-slate-50 rounded-xl mb-4 flex items-center justify-center p-3">
                  <img src={veh.image} alt={veh.name} className="max-h-full object-contain" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{veh.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{veh.capacityKg} kg payload · {veh.lengthFt} × {veh.widthFt} ft deck</p>
                <Link
                  to={`/${city}/truck-booking/${veh.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
                >
                  Book {veh.shortName} in {cityName} <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
