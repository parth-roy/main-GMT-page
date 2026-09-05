import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Send, BadgeCheck, ShieldCheck, MapPin, X, Zap, ArrowRight, Truck } from "lucide-react"
import { trackFleetRegistration } from "../utils/analytics"
import { useAuth } from "../context/AuthContext"

export default function PartnerHero({ isFleetOwner = false }) {
  const navigate = useNavigate();
  const [driverName, setDriverName] = useState("")
  const [driverPhone, setDriverPhone] = useState("")
  const [driverCity, setDriverCity] = useState("")
  const [vehicleType, setDriverVehicle] = useState("Tata Ace")
  const [isRegistered, setIsRegistered] = useState(false)
  const [regError, setRegError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  const { requireAuth } = useAuth()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!driverName || !driverPhone || !driverCity) {
      setRegError("Please fill out all the fields.")
      return
    }
    if (driverPhone.length < 10) {
      setRegError("Please enter a valid 10-digit phone number.")
      return
    }
    setRegError("")
    setIsLoading(true)
    requireAuth(async (token) => {
      try {
        const headers = { "Content-Type": "application/json" }
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }
        
        const response = await fetch("https://api-test.gomytruck.com/api/v1/leads", {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: driverName.trim(),
            phone: driverPhone,
            city: driverCity.trim(),
            role: `${isFleetOwner ? "Fleet Owner" : "Driver Partner"} - ${vehicleType}`,
          }),
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.message || "We could not submit your application. Please try again.")
        setIsRegistered(true)
        trackFleetRegistration(vehicleType)
      } catch (error) {
        setRegError(error.message)
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const openModal = () => setIsOpen(true)
    window.addEventListener('open_partner_registration', openModal)
    return () => window.removeEventListener('open_partner_registration', openModal)
  }, [])

  return (
    <>
      <h1 className="sr-only">
        {isFleetOwner 
          ? "Attach Your Fleet & Grow Your Transport Business - GoMyTruck Fleet Partner" 
          : "Attach Your Vehicle & Earn From Completed Trips - GoMyTruck Driver Partner"}
      </h1>
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] pt-16 sm:pt-20 flex flex-col justify-end items-center bg-slate-900 overflow-visible">
        
        {/* Full-bleed Video Background with dark overlay for white text contrast */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            poster="/hero-bg-960.webp"
            className="h-full w-full object-cover object-center"
          >
            <source src="/hero-video.webm" type="video/webm" />
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-slate-900/40"></div>
        </div>

        {/* Wide Glowing Interactive Join Card — Centred perfectly in the hero */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[92%] max-w-lg sm:max-w-xl md:max-w-2xl cursor-pointer group"
          onClick={() => navigate('/driver-onboarding')}
          role="button"
          aria-label={isFleetOwner ? "Attach your fleet to GoMyTruck" : "Attach your vehicle to GoMyTruck"}
        >
          {/* Ambient Breathing Warm Glow Halo */}
          <div className="absolute -inset-1 sm:-inset-1.5 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500" />

          {/* Warm Amber/Orange Promotional Card Container */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-300/90 bg-gradient-to-br from-amber-50/95 via-orange-50/95 to-amber-100/95 backdrop-blur-md p-6 sm:p-8 text-center shadow-2xl shadow-amber-500/25 group-hover:shadow-amber-500/40 group-hover:border-amber-400 transition-all duration-500">
            
            {/* Decorative Corner Glow Blobs */}
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 sm:w-44 h-36 sm:h-44 rounded-full bg-gradient-to-br from-amber-300/35 to-orange-300/25 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-36 sm:w-44 h-36 sm:h-44 rounded-full bg-gradient-to-tr from-yellow-300/35 to-amber-200/35 blur-2xl pointer-events-none" />

            {/* Top Category Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm mb-3 sm:mb-3.5 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
              <span>{isFleetOwner ? "Fleet Partner Network · Attach & Grow" : "Driver Partner Program · Zero Commission"}</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-slate-900 tracking-tight leading-snug">
              {isFleetOwner ? (
                <>
                  Attach Your Fleet &{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                    Grow Your Transport Business
                  </span>
                </>
              ) : (
                <>
                  Attach Your Vehicle &{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                    Start Earning Daily
                  </span>
                </>
              )}
            </h2>

            {/* Description */}
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed max-w-xl mx-auto font-medium">
              {isFleetOwner ? (
                <>
                  Connect your 14ft, 20ft, 32ft container trucks, Tata Ace, or pickups directly to verified industrial consignors across India.{" "}
                  <strong className="text-emerald-700 font-bold">0% broker cuts</strong>, high-frequency loads, and guaranteed digital settlements.
                </>
              ) : (
                <>
                  Attach your Tata Ace, Mahindra Bolero, Pickup, or Truck. Get direct verified booking leads in your local hub,{" "}
                  <strong className="text-emerald-700 font-bold">0% commission deductions</strong>, and fast on-time payouts.
                </>
              )}
            </p>

            {/* Trust Badges Row */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {isFleetOwner ? (
                <>
                  <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-amber-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                    <BadgeCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Pan-India Verified Loads
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-amber-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                    <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Direct Consignor Rates
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-amber-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                    <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    24/7 Fleet Support
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-amber-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                    <BadgeCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    0% Commission Cut
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-amber-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                    <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Instant Trip Settlement
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-amber-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                    <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Direct Customer Bookings
                  </span>
                </>
              )}
            </div>

            {/* Action CTA Button & Status */}
            <div className="mt-5 sm:mt-6 flex flex-col items-center gap-2.5">
              <span className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm sm:text-base md:text-lg px-8 py-3.5 sm:py-4 rounded-2xl transition-all shadow-xl shadow-amber-300/80 hover:shadow-2xl hover:scale-105 active:scale-95 text-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current animate-bounce" />
                <span>{isFleetOwner ? "Attach Fleet Now" : "Attach Vehicle & Join Now"}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
              </span>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isFleetOwner ? "Direct consignor loads · 0% broker fee · Instant activation" : "Instant verification · 0% commission cut · Daily payouts"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal Popup ──────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

          {/* Modal card — white/light, compact */}
          <div
            className="relative z-10 bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>

            {isRegistered ? (
              <div className="text-center py-6 space-y-4">
                <div className="h-14 w-14 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg shadow-green-500/20">
                  <BadgeCheck size={30} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-extrabold text-white">Application Received!</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Thank you, <span className="text-green-400 font-semibold">{driverName}</span>. Our onboarding team will review the application and contact <span className="text-green-400 font-semibold">+91 {driverPhone}</span> when the relevant capacity is available.
                  </p>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl text-xs space-y-2 text-left">
                  <p className="font-semibold text-white">Please prepare these documents:</p>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside marker:text-green-400">
                    <li>Aadhaar Card & PAN Card</li>
                    <li>Driving License (DL)</li>
                    <li>Vehicle Registration Certificate (RC)</li>
                    <li>Bank Details</li>
                  </ul>
                </div>
                <button 
                  onClick={() => { setIsRegistered(false); setDriverName(""); setDriverPhone(""); setDriverCity(""); }}
                  className="text-xs text-green-400 hover:text-green-300 font-bold underline transition-colors"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <h3 className="text-lg font-display font-bold text-white tracking-tight">Partner Registration</h3>
                  <p className="text-xs text-slate-300 mt-1">Enter your details and our team will call you back.</p>
                </div>

                {regError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium px-3 py-2 rounded-lg">
                    {regError}
                  </div>
                )}

                <div className="space-y-3">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text" placeholder="e.g. Ramesh Kumar" value={driverName}
                      name="name" autoComplete="name" required
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">+91</span>
                      <input
                        type="tel" maxLength={10} placeholder="98765 43210" value={driverPhone}
                        name="phone" autoComplete="tel-national" inputMode="numeric" required
                        onChange={(e) => setDriverPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-12 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* City */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">City</label>
                      <input
                        type="text" placeholder="e.g. Kolkata" value={driverCity}
                        name="city" autoComplete="address-level2" required
                        onChange={(e) => setDriverCity(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all"
                      />
                    </div>
                    {/* Vehicle */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vehicle</label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setDriverVehicle(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all cursor-pointer appearance-none"
                      >
                        <option className="bg-slate-800" value="Two Wheeler">Bike</option>
                        <option className="bg-slate-800" value="3-Wheeler Auto">3-Wheeler Auto</option>
                        <option className="bg-slate-800" value="Tata Ace">Tata Ace</option>
                        <option className="bg-slate-800" value="Bolero Pickup">Bolero Pickup</option>
                        <option className="bg-slate-800" value="Eicher / Heavy">Heavy Truck</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-green-500 hover:bg-green-400 text-slate-900 font-bold text-sm py-3 px-4 rounded-xl shadow-md shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{isLoading ? "Submitting…" : "Register Now"}</span>
                  {!isLoading && <Send size={16} className="transition-transform group-hover:translate-x-1" />}
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-relaxed font-medium">
                  By submitting, you agree to our <a href="/legal/partner-terms" className="underline hover:text-white">Partner Terms</a> and <a href="/legal/privacy-policy" className="underline hover:text-white">Privacy Policy</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
