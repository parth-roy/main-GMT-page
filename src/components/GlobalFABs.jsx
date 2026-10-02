import React, { useState, useEffect, useRef } from "react"
import { MessageCircle, PhoneCall, Truck, MoreHorizontal, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export default function GlobalFABs() {
  const { pathname } = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const menuRef = useRef(null)

  const whatsappNumber = "919331488999"
  const whatsappMessage = encodeURIComponent(
    `Hello GoMyTruck 👋\n\nI am looking to book a truck. Here are my details:\n\n📍 Pickup Location: \n📍 Drop Location: \n📦 Goods Type: \n⚖ Approx Weight: \n🚚 Truck Required: \n📅 Loading Date & Time: \n💰 Budget (if any): \n👤 Contact Person: \n📞 Contact Number: \n\nPlease arrange a verified truck for me!`
  )
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  // Observe active modals in DOM or body overflow
  useEffect(() => {
    const checkModal = () => {
      const hasModal = 
        document.body.getAttribute("data-modal-open") === "true" ||
        document.body.style.overflow === "hidden" ||
        Boolean(document.querySelector("[data-modal-open='true']")) ||
        Boolean(document.querySelector("[role='dialog']")) ||
        Boolean(document.querySelector(".modal-open"))

      setIsModalOpen(Boolean(hasModal))
      if (!hasModal) setIsExpanded(false)
    }

    checkModal()

    const observer = new MutationObserver(checkModal)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "data-modal-open", "class"],
      childList: true,
      subtree: true,
    })

    window.addEventListener("modal-open", checkModal)
    window.addEventListener("modal-close", checkModal)

    return () => {
      observer.disconnect()
      window.removeEventListener("modal-open", checkModal)
      window.removeEventListener("modal-close", checkModal)
    }
  }, [])

  // Close floating horizontal menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsExpanded(false)
      }
    }
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isExpanded])

  return (
    <>
      {/* ── MOBILE: WHEN A MODAL IS ACTIVE ──
          Compress to a floating circular 3-dot button in white mode on the right side above the bottom bar.
          When tapped, expands VERTICALLY upward to reveal Talk to Drivers and WhatsApp buttons with desktop icons. */}
      {isModalOpen ? (
        <div ref={menuRef} className="fixed bottom-24 right-4 z-[160] flex flex-col items-center gap-3.5 md:hidden pointer-events-auto">
          {/* Vertical expansion speed-dial (animated upwards) */}
          <div
            className={`flex flex-col items-center gap-3.5 transition-all duration-300 ease-out origin-bottom ${
              isExpanded
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {/* WhatsApp Floating Icon (20% bigger: w-14 h-14) */}
            <a
              href={whatsappLink}
              data-analytics-context={`mobile-sticky-modal:${pathname}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsExpanded(false)}
              className="relative flex items-center justify-center w-14 h-14 active:scale-95 transition-transform"
              aria-label="WhatsApp Support"
              title="WhatsApp Support"
            >
              <div className="absolute inset-1 bg-[#25D366]/40 rounded-full animate-ping opacity-75 pointer-events-none"></div>
              <img
                src="/whatsapp-fab.webp"
                alt="WhatsApp"
                className="relative z-10 w-full h-full object-contain drop-shadow-xl scale-110"
              />
            </a>

            {/* Talk to Drivers Floating Icon (20% bigger: w-14 h-14) */}
            <Link
              to="/direct-driver-contact?openModal=true"
              data-analytics-context={`mobile-sticky-modal:${pathname}`}
              onClick={() => setIsExpanded(false)}
              className="relative flex items-center justify-center w-14 h-14 active:scale-95 transition-transform"
              aria-label="Talk to Drivers"
              title="Talk to Drivers"
            >
              <div className="absolute inset-1 bg-brand-600/40 rounded-full animate-ping opacity-75 pointer-events-none"></div>
              <img
                src="/truck-icon.webp"
                alt="Talk to Drivers"
                className="relative z-10 w-full h-full object-contain drop-shadow-xl scale-110"
              />
            </Link>
          </div>

          {/* 3-Dot Floating Trigger Button in White Mode (decreases in size with smaller cross when expanded) */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`rounded-full shadow-[0_6px_25px_rgba(0,0,0,0.2)] flex items-center justify-center border-2 active:scale-95 transition-all duration-200 cursor-pointer ${
              isExpanded
                ? "w-10 h-10 bg-slate-100 text-slate-700 border-slate-300"
                : "w-12 h-12 bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50"
            }`}
            aria-label="Contact options"
            title={isExpanded ? "Close options" : "Contact Drivers & WhatsApp"}
          >
            {isExpanded ? (
              <X size={16} className="stroke-[2.2]" />
            ) : (
              <MoreHorizontal size={24} className="stroke-[2.5]" />
            )}
          </button>
        </div>
      ) : (
        /* ── MOBILE NORMAL STATE: Fixed 2-column bottom bar ── */
        <div className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(15,23,42,0.14)] md:hidden">
          <Link
            to="/direct-driver-contact?openModal=true"
            data-analytics-context={`mobile-sticky:${pathname}`}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-brand-600 bg-white px-3 py-2.5 text-sm font-extrabold text-brand-700 active:scale-95 transition-transform"
            aria-label="Talk to Drivers"
          >
            <PhoneCall size={20} /> Talk to Drivers
          </Link>
          <a
            href={whatsappLink}
            data-analytics-context={`mobile-sticky:${pathname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0B6B2E] px-3 py-2.5 text-sm font-extrabold text-white active:scale-95 transition-transform"
            aria-label="Request a quote on WhatsApp"
          >
            <MessageCircle size={20} /> WhatsApp
          </a>
        </div>
      )}

      {/* ── DESKTOP FABS (Unchanged) ── */}
      <div className="fixed bottom-8 right-8 z-50 hidden flex-col gap-4 items-end pointer-events-none md:flex">
        {/* WhatsApp FAB */}
        <a
          href={whatsappLink}
          data-analytics-context={`desktop-fab:${pathname}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto hover:-translate-y-1 transition-transform duration-300 flex items-center justify-center group relative drop-shadow-lg hover:drop-shadow-xl rounded-full"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <div className="absolute inset-1 sm:inset-2 bg-[#25D366]/40 rounded-full animate-ping opacity-75 z-0"></div>
          <img src="/whatsapp-fab.webp" alt="WhatsApp" className="relative z-10 w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] object-contain scale-110" />
          <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden sm:block">
            Chat on WhatsApp
          </span>
        </a>

        {/* Book a Truck FAB */}
        <Link
          to="/truck"
          className="pointer-events-auto hover:-translate-y-1 transition-transform duration-300 flex items-center justify-center group relative drop-shadow-lg hover:drop-shadow-xl rounded-full"
          aria-label="Book a Truck"
          title="Book a Truck"
        >
          <div className="absolute inset-1 sm:inset-2 bg-brand-600/40 rounded-full animate-ping opacity-75 z-0"></div>
          <img src="/truck-icon.webp" alt="Truck" className="relative z-10 w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] object-contain scale-110" />
          <span className="absolute right-full mr-4 bg-brand-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden sm:block">
            Book a Truck
          </span>
        </Link>
      </div>
    </>
  )
}
