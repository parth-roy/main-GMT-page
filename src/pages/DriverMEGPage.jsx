import React, { useEffect, useState } from "react"
import { ShieldCheck, CheckCircle2, TrendingUp, Clock, FileText, ArrowRight, PhoneCall, Sparkles, AlertCircle } from "lucide-react"
import SEOHead from "../seo/SEOHead"
import FlatFeeVsCommissionCalc from "../components/calculator/FlatFeeVsCommissionCalc"
import Guarantee48hBadge from "../components/trust/Guarantee48hBadge"
import GovtIntegrationsBar from "../components/trust/GovtIntegrationsBar"

const megSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "₹25,000 Minimum Earnings Guarantee (MEG) for Drivers — GoMyTruck",
    "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
    "areaServed": ["Delhi NCR", "Mumbai", "Bangalore", "Kolkata", "India"],
    "serviceType": "Driver Partner Onboarding, Flat Fee Freight Platform, Minimum Earnings Guarantee",
    "description": "GoMyTruck provides a ₹25,000/month Minimum Earnings Guarantee for driver-owned Tata Ace vehicles under the Code on Social Security 2020, with flat ₹99 per trip platform fees.",
  },
]

export default function DriverMEGPage() {
  const [phone, setPhone] = useState("")
  const [vehicle, setVehicle] = useState("Tata Ace / Chota Hathi")
  const [city, setCity] = useState("Delhi-NCR")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleWhatsAppOnboard = (e) => {
    e.preventDefault()
    const msg = `Namaskar! I want to attach my ${vehicle} in ${city} for the ₹25,000 Minimum Earnings Guarantee (MEG) program. My mobile number is ${phone || "shared"}.`
    window.open(`https://wa.me/916291957542?text=${encodeURIComponent(msg)}`, "_blank")
  }

  return (
    <div className="w-full font-sans bg-slate-50 overflow-x-hidden pt-[72px]">
      <SEOHead
        title="₹25,000 Minimum Earnings Guarantee (MEG) for Tata Ace Drivers | Flat ₹99/Trip — GoMyTruck"
        description="Earn with India's only zero-percentage freight app. Flat ₹99/trip for Tata Ace, keep 100% of your freight fare, and qualify for the ₹25,000/month Minimum Earnings Guarantee."
        canonical="/minimum-earnings-guarantee"
        keywords="minimum earnings guarantee driver, tata ace attachment salary, flat fee truck app, zero percentage freight app, 48 hour guaranteed load, driver partner onboarding, tata ace monthly income"
        jsonLd={megSchema}
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200/80 pt-10 pb-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Zero-Percentage Freight Revolution
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                ₹25,000 Minimum Earnings Guarantee <span className="text-brand-600">for Driver Partners</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Stop giving <strong className="text-slate-900 font-bold">15% to 20%</strong> of your hard-earned fare to aggregators. GoMyTruck charges just <strong className="text-emerald-700 font-black">Flat ₹99 per trip</strong>. If your monthly organic earnings fall short, we top up the deficit up to ₹25,000.
              </p>

              {/* Key Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">Keep 100% of Freight Fare</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">First Load in 48 Hours Guarantee</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">Instant VAHAN KYC Approval</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">Social Security Code 2020 Compliant</span>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Onboarding Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-100">
              <div className="text-center mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-brand-600">Quick 3-Minute Enrollment</span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Join the MEG Driver Fleet</h3>
                <p className="text-xs text-slate-500 mt-1">Instant registration with WhatsApp document drop-off</p>
              </div>

              <form onSubmit={handleWhatsAppOnboard} className="space-y-4">
                <div>
                  <label htmlFor="meg-phone" className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (WhatsApp)
                  </label>
                  <input
                    id="meg-phone"
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label htmlFor="meg-vehicle" className="block text-xs font-bold text-slate-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    id="meg-vehicle"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-sm font-semibold text-slate-900 bg-white"
                  >
                    <option value="Tata Ace / Chota Hathi">Tata Ace / Chota Hathi (Flat ₹99/trip)</option>
                    <option value="Mahindra Bolero Pickup">Mahindra Bolero Pickup (Flat ₹99/trip)</option>
                    <option value="Tata 407 / 10ft Truck">Tata 407 / 10ft Truck (Flat ₹99/trip)</option>
                    <option value="14ft Eicher Truck">14ft Eicher Commercial (Flat ₹249/trip)</option>
                    <option value="19ft / 22ft Container">19ft / 22ft Container Truck (Flat ₹249/trip)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="meg-city" className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Operational City
                  </label>
                  <select
                    id="meg-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-sm font-semibold text-slate-900 bg-white"
                  >
                    <option value="Delhi-NCR">Delhi-NCR (Okhla, Noida, Gurugram, Manesar)</option>
                    <option value="Mumbai MMR">Mumbai MMR (Kalamboli, Vashi, Bhiwandi)</option>
                    <option value="Bangalore">Bangalore (Peenya, Whitefield, Bommasandra)</option>
                    <option value="Kolkata">Kolkata &amp; Howrah (Dankuni, Barrackpore)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit &amp; Attach on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  By submitting, you agree to verified login criteria and MEG terms.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory & Govt Trust Bar */}
      <GovtIntegrationsBar />

      {/* Interactive Savings Calculator */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Financial Comparison</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Flat ₹99 vs. 15% Aggregator Deduction
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              See the exact monthly cash difference you take home when you stop paying percentage-based cuts to traditional brokers.
            </p>
          </div>

          <FlatFeeVsCommissionCalc />
        </div>
      </section>

      {/* 48-Hour Guarantee Safe Harbor Section */}
      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Guarantee48hBadge />
        </div>
      </section>

      {/* How the Minimum Earnings Guarantee (MEG) Works */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-brand-600">Operating Structure</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mt-1">
              How the ₹25,000 MEG Program Operates
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Compliant with the Code on Social Security 2020 for gig and platform workers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-black text-lg mb-4">
                01
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">26 Days Login Standard</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Log into the GoMyTruck Driver App for at least 26 days per month during peak business hours in designated industrial clusters.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg mb-4">
                02
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">90% Trip Acceptance</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Accept 90% of algorithmic load match pings assigned within your corridor to maintain high customer fulfillment SLAs.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-lg mb-4">
                03
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Top-Up Deficit Funding</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                If your organic trip revenue falls below ₹25,000 for the month, GoMyTruck automatically disburses a promotional top-up directly to your registered bank account.
              </p>
            </div>
          </div>

          {/* Legal Clarification Box */}
          <div className="mt-8 p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Statutory Compliance Note:</strong> In accordance with the Code on Social Security 2020, driver partners remain independent gig contractors. GoMyTruck contributes between 1% to 2% of annual turnover to the gig worker welfare fund. The ₹25,000 MEG is a performance-linked promotional earnings guarantee and does not constitute statutory employment or wage liability.
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
