import React, { useState } from "react"
import { X, ArrowRight, Truck, Bike, Package, ChevronDown, Loader2, AlertCircle, Shield, CheckCircle } from "lucide-react"
import { geocodeAddress, fetchEstimate, fetchVehicles, SERVICE_TO_VEHICLE_TYPE } from "../api/pricingApi"
import { trackEstimateRequested, trackLead } from "../utils/analytics"
import EstimateResultModal from "./EstimateResultModal"
import AddressAutocomplete from "./AddressAutocomplete"

const SERVICES = [
  { id: "truck",  name: "Truck",             desc: "For heavy loads and full house shifting.",     imgSrc: "/navy_truck.webp"  },
  { id: "bike",   name: "Two Wheeler",        desc: "Fastest for documents and small parcels.",     imgSrc: "/navy_bike.webp"   },
  { id: "movers", name: "Packers & Movers",   desc: "Complete packing and safe relocation.",        imgSrc: "/navy_movers.webp" },
]

/**
 * GetEstimateModal — 2-step flow:
 *  Step 1: Select service type (Truck navigates to /truck, others go to Step 2)
 *  Step 2: Enter route details → call API → open EstimateResultModal
 */
export default function GetEstimateModal({ isOpen, onClose, onSelectService }) {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(null)

  // Form fields for step 2
  const [pickup, setPickup] = useState("")
  const [pickupCoords, setPickupCoords] = useState(null)
  const [drop, setDrop] = useState("")
  const [dropCoords, setDropCoords] = useState(null)
  const [weight, setWeight] = useState("")
  const [phone, setPhone] = useState("")
  const [pincode, setPincode] = useState("")

  // Loading / error
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Result
  const [estimateResult, setEstimateResult] = useState(null)
  const [showEstimate, setShowEstimate] = useState(false)

  const handleSelectService = (id) => {
    if (id === "truck" || id === "bike" || id === "movers") {
      onSelectService(id)
      onClose()
      return
    }
    setSelectedService(id)
    setStep(2)
    setError("")
  }

  const handleBack = () => {
    setStep(1)
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pickup || !pickupCoords) return setError("Please select a pickup address.")
    if (!drop || !dropCoords) return setError("Please select a drop address.")
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) return setError("Enter a valid 10-digit Indian mobile number.")

    setLoading(true)
    setError("")

    try {
      const vehicleType = SERVICE_TO_VEHICLE_TYPE[selectedService] || "MINI_TRUCK"

      const estimate = await fetchEstimate({
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        dropLat: dropCoords.lat,
        dropLng: dropCoords.lng,
        vehicleType,
      })

      // Merge estimate data with form data for the EstimateResultModal
      setEstimateResult({
        ...estimate,
        pickupAddress: pickup,
        dropAddress: drop,
        pickupPin: pincode,
        dropPin: "",
        weight: weight || "N/A",
        phone,
        service: selectedService,
      })

      // Track analytics
      trackEstimateRequested(selectedService)
      trackLead("Get Estimate Modal", selectedService)

      // Save as a lead in backend with role 'Estimate' so it shows in admin
      fetch("https://api-test.gomytruck.com/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Estimate Request",
          phone: phone,
          city: pickup,
          role: "Estimate",
          notes: `Pickup: ${pickup}, Drop: ${drop}, Service: ${selectedService}, Weight: ${weight || "N/A"}`
        })
      }).catch(err => console.warn("Failed to save estimate lead", err))

      onClose()
      setShowEstimate(true)
    } catch (err) {
      setError(err.message || "Failed to get estimate. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseAll = () => {
    setShowEstimate(false)
    setStep(1)
    setSelectedService(null)
    setPickup(""); setPickupCoords(null); setDrop(""); setDropCoords(null); setWeight(""); setPhone(""); setPincode("")
    setError("")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Estimate full detail modal (shown after submit) */}
      {showEstimate && estimateResult && (
        <EstimateResultModal
          isOpen={showEstimate}
          onClose={handleCloseAll}
          estimateData={estimateResult}
        />
      )}

      {/* Service selection / form modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>

        <div className="relative bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row min-h-[580px] md:min-h-[550px]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all z-20 cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Left Sidebar */}
          <div className="md:w-[35%] bg-brand-50 p-8 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 leading-tight">
              Get an <br /><span className="text-brand-600">Estimate</span>
            </h2>
            <p className="text-slate-500 mt-6 text-sm leading-relaxed font-medium">
              {step === 1
                ? "Select the type of vehicle or service you need. Our transparent pricing system will instantly calculate the most affordable fare."
                : `Selected: ${SERVICES.find(s => s.id === selectedService)?.name ?? ""}. Now enter your route details to get a live quote.`
              }
            </p>
            {step === 2 && (
              <button
                onClick={handleBack}
                className="mt-6 text-sm text-brand-600 font-bold hover:underline text-left cursor-pointer"
              >
                ← Change Service
              </button>
            )}
          </div>

          {/* Right Content */}
          <div className="md:w-[65%] p-6 sm:p-8 md:px-10 bg-white flex flex-col justify-center">

            {/* STEP 1: Select Service */}
            {step === 1 && (
              <>
                <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">Select a Service</h3>
                <div className="flex flex-col gap-4">
                  {SERVICES.map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => handleSelectService(srv.id)}
                      className="relative flex items-center w-full p-4 sm:p-5 rounded-2xl transition-all duration-500 group overflow-hidden bg-slate-50 border border-transparent hover:bg-brand-50 hover:shadow-[0_0_25px_rgba(0,31,63,0.15)] cursor-pointer text-left"
                    >
                      <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                        <img
                          src={srv.imgSrc}
                          alt={srv.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain mix-blend-multiply contrast-[1.20] brightness-[1.10] transition-all duration-500 opacity-85 group-hover:scale-110 group-hover:-translate-y-2 group-hover:opacity-100"
                        />
                      </div>
                      <div className="ml-6 flex-grow">
                        <h3 className="font-bold text-lg sm:text-xl text-slate-800 group-hover:text-brand-700 transition-colors">{srv.name}</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 transition-transform duration-500 group-hover:-translate-y-1">{srv.desc}</p>
                      </div>
                      <div className="ml-4 shrink-0 h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
                        <ArrowRight size={20} />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* STEP 2: Enter Route Details */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-2">Enter Route Details</h3>

                {error && (
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg px-3 py-2">
                    <AlertCircle size={14} className="shrink-0" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pickup City */}
                  <div>
                    <AddressAutocomplete
                      id="estimate-pickup"
                      autoComplete="street-address"
                      label="Pickup City / Address *"
                      placeholder="e.g. Kolkata"
                      onAddressSelect={(res) => {
                        setPickup(res.address)
                        setPickupCoords({ lat: res.lat, lng: res.lng })
                      }}
                    />
                  </div>

                  {/* Drop City */}
                  <div>
                    <AddressAutocomplete
                      id="estimate-drop"
                      label="Drop City / Address *"
                      placeholder="e.g. Mumbai"
                      onAddressSelect={(res) => {
                        setDrop(res.address)
                        setDropCoords({ lat: res.lat, lng: res.lng })
                      }}
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Load Weight (kg)</label>
                    <input
                      type="number" min="1"
                      inputMode="numeric"
                      placeholder="e.g. 500"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  {/* Pincode (optional) */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pickup Pincode</label>
                    <input
                      type="text" maxLength={6}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="e.g. 700001"
                      value={pincode}
                      onChange={e => setPincode(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Number *</label>
                    <input
                      type="tel" required maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="10-digit Indian mobile"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Calculating Estimate…</>
                  ) : (
                    <><span>Get Live Estimate</span><ArrowRight size={18} /></>
                  )}
                </button>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide">
                  <span className="flex items-center gap-1"><Shield size={12} className="text-emerald-500" /> Secure 256-bit Booking</span>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <span className="flex items-center gap-1"><CheckCircle size={12} className="text-blue-500" /> Verified Partners</span>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
