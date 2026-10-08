import React, { useState } from "react"
import { Clock, ShieldCheck, CheckCircle2, ChevronRight, X, AlertCircle } from "lucide-react"

export default function Guarantee48hBadge({ variant = "card" }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (variant === "compact") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>First Load in 48 Hours Guarantee</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
        </button>

        {isModalOpen && <GuaranteeModal onClose={() => setIsModalOpen(false)} />}
      </>
    )
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl border border-amber-300 shrink-0">
            <Clock className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full mb-1">
              Service Safe Harbor
            </div>
            <h4 className="text-lg sm:text-xl font-black text-slate-900">
              "First Load in 48 Hours" Priority Matching Guarantee
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              We stand behind our marketplace liquidity. Once your KYC is verified in an active launch zone, you receive your first trip within 48 hours—or your next 5 trips are 100% platform-fee free.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all"
        >
          View Guarantee Terms
        </button>
      </div>

      {isModalOpen && <GuaranteeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

function GuaranteeModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              48-Hour Guarantee Policy &amp; Safe Harbor
            </h3>
            <p className="text-xs text-slate-500">
              Legally structured promotional warranty under ASCI guidelines
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed my-6">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Active Launch Zones:</strong> Currently applicable for drivers operating in designated high-density industrial clusters: Delhi-NCR (Okhla-Noida, Gurugram-Manesar), Mumbai MMR (Kalamboli, Vashi), and Bangalore (Peenya).
            </span>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Clock Starts Post-KYC:</strong> The 48-hour matching timer initiates the moment your vehicle registration (RC), DL, and bank details pass automated VAHAN verification.
            </span>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>The Safe Harbor Remedy:</strong> If organic demand does not match an active load within 48 hours, the platform waives the ₹99 platform fee for your next <strong>5 consecutive trips</strong>. You keep 100% of the entire freight amount.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
        >
          I Understand &amp; Agree
        </button>
      </div>
    </div>
  )
}
