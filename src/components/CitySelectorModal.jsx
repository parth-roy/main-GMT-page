import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MapPin, X } from "lucide-react";
import { SEO_CITIES } from "../lib/cities";
import { CITY_HERO_IMAGES } from "../api/pricingApi";

const TOP_CITIES = [
  { name: "Mumbai", slug: "mumbai", image: "/cities/mumbai.webp" },
  { name: "Delhi NCR", slug: "new-delhi", image: "/cities/delhi.webp" },
  { name: "Bengaluru", slug: "bengaluru", image: "/cities/bengaluru.webp" },
  { name: "Hyderabad", slug: "hyderabad", image: "/cities/hyderabad.webp" },
  { name: "Chennai", slug: "chennai", image: "/cities/chennai.webp" },
  { name: "Ahmedabad", slug: "ahmedabad", image: "/cities/ahmedabad.webp" },
  { name: "Pune", slug: "pune", image: "/cities/pune.webp" },
  { name: "Surat", slug: "surat", image: "/cities/surat.webp" },
  { name: "Jaipur", slug: "jaipur", image: "/cities/jaipur.webp" },
  { name: "Kolkata", slug: "kolkata", image: "/cities/kolkata.webp" },
  { name: "Lucknow", slug: "lucknow", image: "/cities/lucknow.webp" },
  { name: "Coimbatore", slug: "coimbatore", image: "/cities/coimbatore.webp" },
  { name: "Indore", slug: "indore", image: "/cities/indore.webp" },
];

export default function CitySelectorModal({ isOpen, onClose, onCitySelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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

  if (!isOpen) return null;

  const handleCitySelect = (citySlug, cityName) => {
    if (onCitySelect) {
      onCitySelect(cityName || citySlug);
      onClose();
      return;
    }

    // Current pathname could be:
    // / (home)
    // /kolkata (city hub)
    // /kolkata/truck-booking (city service)
    // /driver-onboarding (global page)
    
    const citySlugs = SEO_CITIES.map((c) => c.slug);
    const parts = location.pathname.split("/").filter(Boolean);
    
    if (parts.length === 0) {
      // Home page -> go to city hub
      navigate(`/${citySlug}`);
    } else if (citySlugs.includes(parts[0])) {
      // We are on a city page. Replace the first part (the city slug).
      parts[0] = citySlug;
      navigate(`/${parts.join("/")}`);
    } else {
      // We are on a global page (e.g. /contact, /truck). 
      // Redirect to the city hub to ensure they see the localized view.
      navigate(`/${citySlug}`);
    }
    onClose();
  };

  const filteredCities = SEO_CITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">Choose your city</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="overflow-y-auto p-5 md:p-6 custom-scrollbar">
          
          {/* Top Cities Grid */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Top Cities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TOP_CITIES.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => handleCitySelect(city.slug, city.name)}
                  className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
                    <img 
                      src={city.image || CITY_HERO_IMAGES[city.name] || "/hero-bg.webp"} 
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-600">
                    {city.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search your city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* All Cities List */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              {searchQuery ? "Search Results" : "All Cities"}
            </h3>
            {filteredCities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredCities.map((city) => (
                  <button
                    key={city.slug}
                    onClick={() => handleCitySelect(city.slug, city.name)}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-brand-50 text-slate-700 hover:text-brand-700 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors shrink-0">
                      <MapPin size={14} className="text-slate-400 group-hover:text-brand-600" />
                    </div>
                    <span className="font-medium truncate">{city.name}, {city.state}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No cities found matching "{searchQuery}"
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
