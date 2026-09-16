import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { pushEvent, trackCallClick, trackWhatsAppClick } from "../utils/analytics"

export default function RouteAnalytics() {
  const location = useLocation()
  const [consent, setConsent] = useState(null)

  useEffect(() => {
    setConsent(localStorage.getItem("gomytruck_analytics_consent") || "pending")
  }, [])

  useEffect(() => {
    if (consent !== "granted") return

    const gtmId = import.meta.env.VITE_GTM_ID
    if (gtmId && !document.querySelector(`script[src*="${gtmId}"]`) && !document.querySelector(`script[data-gtm-id="${gtmId}"]`)) {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" })
      const script = document.createElement("script")
      script.async = true
      script.dataset.gtmId = gtmId
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`
      document.head.appendChild(script)
    }

    const clarityId = import.meta.env.VITE_CLARITY_ID
    const loadClarity = () => {
      if (!clarityId || document.querySelector(`script[data-clarity-id="${clarityId}"]`)) return
      window.clarity = window.clarity || function clarityQueue() {
        window.clarity.q = window.clarity.q || []
        window.clarity.q.push(arguments)
      }
      const script = document.createElement("script")
      script.async = true
      script.dataset.clarityId = clarityId
      script.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`
      document.head.appendChild(script)
    }
    if ("requestIdleCallback" in window) window.requestIdleCallback(loadClarity, { timeout: 3000 })
    else window.setTimeout(loadClarity, 1500)
  }, [consent])

  useEffect(() => {
    pushEvent("page_view", {
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [location.pathname])

  useEffect(() => {
    const handleContactClick = (event) => {
      const link = event.target.closest?.("a[href]")
      if (!link) return
      const href = link.getAttribute("href") || ""
      const context = link.dataset.analyticsContext || location.pathname

      if (href.startsWith("tel:")) trackCallClick(context)
      if (href.includes("wa.me/") || href.includes("api.whatsapp.com/")) {
        trackWhatsAppClick(context)
      }
    }

    document.addEventListener("click", handleContactClick)
    return () => document.removeEventListener("click", handleContactClick)
  }, [location.pathname])

  const saveConsent = (value) => {
    localStorage.setItem("gomytruck_analytics_consent", value)
    setConsent(value)
  }

  if (consent !== "pending") return null
  return (
    <aside className="fixed z-[100] bottom-24 md:bottom-5 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[min(720px,calc(100%-2rem))] rounded-2xl border border-slate-300 bg-white p-4 sm:p-5 shadow-2xl" aria-label="Analytics preferences">
      <div className="sm:flex sm:items-center sm:gap-5">
        <p className="text-sm text-slate-700 leading-6 flex-1">We use optional analytics to understand site performance and improve booking journeys. Essential site functions work without them. Read our <a href="/legal/privacy-policy" className="font-bold text-brand-700 underline">Privacy Policy</a>.</p>
        <div className="flex gap-2 mt-3 sm:mt-0 shrink-0">
          <button type="button" onClick={() => saveConsent("denied")} className="min-h-11 px-4 rounded-lg border border-slate-300 font-bold text-slate-700">Decline</button>
          <button type="button" onClick={() => saveConsent("granted")} className="min-h-11 px-4 rounded-lg bg-brand-600 text-white font-bold">Allow analytics</button>
        </div>
      </div>
    </aside>
  )
}
