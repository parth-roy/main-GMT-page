import React, { useState, useEffect } from "react"
import { MapPin, ChevronDown, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { geocodeAddress, fetchEstimate, SERVICE_TO_VEHICLE_TYPE, detectCurrentCity, CITY_HERO_IMAGES } from "../../api/pricingApi"
import EstimateResultModal from "../EstimateResultModal"
import AddressAutocomplete from "../AddressAutocomplete"
import CitySelectorModal from "../CitySelectorModal"

const PERSON_TYPES = [
  { value: "",         label: "Choose" },
  { value: "personal", label: "Personal / Quick Delivery" },
  { value: "business", label: "Business / Commercial" },
]

export default function BikeHero({ city, setCity }) {
  const [form, setForm] = useState({ pickup: "", drop: "", name: "", phone: "", personType: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [estimateResult, setEstimateResult] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const [cityDetecting, setCityDetecting] = useState(true)
  const [cityOpen, setCityOpen] = useState(false)

  useEffect(() => {
    detectCurrentCity().then((detected) => {
      setCity(detected)
      setCityDetecting(false)
    })
  }, [setCity])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.pickup.trim()) return setError("Please enter a pickup address.")
    if (!form.drop.trim()) return setError("Please enter a drop address.")
    if (!form.name.trim()) return setError("Please enter your name.")
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim()))
      return setError("Please enter a valid 10-digit Indian mobile number.")

    setLoading(true)
    setError("")

    try {
      const [pickupCoords, dropCoords] = await Promise.all([
        geocodeAddress(form.pickup),
        geocodeAddress(form.drop),
      ])

      const estimate = await fetchEstimate({
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        dropLat: dropCoords.lat,
        dropLng: dropCoords.lng,
        vehicleType: SERVICE_TO_VEHICLE_TYPE.bike,
      })

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
        service: "bike",
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
            alt={`Online bike booking and goods transport services in ${city}`}
            className="w-full h-full object-cover object-center transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-slate-950/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-xl">
            Two-Wheeler Delivery Requests in {city}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200 font-medium leading-relaxed max-w-3xl drop-shadow-md">
            Request delivery for eligible documents and small parcels. Review route serviceability, the current estimate, and partner availability before confirming.
          </p>
          <a href="#more" className="mt-8 text-white font-semibold underline underline-offset-4 decoration-2 hover:text-brand-300 transition-colors">
            Know more
          </a>
        </div>

        {/* Floating Estimate Card */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[95%] xl:w-[90%] max-w-[1500px] z-20">
          <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] p-4 sm:p-5 flex flex-col border border-slate-100">

            {/* City Selector — triggers global CitySelectorModal (same as /truck page) */}
            <div className="pb-2 border-b border-slate-100 mb-3">
              <button
                type="button"
                onClick={() => setCityOpen(true)}
                className="flex items-center gap-2 text-slate-900 font-bold text-sm cursor-pointer w-fit hover:text-brand-600 transition-colors"
              >
                <MapPin size={18} className="text-brand-600 shrink-0" />
                {cityDetecting ? (
                  <span className="flex items-center gap-1.5 text-slate-400 font-normal">
                    <Loader2 size={13} className="animate-spin" />
                    Detecting…
                  </span>
                ) : (
                  <span>{city}</span>
                )}
                <ChevronDown size={14} className="text-slate-400 transition-transform duration-200" />
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-3 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-3 py-2">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">

              <AddressAutocomplete
                id="pickup-address-bike"
                autoComplete="street-address"
                label="Pickup Address *"
                placeholder="e.g. Park Street, Kolkata"
                onAddressSelect={(res) => setForm(prev => ({ ...prev, pickup: res.address, pickupCoords: { lat: res.lat, lng: res.lng } }))}
              />

              <AddressAutocomplete
                id="drop-address-bike"
                label="Drop Address *"
                placeholder="e.g. Salt Lake, Kolkata"
                onAddressSelect={(res) => setForm(prev => ({ ...prev, drop: res.address, dropCoords: { lat: res.lat, lng: res.lng } }))}
              />

              <div className="flex flex-col">
                <label htmlFor="name-bike" className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Name *</label>
                <input
                  id="name-bike"
                  name="name" type="text" value={form.name} onChange={handleChange}
                  placeholder="Your Full Name"
                  autoComplete="name"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone-bike" className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Phone *</label>
                <input
                  id="phone-bike"
                  name="phone" type="tel" value={form.phone} onChange={handleChange}
                  placeholder="10-digit mobile" maxLength={10}
                  autoComplete="tel-national"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="personType-bike" className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider truncate">What describes you? *</label>
                <div className="relative">
                  <select
                    id="personType-bike"
                    name="personType" value={form.personType} onChange={handleChange}
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
                  type="submit" disabled={loading}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand-500/20 active:scale-95 cursor-pointer whitespace-nowrap text-sm"
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" />Calculating...</>
                  ) : (
                    <>Get Estimate<ArrowRight size={16} /></>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* Global City Selector Modal — matches /truck page behavior */}
      <CitySelectorModal
        isOpen={cityOpen}
        onClose={() => setCityOpen(false)}
        onCitySelect={(selectedCity) => {
          setCity(selectedCity)
          setCityOpen(false)
        }}
      />

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
