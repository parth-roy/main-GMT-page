import React, { useEffect, useState } from "react"
import { Building2, ShieldCheck, Database, Landmark, FileText, ArrowRight, CheckCircle2, TrendingUp, Cpu, Truck } from "lucide-react"
import SEOHead from "../seo/SEOHead"
import GovtIntegrationsBar from "../components/trust/GovtIntegrationsBar"

const enterpriseDmpSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Enterprise Dispatch Management Platform (DMP) — GoMyTruck",
    "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
    "areaServed": "India",
    "serviceType": "Enterprise B2B Logistics, Dispatch Management Platform, TReDS Invoice Financing, E-Way Bill Automation",
    "description": "GoMyTruck Enterprise DMP provides single-pane multi-vehicle dispatch, TReDS 24-hour invoice discounting at 5–8% p.a., automated NIC E-Way Bill Part-B updates, and API-integrated transit insurance.",
  },
]

export default function EnterpriseDMPPage() {
  const [companyName, setCompanyName] = useState("")
  const [workEmail, setWorkEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [monthlyVolume, setMonthlyVolume] = useState("50 - 200 Loads / Month")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const msg = `Namaskar! Enterprise demo request from ${companyName}. Work Email: ${workEmail}, Phone: ${phone}, Monthly Freight Volume: ${monthlyVolume}. Interested in Dispatch Management Platform, TReDS financing, and E-Way bill automation.`
    window.open(`https://wa.me/916291957542?text=${encodeURIComponent(msg)}`, "_blank")
    setSubmitted(true)
  }

  return (
    <div className="w-full font-sans bg-slate-50 overflow-x-hidden pt-[72px]">
      <SEOHead
        title="Enterprise Logistics & Dispatch Management Platform (DMP) | TReDS & ULIP — GoMyTruck"
        description="Streamline corporate supply chains with GoMyTruck Enterprise. Multi-vehicle dispatch, 24-hour TReDS invoice discounting at 5–8% p.a., automated E-Way Bill Part-B compliance, and API transit insurance."
        canonical="/enterprise-dispatch"
        keywords="enterprise logistics platform, dispatch management platform DMP, TReDS invoice discounting logistics, ULIP integration freight, automated eway bill part B, FMCG freight transport, 3PL contract trucking"
        jsonLd={enterpriseDmpSchema}
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200/80 pt-10 pb-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs sm:text-sm font-black uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-indigo-600" />
                Enterprise Dispatch Management Platform (DMP)
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Corporate Logistics Engineered for <span className="text-brand-600">Strict SLAs &amp; Working Capital</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Designed for FMCG distributors, 3PLs, e-commerce hubs, and industrial manufacturers. Seamlessly integrate multi-vehicle dispatch, <strong className="text-slate-900 font-bold">24-hour TReDS invoice financing</strong> at 5%–8% p.a., and automated <strong className="text-slate-900 font-bold">NIC E-Way Bill Part-B</strong> compliance.
              </p>

              {/* Enterprise Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <Landmark className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">TReDS 24h Invoice Settlement</h4>
                    <p className="text-[11px] text-slate-500">Financed via RXIL &amp; Invoicemart at 5–8% p.a.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Auto E-Way Bill Part-B</h4>
                    <p className="text-[11px] text-slate-500">Zero detention risk across checkposts</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <Database className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">ULIP 34-Agency Visibility</h4>
                    <p className="text-[11px] text-slate-500">FASTag &amp; national logistics integration</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">API Transit Micro-Insurance</h4>
                    <p className="text-[11px] text-slate-500">Underwritten by Digit &amp; Acko per consignment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Demo Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-100">
              <div className="text-center mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Enterprise Solutions</span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Request Platform Demo</h3>
                <p className="text-xs text-slate-500 mt-1">Speak with our enterprise logistics architects</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="company-name" className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name</label>
                  <input
                    id="company-name"
                    type="text"
                    required
                    placeholder="e.g., Tata Consumer / Reliance Retail / 3PL"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label htmlFor="work-email" className="block text-xs font-bold text-slate-700 mb-1">Corporate Work Email</label>
                  <input
                    id="work-email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label htmlFor="ent-phone" className="block text-xs font-bold text-slate-700 mb-1">Direct Phone Number</label>
                  <input
                    id="ent-phone"
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label htmlFor="volume-select" className="block text-xs font-bold text-slate-700 mb-1">Monthly Freight Movement</label>
                  <select
                    id="volume-select"
                    value={monthlyVolume}
                    onChange={(e) => setMonthlyVolume(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm font-semibold text-slate-900 bg-white"
                  >
                    <option value="20 - 50 Loads / Month">20 - 50 Loads / Month</option>
                    <option value="50 - 200 Loads / Month">50 - 200 Loads / Month</option>
                    <option value="200 - 500 Loads / Month">200 - 500 Loads / Month</option>
                    <option value="500+ Loads / Month">500+ Loads / Month (Dedicated Account Manager)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Connect with Enterprise Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {submitted && (
                  <p className="text-xs text-emerald-600 font-bold text-center mt-2">
                    Request submitted! An Enterprise Key Account Manager will contact you shortly.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Badges Bar */}
      <GovtIntegrationsBar />

      {/* Deep Dive Pillars */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Enterprise Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              How GoMyTruck DMP Upgrades Your Supply Chain
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Replacing fragmented broker phone calls with algorithmic precision and institutional liquidity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: TReDS */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-5">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">TReDS Invoice Financing</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Eliminate 60-day to 90-day vendor payment lockups. Integrated with RBI-regulated platforms (RXIL, Invoicemart, M1xchange) to discount approved freight invoices within 24 hours at competitive 5%–8% p.a. interest rates.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-indigo-700">
                Solves MSME working capital constraints
              </div>
            </div>

            {/* Card 2: E-Way Bill */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Automated E-Way Bill Part-B</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  For all consignments exceeding ₹50,000, our API automatically updates "Part-B" with the matched driver registration and transporter ID the moment a trip is locked. Prevents vehicle impounds and statutory penalties.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-amber-700">
                Zero manual RTO data entry
              </div>
            </div>

            {/* Card 3: ULIP */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">ULIP Gateway Telematics</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Direct connection with the Unified Logistics Interface Platform (ULIP) launched under the National Logistics Policy. Consolidates FASTag toll movements, VAHAN registrations, and port gate events into a single screen.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-blue-700">
                Connected to 34 national logistics systems
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
