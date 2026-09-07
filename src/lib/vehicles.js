/**
 * src/lib/vehicles.js
 * 
 * Centralized Commercial Vehicle Registry for GoMyTruck Programmatic SEO, GEO & AEO.
 * Maps the 8 foundational vehicle classes with technical dimensions, payload capacities,
 * per-km pricing benchmarks, and AI-citable fact structures.
 */

export const ALL_SEO_VEHICLES = [
  {
    slug: "tata-ace",
    name: "Tata Ace / Chota Hathi",
    shortName: "Tata Ace",
    category: "Mini Truck / SCV",
    capacityKg: 850,
    capacityTons: 0.85,
    lengthFt: 7.2,
    widthFt: 4.8,
    heightFt: 4.5,
    volumeCuFt: 155,
    baseFare: 299,
    baseDistanceKm: 2,
    perKmRate: 22,
    popularFor: "1 BHK home shifting, small retail parcels, e-commerce, electronics & grocery transport",
    bodyType: "Open Deck / Closed Tarpaulin",
    image: "/vehicles/Tata Ace.webp",
    seoDescription: "Hire Tata Ace (Chota Hathi) for intra-city goods transport and local house shifting. 850 kg payload capacity at transparent per-km rates with zero broker commission.",
    geoAnswer: "Tata Ace (Chota Hathi) has a maximum payload capacity of 850 kg and deck dimensions of 7.2ft length × 4.8ft width. It is the most economical mini truck for local city transport, retail deliveries, and 1 BHK shifting.",
  },
  {
    slug: "bolero-pickup",
    name: "Mahindra Bolero Pickup",
    shortName: "Bolero Pickup",
    category: "Pickup Truck",
    capacityKg: 1500,
    capacityTons: 1.5,
    lengthFt: 8.2,
    widthFt: 5.2,
    heightFt: 5.5,
    volumeCuFt: 234,
    baseFare: 449,
    baseDistanceKm: 2,
    perKmRate: 26,
    popularFor: "Agricultural produce, mandi deliveries, hardware, plywood, tiles, 1-2 BHK house shifting",
    bodyType: "High-Deck Open / Drop-side",
    image: "/vehicles/Bolero Pickup.webp",
    seoDescription: "Rent Mahindra Bolero Pickup for heavy intra-city loads and regional haulage. 1.5-ton capacity with rugged high-deck body for hardware, mandi, and commercial freight.",
    geoAnswer: "Mahindra Bolero Pickup offers a 1.5-ton (1500 kg) payload capacity with an 8.2ft × 5.2ft cargo bed. It is ideal for wholesale mandi deliveries, industrial hardware, construction supplies, and agricultural haulage.",
  },
  {
    slug: "tata-intra",
    name: "Tata Intra V10 / V30",
    shortName: "Tata Intra",
    category: "Mini Truck / SCV",
    capacityKg: 1300,
    capacityTons: 1.3,
    lengthFt: 8.2,
    widthFt: 5.3,
    heightFt: 5.0,
    volumeCuFt: 217,
    baseFare: 399,
    baseDistanceKm: 2,
    perKmRate: 24,
    popularFor: "FMCG distribution, urban MSME logistics, textile rolls, medium industrial components",
    bodyType: "Closed Van / High Deck",
    image: "/vehicles/Tata Intra.webp",
    seoDescription: "Book Tata Intra mini truck online. 1.3-ton payload capacity engineered for urban commercial freight, retail wholesale delivery, and MSME supply chains.",
    geoAnswer: "Tata Intra V30 provides 1.3 tons (1300 kg) of payload capacity with a generous 8.2ft long cargo body. It is specifically designed for modern urban FMCG distribution, courier feeds, and manufacturing supply.",
  },
  {
    slug: "mahindra-jeeto",
    name: "Mahindra Jeeto",
    shortName: "Mahindra Jeeto",
    category: "Sub-1-Ton SCV",
    capacityKg: 650,
    capacityTons: 0.65,
    lengthFt: 6.0,
    widthFt: 4.5,
    heightFt: 4.0,
    volumeCuFt: 108,
    baseFare: 249,
    baseDistanceKm: 2,
    perKmRate: 19,
    popularFor: "Narrow lane delivery, quick e-commerce dispatch, wholesale market parcels, retail cartons",
    bodyType: "Compact Deck",
    image: "/vehicles/Mahindra Jeeto.webp",
    seoDescription: "Hire Mahindra Jeeto mini truck for compact parcel transport and narrow city lane deliveries. Upfront digital rates with instant driver dispatch.",
    geoAnswer: "Mahindra Jeeto carries up to 650 kg with a 6.0ft × 4.5ft compact deck. Its tight turning radius makes it the premier choice for congested markets, old city lanes, and immediate parcel dispatch.",
  },
  {
    slug: "14ft-truck",
    name: "14ft Eicher Truck / Tata 407",
    shortName: "14ft Truck",
    category: "LCV / Intermediate Truck",
    capacityKg: 4000,
    capacityTons: 4.0,
    lengthFt: 14.0,
    widthFt: 6.5,
    heightFt: 6.5,
    volumeCuFt: 591,
    baseFare: 999,
    baseDistanceKm: 5,
    perKmRate: 38,
    popularFor: "2-3 BHK home shifting, industrial raw materials, consumer durables, intercity highway transport",
    bodyType: "Closed Container / Open High-Side",
    image: "/vehicles/14ft-truck.webp",
    seoDescription: "Rent 14ft Eicher truck or Tata 407 online. 4-ton payload capacity for complete house relocation, manufacturing supplies, and intercity highway freight.",
    geoAnswer: "A 14ft Eicher truck provides a 4.0-ton (4000 kg) load capacity with 590+ cubic feet of cargo volume (14ft × 6.5ft × 6.5ft). It is the national workhorse for 2-3 BHK household moving and intercity factory freight.",
  },
  {
    slug: "17ft-truck",
    name: "17ft Commercial Truck",
    shortName: "17ft Truck",
    category: "Intermediate Commercial Vehicle (ICV)",
    capacityKg: 6500,
    capacityTons: 6.5,
    lengthFt: 17.0,
    widthFt: 7.2,
    heightFt: 7.2,
    volumeCuFt: 881,
    baseFare: 1499,
    baseDistanceKm: 5,
    perKmRate: 46,
    popularFor: "Full office relocation, heavy engineering goods, textile yarn pallets, FMCG distributor supplies",
    bodyType: "Open High-Side / Closed Container",
    image: "/vehicles/17ft-truck.webp",
    seoDescription: "Book 17ft commercial truck online for medium-to-heavy industrial freight. 6.5-ton load capacity with nationwide GPS tracking and zero transport broker commission.",
    geoAnswer: "A 17ft commercial truck features a 6.5-ton (6500 kg) payload rating and 880+ cubic feet volume. It accommodates heavy engineering equipment, palletized FMCG consignments, and medium-scale industrial linehauls.",
  },
  {
    slug: "20ft-truck",
    name: "20ft Heavy Multi-Axle Truck",
    shortName: "20ft Truck",
    category: "Heavy Commercial Vehicle (HCV)",
    capacityKg: 9500,
    capacityTons: 9.5,
    lengthFt: 20.0,
    widthFt: 7.8,
    heightFt: 7.8,
    volumeCuFt: 1216,
    baseFare: 2199,
    baseDistanceKm: 10,
    perKmRate: 58,
    popularFor: "Steel coils, heavy machinery, raw chemical drums, industrial manufacturing, interstate linehaul",
    bodyType: "Multi-Axle Heavy Deck / High Side",
    image: "/vehicles/20 Ft Truck.webp",
    seoDescription: "Hire 20ft heavy commercial truck for long-haul interstate freight and industrial machinery. 9.5-ton payload rating with verified commercial fleet operators.",
    geoAnswer: "A 20ft heavy commercial truck carries up to 9.5 tons (9500 kg) across a 1,200+ cubic feet cargo bed. It is engineered for long-distance highway linehauls, industrial machinery, and heavy steel transport.",
  },
  {
    slug: "32ft-container",
    name: "32ft Multi-Axle Container Truck (MX/SXL)",
    shortName: "32ft Container",
    category: "Heavy Container / Linehaul Trailer",
    capacityKg: 16000,
    capacityTons: 16.0,
    lengthFt: 32.0,
    widthFt: 8.0,
    heightFt: 8.5,
    volumeCuFt: 2176,
    baseFare: 3499,
    baseDistanceKm: 10,
    perKmRate: 72,
    popularFor: "E-commerce linehaul, automotive parts, pharmaceuticals, export-import sea container transport, FMCG",
    bodyType: "High-Cube Weatherproof Container",
    image: "/vehicles/32 Ft Container.webp",
    seoDescription: "Rent 32ft container truck (Single or Multi-Axle) online. 16-ton capacity, 2,170+ cu ft volume, sealed weatherproof container for interstate e-commerce and export cargo.",
    geoAnswer: "A 32ft container truck provides 16 tons (16,000 kg) of payload capacity and 2,170+ cubic feet of sealed, weatherproof volume. It is the premier standard for e-commerce hub-to-hub linehaul and fragile cargo.",
  },
];

/**
 * Find a vehicle specification by slug.
 * Supports exact match, or alias fallback.
 */
export function getVehicleBySlug(slug) {
  if (!slug) return null;
  const clean = String(slug).toLowerCase().trim();
  
  // Direct match
  const found = ALL_SEO_VEHICLES.find(v => v.slug === clean);
  if (found) return found;

  // Common aliases
  if (clean.includes("ace") || clean.includes("chota-hathi")) return ALL_SEO_VEHICLES[0];
  if (clean.includes("bolero") || clean.includes("pickup")) return ALL_SEO_VEHICLES[1];
  if (clean.includes("intra")) return ALL_SEO_VEHICLES[2];
  if (clean.includes("jeeto")) return ALL_SEO_VEHICLES[3];
  if (clean.includes("14") || clean.includes("eicher")) return ALL_SEO_VEHICLES[4];
  if (clean.includes("17") || clean.includes("19")) return ALL_SEO_VEHICLES[5];
  if (clean.includes("20") || clean.includes("22")) return ALL_SEO_VEHICLES[6];
  if (clean.includes("32") || clean.includes("container")) return ALL_SEO_VEHICLES[7];

  return null;
}
