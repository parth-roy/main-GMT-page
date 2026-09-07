import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, Navigation, Loader2, Anchor, Package, Check, Sparkles, Building2 } from "lucide-react";
import { SEO_CITIES } from "../lib/cities";
import { CITY_HERO_IMAGES } from "../api/pricingApi";
import { useCity } from "../context/CityContext";

const TOP_CITIES = [
  { name: "Mumbai", slug: "mumbai", image: "/cities/mumbai.webp" },
  { name: "Delhi NCR", slug: "new-delhi", image: "/cities/delhi.webp" },
  { name: "Bengaluru", slug: "bengaluru", image: "/cities/bengaluru.webp" },
  { name: "Hyderabad", slug: "hyderabad", image: "/cities/hyderabad.webp" },
  { name: "Chennai", slug: "chennai", image: "/cities/chennai-icon.webp" },
  { name: "Ahmedabad", slug: "ahmedabad", image: "/cities/ahmedabad.webp" },
  { name: "Pune", slug: "pune", image: "/cities/pune.webp" },
  { name: "Surat", slug: "surat", image: "/cities/surat.webp" },
  { name: "Jaipur", slug: "jaipur", image: "/cities/jaipur-icon.webp" },
  { name: "Kolkata", slug: "kolkata", image: "/cities/kolkata.webp" },
  { name: "Lucknow", slug: "lucknow", image: "/cities/lucknow.webp" },
  { name: "Coimbatore", slug: "coimbatore", image: "/cities/coimbatore-icon.webp" },
  { name: "Indore", slug: "indore", image: "/cities/indore.webp" },
  { name: "Chandigarh", slug: "chandigarh", image: "/cities/chandigarh-icon.webp" },
  { name: "Kochi", slug: "kochi", image: "/cities/kochi-icon.webp" },
];

// Specialized commercial ports, SEZs, and major APMC trade mandis
const SPECIALIZED_LOGISTICS_HUBS = [
  { name: "Kandla Port", slug: "kandla", state: "Gujarat", category: "port", tag: "Port & SEZ" },
  { name: "Mundra Port", slug: "mundra", state: "Gujarat", category: "port", tag: "Port & SEZ" },
  { name: "Nhava Sheva (JNPT)", slug: "nhava-sheva", state: "Maharashtra", category: "port", tag: "Container Port" },
  { name: "Bhiwandi Logistics Hub", slug: "bhiwandi", state: "Maharashtra", category: "hub", tag: "Warehousing Hub" },
  { name: "Pipavav Port", slug: "pipavav", state: "Gujarat", category: "port", tag: "Port & SEZ" },
  { name: "Ennore Port", slug: "ennore", state: "Tamil Nadu", category: "port", tag: "Port & Industrial" },
  { name: "Paradip Port", slug: "paradip-port", state: "Odisha", category: "port", tag: "Deep Sea Port" },
  { name: "Tuticorin Port (V.O.C)", slug: "tuticorin", state: "Tamil Nadu", category: "port", tag: "Major Sea Port" },
  { name: "Krishnapatnam Port", slug: "krishnapatnam", state: "Andhra Pradesh", category: "port", tag: "Port & Logistics" },
  { name: "Baddi Industrial Area", slug: "baddi", state: "Himachal Pradesh", category: "hub", tag: "Pharma SEZ" },
  { name: "Pantnagar Industrial Estate", slug: "pantnagar", state: "Uttarakhand", category: "hub", tag: "Automobile Hub" },
  { name: "Sriperumbudur Industrial Hub", slug: "sri-perumbudur", state: "Tamil Nadu", category: "hub", tag: "Manufacturing Hub" },
  { name: "Manesar Industrial Zone", slug: "manesar", state: "Haryana", category: "hub", tag: "Automobile Hub" },
  { name: "Sanand GIDC", slug: "sanand", state: "Gujarat", category: "hub", tag: "Engineering GIDC" },
  { name: "Chakan Industrial Belt", slug: "chakan", state: "Maharashtra", category: "hub", tag: "Auto Cluster" },
  { name: "Peenya Industrial Area", slug: "peenya", state: "Karnataka", category: "hub", tag: "Industrial Estate" },
  { name: "Pithampur Auto Cluster", slug: "pithampur", state: "Madhya Pradesh", category: "hub", tag: "Auto Cluster" },
  { name: "Azadpur Mandi", slug: "azadpur-mandi", state: "Delhi", category: "mandi", tag: "APMC Agri Mandi" },
  { name: "Vashi APMC Market", slug: "vashi-apmc", state: "Maharashtra", category: "mandi", tag: "Wholesale APMC" },
  { name: "Lasalgaon Onion Market", slug: "lasalgaon-onion-market", state: "Maharashtra", category: "mandi", tag: "Onion Market" },
  { name: "Guntur Chilli Yard", slug: "guntur-chilli-yard", state: "Andhra Pradesh", category: "mandi", tag: "Spices Market" },
  { name: "Unnao Leather Cluster", slug: "unnao-leather-cluster", state: "Uttar Pradesh", category: "hub", tag: "Leather Cluster" },
  { name: "Morbi Ceramic Zone", slug: "morbi-ceramic-zone", state: "Gujarat", category: "hub", tag: "Ceramics Hub" },
  { name: "Sivakasi Printing Hub", slug: "sivakasi-printing-hub", state: "Tamil Nadu", category: "hub", tag: "Printing Hub" },
  { name: "Tirupur Knitwear Cluster", slug: "tirupur-knitwear-cluster", state: "Tamil Nadu", category: "hub", tag: "Textile Cluster" },
  { name: "Panipat Textile Hub", slug: "panipat-textile-hub", state: "Haryana", category: "hub", tag: "Textile Hub" },
  { name: "Surat Textile Market", slug: "surat-textile-market", state: "Gujarat", category: "mandi", tag: "Textile Market" },
  { name: "Agra Shoe Cluster", slug: "agra-shoe-cluster", state: "Uttar Pradesh", category: "hub", tag: "Footwear Cluster" }
];

// Master list of all 540+ locations
const ALL_LOCATIONS = [
  ...SEO_CITIES.map(c => ({ ...c, category: "city" })),
  ...SPECIALIZED_LOGISTICS_HUBS.filter(h => !SEO_CITIES.some(c => c.slug === h.slug))
];

const FILTER_PILLS = [
  { label: "All Locations", key: "all" },
  { label: "Maharashtra", key: "Maharashtra" },
  { label: "Gujarat", key: "Gujarat" },
  { label: "Uttar Pradesh", key: "Uttar Pradesh" },
  { label: "West Bengal", key: "West Bengal" },
  { label: "Tamil Nadu", key: "Tamil Nadu" },
  { label: "Karnataka", key: "Karnataka" },
  { label: "Rajasthan", key: "Rajasthan" },
  { label: "Andhra Pradesh", key: "Andhra Pradesh" },
  { label: "Telangana", key: "Telangana" },
  { label: "Punjab & Haryana", key: "Punjab_Haryana" },
  { label: "Bihar & Jharkhand", key: "Bihar_Jharkhand" },
  { label: "Ports & SEZs", key: "port" },
  { label: "APMC Mandis", key: "mandi" },
];

export default function CitySelectorModal({ isOpen, onClose, onCitySelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [detectingLoc, setDetectingLoc] = useState(false);
  const { currentCity, setCity, detectLocation } = useCity();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Reset filters when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setActiveFilter("all");
    }
  }, [isOpen]);

  const handleCitySelect = (citySlug, cityName) => {
    const matched = ALL_LOCATIONS.find(
      (c) => c.slug === citySlug || c.name.toLowerCase() === (cityName || "").toLowerCase()
    );
    const finalName =
      matched?.name || cityName || citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, " ");
    
    const cityObj = {
      name: finalName,
      slug: citySlug,
      state: matched?.state || "India",
      region: matched?.state || "India",
    };

    setCity(cityObj, true);

    if (onCitySelect) {
      onCitySelect(finalName, citySlug);
    }
    onClose();
  };

  const handleAutoDetectClick = async () => {
    setDetectingLoc(true);
    try {
      const detected = await detectLocation(true);
      if (detected && onCitySelect) {
        onCitySelect(detected.name, detected.slug);
      }
      onClose();
    } catch {
      // ignore
    } finally {
      setDetectingLoc(false);
    }
  };

  // Memoized search and category filtering
  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return ALL_LOCATIONS.filter((item) => {
      // Search matching across name, state, and slug
      const matchesSearch = !q || (
        item.name.toLowerCase().includes(q) ||
        (item.state && item.state.toLowerCase().includes(q)) ||
        item.slug.includes(q) ||
        (item.tag && item.tag.toLowerCase().includes(q))
      );

      if (!matchesSearch) return false;

      // Filter pill matching
      if (activeFilter === "all") return true;
      if (activeFilter === "port") return item.category === "port";
      if (activeFilter === "mandi") return item.category === "mandi";
      if (activeFilter === "Punjab_Haryana") return item.state === "Punjab" || item.state === "Haryana";
      if (activeFilter === "Bihar_Jharkhand") return item.state === "Bihar" || item.state === "Jharkhand";
      
      return item.state === activeFilter;
    });
  }, [searchQuery, activeFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center p-1.5">
              <img src="/google-maps-icon.webp" alt="Location" width={22} height={22} className="w-5 h-5 object-contain" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Choose your city or location</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Covering <strong className="text-slate-800 font-bold">{ALL_LOCATIONS.length}+</strong> cities, industrial zones, ports &amp; APMC mandis across India
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="overflow-y-auto p-5 sm:p-6 custom-scrollbar space-y-6">
          
          {/* Top Cities Grid (Shown only when not searching) */}
          {!searchQuery && activeFilter === "all" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500" /> Popular Metros
                </h3>
                <span className="text-[11px] text-slate-400">Instant dispatch hubs</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2.5">
                {TOP_CITIES.map((city) => {
                  const isCurrent = currentCity?.slug === city.slug;
                  return (
                    <button
                      key={city.slug}
                      onClick={() => handleCitySelect(city.slug, city.name)}
                      className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer border ${
                        isCurrent 
                          ? "bg-brand-50 border-brand-400 shadow-xs ring-2 ring-brand-400/30" 
                          : "bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200 shadow-2xs hover:shadow-xs"
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                      <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl overflow-hidden mb-1.5 border border-slate-100 group-hover:scale-105 transition-transform">
                        <img 
                          src={city.image || CITY_HERO_IMAGES[city.name] || "/hero-bg.webp"} 
                          alt={city.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className={`text-xs font-bold text-center leading-tight truncate w-full ${isCurrent ? "text-brand-700" : "text-slate-800 group-hover:text-brand-600"}`}>
                        {city.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Auto-Detect Button */}
          <div>
            <button
              onClick={handleAutoDetectClick}
              disabled={detectingLoc}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-2xl font-bold text-sm transition-all shadow-2xs cursor-pointer"
            >
              {detectingLoc ? (
                <>
                  <Loader2 size={16} className="animate-spin text-emerald-600" />
                  <span>Detecting your current location...</span>
                </>
              ) : (
                <>
                  <Navigation size={16} className="text-emerald-600" />
                  <span>Auto-Detect Current Location (Current: <strong className="ml-1 text-emerald-900 font-black">{currentCity.name}</strong>)</span>
                </>
              )}
            </button>
          </div>

          {/* Search Bar & Clear Action */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search by city, district, port, mandi, or state (e.g. Pune, Surat, Mundra, UP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 text-sm font-medium shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick State / Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar -mx-1 px-1">
            {FILTER_PILLS.map((pill) => {
              const active = activeFilter === pill.key;
              return (
                <button
                  key={pill.key}
                  onClick={() => setActiveFilter(pill.key)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* All Locations Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {searchQuery || activeFilter !== "all" ? "Filtered Locations" : "All Cities & Transport Hubs"}
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {filteredLocations.length} locations found
              </span>
            </div>

            {filteredLocations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredLocations.map((item) => {
                  const isCurrent = currentCity?.slug === item.slug;
                  return (
                    <button
                      key={item.slug}
                      onClick={() => handleCitySelect(item.slug, item.name)}
                      className={`flex items-center gap-3 w-full text-left p-2.5 rounded-xl transition-all cursor-pointer group border ${
                        isCurrent
                          ? "bg-brand-50/70 border-brand-300 ring-1 ring-brand-400/40"
                          : "bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        item.category === "port"
                          ? "bg-sky-50 text-sky-600 group-hover:bg-sky-100"
                          : item.category === "mandi"
                          ? "bg-amber-50 text-amber-600 group-hover:bg-amber-100"
                          : isCurrent
                          ? "bg-brand-100 text-brand-700"
                          : "bg-slate-100 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600"
                      }`}>
                        {item.category === "port" ? (
                          <Anchor size={14} />
                        ) : item.category === "mandi" ? (
                          <Package size={14} />
                        ) : (
                          <img src="/google-maps-icon.webp" alt="City" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0" />
                        )}
                      </div>

                      {/* Two-line clean stack: City Name on top, State on bottom - NO awkward truncation */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs sm:text-sm font-bold truncate ${
                            isCurrent ? "text-brand-800" : "text-slate-800 group-hover:text-brand-600"
                          }`}>
                            {item.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 group-hover:text-slate-500 truncate">
                          {item.tag ? `${item.state} · ${item.tag}` : item.state}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 mb-1">No locations found</p>
                <p className="text-xs text-slate-400">
                  Try searching for another city, industrial hub, or state name.
                </p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
