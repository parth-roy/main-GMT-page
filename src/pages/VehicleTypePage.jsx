import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Phone, Package, Ruler, Weight, CheckCircle2, AlertTriangle } from "lucide-react"
import SEOHead from "../seo/SEOHead"

const vehicles = {
  "32ft-container": {
    canonical: "/kolkata/32ft-container-truck",
    title: "32 Feet Container Truck Hire in Kolkata | FTL Freight | GoMyTruck",
    description: "Book a 32ft container truck in Kolkata for FTL freight, factory-to-port and intercity movements. Transparent 5% commission, verified drivers, GST invoice.",
    h1: "32 Feet Container Truck Hire in Kolkata",
    eyebrow: "Full Truck Load — 32ft Container",
    intro: "A 32ft container truck is the standard for high-volume FTL freight, factory-to-port consignments and intercity commercial movements in Eastern India. GoMyTruck connects you to verified 32ft container operators with a transparent 5% platform commission.",
    specs: [
      { label: "Body Length", value: "32 feet (approx. 9.75 m)" },
      { label: "Payload Capacity", value: "Up to 10–15 tonnes (varies by permit)" },
      { label: "Ideal Cargo", value: "FMCG, electronics, machinery, palletized goods" },
      { label: "Body Type", value: "Closed container / open flatbed variants" },
      { label: "Route Suitability", value: "Intercity FTL, port-bound, highway corridors" },
    ],
    useCases: [
      "Factory-to-port (Haldia, Kolkata Port) shipments",
      "FMCG distribution across Eastern India",
      "Steel and industrial equipment interstate movement",
      "Intercity FTL — Kolkata to Guwahati, Patna, Bhubaneswar",
      "E-commerce bulk dispatches",
    ],
    disclaimer: "Payload and dimensions vary by exact vehicle registration, body type, RTO permit and route restrictions. The assigned vehicle and final charges are confirmed in the booking flow. Toll, waiting, GST and other disclosed components may apply.",
    ctas: [
      { label: "Book a 32ft Container Truck", to: "/book-truck-online" },
      { label: "Kolkata → Guwahati Route", to: "/routes/kolkata-to-guwahati" },
      { label: "Kolkata → Haldia Port", to: "/routes/kolkata-to-haldia" },
      { label: "Enterprise Logistics", to: "/enterprise" },
    ],
    related: [
      ["/kolkata/14-feet-truck-rental", "14 Feet Truck Kolkata"],
      ["/kolkata/pickup-truck-booking", "Pickup Truck Kolkata"],
      ["/intercity/kolkata", "Intercity Transport"],
      ["/kolkata/truck-booking", "All Trucks Kolkata"],
    ],
    jsonLdType: "32ft Container Truck",
  },
  "bolero-pickup": {
    canonical: "/kolkata/bolero-pickup-rent",
    title: "Bolero Pickup Truck on Rent in Kolkata | GoMyTruck",
    description: "Book a Bolero pickup truck in Kolkata for local delivery, mandi transport and small commercial loads up to 1.5 tonnes. Transparent 5% commission.",
    h1: "Bolero Pickup Truck on Rent in Kolkata",
    eyebrow: "Light Commercial Vehicle — Bolero Pickup",
    intro: "The Bolero pickup is ideal for local mandi-to-retail delivery, construction material transport and small commercial loads in Kolkata and the surrounding areas. Book verified Bolero pickups with transparent pricing and a 5% platform commission.",
    specs: [
      { label: "Body Length", value: "6–8 feet loading deck" },
      { label: "Payload Capacity", value: "Up to 750 kg–1.5 tonnes" },
      { label: "Ideal Cargo", value: "Grocery, mandi goods, furniture, construction material" },
      { label: "Mobility", value: "Access to narrow lanes and urban markets" },
      { label: "Route Suitability", value: "Intra-city, mandi-to-retail, short intercity" },
    ],
    useCases: [
      "Burrabazar mandi-to-retail delivery",
      "Household furniture and appliance transport",
      "Construction material short-distance haul",
      "Grocery and FMCG local distribution",
      "Office equipment relocation within Kolkata",
    ],
    disclaimer: "Payload varies by exact vehicle registration and permit. Vehicle entry restrictions apply in certain Kolkata market areas during peak hours. Declare cargo weight and dimensions accurately before booking.",
    ctas: [
      { label: "Book a Bolero Pickup", to: "/book-truck-online" },
      { label: "Tata Ace Booking", to: "/kolkata/tata-ace-booking" },
      { label: "Mini Truck Booking", to: "/kolkata/mini-truck-booking" },
      { label: "All Kolkata Transport", to: "/kolkata/truck-booking" },
    ],
    related: [
      ["/kolkata/tata-ace-booking", "Tata Ace Kolkata"],
      ["/kolkata/mini-truck-booking", "Mini Truck Kolkata"],
      ["/kolkata/pickup-truck-booking", "Pickup Truck Kolkata"],
      ["/book-truck-online", "Book Online"],
    ],
    jsonLdType: "Bolero Pickup Truck",
  },
  "14ft-eicher": {
    canonical: "/kolkata/14-feet-eicher-truck",
    title: "14 Feet Eicher Truck Hire in Kolkata | Medium Commercial Vehicle",
    description: "Book a 14ft Eicher truck in Kolkata for medium commercial loads up to 5 tonnes. FTL and PTL options, transparent 5% commission, verified drivers.",
    h1: "14 Feet Eicher Truck Hire in Kolkata",
    eyebrow: "Medium Commercial Vehicle — 14ft Eicher",
    intro: "A 14ft Eicher truck bridges the gap between mini trucks and 32ft containers, making it ideal for medium commercial loads, furniture shifts and intercity PTL. GoMyTruck connects you to verified 14ft operators with a transparent 5% commission.",
    specs: [
      { label: "Body Length", value: "14 feet (approx. 4.25 m)" },
      { label: "Payload Capacity", value: "Up to 3–5 tonnes (varies by permit)" },
      { label: "Ideal Cargo", value: "Furniture, appliances, packaged goods, medium commercial" },
      { label: "Body Type", value: "Closed container / open body variants" },
      { label: "Route Suitability", value: "Local, intercity PTL and FTL" },
    ],
    useCases: [
      "Household and office relocation",
      "Packaged FMCG intra-state delivery",
      "Appliances and furniture wholesale distribution",
      "Intercity PTL movement across West Bengal",
      "Small factory batch dispatches",
    ],
    disclaimer: "Payload and dimensions vary by vehicle registration, body type and RTO permit. Toll, waiting, GST and other disclosed charges may apply. Actual vehicle and charges confirmed in the booking flow.",
    ctas: [
      { label: "Book a 14ft Truck", to: "/book-truck-online" },
      { label: "32ft Container Truck", to: "/kolkata/32ft-container-truck" },
      { label: "Intercity Transport", to: "/intercity/kolkata" },
      { label: "All Kolkata Trucks", to: "/kolkata/truck-booking" },
    ],
    related: [
      ["/kolkata/32ft-container-truck", "32ft Container Kolkata"],
      ["/kolkata/pickup-truck-booking", "Pickup Truck Kolkata"],
      ["/kolkata/mini-truck-booking", "Mini Truck Kolkata"],
      ["/intercity/kolkata", "Intercity Transport"],
    ],
    jsonLdType: "14ft Eicher Truck",
  },
}

export default function VehicleTypePage({ vehicleKey }) {
  const v = vehicles[vehicleKey]
  useEffect(() => { window.scrollTo(0, 0) }, [vehicleKey])

  if (!v) return null

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: v.h1,
      url: `https://gomytruck.com${v.canonical}`,
      provider: { "@id": "https://gomytruck.com/#organization" },
      description: v.description,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${v.jsonLdType} Hire Kolkata`,
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: v.h1 },
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "INR",
              description: "Route-based estimate shown in booking flow. 5% platform commission applies."
            }
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gomytruck.com/" },
        { "@type": "ListItem", position: 2, name: "Kolkata", item: "https://gomytruck.com/kolkata" },
        { "@type": "ListItem", position: 3, name: v.h1, item: `https://gomytruck.com${v.canonical}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What is the freight rate for a ${v.jsonLdType} in Kolkata?`,
          acceptedAnswer: { "@type": "Answer", text: `The freight rate for a ${v.jsonLdType} in Kolkata is calculated based on route distance, estimated transit time, fuel surcharge, applicable tolls and GoMyTruck's 5% platform commission. Get a live estimate by entering your pickup and drop locations in the booking flow.` }
        },
        {
          "@type": "Question",
          name: "Does GoMyTruck charge extra beyond the estimate?",
          acceptedAnswer: { "@type": "Answer", text: "GoMyTruck charges a transparent 5% platform commission on the freight amount. GST, toll, waiting charges and other components are disclosed separately in the booking breakdown before payment." }
        }
      ]
    }
  ]

  return (
    <div className="bg-white min-h-screen pt-20">
      <SEOHead title={v.title} description={v.description} canonical={v.canonical} jsonLd={jsonLd} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-slate-200">
        <ol className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 text-sm text-slate-500 flex-wrap">
          <li><Link to="/" className="hover:text-brand-700">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/kolkata" className="hover:text-brand-700">Kolkata</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-slate-900">{v.h1}</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="bg-slate-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-300 font-bold uppercase tracking-widest text-sm mb-4">{v.eyebrow}</p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl">{v.h1}</h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-3xl">{v.intro}</p>
          {/* 5% commission badge */}
          <div className="mt-5 inline-flex items-center gap-2 bg-brand-700/30 border border-brand-500/40 rounded-full px-4 py-1.5">
            <span className="text-brand-300 font-black text-sm">Only 5% Commission — No Broker Margin</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book-truck-online" className="min-h-12 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold flex items-center gap-2">
              Book This Vehicle <ArrowRight size={18} />
            </Link>
            <Link to="/direct-driver-contact?openModal=true" className="min-h-12 px-6 py-3 rounded-xl border border-white/40 hover:bg-white/10 font-bold flex items-center gap-2">
              <Phone size={18} /> Talk to Drivers
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Technical Specs */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2"><Ruler size={24} className="text-brand-600" /> Vehicle Specifications</h2>
              <div className="mt-6 space-y-3">
                {v.specs.map(({ label, value }) => (
                  <div key={label} className="flex gap-4 py-3 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold text-sm w-36 shrink-0">{label}</span>
                    <span className="text-slate-900 font-bold text-sm">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-slate-500 text-sm leading-relaxed flex gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-500" />
                {v.disclaimer}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2"><Package size={24} className="text-brand-600" /> Ideal Use Cases</h2>
              <ul className="mt-6 space-y-3">
                {v.useCases.map((uc) => (
                  <li key={uc} className="flex gap-2 text-slate-700">
                    <CheckCircle2 size={18} className="text-brand-600 shrink-0 mt-0.5" />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing transparency */}
        <section className="py-14 bg-brand-950 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-black">How GoMyTruck Pricing Works</h2>
            <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
              Total Freight Cost = Driver Payout (95%) + GoMyTruck Commission (5%) + Applicable GST/Tolls
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {[
                { label: "Platform Commission", value: "Only 5%", sub: "vs 10–20% brokers charge" },
                { label: "GST Invoicing", value: "100%", sub: "Tax-compliant digital invoices" },
                { label: "Surge Pricing", value: "Zero", sub: "No dynamic surge ever" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                  <p className="text-brand-400 text-xs font-bold uppercase tracking-widest">{label}</p>
                  <p className="text-white font-black text-3xl mt-1">{value}</p>
                  <p className="text-slate-500 text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="py-14 bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900">Book or enquire now</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {v.ctas.map(({ label, to }) => (
                <Link key={to} to={to} className="min-h-16 bg-white border border-slate-200 rounded-xl p-5 font-bold text-slate-900 hover:border-brand-500 flex items-center justify-between transition-colors">
                  {label}<ArrowRight size={18} className="text-brand-700" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Related pages */}
        <section className="py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-slate-900">Related vehicle types</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {v.related.map(([to, label]) => (
                <Link key={to} to={to} className="px-4 py-2 bg-slate-100 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-xl font-semibold text-slate-700 hover:text-brand-700 text-sm transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
