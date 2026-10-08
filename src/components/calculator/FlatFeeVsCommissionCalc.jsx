import React, { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { TrendingUp, CheckCircle, ArrowRight, ShieldAlert, Sparkles, HelpCircle } from "lucide-react"

export default function FlatFeeVsCommissionCalc({ className = "" }) {
  const [vehicleCategory, setVehicleCategory] = useState("LCV") // "LCV" (Tata Ace) | "HCV" (14ft+)
  const [monthlyTrips, setMonthlyTrips] = useState(30)
  const [avgTripFare, setAvgTripFare] = useState(1500)

  const flatFeePerTrip = vehicleCategory === "LCV" ? 99 : 249
  const standardCommissionRate = 0.15 // 15% standard marketplace take rate

  const {
    totalGrossFreight,
    competitorDeduction,
    gmtFlatDeduction,
    monthlySavings,
    annualSavings,
    driverTakeHomeGMT,
    driverTakeHomeCompetitor,
  } = useMemo(() => {
    const gross = monthlyTrips * avgTripFare
    const compDeduction = Math.round(gross * standardCommissionRate)
    const gmtDeduction = monthlyTrips * flatFeePerTrip
    const savings = Math.max(0, compDeduction - gmtDeduction)
    const annual = savings * 12

    return {
      totalGrossFreight: gross,
      competitorDeduction: compDeduction,
      gmtFlatDeduction: gmtDeduction,
      monthlySavings: savings,
      annualSavings: annual,
      driverTakeHomeGMT: gross - gmtDeduction,
      driverTakeHomeCompetitor: gross - compDeduction,
    }
  }, [monthlyTrips, avgTripFare, flatFeePerTrip])

  return (
    <div className={`bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Zero Percentage Model
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            See How Much You Keep with Flat ₹{flatFeePerTrip}/Trip
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Compare your take-home earnings on GoMyTruck vs. standard 15% commission aggregator apps.
          </p>
        </div>

        {/* Vehicle Segment Switcher */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setVehicleCategory("LCV")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              vehicleCategory === "LCV"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tata Ace / LCV (₹99)
          </button>
          <button
            type="button"
            onClick={() => setVehicleCategory("HCV")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              vehicleCategory === "HCV"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            HCV / 14ft+ (₹249)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders (Left 6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Monthly Trips Slider */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="trips-slider" className="text-sm font-bold text-slate-800">
                Completed Trips / Month
              </label>
              <span className="text-base font-black text-brand-600 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200">
                {monthlyTrips} Trips
              </span>
            </div>
            <input
              id="trips-slider"
              type="range"
              min="10"
              max="60"
              step="2"
              value={monthlyTrips}
              onChange={(e) => setMonthlyTrips(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1.5">
              <span>10 trips (part-time)</span>
              <span>30 trips (regular)</span>
              <span>60 trips (dedicated)</span>
            </div>
          </div>

          {/* Average Fare Slider */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="fare-slider" className="text-sm font-bold text-slate-800">
                Average Freight Fare per Trip
              </label>
              <span className="text-base font-black text-brand-600 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200">
                ₹{avgTripFare.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              id="fare-slider"
              type="range"
              min="500"
              max="6000"
              step="100"
              value={avgTripFare}
              onChange={(e) => setAvgTripFare(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1.5">
              <span>₹500 (intra-city)</span>
              <span>₹2,500 (cross-zone)</span>
              <span>₹6,000 (intercity)</span>
            </div>
          </div>

          {/* Gross Freight Summary */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold">
            <span>Total Gross Freight Collected:</span>
            <span className="font-black text-slate-900 text-base">
              ₹{totalGrossFreight.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Results Card (Right 6 Cols) */}
        <div className="lg:col-span-6 bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-200">
            {/* Competitor / Traditional App */}
            <div className="p-4 rounded-2xl bg-white border border-rose-100">
              <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                15% Commission Apps
              </p>
              <p className="text-xl sm:text-2xl font-black text-rose-700 mt-1">
                -₹{competitorDeduction.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Cut taken from your hard work</p>
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
                You Take Home: <span className="font-bold text-slate-900">₹{driverTakeHomeCompetitor.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* GoMyTruck Flat Model */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                GoMyTruck Flat Fee
              </p>
              <p className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">
                -₹{gmtFlatDeduction.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-emerald-600 mt-1">Fixed at ₹{flatFeePerTrip}/trip only</p>
              <div className="mt-3 pt-3 border-t border-emerald-200/50 text-xs font-semibold text-slate-700">
                You Take Home: <span className="font-black text-emerald-800">₹{driverTakeHomeGMT.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Big Highlight: Extra Monthly In-Pocket Earnings */}
          <div className="py-5 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
              <TrendingUp className="w-4 h-4" /> Additional Cash In Your Pocket
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-600 tracking-tight">
              +₹{monthlySavings.toLocaleString("en-IN")}<span className="text-lg font-bold text-slate-500"> / month</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              That's an extra <span className="font-extrabold text-slate-900">₹{annualSavings.toLocaleString("en-IN")} per year</span> to support your family or pay vehicle EMIs.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              to="/minimum-earnings-guarantee"
              className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-center text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Apply for ₹25,000 MEG</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://wa.me/916291957542?text=Namaskar!%20I%20want%20to%20attach%20my%20truck%20under%20the%20flat%20fee%20model"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center text-sm transition-all"
            >
              Attach on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ASCI & CCPA Compliant Disclaimer Strip */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
        <HelpCircle className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
        <span>
          <strong className="text-slate-600">Legal Disclosure (ASCI &amp; CCPA Compliant):</strong> Calculations reflect comparative economics against standard 15%–20% broker and aggregator marketplace commissions. Platform fees (₹99 for LCVs, ₹249 for HCVs) are all-inclusive with zero drip pricing. Actual driver earnings are dependent on completed trips, acceptance rate, and local corridor demand.
        </span>
      </div>
    </div>
  )
}
