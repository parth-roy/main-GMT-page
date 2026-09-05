import React, { useState, useEffect, useRef } from "react"
import { MapPin, Loader2 } from "lucide-react"
// API key read from env var — set VITE_GOOGLE_MAPS_KEY in .env
import { trackBeginBooking } from "../utils/analytics"

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || 'AIzaSyDd_ernLIpHcBlFmVf-x4n3l8mtjjOL90c';
let googleMapsScriptPromise = null;

function getGoogleMaps() {
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }
  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google.maps);
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }
  return googleMapsScriptPromise;
}

export async function geocodeGoogleAddress(address) {
  const maps = await getGoogleMaps();
  const geocoder = new maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: address, componentRestrictions: { country: "in" } }, (results, status) => {
      if (status === "OK" && results[0]) {
        resolve({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
      } else {
        reject(new Error(`Could not locate address: "${address}"`));
      }
    });
  });
}

export default function GoogleAddressAutocomplete({ 
  label, 
  placeholder, 
  onAddressSelect, 
  className = "",
  id = "",
  autoComplete = "off"
}) {
  const [query, setQuery] = useState("")
  const [predictions, setPredictions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)
  const debounceRef = useRef(null)
  const hasTrackedFocusRef = useRef(false)
  // Session token groups all keystrokes + final selection into ONE billing unit
  const sessionTokenRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    setQuery(val)
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!val.trim()) {
      setPredictions([])
      setIsOpen(false)
      return
    }

    setLoading(true)
    setIsOpen(true)

    debounceRef.current = setTimeout(async () => {
      try {
        const maps = await getGoogleMaps();
        const service = new maps.places.AutocompleteService();

        // Create session token on first keystroke of each new search
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
              setPredictions(results.map(p => ({
                placeId: p.place_id,
                description: p.description,
                mainText: p.structured_formatting?.main_text || p.description,
                secondaryText: p.structured_formatting?.secondary_text || ""
              })));
            } else {
              setPredictions([]);
            }
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Autocomplete error:", err)
        setPredictions([])
        setLoading(false)
      }
    }, 300)
  }

  const handleSelect = async (prediction) => {
    setQuery(prediction.description)
    setIsOpen(false)
    setPredictions([])

    try {
      const maps = await getGoogleMaps();
      // Use PlacesService.getDetails with the session token to terminate the billing
      // session — groups all keystrokes into ONE billed session unit (not per-keystroke).
      const placesService = new maps.places.PlacesService(document.createElement('div'));

      placesService.getDetails(
        {
          placeId: prediction.placeId,
          fields: ['geometry', 'formatted_address'],
          sessionToken: sessionTokenRef.current,
        },
        (place, status) => {
          // Reset after terminating the session — next search starts fresh
          sessionTokenRef.current = null;
          if (status === maps.places.PlacesServiceStatus.OK && place) {
            onAddressSelect({
              address: place.formatted_address || prediction.description,
              lat: place.geometry?.location?.lat() || null,
              lng: place.geometry?.location?.lng() || null,
            });
          } else {
            onAddressSelect({ address: prediction.description, lat: null, lng: null });
          }
        }
      );
    } catch (err) {
      console.error("Place details error:", err)
      sessionTokenRef.current = null;
      onAddressSelect({ address: prediction.description, lat: null, lng: null })
    }
  }

  return (
    <div className={`relative flex flex-col ${className}`} ref={wrapperRef}>
      <label htmlFor={id} className="text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          if (!hasTrackedFocusRef.current) {
            hasTrackedFocusRef.current = true
            trackBeginBooking(id || label || "address-autocomplete")
          }
          if (query.trim()) setIsOpen(true)
        }}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={id ? `${id}-suggestions` : undefined}
        className="min-h-11 w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
      />

      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
          {loading && predictions.length === 0 ? (
            <div className="flex items-center gap-2 p-3 text-xs text-slate-500">
              <Loader2 size={14} className="animate-spin" /> Searching...
            </div>
          ) : predictions.length > 0 ? (
            <ul id={id ? `${id}-suggestions` : undefined} role="listbox">
              {predictions.map((p) => (
                <li 
                  key={p.placeId} 
                  onClick={() => handleSelect(p)}
                  role="option"
                  aria-selected="false"
                  className="flex min-h-11 items-start gap-2 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                >
                  <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800 line-clamp-1">{p.mainText}</span>
                    <span className="text-xs text-slate-500 line-clamp-1">{p.secondaryText}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : query.trim() && !loading ? (
            <div className="p-3 text-xs text-slate-500">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
