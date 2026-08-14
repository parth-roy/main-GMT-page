import React, { useState, useEffect } from "react"
import { X, Check, Truck, Loader2, Package, Banknote, ChevronDown, MapPin, Gift, MousePointerClick, AlertCircle } from "lucide-react"
import { fetchEstimate, fetchVehicles } from "../api/pricingApi"
import { createBooking, confirmBooking, cancelBooking } from "../api/bookingApi"
import { trackBookingSubmitted } from "../utils/analytics"

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
  
  // Flow state: 'INITIAL' | 'SEARCHING' | 'CANCELLING' | 'CANCELLED'
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

  if (!isOpen || !estimateData) return null

  const handleBookNowClick = async () => {
    requireAuth(async () => {
      if (!selectedGoods && estimateData.service !== "packers") {
        setShowGoodsModal(true)
      } else {
        setBookingError("")
        setBookingLoading(true)
        try {
          const payload = {
            vehicleType: selectedVehicleType,
            pickupLat: estimateData.pickupLat,
            pickupLng: estimateData.pickupLng,
            pickupAddress: estimateData.pickupAddress,
            stops: [{
              latitude: estimateData.dropLat,
              longitude: estimateData.dropLng,
              address: estimateData.dropAddress,
            }],
            hasLoadingService: false,
            estimatedFare: Number(liveEstimate.totalFare ?? currentFare),
            estimatedDistanceKm: liveEstimate.estimatedDistanceKm,
            ...selectedGoods,
          }
          const draft = await createBooking(payload)
          const data = await confirmBooking(draft.id)
          setCrn(data.bookingNumber)
          setBookingId(data.id)
          setBookingState('SEARCHING')
          trackBookingSubmitted(data.id, selectedVehicleType)
        } catch (err) {
          const msg = err.message || "";
          if (msg.toLowerCase().includes("token") || msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("jwt")) {
            setBookingError("Session expired. Please click Book Now again to log in and confirm your request.");
          } else {
            setBookingError(msg);
          }
        } finally {
          setBookingLoading(false)
        }
      }
    });
  }

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

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="relative bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] min-h-[600px] md:min-h-[650px]">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer z-20">
            <X size={18} />
          </button>

          {bookingState === 'INITIAL' ? (
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
                {estimateData.service === "packers" ? (
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
                                <div className="w-full bg-slate-50 rounded-xl overflow-hidden mb-3 relative z-10">
                                  <img src={imgSrc} alt={displayName} loading="lazy" decoding="async" className="w-full h-auto" />
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
                                <div className="w-24 bg-slate-50 rounded-lg overflow-hidden shrink-0">
                                  <img src={imgSrc} alt={displayName} loading="lazy" decoding="async" className="w-full h-auto" />
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

                    {/* Bottom Fixed Section */}
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
                        className="w-full bg-[#1e5eff] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-sm tracking-wide flex justify-center items-center gap-2"
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
              {/* SEARCHING, CANCELLING, CANCELLED STATES */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
                
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
                            alert(err.message) // Fallback alert for cancel error
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

              {/* QR CODE RIGHT PANE */}
              <div className="w-full md:w-1/2 p-4 md:p-6 bg-white">
                <div className="bg-[#003399] rounded-2xl h-full p-8 text-white flex flex-col relative overflow-hidden">
                  {/* Top section */}
                  <div className="flex justify-between items-start mb-8 z-10">
                    <h2 className="text-2xl md:text-3xl font-bold max-w-[200px] leading-snug">Supercharge Your Logistics!</h2>
                    <a href="https://play.google.com/store/apps/details?id=com.gomytruck.customer&pcampaignid=web_share" target="_blank" rel="noreferrer" className="bg-blue-600 rounded-xl px-3 py-2 flex flex-col items-center shadow-lg border border-blue-500 hover:scale-105 hover:bg-blue-500 transition-transform cursor-pointer">
                      <span className="text-[10px] font-bold tracking-wider mb-1">GoMyTruck</span>
                      <div className="bg-white text-slate-900 text-xs font-bold px-2 py-0.5 rounded">App</div>
                    </a>
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-5 mb-10 z-10 mt-4">
                    <div className="flex items-center gap-4"><div className="w-6 flex justify-center"><MapPin size={20} className="text-blue-300"/></div><span className="font-medium text-sm">In-Transit Updates</span></div>
                    <div className="flex items-center gap-4"><div className="w-6 flex justify-center"><Gift size={20} className="text-blue-300"/></div><span className="font-medium text-sm">Exciting Discounts & Rewards</span></div>
                    <div className="flex items-center gap-4"><div className="w-6 flex justify-center"><MousePointerClick size={20} className="text-blue-300"/></div><span className="font-medium text-sm">1-Tap Booking Options</span></div>
                    <div className="flex items-center gap-4"><div className="w-6 flex justify-center"><Truck size={20} className="text-blue-300"/></div><span className="font-medium text-sm">Loading & Unloading Service</span></div>
                  </div>
                  
                  {/* QR Code */}
                  <div className="mt-auto text-center z-10">
                    <p className="font-bold text-sm mb-4">Scan the QR code to download the app!</p>
                    <div className="bg-white p-3 rounded-xl inline-block shadow-xl">
                      <img src="/download-qr.webp" alt="Download GoMyTruck App QR Code" className="w-56 h-auto" />
                    </div>
                  </div>
                  
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
                </div>
              </div>
            </>
          )}
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `}} />
      </div>

      <GoodsTypeModal
        isOpen={showGoodsModal}
        onClose={() => setShowGoodsModal(false)}
        onSelect={async (goods) => {
          setSelectedGoods(goods)
          setShowGoodsModal(false)
          setEstimateRefreshing(true)
          try {
            const estimate = await fetchEstimate({
              pickupLat: estimateData.pickupLat,
              pickupLng: estimateData.pickupLng,
              dropLat: estimateData.dropLat,
              dropLng: estimateData.dropLng,
              vehicleType: selectedVehicleType,
              hasLoadingService: goods.laborRequired,
              helperCount: goods.laborRequired ? goods.laborersCount : undefined,
            })
            setLiveEstimate(estimate)
          } catch (error) {
            setBookingError(error.message || "Could not update the estimate.")
          } finally {
            setEstimateRefreshing(false)
          }
        }}
      />
    </>
  )
}
