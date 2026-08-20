import React, { useState, useEffect, useRef } from "react"
import { MapPin, ChevronDown, ArrowRight, AlertCircle, Shield, CheckCircle } from "lucide-react"
import { SERVED_CITIES } from "../../api/pricingApi"
import AddressAutocomplete from "../AddressAutocomplete"
import { trackLead, trackWhatsAppClick } from "../../utils/analytics"

export default function PackersHero({ city, setCity }) {
  const [form, setForm] = useState({
    pickup: "",
    drop: "",
    pickupLat: null,
    pickupLng: null,
    dropLat: null,
    dropLng: null,
    name: "",
    phone: "",
    date: "",
  })
  const [error, setError] = useState("")
  const [today, setToday] = useState("")

  const [cityOpen, setCityOpen] = useState(false)
  const cityRef = useRef(null)

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0])
    function handleOutside(e) {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.pickup.trim()) return setError("Please enter a pickup address.")
    if (!form.drop.trim()) return setError("Please enter a drop address.")
    if (!form.date) return setError("Please select a moving date.")
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim()))
      return setError("Please enter a valid 10-digit Indian mobile number.")

    setError("")
    const text = `Hi GoMyTruck, I need a packers and movers quote in ${city}. Pickup: ${form.pickup}. Drop: ${form.drop}. Moving date: ${form.date}. Phone: ${form.phone}.`
    window.open(`https://wa.me/919331488999?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer")
    trackLead("packers_quote_whatsapp", "packers_and_movers")
    trackWhatsAppClick("packers_quote_form")
  }

  return (
    <>
      <section className="relative bg-slate-900 pb-48 pt-32 mb-40 mt-[52px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <picture className="block w-full h-full">
            <source type="image/webp" srcSet="/packer_movers/packer_movers_hero-640.webp 640w, /packer_movers/packer_movers_hero-960.webp 960w, /packer_movers/packer_movers_hero-1600.webp 1600w" sizes="100vw" />
          <img
            src="/packer_movers/packer_movers_hero-960.webp"
            alt={`Packers and Movers in ${city}`}
            width="1600"
            height="900"
            fetchpriority="high"
            className="w-full h-full object-cover object-top"
          />
          </picture>
          <div className="absolute inset-0 bg-slate-950/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-xl">
            Packers and Movers in {city}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-3xl drop-shadow-md">
            Share your route, moving date and inventory details to request a packing and moving quote in {city}.
          </p>
          <a href="#more" className="mt-8 text-white font-semibold underline underline-offset-4 decoration-2 hover:text-brand-300 transition-colors">
            See Pricing & Services
          </a>
        </div>

        {/* Floating Fare Estimate Card */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-20">
          <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] p-4 sm:p-5 flex flex-col border border-slate-100">

            {/* City Selector */}
            <div className="relative pb-2 border-b border-slate-100 mb-3" ref={cityRef}>
              <button
                type="button"
                onClick={() => setCityOpen((o) => !o)}
                className="flex items-center gap-2 text-slate-900 font-bold text-sm cursor-pointer w-fit hover:text-brand-600 transition-colors"
              >
                <MapPin size={18} className="text-brand-600 shrink-0" />
                <span>{city}</span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${cityOpen ? "rotate-180" : ""}`}
                />
              </button>

              {cityOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
                    Select city
                  </p>
                  <ul className="max-h-60 overflow-y-auto">
                    {SERVED_CITIES.map((c) => (
                      <li key={c}>
                        <button
                          type="button"
                          onClick={() => { setCity(c); setCityOpen(false) }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors
                            ${c === city
                              ? "bg-brand-600/5 text-brand-600 font-semibold"
                              : "text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                          <MapPin size={13} className={c === city ? "text-brand-600" : "text-slate-300"} />
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-3 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-3 py-2">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              
              <AddressAutocomplete
                label="Pickup Location *"
                placeholder="Where from?"
                onAddressSelect={(res) => setForm(prev => ({ ...prev, pickup: res.address, pickupLat: res.lat, pickupLng: res.lng }))}
              />

              <AddressAutocomplete
                label="Drop Location *"
                placeholder="Where to?"
                onAddressSelect={(res) => setForm(prev => ({ ...prev, drop: res.address, dropLat: res.lat, dropLng: res.lng }))}
              />

              <div className="flex flex-col">
                <label className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Moving Date *
                </label>
                <input
                  name="date"
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-700"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Phone *
                </label>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-col h-full justify-end">
                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand-500/20 active:scale-95 cursor-pointer whitespace-nowrap text-sm h-[38px]"
                >
                  Request Quote
                  <ArrowRight size={16} />
                </button>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-wide w-full">
                  <span className="flex items-center gap-1 whitespace-nowrap"><Shield size={10} className="text-emerald-500" /> Secure 256-bit Booking</span>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <span className="flex items-center gap-1 whitespace-nowrap"><CheckCircle size={10} className="text-blue-500" /> Verified Partners</span>
                </div>
              </div>

            </form>
          </div>
        </div>
      </section>

    </>
  )
}
