import React, { useState, useMemo } from "react"
import { Zap, TrendingDown, Leaf, ArrowRight, ShieldCheck } from "lucide-react"

export default function EVTcoSavingsCalc({ className = "" }) {
  const [monthlyKm, setMonthlyKm] = useState(2500)
  const [dieselPricePerKm, setDieselPricePerKm] = useState(6.5) // ₹6.5/km average for ICE Tata Ace
  const evElectricityPerKm = 1.9 // ₹1.9/km electricity for Tata Ace EV 1000

  const {
    monthlyDieselCost,
    monthlyEVCost,
    monthlySavings,
    annualSavings,
    percentageSavings,
  } = useMemo(() => {
    const diesel = Math.round(monthlyKm * dieselPricePerKm)
    const ev = Math.round(monthlyKm * evElectricityPerKm)
    const savings = diesel - ev
    const annual = savings * 12
    const pct = Math.round(((diesel - ev) / diesel) * 100)

    return {
      monthlyDieselCost: diesel,
      monthlyEVCost: ev,
      monthlySavings: savings,
      annualSavings: annual,
      percentageSavings: pct,
    }
  }, [monthlyKm, dieselPricePerKm])

  return (
    <div className={`bg-white border border-emerald-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            Green Logistics &amp; TCO Calculator
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Tata Ace EV 1000 Operating Cost Savings
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Calculate your operating savings by transitioning to Electric Commercial Vehicles (1,000 kg payload).
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-black shrink-0 self-start sm:self-auto">
          <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
          Up to 46% Fuel Savings
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders (Left 6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Monthly KM Slider */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="km-slider" className="text-sm font-bold text-slate-800">
                Monthly Distance Traveled
              </label>
              <span className="text-base font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {monthlyKm.toLocaleString("en-IN")} KM
              </span>
            </div>
            <input
              id="km-slider"
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1.5">
              <span>1,000 km (Intra-city)</span>
              <span>2,500 km (Hub-and-spoke)</span>
              <span>5,000 km (High-velocity)</span>
            </div>
          </div>

          {/* Current Diesel / Fuel Price Per KM */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="fuel-slider" className="text-sm font-bold text-slate-800">
                Current Diesel/CNG Running Cost
              </label>
              <span className="text-base font-black text-slate-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                ₹{dieselPricePerKm.toFixed(1)} / km
              </span>
            </div>
            <input
              id="fuel-slider"
              type="range"
              min="4.5"
              max="9.0"
              step="0.5"
              value={dieselPricePerKm}
              onChange={(e) => setDieselPricePerKm(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1.5">
              <span>₹4.5 (CNG)</span>
              <span>₹6.5 (Standard Diesel)</span>
              <span>₹9.0 (Heavy Traffic)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span>Electric Running Cost (Tata Ace EV 1000):</span>
            <span className="font-bold text-emerald-700">₹{evElectricityPerKm} / km (commercial tariff)</span>
          </div>
        </div>

        {/* Results Card (Right 6 Cols) */}
        <div className="lg:col-span-6 bg-gradient-to-b from-emerald-50/50 to-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-sm">
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-emerald-100">
            {/* Diesel Expense */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Diesel/CNG Monthly Cost
              </p>
              <p className="text-xl sm:text-2xl font-black text-rose-700 mt-1">
                ₹{monthlyDieselCost.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">High fuel expenditure</p>
            </div>

            {/* EV Cost */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                EV Charging Monthly Cost
              </p>
              <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                ₹{monthlyEVCost.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5">{percentageSavings}% lower cost</p>
            </div>
          </div>

          {/* Big Savings Callout */}
          <div className="py-5 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
              <TrendingDown className="w-4 h-4 text-emerald-600" /> Net Operational Fuel Savings
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-700 tracking-tight">
              +₹{monthlySavings.toLocaleString("en-IN")}<span className="text-base font-bold text-slate-500"> / month</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5">
              Annual savings of <strong className="text-slate-900">₹{annualSavings.toLocaleString("en-IN")}</strong> per vehicle directly improving your fleet operating margin.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="https://wa.me/916291957542?text=Namaskar!%20I%20am%20interested%20in%20GoMyTruck%20EV%20fleet%20solutions%20and%20charging%20SaaS"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-center text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore EV Fleet Management SaaS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
