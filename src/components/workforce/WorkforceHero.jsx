import React, { useState, useEffect } from "react"
import { Send, BadgeCheck, MapPin, X } from "lucide-react"
import { trackFleetRegistration } from "../../utils/analytics"
import { useAuth } from "../../context/AuthContext"

export default function WorkforceHero() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [role, setRole] = useState("Delivery Executive")
  const [isRegistered, setIsRegistered] = useState(false)
  const [regError, setRegError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { requireAuth } = useAuth()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!name || !phone || !city) {
      setRegError("Please fill out all the fields.")
      return
    }
    if (phone.length < 10) {
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

        // Send data to backend
        const response = await fetch("https://api-test.gomytruck.com/api/v1/leads", {
          method: "POST",
          headers,
          body: JSON.stringify({ name, phone, city, role })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong. Please try again.")
        }

        setIsRegistered(true)
        trackFleetRegistration(role)
      } catch (err) {
        setRegError(err.message)
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
    window.addEventListener('open_workforce_registration', openModal)
    return () => window.removeEventListener('open_workforce_registration', openModal)
  }, [])

  return (
    <>
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pt-16 sm:pt-20">
        {/* Full-width image, no crop */}
        <img
          src="/workforce-hero.webp"
          alt="GoMyTruck Workforce Professionals"
          className="w-full h-auto block"
          fetchpriority="high"
        />

        {/* Bouncing Map Pin — centred horizontally, ~30% from top of image */}
        <div
          className="absolute left-[42%] top-[28%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer group"
          onClick={() => setIsOpen(true)}
          role="button"
          aria-label="Join our workforce"
        >
          {/* Pulse ring */}
          <span className="absolute -inset-3 rounded-full bg-blue-500/20 animate-ping group-hover:bg-blue-500/30" />

          {/* Pin button */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-600 shadow-xl shadow-blue-500/40 flex items-center justify-center animate-bounce group-hover:scale-110 transition-transform">
            <MapPin size={30} className="text-white" />
          </div>

          {/* Small label below pin */}
          <span className="mt-1 bg-white text-blue-600 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap transition-opacity duration-200">
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
            className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>

            {isRegistered ? (
              /* ── Success State ── */
              <div className="text-center py-6 space-y-4">
                <div className="h-14 w-14 bg-blue-50 border border-blue-200 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <BadgeCheck size={30} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Application Received!</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Thanks, <span className="text-blue-600 font-semibold">{name}</span>. We'll call{" "}
                    <span className="text-blue-600 font-semibold">+91 {phone}</span> after review.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm text-left space-y-1">
                  <p className="font-semibold text-slate-700 mb-2">Keep these ready:</p>
                  <ul className="space-y-1 text-slate-500 list-disc list-inside text-xs">
                    <li>Aadhaar Card &amp; PAN Card</li>
                    <li>Bank Account Details</li>
                    <li>Driving License (if applying as Driver)</li>
                  </ul>
                </div>
                <button
                  onClick={() => { setIsRegistered(false); setName(""); setPhone(""); setCity("") }}
                  className="text-xs text-blue-500 hover:text-blue-700 font-semibold underline transition-colors"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Join Our Workforce</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Enter your details to get started.</p>
                </div>

                {regError && (
                  <div className="bg-red-50 border border-red-200 text-red-500 text-xs font-medium px-3 py-2 rounded-lg">
                    {regError}
                  </div>
                )}

                <div className="space-y-3">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      name="name"
                      autoComplete="name"
                      required
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phone}
                        name="phone"
                        autoComplete="tel-national"
                        inputMode="numeric"
                        required
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-12 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* City + Role */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kolkata"
                        value={city}
                        name="city"
                        autoComplete="address-level2"
                        required
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Role
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all cursor-pointer"
                      >
                        <option value="Delivery Executive">Delivery Exec.</option>
                        <option value="Driver">Driver</option>
                        <option value="Helper/Loader">Helper/Loader</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>{isLoading ? "Submitting..." : "Register Now"}</span>
                  {!isLoading && <Send size={15} className="transition-transform group-hover:translate-x-1" />}
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  By submitting, you agree to our{" "}
                  <a href="/legal/partner-terms" className="underline hover:text-slate-600">
                    Partner Terms
                  </a>{" "}
                  and consent to WhatsApp updates.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
