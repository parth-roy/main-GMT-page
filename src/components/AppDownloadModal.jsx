import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { 
  X, 
  Truck, 
  Users, 
  Smartphone, 
  ChevronRight, 
  ExternalLink 
} from "lucide-react"
import QRCode from "qrcode"
import { lockScroll, unlockScroll } from "../utils/scrollLock"
import { APP_URLS } from "../constants/appUrls"

export default function AppDownloadModal({ isOpen, onClose, initialTrack = "customer" }) {
  const [activeTab, setActiveTab] = useState(initialTrack) // "customer" | "partner"
  const [customerQrDataUrl, setCustomerQrDataUrl] = useState("")
  const [partnerQrDataUrl, setPartnerQrDataUrl] = useState("")

  // Direct Play Store URLs encoded into QR codes
  const CUSTOMER_STORE_URL = "https://play.google.com/store/apps/details?id=com.gomytruck.customer&pcampaignid=web_share"
  const PARTNER_STORE_URL = "https://play.google.com/store/apps/details?id=com.parther.driver&pcampaignid=web_share"

  // Sync tab if initialTrack changes
  useEffect(() => {
    if (initialTrack) {
      setActiveTab(initialTrack)
    }
  }, [initialTrack])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      lockScroll()
    } else {
      unlockScroll()
    }
    return () => {
      if (isOpen) {
        unlockScroll()
      }
    }
  }, [isOpen])

  // Generate crisp, high-resolution QR codes using qrcode npm package
  useEffect(() => {
    QRCode.toDataURL(CUSTOMER_STORE_URL, {
      width: 400,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
      errorCorrectionLevel: "M"
    }).then(setCustomerQrDataUrl).catch(console.error)

    QRCode.toDataURL(PARTNER_STORE_URL, {
      width: 400,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
      errorCorrectionLevel: "M"
    }).then(setPartnerQrDataUrl).catch(console.error)
  }, [])

  if (!isOpen) return null
  if (typeof document === "undefined") return null

  const isCustomer = activeTab === "customer"
  const activeUrl = isCustomer ? CUSTOMER_STORE_URL : PARTNER_STORE_URL
  const activeQr = isCustomer ? customerQrDataUrl : partnerQrDataUrl

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Frosted Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Dialog - Compact, Pure White, Highly Visible on Mobile & Desktop */}
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-200 my-auto text-slate-900 z-10"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle Top Accent Line */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${isCustomer ? 'from-amber-400 via-orange-500 to-amber-500' : 'from-blue-600 via-indigo-600 to-cyan-500'}`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all z-20 cursor-pointer active:scale-95"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Modal Inner Container */}
        <div className="p-4 sm:p-6 flex flex-col items-center text-center">
          
          {/* App Header */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 p-1.5 shadow-xs border ${
              isCustomer ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <img 
                src={isCustomer ? "/app-icons/gomytruck-customer.png" : "/app-icons/gomytruck-partner.png"} 
                alt={isCustomer ? "GoMyTruck Customer App" : "GoMyTruck Partner App"} 
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => { e.target.src = "/go-my-truck-logo.png" }}
              />
            </div>
            <div className="text-left">
              <h3 className="font-black text-sm text-slate-900 leading-tight">
                {isCustomer ? "GoMyTruck App" : "GoMyTruck Partner App"}
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Official Mobile Application</span>
            </div>
          </div>

          {/* Simple Direct Title */}
          <h2 className="text-lg sm:text-xl font-display font-black tracking-tight text-slate-950 leading-snug">
            {isCustomer ? (
              <>To Book Trucks &amp; Services, <span className="text-amber-600">Install GoMyTruck</span></>
            ) : (
              <>To Attach Truck &amp; Get Loads, <span className="text-blue-600">Install Partner App</span></>
            )}
          </h2>

          <p className="mt-1 text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
            {isCustomer 
              ? "Book any truck instantly, get live GPS tracking, and transparent upfront fares."
              : "Attach your truck, onboard in minutes, and get guaranteed daily regular loads."}
          </p>

          {/* Segmented Switcher (Customer vs Partner) */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl w-full max-w-xs mt-3 mb-2 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("customer")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                isCustomer 
                  ? "bg-white text-slate-950 font-black shadow-xs border border-slate-200/80" 
                  : "text-slate-500 hover:text-slate-900 font-semibold"
              }`}
            >
              <Truck size={13} className={isCustomer ? "text-[#f99f1b]" : "text-slate-400"} />
              <span>Book Truck</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("partner")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                !isCustomer 
                  ? "bg-white text-slate-950 font-black shadow-xs border border-slate-200/80" 
                  : "text-slate-500 hover:text-slate-900 font-semibold"
              }`}
            >
              <Users size={13} className={!isCustomer ? "text-blue-600" : "text-slate-400"} />
              <span>Attach Truck</span>
            </button>
          </div>

          {/* Web Mode: Big Crisp QR Code */}
          <div className="hidden sm:flex flex-col items-center justify-center bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 my-2 w-full max-w-[270px] shadow-sm">
            {activeQr ? (
              <img 
                src={activeQr} 
                alt={isCustomer ? "GoMyTruck Customer App QR" : "GoMyTruck Partner App QR"} 
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl bg-white p-2 border border-slate-200 shadow-xs"
              />
            ) : (
              <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white border border-slate-200 rounded-xl flex items-center justify-center animate-pulse">
                <span className="text-xs text-slate-400 font-medium">Loading QR...</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-700 font-bold">
              <Smartphone size={13} className="text-amber-500" />
              <span>Scan with phone camera to install</span>
            </div>
          </div>

          {/* Google Play Install Button (Visible on both Web & Mobile, Pure White Mode) */}
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl text-slate-900 flex items-center justify-center gap-3 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 active:scale-98 transition-all shadow-xs hover:shadow-sm cursor-pointer group mt-1.5"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a2.006 2.006 0 01-.61-1.442V3.256c0-.555.226-1.073.61-1.442z" fill="#00C1FF"/>
              <path d="M17.155 8.637l-3.363 3.363 3.363 3.363 3.82-2.183c1.096-.627 1.096-1.733 0-2.36l-3.82-2.183z" fill="#FFC900"/>
              <path d="M3.609 1.814l10.183 10.186 3.363-3.363L6.34 2.378C5.267 1.764 4.195 1.542 3.609 1.814z" fill="#00E676"/>
              <path d="M13.792 12L3.609 22.186c.586.272 1.658.05 2.731-.564l10.815-6.259-3.363-3.363z" fill="#FF3A44"/>
            </svg>
            <div className="flex flex-col text-left leading-none whitespace-nowrap">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-600">GET IT ON</span>
              <span className="text-sm font-black text-slate-900 tracking-tight mt-0.5">Google Play</span>
            </div>
            <ExternalLink size={14} className="ml-auto text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
          </a>

          {/* Footer Escape Hatch & Cross-Promotion */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 w-full flex items-center justify-between text-[11px] text-slate-500">
            <a 
              href={APP_URLS.WORKFORCE} 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-500 hover:text-emerald-700 font-semibold flex items-center gap-0.5 transition-colors"
            >
              Metro Mitra <ChevronRight size={11} />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 font-bold underline transition-colors cursor-pointer"
            >
              Skip &amp; Continue on Web
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}
