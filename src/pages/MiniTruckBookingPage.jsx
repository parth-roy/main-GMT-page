import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle, Package, Truck } from "lucide-react"
import SEOHead from "../seo/SEOHead"
import TruckHero from "../components/truck/TruckHero"
import TruckFAQ from "../components/truck/TruckFAQ"
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner"

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Mini Truck Booking — GoMyTruck",
    "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
    "areaServed": "Kolkata, India",
    "serviceType": "Mini Truck Booking, 3-Wheeler Rental, Tata Ace on Rent",
    "description": "Request a mini truck, Tata Ace, or 3-wheeler in Kolkata. Declare the load and review a route-based estimate and current availability before confirming."
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
      { "@type": "ListItem", "position": 2, "name": "Truck Booking", "item": "https://gomytruck.com/truck" },
      { "@type": "ListItem", "position": 3, "name": "Mini Truck Booking", "item": "https://gomytruck.com/mini-truck-booking" }
    ]
  }
]

const vehicles = [
  {
    name: "3-Wheeler / Tempo",
    capacity: "Up to 500 kg",
    best: "Documents, parcels, small goods",
    icon: "🛺",
  },
  {
    name: "Tata Ace / Chhota Hathi",
    capacity: "Up to 750 kg",
    best: "Furniture, appliances, shop stock",
    icon: "🚐",
  },
]

const useCases = [
  "House shifting within Kolkata",
  "Furniture & appliance delivery",
  "Shop/store stock transport",
  "E-commerce last-mile delivery",
  "Office equipment relocation",
  "Event material transport",
]

export default function MiniTruckBookingPage() {
  const [city, setCity] = useState("Kolkata")
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEOHead
        title="Mini Truck Booking Near Me in Kolkata | 3-Wheeler & Tata Ace on Rent"
        description="Request a mini truck in Kolkata for eligible small goods, furniture, or business deliveries. Check load fit, route-based pricing, and current availability before confirming."
        canonical="/mini-truck-booking"
        keywords="mini truck booking near me, mini truck booking Kolkata, tata ace on rent, tata ace booking near me, chhota hathi booking, 3 wheeler tempo booking, small truck for rent, tempo booking near me, mini truck rent per km, light commercial vehicle booking, small goods vehicle booking Kolkata"
        jsonLd={schema}
      />

      {/* Canonical hint: full /truck page has all vehicle options */}
      {/* Note: canonical is set to /mini-truck-booking — unique enough content for its own page */}

      {/* Reuse booking form */}
      <TruckHero city={city} setCity={setCity} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <DirectDriverContactBanner categoryName="Mini Truck & Tata Ace Drivers" cityName={city} />
      </div>

      {/* Vehicle showcase */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/50 border border-brand-200 text-brand-700 text-xs font-bold tracking-widest uppercase mb-4">
              Mini Truck Fleet
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-3">
              Our <span className="text-brand-600">Mini Trucks</span> Available Near You
            </h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              Perfect for light to medium loads within Kolkata and nearby areas.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {vehicles.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-5 items-start hover:shadow-md transition-shadow">
                <div className="text-5xl">{v.icon}</div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl mb-1">{v.name}</h3>
                  <p className="text-brand-600 font-semibold text-sm mb-2">{v.capacity}</p>
                  <p className="text-slate-500 text-sm">Best for: {v.best}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/truck"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95"
            >
              View All Vehicle Options <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/50 border border-brand-200 text-brand-700 text-xs font-bold tracking-widest uppercase mb-4">
              Use Cases
            </div>
            <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-6">
              When to <span className="text-brand-600">Book a Mini Truck</span>
            </h2>
            <ul className="space-y-3">
              {useCases.map((u, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle size={20} className="text-brand-600 shrink-0" />
                  {u}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <Package size={40} className="text-brand-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Need a Bigger Vehicle?</h3>
            <p className="text-slate-600 leading-relaxed mb-5">
              For loads above 750 kg, house shifting, or full-truck operations, explore our larger fleet options on the Truck Booking page.
            </p>
            <div className="space-y-3">
              <Link to="/truck" className="flex items-center gap-2 text-brand-600 font-semibold hover:underline">
                <Truck size={16} /> Full Truck Load Booking <ArrowRight size={14} />
              </Link>
              <Link to="/goods-transport-services" className="flex items-center gap-2 text-brand-600 font-semibold hover:underline">
                <Package size={16} /> All Goods Transport Services <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TruckFAQ city="Kolkata" />
    </div>
  )
}
