import React from "react"

const areas = [
  "Central Kolkata", "Salt Lake", "New Town", "Howrah", "Dum Dum",
  "Behala", "Barasat", "Ballygunge", "Shyambazar", "Tollygunge",
  "Jadavpur", "Ultadanga", "Kasba", "Rajarhat", "Garden Reach",
]

export default function AreasWeServe({ city }) {
  if (!["Kolkata", "Barrackpore", "Howrah", "Salt Lake", "New Town"].includes(city)) return null

  return (
    <section className="w-full border-b border-slate-200 bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6 text-center lg:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Check Serviceability Around {city}</h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-brand-500 lg:mx-0" />
          <p className="text-lg font-medium leading-relaxed text-slate-600">
            These are common search areas around the Kolkata service region. Enter the exact pickup and destination to check the route. Listing an area does not guarantee an immediately available vehicle or partner.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
          {areas.map((name) => (
            <span key={name} className="flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm">
              <img src="/google-maps-icon.webp" alt="Location" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0" /> {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
