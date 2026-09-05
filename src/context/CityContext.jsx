import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasDetected, setHasDetected] = useState(false);

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

  // Perform live auto-detection
  const detectLocation = useCallback(
    async (forceFresh = false) => {
      if (typeof window === "undefined") return;

      // Check if user manually chose a city during this active session
      if (!forceFresh) {
        try {
          const sessionRaw = sessionStorage.getItem(SESSION_CITY_KEY);
          if (sessionRaw) {
            const parsed = JSON.parse(sessionRaw);
            if (parsed?.name) {
              setCurrentCity(parsed);
              setHasDetected(true);
              return parsed;
            }
          }
        } catch {
          // ignore session read errors
        }
      }

      setIsDetecting(true);

      // Strategy 1: Ultra-fast, zero-CORS IP lookup (~80-150ms)
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

      // Strategy 2: High-accuracy browser geolocation if already permitted
      const detectViaBrowserGeo = async () => {
        if (!navigator.geolocation) return null;
        return new Promise((resolve) => {
          const timeout = setTimeout(() => resolve(null), 3000);
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
            { timeout: 3000, maximumAge: 60000 }
          );
        });
      };

      try {
        // Run IP detection first as it doesn't block or prompt the user
        const ipCity = await detectViaIp();
        if (ipCity) {
          setCurrentCity(ipCity);
          setIsDetecting(false);
          setHasDetected(true);
          // Broadcast
          try {
            window.dispatchEvent(
              new CustomEvent("gomytruck:city_change", { detail: ipCity })
            );
          } catch {}
          return ipCity;
        }

        // Fallback to browser geolocation
        const geoCity = await detectViaBrowserGeo();
        if (geoCity) {
          setCurrentCity(geoCity);
          setIsDetecting(false);
          setHasDetected(true);
          try {
            window.dispatchEvent(
              new CustomEvent("gomytruck:city_change", { detail: geoCity })
            );
          } catch {}
          return geoCity;
        }
      } catch (err) {
        console.warn("Location auto-detection encountered an error:", err);
      } finally {
        setIsDetecting(false);
        setHasDetected(true);
      }

      return DEFAULT_CITY;
    },
    []
  );

  // On initial mount / reload: run auto-detection
  useEffect(() => {
    detectLocation(false);

    const handleCustomChange = (e) => {
      if (e?.detail?.name && e.detail.name !== currentCity.name) {
        setCity(e.detail, false);
      }
    };

    window.addEventListener("gomytruck:city_change", handleCustomChange);
    return () =>
      window.removeEventListener("gomytruck:city_change", handleCustomChange);
  }, [detectLocation, setCity, currentCity.name]);

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
