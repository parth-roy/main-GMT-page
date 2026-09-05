import React, { useState, useEffect, useRef } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { trackBeginBooking } from "../utils/analytics"
// Migrated from Mapbox backend proxy to Google Maps direct SDK for cost savings
import GoogleAddressAutocomplete from "./GoogleAddressAutocomplete"

/**
 * AddressAutocomplete — drop-in wrapper around GoogleAddressAutocomplete.
 * Props are identical to the old Mapbox-backed version.
 */
export default function AddressAutocomplete({ 
  label, 
  placeholder, 
  onAddressSelect, 
  className = "",
  id = "",
  autoComplete = "off"
}) {
  return (
    <GoogleAddressAutocomplete
      label={label}
      placeholder={placeholder}
      onAddressSelect={onAddressSelect}
      className={className}
      id={id}
      autoComplete={autoComplete}
    />
  )
}
