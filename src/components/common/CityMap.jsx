import React from "react";
import { ExternalLink, Truck, ShieldCheck, Zap, Navigation } from "lucide-react";

export default function CityMap({ cityName, stateName, vehicleName, serviceType }) {
  if (!cityName) return null;

  const displayName = cityName.trim();
  const displayState = stateName && stateName !== "India" ? stateName.trim() : "";
  const locationQuery = displayState ? `${displayName}, ${displayState}, India` : `${displayName}, India`;
  const mapQuery = encodeURIComponent(locationQuery);

  const embedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const headerTitle = vehicleName
    ? `${vehicleName} Logistics & Dispatch Corridor — ${displayName}`
    : serviceType === "mini-truck"
    ? `Mini Truck & Tata Ace Coverage Map — ${displayName}`
    : `Commercial Logistics & Truck Network — ${displayName}`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden transition-all duration-300">
      {/* Map Card Header */}
      <div className="bg-slate-900 p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
              Active Logistics Hub &amp; Truck Corridor
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-tight">
            {headerTitle}
          </h3>

          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Real-time commercial vehicle dispatch, verified drivers, and industrial transport corridors across {displayName}{displayState ? `, ${displayState}` : ""}.
          </p>
        </div>

        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl border border-white/15 transition-all shrink-0 self-start sm:self-auto hover:border-brand-400 group"
        >
          <Navigation className="w-3.5 h-3.5 text-brand-400 group-hover:scale-110 transition-transform" />
          <span>Open Full Map</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
        </a>
      </div>

      {/* Dynamic Google Maps Interactive Embed */}
      <div className="relative w-full h-72 sm:h-96 bg-slate-100">
        <iframe
          src={embedUrl}
          title={`GoMyTruck Logistics Operations in ${displayName}`}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* Operational Highlights Footer */}
      <div className="bg-slate-50 border-t border-slate-200/90 px-5 py-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-brand-600" />
            <span>Last-Mile &amp; Industrial Corridors</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>VAHAN &amp; ULIP Verified Drivers</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-current" />
            <span>Zero Broker Margin (5% Flat)</span>
          </span>
        </div>

        <div className="text-slate-400 text-[11px]">
          Hub: <strong className="text-slate-700 font-semibold">{displayName} Corridor</strong>
        </div>
      </div>
    </div>
  );
}
