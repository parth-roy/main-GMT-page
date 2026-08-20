import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Send, BadgeCheck, ShieldCheck, MapPin, X } from "lucide-react"
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

        {/* Bouncing Map Pin — centred perfectly in the middle */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer group"
          onClick={() => navigate('/driver-onboarding')}
          role="button"
          aria-label="Join our driver network"
        >
          {/* Pulse ring */}
          <span className="absolute -inset-3 rounded-full bg-orange-500/20 animate-ping group-hover:bg-orange-500/30" />

          {/* Pin button */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-500 shadow-xl shadow-orange-500/40 flex items-center justify-center animate-bounce group-hover:scale-110 transition-transform">
            <MapPin size={26} className="text-white" />
          </div>

          {/* Small label below pin */}
          <span className="mt-1 bg-white text-orange-600 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap transition-opacity duration-200">
            Join Now
          </span>
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
