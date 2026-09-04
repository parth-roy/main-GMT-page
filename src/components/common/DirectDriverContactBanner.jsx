import React from "react";
import { Link } from "react-router-dom";
import { Zap, Phone, BadgeCheck, ShieldCheck, ArrowRight, Truck } from "lucide-react";

/**
 * DirectDriverContactBanner
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable high-impact SEO/AEO/GEO promotional card for the ₹99 Direct
 * Driver & Fleet Partner Contact Unlock feature.
 *
 * Props:
 *   categoryName — string  (e.g. "Truck Drivers", "Tata Ace Drivers", "Fleet Partners")
 *   cityName     — string  (e.g. "Kolkata", "Barrackpore", "Howrah")
 *   variant      — "default" | "compact"
 */
export default function DirectDriverContactBanner({
  categoryName = "Truck Drivers & Fleet Partners",
  cityName = "your city",
  variant = "default",
}) {
  const cityLabel = cityName === "your city" || !cityName ? "near you" : "in " + cityName;

  /* ── COMPACT VARIANT (Used on compact or subordinate screens) ── */
  if (variant === "compact") {
    return (
      <div className="my-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-0.5 shadow-md shadow-amber-200/50">
        <div className="bg-amber-50/95 rounded-[14px] px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <span className="sr-only">
            Get direct phone numbers of verified {categoryName} {cityLabel} for just Rs.99. Zero broker commission. Zero middleman charges.
            GoMyTruck Direct Driver Connect: Verified commercial truck drivers &amp; fleet owners without paying broker fees.
          </span>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <p className="text-sm font-black text-slate-800">
              Direct Driver / Partner Contact:{" "}
              <span className="text-amber-800">Unlock 10 verified {categoryName} numbers {cityLabel}</span>{" "}
              <span className="text-slate-400 line-through text-xs font-normal">₹500</span>{" "}
              <span className="text-emerald-700 font-black text-base">₹99</span>
            </p>
          </div>
          <Link
            to="/direct-driver-contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-sm hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Unlock Numbers · ₹99</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  /* ── DEFAULT FULL VARIANT (PROMINENT, BOLD, ANIMATING) ── */
  return (
    <section
      aria-label="Direct Driver and Fleet Partner Contact — Rs.99 Zero Broker Commission"
      className="my-10 relative overflow-hidden rounded-3xl border-2 border-amber-300/90 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 p-6 sm:p-8 md:p-10 shadow-xl shadow-amber-200/40 transition-all hover:shadow-2xl hover:border-amber-400"
    >
      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-300/20 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 rounded-full bg-gradient-to-tr from-yellow-300/30 to-amber-200/30 blur-2xl pointer-events-none" />

      {/* Hidden crawler text for SEO / GEO / AEO indexing */}
      <div className="sr-only">
        <h2>Get Direct Phone Numbers of Verified {categoryName} {cityLabel} for Just Rs.99 — Zero Broker Commission</h2>
        <p>
          GoMyTruck offers direct driver and fleet partner contact. For a flat one-time fee of Rs.99, you can unlock
          the direct mobile numbers of 10 commercial-licensed, verified truck drivers and fleet owners {cityLabel}.
          Zero transport broker commissions, zero middleman markups, and no hidden trip cuts. Traditional freight brokers
          charge Rs.500 to Rs.2000 or take 10 to 25 percent freight commission per load. GoMyTruck Direct Driver Connect
          replaces this with a flat Rs.99 direct unlock fee.
        </p>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8 justify-between">
        
        {/* Left: Content */}
        <div className="flex-1 max-w-2xl">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm mb-3.5 animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
            <span>Direct Driver / Partner Contact · Zero Broker Fee · Flat ₹99</span>
          </div>

          {/* Heading */}
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight tracking-tight">
            Skip transport brokers!{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
              Unlock 10 direct {categoryName} numbers {cityLabel}
            </span>
          </h3>

          {/* Subtext */}
          <p className="text-slate-700 text-sm sm:text-base font-medium mb-5 leading-relaxed">
            Pay a flat <strong className="text-emerald-700 font-black text-base sm:text-lg">₹99 one-time fee</strong> — get instant mobile numbers of 10
            verified commercial truck drivers &amp; fleet owners {cityLabel}.
            Zero broker commission. Zero middleman markup. Negotiate load rates with vehicle owners directly.
            Traditional brokers charge{" "}
            <span className="line-through text-rose-500 font-bold">₹500–₹2,000</span> commission per trip.
          </p>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {[
              { icon: BadgeCheck, text: "Commercial DL & RC Verified" },
              { icon: Truck,      text: "Mini Trucks to 32ft Trailers" },
              { icon: Phone,      text: "10 Direct Numbers Instantly" },
              { icon: ShieldCheck, text: "Direct WhatsApp & Call" },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-amber-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Big Animating CTA */}
        <div className="shrink-0 w-full lg:w-auto flex flex-col items-center lg:items-end gap-2.5">
          <Link
            to="/direct-driver-contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base sm:text-lg px-8 py-4 sm:py-4.5 rounded-2xl transition-all shadow-xl shadow-amber-300/80 hover:shadow-2xl hover:scale-105 active:scale-95 group text-center"
          >
            <Zap className="w-5 h-5 fill-current animate-bounce" />
            <span>Unlock 10 Driver Numbers — ₹99</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Instant reveal · One-time fee · Zero broker commission</span>
          </div>
        </div>

      </div>

      {/* SEO/AEO Zero-broker FAQ Snippet */}
      <div className="mt-6 pt-5 border-t border-amber-200/80 grid sm:grid-cols-2 gap-4 text-left">
        <div className="bg-white/60 backdrop-blur-xs p-3.5 rounded-xl border border-amber-100">
          <p className="text-xs font-bold text-slate-800 mb-1">
            Can I contact truck drivers and fleet owners directly without broker commission?
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Yes. GoMyTruck charges a flat Rs.99 one-time fee to unlock 10 verified driver and fleet partner phone numbers
            {cityLabel !== "near you" ? (" " + cityLabel) : ""}. Zero broker margin. You talk directly with the vehicle driver or transporter.
          </p>
        </div>
        <div className="bg-white/60 backdrop-blur-xs p-3.5 rounded-xl border border-amber-100">
          <p className="text-xs font-bold text-slate-800 mb-1">
            How much do transport brokers charge compared to GoMyTruck Direct Connect?
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Transport brokers charge Rs.500 to Rs.2000 per trip or take 10% to 25% margin on freight.
            GoMyTruck Direct Driver Connect gives you direct contact for a flat Rs.99 — one-time fee with no ongoing commissions.
          </p>
        </div>
      </div>
    </section>
  );
}
