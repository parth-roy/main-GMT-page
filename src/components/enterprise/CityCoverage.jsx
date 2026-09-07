import React from "react"

const hubs = [
  ["Kolkata", "/kolkata"],
  ["Barrackpore", "/barrackpore"],
  ["Howrah", "/howrah"],
  ["Salt Lake", "/salt-lake"],
  ["New Town", "/new-town"],
  ["Kolkata–Asansol route", "/routes/kolkata-to-asansol"],
]

export default function CityCoverage() {
  return (
    <section className="w-full border-b border-slate-200 bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6 text-center lg:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Published Service Hubs</h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-brand-500 lg:mx-0" />
          <p className="text-lg font-medium leading-relaxed text-slate-600">
            GoMyTruck currently publishes local service information for these West Bengal hubs and selected routes. Enterprise coverage beyond them is assessed case by case after the pickup network, destinations, goods, frequency, and vehicle requirements are reviewed.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
          {hubs.map(([label, href]) => (
            <a key={href} href={href} className="flex min-h-12 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-brand-500 hover:text-brand-700">
              <img src="/google-maps-icon.webp" alt="Location" width={16} height={16} className="w-4 h-4 object-contain shrink-0" /> {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
