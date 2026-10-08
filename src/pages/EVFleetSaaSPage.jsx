import React, { useEffect } from "react"
import { Zap, Leaf, ShieldCheck, ArrowRight, BatteryCharging, TrendingDown, Cpu, BarChart3 } from "lucide-react"
import SEOHead from "../seo/SEOHead"
import EVTcoSavingsCalc from "../components/calculator/EVTcoSavingsCalc"
import GovtIntegrationsBar from "../components/trust/GovtIntegrationsBar"

const evSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Tata Ace EV 1000 Fleet Management SaaS & Green Logistics — GoMyTruck",
    "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
    "areaServed": "India",
    "serviceType": "EV Fleet Management, Electric Commercial Vehicle Logistics, Green Supply Chain, ESG Reporting",
    "description": "Accelerate your transition to Electric Vehicles with GoMyTruck. Tata Ace EV 1000 route optimization, 46% fuel cost reduction, charging station planning, and corporate ESG carbon offset tracking.",
  },
]

export default function EVFleetSaaSPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="w-full font-sans bg-slate-50 overflow-x-hidden pt-[72px]">
      <SEOHead
        title="Tata Ace EV 1000 Fleet SaaS & Green Logistics | Up to 46% Fuel Savings — GoMyTruck"
        description="Transition to Electric Light Commercial Vehicles (LCV) with GoMyTruck. Tata Ace EV 1000 fleet management, range-aware routing, charging hub scheduling, and ESG carbon reporting."
        canonical="/ev-fleet-solutions"
        keywords="tata ace ev 1000 logistics, electric commercial vehicle fleet, ev fleet management saas, green logistics india, carbon offset freight, commercial ev tco calculator"
        jsonLd={evSchema}
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200/80 pt-10 pb-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-black uppercase tracking-wider">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Green Logistics &amp; EV Enablement
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Transition to Electric Logistics &amp; Cut Operating Costs by <span className="text-emerald-600">Up to 46%</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Powered by the all-new <strong className="text-slate-900 font-bold">Tata Ace EV 1000</strong> with a full 1,000 kg payload capacity. GoMyTruck provides specialized EV fleet management software to optimize battery charging, calculate route range, and deliver auditable corporate ESG reports.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://wa.me/916291957542?text=Namaskar!%20I%20want%20to%20learn%20more%20about%20GoMyTruck%20EV%20Fleet%20SaaS%20and%20Tata%20Ace%20EV%20deployment"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center gap-2"
              >
                <span>Deploy EV Fleet Today</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Bar */}
      <GovtIntegrationsBar />

      {/* Interactive TCO Calculator */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Financial Modeling</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Total Cost of Ownership (TCO) Simulator
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Compare actual diesel expenditures against commercial EV electricity tariffs over monthly operating cycles.
            </p>
          </div>

          <EVTcoSavingsCalc />
        </div>
      </section>

      {/* EV Fleet SaaS Features */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-brand-600">Software Suite</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              EV Fleet Dispatch &amp; Telematics Tools
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Built specifically to overcome battery range anxiety and optimize turnaround time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Range-Aware Routing</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Algorithmic routing calculates real-time payload weight, elevation changes, and ambient temperature to assign trips strictly within verified safe battery range.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Charging Hub Integration</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pre-book fast DC charging slots at logistics hubs and highway corridors to ensure minimum downtime between turnaround trips.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Auditable ESG Reporting</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Provide corporate enterprise clients with certified Green Supply Chain carbon abatement certificates for SEBI BRSR and international sustainability disclosures.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
