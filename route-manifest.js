import { SEO_CITIES } from './src/lib/cities.js';

export const INDEXABLE_ROUTES = [
  "/",
  "/truck",
  "/driver-onboarding",
  "/bike",
  "/packers-and-movers",
  "/enterprise",
  "/about",
  "/support",
  "/driver-partner",
  "/contact",
  // "/pricing",
  "/blog",
  "/book-truck-online",
  "/mini-truck-booking",
  "/goods-transport-services",
  "/fleet-partner-registration",
  "/gomytruck-verified",
  "/direct-driver-contact",
  "/kolkata",
  "/barrackpore",
  "/howrah",
  "/salt-lake",
  "/new-town",
  "/kolkata/truck-booking",
  "/barrackpore/truck-booking",
  "/kolkata/mini-truck-booking",
  "/kolkata/pickup-truck-booking",
  "/kolkata/goods-transport",
  "/kolkata/tata-ace-booking",
  "/kolkata/14-feet-truck-rental",
  "/kolkata/packers-and-movers",
  "/barrackpore/goods-transport",
  "/barrackpore/loading-unloading-labour",
  "/howrah/goods-transport",
  "/salt-lake/goods-transport",
  "/new-town/goods-transport",
  "/services/transport-for-msmes",
  "/services/commercial-goods-transport",
  "/intercity/kolkata",
  "/local-transport/kolkata",
  "/routes/kolkata-to-asansol",
  "/legal/privacy-policy",
  "/legal/terms",
  "/legal/partner-terms",
  "/legal/refund-cancellation",
  "/legal/community-guidelines",

  // --- PHASE 1 ROUTES ---
  "/dankuni", "/uluberia", "/sankrail", "/durgapur", "/asansol", "/kharagpur", "/haldia", "/siliguri", "/burrabazar",
  "/routes/kolkata-to-guwahati", "/routes/kolkata-to-patna", "/routes/kolkata-to-bhubaneswar", "/routes/kolkata-to-siliguri", "/routes/kolkata-to-cuttack", "/routes/kolkata-to-ranchi", "/routes/kolkata-to-dhanbad", "/routes/kolkata-to-haldia", "/routes/kolkata-to-durgapur",
  "/kolkata/32ft-container-truck", "/kolkata/bolero-pickup-rent", "/kolkata/14-feet-eicher-truck",
  "/industries/steel-logistics/durgapur", "/industries/jute-logistics/barrackpore", "/industries/fmcg-logistics/west-bengal", "/industries/pharma-logistics/kolkata", "/industries/agri-logistics/east-india",

  // --- PHASE 2 ROUTES ---
  "/cuttack", "/bhubaneswar", "/guwahati", "/patna", "/ranchi", "/dhanbad", "/bardhaman", "/dumdum-barasat", "/paradeep", "/krishnanagar",
  "/routes/kolkata-to-delhi", "/routes/kolkata-to-mumbai", "/routes/kolkata-to-hyderabad", "/routes/kolkata-to-bangalore", "/routes/kolkata-to-chennai", "/routes/kolkata-to-paradeep", "/routes/guwahati-to-kolkata", "/routes/cuttack-to-kolkata",
  "/west-bengal", "/odisha", "/bihar", "/assam-northeast",
  "/resources/gst-for-goods-transport-agency", "/resources/e-way-bill-guide", "/resources/gst-rcm-transporters", "/resources/ftl-vs-ptl", "/resources/motor-vehicle-aggregator-guidelines-2025",
  "/industries/coal-logistics/dhanbad", "/industries/tea-logistics/siliguri", "/industries/textile-logistics/kolkata", "/industries/ecommerce-logistics/kolkata", "/industries/construction-logistics/west-bengal",

  // --- PHASE 3 ROUTES ---
  "/freight-rate-index",
  "/blog/kolkata-northeast-freight-market-report",
  "/resources/hsn-codes-for-logistics",
  "/resources/section-9-5-vs-52-gta",
  "/directory"
]

// Dynamically generate PSEO routes
SEO_CITIES.forEach(city => {
  const slug = city.slug;
  if (!INDEXABLE_ROUTES.includes(`/${slug}`)) {
    INDEXABLE_ROUTES.push(`/${slug}`);
  }
  INDEXABLE_ROUTES.push(`/${slug}/truck-booking`);
  INDEXABLE_ROUTES.push(`/${slug}/pickup-truck-for-rent`);
  INDEXABLE_ROUTES.push(`/${slug}/moving-truck-hire`);
});
export const NOINDEX_ROUTES = ["/delete-account"]

export const PRERENDER_ROUTES = [...INDEXABLE_ROUTES, ...NOINDEX_ROUTES]

