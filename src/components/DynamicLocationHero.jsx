import React, { useState, useEffect, useRef } from "react"
import { ArrowRight, BadgePercent, Zap, Loader2, Star, ChevronRight, MapPin, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import CitySelectorModal from "./CitySelectorModal"
import EstimateResultModal from "./EstimateResultModal"
import { getGoogleMaps, geocodeGoogleAddress } from "./GoogleAddressAutocomplete"
import { fetchEstimate } from "../api/pricingApi"
import { useCity } from "../context/CityContext"
import { useAuth } from "../context/AuthContext"

// ─────────────────────────────────────────────
//  Custom SVG Icons matching Homepage design
// ─────────────────────────────────────────────
function SpeedTruckIcon({ className = "w-9 h-7 text-slate-950" }) {
  return (
    <svg viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2 8h8M1 14h11M3 20h7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M15 6h15v15H15V6z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M30 10h6l4 5v6h-10v-11z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M31.5 11.5h4.2l3 3.5h-7.2v-3.5z" fill="currentColor" fillOpacity="0.25" />
      <circle cx="21" cy="22.5" r="3.2" stroke="currentColor" strokeWidth="2.4" fill="white" />
      <circle cx="35" cy="22.5" r="3.2" stroke="currentColor" strokeWidth="2.4" fill="white" />
    </svg>
  )
}

function AttachTruckIcon({ className = "w-9 h-7 text-slate-950" }) {
  return (
    <svg viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M7 8h17v14H7V8z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M24 11h6l4 4.5v6.5h-10V11z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="13" cy="23.5" r="3.2" stroke="currentColor" strokeWidth="2.4" fill="white" />
      <circle cx="29" cy="23.5" r="3.2" stroke="currentColor" strokeWidth="2.4" fill="white" />
      <circle cx="33" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="2.2" fill="white" />
      <path d="M33 4.8v5.4M30.3 7.5h5.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function AgentIcon({ className = "w-6 h-6 text-[#f99f1b]" }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="10" cy="7" r="3.5" fill="currentColor" />
      <path d="M4 21c0-4 3-7 7-7h1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="21" cy="11" r="2.5" fill="currentColor" />
      <circle cx="21" cy="21" r="2.5" fill="currentColor" />
      <path d="M12.5 15.5l6-3.5M12.5 18l6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─────────────────────────────────────────────
//  Google Places Autocomplete Input Component
// ─────────────────────────────────────────────
function DynamicGooglePlacesInput({
  id,
  inputRef,
  placeholder,
  icon,
  borderColorClass = "focus-within:border-blue-500",
  value,
  onChange,
  onSelect,
}) {
  const [predictions, setPredictions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)
  const debounceRef = useRef(null)
  const sessionTokenRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    onChange(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!val.trim()) {
      setPredictions([])
      setIsOpen(false)
      return
    }

    setLoading(true)
    setIsOpen(true)

    debounceRef.current = setTimeout(async () => {
      try {
        const maps = await getGoogleMaps()
        const service = new maps.places.AutocompleteService()
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new maps.places.AutocompleteSessionToken()
        }

        service.getPlacePredictions(
          {
            input: val,
            sessionToken: sessionTokenRef.current,
            componentRestrictions: { country: "in" },
          },
          (results, status) => {
            if (status === maps.places.PlacesServiceStatus.OK && results) {
              setPredictions(
                results.map((p) => ({
                  placeId: p.place_id,
                  description: p.description,
                  mainText: p.structured_formatting?.main_text || p.description,
                  secondaryText: p.structured_formatting?.secondary_text || "",
                }))
              )
            } else {
              setPredictions([])
            }
            setLoading(false)
          }
        )
      } catch (err) {
        console.error("Autocomplete error:", err)
        setPredictions([])
        setLoading(false)
      }
    }, 250)
  }

  const handleSelectPrediction = async (prediction) => {
    setIsOpen(false)
    setPredictions([])
    onChange(prediction.description)

    try {
      const coords = await geocodeGoogleAddress(prediction.description)
      onSelect({
        address: prediction.description,
        lat: coords.lat,
        lng: coords.lng,
      })
    } catch {
      onSelect({
        address: prediction.description,
        lat: null,
        lng: null,
      })
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={`flex items-center gap-2.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 transition-all duration-200 ${borderColorClass}`}
      >
        {icon}
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (predictions.length > 0) setIsOpen(true)
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:outline-none"
        />
        {loading && <Loader2 size={14} className="animate-spin text-slate-400 shrink-0" />}
      </div>

      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl ring-1 ring-black/10 z-[100] overflow-hidden max-h-56 overflow-y-auto">
          {loading && predictions.length === 0 ? (
            <div className="flex items-center gap-2 p-3 text-xs text-slate-500">
              <Loader2 size={14} className="animate-spin text-orange-500" /> Searching locations...
            </div>
          ) : predictions.length > 0 ? (
            <ul role="listbox">
              {predictions.map((p) => (
                <li
                  key={p.placeId}
                  onClick={() => handleSelectPrediction(p)}
                  className="flex items-start gap-2.5 p-3 hover:bg-orange-50/60 active:bg-orange-100/70 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                >
                  <img
                    src="/google-maps-icon.webp"
                    alt="Location"
                    width={16}
                    height={16}
                    className="w-4 h-4 object-contain shrink-0 mt-0.5"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{p.mainText}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{p.secondaryText}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : value && value.trim() && !loading ? (
            <div className="p-3 text-xs text-slate-500 text-left">No matching locations found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
//  Main DynamicLocationHero Component (Light Mode)
// ─────────────────────────────────────────────
export default function DynamicLocationHero({
  city,
  slug,
  state,
  headline,
  subheadline,
  badgeText,
  pickupDefault,
  dropDefault = "",
  defaultVehicle = "truck",
}) {
  const navigate = useNavigate()
  const { currentCity, isDetecting: cityDetecting, setCity } = useCity()
  const { user, accessToken, setIsLoginModalOpen, openLoginModal } = useAuth()

  const activeCityName = city || currentCity?.name || "India"
  const activeState = state || currentCity?.state || currentCity?.region || "India"
  const activeSlug = slug || currentCity?.slug || "delhi"

  const [cityOpen, setCityOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeService, setActiveService] = useState(defaultVehicle)
  const [trailerImageIndex, setTrailerImageIndex] = useState(0)

  // Pickup & Drop address + coordinates
  const [pickup, setPickup] = useState(pickupDefault || activeCityName)
  const [pickupCoords, setPickupCoords] = useState(null)
  const [drop, setDrop] = useState(dropDefault)
  const [dropCoords, setDropCoords] = useState(null)

  // Loading, error, and estimate modal state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [estimateData, setEstimateData] = useState(null)
  const [showEstimateModal, setShowEstimateModal] = useState(false)

  // Input refs for direct focus from "Book Truck" click
  const pickupInputRef = useRef(null)
  const dropInputRef = useRef(null)

  const isLoggedIn = Boolean(accessToken || user || (typeof window !== "undefined" && localStorage.getItem("vahan_access_token")))

  // Update pickup if city changes and input wasn't customized
  useEffect(() => {
    if (pickupDefault) {
      setPickup(pickupDefault)
    } else if (city) {
      setPickup(city)
    }
  }, [city, pickupDefault])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Alternate trailer images with smooth transition every 2.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setTrailerImageIndex((prev) => (prev === 0 ? 1 : 0))
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  const handleAgentClick = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (isLoggedIn) {
      navigate('/agent/loads')
    } else {
      if (openLoginModal) {
        openLoginModal('MIDDLEMAN')
      } else {
        setIsLoginModalOpen(true)
      }
    }
  }

  const handleBookTruckClick = () => {
    if (pickupInputRef.current) {
      pickupInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      pickupInputRef.current.focus()
    }
  }

  const handleCheckFare = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    setError("")

    if (!pickup.trim()) {
      setError("Please enter a pickup location.")
      pickupInputRef?.current?.focus()
      return
    }
    if (!drop.trim()) {
      setError("Please enter a drop location.")
      dropInputRef?.current?.focus()
      return
    }

    setLoading(true)

    try {
      let pCoords = pickupCoords
      if (!pCoords || !pCoords.lat || !pCoords.lng) {
        pCoords = await geocodeGoogleAddress(pickup.trim())
        setPickupCoords(pCoords)
      }

      let dCoords = dropCoords
      if (!dCoords || !dCoords.lat || !dCoords.lng) {
        dCoords = await geocodeGoogleAddress(drop.trim())
        setDropCoords(dCoords)
      }

      let vehicleType = "MINI_TRUCK"
      if (activeService === "trailers") {
        vehicleType = "CONTAINER_32FT"
      } else if (activeService === "open_truck") {
        vehicleType = "TRUCK_14FT"
      } else {
        vehicleType = "MINI_TRUCK"
      }

      const estimate = await fetchEstimate({
        pickupLat: pCoords.lat,
        pickupLng: pCoords.lng,
        dropLat: dCoords.lat,
        dropLng: dCoords.lng,
        vehicleType,
      })

      setEstimateData({
        ...estimate,
        pickupAddress: pickup.trim(),
        dropAddress: drop.trim(),
        pickupLat: pCoords.lat,
        pickupLng: pCoords.lng,
        dropLat: dCoords.lat,
        dropLng: dCoords.lng,
        service: "truck",
        vehicle: {
          ...estimate.vehicle,
          vehicleType,
        },
      })
      setShowEstimateModal(true)
    } catch (err) {
      console.error("Fare calculation error:", err)
      setError(err.message || "Could not calculate fare. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-100/70 pt-28 sm:pt-32 pb-16 sm:pb-40 md:pb-44 lg:pb-48 flex flex-col justify-start items-center overflow-visible mb-16 sm:mb-36 md:mb-40 lg:mb-44 border-b border-slate-200/60">
        {/* Subtle grid pattern background in white mode */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-70 pointer-events-none" />

        {/* ── MOBILE HERO LAYOUT ── */}
        {isMobile ? (
          <div className="relative z-10 w-full px-4">
            <p className="text-[11px] font-bold text-orange-600 uppercase tracking-widest mb-1.5">
              MOVE GOODS. FIND LOADS. CONNECT.
            </p>

            <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight mb-2">
              {headline || `Truck Booking in ${activeCityName}`}
            </h1>

            <p className="text-sm font-semibold text-slate-600 mb-5">
              {subheadline || "How would you like to get started?"}
            </p>

            {/* CTA Row: Book Truck + Attach Truck */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={handleBookTruckClick}
                className="flex flex-col items-center justify-center gap-1.5 bg-[#f99f1b] hover:bg-[#e89010] active:scale-95 text-slate-950 font-black rounded-2xl py-4 px-3 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <SpeedTruckIcon className="w-10 h-8 text-slate-950 mb-0.5" />
                <span className="text-lg font-black text-slate-950 leading-tight text-center">Book Truck</span>
                <span className="text-xs font-semibold text-slate-900/80 leading-tight text-center">For customers</span>
              </button>

              <Link
                to="/fleet-partner-registration"
                className="flex flex-col items-center justify-center gap-1.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-950 font-black rounded-2xl py-4 px-3 border border-slate-200/90 shadow-md shadow-slate-900/5 transition-all cursor-pointer"
              >
                <AttachTruckIcon className="w-10 h-8 text-slate-950 mb-0.5" />
                <span className="text-lg font-black text-slate-950 leading-tight text-center">Attach Truck</span>
                <span className="text-xs font-semibold text-slate-500 leading-tight text-center">For drivers &amp; owners</span>
              </Link>
            </div>

            {/* GMT Agent Row Button */}
            <button
              onClick={handleAgentClick}
              className="w-full flex items-center gap-3 bg-white hover:bg-slate-50 active:scale-95 border-2 border-[#f99f1b] rounded-2xl px-4 py-3.5 transition-all mb-5 shadow-sm shadow-orange-500/10 cursor-pointer"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#fff4eb] shrink-0">
                <AgentIcon className="w-6 h-6 text-[#f99f1b]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-slate-950 font-black text-base leading-tight">GMT Agent</p>
                <p className="text-slate-500 text-xs font-medium leading-tight mt-0.5">Match loads with drivers. Earn commission.</p>
              </div>
              <ChevronRight size={20} className="text-[#f99f1b] shrink-0" />
            </button>

            {/* Mobile Estimate Card (Vertical) */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-visible relative z-20">
              <div className="px-4 pt-4 pb-3 overflow-visible">
                <h3 className="font-black text-slate-900 text-lg leading-tight mb-3">
                  Need a truck in {activeCityName}? Get an estimate
                </h3>

                {/* 3 service image selectors: Truck | Open Truck | Trailers */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    onClick={() => setActiveService("truck")}
                    className={`relative flex flex-col items-center justify-end rounded-xl overflow-hidden transition-all duration-200 pb-2 pt-1 ${
                      activeService === "truck"
                        ? "border-2 border-orange-500 bg-orange-50/60 shadow-sm shadow-orange-500/15"
                        : "border border-slate-200/60 bg-slate-50/50 hover:border-slate-300"
                    }`}
                    style={{ minHeight: 96 }}
                  >
                    <div className="w-full h-16 flex items-center justify-center">
                      <img
                        src="/hero-service-truck.webp"
                        alt="Truck"
                        width={120}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain object-center"
                      />
                    </div>
                    <span className={`text-[11px] font-bold mt-1 text-center px-1 leading-tight ${activeService === "truck" ? "text-orange-600" : "text-slate-700"}`}>
                      Truck
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveService("open_truck")}
                    className={`relative flex flex-col items-center justify-end rounded-xl overflow-hidden transition-all duration-200 pb-2 pt-1 ${
                      activeService === "open_truck"
                        ? "border-2 border-orange-500 bg-orange-50/60 shadow-sm shadow-orange-500/15"
                        : "border border-slate-200/60 bg-slate-50/50 hover:border-slate-300"
                    }`}
                    style={{ minHeight: 96 }}
                  >
                    <div className="w-full h-16 flex items-center justify-center p-0.5">
                      <img
                        src="/hero-service-open-truck.webp"
                        alt="Open Truck"
                        width={120}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain object-center scale-[0.96]"
                      />
                    </div>
                    <span className={`text-[11px] font-bold mt-1 text-center px-1 leading-tight ${activeService === "open_truck" ? "text-orange-600" : "text-slate-700"}`}>
                      Open Truck
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveService("trailers")}
                    className={`relative flex flex-col items-center justify-end rounded-xl overflow-hidden transition-all duration-200 pb-2 pt-1 ${
                      activeService === "trailers"
                        ? "border-2 border-orange-500 bg-orange-50/60 shadow-sm shadow-orange-500/15"
                        : "border border-slate-200/60 bg-slate-50/50 hover:border-slate-300"
                    }`}
                    style={{ minHeight: 96 }}
                  >
                    <div className="relative w-full h-16 flex items-center justify-center overflow-hidden p-0.5">
                      <img
                        src="/hero-service-trailer-1.webp"
                        alt="Trailers"
                        width={120}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className={`absolute inset-0 w-full h-full object-contain object-center scale-[0.96] transition-all duration-1000 ease-in-out ${
                          trailerImageIndex === 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                        }`}
                      />
                      <img
                        src="/hero-service-trailer-2.webp"
                        alt="Trailers"
                        width={120}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className={`absolute inset-0 w-full h-full object-contain object-center scale-[0.96] transition-all duration-1000 ease-in-out ${
                          trailerImageIndex === 1 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1"
                        }`}
                      />
                    </div>
                    <span className={`text-[11px] font-bold mt-1 text-center px-1 leading-tight ${activeService === "trailers" ? "text-orange-600" : "text-slate-700"}`}>
                      Trailers
                    </span>
                  </button>
                </div>

                {error && (
                  <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 rounded-lg px-3 py-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Pickup Input */}
                <div className="mb-2.5 relative z-30">
                  <DynamicGooglePlacesInput
                    id="mobile-dynamic-pickup-input"
                    inputRef={pickupInputRef}
                    placeholder="Pickup location"
                    icon={<MapPin size={18} className="text-blue-500 shrink-0" />}
                    borderColorClass="focus-within:border-blue-500"
                    value={pickup}
                    onChange={(val) => {
                      setPickup(val)
                      setError("")
                    }}
                    onSelect={(res) => {
                      setPickup(res.address)
                      setPickupCoords({ lat: res.lat, lng: res.lng })
                      setError("")
                      if (!drop) dropInputRef?.current?.focus()
                    }}
                  />
                </div>

                {/* Drop Input */}
                <div className="mb-4 relative z-20">
                  <DynamicGooglePlacesInput
                    id="mobile-dynamic-drop-input"
                    inputRef={dropInputRef}
                    placeholder="Drop location"
                    icon={<MapPin size={18} className="text-[#f99f1b] shrink-0" />}
                    borderColorClass="focus-within:border-orange-500"
                    value={drop}
                    onChange={(val) => {
                      setDrop(val)
                      setError("")
                    }}
                    onSelect={(res) => {
                      setDrop(res.address)
                      setDropCoords({ lat: res.lat, lng: res.lng })
                      setError("")
                    }}
                  />
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleCheckFare}
                  disabled={loading}
                  className="w-full bg-[#f99f1b] hover:bg-orange-500 disabled:bg-orange-400 active:scale-98 text-white font-black text-base py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/25 cursor-pointer relative z-10"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Calculating Fare &amp; Availability...
                    </>
                  ) : (
                    <>
                      Check Fare &amp; Availability
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── DESKTOP HERO LAYOUT ── */
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            {/* 5% Commission / Location Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-100/80 border border-orange-200 rounded-full px-4 py-1.5 mb-3 sm:mb-4 shadow-xs">
              <BadgePercent size={15} className="text-orange-600" />
              <span className="text-orange-950 font-bold text-xs sm:text-sm tracking-wide">
                {badgeText || `Serving ${activeCityName} & Surrounding Hubs — Flat 5% Commission`}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-xs">
              {headline || `Online Truck Booking & Goods Transport in ${activeCityName}`}
            </h1>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base lg:text-lg font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {subheadline || (
                <>
                  Connect directly with verified trucks across {activeState}.{" "}
                  <span className="text-orange-600 font-bold">No brokers. No surge pricing. No hidden fees.</span>
                </>
              )}
            </p>

            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-500 font-bold italic" lang="hi-Latn">
              Aasaan zariya, transport ka
            </p>

            {/* Row of 3 Action Cards */}
            <div className="mt-4 sm:mt-5 flex flex-col items-center gap-2.5 max-w-sm mx-auto">
              <div className="grid grid-cols-2 gap-3 w-full">
                {/* Book Truck */}
                <button
                  type="button"
                  onClick={handleBookTruckClick}
                  className="flex flex-col items-center justify-center gap-1 bg-[#f99f1b] hover:bg-[#e89010] active:scale-95 text-slate-950 font-black rounded-2xl py-3 px-3 shadow-md shadow-amber-500/25 transition-all cursor-pointer"
                >
                  <SpeedTruckIcon className="w-9 h-7 text-slate-950 mb-0.5" />
                  <span className="text-base sm:text-lg font-black text-slate-950 leading-tight text-center">Book Truck</span>
                  <span className="text-[11px] font-semibold text-slate-900/80 leading-tight text-center">For customers</span>
                </button>

                {/* Attach Truck */}
                <Link
                  to="/fleet-partner-registration"
                  className="flex flex-col items-center justify-center gap-1 bg-white hover:bg-slate-50 active:scale-95 text-slate-950 font-black rounded-2xl py-3 px-3 border border-slate-200/90 shadow-md shadow-slate-900/5 transition-all cursor-pointer"
                >
                  <AttachTruckIcon className="w-9 h-7 text-slate-950 mb-0.5" />
                  <span className="text-base sm:text-lg font-black text-slate-950 leading-tight text-center">Attach Truck</span>
                  <span className="text-[11px] font-semibold text-slate-500 leading-tight text-center">For drivers &amp; owners</span>
                </Link>
              </div>

              {/* GMT Agent */}
              <button
                onClick={handleAgentClick}
                className="w-full flex items-center gap-3 bg-white hover:bg-slate-50 active:scale-95 border-2 border-[#f99f1b] rounded-2xl px-3.5 py-2.5 transition-all shadow-sm shadow-orange-500/10 cursor-pointer"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#fff4eb] shrink-0">
                  <AgentIcon className="w-5 h-5 text-[#f99f1b]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-slate-950 font-black text-sm sm:text-base leading-tight">GMT Agent</p>
                  <p className="text-slate-500 text-[11px] font-medium leading-tight mt-0.5">Match loads with drivers. Earn commission.</p>
                </div>
                <ChevronRight size={18} className="text-[#f99f1b] shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ── FLOATING SERVICES BAR (Desktop only, Seated at Bottom) ── */}
        {!isMobile && (
          <div className="relative z-20 w-full px-4 flex justify-center mt-8 sm:mt-0 sm:absolute sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-1/2">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 sm:px-10 flex flex-col gap-4 sm:gap-5 border border-slate-200/80 w-full max-w-5xl">
              {/* Top Bar: City + Rating + Direct Driver */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200/70 pb-3.5">
                {/* Left: City Selector + Rating */}
                <div className="flex items-center gap-3 sm:gap-4 text-slate-900 font-bold text-lg sm:text-2xl px-1 sm:px-2 w-full sm:w-fit justify-between sm:justify-start">
                  <div
                    className="flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:text-orange-600 transition-colors group/city"
                    onClick={() => setCityOpen(true)}
                  >
                    <img
                      src="/google-maps-icon.webp"
                      alt="Location"
                      width={28}
                      height={28}
                      className="w-7 h-7 object-contain shrink-0 group-hover/city:scale-110 transition-transform drop-shadow-xs"
                    />
                    {cityDetecting ? (
                      <span className="flex items-center gap-2 text-slate-400 font-normal text-base sm:text-lg">
                        <Loader2 size={18} className="animate-spin" />
                        Detecting...
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="leading-tight">City: <strong className="text-orange-600 font-black tracking-tight">{activeCityName}</strong></span>
                        <span className="text-xs sm:text-sm font-bold bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300/80 px-2.5 py-0.5 rounded-lg shadow-xs transition-all hover:scale-105 active:scale-95">Change</span>
                      </div>
                    )}
                  </div>

                  <span className="text-slate-300 font-normal select-none text-xl sm:text-2xl">·</span>

                  <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-sm sm:text-base shrink-0">
                    <Star size={18} className="fill-amber-400 text-amber-400" />
                    <span>4.8</span>
                    <span className="text-slate-400 font-medium text-xs sm:text-sm">(15k+)</span>
                  </div>
                </div>

                {/* Right: Direct Driver / Partner Contact Button */}
                <div className="relative group/unlock">
                  <Link
                    to="/direct-driver-contact"
                    aria-label={`Direct Driver & Partner Contact in ${activeCityName} — Call 10 verified trucks for ₹99`}
                    className={[
                      "inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-xs sm:text-sm",
                      "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white",
                      "bg-[length:200%_auto] animate-[gradientShift_2.5s_linear_infinite]",
                      "shadow-[0_0_18px_rgba(245,158,11,0.45)]",
                      "hover:shadow-[0_0_28px_rgba(245,158,11,0.7)] transition-all duration-300",
                      "border border-amber-400/60 cursor-pointer relative overflow-hidden"
                    ].join(" ")}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/unlock:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                    <Zap className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-100" />
                    <span className="relative z-10 leading-tight">
                      Direct Driver / Partner Contact · <span className="line-through opacity-70">₹500</span> ₹99
                    </span>
                  </Link>
                </div>
              </div>

              {/* Horizontal Layout: 3 Vehicle Cards on Left, Inputs & Button on Right */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8 w-full pt-1">
                {/* Left: 3 Vehicle Service Cards */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  {/* 1. Truck */}
                  <button
                    type="button"
                    onClick={() => setActiveService("truck")}
                    className={`relative flex flex-col items-center justify-between w-28 sm:w-32 h-28 sm:h-32 rounded-2xl transition-all duration-200 p-2 cursor-pointer ${
                      activeService === "truck"
                        ? "border-2 border-orange-500 bg-orange-50/70 shadow-md shadow-orange-500/20"
                        : "border border-slate-200/80 bg-white hover:border-slate-300 shadow-xs hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="w-full flex-1 flex items-center justify-center">
                      <img
                        src="/hero-service-truck.webp"
                        alt="Truck"
                        width={120}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-16 object-contain object-center"
                      />
                    </div>
                    <span className={`text-xs font-bold text-center leading-tight ${activeService === "truck" ? "text-orange-600" : "text-slate-800"}`}>
                      Truck
                    </span>
                  </button>

                  {/* 2. Open Truck */}
                  <button
                    type="button"
                    onClick={() => setActiveService("open_truck")}
                    className={`relative flex flex-col items-center justify-between w-28 sm:w-32 h-28 sm:h-32 rounded-2xl transition-all duration-200 p-2 cursor-pointer ${
                      activeService === "open_truck"
                        ? "border-2 border-orange-500 bg-orange-50/70 shadow-md shadow-orange-500/20"
                        : "border border-slate-200/80 bg-white hover:border-slate-300 shadow-xs hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="w-full flex-1 flex items-center justify-center p-0.5">
                      <img
                        src="/hero-service-open-truck.webp"
                        alt="Open Truck"
                        width={120}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-16 object-contain object-center scale-[0.96]"
                      />
                    </div>
                    <span className={`text-xs font-bold text-center leading-tight ${activeService === "open_truck" ? "text-orange-600" : "text-slate-800"}`}>
                      Open Truck
                    </span>
                  </button>

                  {/* 3. Trailers */}
                  <button
                    type="button"
                    onClick={() => setActiveService("trailers")}
                    className={`relative flex flex-col items-center justify-between w-28 sm:w-32 h-28 sm:h-32 rounded-2xl transition-all duration-200 p-2 cursor-pointer ${
                      activeService === "trailers"
                        ? "border-2 border-orange-500 bg-orange-50/70 shadow-md shadow-orange-500/20"
                        : "border border-slate-200/80 bg-white hover:border-slate-300 shadow-xs hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden p-0.5">
                      <img
                        src="/hero-service-trailer-1.webp"
                        alt="Trailers"
                        width={120}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className={`absolute inset-0 w-full h-full object-contain object-center scale-[0.96] transition-all duration-1000 ease-in-out ${
                          trailerImageIndex === 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                        }`}
                      />
                      <img
                        src="/hero-service-trailer-2.webp"
                        alt="Trailers"
                        width={120}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className={`absolute inset-0 w-full h-full object-contain object-center scale-[0.96] transition-all duration-1000 ease-in-out ${
                          trailerImageIndex === 1 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1"
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-bold text-center leading-tight ${activeService === "trailers" ? "text-orange-600" : "text-slate-800"}`}>
                      Trailers
                    </span>
                  </button>
                </div>

                {/* Divider for desktop */}
                <div className="hidden lg:block w-px h-28 bg-slate-200/80 shrink-0" />

                {/* Right: Pickup + Drop inputs and Check Fare button */}
                <div className="flex-1 w-full lg:max-w-md flex flex-col gap-2.5">
                  {error && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 rounded-lg px-3 py-1.5">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="relative z-30">
                    <DynamicGooglePlacesInput
                      id="desktop-dynamic-pickup-input"
                      inputRef={pickupInputRef}
                      placeholder="Pickup location"
                      icon={<MapPin size={18} className="text-blue-500 shrink-0" />}
                      borderColorClass="focus-within:border-blue-500"
                      value={pickup}
                      onChange={(val) => {
                        setPickup(val)
                        setError("")
                      }}
                      onSelect={(res) => {
                        setPickup(res.address)
                        setPickupCoords({ lat: res.lat, lng: res.lng })
                        setError("")
                        if (!drop) dropInputRef?.current?.focus()
                      }}
                    />
                  </div>

                  <div className="relative z-20">
                    <DynamicGooglePlacesInput
                      id="desktop-dynamic-drop-input"
                      inputRef={dropInputRef}
                      placeholder="Drop location"
                      icon={<MapPin size={18} className="text-[#f99f1b] shrink-0" />}
                      borderColorClass="focus-within:border-orange-500"
                      value={drop}
                      onChange={(val) => {
                        setDrop(val)
                        setError("")
                      }}
                      onSelect={(res) => {
                        setDrop(res.address)
                        setDropCoords({ lat: res.lat, lng: res.lng })
                        setError("")
                      }}
                    />
                  </div>

                  <button
                    onClick={handleCheckFare}
                    disabled={loading}
                    className="w-full bg-[#f99f1b] hover:bg-orange-500 disabled:bg-orange-400 active:scale-98 text-white font-black text-sm sm:text-base py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/25 cursor-pointer relative z-10"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Calculating Fare &amp; Availability...
                      </>
                    ) : (
                      <>
                        Check Fare &amp; Availability
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* City Selector Modal */}
      <CitySelectorModal
        isOpen={cityOpen}
        onClose={() => setCityOpen(false)}
      />

      {/* Real Distance & Vehicle Selection Modal */}
      {showEstimateModal && estimateData && (
        <EstimateResultModal
          isOpen={showEstimateModal}
          onClose={() => setShowEstimateModal(false)}
          estimateData={estimateData}
        />
      )}
    </>
  )
}
