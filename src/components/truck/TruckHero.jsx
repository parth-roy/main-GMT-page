import React, { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { MapPin, ChevronDown, ArrowRight, Loader2, AlertCircle, Shield, CheckCircle, BadgePercent } from "lucide-react"
import { fetchEstimate, SERVICE_TO_VEHICLE_TYPE, detectCurrentCity, SERVED_CITIES, CITY_HERO_IMAGES } from "../../api/pricingApi"
import EstimateResultModal from "../EstimateResultModal"
import GoogleAddressAutocomplete, { geocodeGoogleAddress } from "../GoogleAddressAutocomplete"
import CitySelectorModal from "../CitySelectorModal"

const PERSON_TYPES = [
  { value: "", label: "Choose" },
  { value: "personal", label: "Personal / House Shifting" },
  { value: "business", label: "Business / Commercial" },
]

// city + setCity are lifted to TruckPage so AreasWeServe can react to the same value
export default function TruckHero({ city, setCity }) {
  const location = useLocation()
  
  const [form, setForm] = useState({
    pickup: "",
    drop: "",
    name: "",
    phone: "",
    personType: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [estimateResult, setEstimateResult] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // City selector state
  const [cityDetecting, setCityDetecting] = useState(true)
  const [cityOpen, setCityOpen] = useState(false)
  const cityRef = useRef(null)

  // Auto-detect city on mount via geolocation + reverse-geocode, unless overridden via state
  useEffect(() => {
    if (location.state?.selectedCity) {
      setCity(location.state.selectedCity)
      setCityDetecting(false)
    } else {
      detectCurrentCity().then((detected) => {
        setCity(detected)
        setCityDetecting(false)
      })
    }
  }, [setCity, location.state?.selectedCity])

  // Close city dropdown on outside click
  useEffect(() => {
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

    // Basic validation
    if (!form.pickup.trim()) return setError("Please enter a pickup address.")
    if (!form.drop.trim()) return setError("Please enter a drop address.")
    if (!form.name.trim()) return setError("Please enter your name.")
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim()))
      return setError("Please enter a valid 10-digit Indian mobile number.")

    setLoading(true)
    setError("")

    try {
      // 1. Geocode both addresses
      const [pickupCoords, dropCoords] = await Promise.all([
        geocodeGoogleAddress(form.pickup),
        geocodeGoogleAddress(form.drop),
      ])

      // 2. Fetch real estimate from server
      const estimate = await fetchEstimate({
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        dropLat: dropCoords.lat,
        dropLng: dropCoords.lng,
        vehicleType: SERVICE_TO_VEHICLE_TYPE.truck,
      })

      // 3. Show result modal
      setEstimateResult({
        ...estimate,
        pickupAddress: form.pickup,
        dropAddress: form.drop,
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        dropLat: dropCoords.lat,
        dropLng: dropCoords.lng,
        name: form.name,
        phone: form.phone,
        personType: form.personType,
        service: "truck",
      })
      setShowResult(true)
    } catch (err) {
      setError(err.message || "Could not calculate estimate. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="relative bg-slate-900 pb-40 pt-24 mb-40 mt-[52px]">
        {/* Background — real city landmark photo, changes with selected city */}
        <div className="absolute inset-0 z-0">
          <img
            key={city}
            src={CITY_HERO_IMAGES[city] || "/hero-bg.webp"}
            alt={`${city} landmark`}
            className="w-full h-full object-cover object-center transition-opacity duration-700"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-slate-950/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* 5% Commission Badge */}
          <div className="mb-6 inline-flex items-center gap-2 bg-brand-600/20 border border-brand-400/40 rounded-full px-4 py-1.5">
            <BadgePercent size={16} className="text-brand-300" />
            <span className="text-brand-200 font-bold text-sm tracking-wide">Only 5% Commission — No Broker Margin</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-xl">
            Online Mini Truck Booking in {city}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200 font-medium leading-relaxed max-w-3xl drop-shadow-md">
            Enter the route and goods details, review the current estimate, and confirm a request. Vehicle assignment and timing depend on serviceability and partner availability.
          </p>
          <a href="#more" className="mt-8 text-white font-semibold underline underline-offset-4 decoration-2 hover:text-brand-300 transition-colors">
            Know more
          </a>
        </div>

        {/* Floating Fare Estimate Card */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[95%] xl:w-[90%] max-w-[1500px] z-20">
          <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] p-4 sm:p-5 flex flex-col border border-slate-100">

            {/* City Selector */}
            <div className="relative pb-2 border-b border-slate-100 mb-3">
              <button
                type="button"
                onClick={() => setCityOpen(true)}
                className="flex items-center gap-2 text-slate-900 font-bold text-sm cursor-pointer w-fit hover:text-brand-600 transition-colors"
              >
                <MapPin size={18} className="text-brand-600 shrink-0" />
                {cityDetecting ? (
                  <span className="flex items-center gap-1.5 text-slate-400 font-normal">
                    <Loader2 size={13} className="animate-spin" />
                    Detecting...
                  </span>
                ) : (
                  <span>{city}</span>
                )}
                <ChevronDown
                  size={14}
                  className="text-slate-400"
                />
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-3 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-3 py-2">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
              
              <GoogleAddressAutocomplete
                id="pickup-address-truck"
                autoComplete="street-address"
                label="Pickup Address *"
                placeholder="e.g. Park Street, Kolkata"
                onAddressSelect={(res) => setForm(prev => ({ ...prev, pickup: res.address, pickupCoords: { lat: res.lat, lng: res.lng } }))}
              />

              <GoogleAddressAutocomplete
                id="drop-address-truck"
                label="Drop Address *"
                placeholder="e.g. Salt Lake, Kolkata"
                onAddressSelect={(res) => setForm(prev => ({ ...prev, drop: res.address, dropCoords: { lat: res.lat, lng: res.lng } }))}
              />

              <div className="flex flex-col">
                <label htmlFor="name-truck" className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Name *
                </label>
                <input
                  id="name-truck"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  autoComplete="name"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone-truck" className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Phone *
                </label>
                <input
                  id="phone-truck"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  autoComplete="tel-national"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="personType-truck" className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider truncate">
                  What describes you? *
                </label>
                <div className="relative">
                  <select
                    id="personType-truck"
                    name="personType"
                    value={form.personType}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm appearance-none focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-600"
                  >
                    {PERSON_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col h-full justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand-500/20 active:scale-95 cursor-pointer whitespace-nowrap text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      Get Estimate
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-wide">
                  <span className="flex items-center gap-1"><Shield size={10} className="text-emerald-500" /> Secure 256-bit Booking</span>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <span className="flex items-center gap-1"><CheckCircle size={10} className="text-blue-500" /> Verified Partners</span>
                </div>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* Global City Selector Modal */}
      <CitySelectorModal 
        isOpen={cityOpen} 
        onClose={() => setCityOpen(false)} 
        onCitySelect={(cityName) => {
          setCity(cityName)
        }}
      />

      {/* Estimate Result Modal */}
      {showResult && estimateResult && (
        <EstimateResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          estimateData={estimateResult}
        />
      )}
    </>
  )
}
