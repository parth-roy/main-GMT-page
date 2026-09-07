import { SEO_CITIES } from './src/lib/cities.js';
import { ALL_SEO_VEHICLES } from './src/lib/vehicles.js';
import { POPULAR_CORRIDORS } from './src/lib/corridors.js';
import { ALL_CARGO_TYPES } from './src/lib/cargoTypes.js';

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

function addRoute(r) {
  if (!INDEXABLE_ROUTES.includes(r)) {
    INDEXABLE_ROUTES.push(r);
  }
}

// Dynamically generate baseline city routes
SEO_CITIES.forEach(city => {
  const slug = city.slug;
  addRoute(`/${slug}`);
  addRoute(`/${slug}/truck-booking`);
  addRoute(`/${slug}/pickup-truck-for-rent`);
  addRoute(`/${slug}/moving-truck-hire`);
});

// --- SCENARIO 2 HIGH-VELOCITY TWO-SIDED ACQUISITION MATRIX (5,000 URLs) ---

// Top commercial cities for intercity corridors
const topCommercialCities = [
  'delhi', 'mumbai', 'kolkata', 'bengaluru', 'chennai', 'hyderabad', 'ahmedabad', 'pune', 
  'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'patna', 'vadodara', 
  'bhopal', 'coimbatore', 'ludhiana', 'agra', 'nashik', 'varanasi', 'jamshedpur', 'asansol', 
  'durgapur', 'siliguri', 'cuttack', 'bhubaneswar', 'guwahati', 'ranchi', 'dhanbad', 'raipur'
];

const corridorSet = new Set(POPULAR_CORRIDORS.map(c => c.slug));
for (let i = 0; i < topCommercialCities.length; i++) {
  for (let j = 0; j < topCommercialCities.length; j++) {
    if (i !== j) {
      corridorSet.add(`${topCommercialCities[i]}-to-${topCommercialCities[j]}`);
    }
  }
}
const allCorridors = Array.from(corridorSet);

// 1. City x Vehicle Matrix: Top 125 Commercial Cities x 8 Core Vehicles = 1,000 URLs
const top125Cities = SEO_CITIES.slice(0, 125);
const core8Vehicles = ALL_SEO_VEHICLES.map(v => v.slug);
top125Cities.forEach(city => {
  core8Vehicles.forEach(vehicleSlug => {
    addRoute(`/${city.slug}/truck-booking/${vehicleSlug}`);
  });
});

// 2. Route x Vehicle Corridors: 280 Corridors x 5 Vehicles = 1,400 URLs
const corridor5Vehicles = ['tata-ace', 'bolero-pickup', '14ft-truck', '20ft-truck', '32ft-container'];
const corridors280 = allCorridors.slice(0, 280);
corridors280.forEach(cSlug => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/transport/${cSlug}/${vehicleSlug}`);
  });
});

// 3. Driver Supply Hubs: 100 Cities x 5 Vehicles = 500 URLs
const top100Cities = SEO_CITIES.slice(0, 100);
top100Cities.forEach(city => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/drivers/${city.slug}/${vehicleSlug}`);
  });
});

// 4. Route x Cargo: 80 Corridors x 5 Cargo Types = 400 URLs
const cargo5Types = ['mandi-agri-produce', 'industrial-machinery', 'fmcg-goods', 'textile-garments', 'construction-materials'];
const corridors80 = allCorridors.slice(0, 80);
corridors80.forEach(cSlug => {
  cargo5Types.forEach(cgSlug => {
    addRoute(`/transport/${cSlug}/${cgSlug}`);
  });
});

// 5. Industrial Hub x Vehicle: 70 Hubs x 5 Vehicles = 350 URLs
const industrialHubs = [
  'dankuni', 'bhiwandi', 'manesar', 'peenya', 'sricity', 'oragadam', 'sanand', 'chakan',
  'pimpri-chinchwad', 'hosur', 'rudrapur', 'pantnagar', 'baddi', 'haridwar', 'neemrana',
  'dharuhera', 'bawal', 'waluj', 'butibori', 'ankleshwar', 'dahej', 'halol', 'jhagadia',
  'hazira', 'morbi', 'vapi', 'silvassa', 'tarapur', 'taloja', 'turbhe', 'mahaveer-nagar',
  'durgapur', 'asansol', 'haldia', 'kharagpur', 'jamshedpur', 'kalinganagar', 'angul',
  'rourkela', 'bokaro', 'jharsuguda', 'paradeep', 'singrauli', 'korba', 'bhilai',
  'raigarh', 'visakhapatnam', 'autonagar', 'ranipet', 'ambattur', 'guindy', 'irungattukottai',
  'sipcot', 'bommasandra', 'bidadi', 'whitefield', 'jeedimetla', 'patancheru', 'balanagar',
  'kattedan', 'sanathnagar', 'cherlapally', 'nacharam', 'moulali', 'kukatpally', 'uppal',
  'ghatkesar', 'medchal', 'shamshabad', 'secunderabad'
];
industrialHubs.forEach(hub => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/industrial/${hub}/${vehicleSlug}`);
  });
});

// 6. Industrial Corridors: 250 Corridors = 250 URLs
const industrialCorridors = allCorridors.slice(0, 250);
industrialCorridors.forEach(cSlug => {
  addRoute(`/industrial/${cSlug}`);
});

// 7. Vehicle x Route x Cargo (Deep Tail): 50 Corridors x 5 Vehicle-Cargo Pairs = 250 URLs
const vehicleCargoPairs = [
  { v: '14ft-truck', c: 'industrial-machinery' },
  { v: '32ft-container', c: 'textile-garments' },
  { v: 'bolero-pickup', c: 'mandi-agri-produce' },
  { v: '20ft-truck', c: 'fmcg-goods' },
  { v: 'tata-ace', c: 'construction-materials' }
];
const corridors50 = allCorridors.slice(0, 50);
corridors50.forEach(cSlug => {
  vehicleCargoPairs.forEach(pair => {
    addRoute(`/transport/${cSlug}/${pair.v}/${pair.c}`);
  });
});

// 8. Locality x Vehicle: 40 Sub-metro Localities x 5 Vehicles = 200 URLs
const subLocalities = [
  'salt-lake', 'new-town', 'howrah', 'barrackpore', 'dankuni', 'andheri', 'bandra', 'borivali',
  'thane', 'kalyan', 'navi-mumbai', 'dwarka', 'rohini', 'noida', 'gurgaon', 'faridabad',
  'ghaziabad', 'koramangala', 'indiranagar', 'whitefield', 'jayanagar', 'hsr-layout', 'electronic-city',
  't-nagar', 'velachery', 'anna-nagar', 'tambaram', 'guindy', 'hitec-city', 'gachibowli',
  'madhapur', 'kukpally', 'banjara-hills', 'jubilee-hills', 'kothrud', 'hadapsar', 'wakad',
  'hinjewadi', 'vimannagar', 'bavdhan'
];
subLocalities.forEach(loc => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/local/${loc}/${vehicleSlug}`);
  });
});

// 9. City x Service Intents (goods-transport, ftl-transport): 201 URLs
let intentCount = 0;
for (const city of SEO_CITIES) {
  if (intentCount >= 201) break;
  const r1 = `/${city.slug}/goods-transport`;
  const r2 = `/${city.slug}/ftl-transport`;
  if (!INDEXABLE_ROUTES.includes(r1)) {
    addRoute(r1);
    intentCount++;
  }
  if (intentCount < 201 && !INDEXABLE_ROUTES.includes(r2)) {
    addRoute(r2);
    intentCount++;
  }
}

// 10. Return Loads & Backhaul Discounts: 100 Corridors = 100 URLs
const corridors100 = allCorridors.slice(0, 100);
corridors100.forEach(cSlug => {
  addRoute(`/return-loads/${cSlug}`);
});

// 11. City x Cargo Haulage: 50 Cities x 5 Cargo Types = 250 URLs
const top50Cities = SEO_CITIES.slice(0, 50);
top50Cities.forEach(city => {
  cargo5Types.forEach(cgSlug => {
    addRoute(`/cargo/${city.slug}/${cgSlug}`);
  });
});

// 12. Driver Load Alerts: 20 Cities x 5 Vehicles = 100 URLs
const top20Cities = SEO_CITIES.slice(50, 70);
top20Cities.forEach(city => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/loads/${city.slug}/${vehicleSlug}`);
  });
});

// --- SCENARIO 3: ROUTE × VEHICLE INTELLIGENCE MATRIX (~12,000 new URLs → ~19,158 total) ---

// Expand commercial city pool from 32 to 50 for richer corridor coverage
const scenario3CommercialCities = [
  'delhi', 'mumbai', 'kolkata', 'bengaluru', 'chennai', 'hyderabad', 'ahmedabad', 'pune',
  'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'patna', 'vadodara',
  'bhopal', 'coimbatore', 'ludhiana', 'agra', 'nashik', 'varanasi', 'jamshedpur', 'asansol',
  'durgapur', 'siliguri', 'cuttack', 'bhubaneswar', 'guwahati', 'ranchi', 'dhanbad', 'raipur',
  'vijayawada', 'rajkot', 'jodhpur', 'amritsar', 'aurangabad',
  'kochi', 'visakhapatnam', 'mangaluru', 'mysuru', 'thiruvananthapuram',
  'madurai', 'salem', 'jalandhar', 'faridabad', 'ghaziabad',
  'meerut', 'allahabad', 'bhilwara'
];

const s3CorridorSet = new Set(POPULAR_CORRIDORS.map(c => c.slug));
for (let i = 0; i < scenario3CommercialCities.length; i++) {
  for (let j = 0; j < scenario3CommercialCities.length; j++) {
    if (i !== j) {
      s3CorridorSet.add(`${scenario3CommercialCities[i]}-to-${scenario3CommercialCities[j]}`);
    }
  }
}
const allCorridorsS3 = Array.from(s3CorridorSet);
// allCorridorsS3 has 2,452 unique corridor slugs (50×49 + existing popular)

// S3-1: City × Vehicle for ALL remaining cities (126-516) × 8 vehicles = ~3,128 URLs
const core8VehiclesS3 = ALL_SEO_VEHICLES.map(v => v.slug);
SEO_CITIES.slice(125).forEach(city => {
  core8VehiclesS3.forEach(vehicleSlug => {
    addRoute(`/${city.slug}/truck-booking/${vehicleSlug}`);
  });
});

// S3-2: Route × Vehicle for corridors 281-560 × 5 vehicles = 1,400 URLs
allCorridorsS3.slice(280, 560).forEach(cSlug => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/transport/${cSlug}/${vehicleSlug}`);
  });
});

// S3-3: Driver Supply Hubs for cities 101-300 × 5 vehicles = 1,000 URLs
SEO_CITIES.slice(100, 300).forEach(city => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/drivers/${city.slug}/${vehicleSlug}`);
  });
});

// S3-4: Route × Cargo for corridors 81-280 × 5 cargo types = 1,000 URLs
allCorridorsS3.slice(80, 280).forEach(cSlug => {
  cargo5Types.forEach(cgSlug => {
    addRoute(`/transport/${cSlug}/${cgSlug}`);
  });
});

// S3-5: City × Cargo Haulage for cities 51-250 × 5 cargo types = 1,000 URLs
SEO_CITIES.slice(50, 250).forEach(city => {
  cargo5Types.forEach(cgSlug => {
    addRoute(`/cargo/${city.slug}/${cgSlug}`);
  });
});

// S3-6: Industrial Hub × Vehicle — 50 new port/SEZ industrial hubs × 5 vehicles = 250 URLs
const industrialHubsS3 = [
  'kandla', 'mundra', 'pipavav', 'nhava-sheva', 'ennore',
  'vizag-port', 'paradip-port', 'kolkata-port', 'kochi-port', 'tuticorin',
  'krishnapatnam', 'gangavaram', 'kamarajar', 'marmagao', 'willingdon-island',
  'rajkot-industrial', 'bharuch-industrial', 'vadodara-industrial', 'surat-industrial',
  'pune-industrial', 'nashik-industrial', 'aurangabad-industrial', 'kolhapur-industrial',
  'nagpur-industrial', 'amravati-industrial', 'jalgaon-industrial', 'solapur-industrial',
  'nizamabad-industrial', 'warangal-industrial', 'karimnagar-industrial',
  'tirupati-industrial', 'nellore-industrial', 'guntur-industrial', 'kakinada-industrial',
  'rajahmundry-industrial', 'coimbatore-industrial', 'tirupur-industrial', 'erode-industrial',
  'vellore-industrial', 'kancheepuram-industrial', 'pondicherry-industrial',
  'hubli-industrial', 'belgaum-industrial', 'tumkur-industrial', 'hassan-industrial',
  'mangaluru-industrial', 'udupi-industrial', 'shimoga-industrial', 'davangere-industrial',
  'bidar-industrial'
];
industrialHubsS3.forEach(hub => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/industrial/${hub}/${vehicleSlug}`);
  });
});

// S3-7: Industrial Corridors 251-500 = 250 URLs
allCorridorsS3.slice(250, 500).forEach(cSlug => {
  addRoute(`/industrial/${cSlug}`);
});

// S3-8: Local Sub-metro Localities × Vehicle — 60 new localities × 5 vehicles = 300 URLs
const subLocalitiesS3 = [
  'mulund', 'kurla', 'chembur', 'vikhroli', 'kanjurmarg', 'powai', 'malad',
  'goregaon', 'jogeshwari', 'vile-parle', 'santacruz', 'khar', 'sion', 'dadar',
  'worli', 'lower-parel', 'matunga', 'chintadripet', 'adyar', 'perungudi',
  'sholinganallur', 'pallikaranai', 'medavakkam', 'chrompet', 'perambur',
  'kolathur', 'madhavaram', 'avadi', 'poonamallee', 'ambattur-industrial',
  'thiruvottiyur', 'manali', 'uppal-industrial', 'nacharam-industrial',
  'hayathnagar', 'ibrahimpatnam', 'rajendranagar', 'kompally', 'suraram', 'dundigal',
  'isnapur', 'kandi', 'sangareddy', 'tumkur-road', 'mysuru-road',
  'kanakapura-road', 'hosur-road', 'anekal', 'sarjapur', 'bellandur',
  'marathahalli', 'hennur', 'thanisandra', 'yelahanka', 'hebbal',
  'nagarbhavi', 'basavangudi', 'rajajinagar', 'yeshwanthpur', 'peenya-industrial'
];
subLocalitiesS3.forEach(loc => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/local/${loc}/${vehicleSlug}`);
  });
});

// S3-9: Return Loads for corridors 101-300 = 200 URLs
allCorridorsS3.slice(100, 300).forEach(cSlug => {
  addRoute(`/return-loads/${cSlug}`);
});

// S3-10: Deep Tail Vehicle × Route × Cargo for corridors 51-200 × 5 pairs = 750 URLs
allCorridorsS3.slice(50, 200).forEach(cSlug => {
  vehicleCargoPairs.forEach(pair => {
    addRoute(`/transport/${cSlug}/${pair.v}/${pair.c}`);
  });
});

// S3-11: City tata-ace-booking for top 200 cities = ~199 new URLs
SEO_CITIES.slice(0, 200).forEach(city => {
  addRoute(`/${city.slug}/tata-ace-booking`);
});

// S3-12: City mini-truck-booking for top 200 cities = ~199 new URLs
SEO_CITIES.slice(0, 200).forEach(city => {
  addRoute(`/${city.slug}/mini-truck-booking`);
});

// S3-13: City 14-feet-truck-rental for top 150 cities = ~149 new URLs
SEO_CITIES.slice(0, 150).forEach(city => {
  addRoute(`/${city.slug}/14-feet-truck-rental`);
});

// S3-14: Driver Load Alerts cities 71-250 × 5 vehicles = 900 URLs
SEO_CITIES.slice(70, 250).forEach(city => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/loads/${city.slug}/${vehicleSlug}`);
  });
});

// S3-15: Route × Vehicle corridors 561-700 × 5 vehicles = 700 URLs
allCorridorsS3.slice(560, 700).forEach(cSlug => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/transport/${cSlug}/${vehicleSlug}`);
  });
});

// S3-16: City goods-transport + ftl-transport for cities 101-300 = up to 400 URLs
let s3IntentCount = 0;
for (const city of SEO_CITIES.slice(100, 300)) {
  if (s3IntentCount >= 400) break;
  const r1 = `/${city.slug}/goods-transport`;
  const r2 = `/${city.slug}/ftl-transport`;
  if (!INDEXABLE_ROUTES.includes(r1)) { addRoute(r1); s3IntentCount++; }
  if (s3IntentCount < 400 && !INDEXABLE_ROUTES.includes(r2)) { addRoute(r2); s3IntentCount++; }
}

// S3-17: Route × Vehicle corridors 701-850 × 5 vehicles = 750 URLs
allCorridorsS3.slice(700, 850).forEach(cSlug => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/transport/${cSlug}/${vehicleSlug}`);
  });
});

// S3-18: Industrial Corridors 500-700 = 200 URLs
allCorridorsS3.slice(500, 700).forEach(cSlug => {
  addRoute(`/industrial/${cSlug}`);
});

// S3-19: Route × Cargo for corridors 281-430 × 5 cargo types = 750 URLs
allCorridorsS3.slice(280, 430).forEach(cSlug => {
  cargo5Types.forEach(cgSlug => {
    addRoute(`/transport/${cSlug}/${cgSlug}`);
  });
});

// --- SCENARIO 4: PAN-INDIA SATURATION MATRIX (Census 793 Districts, ~6,075 new URLs → ~26,201 total) ---

// S4-1: Return Loads & Backhaul Expansion — corridors 301-800 = 500 new backhaul routes
allCorridorsS3.slice(300, 800).forEach(cSlug => {
  addRoute(`/return-loads/${cSlug}`);
});

// S4-2: High-Volume Route Corridors — corridors 851-1450 × 5 vehicles = 3,000 new URLs
allCorridorsS3.slice(850, 1450).forEach(cSlug => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/transport/${cSlug}/${vehicleSlug}`);
  });
});

// S4-3: Deep Tail Vehicle × Route × Cargo — corridors 201-350 × 5 pairs = 750 URLs
allCorridorsS3.slice(200, 350).forEach(cSlug => {
  vehicleCargoPairs.forEach(pair => {
    addRoute(`/transport/${cSlug}/${pair.v}/${pair.c}`);
  });
});

// S4-4: District Service Intents across remaining cities (201-516)
SEO_CITIES.slice(200).forEach(city => {
  addRoute(`/${city.slug}/tata-ace-booking`);
  addRoute(`/${city.slug}/mini-truck-booking`);
});
SEO_CITIES.slice(150).forEach(city => {
  addRoute(`/${city.slug}/14-feet-truck-rental`);
});
SEO_CITIES.slice(0, 300).forEach(city => {
  addRoute(`/${city.slug}/moving-truck-hire`);
  addRoute(`/${city.slug}/pickup-truck-for-rent`);
});

// S4-5: Mandi & Agricultural Cargo Corridors / Mandi Hubs × 5 vehicles = 250 URLs
const mandiHubsS4 = [
  'azadpur-mandi', 'vashi-apmc', 'lasalgaon-onion-market', 'guntur-chilli-yard', 
  'unnao-leather-cluster', 'khari-baoli', 'gadag-cotton-market', 'surat-textile-market', 
  'agra-shoe-cluster', 'morbi-ceramic-zone', 'sivakasi-printing-hub', 'tirupur-knitwear-cluster', 
  'bhadohi-carpet-belt', 'makrana-marble-belt', 'chanderi-textile', 'aligarh-lock-industry', 
  'firozabad-glass-industry', 'kannauj-perfume-hub', 'saharanpur-woodcraft', 'panipat-textile-hub', 
  'ludhiana-hosiery-hub', 'jalandhar-sports-goods', 'ambala-scientific-instruments', 'solapur-chaddar', 
  'ichalkaranji-textile', 'kolhapur-jaggery-market', 'nagpur-orange-market', 'nashik-grape-belt', 
  'ratnagiri-alphonso-belt', 'jalgaon-banana-market', 'shimla-apple-belt', 'kullu-fruit-belt', 
  'sopore-apple-mandi', 'anantnag-dry-fruits', 'jammu-rice-market', 'karnal-basmati-rice', 
  'taraori-rice-belt', 'bareilly-zari-furniture', 'moradabad-brass-city', 'khurja-pottery-hub', 
  'hapur-grain-market', 'chandausi-mentha-oil', 'sambhal-horn-craft', 'mathura-refinery-zone', 
  'hathras-hing-cluster', 'modinagar-industrial', 'muzaffarnagar-jaggery-mandi', 'rohtak-cloth-market', 
  'bhiwani-textile-mills', 'hisar-steel-pipe-zone'
];
mandiHubsS4.forEach(hub => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/industrial/${hub}/${vehicleSlug}`);
  });
});

// S4-6: Driver Supply Hubs for remaining cities (301-516) × 5 vehicles = 1,080 URLs
SEO_CITIES.slice(300).forEach(city => {
  corridor5Vehicles.forEach(vehicleSlug => {
    addRoute(`/drivers/${city.slug}/${vehicleSlug}`);
  });
});

export const NOINDEX_ROUTES = ["/delete-account"]

export const PRERENDER_ROUTES = [...INDEXABLE_ROUTES, ...NOINDEX_ROUTES]

