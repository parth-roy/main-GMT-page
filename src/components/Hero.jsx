import React, { useState, useEffect, useRef } from "react"
import { ArrowRight, ShieldCheck, BadgePercent, Zap, TrendingUp, Loader2, Star, ChevronRight, MapPin, Navigation, AlertCircle } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import CitySelectorModal from "./CitySelectorModal"
import EstimateResultModal from "./EstimateResultModal"
import { getGoogleMaps, geocodeGoogleAddress } from "./GoogleAddressAutocomplete"
import { fetchEstimate } from "../api/pricingApi"
import { useCity } from "../context/CityContext"
import { useAuth } from "../context/AuthContext"

// ─────────────────────────────────────────────
//  Custom SVG Icons matching reference design
// ─────────────────────────────────────────────
function SpeedTruckIcon({ className = "w-9 h-7 text-slate-950" }) {
  return (
    <svg viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Motion / speed lines behind truck */}
      <path d="M2 8h8M1 14h11M3 20h7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      {/* Cargo container body */}
      <path d="M15 6h15v15H15V6z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      {/* Cab outline */}
      <path d="M30 10h6l4 5v6h-10v-11z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      {/* Windshield */}
      <path d="M31.5 11.5h4.2l3 3.5h-7.2v-3.5z" fill="currentColor" fillOpacity="0.25" />
      {/* Wheels */}
      <circle cx="21" cy="22.5" r="3.2" stroke="currentColor" strokeWidth="2.4" fill="white" />
      <circle cx="35" cy="22.5" r="3.2" stroke="currentColor" strokeWidth="2.4" fill="white" />
    </svg>
  )
}

function AttachTruckIcon({ className = "w-9 h-7 text-slate-950" }) {
  return (
    <svg viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cargo body */}
      <path d="M7 8h17v14H7V8z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      {/* Cab outline */}
      <path d="M24 11h6l4 4.5v6.5h-10V11z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      {/* Wheels */}
      <circle cx="13" cy="23.5" r="3.2" stroke="currentColor" strokeWidth="2.4" fill="white" />
      <circle cx="29" cy="23.5" r="3.2" stroke="currentColor" strokeWidth="2.4" fill="white" />
      {/* Plus (+) circle badge on top right */}
      <circle cx="33" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="2.2" fill="white" />
      <path d="M33 4.8v5.4M30.3 7.5h5.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function AgentIcon({ className = "w-6 h-6 text-[#f99f1b]" }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Head */}
      <circle cx="10" cy="7" r="3.5" fill="currentColor" />
      {/* Body */}
      <path d="M4 21c0-4 3-7 7-7h1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Network branching nodes */}
      <circle cx="21" cy="11" r="2.5" fill="currentColor" />
      <circle cx="21" cy="21" r="2.5" fill="currentColor" />
      <path d="M12.5 15.5l6-3.5M12.5 18l6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─────────────────────────────────────────────
//  Desktop hero – service tabs (original images)
// ─────────────────────────────────────────────
const SERVICES_DESKTOP = [
  { id: "truck",  name: "Truck",            imgSrc: "/navy_truck-256.webp" },
  { id: "bike",   name: "Two Wheeler",      imgSrc: "/navy_bike-256.webp"  },
  { id: "movers", name: "Packers & Movers", imgSrc: "/navy_movers-256.webp" },
]

// ─────────────────────────────────────────────
//  Google Places Autocomplete Input for Hero
// ─────────────────────────────────────────────
function HeroGooglePlacesInput({
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
    }, 280)
  }

  const handleSelectPrediction = async (prediction) => {
    onChange(prediction.description)
    setIsOpen(false)
    setPredictions([])

    try {
      const maps = await getGoogleMaps()
      const placesService = new maps.places.PlacesService(document.createElement("div"))

      placesService.getDetails(
        {
          placeId: prediction.placeId,
          fields: ["geometry", "formatted_address"],
          sessionToken: sessionTokenRef.current,
        },
        (place, status) => {
          sessionTokenRef.current = null
          if (status === maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            onSelect({
              address: place.formatted_address || prediction.description,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            })
          } else {
            onSelect({
              address: prediction.description,
              lat: null,
              lng: null,
            })
          }
        }
      )
    } catch (err) {
      console.error("Place details error:", err)
      sessionTokenRef.current = null
      onSelect({
        address: prediction.description,
        lat: null,
        lng: null,
      })
    }
  }

  return (
    <div className={`relative w-full text-left ${isOpen ? "z-50" : "z-10"}`} ref={wrapperRef}>
      <div
        className={`flex items-center gap-2.5 border border-slate-200/80 rounded-xl px-3.5 py-3 bg-slate-50/50 focus-within:bg-white ${borderColorClass} transition-colors shadow-2xs`}
      >
        {icon}
        <div className="w-px h-4 bg-slate-200 shrink-0" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (value && value.trim()) setIsOpen(true)
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none"
        />
        {loading && <Loader2 size={15} className="animate-spin text-slate-400 shrink-0" />}
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
//  MobileEstimateCard component
// ─────────────────────────────────────────────
function MobileEstimateCard({ pickupInputRef, dropInputRef }) {
  const [activeService, setActiveService] = useState("truck")
  const [trailerImageIndex, setTrailerImageIndex] = useState(0)

  // Pickup & Drop address + coordinates
  const [pickup, setPickup] = useState("")
  const [pickupCoords, setPickupCoords] = useState(null)
  const [drop, setDrop] = useState("")
  const [dropCoords, setDropCoords] = useState(null)

  // Loading, error, and estimate modal state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [estimateData, setEstimateData] = useState(null)
  const [showEstimateModal, setShowEstimateModal] = useState(false)

  // Alternate trailer images with slow, smooth transition every 2.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setTrailerImageIndex((prev) => (prev === 0 ? 1 : 0))
    }, 2500)
    return () => clearInterval(timer)
  }, [])

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
      // 1. Resolve pickup coordinates if missing
      let pCoords = pickupCoords
      if (!pCoords || !pCoords.lat || !pCoords.lng) {
        pCoords = await geocodeGoogleAddress(pickup.trim())
        setPickupCoords(pCoords)
      }

      // 2. Resolve drop coordinates if missing
      let dCoords = dropCoords
      if (!dCoords || !dCoords.lat || !dCoords.lng) {
        dCoords = await geocodeGoogleAddress(drop.trim())
        setDropCoords(dCoords)
      }

      // 3. Map selected service to vehicle type
      let vehicleType = "MINI_TRUCK"
      if (activeService === "trailers") {
        vehicleType = "CONTAINER_32FT"
      } else if (activeService === "open_truck") {
        vehicleType = "TRUCK_14FT"
      } else {
        vehicleType = "MINI_TRUCK"
      }

      // 4. Call real pricing estimate API
      const estimate = await fetchEstimate({
        pickupLat: pCoords.lat,
        pickupLng: pCoords.lng,
        dropLat: dCoords.lat,
        dropLng: dCoords.lng,
        vehicleType,
      })

      // 5. Build estimateData for EstimateResultModal
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
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-visible relative z-20">
        <div className="px-4 pt-4 pb-3 overflow-visible">
          <h3 className="font-black text-slate-900 text-lg leading-tight mb-3">
            Need a truck? Get an estimate
          </h3>

          {/* 3 service image selectors: Truck | Open Truck | Trailers */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* 1. Truck */}
            <button
              onClick={() => setActiveService("truck")}
              className={`relative flex flex-col items-center justify-end rounded-xl overflow-hidden transition-all duration-200 pb-2 pt-1 ${
                activeService === "truck"
                  ? "border-2 border-orange-500 bg-orange-50/60 shadow-sm shadow-orange-500/15"
                  : "border border-slate-200/40 bg-slate-50/40 hover:border-slate-300/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
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

            {/* 2. Open Truck (reduced 2-3% so it doesn't overflow borders) */}
            <button
              onClick={() => setActiveService("open_truck")}
              className={`relative flex flex-col items-center justify-end rounded-xl overflow-hidden transition-all duration-200 pb-2 pt-1 ${
                activeService === "open_truck"
                  ? "border-2 border-orange-500 bg-orange-50/60 shadow-sm shadow-orange-500/15"
                  : "border border-slate-200/40 bg-slate-50/40 hover:border-slate-300/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
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

            {/* 3. Trailers (alternating 2 images smoothly every 2.5s, scaled down 2-3%) */}
            <button
              onClick={() => setActiveService("trailers")}
              className={`relative flex flex-col items-center justify-end rounded-xl overflow-hidden transition-all duration-200 pb-2 pt-1 ${
                activeService === "trailers"
                  ? "border-2 border-orange-500 bg-orange-50/60 shadow-sm shadow-orange-500/15"
                  : "border border-slate-200/40 bg-slate-50/40 hover:border-slate-300/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              }`}
              style={{ minHeight: 96 }}
            >
              <div className="relative w-full h-16 flex items-center justify-center overflow-hidden p-0.5">
                <img
                  src="/hero-service-trailer-1.webp"
                  alt="Trailers 1"
                  width={120}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-contain object-center scale-[0.96] transition-all duration-1000 ease-in-out ${
                    trailerImageIndex === 0
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-1"
                  }`}
                />
                <img
                  src="/hero-service-trailer-2.webp"
                  alt="Trailers 2"
                  width={120}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-contain object-center scale-[0.96] transition-all duration-1000 ease-in-out ${
                    trailerImageIndex === 1
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-1"
                  }`}
                />
              </div>
              <span className={`text-[11px] font-bold mt-1 text-center px-1 leading-tight ${activeService === "trailers" ? "text-orange-600" : "text-slate-700"}`}>
                Trailers
              </span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Pickup (Google Maps Autocomplete - Blue Pin) */}
          <div className="mb-2.5 relative z-30">
            <HeroGooglePlacesInput
              id="hero-pickup-input"
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

          {/* Drop (Google Maps Autocomplete - Orange Pin) */}
          <div className="mb-4 relative z-20">
            <HeroGooglePlacesInput
              id="hero-drop-input"
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

      {/* Real Distance & Vehicle Selection Modal from /truck */}
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

// ─────────────────────────────────────────────
//  Main Hero export
// ─────────────────────────────────────────────
export default function Hero({ 
  selectedService, 
  setSelectedService, 
  onOpenEstimate,
  onSelectVehicle
}) {
  const [sliderValue, setSliderValue] = useState(10000)
  const [cityOpen, setCityOpen] = useState(false)
  const { city: slug } = useParams()
  const navigate = useNavigate()
  
  const { currentCity, isDetecting: cityDetecting, setCity } = useCity()
  const { user, accessToken, setIsLoginModalOpen, openLoginModal } = useAuth()
  const [isMobile, setIsMobile] = useState(false)

  // Input refs for direct focus from CTA button
  const pickupInputRef = useRef(null)
  const dropInputRef = useRef(null)

  const isLoggedIn = Boolean(accessToken || user || (typeof window !== "undefined" && localStorage.getItem("vahan_access_token")))

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

  // Handle "Book Truck" click: scroll to pickup box and focus it directly without modal
  const handleBookTruckClick = () => {
    if (pickupInputRef.current) {
      pickupInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      pickupInputRef.current.focus()
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (slug) {
      setCity(slug, false)
    }
  }, [slug, setCity])

  const driverPayout = Math.round(sliderValue * 0.95)
  const gmtCommission = Math.round(sliderValue * 0.05)

  const trustBadges = [
    {
      icon: BadgePercent,
      title: "Only 5% Commission",
      sub: "Lowest in Eastern India",
      color: "text-brand-600 bg-brand-50",
    },
    {
      icon: ShieldCheck,
      title: "Zero Surge Pricing",
      sub: "Transparent fare, always",
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      icon: Zap,
      title: "Match in < 20 mins",
      sub: "Or support escalates",
      color: "text-orange-600 bg-orange-50",
    },
  ]

  return (
    <>
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative min-h-[75vh] sm:min-h-[92vh] lg:min-h-[96vh] pt-24 sm:pt-28 pb-16 sm:pb-56 md:pb-60 lg:pb-64 flex flex-col justify-center items-center bg-slate-900 overflow-visible mb-36 sm:mb-40 md:mb-44">
        {/* Full-bleed Video / Image Background */}
        <div className="absolute inset-0 z-0">
          {isMobile ? (
            <img 
              src="/hero-bg-960.webp" 
              alt="GoMyTruck logistics"
              className="h-full w-full object-cover object-center"
            />
          ) : (
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
            </video>
          )}
          <div className="absolute inset-0 bg-slate-900/65" />
        </div>

        {/* ── MOBILE HERO LAYOUT ─── */}
        {isMobile ? (
          <div className="relative z-10 w-full px-4">
            {/* Tagline above */}
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">
              MOVE GOODS. FIND LOADS. CONNECT.
            </p>

            {/* H1 Heading */}
            <h1 className="text-[28px] font-black text-white tracking-tight leading-tight mb-2">
              Truck Booking in {currentCity.name}
            </h1>

            {/* Subtitle */}
            <p className="text-sm font-semibold text-slate-200 mb-5">
              How would you like to get started?
            </p>

            {/* CTA Row: Book Truck (Solid Orange + Black text) + Attach Truck (Pure White + Black text) */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Book Truck (Focuses into pickup input directly on the page, no modal) */}
              <button
                type="button"
                onClick={handleBookTruckClick}
                className="flex flex-col items-center justify-center gap-1.5 bg-[#f99f1b] hover:bg-[#e89010] active:scale-95 text-slate-950 font-black rounded-2xl py-4 px-3 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <SpeedTruckIcon className="w-10 h-8 text-slate-950 mb-0.5" />
                <span className="text-lg font-black text-slate-950 leading-tight text-center">Book Truck</span>
                <span className="text-xs font-semibold text-slate-900/80 leading-tight text-center">For customers</span>
              </button>

              {/* Attach Truck */}
              <Link
                to="/fleet-partner-registration"
                className="flex flex-col items-center justify-center gap-1.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-950 font-black rounded-2xl py-4 px-3 shadow-md shadow-slate-900/10 transition-all cursor-pointer"
              >
                <AttachTruckIcon className="w-10 h-8 text-slate-950 mb-0.5" />
                <span className="text-lg font-black text-slate-950 leading-tight text-center">Attach Truck</span>
                <span className="text-xs font-semibold text-slate-500 leading-tight text-center">For drivers &amp; truck owners</span>
              </Link>
            </div>

            {/* GMT Agent Row Button (Pure White + Orange Border + Peach Icon Tile) */}
            <button
              onClick={handleAgentClick}
              className="w-full flex items-center gap-3 bg-white hover:bg-slate-50 active:scale-95 border-2 border-[#f99f1b] rounded-2xl px-4 py-3.5 transition-all mb-5 shadow-sm shadow-orange-500/10 cursor-pointer"
            >
              {/* Peach/warm tile with orange agent icon */}
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#fff4eb] shrink-0">
                <AgentIcon className="w-6 h-6 text-[#f99f1b]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-slate-950 font-black text-base leading-tight">GMT Agent</p>
                <p className="text-slate-500 text-xs font-medium leading-tight mt-0.5">Match loads with drivers. Earn commission.</p>
              </div>
              <ChevronRight size={20} className="text-[#f99f1b] shrink-0" />
            </button>

            {/* Estimate Card with Google Maps Autocomplete + Distance & Vehicle Modal */}
            <MobileEstimateCard
              pickupInputRef={pickupInputRef}
              dropInputRef={dropInputRef}
            />

            {/* Direct Driver Contact – AFTER the card */}
            <div className="mt-4 relative z-0 group/unlock">
              <Link
                to="/direct-driver-contact"
                aria-label="Direct Driver & Partner Contact — Call 10 verified trucks for ₹99"
                className={[
                  "w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm",
                  "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white",
                  "bg-[length:200%_auto] animate-[gradientShift_2.5s_linear_infinite]",
                  "shadow-[0_0_18px_rgba(245,158,11,0.45)]",
                  "hover:shadow-[0_0_28px_rgba(245,158,11,0.7)] transition-all duration-300",
                  "border border-amber-400/60 cursor-pointer relative overflow-hidden"
                ].join(" ")}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/unlock:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                <Zap className="w-4 h-4 shrink-0 animate-pulse text-amber-100" />
                <span className="relative z-10 leading-tight">
                  Direct Driver / Partner Contact · <span className="line-through opacity-70">₹500</span> ₹99
                </span>
              </Link>
            </div>
          </div>
        ) : (
          /* ── DESKTOP HERO LAYOUT (unchanged) ── */
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            {/* 5% Commission Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-400/40 rounded-full px-4 py-1.5 mb-5 sm:mb-6">
              <BadgePercent size={16} className="text-brand-300" />
              <span className="text-brand-200 font-bold text-xs sm:text-sm tracking-wide">India's Most Transparent Freight Marketplace — Only 5% Commission</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-lg">
              Online Truck Booking &amp; Goods Transport in {currentCity.name}
            </h1>

            <p className="mt-4 sm:mt-5 text-base sm:text-xl lg:text-2xl font-semibold sm:font-bold text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Connect directly with verified trucks across {currentCity.state || currentCity.region || "India"}.{" "}
              <span className="text-brand-300">No brokers. No surge pricing. No hidden fees.</span>
            </p>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-brand-200 font-bold italic" lang="hi-Latn">
              Aasaan zariya, transport ka
            </p>

            {/* Tagline / Subtitle */}
            <p className="mt-7 text-sm sm:text-base font-bold text-slate-300 tracking-wide">
              How would you like to get started?
            </p>

            {/* 3 Role Action Cards in Desktop Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto mt-4 w-full text-left">
              {/* 1. Book Truck (Solid Orange + Dark Text) */}
              <button
                type="button"
                onClick={onOpenEstimate}
                className="flex items-center gap-3.5 bg-[#f99f1b] hover:bg-[#e89010] active:scale-98 text-slate-950 rounded-2xl p-4 sm:p-5 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400/40 shrink-0 group-hover:scale-105 transition-transform">
                  <SpeedTruckIcon className="w-8 h-7 text-slate-950" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-lg font-black text-slate-950 leading-tight">Book Truck</span>
                  <span className="block text-xs font-bold text-slate-900/80 mt-0.5 truncate">For customers &amp; shippers</span>
                </div>
                <ChevronRight size={18} className="text-slate-950/70 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {/* 2. Attach Truck (Pure White + Dark Text) */}
              <Link
                to="/fleet-partner-registration"
                className="flex items-center gap-3.5 bg-white hover:bg-slate-50 active:scale-98 text-slate-950 rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-900/15 hover:shadow-slate-900/25 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                  <AttachTruckIcon className="w-8 h-7 text-slate-950" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-lg font-black text-slate-950 leading-tight">Attach Truck</span>
                  <span className="block text-xs font-semibold text-slate-500 mt-0.5 truncate">For drivers &amp; owners</span>
                </div>
                <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>

              {/* 3. GMT Agent (Pure White + Orange Border + Peach Icon Tile) */}
              <button
                type="button"
                onClick={handleAgentClick}
                className="flex items-center gap-3.5 bg-white hover:bg-slate-50 active:scale-98 border-2 border-[#f99f1b] rounded-2xl p-4 sm:p-5 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#fff4eb] shrink-0 group-hover:scale-105 transition-transform">
                  <AgentIcon className="w-6 h-6 text-[#f99f1b]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-lg font-black text-slate-950 leading-tight">GMT Agent</span>
                  <span className="block text-xs font-semibold text-slate-500 mt-0.5 truncate">Match loads · Earn 1–5%</span>
                </div>
                <ChevronRight size={18} className="text-[#f99f1b] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ── FLOATING SERVICES BAR (desktop only) ── */}
        {!isMobile && (
          <div className="relative z-20 w-full px-4 flex justify-center mt-8 sm:mt-0 sm:absolute sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-1/2">
            <div className="bg-brand-50 rounded-xl shadow-2xl p-4 sm:p-8 sm:px-12 flex flex-col gap-4 sm:gap-6 border border-slate-100 w-full sm:w-fit">
              {/* Top Bar: City + Rating + Direct Driver */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200/60 pb-3.5">
                {/* Left: City Selector + Rating */}
                <div className="flex items-center gap-3 sm:gap-4 text-slate-900 font-bold text-lg sm:text-2xl px-1 sm:px-2 w-full sm:w-fit justify-between sm:justify-start">
                  <div 
                    className="flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:text-brand-600 transition-colors group/city"
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
                        <span className="leading-tight">City: <strong className="text-brand-700 font-black tracking-tight">{currentCity.name}</strong></span>
                        <span className="text-xs sm:text-sm font-bold bg-brand-100/90 hover:bg-brand-200 text-brand-800 border border-brand-300/80 px-2.5 py-0.5 rounded-lg shadow-xs transition-all hover:scale-105 active:scale-95">Change</span>
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
                    aria-label="Direct Driver & Partner Contact — Call 10 verified trucks for ₹99"
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

                  {/* Tooltip */}
                  <div className="absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 mb-2.5 w-64 opacity-0 group-hover/unlock:opacity-100 transition-all duration-300 pointer-events-none z-50">
                    <div className="bg-slate-900 text-white text-xs rounded-xl px-4 py-3 shadow-2xl border border-slate-700 space-y-1.5 text-left">
                      <p className="font-bold text-amber-400 text-center text-sm mb-1.5">Direct Driver / Partner Contact</p>
                      <p className="flex items-center gap-2"><span>🚫</span><span><strong>Zero transport broker charges</strong></span></p>
                      <p className="flex items-center gap-2"><span>📞</span><span>Get <strong>10 direct driver numbers</strong> instantly</span></p>
                      <p className="flex items-center gap-2"><span>✅</span><span><strong>Commercial DL &amp; RC verified</strong></span></p>
                      <p className="flex items-center gap-2"><span>💰</span><span>Save <strong>₹500–₹2000</strong> broker cut</span></p>
                      <p className="flex items-center gap-2"><span>📍</span><span>Available in <strong>{currentCity.name}</strong></span></p>
                    </div>
                    <div className="flex justify-end sm:justify-center pr-6 sm:pr-0">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 lg:gap-16">
                {/* Service Tabs (desktop) */}
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto justify-start">
                  {SERVICES_DESKTOP.map((srv) => {
                    const isActive = selectedService === srv.id
                    return (
                      <button
                        key={srv.id}
                        onClick={() => onSelectVehicle(srv.id)}
                        className={`relative flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-2xl transition-all duration-500 flex-shrink-0 group overflow-hidden ${
                          isActive
                            ? "bg-brand-50 border border-brand-200 shadow-[0_0_20px_rgba(0,31,63,0.3)]"
                            : "bg-slate-50 border border-transparent hover:bg-brand-50 hover:shadow-[0_0_25px_rgba(0,31,63,0.2)]"
                        }`}
                      >
                        <img
                          src={srv.imgSrc}
                          alt={srv.name}
                          width="256"
                          height="256"
                          loading="lazy"
                          decoding="async"
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain mix-blend-multiply contrast-[1.20] brightness-[1.10] transition-all duration-500 opacity-85 group-hover:scale-105 group-hover:-translate-y-4 group-hover:opacity-100"
                        />
                        <span className="absolute bottom-2 font-bold text-[11px] sm:text-xs text-center px-1 transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 text-brand-700">
                          {srv.name}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* CTA Button (desktop) */}
                <button
                  onClick={onOpenEstimate}
                  className="group flex flex-col items-center justify-center gap-4 shrink-0 sm:pr-4 cursor-pointer outline-none"
                >
                  <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/30 transition-transform duration-500 group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full border-2 border-brand-600 opacity-0 group-hover:animate-ping transition-opacity duration-300" />
                    <ArrowRight size={40} className="transition-transform duration-500 group-hover:translate-x-2 relative z-10" />
                  </div>
                  <span className="font-display font-extrabold text-base sm:text-lg text-slate-800 group-hover:text-brand-600 transition-colors tracking-tight">
                    Get Instant Estimate
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── TRUST STRIP ───────────────────────────────── */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trustBadges.map(({ icon: Icon, title, sub, color }) => (
              <div key={title} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 shadow-sm bg-white">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-base">{title}</p>
                  <p className="text-slate-500 text-xs font-medium">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TRANSPARENCY SLIDER ───────────────── */}
      <section className="bg-slate-950 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-2">How GoMyTruck pricing works</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">See exactly where your money goes</h2>
          <p className="mt-3 text-slate-400 text-base max-w-xl mx-auto">
            Move the slider to see the transparent 5% commission split. No hidden broker margins.
          </p>

          <div className="mt-10 bg-slate-900 rounded-2xl p-8 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm font-semibold">Freight Cost</span>
              <span className="text-white font-black text-2xl">₹{sliderValue.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={2000}
              max={100000}
              step={1000}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2 rounded-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-slate-600 text-xs mt-1">
              <span>₹2,000</span>
              <span>₹1,00,000</span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-emerald-950 border border-emerald-800 rounded-xl p-5">
                <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">Driver / Transporter Gets</p>
                <p className="text-emerald-300 font-black text-3xl">₹{driverPayout.toLocaleString("en-IN")}</p>
                <p className="text-emerald-600 text-xs mt-1">95% of total freight</p>
              </div>
              <div className="bg-brand-950 border border-brand-800 rounded-xl p-5">
                <p className="text-brand-400 font-bold text-xs uppercase tracking-widest mb-1">GoMyTruck Commission</p>
                <p className="text-brand-300 font-black text-3xl">₹{gmtCommission.toLocaleString("en-IN")}</p>
                <p className="text-brand-700 text-xs mt-1">Only 5% — no broker margin</p>
              </div>
            </div>

            <p className="text-slate-600 text-xs mt-5">
              * GST and applicable tolls/waiting charges are disclosed separately in the booking breakdown and are NOT included in the 5% commission.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <button
              onClick={onOpenEstimate}
              className="bg-brand-600 hover:bg-brand-500 text-white font-black px-7 py-3 rounded-xl shadow-lg shadow-brand-600/30 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Get Instant Transparent Estimate <ArrowRight size={18} />
            </button>
            <Link
              to="/goods-transport-services"
              className="border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 font-bold px-7 py-3 rounded-xl transition-all"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Global City Selector Modal */}
      <CitySelectorModal
        isOpen={cityOpen}
        onClose={() => setCityOpen(false)}
        onCitySelect={(name, slug) => setCity({ name, slug }, true)}
      />
    </>
  )
}
