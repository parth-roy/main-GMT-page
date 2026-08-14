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

/**
 * Detects the user's current city via:
 *   1. Browser Geolocation API → lat/lng
 *   2. Backend reverse-geocode → address string
 *   3. Extract city from Mapbox place_name format: "area, City, State, India"
 *
 * Falls back to "Kolkata" if permission denied or any step fails.
 *
 * @returns {Promise<string>} City name (matched against SERVED_CITIES if possible)
 */
export async function detectCurrentCity() {
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve('Kolkata'), 3000); // Strict 3s timeout
  });

  const geoPromise = new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve('Kolkata');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `${BASE_URL}/maps/reverse-geocode?lat=${coords.latitude}&lng=${coords.longitude}`
          );
          if (!res.ok) throw new Error('reverse-geocode failed');
          const json = await res.json();
          if (!json.success || !json.data?.address) throw new Error('no address');

          // Mapbox place_name: "Neighbourhood, City, State, India"
          const parts = json.data.address.split(',').map((s) => s.trim());
          const matched = parts.find((p) =>
            SERVED_CITIES.some((c) => c.toLowerCase() === p.toLowerCase())
          );
          if (matched) {
            resolve(matched);
            return;
          }
          
          const fallbackCity = parts[1];
          resolve(fallbackCity ? fallbackCity : 'Kolkata');
        } catch {
          resolve('Kolkata');
        }
      },
      () => resolve('Kolkata'),
      { timeout: 3000, maximumAge: 300_000 }
    );
  });

  return Promise.race([geoPromise, timeoutPromise]);
}
