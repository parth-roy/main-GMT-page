/**
 * CityTransportPage — Reusable location SEO page template.
 * 
 * To add a new city, just import this component in a new page file and pass the city config.
 * Example: <CityTransportPage city="Howrah" slug="howrah" ... />
 */
import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { MapPin, Truck, Bike, Package, Home, ArrowRight, CheckCircle, PhoneCall } from "lucide-react"
import SEOHead from "../seo/SEOHead"
import FAQ from "../components/FAQ"
import TrustBadgeRow from "./TrustBadgeRow"

const services = [
  { icon: Truck, label: "Mini Truck & Tata Ace", to: "/mini-truck-booking", desc: "Small goods & furniture" },
  { icon: Bike, label: "Bike Delivery", to: "/bike", desc: "Express parcels & docs" },
  { icon: Package, label: "Full Truck Load", to: "/truck", desc: "FTL & PTL freight" },
  { icon: Home, label: "Packers & Movers", to: "/packers-and-movers", desc: "House shifting" },
]

export default function CityTransportPage({
  city,
  slug,
  canonical,
  seoTitle,
  headline,
  subheadline,
  description,
  keywords,
  areas = [],
  highlights = [],
  jsonLd = [],
  children,
  customFaqs,
}) {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEOHead
        title={seoTitle || `Transport Services in ${city} | Truck Booking & Goods Transport`}
        description={description}
        canonical={canonical || `/transport-services-${slug}`}
        keywords={keywords}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative bg-slate-900 pt-32 pb-24 mt-[68px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-brand-900/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold tracking-widest uppercase mb-5">
            <MapPin size={12} /> Serving {city} & Surrounding Areas
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight mb-6">
            {headline || `Transport Services in ${city}`}
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            {subheadline || `Request truck, bike delivery, or moving support in ${city}. Review route-based pricing and current availability before confirming.`}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/book-truck-online"
              state={{ selectedCity: city }}
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl transition-all active:scale-95 flex items-center gap-2"
            >
              Book Transport Now <ArrowRight size={18} />
            </Link>
            <a
              href="tel:9331488999"
              className="border border-white/30 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <PhoneCall size={16} /> Call 9331488999
            </a>
          </div>
        </div>
      </section>

      <nav aria-label="Breadcrumb" className="border-b border-slate-200 bg-white">
        <ol className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <li><Link to="/" className="hover:text-brand-700">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/services" className="hover:text-brand-700">Services</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-slate-900">{headline || `Transport in ${city}`}</li>
        </ol>
      </nav>

      {/* Trust Badges */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto -mt-8 relative z-20">
        <TrustBadgeRow city={city} />
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mb-4">
              Transport Services <span className="text-brand-600">in {city}</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              All your logistics needs covered — from express parcels to full truckloads.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s, i) => (
              <Link
                key={i}
                to={s.to}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-brand-400 hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                  <s.icon size={24} className="text-brand-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-brand-700 transition-colors">{s.label}</h3>
                <p className="text-slate-500 text-sm mb-3">{s.desc}</p>
                <div className="flex items-center gap-1 text-brand-600 text-sm font-semibold">
                  Book Now <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Areas served */}
      {areas.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-4">
                Areas We Serve in <span className="text-brand-600">{city}</span>
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {areas.map((area, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 font-medium text-sm">
                  <MapPin size={13} className="text-brand-500" /> {area}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why GoMyTruck */}
      <section className={`py-20 ${areas.length > 0 ? "bg-slate-50" : "bg-white"} border-t border-slate-200`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/50 border border-brand-200 text-brand-700 text-xs font-bold tracking-widest uppercase mb-4">
              Why Choose GoMyTruck in {city}
            </div>
            <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-6">
              Transport built around your route and load
            </h2>
            <ul className="space-y-3">
              {(highlights.length ? highlights : [
                `Route coverage across ${city} and nearby areas`,
                "Fare components shown before payment",
                "Driver and vehicle documents checked during onboarding",
                "Live tracking is available for supported active trips",
                "Same-day requests are subject to vehicle availability",
                "Trip support through app, phone and WhatsApp",
              ]).map((h, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle size={20} className="text-brand-600 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { v: "Route based", l: "Digital estimates" },
                { v: "Multiple", l: "Vehicle categories" },
                { v: "In app", l: "Booking updates" },
                { v: "Documented", l: "Partner onboarding" },
              ].map((s, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="text-lg font-black text-brand-700">{s.v}</div>
                  <div className="text-slate-500 text-xs font-semibold mt-1">{s.l}</div>
                </div>
              ))}
            </div>
            <Link
              to="/gomytruck-verified"
              className="w-full flex items-center justify-center gap-2 border border-brand-300 text-brand-700 font-bold py-3 rounded-xl hover:bg-brand-50 transition-colors"
            >
              GoMyTruck Verified <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Injected SEO Content (600+ words) */}
      {children && (
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate prose-lg max-w-none">
            {children}
          </div>
        </section>
      )}

      {customFaqs ? customFaqs : <FAQ />}
    </div>
  )
}
