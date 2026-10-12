import React, { useState, useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"
// API key read from env var — set VITE_GOOGLE_MAPS_KEY in .env
import { trackBeginBooking } from "../utils/analytics"

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || 'AIzaSyDd_ernLIpHcBlFmVf-x4n3l8mtjjOL90c';
let googleMapsScriptPromise = null;

export function getGoogleMaps() {
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }
  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        if (window.google?.maps) return resolve(window.google.maps);
        existingScript.addEventListener('load', () => resolve(window.google?.maps));
        existingScript.addEventListener('error', (err) => reject(err));
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google.maps);
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }
  return googleMapsScriptPromise;
}

// Module-level in-memory caches to save Google Maps API billing costs
const predictionCache = new Map();
const placeDetailsCache = new Map();
const geocodingCache = new Map();

function setBoundedCache(cache, key, value, limit = 150) {
  if (cache.size >= limit) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, value);
}

export async function geocodeGoogleAddress(address) {
  const normKey = (address || "").trim().toLowerCase();
  if (!normKey) throw new Error("Empty address provided for geocoding.");
  
  if (geocodingCache.has(normKey)) {
    return geocodingCache.get(normKey);
  }

  const maps = await getGoogleMaps();
  const geocoder = new maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: address, componentRestrictions: { country: "in" } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const coords = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        setBoundedCache(geocodingCache, normKey, coords);
        resolve(coords);
      } else {
        reject(new Error(`Could not locate address: "${address}"`));
      }
    });
  });
}

/**
 * Modern, cost-effective Places Autocomplete fetcher:
 * 1. Checks in-memory cache first (0 network calls, 0 cost)
 * 2. Uses google.maps.places.AutocompleteSuggestion (2025+ modern standard, avoids deprecation warning)
 * 3. Gracefully falls back to AutocompleteService for legacy support
 */
export async function fetchPlacePredictions(maps, input, sessionToken) {
  const trimmed = (input || "").trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = trimmed.toLowerCase();
  if (predictionCache.has(cacheKey)) {
    return predictionCache.get(cacheKey);
  }

  // 1. Try modern AutocompleteSuggestion API (recommended 2025/2026, 0 deprecation warning)
  if (maps?.places?.AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
    try {
      const { suggestions } = await maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: trimmed,
        includedRegionCodes: ["in"],
        sessionToken: sessionToken || undefined,
      });

      if (Array.isArray(suggestions) && suggestions.length > 0) {
        const mapped = suggestions.map((s) => {
          const p = s.placePrediction;
          return {
            placeId: p?.placeId || "",
            description: p?.text?.toString() || "",
            mainText: p?.mainText?.toString() || p?.text?.toString() || "",
            secondaryText: p?.secondaryText?.toString() || "",
          };
        });
        setBoundedCache(predictionCache, cacheKey, mapped);
        return mapped;
      }
      return [];
    } catch (modernErr) {
      console.warn("[Places] AutocompleteSuggestion error, attempting fallback:", modernErr);
    }
  }

  // 2. Fallback to AutocompleteService (for older environments or when new API unavailable)
  if (maps?.places?.AutocompleteService) {
    return new Promise((resolve) => {
      try {
        const service = new maps.places.AutocompleteService();
        service.getPlacePredictions(
          {
            input: trimmed,
            sessionToken: sessionToken || undefined,
            componentRestrictions: { country: "in" },
          },
          (results, status) => {
            if (status === maps.places.PlacesServiceStatus.OK && Array.isArray(results)) {
              const mapped = results.map((p) => ({
                placeId: p.place_id,
                description: p.description,
                mainText: p.structured_formatting?.main_text || p.description,
                secondaryText: p.structured_formatting?.secondary_text || "",
              }));
              setBoundedCache(predictionCache, cacheKey, mapped);
              resolve(mapped);
            } else {
              resolve([]);
            }
          }
        );
      } catch (err) {
        resolve([]);
      }
    });
  }

  return [];
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

    const trimmed = val.trim();
    // Do not call API for empty or short queries (< 3 chars) to avoid noisy & costly calls
    if (trimmed.length < 3) {
      setPredictions([])
      setIsOpen(false)
      setLoading(false)
      return
    }

    // Check in-memory prediction cache first
    const cacheKey = trimmed.toLowerCase();
    if (predictionCache.has(cacheKey)) {
      setPredictions(predictionCache.get(cacheKey));
      setIsOpen(true);
      setLoading(false);
      return;
    }

    setLoading(true)
    setIsOpen(true)

    // 400ms debounce saves ~60% of intermediate keystroke requests
    debounceRef.current = setTimeout(async () => {
      try {
        const maps = await getGoogleMaps();
        if (!sessionTokenRef.current && maps?.places?.AutocompleteSessionToken) {
          sessionTokenRef.current = new maps.places.AutocompleteSessionToken();
        }
        const mapped = await fetchPlacePredictions(maps, trimmed, sessionTokenRef.current);
        setPredictions(mapped);
        setLoading(false);
      } catch (err) {
        console.error("Autocomplete error:", err);
        setPredictions([]);
        setLoading(false);
      }
    }, 400);
  }

  const handleSelect = async (prediction) => {
    setQuery(prediction.description)
    setIsOpen(false)
    setPredictions([])

    // Check place details cache first
    if (placeDetailsCache.has(prediction.placeId)) {
      const cached = placeDetailsCache.get(prediction.placeId);
      sessionTokenRef.current = null;
      onAddressSelect(cached);
      return;
    }

    try {
      const maps = await getGoogleMaps();
      // Use PlacesService.getDetails with the session token to terminate the billing
      // session — groups all keystrokes into ONE billed session unit (not per-keystroke).
      const placesService = new maps.places.PlacesService(document.createElement('div'));

      placesService.getDetails(
        {
          placeId: prediction.placeId,
          fields: ['geometry.location', 'formatted_address'],
          sessionToken: sessionTokenRef.current,
        },
        (place, status) => {
          // Reset after terminating the session — next search starts fresh
          sessionTokenRef.current = null;
          if (status === maps.places.PlacesServiceStatus.OK && place) {
            const result = {
              address: place.formatted_address || prediction.description,
              lat: place.geometry?.location?.lat() || null,
              lng: place.geometry?.location?.lng() || null,
            };
            setBoundedCache(placeDetailsCache, prediction.placeId, result);
            onAddressSelect(result);
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
                  <img src="/google-maps-icon.webp" alt="Location" width={16} height={16} className="w-4 h-4 object-contain shrink-0 mt-0.5" />
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
