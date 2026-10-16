import React, { useState } from "react"
import { Weight, Ruler, ArrowRight, ShieldCheck, Check } from "lucide-react"
import { TRUCK_CATEGORIES } from "../../constants/trucksData"

function VehicleCard({ vehicle }) {
  const scrollToEstimate = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div
      onClick={scrollToEstimate}
      className="bg-white border border-slate-200/90 hover:border-orange-500 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200/70 px-2.5 py-1 rounded-full text-xs font-black">
            <Weight size={12} className="text-orange-600" />
            {vehicle.capacityDesc}
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold">
            <Ruler size={12} className="text-slate-500" />
            {vehicle.size}
          </span>
        </div>

        {/* Truck Image Container */}
        <div className="w-full h-40 bg-slate-50/80 rounded-xl mb-4 overflow-hidden flex items-center justify-center p-3 border border-slate-100 group-hover:bg-orange-50/20 transition-colors">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            width={400}
            height={260}
            loading="lazy"
            decoding="async"
            className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Title & Dimension */}
        <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
          {vehicle.name}
        </h3>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Dimensions: <span className="text-slate-700">{vehicle.dimensions}</span>
        </p>

        {/* Best For */}
        <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-2">
          {vehicle.bestFor}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
        <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
          <ShieldCheck size={13} className="text-emerald-600" />
          Verified Fleet
        </span>
        <button
          type="button"
          onClick={scrollToEstimate}
          className="text-orange-600 font-black text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
        >
          <span>Book Truck</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}

export default function VehicleSelection({ city }) {
  const [activeCategoryId, setActiveCategoryId] = useState("open_truck")

  const currentCategory =
    TRUCK_CATEGORIES.find((c) => c.id === activeCategoryId) || TRUCK_CATEGORIES[0]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Heading */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100/70 border border-orange-200 text-orange-700 text-xs font-black tracking-widest uppercase mb-3">
          Commercial Fleet Directory
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Commercial Trucks Available in {city}
        </h2>
        <p className="text-slate-500 mt-2 text-base max-w-2xl mx-auto">
          Explore our complete fleet across Open Trucks, Container Trucks, and Trailers. Select any truck to check live route-based fare estimates.
        </p>
      </div>

      {/* 3 Main Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 gap-1.5 max-w-full overflow-x-auto">
          {TRUCK_CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategoryId
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`flex items-center gap-2 py-2.5 px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-white text-orange-600 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <span>{cat.title}</span>
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-orange-100 text-orange-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {cat.trucks.length}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Category description banner */}
      <div className="text-center mb-8">
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {currentCategory.tagline}
        </p>
      </div>

      {/* Truck Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCategory.trucks.map((truck) => (
          <VehicleCard key={truck.id} vehicle={truck} />
        ))}
      </div>
    </section>
  )
}
