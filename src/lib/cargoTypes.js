/**
 * src/lib/cargoTypes.js
 * 
 * Centralized Cargo & Specialized Transport Category Registry for GoMyTruck PSEO/GEO/AEO.
 * Defines handling guidelines, protective requirements, recommended vehicle classes,
 * and commercial use cases.
 */

export const ALL_CARGO_TYPES = [
  {
    slug: "agricultural-produce",
    name: "Agricultural Produce & Mandi Transport",
    shortName: "Mandi Produce",
    description: "Transport of fresh farm produce, grains, seasonal fruits, onions, potatoes, and vegetables to APMC mandis and wholesale hubs.",
    recommendedVehicles: ["bolero-pickup", "tata-intra", "14ft-truck"],
    handlingNotes: "Ventilated tarpaulin coverage required. Rapid morning dispatch to hit mandi auction opening hours.",
    hsnCode: "0701 / 0702 / 1006",
    gstRate: "0% (Exempt Agricultural)",
    popularMandiKeywords: ["mandi truck transport", "APMC vegetable delivery truck", "potato onion truck booking"],
  },
  {
    slug: "industrial-machinery",
    name: "Industrial Machinery & Heavy Equipment",
    shortName: "Machinery Freight",
    description: "Heavy machinery, CNC equipment, industrial pumps, gearboxes, fabrication units, and manufacturing plant tools.",
    recommendedVehicles: ["14ft-truck", "17ft-truck", "20ft-truck", "32ft-container"],
    handlingNotes: "Heavy strap lashing, wooden skids, and hydraulic crane or forklift loading support required.",
    hsnCode: "8479 / 8413 / 8483",
    gstRate: "18%",
    popularMandiKeywords: ["industrial machinery transport", "heavy equipment truck rental", "factory machine shifting"],
  },
  {
    slug: "fmcg-goods",
    name: "FMCG, Food & Retail Wholesale",
    shortName: "FMCG Freight",
    description: "Packaged consumer goods, edible oils, dry rations, beverages, snacks, soaps, and supermarket wholesale consignments.",
    recommendedVehicles: ["tata-intra", "14ft-truck", "17ft-truck", "32ft-container"],
    handlingNotes: "Weatherproof container bodies required to protect corrugated cartons from moisture and rain.",
    hsnCode: "1905 / 2106 / 3401",
    gstRate: "5% - 18%",
    popularMandiKeywords: ["FMCG goods transport", "wholesale distribution truck", "distributor warehouse logistics"],
  },
  {
    slug: "textile-garments",
    name: "Textile, Fabric Rolls & Wholesale Garments",
    shortName: "Textile Freight",
    description: "Cotton bales, woven fabric rolls, yarn cones, apparel cartons, denim, and finished garments for wholesale textile markets.",
    recommendedVehicles: ["tata-ace", "14ft-truck", "20ft-truck", "32ft-container"],
    handlingNotes: "Completely dry, dust-free containers to prevent water staining or fabric discoloration during transit.",
    hsnCode: "5208 / 6109 / 6204",
    gstRate: "5% - 12%",
    popularMandiKeywords: ["textile transport truck", "cloth roll delivery mini truck", "garment wholesale transport"],
  },
  {
    slug: "construction-materials",
    name: "Building Materials, Hardware & Tiles",
    shortName: "Construction Freight",
    description: "Cement bags, ceramic wall & floor tiles, PVC pipes, sanitaryware, steel reinforcement bars, and hardware items.",
    recommendedVehicles: ["bolero-pickup", "14ft-truck", "20ft-truck"],
    handlingNotes: "Dense heavy load requiring reinforced vehicle suspension and edge corner cushioning for ceramic tiles.",
    hsnCode: "2523 / 6907 / 3917",
    gstRate: "18% - 28%",
    popularMandiKeywords: ["building material transport", "tiles transport truck", "cement delivery pickup"],
  },
  {
    slug: "house-shifting",
    name: "Household Shifting & Furniture Relocation",
    shortName: "Home Shifting",
    description: "Complete 1 BHK, 2 BHK, 3 BHK household relocation, wooden furniture, beds, sofas, refrigerators, and personal baggage.",
    recommendedVehicles: ["tata-ace", "bolero-pickup", "14ft-truck"],
    handlingNotes: "Multi-layer bubble wrap, cardboard corner protectors, and experienced loading labor required.",
    hsnCode: "9965 (GTA Relocation)",
    gstRate: "18% (Packers & Movers) / 5% (Transport only)",
    popularMandiKeywords: ["house shifting truck", "furniture moving mini truck", "home relocation transport"],
  },
  {
    slug: "ecommerce-linehaul",
    name: "E-Commerce Linehaul & Express Courier",
    shortName: "E-Commerce Linehaul",
    description: "Hub-to-hub express parcel delivery, automated sortation linehauls, corrugated master cartons, and high-cube parcel movement.",
    recommendedVehicles: ["14ft-truck", "17ft-truck", "32ft-container"],
    handlingNotes: "Sealed container locking with digital OTP verification and strict time-bound transit SLAs.",
    hsnCode: "9968 (Express Freight)",
    gstRate: "18%",
    popularMandiKeywords: ["ecommerce linehaul truck", "hub to hub container truck", "courier feeder transport"],
  },
];

/**
 * Retrieve cargo type specifications by slug.
 */
export function getCargoTypeBySlug(slug) {
  if (!slug) return null;
  const clean = String(slug).toLowerCase().trim();
  const found = ALL_CARGO_TYPES.find(c => c.slug === clean);
  if (found) return found;

  // Keyword alias match
  if (clean.includes("mandi") || clean.includes("agri") || clean.includes("vegetable")) return ALL_CARGO_TYPES[0];
  if (clean.includes("machine") || clean.includes("industrial") || clean.includes("steel")) return ALL_CARGO_TYPES[1];
  if (clean.includes("fmcg") || clean.includes("food") || clean.includes("grocery")) return ALL_CARGO_TYPES[2];
  if (clean.includes("textile") || clean.includes("cloth") || clean.includes("garment")) return ALL_CARGO_TYPES[3];
  if (clean.includes("construction") || clean.includes("tile") || clean.includes("cement")) return ALL_CARGO_TYPES[4];
  if (clean.includes("house") || clean.includes("shifting") || clean.includes("furniture")) return ALL_CARGO_TYPES[5];
  if (clean.includes("ecommerce") || clean.includes("parcel") || clean.includes("courier")) return ALL_CARGO_TYPES[6];

  return null;
}
