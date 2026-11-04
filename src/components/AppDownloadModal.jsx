import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { 
  X, 
  Truck, 
  Users, 
  Smartphone, 
  ChevronRight, 
  ExternalLink,
  QrCode
} from "lucide-react"
import QRCode from "qrcode"
import { lockScroll, unlockScroll } from "../utils/scrollLock"
import { APP_URLS } from "../constants/appUrls"

export default function AppDownloadModal({ isOpen, onClose, initialTrack = "customer" }) {
  const [activeTab, setActiveTab] = useState(initialTrack) // "customer" | "partner"
  const [customerQrDataUrl, setCustomerQrDataUrl] = useState("")
  const [partnerQrDataUrl, setPartnerQrDataUrl] = useState("")
  const [showMobileQr, setShowMobileQr] = useState(false)

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
      setShowMobileQr(false)
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
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Modal Inner Container */}
        <div className="p-4 sm:p-6 flex flex-col items-center text-center">
          
          {/* App Header (Full sized app icon without outer color radius/background) */}
          <div className="flex items-center gap-3 mb-2.5">
            <img 
              src={isCustomer ? "/app-icons/gomytruck-customer.png" : "/app-icons/gomytruck-partner.png"} 
              alt={isCustomer ? "GoMyTruck Customer App" : "GoMyTruck Partner App"} 
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-2xl shrink-0 drop-shadow-sm"
              onError={(e) => { e.target.src = "/go-my-truck-logo.png" }}
            />
            <div className="text-left">
              <h3 className="font-black text-base sm:text-lg text-slate-950 leading-tight">
                {isCustomer ? (
                  <>Go<span className="text-orange-500">My</span>Truck App</>
                ) : (
                  <>Go<span className="text-orange-500">My</span>Truck Partner App</>
                )}
              </h3>
              <span className="text-xs text-slate-600 font-extrabold">Official Mobile Application</span>
            </div>
          </div>

          {/* Simple Direct Title with Brand Colored GoMyTruck */}
          <h2 className="text-lg sm:text-xl font-display font-black tracking-tight text-slate-950 leading-snug">
            {isCustomer ? (
              <>To Book Trucks &amp; Services, Install Go<span className="text-orange-500">My</span>Truck</>
            ) : (
              <>To Attach Truck &amp; Get Loads, Install Go<span className="text-orange-500">My</span>Truck Partner</>
            )}
          </h2>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-800 font-extrabold max-w-sm leading-relaxed">
            {isCustomer 
              ? "Book any truck instantly, get live GPS tracking, and transparent upfront fares."
              : "Attach your truck, onboard in minutes, and get guaranteed daily regular loads."}
          </p>

          {/* Segmented Switcher (Customer vs Partner) with 2x Bold Icons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full max-w-sm mt-3 mb-2 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("customer")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                isCustomer 
                  ? "bg-white text-slate-950 font-black shadow-xs border border-slate-200/80" 
                  : "text-slate-600 hover:text-slate-950 font-bold"
              }`}
            >
              <Truck size={22} strokeWidth={2.5} className={isCustomer ? "text-[#f99f1b]" : "text-slate-500"} />
              <span className="text-xs sm:text-sm font-black">Book Truck</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("partner")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                !isCustomer 
                  ? "bg-white text-slate-950 font-black shadow-xs border border-slate-200/80" 
                  : "text-slate-600 hover:text-slate-950 font-bold"
              }`}
            >
              <Users size={22} strokeWidth={2.5} className={!isCustomer ? "text-blue-600" : "text-slate-500"} />
              <span className="text-xs sm:text-sm font-black">Attach Truck</span>
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
                <span className="text-xs text-slate-400 font-bold">Loading QR...</span>
              </div>
            )}
            {/* Bold Scan Prompt with 2x Bold Icon */}
            <div className="flex items-center gap-2 mt-2.5">
              <Smartphone size={22} strokeWidth={2.5} className="text-amber-500 shrink-0" />
              <span className="text-xs sm:text-sm text-slate-950 font-black">Scan with phone camera to install</span>
            </div>
          </div>

          {/* Google Play & QR Action Bar */}
          <div className="w-full py-2.5 px-3 sm:px-4 rounded-xl text-slate-900 flex items-center justify-between gap-2 sm:gap-3 bg-white border border-slate-300 hover:border-slate-400 transition-all shadow-xs mt-2">
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0 overflow-hidden"
              onClick={onClose}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a2.006 2.006 0 01-.61-1.442V3.256c0-.555.226-1.073.61-1.442z" fill="#00C1FF"/>
                <path d="M17.155 8.637l-3.363 3.363 3.363 3.363 3.82-2.183c1.096-.627 1.096-1.733 0-2.36l-3.82-2.183z" fill="#FFC900"/>
                <path d="M3.609 1.814l10.183 10.186 3.363-3.363L6.34 2.378C5.267 1.764 4.195 1.542 3.609 1.814z" fill="#00E676"/>
                <path d="M13.792 12L3.609 22.186c.586.272 1.658.05 2.731-.564l10.815-6.259-3.363-3.363z" fill="#FF3A44"/>
              </svg>
              <div className="flex flex-col text-left leading-none whitespace-nowrap min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-slate-600 truncate">GET IT ON</span>
                <span className="text-base font-black text-slate-950 tracking-tight mt-0.5 truncate">Google Play</span>
              </div>
            </a>

            {/* Mobile Only: QR Code Preview Button */}
            <button
              type="button"
              onClick={() => setShowMobileQr(true)}
              className="sm:hidden flex items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 transition-all cursor-pointer active:scale-95 shrink-0"
              title="View QR Code"
              aria-label="View QR Code"
            >
              <QrCode size={19} strokeWidth={2.5} className="text-slate-800" />
            </button>

            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors shrink-0 flex items-center justify-center"
              onClick={onClose}
              aria-label="Open in Google Play Store"
            >
              <ExternalLink size={19} strokeWidth={2.5} />
            </a>
          </div>

          {/* Footer Escape Hatch & Cross-Promotion */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs sm:text-sm">
            <a 
              href={APP_URLS.WORKFORCE} 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-900 hover:text-emerald-700 font-black flex items-center gap-1 transition-colors"
            >
              <span>Metro Mitra</span>
              <ChevronRight size={18} strokeWidth={2.5} />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-700 hover:text-slate-950 font-black underline transition-colors cursor-pointer"
            >
              Skip &amp; Continue on Web
            </button>
          </div>

        </div>
      </div>

      {/* Mobile-Only Big QR Code Modal (Layered on top, returns to previous modal on close) */}
      {showMobileQr && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm sm:hidden animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowMobileQr(false)}
        >
          <div 
            className="relative w-full max-w-[300px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 p-4 sm:p-5 flex flex-col items-center text-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header Bar: Clean Title & Non-overlapping Cross Button */}
            <div className="w-full flex items-center justify-between mb-3 pl-1">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {isCustomer ? "GoMyTruck QR" : "Partner App QR"}
              </span>
              <button
                type="button"
                onClick={() => setShowMobileQr(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 transition-all cursor-pointer active:scale-95 shrink-0"
                aria-label="Return to previous modal"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Responsive Aspect-Square QR Code Frame with balanced padding */}
            <div className="w-full aspect-square max-w-[240px] bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs flex items-center justify-center">
              {activeQr ? (
                <img 
                  src={activeQr} 
                  alt={isCustomer ? "GoMyTruck App QR" : "GoMyTruck Partner App QR"} 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-slate-400 font-bold">Loading QR...</span>
                </div>
              )}
            </div>

            {/* Centered Scan Prompt */}
            <div className="flex items-center justify-center gap-1.5 mt-3 text-slate-900 font-black text-xs">
              <Smartphone size={16} strokeWidth={2.5} className="text-amber-500 shrink-0" />
              <span>Scan with camera to install</span>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}
