import React, { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X, Check, Truck, Loader2, Package, Banknote, ChevronDown, AlertCircle, MapPin, Navigation, ShieldCheck } from "lucide-react"
import { fetchEstimate, fetchVehicles } from "../api/pricingApi"
import { createBooking, confirmBooking, cancelBooking } from "../api/bookingApi"
import { trackBookingSubmitted } from "../utils/analytics"
import { lockScroll, unlockScroll } from "../utils/scrollLock"

// Local image map — backend imageUrl is null; use verified local blueprints with corrected names
const VEHICLE_DISPLAY_CONFIG = {
  BIKE:           { image: "/vehicles/Standard Bike.webp", name: "2-Wheeler (Bike)" },
  THREE_WHEELER:  { image: "/vehicles/Mini Open Pickup.webp", name: "3-Wheeler / Ape" },
  TATA_ACE:       { image: "/vehicles/Tata Ace.webp", name: "Tata Ace" },
  MINI_TRUCK:     { image: "/vehicles/Bolero Pickup.webp", name: "Bolero Pickup" },
  TRUCK_14FT:     { image: "/vehicles/14 Ft Open Truck.webp", name: "14ft Open Truck" },
  TRUCK_17FT:     { image: "/vehicles/17 Ft Closed Truck.webp", name: "17ft Closed Truck" },
  TRUCK_20FT:     { image: "/vehicles/19 Ft Truck.webp", name: "19ft / 20ft Truck" },
  CONTAINER_32FT: { image: "/vehicles/LCV Box Truck.webp", name: "32ft Container" },
}

// Which vehicleTypes to show per service context
const SERVICE_VEHICLE_FILTER = {
  truck: ["THREE_WHEELER", "TATA_ACE", "MINI_TRUCK", "TRUCK_14FT", "TRUCK_17FT", "TRUCK_20FT", "CONTAINER_32FT"],
  bike:  ["BIKE"],
}
import { useAuth } from "../context/AuthContext"
import GoodsTypeModal from "./GoodsTypeModal"
import BookingPersonaStep from "./BookingPersonaStep"

/**
 * EstimateResultModal
 * estimateData contains:
 * {
 *   pickupAddress, dropAddress, phone, name,
 *   estimatedDistanceKm, estimatedDurationMins, polyline, vehicle
 * }
 */
export default function EstimateResultModal({ isOpen, onClose, estimateData }) {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicleType, setSelectedVehicleType] = useState(estimateData?.vehicle?.vehicleType || "MINI_TRUCK")
  const [liveEstimate, setLiveEstimate] = useState(estimateData)
  const [estimateRefreshing, setEstimateRefreshing] = useState(false)
  
  // Modals & States
  const { user, accessToken, requireAuth } = useAuth()
  const isLoggedIn = !!accessToken
  const [showGoodsModal, setShowGoodsModal] = useState(false)
  const [selectedGoods, setSelectedGoods] = useState(null)
  
  // Flow state: 'INITIAL' | 'PERSONA' | 'SEARCHING' | 'CANCELLING' | 'CANCELLED'
  const [bookingState, setBookingState] = useState('INITIAL')
  const [crn, setCrn] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [cancelReason, setCancelReason] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState("")

  const CANCELLATION_REASONS = [
    "Expected time of arrival is too long",
    "Driver asked to cancel",
    "Changed my mind",
    "Booked by mistake",
    "Fare is too high"
  ]

  // Load all vehicles when modal opens
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const v = await fetchVehicles()
        setVehicles(v)
      } catch (err) {
        console.error("Failed to load vehicles", err)
      } finally {
        setLoading(false)
      }
    }
    if (isOpen) load()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !estimateData) return
    setLiveEstimate(estimateData)
    setSelectedVehicleType(estimateData.vehicle?.vehicleType || "MINI_TRUCK")
  }, [isOpen, estimateData])

  // Lock background scroll and pin body when open
  useEffect(() => {
    if (isOpen) {
      lockScroll()
    } else {
      unlockScroll()
    }
    return () => {
      if (isOpen) {
        unlockScroll()
      }
    }
  }, [isOpen])

  // Mobile slide-down to dismiss gesture
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const startTimeRef = useRef(0)

  // Reset drag offset when modal opens or closes
  useEffect(() => {
    setDragOffset(0)
    setIsDragging(false)
  }, [isOpen])

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return
    const touch = e.touches[0]
    startYRef.current = touch.clientY
    currentYRef.current = touch.clientY
    startTimeRef.current = Date.now()
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const deltaY = touch.clientY - startYRef.current
    currentYRef.current = touch.clientY
    if (deltaY > 0) {
      setDragOffset(deltaY)
    } else {
      setDragOffset(Math.max(deltaY * 0.15, -12))
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    const deltaY = currentYRef.current - startYRef.current
    const duration = Math.max(Date.now() - startTimeRef.current, 1)
    const velocity = deltaY / duration

    // Dismiss if dragged down > 70px or flicked down (> 25px with velocity > 0.35)
    if (deltaY > 70 || (velocity > 0.35 && deltaY > 25)) {
      setDragOffset(window.innerHeight || 800)
      setTimeout(() => {
        onClose()
        setDragOffset(0)
      }, 220)
    } else {
      setDragOffset(0)
    }
  }

  const handleMouseDown = (e) => {
    if (e.target.closest("button")) return
    startYRef.current = e.clientY
    currentYRef.current = e.clientY
    startTimeRef.current = Date.now()
    setIsDragging(true)

    const onMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startYRef.current
      currentYRef.current = moveEvent.clientY
      if (deltaY > 0) {
        setDragOffset(deltaY)
      } else {
        setDragOffset(Math.max(deltaY * 0.15, -12))
      }
    }

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      setIsDragging(false)

      const deltaY = currentYRef.current - startYRef.current
      const duration = Math.max(Date.now() - startTimeRef.current, 1)
      const velocity = deltaY / duration

      if (deltaY > 70 || (velocity > 0.35 && deltaY > 25)) {
        setDragOffset(window.innerHeight || 800)
        setTimeout(() => {
          onClose()
          setDragOffset(0)
        }, 220)
      } else {
        setDragOffset(0)
      }
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  const handleHandleClick = () => {
    // Tapping the grab slider handle also triggers a smooth slide-down close
    if (Math.abs(currentYRef.current - startYRef.current) < 8) {
      setDragOffset(window.innerHeight || 800)
      setTimeout(() => {
        onClose()
        setDragOffset(0)
      }, 220)
    }
  }

  if (!isOpen || !estimateData || typeof document === "undefined") return null

  const handleBookNowClick = async () => {
    requireAuth(async () => {
      if (!selectedGoods && estimateData.service !== "packers") {
        setShowGoodsModal(true);
      } else {
        setBookingState("PERSONA");
      }
    }, "CUSTOMER", true);
  };

  const handleConfirmPersonaBooking = async ({ persona, urgency, truckCount, contractDuration }) => {
    setBookingError("");
    setBookingLoading(true);
    try {
      if (!accessToken && !localStorage.getItem("vahan_access_token")) {
        requireAuth(() => {
          handleConfirmPersonaBooking({ persona, urgency, truckCount, contractDuration });
        }, "CUSTOMER", true);
        setBookingLoading(false);
        return;
      }

      let slaExpiresAt = null;
      const now = Date.now();
      if (urgency === "UNDER_2_HOURS") {
        slaExpiresAt = new Date(now + 2 * 60 * 60 * 1000).toISOString();
      } else if (urgency === "UNDER_4_HOURS") {
        slaExpiresAt = new Date(now + 4 * 60 * 60 * 1000).toISOString();
      } else if (urgency === "UNDER_24_HOURS") {
        slaExpiresAt = new Date(now + 24 * 60 * 60 * 1000).toISOString();
      } else if (urgency === "TWO_DAYS") {
        slaExpiresAt = new Date(now + 48 * 60 * 60 * 1000).toISOString();
      }

      const payload = {
        vehicleType: selectedVehicleType,
        pickupLat: Number(estimateData.pickupLat),
        pickupLng: Number(estimateData.pickupLng),
        pickupAddress: estimateData.pickupAddress,
        stops: [{
          latitude: Number(estimateData.dropLat),
          longitude: Number(estimateData.dropLng),
          address: estimateData.dropAddress,
        }],
        hasLoadingService: Boolean(selectedGoods?.laborRequired),
        estimatedFare: Math.round(Number(liveEstimate.totalFare ?? currentFare)),
        estimatedDistanceKm: Number(liveEstimate.estimatedDistanceKm || 1),
        goodsType: selectedGoods?.goodsType || "General Goods",
        goodsDescription: selectedGoods?.goodsDescription?.trim() || "Commercial goods transport",
        goodsWeightKg: Number(selectedGoods?.goodsWeightKg || 50),
        goodsQuantity: Number(selectedGoods?.goodsQuantity || 1),
        containsRestrictedGoods: Boolean(selectedGoods?.containsRestrictedGoods),
        handlingInstructions: selectedGoods?.handlingInstructions?.trim() || undefined,
        laborRequired: Boolean(selectedGoods?.laborRequired),
        ...(selectedGoods?.laborRequired ? {
          laborersCount: Number(selectedGoods.laborersCount || 1),
          laborType: selectedGoods.laborType || "BOTH",
        } : {}),
        bookingPersona: persona || "INDIVIDUAL",
        truckCount: Number(truckCount || 1),
        contractDuration: contractDuration || undefined,
        urgencyWindow: urgency || "FLEXIBLE",
        slaExpiresAt,
      };

      const draft = await createBooking(payload);
      const data = await confirmBooking(draft.id);
      setCrn(data.bookingNumber || draft.bookingNumber || draft.id);
      setBookingId(data.id || draft.id);
      setBookingState("SEARCHING");
      trackBookingSubmitted(data.id || draft.id, selectedVehicleType);
    } catch (err) {
      console.error("[EstimateResultModal] Booking error:", err);
      const msg = err.message || "";
      if (msg.toLowerCase().includes("token") || msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("jwt") || msg.includes("401")) {
        setBookingError("Session expired. Please log in to confirm your booking.");
        requireAuth(() => {
          handleConfirmPersonaBooking({ persona, urgency, truckCount, contractDuration });
        }, "CUSTOMER", true);
      } else {
        setBookingError(msg || "Failed to create booking. Please check connection and try again.");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const allowedTypes = SERVICE_VEHICLE_FILTER[estimateData.service]
  const filteredVehicles = allowedTypes
    ? vehicles.filter(v => allowedTypes.includes(v.vehicleType))
    : vehicles

  const currentFare = Number(liveEstimate?.grandTotal ?? liveEstimate?.totalFare ?? liveEstimate?.estimatedFare ?? 0)
  const fareBreakdown = liveEstimate?.fareBreakdown || {}
  const totalGst = Number(liveEstimate?.gstBreakdown?.totalGst ?? 0)

  const selectVehicle = async (vehicle) => {
    if (vehicle.vehicleType === selectedVehicleType) return
    setSelectedVehicleType(vehicle.vehicleType)
    setEstimateRefreshing(true)
    setBookingError("")
    try {
      const estimate = await fetchEstimate({
        pickupLat: estimateData.pickupLat,
        pickupLng: estimateData.pickupLng,
        dropLat: estimateData.dropLat,
        dropLng: estimateData.dropLng,
        vehicleType: vehicle.vehicleType,
        hasLoadingService: !!selectedGoods?.laborRequired,
        helperCount: selectedGoods?.laborersCount,
      })
      setLiveEstimate(estimate)
    } catch (error) {
      setBookingError(error.message || "Could not refresh the estimate for this vehicle.")
    } finally {
      setEstimateRefreshing(false)
    }
  }

  return createPortal(
    <>
      <div data-modal-portal="true" data-modal-open="true" className="fixed inset-0 z-[150] flex flex-col justify-end md:justify-center md:p-6 lg:p-10 pointer-events-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-200" 
          style={{
            opacity: dragOffset > 0 ? Math.max(0.15, 1 - dragOffset / 500) : 1
          }}
          onClick={onClose}
        ></div>

        {/* ══════════════════════════════════════════════════════════════════════════════
            MOBILE VIEW (< md)
            Full-height bottom sheet with clear route summary, compact vehicle selector,
            transparent breakdown, and sticky bottom action bar.
           ══════════════════════════════════════════════════════════════════════════════ */}
        <div 
          className="relative bg-white w-full h-[92vh] max-h-[92vh] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden z-10 md:hidden"
          style={{
            transform: dragOffset !== 0 ? `translateY(${dragOffset}px)` : undefined,
            transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)"
          }}
        >
          
          {/* Top Grab Pill & Header */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            className="pt-2 px-4 pb-3 border-b border-slate-100 shrink-0 bg-white select-none touch-none cursor-grab active:cursor-grabbing"
          >
            {/* Grab slider handle bar with generous touch target */}
            <div 
              onClick={handleHandleClick}
              className="py-2 -mt-1 -mb-1 flex justify-center cursor-pointer"
              title="Slide down or tap to close"
            >
              <div 
                className={`w-12 h-1.5 rounded-full transition-all duration-200 ${
                  isDragging ? "bg-slate-500 scale-105" : "bg-slate-300 hover:bg-slate-400"
                }`} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 leading-tight">Trip Fare Estimate</h3>
                {liveEstimate?.estimatedDistanceKm && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200/80">
                    {liveEstimate.estimatedDistanceKm} km
                  </span>
                )}
              </div>
              <button 
                type="button"
                onClick={onClose} 
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer active:scale-95 transition-all"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {bookingState === 'INITIAL' ? (
            <>
              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 overscroll-contain">
                
                {/* 1. Route Summary Card (Distance + Pickup + Drop) */}
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 shadow-2xs">
                  <div className="relative pl-5 space-y-3">
                    {/* Vertical timeline line */}
                    <div className="absolute top-2 bottom-3 left-1.5 w-0.5 border-l-2 border-dashed border-slate-300" />

                    {/* Pickup */}
                    <div className="relative">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup</p>
                          <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{estimateData.pickupAddress}</p>
                        </div>
                        <button onClick={onClose} className="text-[11px] font-bold text-blue-600 hover:underline shrink-0">Edit</button>
                      </div>
                    </div>

                    {/* Distance pill in middle */}
                    {liveEstimate?.estimatedDistanceKm && (
                      <div className="flex items-center gap-2 pl-1 py-0.5">
                        <span className="text-[11px] font-black text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                          {liveEstimate.estimatedDistanceKm} km route
                        </span>
                      </div>
                    )}

                    {/* Drop */}
                    <div className="relative">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drop-off</p>
                          <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{estimateData.dropAddress}</p>
                        </div>
                        <button onClick={onClose} className="text-[11px] font-bold text-blue-600 hover:underline shrink-0">Edit</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Select Vehicle Section */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Select Vehicle</h4>
                    <span className="text-[11px] text-slate-400 font-semibold">{filteredVehicles.length} vehicles available</span>
                  </div>

                  {loading ? (
                    <div className="py-8 flex items-center justify-center">
                      <Loader2 className="animate-spin text-blue-600" size={28} />
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredVehicles.map((v) => {
                        const isSelected = selectedVehicleType === v.vehicleType
                        const config = VEHICLE_DISPLAY_CONFIG[v.vehicleType] || {}
                        const imgSrc = config.image || "/navy_truck.webp"
                        const displayName = config.name || v.displayName

                        return (
                          <div
                            key={v.vehicleType}
                            onClick={() => selectVehicle(v)}
                            className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                              isSelected
                                ? "border-blue-600 bg-blue-50/50 shadow-sm"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-16 h-12 bg-slate-50 rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden border border-slate-100">
                                <img src={imgSrc} alt={displayName} className="w-full h-full object-contain" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h5 className="font-black text-slate-900 text-sm leading-tight truncate">{displayName}</h5>
                                  {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                                </div>
                                <p className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-tight truncate">
                                  {v.capacityDesc || `${v.capacityKg} Kg capacity`}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0 pl-3">
                              {isSelected ? (
                                <div>
                                  <span className="text-base font-black text-slate-900 block leading-tight">
                                    {estimateRefreshing ? <Loader2 size={14} className="animate-spin inline text-blue-600" /> : `₹${Math.round(currentFare)}`}
                                  </span>
                                  <span className="text-[10px] font-bold text-blue-600">Selected</span>
                                </div>
                              ) : (
                                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                                  Select
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Transparent Fare Breakdown Card */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider mb-2.5">Transparent Fare Breakdown</h4>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Base Fare</span>
                      <span className="font-semibold text-slate-800">₹{Number(fareBreakdown.baseFare || 0).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance Fare</span>
                      <span className="font-semibold text-slate-800">₹{Number(fareBreakdown.distanceFare || 0).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Platform Commission</span>
                      <span>Only 5%</span>
                    </div>
                    {totalGst > 0 && (
                      <div className="flex justify-between">
                        <span>GST / Taxes</span>
                        <span className="font-semibold text-slate-800">₹{totalGst.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                      <span>Estimated Payable</span>
                      <span>₹{Math.round(currentFare)}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 mt-2 text-center bg-white/70 py-1 px-2 rounded-lg border border-slate-100">
                    Zero surge pricing • 95% goes directly to the driver
                  </p>
                </div>

                {/* Bottom extra space */}
                <div className="h-4" />
              </div>

              {/* 4. Mobile Sticky Bottom Action Bar */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 px-4 py-3 pb-6 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] shrink-0 z-30">
                {!isLoggedIn && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg mb-2.5">
                    <Package size={13} className="text-emerald-600 shrink-0" />
                    <span>Log in to save load and confirm booking</span>
                  </div>
                )}

                {bookingError && (
                  <div className="mb-2.5 flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-2.5 py-1.5">
                    <AlertCircle size={14} className="shrink-0" />
                    <span className="truncate">{bookingError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-0.5">Total Payable</span>
                    <span className="text-xl font-black text-slate-900 leading-tight">₹{Math.round(currentFare)}</span>
                  </div>

                  <button
                    onClick={handleBookNowClick}
                    disabled={bookingLoading || estimateRefreshing || currentFare <= 0}
                    className="flex-1 max-w-[220px] bg-[#1e5eff] hover:bg-blue-700 active:scale-95 disabled:bg-blue-300 text-white font-black text-sm py-3 px-4 rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {bookingLoading && <Loader2 size={16} className="animate-spin" />}
                    <span>{!isLoggedIn ? "Book Now" : (selectedGoods ? "Book Now" : "Select Goods Type")}</span>
                  </button>
                </div>
              </div>
            </>
          ) : bookingState === "PERSONA" ? (
            <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
              <BookingPersonaStep
                isLoading={bookingLoading}
                error={bookingError}
                onConfirm={handleConfirmPersonaBooking}
                onCancel={() => {
                  setBookingState("INITIAL")
                  setBookingError("")
                }}
              />
            </div>
          ) : (
            /* Mobile Searching / Cancelling / Cancelled */
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center text-center">
              {bookingState === 'SEARCHING' && (
                <div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 size={28} className="animate-spin text-blue-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Looking for partner...</h3>
                  <p className="text-xs text-slate-500 mb-6">Your request is open. CRN: <strong className="text-slate-800">{crn}</strong></p>
                  <button onClick={() => setBookingState('CANCELLING')} className="w-full border border-blue-600 text-blue-600 font-bold py-3 rounded-xl">
                    Cancel Request
                  </button>
                </div>
              )}
              {bookingState === 'CANCELLING' && (
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">Cancel Booking?</h3>
                  <div className="space-y-2 mb-6 text-left">
                    {CANCELLATION_REASONS.map((reason, idx) => (
                      <label key={idx} className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold ${cancelReason === reason ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                        <input type="radio" name="cancel_reason_mob" checked={cancelReason === reason} onChange={() => setCancelReason(reason)} />
                        <span>{reason}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setBookingState('SEARCHING')} className="w-1/2 border border-slate-300 py-2.5 rounded-xl font-bold text-xs">Back</button>
                    <button onClick={async () => {
                      if (!cancelReason) return alert("Please select a reason.")
                      setBookingLoading(true)
                      try {
                        await cancelBooking(bookingId, cancelReason)
                        setBookingState('CANCELLED')
                      } finally { setBookingLoading(false) }
                    }} className="w-1/2 bg-rose-500 text-white py-2.5 rounded-xl font-bold text-xs">Confirm</button>
                  </div>
                </div>
              )}
              {bookingState === 'CANCELLED' && (
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Order Cancelled</h3>
                  <p className="text-xs text-slate-500 mb-6">Your booking {crn} has been cancelled.</p>
                  <button onClick={() => { setBookingState('INITIAL'); setCancelReason('') }} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
                    Book Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>


        {/* ══════════════════════════════════════════════════════════════════════════════
            DESKTOP VIEW (hidden md:flex)
            Exact existing 2-column layout preserved untouched for desktop.
           ══════════════════════════════════════════════════════════════════════════════ */}
        <div className="relative bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden z-10 hidden md:flex md:flex-row max-h-[90vh] min-h-[600px] md:min-h-[650px]">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer z-20">
            <X size={18} />
          </button>

          {bookingState === 'INITIAL' || bookingState === 'PERSONA' ? (
            <>
              {/* LEFT COLUMN: Address Details & (if logged in) Fare Breakdown */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto custom-scrollbar">
                <h3 className="text-xl font-extrabold text-slate-900 mb-8">Address Details</h3>

                <div className="relative pl-6 space-y-10">
                  {/* Timeline line */}
                  <div className="absolute top-2 bottom-6 left-1.5 w-0.5 border-l-2 border-dashed border-slate-300 flex items-center justify-center">
                    {liveEstimate?.estimatedDistanceKm && (
                      <div className="bg-slate-50 px-3 py-1 text-xs font-extrabold text-slate-600 border border-slate-200 rounded-lg z-10 whitespace-nowrap translate-x-[2px] shadow-sm">
                        {liveEstimate.estimatedDistanceKm} km
                      </div>
                    )}
                  </div>

                  {/* Pickup Node */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm z-10"></div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-base font-bold text-slate-900">
                          {estimateData.name || "Customer"} <span className="text-slate-400 font-medium ml-1">• {estimateData.phone}</span>
                        </p>
                        <p className="text-base text-slate-600 font-medium mt-1.5 leading-snug pr-4">
                          {estimateData.pickupAddress}
                        </p>
                      </div>
                      <button onClick={onClose} className="text-sm font-bold text-blue-600 hover:underline shrink-0">Edit</button>
                    </div>
                  </div>

                  {/* Drop Node */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-white shadow-sm z-10"></div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {estimateData.name || "Customer"} <span className="text-slate-400 font-normal">• {estimateData.phone}</span>
                        </p>
                        <p className="text-sm text-slate-500 mt-1 leading-snug pr-4">
                          {estimateData.dropAddress}
                        </p>
                      </div>
                      <button onClick={onClose} className="text-xs font-semibold text-blue-600 hover:underline shrink-0">Edit</button>
                    </div>
                  </div>
                </div>

                {/* FARE BREAKDOWN (Only visible when logged in) */}
                {isLoggedIn && (
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="font-extrabold text-slate-900 mb-4 text-base">Fare Breakdown</h3>
                    <div className="space-y-3 text-sm text-slate-600 mb-4">
                      <div className="flex justify-between"><span>Base fare</span><span className="font-semibold text-slate-800">₹{Number(fareBreakdown.baseFare || 0).toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Distance fare</span><span className="font-semibold text-slate-800">₹{Number(fareBreakdown.distanceFare || 0).toFixed(2)}</span></div>
                      {Number(fareBreakdown.timeFare) > 0 && <div className="flex justify-between"><span>Time fare</span><span>₹{Number(fareBreakdown.timeFare).toFixed(2)}</span></div>}
                      {Number(fareBreakdown.fuelSurcharge) > 0 && <div className="flex justify-between"><span>Fuel adjustment</span><span>₹{Number(fareBreakdown.fuelSurcharge).toFixed(2)}</span></div>}
                      {Number(fareBreakdown.loadingCharge) > 0 && <div className="flex justify-between"><span>Workforce</span><span>₹{Number(fareBreakdown.loadingCharge).toFixed(2)}</span></div>}
                      <div className="flex justify-between"><span>GST</span><span className="font-semibold text-slate-800">₹{totalGst.toFixed(2)}</span></div>
                      <div className="flex justify-between font-bold text-slate-900 pt-3 border-t border-slate-100">
                        <span>Estimated payable</span>
                        <span>₹{currentFare.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 font-medium bg-slate-50 p-2 rounded-lg border border-slate-200 text-center shadow-sm">
                        Total Cost = Driver Payout (95%) + GoMyTruck Commission (5%) + Applicable GST/Tolls
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-4 border-t border-slate-100 text-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Package size={16} /> 
                        <span>{selectedGoods?.goodsType || "Select goods details"}</span>
                      </div>
                      <button onClick={() => setShowGoodsModal(true)} className="font-semibold text-blue-600 hover:underline">Change</button>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Select Vehicle */}
              <div className="w-full md:w-1/2 bg-slate-50/50 flex flex-col max-h-[90vh]">
                {bookingState === "PERSONA" ? (
                  <BookingPersonaStep
                    isLoading={bookingLoading}
                    error={bookingError}
                    onConfirm={handleConfirmPersonaBooking}
                    onCancel={() => {
                      setBookingState("INITIAL")
                      setBookingError("")
                    }}
                  />
                ) : estimateData.service === "packers" ? (
                  <div className="flex-grow flex flex-col justify-center p-6 sm:p-8 text-center items-center h-full">
                    <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <Package size={36} className="text-brand-600" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Confirm Delivery Details</h3>
                    <p className="text-sm text-slate-500 mb-8 max-w-[280px] leading-relaxed">
                      Every move is different. The team can use <strong className="text-slate-800">{estimateData.phone}</strong> to clarify the inventory, access conditions, service scope and quote.
                    </p>
                    {bookingError && (
                      <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-3 py-2">
                        <AlertCircle size={14} className="shrink-0" />
                        {bookingError}
                      </div>
                    )}
                    <button 
                      onClick={handleBookNowClick}
                      disabled={bookingLoading}
                      className="w-full max-w-xs bg-[#1e5eff] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-sm tracking-wide flex justify-center items-center gap-2"
                    >
                      {bookingLoading && <Loader2 size={16} className="animate-spin" />}
                      {!isLoggedIn ? "Login to Confirm" : "Confirm Request"}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-6 sm:p-8 pb-4">
                      <h3 className="text-xl font-extrabold text-slate-900">Select Vehicle</h3>
                    </div>

                    {loading ? (
                      <div className="flex-grow flex items-center justify-center">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                      </div>
                    ) : (
                      <div className="flex-grow overflow-y-auto px-6 sm:px-8 custom-scrollbar space-y-4 pb-4">
                        {filteredVehicles.map(v => {
                          const isSelected = selectedVehicleType === v.vehicleType
                          const fare = isSelected ? currentFare : null
                          
                          const config = VEHICLE_DISPLAY_CONFIG[v.vehicleType] || {}
                          const imgSrc = config.image || "/navy_truck.webp"
                          const displayName = config.name || v.displayName

                          if (isSelected) {
                            return (
                              <div key={v.vehicleType} className="border-2 border-blue-600 bg-white rounded-2xl p-4 shadow-sm relative transition-all">
                                <div className="absolute top-2 left-2 right-2 bottom-2 bg-blue-50/30 rounded-xl pointer-events-none"></div>
                                <div className="w-full bg-slate-50 rounded-xl overflow-hidden mb-3 relative z-10 flex items-center justify-center p-2">
                                  <img src={imgSrc} alt={displayName} loading="lazy" decoding="async" className="max-h-40 w-auto object-contain" />
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg text-center relative z-10">{displayName}</h4>
                                <div className="flex justify-between items-end mt-2 relative z-10">
                                  <span className="text-sm font-semibold text-slate-600">{v.capacityDesc || `${v.capacityKg} Kg`}</span>
                                  <span className="text-xl font-black text-slate-900">{estimateRefreshing ? "Refreshing…" : `₹ ${Math.round(fare)}`}</span>
                                </div>
                              </div>
                            )
                          }

                          return (
                            <div
                              key={v.vehicleType}
                              onClick={() => selectVehicle(v)}
                              className="flex items-center justify-between border border-slate-200 bg-white rounded-xl p-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-24 bg-slate-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                                  <img src={imgSrc} alt={displayName} loading="lazy" decoding="async" className="h-14 w-auto object-contain" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-800 text-sm">{displayName}</h4>
                                  <span className="text-xs font-semibold text-slate-500">{v.capacityDesc || `${v.capacityKg} Kg`}</span>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-brand-700 shrink-0">Select for estimate</span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Bottom Fixed Section (Desktop) */}
                    <div className="p-6 sm:p-8 pt-4 bg-slate-50/50 mt-auto border-t border-slate-100">
                      
                      {!isLoggedIn ? (
                        <div className="bg-[#0b8a57] text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 mb-4">
                          <span className="bg-white/20 p-1 rounded-full"><Package size={14} /></span>
                          Log in to save your declared load and confirm the booking request.
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><Banknote size={18} /></div>
                            <div>
                              <p className="text-xs text-slate-500 font-semibold leading-none mb-1">Payment Method</p>
                              <p className="text-sm font-bold text-slate-800 leading-none">Cash</p>
                            </div>
                          </div>
                          <div className="font-black text-slate-900">₹ {Math.round(currentFare)}</div>
                        </div>
                      )}
                      {bookingError && (
                        <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-3 py-2">
                          <AlertCircle size={14} className="shrink-0" />
                          {bookingError}
                        </div>
                      )}
                      
                      <button 
                        onClick={handleBookNowClick}
                        disabled={bookingLoading || estimateRefreshing || currentFare <= 0}
                        className="w-full bg-[#1e5eff] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-sm tracking-wide flex justify-center items-center gap-2 cursor-pointer"
                      >
                        {bookingLoading && <Loader2 size={16} className="animate-spin" />}
                        {!isLoggedIn ? "Book Now" : (selectedGoods ? "Book Now" : "Select Goods Type")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {/* SEARCHING, CANCELLING, CANCELLED STATES (Desktop) */}
              <div className="w-full p-6 sm:p-8 md:p-10 border-slate-200 flex flex-col">
                
                {bookingState === 'SEARCHING' && (
                  <>
                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-center mb-8 mt-4">
                        <div className="w-24 h-24 bg-[#eef2ff] rounded-full flex items-center justify-center">
                          <div className="w-16 h-16 bg-[#dbeafe] rounded-full flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-slate-200/50 flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
                            <div className="bg-emerald-500 w-4 h-4 rounded-full border-2 border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shadow-sm"></div>
                          </div>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Looking for partner...</h2>
                      <p className="text-sm text-slate-500 mb-8">Your request is open for matching. Assignment and arrival time depend on a suitable partner accepting the route and load.</p>

                      <div className="border-t border-slate-200 py-4 mt-auto">
                        <div className="flex justify-between items-center cursor-pointer mb-2">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Order Details</p>
                            <p className="text-xs text-slate-500 mt-1">{crn}</p>
                          </div>
                          <ChevronDown size={18} className="text-slate-500" />
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="bg-emerald-100 text-emerald-600 p-1 rounded text-xs"><Banknote size={14} /></div>
                            <span className="text-sm font-semibold text-slate-700">Amount Payable</span>
                          </div>
                          <span className="font-bold text-slate-900">₹{currentFare.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button 
                        onClick={() => setBookingState('CANCELLING')}
                        className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3.5 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}

                {bookingState === 'CANCELLING' && (
                  <>
                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-center mb-6 mt-2">
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
                          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 font-bold text-3xl shadow-inner">
                            ?
                          </div>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Cancel Booking?</h2>
                      <p className="text-sm text-slate-500 mb-8 text-center px-4">Please let us know why you want to cancel. This helps us improve our service.</p>

                      <div className="flex-grow space-y-3 mb-6">
                        {CANCELLATION_REASONS.map((reason, idx) => (
                          <label key={idx} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${cancelReason === reason ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${cancelReason === reason ? 'border-blue-600' : 'border-slate-300'}`}>
                              {cancelReason === reason && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{reason}</span>
                            <input type="radio" name="cancel_reason" className="hidden" checked={cancelReason === reason} onChange={() => setCancelReason(reason)} />
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-auto flex gap-4 pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => setBookingState('SEARCHING')}
                        disabled={bookingLoading}
                        className="w-1/2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-3.5 rounded-xl transition-all"
                      >
                        Don't Cancel
                      </button>
                      <button 
                        disabled={bookingLoading}
                        onClick={async () => {
                          if (!cancelReason) return alert("Please select a reason before cancelling.")
                          setBookingError("")
                          setBookingLoading(true)
                          try {
                            await cancelBooking(bookingId, cancelReason)
                            setBookingState('CANCELLED')
                          } catch (err) {
                            alert(err.message)
                          } finally {
                            setBookingLoading(false)
                          }
                        }}
                        className="w-1/2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex justify-center items-center gap-2"
                      >
                        {bookingLoading && <Loader2 size={16} className="animate-spin" />}
                        Confirm
                      </button>
                    </div>
                  </>
                )}

                {bookingState === 'CANCELLED' && (
                  <>
                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-center mb-8 mt-4">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                          <div className="w-16 h-16 bg-slate-200/50 rounded-full flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-slate-200/50 flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
                            <div className="bg-rose-500 text-white p-1 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shadow-sm">
                              <X size={14} strokeWidth={4} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Your order has been cancelled!</h2>
                      <p className="text-sm text-slate-500 mb-8 leading-relaxed">Your booking <span className="font-bold text-slate-700">{crn}</span> has been cancelled. Feel free to rebook whenever you're ready.</p>

                      <div className="border-t border-slate-200 py-4 mt-auto">
                        <div className="flex justify-between items-center cursor-pointer mb-2">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Order Details</p>
                            <p className="text-xs text-slate-500 mt-1">{crn}</p>
                          </div>
                          <ChevronDown size={18} className="text-slate-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button 
                        onClick={() => {
                          setBookingState('INITIAL')
                          setCancelReason('')
                        }}
                        className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3.5 rounded-xl transition-all"
                      >
                        Go Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <GoodsTypeModal
        isOpen={showGoodsModal}
        onClose={() => setShowGoodsModal(false)}
        onSelect={(data) => {
          setSelectedGoods(data)
          setShowGoodsModal(false)
          setBookingState("PERSONA")
        }}
        onSave={(data) => {
          setSelectedGoods(data)
          setShowGoodsModal(false)
          setBookingState("PERSONA")
        }}
        initialData={selectedGoods}
      />
    </>,
    document.body
  )
}
