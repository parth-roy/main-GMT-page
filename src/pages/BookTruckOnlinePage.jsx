import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Truck, Package, Clock, Shield, Star, ArrowRight, CheckCircle, PhoneCall } from "lucide-react"
import SEOHead from "../seo/SEOHead"
import TruckHero from "../components/truck/TruckHero"
import FAQ from "../components/FAQ"
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner"

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Book Truck Online — GoMyTruck",
    "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
    "areaServed": "Kolkata, India",
    "serviceType": "Online Truck Booking, Goods Transport, Mini Truck Rental",
    "description": "Request a mini truck, Tata Ace, 3-wheeler, or full truck load in Kolkata. Review a route-based estimate and current availability before confirming.",
    "url": "https://gomytruck.com/book-truck-online"
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
      { "@type": "ListItem", "position": 2, "name": "Book Truck Online", "item": "https://gomytruck.com/book-truck-online" }
    ]
  }
]

const steps = [
  { icon: Package, title: "Enter Pickup & Drop", desc: "Use exact addresses so the platform can map the route and check serviceability." },
  { icon: Truck, title: "Choose Your Vehicle", desc: "Select from Bike, 3-Wheeler, Tata Ace, or Mini Truck based on your load size." },
  { icon: Clock, title: "Review the Estimate", desc: "Check the current route, vehicle, pricing components, and stated trip assumptions." },
  { icon: Star, title: "Confirm and Follow Status", desc: "Confirmation begins partner matching; supported active trips can provide status and tracking updates." },
]

const benefits = [
  "Exact route and complete goods declaration",
  "Scheduled or same-day requests, subject to availability",
  "Distance, time, fuel, demand, workforce, and tax components",
  "Identity and vehicle documents reviewed during onboarding",
  "Trip-status and GPS visibility where supported",
  "Phone support hours published on the Support page",
]

export default function BookTruckOnlinePage() {
  const [city, setCity] = useState("Kolkata")
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEOHead
        title="Book Truck Online in Kolkata | Instant Mini Truck & Goods Transport Booking"
        description="Request a truck online in Kolkata. Choose a vehicle, declare the goods, review a route-based estimate, and check current partner availability before confirming."
        canonical="/book-truck-online"
        keywords="book truck online, book mini truck online, online truck booking Kolkata, instant truck booking, truck booking app, book goods vehicle online, online transport booking, hire truck online Kolkata, lorry booking online, book tempo online"
        jsonLd={schema}
      />

      {/* Reuse the full TruckHero with booking form */}
      <TruckHero city={city} setCity={setCity} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <DirectDriverContactBanner categoryName="Commercial Truck Drivers" cityName={city} />
      </div>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/50 border border-brand-200 text-brand-700 text-xs font-bold tracking-widest uppercase mb-4">
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-4">
              Book a Truck Online in <span className="text-brand-600">4 Easy Steps</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Complete the booking details online, then wait for an explicit partner assignment and arrival update.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <step.icon size={24} className="text-brand-600" />
                </div>
                <div className="absolute top-5 right-5 text-4xl font-black text-slate-100">{i + 1}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/50 border border-brand-200 text-brand-700 text-xs font-bold tracking-widest uppercase mb-4">
              Why GoMyTruck
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-6">
              The Smarter Way to <span className="text-brand-600">Book Goods Transport</span>
            </h2>
            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle size={20} className="text-brand-600 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white">
            <Shield size={40} className="mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-3">GoMyTruck Verified</h3>
            <p className="text-brand-100 leading-relaxed mb-6">
              GoMyTruck collects and reviews identity, driving, and vehicle documents applicable to the partner role. Verification reduces onboarding risk, but it is not a guarantee against delay, loss, damage, or misconduct.
            </p>
            <Link
              to="/gomytruck-verified"
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors"
            >
              Learn About Verification <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Internal links to related pages */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Explore More Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { to: "/truck", label: "Full Truck Load Booking", desc: "FTL & PTL transport" },
              { to: "/mini-truck-booking", label: "Mini Truck Booking", desc: "3-Wheeler & Tata Ace" },
              { to: "/goods-transport-services", label: "Goods Transport Services", desc: "All cargo types" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-brand-400 hover:shadow-md transition-all text-left"
              >
                <div className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors flex items-center gap-2">
                  {link.label} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-slate-500 text-sm mt-1">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
    </div>
  )
}
