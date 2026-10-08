import React from "react"
import { ShieldCheck, Database, Landmark, FileText, CheckCircle2 } from "lucide-react"

export default function GovtIntegrationsBar() {
  const integrations = [
    {
      badge: "VAHAN API",
      title: "Sub-10 Min KYC",
      desc: "Instant RC & DL verification via MoRTH registry",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      badge: "ULIP Gateway",
      title: "National Logistics Policy",
      desc: "Unified tracking across 34 govt logistics systems",
      icon: Database,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      badge: "TReDS RBI Platform",
      title: "24-Hour MSME Financing",
      desc: "Fast invoice discounting at 5–8% p.a. via RXIL",
      icon: Landmark,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      badge: "NIC E-Way Bill",
      title: "Automated Part-B",
      desc: "Zero-detention compliance on vehicle assignment",
      icon: FileText,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      badge: "ASCI & CCPA",
      title: "Zero Drip Pricing",
      desc: "100% transparent flat fees with no hidden broker cut",
      icon: CheckCircle2,
      color: "text-slate-700 bg-slate-100 border-slate-200",
    },
  ]

  return (
    <section className="bg-white border-y border-slate-200/80 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-widest font-black text-slate-500">
            Enterprise Government &amp; Regulatory Integrations
          </p>
          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
            Built for National Logistics Policy (NLP) Compliance &amp; MSME Security
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {integrations.map((item, idx) => {
            const IconComponent = item.icon
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className={`p-2.5 rounded-xl border ${item.color} shrink-0`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    {item.badge}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
