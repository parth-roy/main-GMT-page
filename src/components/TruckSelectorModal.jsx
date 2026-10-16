import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Check, Truck, ShieldCheck, ChevronRight, Info } from "lucide-react"
import { TRUCK_CATEGORIES, ALL_TRUCKS } from "../constants/trucksData"
import { lockScroll, unlockScroll } from "../utils/scrollLock"

export default function TruckSelectorModal({
  isOpen,
  onClose,
  selectedTruckId,
  initialCategoryId = "open_truck",
  onSelectTruck,
}) {
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId)

  // Sync initialCategoryId when modal opens
  useEffect(() => {
    if (initialCategoryId) {
      setActiveCategoryId(initialCategoryId)
    }
  }, [initialCategoryId, isOpen])

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      lockScroll()
    } else {
      unlockScroll()
    }
    return () => {
      if (isOpen) unlockScroll()
    }
  }, [isOpen])

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || typeof document === "undefined") return null

  const activeCategory =
    TRUCK_CATEGORIES.find((c) => c.id === activeCategoryId) || TRUCK_CATEGORIES[0]

  const handleChooseTruck = (truck) => {
    onSelectTruck(truck)
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Select a Truck"
    >
      <div className="bg-white w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-600">
                Step 1: Choose Your Vehicle
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              Select Commercial Truck
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs: Open Truck | Container Truck | Trailers */}
        <div className="px-4 sm:px-6 pt-3 pb-2.5 bg-slate-50/70 border-b border-slate-200/60 shrink-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {TRUCK_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategoryId
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 py-2.5 px-2 rounded-xl transition-all cursor-pointer font-bold text-center ${
                    isActive
                      ? "bg-white text-orange-600 shadow-sm border-2 border-orange-500 ring-2 ring-orange-500/10"
                      : "bg-white/80 hover:bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-black tracking-tight">
                    {cat.title}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-orange-100 text-orange-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {cat.trucks.length}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-2 font-medium px-1 flex items-center gap-1.5">
            <Info size={13} className="text-orange-500 shrink-0" />
            <span>{activeCategory.tagline}</span>
          </p>
        </div>

        {/* Scrollable Truck Grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 overscroll-contain">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {activeCategory.trucks.map((truck) => {
              const isSelected = truck.id === selectedTruckId
              return (
                <div
                  key={truck.id}
                  onClick={() => handleChooseTruck(truck)}
                  className={`group relative flex flex-col justify-between rounded-2xl border-2 transition-all p-3 sm:p-3.5 cursor-pointer bg-white ${
                    isSelected
                      ? "border-orange-500 ring-2 ring-orange-500/20 shadow-md bg-orange-50/20"
                      : "border-slate-200/80 hover:border-orange-400 hover:shadow-md"
                  }`}
                >
                  {/* Top: Badges */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="inline-flex items-center text-[10px] sm:text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                      {truck.size}
                    </span>
                    <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {truck.capacityDesc}
                    </span>
                  </div>

                  {/* Truck Image Container */}
                  <div className="w-full h-28 sm:h-32 flex items-center justify-center p-2 my-1 overflow-hidden">
                    <img
                      src={truck.image}
                      alt={truck.name}
                      width={300}
                      height={200}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Truck Info */}
                  <div className="mt-1 pt-2 border-t border-slate-100">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">
                          {truck.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                          Dim: {truck.dimensions}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                          <Check size={13} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-1 font-medium">
                      Ideal for: {truck.bestFor}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleChooseTruck(truck)
                      }}
                      className={`w-full mt-2.5 py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-orange-600 text-white shadow-sm"
                          : "bg-slate-100 group-hover:bg-orange-500 text-slate-800 group-hover:text-white"
                      }`}
                    >
                      <span>{isSelected ? "Selected" : "Select This Truck"}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck size={14} className="text-emerald-600" />
            Verified commercial drivers & real-time GPS tracking on all loads
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer hidden sm:block"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
