import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { 
  Truck, ShieldCheck, CheckCircle2, ArrowRight, PhoneCall, 
  IndianRupee, Sparkles, HelpCircle, ChevronDown, ChevronUp, 
  MapPin, Clock, AlertCircle, Check, Loader2
} from "lucide-react";
import SEOHead from "../seo/SEOHead";
import TrustBadgeRow from "../components/TrustBadgeRow";
import { SEO_CITIES } from "../lib/cities";
import { useCity } from "../context/CityContext";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/apiClient";
import { generateCityFaqs } from "../lib/locationFaqHelper";

const VEHICLE_OPTIONS = [
  { value: "TATA_ACE", label: "Tata Ace (Chota Hathi) - 750 kg" },
  { value: "BOLERO_PICKUP", label: "8ft Bolero Pickup - 1.2 - 1.7 Ton" },
  { value: "TRUCK_14FT", label: "14ft Eicher / Canter - 3.5 - 4 Ton" },
  { value: "TRUCK_17FT", label: "17ft Medium Duty Truck - 5 - 6 Ton" },
  { value: "TRUCK_19FT", label: "19ft ICV Truck - 7 - 9 Ton" },
  { value: "TRUCK_22FT", label: "22ft Multi-Axle Truck - 10 - 15 Ton" },
  { value: "CONTAINER_32FT", label: "32ft Single/Multi-Axle Container - 7 - 18 Ton" },
];

export default function AssistedTruckBookingPage() {
  const { city } = useParams();
  const location = useLocation();
  const { setCity } = useCity();
  const { user, requireAuth } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  // Form State
  const [pickupCity, setPickupCity] = useState("");
  const [dropCity, setDropCity] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [vehicleType, setVehicleType] = useState("TATA_ACE");
  const [goodsType, setGoodsType] = useState("General Commercial Goods");
  const [goodsWeightKg, setGoodsWeightKg] = useState("1000");
  const [customerBudget, setCustomerBudget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const isNational = !city || city === "india";
  const cityConfig = isNational 
    ? { name: "Pan-India", slug: "india", state: "India" }
    : (SEO_CITIES.find((c) => c.slug === city) || {
        name: city.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        slug: city,
        state: "India"
      });

  // Scroll to top + pre-fill pickup city whenever URL city changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isNational) {
      setPickupCity(cityConfig.name);
    }
  }, [city]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync global CityContext (navbar city pill) — false = don't replace URL
  useEffect(() => {
    if (!isNational && cityConfig?.slug) {
      setCity({
        name: cityConfig.name,
        slug: cityConfig.slug,
        state: cityConfig.state || "India",
        region: cityConfig.state || "India",
      }, false);
    }
  }, [city]); // eslint-disable-line react-hooks/exhaustive-deps

  const cityName = cityConfig.name;
  const stateName = cityConfig.state || "India";
  const canonicalPath = isNational 
    ? "/services/assisted-truck-booking" 
    : `/services/assisted-truck-booking/${cityConfig.slug}`;

  const handleSubmitLoad = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!pickupCity.trim() || !dropCity.trim()) {
      return setSubmitError("Please specify both pickup and destination cities.");
    }
    if (!customerBudget || Number(customerBudget) < 100) {
      return setSubmitError("Please enter your realistic preferred target budget (min ₹100).");
    }

    const payload = {
      pickupCity: pickupCity.trim(),
      pickupAddress: pickupAddress.trim() || `${pickupCity.trim()} City Center`,
      dropCity: dropCity.trim(),
      dropAddress: dropAddress.trim() || `${dropCity.trim()} City Center`,
      vehicleType,
      goodsType,
      goodsWeightKg: Number(goodsWeightKg) || 1000,
      customerBudget: Number(customerBudget),
      targetCities: [pickupCity.trim().toLowerCase()]
    };

    const executePost = async () => {
      setIsSubmitting(true);
      try {
        const res = await apiClient('/broker/loads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setSubmitSuccess(data.data?.id || "LOAD-CONFIRMED");
        } else {
          setSubmitError(data.message || "Failed to post load. Please try again.");
        }
      } catch (err) {
        setSubmitError("Network connection error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (user) {
      executePost();
    } else {
      requireAuth(() => {
        executePost();
      });
    }
  };

  // ── Dynamic, hyper-local FAQs (same system as the 26K PSEO pages) ──────────
  const cityFaqData = useMemo(() => generateCityFaqs(cityConfig, "truck-booking"), [city]); // eslint-disable-line react-hooks/exhaustive-deps
  const pageFaqs = [
    {
      question: `What is Assisted Truck Booking in ${cityName}?`,
      answer: `Assisted Truck Booking is GoMyTruck's custom-budget freight service for MSMEs, traders, and shippers in ${cityName}. You set your preferred target budget. Our regional network of verified Transport Agents in ${cityName} coordinates with commercial truck owners to match a verified vehicle at your price — with 25% advance lock and OTP-verified physical loading.`
    },
    {
      question: `How does the 25% Advance Lock protect my freight booking in ${cityName}?`,
      answer: `Once a suitable driver and vehicle RC are selected and verified for your shipment from ${cityName}, you pay only a 25% advance to lock in the booking. The remaining 75% balance is paid directly after the vehicle reaches your destination, eliminating upfront overpayment risks common with unverified brokers in ${cityName}.`
    },
    {
      question: `What is the Physical Loading OTP verification?`,
      answer: `When the assigned truck arrives at your pickup location in ${cityName}, your representative inspects the vehicle and provides a 4-digit Loading OTP to the driver only after cargo is safely loaded. This guarantees that driver and agent payouts are only authorized after your physical goods are securely loaded on board.`
    },
    {
      question: `Can I book assisted trucks for intercity transport from ${cityName}?`,
      answer: `Yes. GoMyTruck Assisted Booking supports all intracity local trips from ${cityName}, regional industrial corridor freight, and long-haul intercity shipments to 900+ cities across all 28 Indian states. Set your target rate and our agent network handles the rest.`
    },
    ...cityFaqData.faqs.slice(0, 2), // Dynamic city-specific transport FAQs
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://gomytruck.com/book-truck-online" },
        { "@type": "ListItem", "position": 3, "name": `Assisted Truck Booking ${cityName}`, "item": `https://gomytruck.com${canonicalPath}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `Assisted Truck Booking & Budget Freight Sourcing in ${cityName}`,
      "serviceType": "Freight Transport, Assisted Truck Booking, Custom Budget Logistics",
      "provider": {
        "@type": "Organization",
        "name": "GoMyTruck Logistics Platform",
        "url": "https://gomytruck.com",
        "logo": "https://gomytruck.com/logo.webp"
      },
      "areaServed": {
        "@type": "Place",
        "name": cityName,
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": stateName
        }
      },
      "description": `Post custom budget truck loads in ${cityName}. GoMyTruck assisted freight matching pairs verified commercial trucks to your target budget with 25% advance lock and OTP loading security.`
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": pageFaqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ];

  return (
    <>
      <SEOHead
        title={`Assisted Truck Booking in ${cityName} | Post Your Budget - GoMyTruck`}
        description={`Need a commercial truck in ${cityName} on your preferred budget? Post your cargo load. Our verified transport network matches verified trucks at your target rate with 25% advance lock.`}
        canonical={canonicalPath}
        keywords={`assisted truck booking ${cityName}, budget truck hire ${cityName}, post cargo load ${cityName}, custom freight rate ${cityName}, hire truck at my budget ${cityName}, transport broker ${cityName}, assisted lorry booking ${cityName}, GoMyTruck assisted booking`}
        jsonLd={jsonLd}
      />

      <div className="bg-white min-h-screen text-slate-800">
        {/* HERO SECTION — white/light mode, navbar-safe top offset */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/40 to-emerald-50/60 pt-28 pb-16 md:pt-32 md:pb-20 mt-[68px] border-b border-green-100">
          {/* Subtle dot grid */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#6DBE45_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb — dark text on white */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-8">
              <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
              <span className="text-slate-300">/</span>
              <Link to="/services/assisted-truck-booking" className="hover:text-green-600 transition-colors">Assisted Truck Booking</Link>
              {!isNational && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-800 font-semibold">{cityName}</span>
                </>
              )}
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-100 border border-green-200 text-green-700 text-xs md:text-sm font-semibold">
                  <Sparkles size={14} className="text-green-600" />
                  <span>Custom Budget Freight Sourcing · {cityName}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Hire Commercial Trucks at{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                    Your Target Budget
                  </span>{" "}
                  in {cityName}
                </h1>

                {/* GEO ANSWER TARGET — readable on white */}
                <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl">
                  In <strong className="text-slate-900">{cityName}</strong>, GoMyTruck Assisted Truck Booking lets shippers, manufacturers, and traders post freight loads with their preferred budget. Verified transport agents in {cityName} coordinate with vehicle owners to fulfill shipments at competitive rates — backed by 25% advance lock and OTP physical loading verification.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-green-100">
                  <div className="space-y-1">
                    <div className="text-2xl font-black text-green-600">25%</div>
                    <div className="text-xs text-slate-500">Advance Lock-In</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-black text-slate-900">100%</div>
                    <div className="text-xs text-slate-500">Verified Driver & RC</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-black text-green-600">OTP</div>
                    <div className="text-xs text-slate-500">Physical Loading Safe</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                  <a href="tel:6291957542" className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                    <PhoneCall size={14} className="text-green-600" />
                    <span>Freight Desk: 6291957542</span>
                  </a>
                  <span className="text-slate-300">•</span>
                  <span>Avg. response: 20 mins</span>
                </div>
              </div>

              {/* POST BUDGET LOAD CARD */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl text-slate-900 border border-slate-100">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Post Load with Your Budget</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Verified transport agents in {cityName} will source trucks</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                      <Truck size={22} />
                    </div>
                  </div>

                  {submitSuccess ? (
                    <div className="py-8 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                        <Check size={32} />
                      </div>
                      <h4 className="text-2xl font-bold text-slate-900">Load Posted Successfully!</h4>
                      <p className="text-sm text-slate-600 max-w-sm mx-auto">
                        Your load in <span className="font-semibold">{pickupCity}</span> has been dispatched to verified transport agents. You will receive quotes matching your budget shortly.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitSuccess(null);
                          setCustomerBudget("");
                        }}
                        className="py-2.5 px-6 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        Post Another Load
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitLoad} className="space-y-4">
                      {submitError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                          <AlertCircle size={15} className="flex-shrink-0" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Pickup City</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Kolkata, Mumbai"
                            value={pickupCity}
                            onChange={(e) => setPickupCity(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Destination City</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Patna, Delhi, Pune"
                            value={dropCity}
                            onChange={(e) => setDropCity(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Required Vehicle</label>
                          <select
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                          >
                            {VEHICLE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Approx Cargo Weight (kg)</label>
                          <input
                            type="number"
                            placeholder="e.g. 1500"
                            value={goodsWeightKg}
                            onChange={(e) => setGoodsWeightKg(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Your Target Budget (₹ INR) <span className="text-green-600">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">₹</span>
                          <input
                            type="number"
                            required
                            min="100"
                            placeholder="Enter the maximum fare you wish to pay"
                            value={customerBudget}
                            onChange={(e) => setCustomerBudget(e.target.value)}
                            className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Agents will bid to fulfill this trip at or below your target rate.</p>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 rounded-xl text-center text-sm font-bold bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Posting Load...</span>
                          </>
                        ) : (
                          <>
                            <span>Post Load with My Budget</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST ROW */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-slate-100">
          <TrustBadgeRow />
        </div>

        {/* 3 PILLARS OF SECURITY */}
        <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Shippers in {cityName} Trust Assisted Booking
            </h2>
            <p className="mt-3 text-slate-600 text-sm md:text-base">
              Say goodbye to spot-market price gouging and unverified transport brokers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-xl mb-5">
                <IndianRupee size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">You Control the Price</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                State your budget upfront. Transport partners source vehicles that match your commercial economics, preventing last-minute price inflation.
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-xl mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">25% Advance Protection</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                You only pay a 25% advance to lock in your truck. Driver earnings and agent bounties remain withheld until the vehicle is physically loaded.
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-xl mb-5">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Loading OTP Verification</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The driver verifies a secure 4-digit OTP provided by you only after your freight is physically checked and loaded on board the vehicle.
              </p>
            </div>
          </div>
        </section>

        {/* FAQS SECTION */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm mt-1">Everything you need to know about assisted truck booking in {cityName}</p>
          </div>

          <div className="space-y-4">
            {pageFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left font-semibold text-slate-800 flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={18} className="text-green-600" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Need a Truck in {cityName} at Your Budget?
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto text-sm md:text-base">
              Post your cargo requirements today and let our verified network of transport agents handle the sourcing — at your target rate, with OTP-protected loading.
            </p>
            <div className="pt-2">
              <a
                href="tel:6291957542"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-white text-green-700 hover:bg-green-50 shadow-xl transition-all"
              >
                <PhoneCall size={18} />
                <span>Call Freight Desk: 6291957542</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
