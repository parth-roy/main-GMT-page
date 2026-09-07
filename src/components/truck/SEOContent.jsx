import React from "react"
import { ArrowRight, BarChart2, Package, Truck, Users } from "lucide-react"

const capabilities = [
  {
    title: "Route-based estimate",
    description: "The pricing engine uses the mapped distance, travel time, vehicle, fuel surcharge, demand rules, loading help, and tax inputs available for the request.",
  },
  {
    title: "Complete goods declaration",
    description: "Customers provide the goods category, description, weight, quantity, handling needs, restricted-goods declaration, and optional workforce requirement.",
  },
  {
    title: "Partner document review",
    description: "Driver and vehicle documents are collected and reviewed during onboarding. Verification reduces risk but does not guarantee trip performance.",
  },
  {
    title: "Live trip workflow",
    description: "When an active booking supports tracking, the customer and assigned partner can use the platform's trip-status and location workflow.",
  },
  {
    title: "Fixed price or private bids",
    description: "Eligible bookings can use a fixed-price flow or private sealed bidding with revisions, chat, and an explicit customer award.",
  },
  {
    title: "Clear availability language",
    description: "A submitted request starts matching; it does not promise a vehicle, arrival time, support response, or delivery deadline until confirmed.",
  },
]

export default function SEOContent({ city }) {
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <h2 className="mb-4 flex items-center gap-3 text-3xl font-bold text-slate-900">
            <Truck size={28} className="shrink-0 text-brand-600" />
            Online Truck Booking in {city}
          </h2>
          <div className="space-y-4 text-left text-base leading-relaxed text-slate-600 lg:text-lg">
            <h3 className="text-xl font-bold text-slate-800">How to Book a Truck</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Enter Locations:</strong> Provide your exact pickup and drop-off addresses.</li>
              <li><strong>Select Vehicle:</strong> Choose a mini truck, Tata Ace, pickup, or larger goods vehicle.</li>
              <li><strong>Declare Goods:</strong> Describe the load, weight, and handling requirements.</li>
              <li><strong>Review & Confirm:</strong> Check the current estimate before confirming the request.</li>
            </ol>
            <p>
              Serviceability, partner assignment, and arrival depend on the exact pickup, destination, goods, vehicle class, requested time, and current supply. The website therefore avoids unsupported &ldquo;instant driver&rdquo; or fixed-arrival promises.
            </p>
          </div>
        </div>

        <div className="mb-14 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="mb-4 flex items-center gap-3 text-3xl font-bold text-slate-900">
            <Package size={28} className="shrink-0 text-brand-600" />
            Mini Truck and Tata Ace Estimates in {city}
          </h2>
          <div className="space-y-4 text-left text-base leading-relaxed text-slate-600 lg:text-lg">
            <p>
              Vehicle capacity is only a starting point. The load must also fit the body dimensions, weight rating, handling requirement, access conditions, and applicable goods restrictions. Customers remain responsible for an accurate declaration.
            </p>
            <h3 className="text-xl font-bold text-slate-800">Fare Calculation Components</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2">
              <dt className="font-bold">Base Fare</dt>
              <dd>Standard starting amount based on vehicle class.</dd>
              <dt className="font-bold">Distance & Time</dt>
              <dd>Calculated mapped travel cost.</dd>
              <dt className="font-bold">Fuel Surcharge</dt>
              <dd>Adjustments based on current fuel prices.</dd>
              <dt className="font-bold">Demand</dt>
              <dd>Dynamic pricing adjustments during peak hours.</dd>
              <dt className="font-bold">Add-ons</dt>
              <dd>Workforce, tolls, and GST components.</dd>
            </dl>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 font-semibold text-slate-700">Vehicle group</th>
                  <th className="p-3 font-semibold text-slate-700">Typical planning use</th>
                  <th className="p-3 font-semibold text-slate-700">Before confirmation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Three-wheeler cargo", "Smaller local loads", "Check exact payload and body size"],
                  ["Tata Ace / mini truck", "Furniture, appliances, shop inventory", "Declare weight, quantity, and handling"],
                  ["Pickup truck", "Medium commercial or moving loads", "Confirm fit, route, and access"],
                  ["14-ft and larger truck", "Bulk or intercity requirements", "Confirm commercial scope and availability"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-slate-100 last:border-0">
                    {row.map((cell, index) => <td key={cell} className={`p-3 ${index === 0 ? "font-medium text-brand-700" : ""}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="mb-4 flex items-center gap-3 text-3xl font-bold text-slate-900">
            <BarChart2 size={28} className="shrink-0 text-brand-600" />
            Full Truck Load and Part Load Planning
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3 text-base leading-relaxed text-slate-600 lg:text-lg">
              <h3 className="text-xl font-bold text-slate-800">Full Truck Load (FTL)</h3>
              <p>FTL reserves the selected vehicle capacity for one customer&apos;s shipment. It can suit larger commercial loads, but the vehicle, route, operating scope, and timing remain subject to confirmation.</p>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-slate-600 lg:text-lg">
              <h3 className="text-xl font-bold text-slate-800">Part Load (PTL / LTL)</h3>
              <p>PTL shares compatible capacity across consignments. Ask the enterprise team to confirm whether the goods, destination, and schedule are eligible; PTL is not represented as universally available.</p>
            </div>
          </div>
        </div>

        <div className="mb-14 rounded-2xl border border-brand-100 bg-brand-50/60 p-8">
          <h2 className="mb-4 flex items-center gap-3 text-3xl font-bold text-slate-900">
            <img src="/google-maps-icon.webp" alt="Location" width={28} height={28} className="w-7 h-7 object-contain shrink-0" />
            Local Service Hubs Around {city}
          </h2>
          <p className="text-base leading-relaxed text-slate-600 lg:text-lg">
            The website includes dedicated information for Kolkata, Barrackpore, Howrah, Salt Lake, and New Town, along with selected West Bengal route pages. These pages describe the intended service, not guaranteed vehicle inventory. Check exact addresses and availability in the booking flow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              ["Kolkata", "/kolkata"], ["Barrackpore", "/barrackpore"], ["Howrah", "/howrah"],
              ["Salt Lake", "/salt-lake"], ["New Town", "/new-town"], ["Kolkata to Asansol", "/routes/kolkata-to-asansol"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-bold text-brand-700 hover:border-brand-400">
                {label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-3 text-3xl font-bold text-slate-900">
            <Users size={28} className="shrink-0 text-brand-600" />
            What the GoMyTruck Workflow Provides
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <div key={item.title} className="flex gap-3 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                <ArrowRight size={18} className="mt-1 shrink-0 text-brand-600" />
                <div>
                  <h3 className="mb-1 text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
