/**
 * src/lib/locationFaqHelper.js
 * 
 * Centralized Dynamic FAQ & Schema Generator for GoMyTruck Location, PSEO, Route, and State Pages.
 * Ensures 100% unique, hyper-localized FAQs and FAQPage JSON-LD schemas for every city, corridor, and state.
 */

// Key industrial areas and logistics hubs mapped by city for hyper-local answers
const CITY_AREAS_MAP = {
  // West Bengal
  kolkata: ["Burrabazar", "Park Street", "Dum Dum", "Behala", "Garia", "Taratala", "New Town", "Salt Lake"],
  howrah: ["Howrah Maidan", "Shibpur", "Liluah", "Santragachi", "Bally", "Dhulagarh Industrial Park", "Jalan Complex"],
  dankuni: ["Dankuni Freight Complex", "Delhi Highway Junction", "Hooghly Industrial Corridor", "Chanditala"],
  barrackpore: ["Titagarh", "Khardah", "Sodepur", "Naihati", "Shyamnagar", "Barrackpore Industrial Estate"],
  dhulagarh: ["Dhulagarh Truck Terminal", "Jalan Complex", "National Highway 16", "Sankrail Industrial Park"],
  sankrail: ["Sankrail Industrial Park", "Polymer Park", "Food Park", "NH-16 Logistics Hub"],
  uluberia: ["Uluberia Industrial Estate", "Birshibpur", "Garchumuk Corridor", "NH-16"],
  durgapur: ["City Centre", "Muchipara", "Durgapur Steel Plant Zone", "Bidhannagar", "Grand Trunk Road"],
  asansol: ["Kulti", "Raniganj Coal Belt", "Burnpur", "Neamatpur", "GT Road Corridor"],
  siliguri: ["Matigara", "Pradhan Nagar", "Fulbari Truck Terminus", "Sevoke Road", "Eastern Bypass"],
  haldia: ["Haldia Port", "IOCL Refinery Zone", "Durgachak", "Basudevpur", "Industrial Belt"],
  kharagpur: ["Vidyasagar Industrial Park", "Nimpura", "Golebazar", "IIT Corridor", "NH-49"],
  malda: ["English Bazar", "Old Malda Industrial Area", "Mahananda Bridge Corridor", "NH-12"],
  kalyani: ["Kalyani Industrial Estate", "Phase 1 & 2", "Buddha Park", "NH-12 Bypass"],
  burrabazar: ["Posta Mandi", "Mehta Building", "Cotton Street", "Canning Street", "Strand Road"],

  // Delhi NCR
  "new-delhi": ["Okhla Industrial Area", "Mayapuri", "Kirti Nagar", "Narela", "Patparganj", "Bawana"],
  gurugram: ["Udyog Vihar", "Manesar Industrial Belt", "Pace City", "Sohna Road", "Cyber City"],
  manesar: ["IMT Manesar Sector 1-8", "Automotive Hub", "Pataudi Road", "NH-48"],
  faridabad: ["Sector 24-25 Industrial Area", "Mathura Road", "Ballabhgarh", "NIT Faridabad"],
  ghaziabad: ["Sahibabad Industrial Area", "Loni Road", "Bulandshahr Road", "Kavi Nagar"],
  noida: ["Sector 57-68 Industrial Belt", "Phase 2", "Noida Expressway", "Sector 83 Hosiery Complex"],
  "greater-noida": ["Surajpur Industrial Area", "Ecotech 1-12", "Kasna", "Knowledge Park"],

  // Maharashtra
  mumbai: ["Andheri MIDC", "Kanjurmarg", "Dadar", "Kurla West", "Bandra Kurla Complex", "APMC Vashi"],
  "navi-mumbai": ["TTC Industrial Area", "Mahape MIDC", "Turbhe", "Rabale", "APMC Market Vashi", "Taloja"],
  bhiwandi: ["Mankoli", "Rahnal Warehousing Complex", "Dapoda", "Purna", "Anjur Phata", "NH-160"],
  thane: ["Wagle Estate", "Ghodbunder Road", "Kolshet", "Manpada", "Balkum"],
  pune: ["Chakan MIDC", "Bhosari", "Hinjawadi Tech Park", "Hadapsar Industrial Estate", "Talawade", "Pimpri"],
  chakan: ["Chakan Industrial Area Phase 1-4", "Talegaon MIDC", "Auto Cluster", "Shikrapur Road"],
  nagpur: ["MIHAN SEZ", "Hingna MIDC", "Kalmeshwar", "Wadi", "Kamptee Road"],

  // Gujarat
  ahmedabad: ["Changodar", "Sanand Industrial Estate", "Naroda GIDC", "Vatva GIDC", "Odhav", "Sarkhej"],
  sanand: ["Sanand GIDC Phase 1 & 2", "Automotive Hub", "Bol GIDC", "Viramgam Highway"],
  surat: ["Sachin GIDC", "Pandesara GIDC", "Katargam", "Hazira Industrial Area", "Udhna"],
  vadodara: ["Makarpura GIDC", "Manjusar GIDC", "Savli Industrial Estate", "Nandesari"],
  rajkot: ["Aji GIDC", "Shapar-Veraval", "Metoda GIDC", "Bhakti Nagar"],

  // Karnataka
  bengaluru: ["Peenya Industrial Area", "Bommasandra", "Electronic City", "Whitefield", "Hoodi", "Yeshwanthpur"],
  peenya: ["Peenya Phase 1-4", "Jalahalli", "Tumkur Road Corridor", "Goraguntepalya"],

  // Tamil Nadu
  chennai: ["Ambattur Industrial Estate", "Guindy", "Sriperumbudur", "Oragadam", "Ennore Port Corridor"],
  coimbatore: ["SIDCO Industrial Estate", "Ganapathy", "Peelamedu", "Kurichi", "Saravanampatti"],
  hosur: ["Sipcot Phase 1 & 2", "Mookandapalli", "Zuzuvadi", "NH-44 Corridor"],

  // Telangana & Andhra Pradesh
  hyderabad: ["Sanath Nagar", "Balanagar", "Jeedimetla Industrial Area", "Kattedan", "Medchal", "Cherlapally"],
  medchal: ["Medchal Industrial Area", "Gundlapochampally", "Kandlakoya", "NH-44"],
  visakhapatnam: ["Autonagar", "Gajuwaka", "Visakhapatnam Port", "Duvvada SEZ", "Madhurawada"],
  vijayawada: ["Autonagar Industrial Area", "Enikepadu", "Gannavaram", "Bhavanipuram"],

  // Rajasthan
  jaipur: ["Sitapura Industrial Area", "Vishwakarma Industrial Area (VKI)", "Mansarovar", "Bagru RIICO", "Jhotwara"],

  // Madhya Pradesh
  indore: ["Pithampur Auto Cluster", "Sanwer Road Industrial Area", "Dewas Naka", "Laxmibai Nagar Mandi"],
  bhopal: ["Mandideep Industrial Area", "Govindpura", "Bairagarh", "Hoshangabad Road"],

  // Uttar Pradesh
  lucknow: ["Transport Nagar", "Amausi Industrial Area", "Talkatora", "Chinhat", "Sarojini Nagar"],
  kanpur: ["Panki Industrial Area", "Fazalganj", "Jajmau Leather Complex", "Rania", "Dada Nagar"],
  agra: ["Sikandra Industrial Area", "Foundry Nagar", "Nunhai", "Trans Yamuna"],

  // Punjab
  ludhiana: ["Focal Point Phase 1-8", "Dhandari Kalan", "Industrial Area A & B", "Gill Road"],

  // Bihar & Jharkhand
  patna: ["Patliputra Industrial Area", "Didarganj", "Fatuha Industrial Area", "Anisabad", "Boring Road"],
  ranchi: ["Tupudana Industrial Area", "Kokar", "Namkum", "Hatia"],
  dhanbad: ["Jharia Coal Belt", "Govindpur Industrial Area", "Katras", "Barwadda"],
  jamshedpur: ["Adityapur Industrial Area", "Gamharia", "Bistupur", "Telco Colony"],

  // Odisha, Chhattisgarh, Kerala, Assam
  bhubaneswar: ["Mancheswar Industrial Estate", "Chandaka SEZ", "Rasulgarh", "Patia", "Jatni"],
  cuttack: ["Jagatpur Industrial Estate", "Choudwar", "Madhupatna", "Badambadi"],
  paradeep: ["Paradeep Port Trust Area", "IOCL Complex", "Bhitargarh", "Nuagarh"],
  raipur: ["Urla Industrial Area", "Siltara Industrial Belt", "Bhanpuri", "Tatibandh"],
  guwahati: ["Paltan Bazar", "Beltola", "Amingaon Inland Container Depot", "Boragaon", "ISBT Hub"],
  kochi: ["Willingdon Island Port", "Kalamassery", "Eloor Industrial Belt", "Kaloor", "Aluva"],
};

/**
 * Generate 5 dynamic, hyper-local FAQs for any City & Service combination
 */
export function generateCityFaqs(cityConfig, serviceType = "hub", customAreas = []) {
  const cityName = cityConfig.name || "Kolkata";
  const stateName = cityConfig.state || "West Bengal";
  const citySlug = cityConfig.slug || cityName.toLowerCase().replace(/[\s_]+/g, "-");

  const areasList = customAreas.length > 0
    ? customAreas
    : (CITY_AREAS_MAP[citySlug] || [`Central ${cityName}`, `North ${cityName}`, `South ${cityName}`, `Industrial Belt ${cityName}`]);

  const areasString = areasList.slice(0, 5).join(", ");

  let serviceFocus = "truck booking and goods transport";
  let fleetOptions = "Tata Ace (Chota Hathi), Bolero Pickup, 14ft Eicher, 17ft/20ft trucks, and 32ft multi-axle containers";

  if (serviceType === "pickup-rent") {
    serviceFocus = "pickup truck and mini truck rental";
    fleetOptions = "Tata Ace (750 kg capacity), Mahindra Bolero Pickup (1.2 to 1.7 Ton), and 8ft / 9ft closed body LCVs";
  } else if (serviceType === "moving-truck") {
    serviceFocus = "house shifting, office relocation, and moving truck hire";
    fleetOptions = "Tata Ace for 1 BHK moves, 14ft closed container trucks for 2-3 BHK shifting, and dedicated packers & movers crews";
  } else if (serviceType === "truck-booking") {
    serviceFocus = "online truck booking and commercial freight";
    fleetOptions = "Tata Ace, 8ft Pickup, 14ft, 17ft, 20ft, and 32ft FTL/PTL commercial trucks";
  }

  const faqs = [
    {
      question: `How do I book a truck online in ${cityName}?`,
      answer: `To book a truck in ${cityName}, enter your exact pickup and drop addresses on the GoMyTruck web portal or mobile app. Select your preferred vehicle (${fleetOptions}), declare your cargo details, and review the live upfront estimate. Once submitted, GoMyTruck instantly matches your request with verified drivers and fleet partners across ${cityName} with zero broker involvement.`
    },
    {
      question: `What are the truck rental and goods transport charges in ${cityName}?`,
      answer: `Truck freight charges in ${cityName} are calculated transparently based on the mapped route distance, estimated travel time, selected vehicle type, and current fuel rates. GoMyTruck operates on a flat 5% platform commission model—unlike traditional brokers who add 15% to 25% hidden markups. You receive an itemized fare breakdown before confirming.`
    },
    {
      question: `Which commercial areas and industrial zones in ${cityName} does GoMyTruck serve?`,
      answer: `GoMyTruck provides comprehensive coverage across ${cityName} and neighboring districts, including key business hubs such as ${areasString}, and all major regional state highway corridors. Same-day pickup and scheduled dispatches are available across all commercial and residential clusters.`
    },
    {
      question: `Are commercial mini trucks like Tata Ace allowed inside ${cityName} during daytime hours?`,
      answer: `Yes. Light commercial vehicles (LCVs) like Tata Ace and 8ft/9ft pickups typically enjoy flexible city access in ${cityName}, allowing smooth daytime residential deliveries and retail distribution. For heavy 14ft+ multi-axle trucks, GoMyTruck coordinates dispatch according to ${cityName}'s municipal traffic guidelines and no-entry windows.`
    },
    {
      question: `Can I book intercity and outstation goods transport from ${cityName}?`,
      answer: `Yes. In addition to local intra-city transport in ${cityName}, GoMyTruck provides dedicated Full Truck Load (FTL) and Part Load (PTL) intercity logistics connecting ${cityName} directly to major industrial corridors across ${stateName} and national highways. Real-time GPS tracking and digital proof of delivery (POD) are included for all outstation trips.`
    }
  ];

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return { faqs, jsonLdSchema };
}

/**
 * Generate dynamic FAQs for Intercity Corridor Routes (e.g. Kolkata to Guwahati, Kolkata to Delhi)
 */
export function generateRouteFaqs(fromCity, toCity, distanceKm, transitHours, nhRoute = "National Highway") {
  const faqs = [
    {
      question: `What is the transit time and distance for goods transport from ${fromCity} to ${toCity}?`,
      answer: `The road freight distance from ${fromCity} to ${toCity} is approximately ${distanceKm} via ${nhRoute}. Typical transit time ranges between ${transitHours} depending on the vehicle class, checkpoint clearances, and route conditions.`
    },
    {
      question: `How are freight rates calculated for the ${fromCity} to ${toCity} transport route?`,
      answer: `Freight rates on the ${fromCity}–${toCity} corridor depend on the declared cargo weight, volume, vehicle type (e.g., 14ft, 20ft, 32ft container), and fuel surcharge. GoMyTruck provides transparent pricing at a flat 5% platform commission, eliminating traditional broker markups.`
    },
    {
      question: `Can I find return loads (backhaul) from ${toCity} back to ${fromCity}?`,
      answer: `Yes. GoMyTruck operates an active return load marketplace on the ${fromCity}–${toCity} freight lane. Fleet owners and drivers can bid on return shipments from ${toCity}, minimizing empty miles and optimizing freight costs for both shippers and transporters.`
    },
    {
      question: `What documentation is required for shipping goods from ${fromCity} to ${toCity}?`,
      answer: `Consignments moving along the ${fromCity} to ${toCity} corridor require a valid GST invoice, an active E-Way Bill (for consignments exceeding statutory thresholds), and accurate goods declaration with weight and package count.`
    }
  ];

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return { faqs, jsonLdSchema };
}

/**
 * Generate dynamic FAQs for State Hubs (e.g. West Bengal, Odisha, Bihar, Assam)
 */
export function generateStateFaqs(stateName, totalHubsCount = 10, keyHubs = []) {
  const hubsStr = keyHubs.length > 0 ? keyHubs.join(", ") : "major industrial and commercial districts";

  const faqs = [
    {
      question: `How does GoMyTruck operate goods transport across ${stateName}?`,
      answer: `GoMyTruck provides a digital logistics marketplace connecting manufacturers, traders, and individual shippers across ${stateName} with verified truck drivers and fleet owners. Shippers can book mini trucks, FTL freight, and container trucks across ${totalHubsCount}+ operational hubs in ${stateName}.`
    },
    {
      question: `What are the key logistics hubs and industrial corridors in ${stateName}?`,
      answer: `In ${stateName}, GoMyTruck provides dedicated coverage across key industrial zones and transport corridors, including ${hubsStr}, connecting factory premises, container depots, and regional mandis.`
    },
    {
      question: `Why choose GoMyTruck over traditional transport brokers in ${stateName}?`,
      answer: `Traditional transport brokers in ${stateName} typically charge 10% to 25% unitemized brokerage margins with opaque pricing. GoMyTruck operates at a flat 5% transparent commission, verified driver documentation, live GPS tracking, and automated GST billing.`
    }
  ];

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return { faqs, jsonLdSchema };
}
