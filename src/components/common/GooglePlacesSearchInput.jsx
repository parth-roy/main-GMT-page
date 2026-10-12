import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { getGoogleMaps, geocodeGoogleAddress } from '../GoogleAddressAutocomplete';

export default function GooglePlacesSearchInput({
  id,
  inputRef,
  placeholder = "Search city or location...",
  icon,
  iconColor = "text-blue-500",
  borderColorClass = "focus-within:border-orange-500",
  value = "",
  onChange,
  onSelect,
  className = "",
  error = false,
}) {
  const [predictions, setPredictions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const sessionTokenRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val.trim()) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const maps = await getGoogleMaps();
        const service = new maps.places.AutocompleteService();
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new maps.places.AutocompleteSessionToken();
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
              );
            } else {
              setPredictions([]);
            }
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Autocomplete error:", err);
        setPredictions([]);
        setLoading(false);
      }
    }, 250);
  };

  const handleSelectPrediction = async (prediction) => {
    setIsOpen(false);
    setPredictions([]);
    onChange(prediction.description);

    try {
      const coords = await geocodeGoogleAddress(prediction.description);
      if (onSelect) {
        onSelect({
          address: prediction.description,
          mainText: prediction.mainText,
          lat: coords.lat,
          lng: coords.lng,
        });
      }
    } catch {
      if (onSelect) {
        onSelect({
          address: prediction.description,
          mainText: prediction.mainText,
          lat: null,
          lng: null,
        });
      }
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div
        className={`flex items-center gap-2.5 bg-white border ${
          error ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'
        } rounded-xl px-3 py-2 transition-all duration-200 ${borderColorClass}`}
      >
        {icon || <MapPin size={16} className={`${iconColor} shrink-0`} />}
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (predictions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full bg-transparent text-slate-800 text-xs sm:text-sm font-medium placeholder:text-slate-400 focus:outline-none"
        />
        {loading && <Loader2 size={13} className="animate-spin text-slate-400 shrink-0" />}
      </div>

      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl ring-1 ring-black/10 z-[100] overflow-hidden max-h-56 overflow-y-auto">
          {loading && predictions.length === 0 ? (
            <div className="flex items-center gap-2 p-3 text-xs text-slate-500">
              <Loader2 size={13} className="animate-spin" />
              <span>Searching Google Maps locations...</span>
            </div>
          ) : predictions.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {predictions.map((p) => (
                <li
                  key={p.placeId || p.description}
                  onClick={() => handleSelectPrediction(p)}
                  className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-orange-50/70 cursor-pointer transition-colors text-left"
                >
                  <MapPin size={15} className="text-orange-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col min-w-0">
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
  );
}
