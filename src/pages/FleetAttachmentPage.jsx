import React, { useEffect, useState } from "react"
import { Truck, ShieldCheck, CheckCircle2, Gift, CreditCard, Calendar, ArrowRight, Building2, PhoneCall } from "lucide-react"
import SEOHead from "../seo/SEOHead"
import GovtIntegrationsBar from "../components/trust/GovtIntegrationsBar"

const fleetSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Fleet Owner Attachment Program & ₹5,000 FASTag Bonus — GoMyTruck",
    "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
    "areaServed": "India",
    "serviceType": "Fleet Owner Attachment, B2B Warehouse Contracts, Commercial Vehicle Attachment",
    "description": "Attach 14ft to 32ft commercial trucks to GoMyTruck. Receive a ₹5,000 upfront FASTag toll credit line per 5 trucks, 30-day warehouse rolling contracts, and 15-day payment cycles.",
  },
]

export default function FleetAttachmentPage() {
  const [fleetName, setFleetName] = useState("")
  const [phone, setPhone] = useState("")
  const [truckCount, setTruckCount] = useState("5-10 Trucks")
  const [primaryHub, setPrimaryHub] = useState("Delhi-NCR (Sanjay Gandhi Transport Nagar)")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleFleetEnroll = (e) => {
    e.preventDefault()
    const msg = `Namaskar! I am a Fleet Owner (${fleetName}). I manage ${truckCount} in ${primaryHub}. I want to attach my fleet for the ₹5,000 FASTag credit bonus and 30-day warehouse rolling contracts. Phone: ${phone}.`

    const API_BASE = import.meta.env.VITE_API_URL || 'https://api.gomytruck.com/api/v1'
    fetch(`${API_BASE}/leads/gmt-whatsapp-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'Fleet Owner Attachment',
        name: fleetName || 'Fleet Owner',
        phone: phone || '',
        companyName: fleetName,
        monthlyRequirement: truckCount,
        city: primaryHub,
        query: `Fleet Owner attachment: ${truckCount} in ${primaryHub} (FASTag bonus & 30-day contracts)`,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
      }),
    }).catch(() => {})

    window.open(`https://wa.me/916291957542?text=${encodeURIComponent(msg)}`, "_blank")
  }

  return (
    <div className="w-full font-sans bg-slate-50 overflow-x-hidden pt-[72px]">
      <SEOHead
        title="Fleet Owner Attachment | ₹5,000 FASTag Bonus & 30-Day Warehouse Contracts — GoMyTruck"
        description="Attach your 14ft, 19ft, 22ft & 32ft fleet to GoMyTruck. Earn a ₹5,000 FASTag credit line for every 5 trucks, guaranteed 60+ trips/month, and 15-day settlement cycles."
        canonical="/fleet-attachment"
        keywords="fleet owner attachment, attach fleet to company, commercial truck attachment, fastag fleet credit, warehouse truck contracts, 32ft container attachment, transport fleet partner"
        jsonLd={fleetSchema}
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200/80 pt-10 pb-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-black uppercase tracking-wider">
                <Gift className="w-4 h-4 text-blue-600" />
                ₹5,000 FASTag Fleet Attachment Bonus
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Maximize Your Fleet Utilization with <span className="text-brand-600">30-Day Warehouse Contracts</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Attach your 14ft, 19ft, 22ft, or 32ft commercial trucks. Eliminate idle waiting times, secure return loads automatically, and get an upfront <strong className="text-slate-900 font-bold">₹5,000 FASTag toll credit line</strong> for every 5 vehicles attached.
              </p>

              {/* Offer Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <CreditCard className="w-5 h-5 text-brand-600 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">₹5,000 FASTag Credit</h4>
                    <p className="text-[11px] text-slate-500">For every 5 trucks attached</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <Calendar className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">30-Day Rolling Contracts</h4>
                    <p className="text-[11px] text-slate-500">Minimum 60 trips / month guaranteed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">15-Day Payment Cycles</h4>
                    <p className="text-[11px] text-slate-500">Direct NEFT/RTGS bank settlements</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Zero Percentage Commission</h4>
                    <p className="text-[11px] text-slate-500">Flat ₹249 fee for HCVs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Fleet Enrollment Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-100">
              <div className="text-center mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-brand-600">Enterprise Transporter Onboarding</span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Enroll Your Fleet Today</h3>
                <p className="text-xs text-slate-500 mt-1">Instant VAHAN bulk verification for your commercial vehicles</p>
              </div>

              <form onSubmit={handleFleetEnroll} className="space-y-4">
                <div>
                  <label htmlFor="fleet-name" className="block text-xs font-bold text-slate-700 mb-1">
                    Fleet Owner / Transport Company Name
                  </label>
                  <input
                    id="fleet-name"
                    type="text"
                    required
                    placeholder="e.g., Sharma Roadways / Trans Logistics"
                    value={fleetName}
                    onChange={(e) => setFleetName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label htmlFor="fleet-phone" className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (WhatsApp)
                  </label>
                  <input
                    id="fleet-phone"
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label htmlFor="fleet-size" className="block text-xs font-bold text-slate-700 mb-1">
                    Total Fleet Size
                  </label>
                  <select
                    id="fleet-size"
                    value={truckCount}
                    onChange={(e) => setTruckCount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-sm font-semibold text-slate-900 bg-white"
                  >
                    <option value="1-4 Trucks">1 - 4 Trucks (Standard Attachment)</option>
                    <option value="5-10 Trucks">5 - 10 Trucks (Eligible for ₹5,000 FASTag Bonus)</option>
                    <option value="11-25 Trucks">11 - 25 Trucks (Eligible for ₹10,000 FASTag Bonus)</option>
                    <option value="25+ Trucks">25+ Trucks (Dedicated Key Account Manager)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fleet-hub" className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Operational Hub
                  </label>
                  <select
                    id="fleet-hub"
                    value={primaryHub}
                    onChange={(e) => setPrimaryHub(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-sm font-semibold text-slate-900 bg-white"
                  >
                    <option value="Delhi-NCR (Sanjay Gandhi Transport Nagar)">Delhi-NCR (Sanjay Gandhi Transport Nagar)</option>
                    <option value="Mumbai (Kalamboli / Vashi Market)">Mumbai (Kalamboli / Vashi Market)</option>
                    <option value="Bangalore (Peenya Industrial Area)">Bangalore (Peenya Industrial Area)</option>
                    <option value="Kolkata (Dankuni / Kona Expressway)">Kolkata (Dankuni / Kona Expressway)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Fleet Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  FASTag credit disbursed upon completion of 10 activated trips per attached vehicle.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Bar */}
      <GovtIntegrationsBar />

      {/* Fleet Attachment Specifications */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-brand-600">Eligible Fleet Vehicles</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Vehicles We Attach for B2B Warehouse Deployments
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Long-term contractual attachment with FMCG, 3PL, e-commerce, and industrial warehouses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-brand-300 transition-all">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full uppercase">14 Feet Eicher</span>
              <h3 className="text-base font-black text-slate-900 mt-3">4.0 Ton Payload</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ideal for intra-city FMCG distribution, retail replenishment, and pharma warehouse routes.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700">
                Avg. Rate: ₹32 - ₹36 / km
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-brand-300 transition-all">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full uppercase">19 - 22 Feet Truck</span>
              <h3 className="text-base font-black text-slate-900 mt-3">7.5 to 10 Ton Payload</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Suitable for manufacturing plant logistics, electrical cables, and regional hub transfers.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700">
                Avg. Rate: ₹44 - ₹50 / km
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-brand-300 transition-all">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full uppercase">32 Feet Container</span>
              <h3 className="text-base font-black text-slate-900 mt-3">7.0 to 14 Ton (Single/Multi-Axle)</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dedicated e-commerce fulfillment, white goods, and long-haul corridor trunk routes.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700">
                Avg. Rate: ₹58 - ₹68 / km
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-brand-300 transition-all">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full uppercase">Heavy Commercial Trailer</span>
              <h3 className="text-base font-black text-slate-900 mt-3">20 to 35 Ton Flatbed</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Steel coils, cement, heavy machinery, and industrial project cargo movements.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-700">
                Custom Corridor Contract
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
