import React, { useState, useEffect } from "react"
import { MapPin, ArrowRight, ShieldCheck, BadgePercent, Zap, TrendingUp, Loader2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import CitySelectorModal from "./CitySelectorModal"
import { detectCurrentCity } from "../api/pricingApi"

export default function Hero({ 
  selectedService, 
  setSelectedService, 
  onOpenEstimate,
  onSelectVehicle
}) {
  const [sliderValue, setSliderValue] = useState(10000)
  const [cityOpen, setCityOpen] = useState(false)
  const { city: slug } = useParams()
  
  const [detectedCity, setDetectedCity] = useState("Kolkata")
  const [cityDetecting, setCityDetecting] = useState(true)

  useEffect(() => {
    if (slug) {
      setDetectedCity(slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " "))
      setCityDetecting(false)
    } else {
      detectCurrentCity().then((detected) => {
        setDetectedCity(detected)
        setCityDetecting(false)
      })
    }
  }, [slug])

  const currentCity = detectedCity

  
  const services = [
    {
      id: "truck",
      name: "Truck",
      imgSrc: "/navy_truck-256.webp",
    },
    {
      id: "bike",
      name: "Two Wheeler",
      imgSrc: "/navy_bike-256.webp",
    },
    {
      id: "movers",
      name: "Packers & Movers",
      imgSrc: "/navy_movers-256.webp",
    }
  ]

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
      <section className="relative min-h-[85vh] pt-24 pb-24 sm:pb-32 flex flex-col justify-end items-center bg-slate-900 overflow-visible mb-32">
        {/* Full-bleed Video Background */}
        <div className="absolute inset-0 z-0">
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
          <div className="absolute inset-0 bg-slate-900/65" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          {/* 5% Commission Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-400/40 rounded-full px-4 py-1.5 mb-6">
            <BadgePercent size={16} className="text-brand-300" />
            <span className="text-brand-200 font-bold text-sm tracking-wide">India's Most Transparent Freight Marketplace — Only 5% Commission</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-lg">
            Online Truck Booking &amp; Goods Transport in Kolkata
          </h1>

          <p className="mt-5 text-xl sm:text-2xl font-bold text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Connect directly with verified trucks across Eastern India.{" "}
            <span className="text-brand-300">No brokers. No surge pricing. No hidden fees.</span>
          </p>

          <p className="mt-3 text-base text-brand-200 font-bold italic" lang="hi-Latn">
            Saaman aapka, transport hamara
          </p>
        </div>

        {/* Floating Services Bar */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full px-4 z-20 flex justify-center">
          <div className="bg-brand-50 rounded-xl shadow-2xl p-6 sm:p-8 sm:px-12 flex flex-col gap-6 border border-slate-100 w-full sm:w-fit">
              <div 
                className="flex items-center gap-2 text-slate-900 font-bold text-sm px-2 w-fit cursor-pointer hover:text-brand-600 transition-colors"
                onClick={() => setCityOpen(true)}
              >
                <MapPin size={20} className="text-brand-600" />
                {cityDetecting ? (
                  <span className="flex items-center gap-1.5 text-slate-400 font-normal">
                    <Loader2 size={13} className="animate-spin" />
                    Detecting...
                  </span>
                ) : (
                  <>
                    <span>City: {currentCity}</span>
                    <span className="text-xs text-brand-500 font-normal ml-1 underline underline-offset-2">Change</span>
                  </>
                )}
              </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-10 lg:gap-16">
              {/* Service Tabs */}
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto justify-start">
                {services.map((srv) => {
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

              {/* CTA Button */}
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
      />
    </>
  )
}

