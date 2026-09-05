/**
 * pricingApi.js
 * Connects the vahan (customer web portal) to the real server pricing APIs.
 * Server base URL: http://139.59.60.77:5000/api/v1
 */

const BASE_URL = 'https://api-test.gomytruck.com/api/v1';

/**
 * GET /api/v1/pricing/vehicles
 * Returns all active vehicle types with baseFare, pricePerKm, capacity, ETA, imageUrl
 */
export async function fetchVehicles() {
  const res = await fetch(`${BASE_URL}/pricing/vehicles`);
  if (!res.ok) throw new Error(`Failed to fetch vehicles: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch vehicles');
  return json.data; // array of VehiclePricing
}

/**
 * POST /api/v1/pricing/estimate
 * Calculates a fare estimate given pickup + drop coordinates + vehicle type.
 *
 * @param {object} params
 * @param {number} params.pickupLat
 * @param {number} params.pickupLng
 * @param {number} params.dropLat
 * @param {number} params.dropLng
 * @param {string} params.vehicleType  e.g. "TRUCK", "2_WHEELER", "PACKERS"
 * @param {boolean} [params.hasLoadingService]
 * @param {boolean} [params.insuranceOpted]
 * @returns {Promise<FareEstimateResponse>}
 *
 * FareEstimateResponse shape:
 * {
 *   estimatedDistanceKm: number,
 *   estimatedDurationMinutes: number,
 *   baseFare: number,
 *   distanceFare: number,
 *   loadingCharge: number,
 *   insuranceCharge: number,
 *   totalFare: number,
 *   minFare: number,
 *   vehicle: VehiclePricing
 * }
 */
export async function fetchEstimate({ pickupLat, pickupLng, dropLat, dropLng, vehicleType, hasLoadingService = false, helperCount, insuranceOpted = false }) {
  const res = await fetch(`${BASE_URL}/pricing/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pickupLat, pickupLng, dropLat, dropLng, vehicleType, hasLoadingService, helperCount, insuranceOpted }),
  });
  if (!res.ok) throw new Error(`Estimate request failed: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to get estimate');
  return json.data; // FareEstimateResponse
}

/**
 * GET /api/v1/maps/autocomplete
 * Returns place predictions for a given input string.
 */
export async function fetchAutocomplete(input) {
  if (!input) return [];
  const res = await fetch(`${BASE_URL}/maps/autocomplete?input=${encodeURIComponent(input)}`);
  if (!res.ok) throw new Error(`Autocomplete failed: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch predictions');
  return json.data; // array of predictions { placeId, description, mainText, secondaryText }
}

/**
 * GET /api/v1/maps/place-details
 * Returns lat, lng, name, address for a placeId.
 */
export async function fetchPlaceDetails(placeId) {
  const res = await fetch(`${BASE_URL}/maps/place-details?placeId=${encodeURIComponent(placeId)}`);
  if (!res.ok) throw new Error(`Place details failed: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch place details');
  return json.data; // { lat, lng, name, address }
}

/**
 * Geocode an address string into { lat, lng } using the server's maps geocode API.
 * POST /api/v1/maps/geocode  or  GET /api/v1/maps/geocode?address=...
 * Uses the same backend Mapbox integration as the mobile apps.
 */
export async function geocodeAddress(address) {
  const url = `${BASE_URL}/maps/geocode?address=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Address lookup is temporarily unavailable. Please try again.');
  const json = await res.json();
  if (!json.success || !json.data) throw new Error(`Could not locate address: "${address}"`);
  return { lat: json.data.lat, lng: json.data.lng };
}

/**
 * Map from UI service label → server vehicleType enum value
 */
export const SERVICE_TO_VEHICLE_TYPE = {
  truck: 'MINI_TRUCK',
  bike: 'BIKE',
  movers: 'TATA_ACE',
};

/**
 * Local first-party hero media avoids render-blocking third-party image hosts.
 */
export const CITY_HERO_IMAGES = {
  Kolkata: "/hero-bg-1600.webp",
  Barrackpore: "/hero-bg-1600.webp",
  Howrah: "/hero-bg-1600.webp",
  "Salt Lake": "/hero-bg-1600.webp",
  "New Town": "/hero-bg-1600.webp",
}

/**
 * Cities served by Parther Logistics.
 * Used by the city selector dropdown on TruckPage.
 */
export const SERVED_CITIES = [
  'Kolkata',
  'Barrackpore',
  'Howrah',
  'Salt Lake',
  'New Town',
];

// ─── CITY PERSISTENCE HELPERS ────────────────────────────────────────────────

const CITY_STORAGE_KEY = 'gomytruck_selected_city';

/**
 * Read the user's persisted city from localStorage.
 * Returns { name: string, slug: string } or null.
 */
export function getPersistedCity() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CITY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.name) return parsed;
  } catch {}
  return null;
}

/**
 * Persist the user's city to localStorage and broadcast it to all
 * mounted components via the global custom event.
 */
export function setPersistedCity(name, slug) {
  if (typeof window === 'undefined' || !name) return;
  const city = {
    name,
    slug: slug || name.toLowerCase().replace(/[\s_]+/g, '-'),
  };
  try {
    localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(city));
    window.dispatchEvent(new CustomEvent('gomytruck:city_change', { detail: city }));
  } catch {}
  return city;
}

// ─── IP-BASED CITY DETECTION FALLBACK ────────────────────────────────────────

/**
 * Detect approximate city from the user's IP address via ipwho.is (fast, zero CORS issues, free)
 * with ipapi.co as fallback.
 */
async function detectCityFromIP() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const r = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timer);
    if (r.ok) {
      const data = await r.json();
      if (data?.success && data?.city) return data.city;
    }
  } catch {}

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const r = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timer);
    if (r.ok) {
      const data = await r.json();
      if (data?.city) return data.city;
    }
  } catch {}

  return null;
}

/**
 * Detects the user's current city via:
 *   1. Active session override (if user manually chose a city during this session)
 *   2. Live IP-based detection via ipwho.is (fastest, unblocked)
 *   3. Browser Geolocation API → backend reverse-geocode
 *   4. LocalStorage cache fallback if offline
 *   5. Final fallback: "Kolkata"
 *
 * @returns {Promise<string>} City name
 */
export async function detectCurrentCity() {
  // 1. Check session storage for user's explicit choice in current browsing session
  if (typeof window !== 'undefined') {
    try {
      const sessionRaw = sessionStorage.getItem('gomytruck_session_city');
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        if (parsed?.name) return parsed.name;
      }
    } catch {}
  }

  // 2. Live IP-based detection (fastest, runs immediately on page load/refresh)
  const ipCity = await detectCityFromIP();
  if (ipCity) {
    setPersistedCity(ipCity);
    return ipCity;
  }

  // 3. Try browser geolocation → backend reverse-geocode (strict 3s timeout)
  const geoCity = await new Promise((resolve) => {
    const fallbackTimer = setTimeout(() => resolve(null), 3000);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      clearTimeout(fallbackTimer);
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        clearTimeout(fallbackTimer);
        try {
          const res = await fetch(
            `${BASE_URL}/maps/reverse-geocode?lat=${coords.latitude}&lng=${coords.longitude}`
          );
          if (!res.ok) throw new Error('reverse-geocode failed');
          const json = await res.json();
          if (json.success && json.data?.city) {
            return resolve(json.data.city);
          }
          if (json.data?.address) {
            const parts = json.data.address.split(',').map((s) => s.trim());
            const matched = parts.find((p) =>
              SERVED_CITIES.some((c) => c.toLowerCase() === p.toLowerCase())
            );
            resolve(matched || parts[1] || parts[0] || null);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      },
      () => { clearTimeout(fallbackTimer); resolve(null); },
      { timeout: 3000, maximumAge: 60_000 }
    );
  });

  if (geoCity) {
    setPersistedCity(geoCity);
    return geoCity;
  }

  // 4. Fallback to localStorage if present
  const persisted = getPersistedCity();
  if (persisted?.name) return persisted.name;

  // 5. Final fallback
  return 'Kolkata';
}
