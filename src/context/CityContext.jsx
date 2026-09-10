import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { SEO_CITIES } from "../lib/cities";

const CityContext = createContext(null);

export const DEFAULT_CITY = {
  name: "Kolkata",
  slug: "kolkata",
  state: "West Bengal",
  region: "Eastern India",
};

const SESSION_CITY_KEY = "gomytruck_session_city";
const LEGACY_STORAGE_KEY = "gomytruck_selected_city";

// O(1) slug map for instantaneous lookup across all 516+ cities
const CITY_SLUG_MAP = new Map(
  SEO_CITIES.map((c) => [c.slug.toLowerCase(), c])
);

/**
 * Extract active city from current URL pathname
 */
export function extractCityFromUrl(pathname) {
  if (!pathname || typeof pathname !== "string") return null;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  // Prefixed patterns: /loads/:city/..., /drivers/:city/..., /cargo/:city/..., /industrial/:city/..., /local/:city/..., /intercity/:city, /local-transport/:city
  const prefixHandlers = ["loads", "drivers", "cargo", "industrial", "local", "intercity", "local-transport"];
  if (prefixHandlers.includes(segments[0]) && segments[1]) {
    const candidate = segments[1].toLowerCase().replace(/-transport$/, "");
    if (CITY_SLUG_MAP.has(candidate)) {
      const found = CITY_SLUG_MAP.get(candidate);
      return {
        name: found.name,
        slug: found.slug,
        state: found.state || "India",
        region: found.state || "India",
      };
    }
  }

  // Corridor routes: /routes/:origin-to-:destination or /transport/:origin-to-:destination
  if ((segments[0] === "routes" || segments[0] === "transport") && segments[1]) {
    const routeParts = segments[1].split("-to-");
    if (routeParts[0] && CITY_SLUG_MAP.has(routeParts[0].toLowerCase())) {
      const found = CITY_SLUG_MAP.get(routeParts[0].toLowerCase());
      return {
        name: found.name,
        slug: found.slug,
        state: found.state || "India",
        region: found.state || "India",
      };
    }
  }

  // Direct first segment pattern: /:city or /:city/... e.g. /kolkata/mini-truck-booking, /jaipur, /ahmedabad/truck-booking/tata-ace
  const firstSeg = segments[0].toLowerCase();
  if (CITY_SLUG_MAP.has(firstSeg)) {
    const found = CITY_SLUG_MAP.get(firstSeg);
    return {
      name: found.name,
      slug: found.slug,
      state: found.state || "India",
      region: found.state || "India",
    };
  }

  return null;
}

/**
 * Match a raw city name or coordinates against our SEO_CITIES registry
 */
export function resolveCityConfig(rawCityName, rawStateName) {
  if (!rawCityName) return null;
  const clean = rawCityName.trim().toLowerCase();

  // Try exact slug or name match
  const matched = SEO_CITIES.find(
    (c) =>
      c.name.toLowerCase() === clean ||
      c.slug.toLowerCase() === clean ||
      c.name.toLowerCase().includes(clean) ||
      clean.includes(c.name.toLowerCase())
  );

  if (matched) {
    return {
      name: matched.name,
      slug: matched.slug,
      state: matched.state || rawStateName || "India",
      region: matched.state || "India",
    };
  }

  // If outside known list, construct a clean city object
  const formattedName =
    rawCityName.charAt(0).toUpperCase() + rawCityName.slice(1).trim();
  const slug = rawCityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    name: formattedName,
    slug: slug || "kolkata",
    state: rawStateName || "India",
    region: rawStateName || "India",
  };
}

export function CityProvider({ children }) {
  let location;
  try {
    location = useLocation();
  } catch {
    location = { pathname: "/" };
  }

  // Initial city resolved synchronously from current route (SSR & Client)
  const [currentCity, setCurrentCity] = useState(() => {
    const urlCity = extractCityFromUrl(location?.pathname);
    if (urlCity) return urlCity;

    if (typeof window !== "undefined") {
      try {
        const sessionRaw = sessionStorage.getItem(SESSION_CITY_KEY);
        if (sessionRaw) {
          const parsed = JSON.parse(sessionRaw);
          if (parsed?.name && parsed?.slug) return parsed;
        }
      } catch {}
    }
    return DEFAULT_CITY;
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [hasDetected, setHasDetected] = useState(false);
  const currentCityRef = useRef(currentCity);
  currentCityRef.current = currentCity;

  // Set city with optional manual session persistence
  const setCity = useCallback((cityInput, isManual = true) => {
    if (!cityInput) return;

    let cityObj;
    if (typeof cityInput === "string") {
      cityObj = resolveCityConfig(cityInput) || {
        name: cityInput,
        slug: cityInput.toLowerCase().replace(/\s+/g, "-"),
        state: "India",
        region: "India",
      };
    } else {
      cityObj = {
        name: cityInput.name || "Kolkata",
        slug: cityInput.slug || "kolkata",
        state: cityInput.state || "West Bengal",
        region: cityInput.region || cityInput.state || "India",
      };
    }

    // Loop & redundant update guard: if the city slug and name match the current city, bail out immediately
    if (
      currentCityRef.current &&
      currentCityRef.current.slug === cityObj.slug &&
      currentCityRef.current.name.toLowerCase() === cityObj.name.toLowerCase()
    ) {
      return;
    }

    currentCityRef.current = cityObj;
    setCurrentCity(cityObj);

    if (typeof window !== "undefined") {
      try {
        if (isManual) {
          sessionStorage.setItem(SESSION_CITY_KEY, JSON.stringify(cityObj));
        }
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(cityObj));
        window.dispatchEvent(
          new CustomEvent("gomytruck:city_change", { detail: cityObj })
        );
      } catch {
        // Storage disabled/restricted
      }
    }
  }, []);

  // Reactively synchronize CityContext with URL location on route change
  useEffect(() => {
    const urlCity = extractCityFromUrl(location.pathname);
    if (urlCity && urlCity.slug !== currentCityRef.current?.slug) {
      setCity(urlCity, false);
    }
  }, [location.pathname, setCity]);

  // Perform live auto-detection
  const detectLocation = useCallback(
    async (forceFresh = false) => {
      if (typeof window === "undefined") return currentCityRef.current || DEFAULT_CITY;

      // GUARD: If current URL path already specifies a city and forceFresh is false, NEVER allow IP overwrite!
      const activeUrlCity = extractCityFromUrl(location.pathname);
      if (activeUrlCity && !forceFresh) {
        setCity(activeUrlCity, false);
        setHasDetected(true);
        return activeUrlCity;
      }

      // Check if user manually chose a city during this active session
      if (!forceFresh) {
        try {
          const sessionRaw = sessionStorage.getItem(SESSION_CITY_KEY);
          if (sessionRaw) {
            const parsed = JSON.parse(sessionRaw);
            if (parsed?.name) {
              setCity(parsed, true);
              setHasDetected(true);
              return parsed;
            }
          }
        } catch {
          // ignore session read errors
        }
      }

      setIsDetecting(true);

      // Strategy 1: Prompt for browser location permission (HTML5 Geolocation)
      const detectViaBrowserGeo = async () => {
        if (!navigator.geolocation) return null;
        return new Promise((resolve) => {
          const timeout = setTimeout(() => resolve(null), 4000);
          navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
              clearTimeout(timeout);
              try {
                const res = await fetch(
                  `https://api-test.gomytruck.com/api/v1/maps/reverse-geocode?lat=${coords.latitude}&lng=${coords.longitude}`
                );
                if (!res.ok) return resolve(null);
                const json = await res.json();
                if (json.success && json.data?.city) {
                  return resolve(
                    resolveCityConfig(json.data.city, json.data.region)
                  );
                }
              } catch {
                resolve(null);
              }
              resolve(null);
            },
            () => {
              clearTimeout(timeout);
              resolve(null);
            },
            { timeout: 4000, maximumAge: 0, enableHighAccuracy: false }
          );
        });
      };

      // Strategy 2: Seamless fallback to IP lookup if user blocks/dismisses GPS
      const detectViaIp = async () => {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 3500);
          const res = await fetch("https://ipwho.is/", {
            signal: controller.signal,
          });
          clearTimeout(timer);
          if (!res.ok) return null;
          const data = await res.json();
          if (data && data.success && data.city) {
            return resolveCityConfig(data.city, data.region);
          }
        } catch {
          // IP fallback failed
        }
        return null;
      };

      try {
        // 1. Ask for location permission first
        const geoCity = await detectViaBrowserGeo();
        const currentUrlCity = extractCityFromUrl(window.location.pathname);
        if (currentUrlCity && !forceFresh) {
          setCity(currentUrlCity, false);
          return currentUrlCity;
        }

        if (geoCity) {
          setCity(geoCity, true);
          return geoCity;
        }

        // 2. Fallback to IP detection if GPS is blocked or timed out
        const ipCity = await detectViaIp();
        const currentUrlCityAfterIp = extractCityFromUrl(window.location.pathname);
        if (currentUrlCityAfterIp && !forceFresh) {
          setCity(currentUrlCityAfterIp, false);
          return currentUrlCityAfterIp;
        }

        if (ipCity) {
          setCity(ipCity, false);
          return ipCity;
        }
      } catch (err) {
        console.warn("Location auto-detection encountered an error:", err);
      } finally {
        setIsDetecting(false);
        setHasDetected(true);
      }

      return currentCityRef.current || DEFAULT_CITY;
    },
    [location.pathname, setCity]
  );

  // On initial mount: run auto-detection
  useEffect(() => {
    detectLocation(false);

    const handleCustomChange = (e) => {
      if (
        e?.detail?.slug &&
        e.detail.slug !== currentCityRef.current?.slug
      ) {
        setCity(e.detail, false);
      }
    };

    window.addEventListener("gomytruck:city_change", handleCustomChange);
    return () =>
      window.removeEventListener("gomytruck:city_change", handleCustomChange);
  }, [detectLocation, setCity]);

  return (
    <CityContext.Provider
      value={{
        currentCity,
        isDetecting,
        hasDetected,
        setCity,
        detectLocation,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    return {
      currentCity: DEFAULT_CITY,
      isDetecting: false,
      hasDetected: true,
      setCity: () => {},
      detectLocation: async () => DEFAULT_CITY,
    };
  }
  return context;
}
