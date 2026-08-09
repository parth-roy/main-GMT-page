import React from "react"
import { MessageCircle, PhoneCall, Truck } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export default function GlobalFABs() {
  const { pathname } = useLocation()
  const whatsappNumber = "919331488999"
  const whatsappMessage = encodeURIComponent(
    `Hello GoMyTruck 👋\n\nI am looking to book a truck. Here are my details:\n\n📍 Pickup Location: \n📍 Drop Location: \n📦 Goods Type: \n⚖ Approx Weight: \n🚚 Truck Required: \n📅 Loading Date & Time: \n💰 Budget (if any): \n👤 Contact Person: \n📞 Contact Number: \n\nPlease arrange a verified truck for me!`
  )
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(15,23,42,0.14)] md:hidden">
        <a
          href="tel:+919331488999"
          data-analytics-context={`mobile-sticky:${pathname}`}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-brand-600 bg-white px-3 py-2.5 text-sm font-extrabold text-brand-700"
          aria-label="Call GoMyTruck now"
        >
          <PhoneCall size={20} /> Call Now
        </a>
        <a
          href={whatsappLink}
          data-analytics-context={`mobile-sticky:${pathname}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0B6B2E] px-3 py-2.5 text-sm font-extrabold text-white"
          aria-label="Request a quote on WhatsApp"
        >
          <MessageCircle size={20} /> WhatsApp
        </a>
      </div>

      <div className="fixed bottom-8 right-8 z-50 hidden flex-col gap-4 items-end pointer-events-none md:flex">
      
      {/* WhatsApp FAB */}
      <a
        href={whatsappLink}
        data-analytics-context={`desktop-fab:${pathname}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto hover:-translate-y-1 transition-transform duration-300 flex items-center justify-center group relative drop-shadow-lg hover:drop-shadow-xl"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <img src="/whatsapp-fab.webp" alt="WhatsApp" className="w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] object-contain scale-110" />
        {/* Tooltip for desktop */}
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden sm:block">
          Chat on WhatsApp
        </span>
      </a>

      {/* Book a Truck FAB */}
      <Link
        to="/truck"
        className="pointer-events-auto bg-brand-600 hover:bg-brand-700 text-white p-3.5 sm:p-4 rounded-full shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group relative"
        aria-label="Book a Truck"
        title="Book a Truck"
      >
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
        <Truck size={28} className="relative z-10" />
        {/* Tooltip for desktop */}
        <span className="absolute right-full mr-4 bg-brand-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden sm:block">
          Book a Truck
        </span>
      </Link>

      </div>
    </>
  )
}
