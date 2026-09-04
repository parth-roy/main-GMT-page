import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle, Truck, Bike, Package, Home } from "lucide-react"
import SEOHead from "../seo/SEOHead"
import FAQ from "../components/FAQ"
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner"

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Goods Transport Services — GoMyTruck",
    "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
    "areaServed": "Kolkata, India",
    "serviceType": "Goods Transport, Freight Services, Last-Mile Delivery, House Shifting",
    "description": "Request goods transport in Kolkata, from eligible small parcels to declared full-truck requirements. Review pricing and current serviceability before confirming."
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
      { "@type": "ListItem", "position": 2, "name": "Goods Transport Services", "item": "https://gomytruck.com/goods-transport-services" }
    ]
  }
]

const services = [
  {
    icon: Bike,
    title: "Bike Delivery",
    desc: "Two-wheeler requests for eligible documents and small parcels, subject to item and route serviceability.",
    link: "/bike",
    cta: "Book Bike Delivery",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Truck,
    title: "Mini Truck & Tata Ace",
    desc: "Request a 3-wheeler or Tata Ace for declared small goods, shop stock, or furniture and review the route-based estimate.",
    link: "/mini-truck-booking",
    cta: "Book Mini Truck",
    color: "from-brand-500 to-brand-700",
  },
  {
    icon: Package,
    title: "Full Truck Load (FTL)",
    desc: "Discuss full- or part-load requirements for larger commercial goods; route and PTL availability must be confirmed.",
    link: "/truck",
    cta: "Book FTL Transport",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Home,
    title: "Packers & Movers",
    desc: "Request a scoped moving quote covering the declared inventory, access, packing, workforce, route, and schedule.",
    link: "/packers-and-movers",
    cta: "Book Packers & Movers",
    color: "from-purple-500 to-violet-600",
  },
]

const industries = [
  "FMCG & Retail Distribution",
  "E-commerce & Last-Mile Delivery",
  "Manufacturing & Industrial",
  "Construction & Building Materials",
  "Healthcare & Pharma",
  "Furniture & Home Appliances",
  "Textiles & Garments",
  "Agriculture & Cold Chain",
]

export default function GoodsTransportPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEOHead
        title="Goods Transport Services in Kolkata | Online Freight & Cargo Booking"
        description="Request goods transport in Kolkata by bike, mini truck, Tata Ace, or larger vehicle. Declare the load and review pricing and current serviceability before confirming."
        canonical="/goods-transport-services"
        keywords="goods transport services, freight services Kolkata, cargo transport Kolkata, online goods booking, transport company Kolkata, commercial transport services, goods vehicle booking, cargo delivery Kolkata, freight forwarding Kolkata, logistics company Kolkata, transport service provider, goods carrier booking"
        jsonLd={schema}
      />

      {/* Hero */}
      <section className="relative bg-slate-900 pt-32 pb-20 mt-[68px]">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 opacity-90" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold tracking-widest uppercase mb-5">
            Route-based transport requests
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight mb-6">
            Goods Transport Services <span className="text-brand-400">in Kolkata</span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            From an eligible small parcel to a full-truck requirement, declare the goods and route so GoMyTruck can check the vehicle, estimate, and current partner availability.
          </p>
          <Link
            to="/book-truck-online"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all active:scale-95 text-lg"
          >
            Book Transport Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Direct Driver / Partner Contact Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <DirectDriverContactBanner categoryName="Commercial Freight Drivers & Transporters" cityName="Kolkata" />
      </section>

      {/* Service Cards */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-4">
              Choose Your <span className="text-brand-600">Transport Service</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Compare common vehicle groups, then confirm that the selected body and payload fit your declared shipment.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <Link
                key={i}
                to={s.link}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-br ${s.color} p-6 flex justify-center`}>
                  <s.icon size={40} className="text-white" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex items-center gap-1 text-brand-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    {s.cta} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-4">
              Industries We <span className="text-brand-600">Serve</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              GoMyTruck handles freight for every sector — from FMCG to construction.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {industries.map((ind, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <CheckCircle size={20} className="text-brand-600 mx-auto mb-2" />
                <p className="text-slate-700 font-semibold text-sm">{ind}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/enterprise"
              className="inline-flex items-center gap-2 border border-brand-300 text-brand-700 font-bold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors"
            >
              Enterprise B2B Logistics <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Location links */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Transport Services by Location</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { to: "/kolkata/truck-booking", label: "Kolkata" },
              { to: "/barrackpore/truck-booking", label: "Barrackpore" },
            ].map((loc) => (
              <Link
                key={loc.to}
                to={loc.to}
                className="bg-white border border-slate-200 rounded-xl px-5 py-2.5 text-slate-700 font-semibold hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center gap-1.5"
              >
                Transport Services in {loc.label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
    </div>
  )
}
