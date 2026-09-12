/**
 * src/utils/vehicleNaming.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Formats vehicle categories, models, and logistical services into natural,
 * grammatically-correct plural names for "Call 10 Verified [Vehicle]".
 *
 * Examples:
 *   getPluralVehicleName("Tata Ace")                   => "Tata Ace"
 *   getPluralVehicleName("Bolero Pickup")              => "Bolero Pickups"
 *   getPluralVehicleName("Leyland Dost")               => "Leyland Dost Trucks"
 *   getPluralVehicleName("14ft Truck")                 => "14ft Trucks"
 *   getPluralVehicleName("3-Wheeler Cargo")            => "3-Wheelers"
 *   getPluralVehicleName("32ft Container")             => "32ft Containers"
 *   getPluralVehicleName("Commercial Truck Drivers")   => "Trucks"
 *   getPluralVehicleName(null)                         => "Trucks"
 */

export function getPluralVehicleName(raw = "") {
  if (!raw || typeof raw !== "string") return "Trucks";
  const clean = raw.trim();
  const lower = clean.toLowerCase();

  // Explicit mappings for known vehicle categories & aliases
  const map = {
    "tata ace": "Tata Ace",
    "tata-ace": "Tata Ace",
    "chota hathi": "Tata Ace",
    "tata ace / chota hathi": "Tata Ace",
    "bolero pickup": "Bolero Pickups",
    "bolero-pickup": "Bolero Pickups",
    "pickup": "Bolero Pickups",
    "pickup / bolero": "Bolero Pickups",
    "pickup / bolero drivers": "Bolero Pickups",
    "mahindra bolero pickup": "Bolero Pickups",
    "ashok leyland dost": "Leyland Dost Trucks",
    "ashok-leyland-dost": "Leyland Dost Trucks",
    "leyland dost": "Leyland Dost Trucks",
    "tata intra": "Tata Intra Trucks",
    "tata-intra": "Tata Intra Trucks",
    "tata intra v10 / v30": "Tata Intra Trucks",
    "mahindra jeeto": "Mahindra Jeeto Trucks",
    "mahindra-jeeto": "Mahindra Jeeto Trucks",
    "jeeto": "Mahindra Jeeto Trucks",
    "three-wheeler": "3-Wheelers",
    "3-wheeler": "3-Wheelers",
    "3-wheeler cargo": "3-Wheelers",
    "three wheeler": "3-Wheelers",
    "mini-van": "Closed Delivery Vans",
    "mini van": "Closed Delivery Vans",
    "closed van": "Closed Delivery Vans",
    "mini closed delivery van": "Closed Delivery Vans",
    "14ft": "14ft Trucks",
    "14ft truck": "14ft Trucks",
    "14-ft": "14ft Trucks",
    "14 feet truck": "14ft Trucks",
    "14 feet eicher truck": "14ft Trucks",
    "17ft": "17ft Trucks",
    "17ft truck": "17ft Trucks",
    "17-ft": "17ft Trucks",
    "17 feet truck": "17ft Trucks",
    "17 feet commercial truck": "17ft Trucks",
    "19ft": "19ft Trucks",
    "19ft truck": "19ft Trucks",
    "19-ft": "19ft Trucks",
    "19 feet truck": "19ft Trucks",
    "19 feet multi-axle truck": "19ft Trucks",
    "20ft": "20ft Trucks",
    "20ft truck": "20ft Trucks",
    "20-ft": "20ft Trucks",
    "20 feet truck": "20ft Trucks",
    "20 feet multi-axle": "20ft Trucks",
    "32ft": "32ft Containers",
    "32ft container": "32ft Containers",
    "32-ft": "32ft Containers",
    "32 feet container": "32ft Containers",
    "32ft multi-axle container": "32ft Containers",
    "container": "Container Trucks",
    "delivery partners & riders": "Delivery Riders",
    "delivery riders": "Delivery Riders",
    "bike": "Delivery Riders",
    "two wheeler": "Delivery Riders",
    "2-wheeler": "Delivery Riders",
    "movers & shifting drivers": "Packers & Movers",
    "packers and movers": "Packers & Movers",
    "packers & movers": "Packers & Movers",
    "corporate fleet & transporters": "Fleet Transporters",
    "return load drivers": "Return Load Trucks",
    "return load": "Return Load Trucks",
    "mini truck & tata ace drivers": "Mini Trucks & Tata Ace",
    "commercial truck drivers": "Trucks",
    "commercial truck drivers & fleet partners": "Trucks",
    "truck drivers & fleet partners": "Trucks",
    "truck drivers & transporters": "Trucks",
    "commercial freight drivers & transporters": "Trucks",
    "drivers & transporters": "Trucks",
    "driver partners & fleet owners": "Trucks",
    "fleet partners & transporters": "Fleet Owners",
    "logistics workforce & drivers": "Trucks",
    "trucks": "Trucks",
    "truck": "Trucks",
    "drivers": "Trucks"
  };

  if (map[lower]) return map[lower];

  // Heuristic patterns
  if (lower.includes("tata ace") && lower.includes("mini truck")) return "Mini Trucks & Tata Ace";
  if (lower.includes("tata ace") || lower.includes("chota hathi")) return "Tata Ace";
  if (lower.includes("bolero") || lower.includes("pickup")) return "Bolero Pickups";
  if (lower.includes("leyland") || lower.includes("dost")) return "Leyland Dost Trucks";
  if (lower.includes("intra")) return "Tata Intra Trucks";
  if (lower.includes("jeeto")) return "Mahindra Jeeto Trucks";
  if (lower.includes("3-wheeler") || lower.includes("three-wheeler") || lower.includes("3 wheeler") || lower.includes("auto")) return "3-Wheelers";
  if (lower.includes("van")) return "Closed Delivery Vans";
  if (lower.includes("14ft") || lower.includes("14 ft") || lower.includes("14 feet")) return "14ft Trucks";
  if (lower.includes("17ft") || lower.includes("17 ft") || lower.includes("17 feet")) return "17ft Trucks";
  if (lower.includes("19ft") || lower.includes("19 ft") || lower.includes("19 feet")) return "19ft Trucks";
  if (lower.includes("20ft") || lower.includes("20 ft") || lower.includes("20 feet")) return "20ft Trucks";
  if (lower.includes("32ft") || lower.includes("32 ft") || lower.includes("32 feet") || lower.includes("container")) return "32ft Containers";
  if (lower.includes("trailer")) return "Commercial Trailers";
  if (lower.includes("tipper") || lower.includes("dumper")) return "Tippers & Dumpers";
  if (lower.includes("bike") || lower.includes("rider")) return "Delivery Riders";
  if (lower.includes("mover") || lower.includes("shifting") || lower.includes("packer")) return "Packers & Movers";
  if (lower.includes("return load")) return "Return Load Trucks";
  if (lower.includes("fleet")) return "Fleet Owners";
  if (lower.includes("truck") || lower.includes("driver") || lower.includes("transport")) return "Trucks";

  // Fallback: strip "Drivers", "Numbers", "Partners", "Transporters"
  const stripped = clean.replace(/\s*(Drivers|Numbers|Partners|Transporters)\b/gi, "").trim();
  if (!stripped) return "Trucks";
  return stripped.endsWith("s") || stripped.endsWith("S") ? stripped : `${stripped} Trucks`;
}
