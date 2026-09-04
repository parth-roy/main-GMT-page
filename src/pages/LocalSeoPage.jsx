import React, { useEffect } from "react"
import { Link, Navigate } from "react-router-dom"
import { ArrowRight, CheckCircle2, MapPin, Phone, BadgePercent, MessageCircleQuestion } from "lucide-react"
import SEOHead from "../seo/SEOHead"
import { generateCityFaqs, generateRouteFaqs } from "../lib/locationFaqHelper"
import DirectDriverContactBanner from "../components/common/DirectDriverContactBanner"

const pages = {
  kolkata: {
    canonical: "/kolkata",
    title: "Goods Transport & Truck Booking in Kolkata",
    description: "Explore GoMyTruck truck booking, mini truck, goods transport, packers and movers, local and intercity services available from Kolkata.",
    eyebrow: "Kolkata logistics hub",
    h1: "Truck Booking and Goods Transport in Kolkata",
    intro: "Plan a local delivery, a household move or an intercity commercial shipment from one Kolkata hub. Choose a vehicle for the declared load, check the route-based estimate and follow booking updates online.",
    context: "Kolkata movements can involve narrow market lanes, daytime commercial-vehicle restrictions and bridge or toll routing. Enter complete pickup, drop and goods details so the platform can calculate the relevant vehicle, distance, time and applicable fare components.",
    areas: ["Burrabazar", "Park Street", "Dum Dum", "Behala", "Garia", "Howrah connections"],
    services: [["Truck booking", "/kolkata/truck-booking"], ["Mini truck", "/kolkata/mini-truck-booking"], ["Goods transport", "/kolkata/goods-transport"], ["Packers and movers", "/kolkata/packers-and-movers"]],
  },
  barrackpore: {
    canonical: "/barrackpore",
    title: "Truck Booking & Goods Transport in Barrackpore",
    description: "Book local and Kolkata-connected goods transport from Barrackpore, including Tata Ace, pickup and larger commercial vehicle options.",
    eyebrow: "North 24 Parganas hub",
    h1: "Truck Booking and Goods Transport in Barrackpore",
    intro: "Arrange goods movement across Barrackpore, the surrounding industrial belt and routes into Kolkata. Vehicle assignment and pickup timing depend on the declared cargo, route and partner availability.",
    context: "The Barrackpore belt combines residential lanes, wholesale distribution and industrial freight. A clear goods declaration—including weight, quantity and handling needs—helps prevent a vehicle mismatch at pickup.",
    areas: ["Titagarh", "Khardah", "Sodepur", "Naihati", "Shyamnagar", "Kolkata connections"],
    services: [["Truck booking", "/barrackpore/truck-booking"], ["Goods transport", "/barrackpore/goods-transport"], ["Loading labour", "/barrackpore/loading-unloading-labour"], ["Contact us", "/contact"]],
  },
  howrah: {
    canonical: "/howrah",
    title: "Goods Transport & Truck Booking in Howrah",
    description: "Find route-based goods transport and commercial truck booking options for Howrah, Kolkata and intercity movements.",
    eyebrow: "Howrah logistics hub",
    h1: "Goods Transport and Truck Booking in Howrah",
    intro: "Move retail stock, industrial materials, furniture and other permitted goods from Howrah with vehicle options matched to the load declaration.",
    context: "Howrah connects dense local markets with industrial zones and national corridors. Route estimates may reflect distance, estimated travel time, vehicle class, fuel adjustment, taxes, tolls and other disclosed trip components.",
    areas: ["Howrah Maidan", "Shibpur", "Santragachi", "Liluah", "Bally", "Kolkata connections"],
    services: [["Howrah goods transport", "/howrah/goods-transport"], ["Book a truck", "/book-truck-online"], ["Intercity transport", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"]],
  },
  "salt-lake": {
    canonical: "/salt-lake",
    title: "Goods Transport & Mini Truck Booking in Salt Lake",
    description: "Arrange local goods delivery, business distribution and mini truck booking in Salt Lake and nearby Kolkata areas.",
    eyebrow: "Bidhannagar logistics hub",
    h1: "Goods Transport in Salt Lake, Kolkata",
    intro: "Book suitable commercial vehicles for office moves, retail replenishment, parcels and household goods across Salt Lake and nearby business districts.",
    context: "Sector access, building rules and loading windows can affect a Salt Lake pickup. Add landmark and contact details, select the correct goods category and disclose labour requirements before confirming.",
    areas: ["Sector I", "Sector II", "Sector III", "Sector V", "Lake Town", "New Town connections"],
    services: [["Salt Lake goods transport", "/salt-lake/goods-transport"], ["Mini truck booking", "/kolkata/mini-truck-booking"], ["Packers and movers", "/kolkata/packers-and-movers"], ["Contact support", "/contact"]],
  },
  "new-town": {
    canonical: "/new-town",
    title: "Goods Transport & Truck Booking in New Town",
    description: "Book commercial goods transport, mini trucks and moving vehicles in New Town, Rajarhat and nearby Kolkata locations.",
    eyebrow: "Rajarhat–New Town hub",
    h1: "Goods Transport and Truck Booking in New Town",
    intro: "Arrange office, retail, construction-material and household-goods movement in New Town with route-based estimates and digital booking updates.",
    context: "High-rise access rules, loading bays and scheduled entry windows matter in New Town. Confirm them with the property and include handling instructions so the transport and optional workforce request reflect the job.",
    areas: ["Action Area I", "Action Area II", "Action Area III", "Rajarhat", "Chinar Park", "Sector V connections"],
    services: [["New Town goods transport", "/new-town/goods-transport"], ["Mini truck booking", "/kolkata/mini-truck-booking"], ["Commercial transport", "/services/commercial-goods-transport"], ["Contact us", "/contact"]],
  },
  "kolkata-14ft": {
    canonical: "/kolkata/14-feet-truck-rental",
    title: "14 Feet Truck Rental in Kolkata",
    description: "Request a 14 feet commercial truck in Kolkata for suitable medium-volume goods, with route and load details used for the estimate.",
    eyebrow: "Medium commercial vehicle",
    h1: "14 Feet Truck Rental in Kolkata",
    intro: "A 14 feet truck can suit furniture, packaged stock, appliances and medium commercial loads that exceed mini-truck capacity. Declare the goods, approximate weight and dimensions before selecting the vehicle.",
    context: "Payload varies by exact vehicle, body type and permit. The assigned vehicle and final payable amount are shown through the booking flow; toll, waiting, labour and statutory charges may apply when relevant and disclosed.",
    areas: ["Kolkata", "Howrah", "Salt Lake", "New Town", "Barrackpore", "West Bengal routes"],
    services: [["Start booking", "/book-truck-online"], ["Kolkata truck booking", "/kolkata/truck-booking"], ["Commercial transport", "/services/commercial-goods-transport"], ["Contact us", "/contact"]],
  },
  "kolkata-packers": {
    canonical: "/kolkata/packers-and-movers",
    title: "Packers and Movers in Kolkata",
    description: "Request packing and moving assistance in Kolkata for eligible household or office moves, with inventory-based estimates.",
    eyebrow: "Kolkata relocation service",
    h1: "Packers and Movers in Kolkata",
    intro: "Plan a household or small-office move with pickup, destination, inventory and access details captured before the quote. Packing material, workforce and vehicle requirements depend on the declared inventory.",
    context: "List bulky or fragile items, floor and lift access, dismantling needs and preferred moving time. The initial estimate can change if the on-site inventory or service scope differs from what was declared.",
    areas: ["Central Kolkata", "South Kolkata", "North Kolkata", "Salt Lake", "New Town", "Howrah"],
    services: [["Moving service", "/packers-and-movers"], ["Mini truck", "/kolkata/mini-truck-booking"], ["Tata Ace", "/kolkata/tata-ace-booking"], ["Terms", "/legal/terms"]],
  },
  "barrackpore-labour": {
    canonical: "/barrackpore/loading-unloading-labour",
    title: "Loading & Unloading Labour in Barrackpore",
    description: "Request linked loading or unloading workforce with an eligible transport booking in Barrackpore, subject to worker availability.",
    eyebrow: "Optional linked workforce",
    h1: "Loading and Unloading Labour in Barrackpore",
    intro: "Add workforce requirements to an eligible goods-transport request, including worker count, task type and estimated duration. Labour assignment is separate from vehicle assignment and remains subject to availability.",
    context: "Describe stairs, lift access, item weight and specialist handling before confirming. Drivers are not automatically responsible for loading or unloading unless that service is expressly included in the booking.",
    areas: ["Barrackpore", "Titagarh", "Khardah", "Sodepur", "Shyamnagar", "Naihati"],
    services: [["Barrackpore transport", "/barrackpore/truck-booking"], ["Goods transport", "/barrackpore/goods-transport"], ["Partner plans", "/plans"], ["Contact support", "/contact"]],
  },
  "howrah-goods": {
    canonical: "/howrah/goods-transport",
    title: "Goods Transport Services in Howrah",
    description: "Request local or intercity goods transport from Howrah with vehicle selection based on route, load and handling requirements.",
    eyebrow: "Howrah service page",
    h1: "Goods Transport Services in Howrah",
    intro: "Use GoMyTruck for eligible household, retail and commercial goods movements from Howrah. Choose local or intercity transport and provide a complete goods declaration.",
    context: "For industrial or high-value consignments, verify the selected vehicle, packaging, permits and any optional protection shown during booking. Prohibited or incorrectly declared goods cannot be carried.",
    areas: ["Shibpur", "Liluah", "Bally", "Santragachi", "Dasnagar", "Kolkata routes"],
    services: [["Howrah hub", "/howrah"], ["Book a truck", "/book-truck-online"], ["Commercial transport", "/services/commercial-goods-transport"], ["Intercity transport", "/intercity/kolkata"]],
  },
  "salt-lake-goods": {
    canonical: "/salt-lake/goods-transport",
    title: "Goods Transport Services in Salt Lake",
    description: "Book eligible goods transport in Salt Lake for office, retail, household and local distribution requirements.",
    eyebrow: "Salt Lake service page",
    h1: "Goods Transport Services in Salt Lake",
    intro: "Request a mini truck, pickup or other suitable vehicle for goods movement across Bidhannagar and nearby Kolkata locations.",
    context: "Share building access, loading-slot and contact details before pickup. A route estimate is not a guarantee of immediate allocation; the app confirms assignment and trip status separately.",
    areas: ["Sector I", "Sector II", "Sector III", "Sector V", "Lake Town", "Kestopur"],
    services: [["Salt Lake hub", "/salt-lake"], ["Mini truck", "/kolkata/mini-truck-booking"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  "new-town-goods": {
    canonical: "/new-town/goods-transport",
    title: "Goods Transport Services in New Town",
    description: "Arrange local goods transport in New Town and Rajarhat with route-based estimates and vehicle options matched to the load.",
    eyebrow: "New Town service page",
    h1: "Goods Transport Services in New Town",
    intro: "Book for eligible retail stock, office equipment, household items or commercial goods across New Town, Rajarhat and nearby areas.",
    context: "Building and gated-community entry policies can affect pickup. Confirm access, item dimensions and labour needs beforehand; vehicle allocation and arrival time remain subject to live availability and traffic.",
    areas: ["Action Area I", "Action Area II", "Action Area III", "Rajarhat", "Chinar Park", "Eco Park area"],
    services: [["New Town hub", "/new-town"], ["Mini truck", "/kolkata/mini-truck-booking"], ["Packers and movers", "/kolkata/packers-and-movers"], ["Contact support", "/contact"]],
  },
  "kolkata-asansol": {
    canonical: "/routes/kolkata-to-asansol",
    title: "Kolkata to Asansol Goods Transport",
    description: "Plan a dedicated goods movement from Kolkata to Asansol with a route-based estimate and vehicle selection for the declared load.",
    eyebrow: "Intercity route guide",
    h1: "Kolkata to Asansol Goods Transport",
    intro: "Request an intercity vehicle for eligible commercial or household goods between Kolkata and Asansol. Select a vehicle only after checking cargo weight, volume and loading requirements.",
    context: "The road route is roughly 200 km but actual distance and time depend on pickup, drop, traffic and routing. The estimate may include base, distance, time, fuel adjustment, surge, GST, toll, waiting and labour components where applicable; review the live breakdown before payment.",
    areas: ["Kolkata", "Dankuni", "Bardhaman corridor", "Durgapur", "Raniganj", "Asansol"],
    services: [["Intercity from Kolkata", "/intercity/kolkata"], ["14 feet truck", "/kolkata/14-feet-truck-rental"], ["Truck booking", "/kolkata/truck-booking"], ["Enterprise logistics", "/enterprise"]],
  },
  dankuni: {
    canonical: "/dankuni",
    title: "Truck Booking & Goods Transport in Dankuni | Flat 5% Commission",
    description: "Book trucks in Dankuni, gateway to Eastern Dedicated Freight Corridor. FTL, PTL, 32ft containers and mini trucks. Transparent 5% commission, no brokers.",
    eyebrow: "Eastern Freight Corridor Hub",
    h1: "Truck Booking and Goods Transport in Dankuni",
    intro: "Dankuni is the terminus of India's Eastern Dedicated Freight Corridor and the logistics capital of West Bengal. Book FTL, PTL, container and mini trucks for factory-to-port and intercity movements with a transparent 5% platform commission.",
    context: "Dankuni connects Kolkata's industrial heartland to NH-19 and the Durgapur Expressway. Declare cargo weight, type and route accurately for vehicle matching. Toll, waiting and statutory charges may apply as disclosed in the booking.",
    areas: ["Dankuni Logistics Park", "Dankuni-Ludhiana Corridor", "NH-19 Junction", "Kolkata connections", "Howrah bridge routes", "Uluberia belt"],
    services: [["Book a truck", "/book-truck-online"], ["Kolkata truck booking", "/kolkata/truck-booking"], ["Intercity transport", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"]],
  },
  uluberia: {
    canonical: "/uluberia",
    title: "Goods Transport & Truck Booking in Uluberia | GoMyTruck",
    description: "Arrange truck booking and goods transport in Uluberia for rubber park, food processing and industrial freight with verified drivers and 5% commission.",
    eyebrow: "Howrah District Industrial Hub",
    h1: "Goods Transport and Truck Booking in Uluberia",
    intro: "Uluberia houses major rubber parks and food processing zones. Book LCVs, 14ft trucks and 32ft containers for factory and warehouse movements with verified drivers and transparent pricing.",
    context: "Industrial access roads and entry timings can affect pickups near the rubber park belt. Declare goods type, weight and loading needs before booking so the correct vehicle class is assigned.",
    areas: ["Uluberia Rubber Park", "Bagnan", "Panchla", "Domjur", "NH-6 belt", "Haldia corridor"],
    services: [["Howrah goods transport", "/howrah/goods-transport"], ["Book a truck", "/book-truck-online"], ["Intercity transport", "/intercity/kolkata"], ["Contact us", "/contact"]],
  },
  sankrail: {
    canonical: "/sankrail",
    title: "Truck Booking & Logistics in Sankrail Industrial Area | GoMyTruck",
    description: "Book trucks for Sankrail Rubber Park and food processing logistics. Flat 5% commission, verified drivers, transparent freight rates.",
    eyebrow: "Sankrail Industrial Logistics",
    h1: "Truck Booking and Logistics in Sankrail",
    intro: "Sankrail is home to West Bengal's rubber and food processing industrial corridors. GoMyTruck connects you to verified trucks for factory-to-distribution and port movements at a transparent 5% platform commission.",
    context: "Industrial zone entry and loading schedules vary by facility. Submit complete goods declaration including hazard classification and weight before confirming. Drivers are not automatically responsible for loading unless expressly included.",
    areas: ["Sankrail Rubber Park", "Uluberia", "Bagnan", "Howrah connections", "NH-6", "Haldia port route"],
    services: [["Howrah goods transport", "/howrah/goods-transport"], ["Enterprise logistics", "/enterprise"], ["Intercity transport", "/intercity/kolkata"], ["Book a truck", "/book-truck-online"]],
  },
  durgapur: {
    canonical: "/durgapur",
    title: "Truck Booking & Industrial Goods Transport in Durgapur",
    description: "Book trucks for steel, iron and heavy goods transport in Durgapur. Verified drivers, 5% flat commission, FTL and PTL options.",
    eyebrow: "Durgapur Steel Belt Logistics",
    h1: "Truck Booking and Industrial Goods Transport in Durgapur",
    intro: "Durgapur is the steel and heavy-industry capital of West Bengal. GoMyTruck provides FTL, flatbed and container booking for steel, iron, petrochemical and commercial goods with 100% tax-compliant GST invoicing and a flat 5% commission.",
    context: "Heavy industrial loads require proper vehicle class selection, permits and lashing. Declare cargo weight, dimensions and any oversize specifications. Route estimate may include toll, waiting and applicable statutory charges.",
    areas: ["Durgapur Industrial Zone", "Andal", "Raniganj belt", "Asansol connections", "Bardhaman", "Kolkata highway corridor"],
    services: [["Book a truck", "/book-truck-online"], ["Intercity from Kolkata", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  asansol: {
    canonical: "/asansol",
    title: "Truck Booking & Goods Transport in Asansol | GoMyTruck",
    description: "Find verified trucks for goods transport in Asansol. Industrial freight, coal belt logistics and intercity routes with transparent 5% commission.",
    eyebrow: "Asansol Heavy Industry Hub",
    h1: "Truck Booking and Goods Transport in Asansol",
    intro: "Asansol is the largest industrial city in West Bengal after Kolkata. Book trucks for steel, coal, FMCG and intercity movements with transparent pricing and verified driver partners.",
    context: "Coal and mining support logistics require specialized vehicle selection and permit compliance. Declare cargo class, weight and any loading requirements. GoMyTruck routes estimates include applicable tolls and statutory charges.",
    areas: ["Asansol Industrial Area", "Burnpur", "Kulti", "Raniganj", "Dhanbad corridor", "Durgapur connections"],
    services: [["Book a truck", "/book-truck-online"], ["Intercity from Kolkata", "/intercity/kolkata"], ["Commercial transport", "/services/commercial-goods-transport"], ["Contact us", "/contact"]],
  },
  kharagpur: {
    canonical: "/kharagpur",
    title: "Truck Booking & Goods Transport in Kharagpur | GoMyTruck",
    description: "Book trucks in Kharagpur for industrial freight, highway logistics and Vidyasagar Industrial Park movements. Flat 5% commission.",
    eyebrow: "Vidyasagar Industrial Park Hub",
    h1: "Truck Booking and Goods Transport in Kharagpur",
    intro: "Kharagpur is home to Vidyasagar Industrial Park and sits on the critical NH-16 corridor between Kolkata and Bhubaneswar. Book verified trucks for industrial and commercial freight with a transparent 5% commission.",
    context: "NH-16 is a high-volume intercity corridor. Route estimates reflect actual distance, transit time, toll and fuel components. Declare your cargo weight, dimensions and pickup access details accurately.",
    areas: ["Vidyasagar Industrial Park", "Kharagpur", "Jhargram corridor", "NH-16 belt", "Medinipur", "Haldia port route"],
    services: [["Book a truck", "/book-truck-online"], ["Intercity transport", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  haldia: {
    canonical: "/haldia",
    title: "Port & Industrial Goods Transport in Haldia | GoMyTruck",
    description: "Book factory-to-port trucks in Haldia for Haldia Dock Complex. FTL, 32ft container and flatbed with transparent 5% commission.",
    eyebrow: "Haldia Port Logistics",
    h1: "Port and Industrial Goods Transport in Haldia",
    intro: "Haldia is the industrial port city of West Bengal, home to Haldia Dock Complex, petrochemicals and heavy manufacturing. Book FTL, 32ft containers and flatbed trucks for factory-to-port and intercity movements.",
    context: "Port entry, customs documentation and vehicle fitness requirements apply for Haldia port movements. Verify customs clearance status and port gate timing. GoMyTruck verifies driver documents but customs compliance remains with the shipper.",
    areas: ["Haldia Dock Complex", "Haldia Petrochemicals", "Durgachak", "NH-41 belt", "Kolkata port route", "Kharagpur corridor"],
    services: [["Book a truck", "/book-truck-online"], ["Enterprise logistics", "/enterprise"], ["Intercity transport", "/intercity/kolkata"], ["Contact us", "/contact"]],
  },
  siliguri: {
    canonical: "/siliguri",
    title: "Truck Booking & Goods Transport in Siliguri | GoMyTruck",
    description: "Book trucks for goods transport in Siliguri, the gateway to North East India. Intercity FTL, PTL and mini trucks with 5% commission.",
    eyebrow: "North East India Gateway",
    h1: "Truck Booking and Goods Transport in Siliguri",
    intro: "Siliguri is the gateway to North East India, connecting West Bengal to Assam, Bhutan, Nepal and beyond. Book intercity FTL and PTL trucks for commercial, FMCG and agricultural goods movements.",
    context: "Siliguri routes often pass through the Chicken Neck corridor with specific entry restrictions. Declare cargo type, dimensions and destination state clearly. Transit permits may be required for goods crossing state borders.",
    areas: ["Siliguri Junction", "Bagdogra", "Jalpaiguri", "North Bengal", "Guwahati corridor", "Kolkata highway route"],
    services: [["Book a truck", "/book-truck-online"], ["Intercity from Kolkata", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  burrabazar: {
    canonical: "/burrabazar",
    title: "Mini Truck & Goods Transport in Burrabazar Kolkata | GoMyTruck",
    description: "Book Tata Ace and mini trucks in Burrabazar for mandi-to-retail delivery. Instant dispatch, no broker, transparent pricing.",
    eyebrow: "Burrabazar Mandi Logistics",
    h1: "Mini Truck and Goods Transport in Burrabazar, Kolkata",
    intro: "Burrabazar is Kolkata's largest wholesale mandi and trading hub. GoMyTruck connects traders to Tata Ace, 3-wheelers and mini trucks for instant mandi-to-retail dispatch — bypassing syndicate opaqueness with digital booking.",
    context: "Burrabazar has narrow lanes and commercial vehicle entry restrictions in peak hours. Book early and confirm pickup slot availability. Mini trucks and LCVs are preferred for intra-market movements.",
    areas: ["Burrabazar", "Cossipore", "Shyambazar", "Central Kolkata markets", "Rabindra Sarani belt", "Howrah connections"],
    services: [["Mini truck booking", "/kolkata/mini-truck-booking"], ["Tata Ace booking", "/kolkata/tata-ace-booking"], ["Kolkata truck booking", "/kolkata/truck-booking"], ["Book online", "/book-truck-online"]],
  },
  "kolkata-guwahati": {
    canonical: "/routes/kolkata-to-guwahati",
    title: "Kolkata to Guwahati Goods Transport | Freight Rates & Trucks",
    description: "Book FTL trucks from Kolkata to Guwahati. The average freight rate for a 32ft container is ₹45,000–₹65,000. Transparent 5% commission, no brokers.",
    eyebrow: "High-Volume Intercity Route",
    h1: "Kolkata to Guwahati Goods Transport",
    intro: "The Kolkata–Guwahati corridor is one of the highest-volume freight routes in Eastern India, covering approximately 1,000 km via NH-17/NH-27. Book 32ft containers, flatbeds and FTL trucks with verified drivers and a transparent 5% platform commission.",
    context: "Route distance is approximately 1,000 km. Transit time is typically 24–36 hours depending on traffic and loading. The estimate includes base fare, distance, fuel surcharge, applicable tolls and GST. Return loads from Guwahati to Kolkata are available — contact support for backhaul matching.",
    areas: ["Kolkata", "Dalkhola corridor", "Siliguri", "Chicken Neck", "Assam border", "Guwahati"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["32ft container", "/kolkata/truck-booking"], ["Contact us", "/contact"]],
  },
  "kolkata-patna": {
    canonical: "/routes/kolkata-to-patna",
    title: "Kolkata to Patna Goods Transport | Truck Booking & Freight Rates",
    description: "Book trucks from Kolkata to Patna for agricultural, FMCG and commercial goods. Flat 5% commission, verified drivers, transparent freight rates.",
    eyebrow: "Bihar Freight Corridor",
    h1: "Kolkata to Patna Goods Transport",
    intro: "The Kolkata–Patna route covers approximately 600 km via NH-19. Book FTL, PTL and mini trucks for FMCG, agricultural and commercial goods with transparent pricing and verified driver partners.",
    context: "Route distance is approximately 600 km via NH-19 through Durgapur and Dhanbad. Transit time is typically 12–18 hours. Estimate includes base, distance, fuel surcharge, applicable tolls and GST. Return loads from Patna to Kolkata are available.",
    areas: ["Kolkata", "Durgapur", "Asansol", "Dhanbad", "Barhi", "Patna"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Kolkata truck booking", "/kolkata/truck-booking"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  "kolkata-bhubaneswar": {
    canonical: "/routes/kolkata-to-bhubaneswar",
    title: "Kolkata to Bhubaneswar Goods Transport | Truck Booking",
    description: "Book trucks from Kolkata to Bhubaneswar via NH-16. FTL, PTL, 32ft container. Transparent 5% commission, verified drivers.",
    eyebrow: "Odisha Freight Corridor",
    h1: "Kolkata to Bhubaneswar Goods Transport",
    intro: "The Kolkata–Bhubaneswar corridor runs approximately 450 km via NH-16, passing through Kharagpur and Balasore. Book FTL, PTL and container trucks for industrial, FMCG and commercial movements.",
    context: "NH-16 is a high-capacity national highway with multiple toll plazas. Route estimate includes distance, base fare, fuel surcharge and applicable tolls. Transit time is typically 8–12 hours. Return loads from Bhubaneswar and Cuttack are available.",
    areas: ["Kolkata", "Kharagpur", "Balasore", "Bhadrak", "Cuttack", "Bhubaneswar"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["Kolkata truck booking", "/kolkata/truck-booking"], ["Contact us", "/contact"]],
  },
  "kolkata-siliguri": {
    canonical: "/routes/kolkata-to-siliguri",
    title: "Kolkata to Siliguri Goods Transport | Truck Booking & Freight",
    description: "Book trucks from Kolkata to Siliguri for North Bengal and North East India movements. FTL, PTL, mini trucks. 5% commission.",
    eyebrow: "North Bengal Trade Route",
    h1: "Kolkata to Siliguri Goods Transport",
    intro: "The Kolkata–Siliguri corridor is approximately 600 km via NH-12 and NH-27, serving as the gateway to North Bengal, Bhutan, Nepal and North East India. Book verified trucks for FMCG, tea and commercial freight.",
    context: "Route passes through Dalkhola and Raiganj. Transit time is typically 12–16 hours. Estimate includes base, distance, fuel, toll and GST components. State border crossings may require additional documentation for certain goods.",
    areas: ["Kolkata", "Krishnanagar", "Murshidabad", "Malda", "Raiganj", "Siliguri"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Siliguri hub", "/siliguri"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  "kolkata-cuttack": {
    canonical: "/routes/kolkata-to-cuttack",
    title: "Kolkata to Cuttack Goods Transport | Freight Rates & Trucks",
    description: "Book trucks from Kolkata to Cuttack via NH-16. FTL, PTL, container for Jagatpur Industrial Estate freight. 5% commission.",
    eyebrow: "Cuttack Industrial Route",
    h1: "Kolkata to Cuttack Goods Transport",
    intro: "The Kolkata–Cuttack route covers approximately 500 km via NH-16. Cuttack's Jagatpur Industrial Estate is a major hub for engineering, plastics and pharmaceuticals. Book FTL, PTL and container trucks with verified drivers.",
    context: "Route passes through Bhubaneswar. Transit time is 10–14 hours. Return loads from Cuttack and Bhubaneswar to Kolkata are available — backhaul matching reduces empty running costs. Estimate includes base, distance, fuel, toll and GST.",
    areas: ["Kolkata", "Kharagpur", "Balasore", "Bhubaneswar", "Jagatpur Industrial Estate", "Cuttack"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["Kolkata truck booking", "/kolkata/truck-booking"], ["Contact us", "/contact"]],
  },
  "kolkata-ranchi": {
    canonical: "/routes/kolkata-to-ranchi",
    title: "Kolkata to Ranchi Goods Transport | Truck Booking",
    description: "Book trucks from Kolkata to Ranchi for mining support, FMCG and commercial goods. Flat 5% commission, verified drivers.",
    eyebrow: "Jharkhand Freight Route",
    h1: "Kolkata to Ranchi Goods Transport",
    intro: "The Kolkata–Ranchi corridor covers approximately 420 km via NH-20/NH-33. Ranchi is the commercial capital of Jharkhand, serving mining, manufacturing and FMCG industries. Book FTL and PTL trucks with transparent pricing.",
    context: "Route passes through Dhanbad and includes ghat sections. Transit time is 8–12 hours. Estimate includes base, distance, fuel, toll and GST. Mining support logistics may require specialized vehicles — declare cargo type clearly.",
    areas: ["Kolkata", "Asansol", "Dhanbad", "Bokaro", "Ramgarh", "Ranchi"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["Asansol hub", "/asansol"], ["Contact us", "/contact"]],
  },
  "kolkata-dhanbad": {
    canonical: "/routes/kolkata-to-dhanbad",
    title: "Kolkata to Dhanbad Goods Transport | Truck Booking & Freight",
    description: "Book trucks from Kolkata to Dhanbad for coal, mining and industrial freight. FTL, flatbed, container. 5% commission.",
    eyebrow: "Coal Belt Freight Route",
    h1: "Kolkata to Dhanbad Goods Transport",
    intro: "The Kolkata–Dhanbad corridor is approximately 280 km via NH-19 through Asansol. Dhanbad is the coal capital of India, driving high-volume industrial freight demand for mining equipment, coal and heavy goods.",
    context: "Mining and heavy goods require proper vehicle permits and fitness certificates. Declare cargo weight, classification and any oversize specifications. Transit time is 6–8 hours. Estimate includes base, distance, fuel, toll and GST.",
    areas: ["Kolkata", "Durgapur", "Asansol", "Burnpur", "Bokaro junction", "Dhanbad"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Asansol hub", "/asansol"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  "kolkata-haldia-route": {
    canonical: "/routes/kolkata-to-haldia",
    title: "Kolkata to Haldia Port Goods Transport | Factory-to-Port Trucks",
    description: "Book factory-to-port trucks from Kolkata to Haldia Dock Complex. 32ft container, flatbed, FTL. 5% commission, verified drivers.",
    eyebrow: "Factory-to-Port Route",
    h1: "Kolkata to Haldia Port Goods Transport",
    intro: "The Kolkata–Haldia route is approximately 130 km, serving the Haldia Dock Complex and petrochemical corridor. Book 32ft containers, flatbeds and FTL trucks for port-bound consignments with verified drivers.",
    context: "Port entry requires valid customs documents and truck fitness certificates. Coordinate port gate-in timing before booking. Transit time is typically 3–4 hours. Estimate includes base, distance, fuel, applicable tolls and GST.",
    areas: ["Kolkata", "Diamond Harbour road", "Tamluk", "Nandakumar", "Haldia Dock Complex", "Haldia Petrochemicals"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Haldia hub", "/haldia"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  "kolkata-durgapur-route": {
    canonical: "/routes/kolkata-to-durgapur",
    title: "Kolkata to Durgapur Goods Transport | Steel & Industrial Freight",
    description: "Book trucks from Kolkata to Durgapur for steel, iron and industrial goods. FTL, flatbed, mini truck. Flat 5% commission.",
    eyebrow: "Durgapur Industrial Route",
    h1: "Kolkata to Durgapur Goods Transport",
    intro: "The Kolkata–Durgapur corridor is approximately 170 km via the Durgapur Expressway — one of West Bengal's fastest freight highways. Book FTL, flatbed and mini trucks for steel, machinery, FMCG and commercial goods.",
    context: "Durgapur Expressway has limited entry/exit points. Transit time is typically 3–4 hours. Estimate includes base, distance, fuel, toll (Durgapur Expressway toll applies) and GST. Declare cargo weight and dimensions accurately for vehicle matching.",
    areas: ["Kolkata", "Dankuni", "Bardhaman", "Panagarh", "Durgapur Steel Plant area", "Durgapur"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Durgapur hub", "/durgapur"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  cuttack: {
    canonical: "/cuttack",
    title: "Truck Booking & Goods Transport in Cuttack | GoMyTruck",
    description: "Book trucks in Cuttack for Jagatpur Industrial Estate, pharmaceutical and engineering freight. Flat 5% commission, verified drivers, GST invoice.",
    eyebrow: "Jagatpur Industrial Estate Hub",
    h1: "Truck Booking and Goods Transport in Cuttack",
    intro: "Cuttack is Odisha's commercial capital and home to Jagatpur Industrial Estate — a hub for engineering, plastics, pharmaceuticals and consumer goods. GoMyTruck connects you to verified FTL, PTL and container trucks at a transparent 5% platform commission.",
    context: "Jagatpur Industrial Estate has specific entry schedules. Declare cargo type, weight and industrial classification accurately. Transit routes connect to Bhubaneswar and Kolkata via NH-16. Estimate includes base, distance, fuel, toll and GST.",
    areas: ["Jagatpur Industrial Estate", "Cuttack City", "Choudwar", "Bhubaneswar", "NH-16 belt", "Kolkata corridor"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Kolkata → Cuttack route", "/routes/kolkata-to-cuttack"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  bhubaneswar: {
    canonical: "/bhubaneswar",
    title: "Truck Booking & Goods Transport in Bhubaneswar | GoMyTruck",
    description: "Book trucks in Bhubaneswar for FMCG, pharma and industrial freight. Verified drivers, 5% commission, GST invoice. Intercity and local transport.",
    eyebrow: "Odisha Capital Commercial Hub",
    h1: "Truck Booking and Goods Transport in Bhubaneswar",
    intro: "Bhubaneswar is Odisha's capital and fastest-growing commercial city, with Infocity IT Park, Chandaka Industrial Estate and major FMCG distribution hubs. Book FTL, PTL and mini trucks at a transparent 5% platform commission.",
    context: "Chandaka Industrial Estate and IDCO plots have varying entry and logistics timings. Declare cargo type, weight and destination zone accurately. Intercity connections via NH-16 to Kolkata and south to Visakhapatnam.",
    areas: ["Chandaka Industrial Estate", "Infocity", "Bhubaneswar Airport belt", "NH-16", "Cuttack", "Kolkata corridor"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Kolkata → Bhubaneswar", "/routes/kolkata-to-bhubaneswar"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  guwahati: {
    canonical: "/guwahati",
    title: "Truck Booking & Goods Transport in Guwahati | Gateway to Northeast | GoMyTruck",
    description: "Book FTL and PTL trucks in Guwahati for Northeast India distribution. Verified drivers, 5% commission, backhaul matching. Kolkata to Guwahati corridor.",
    eyebrow: "Northeast India Gateway Hub",
    h1: "Truck Booking and Goods Transport in Guwahati",
    intro: "Guwahati is the commercial capital of Northeast India and the primary freight gateway for Assam, Meghalaya, Nagaland, Manipur, Mizoram and Arunachal Pradesh. Book FTL and PTL trucks with verified drivers and transparent 5% platform commission. Return loads from Guwahati to Kolkata are available for backhaul optimization.",
    context: "Guwahati handles high-volume FMCG, agri-commodity and pharmaceutical distribution for the Northeast. NH-17/NH-27 is the primary corridor to Kolkata. Declare cargo, state border permits and destination zone accurately. Return loads reduce empty running costs.",
    areas: ["Guwahati", "Amingaon Industrial Area", "Palashbari", "Kamakhya", "Kolkata corridor", "Northeast India"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Kolkata → Guwahati route", "/routes/kolkata-to-guwahati"], ["Return load finder", "/fleet-partner-registration"], ["Enterprise logistics", "/enterprise"]],
  },
  patna: {
    canonical: "/patna",
    title: "Truck Booking & Goods Transport in Patna | GoMyTruck",
    description: "Book trucks in Patna for agricultural, FMCG and commercial goods transport. Verified drivers, 5% commission, intercity routes to Kolkata and beyond.",
    eyebrow: "Bihar Capital Commercial Hub",
    h1: "Truck Booking and Goods Transport in Patna",
    intro: "Patna is Bihar's capital and the commercial gateway for agricultural produce, FMCG and building materials distribution across North and East India. GoMyTruck connects you to verified FTL, PTL and mini trucks at a transparent 5% commission.",
    context: "Patna serves high-volume agricultural freight including grains, vegetables and processed foods. Declare cargo type, weight and any state permit requirements. Transit connects to Varanasi, Ranchi, Dhanbad and Kolkata via NH-19/NH-31.",
    areas: ["Patna", "Hajipur Industrial Area", "Vaishali", "Muzaffarpur", "Dhanbad corridor", "Kolkata highway"],
    services: [["Kolkata → Patna route", "/routes/kolkata-to-patna"], ["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  ranchi: {
    canonical: "/ranchi",
    title: "Truck Booking & Goods Transport in Ranchi | GoMyTruck",
    description: "Book trucks in Ranchi for mining support, FMCG and commercial freight. Flat 5% commission, verified drivers, intercity transport from Kolkata.",
    eyebrow: "Jharkhand Capital Hub",
    h1: "Truck Booking and Goods Transport in Ranchi",
    intro: "Ranchi is Jharkhand's capital and the commercial hub for mining support, FMCG, building materials and consumer goods across the Chota Nagpur plateau. Book FTL and PTL trucks at a transparent 5% platform commission.",
    context: "Ranchi connects to Kolkata via NH-33 through Dhanbad and to Nagpur via NH-75. Mining zone transport requires vehicle fitness certificates and cargo permits. Declare cargo classification and weight accurately.",
    areas: ["Ranchi", "Namkum Industrial Area", "Hatia", "Bokaro", "Dhanbad corridor", "Kolkata highway"],
    services: [["Kolkata → Ranchi route", "/routes/kolkata-to-ranchi"], ["Asansol hub", "/asansol"], ["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"]],
  },
  dhanbad: {
    canonical: "/dhanbad",
    title: "Truck Booking & Goods Transport in Dhanbad | Coal Belt Logistics | GoMyTruck",
    description: "Book trucks in Dhanbad for coal, mining equipment and heavy industrial freight. FTL, flatbed. Flat 5% commission, no brokers.",
    eyebrow: "Dhanbad Coal Belt Logistics Hub",
    h1: "Truck Booking and Goods Transport in Dhanbad",
    intro: "Dhanbad is India's coal capital, with BCCL, ECL and major mining support industries. GoMyTruck provides FTL, flatbed and open-body trucks for coal support logistics, mining equipment and FMCG distribution at a transparent 5% commission.",
    context: "Coal and mining support logistics require vehicle fitness, oversize permits and weight compliance at check posts. Declare cargo type, classification and dimensions accurately. Connects to Asansol, Kolkata and Ranchi via NH-19/NH-33.",
    areas: ["Dhanbad", "Jharia", "Sindri", "Asansol", "Bokaro", "Kolkata corridor"],
    services: [["Kolkata → Dhanbad route", "/routes/kolkata-to-dhanbad"], ["Asansol hub", "/asansol"], ["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"]],
  },
  bardhaman: {
    canonical: "/bardhaman",
    title: "Truck Booking & Goods Transport in Bardhaman | GoMyTruck",
    description: "Book trucks in Bardhaman for paddy, jute, brick and industrial goods transport. Flat 5% commission, verified drivers, no brokers.",
    eyebrow: "West Bengal Agricultural & Industrial Hub",
    h1: "Truck Booking and Goods Transport in Bardhaman",
    intro: "Bardhaman is West Bengal's rice bowl and a key agricultural freight hub, with major paddy, rice, jute and brick transport requirements. It also hosts Panagarh Industrial Growth Centre. Book verified trucks at a transparent 5% commission.",
    context: "Agricultural freight peaks post-harvest. Brick transport requires proper loading permits. Panagarh IGC has organized industrial logistics needs. Connects to Kolkata via Durgapur Expressway and to Durgapur, Asansol via NH-19.",
    areas: ["Bardhaman city", "Panagarh Industrial Growth Centre", "Galsi", "Durgapur Expressway", "Durgapur", "Kolkata"],
    services: [["Book a truck", "/book-truck-online"], ["Kolkata → Durgapur route", "/routes/kolkata-to-durgapur"], ["Durgapur hub", "/durgapur"], ["Enterprise logistics", "/enterprise"]],
  },
  "dumdum-barasat": {
    canonical: "/dumdum-barasat",
    title: "Truck Booking & Goods Transport in Dum Dum & Barasat | GoMyTruck",
    description: "Book mini trucks and goods transport in Dum Dum and Barasat for airport cargo, export logistics and North Kolkata distribution. 5% commission.",
    eyebrow: "Airport & North Kolkata Belt",
    h1: "Truck Booking and Goods Transport in Dum Dum and Barasat",
    intro: "Dum Dum and Barasat form the northern logistics belt of Kolkata, housing the Netaji Subhash Chandra Bose International Airport cargo zone, export processing units and major FMCG distribution hubs. Book mini trucks, pickups and FTL vehicles at a transparent 5% commission.",
    context: "Airport cargo zone has specific vehicle access and timing restrictions. Export and import consignments require customs documentation. Declare cargo type, dimension and customs status before booking.",
    areas: ["Dum Dum", "Barasat", "NSCBI Airport Cargo Zone", "Madhyamgram", "Birati", "North 24 Parganas"],
    services: [["Book a truck", "/book-truck-online"], ["Kolkata truck booking", "/kolkata/truck-booking"], ["Intercity transport", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"]],
  },
  paradeep: {
    canonical: "/paradeep",
    title: "Port Logistics & Truck Booking in Paradeep | Factory-to-Port | GoMyTruck",
    description: "Book trucks for Paradeep Port factory-to-port movements. FTL, 32ft container, flatbed. Verified drivers, 5% commission, GST invoice.",
    eyebrow: "Paradeep Port Logistics Hub",
    h1: "Port Logistics and Truck Booking in Paradeep",
    intro: "Paradeep is Odisha's major seaport, handling iron ore, fertilizers, coal and bulk cargo. GoMyTruck provides verified FTL, flatbed and container trucks for factory-to-port movements at a transparent 5% commission.",
    context: "Port entry requires valid customs documents, truck fitness certificates and port gate passes. Coordinate port gate-in timing before booking. Cargo documentation (Bill of Lading, e-Way Bill) must be in order. Estimate includes distance, fuel, toll and GST.",
    areas: ["Paradeep Port", "Paradeep Phosphates", "IFFCO Paradeep", "Cuttack corridor", "Bhubaneswar", "Kolkata highway"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["Cuttack hub", "/cuttack"], ["Contact us", "/contact"]],
  },
  krishnanagar: {
    canonical: "/krishnanagar",
    title: "Truck Booking & Goods Transport in Krishnanagar | GoMyTruck",
    description: "Book trucks in Krishnanagar for agricultural, FMCG and commercial goods transport in Nadia district. 5% commission, verified drivers.",
    eyebrow: "Nadia District Logistics Hub",
    h1: "Truck Booking and Goods Transport in Krishnanagar",
    intro: "Krishnanagar is the commercial hub of Nadia district, serving agricultural produce, FMCG distribution and cottage industry freight. It sits on the NH-12 corridor to Siliguri, making it a key stopover for North Bengal-bound goods. Book verified trucks at a transparent 5% commission.",
    context: "Nadia district handles high-volume agricultural, dairy and FMCG freight. NH-12 connections to Barasat/Kolkata in the south and Murshidabad/Siliguri in the north. Declare cargo type, weight and any perishable handling requirements.",
    areas: ["Krishnanagar", "Nabadwip", "Ranaghat", "Nadia district", "Barasat corridor", "Murshidabad"],
    services: [["Book a truck", "/book-truck-online"], ["Kolkata → Siliguri route", "/routes/kolkata-to-siliguri"], ["Intercity transport", "/intercity/kolkata"], ["Contact us", "/contact"]],
  },
  "kolkata-delhi": {
    canonical: "/routes/kolkata-to-delhi",
    title: "Kolkata to Delhi Goods Transport | FTL Truck Booking | GoMyTruck",
    description: "Book FTL trucks from Kolkata to Delhi via NH-19. 32ft container, flatbed. Transparent 5% commission, verified drivers, GST invoice.",
    eyebrow: "High-Volume National Corridor",
    h1: "Kolkata to Delhi Goods Transport",
    intro: "The Kolkata–Delhi corridor is one of India's highest-volume freight routes, covering approximately 1,500 km via NH-19 through Dhanbad, Varanasi and Agra. Book 32ft containers, flatbeds and FTL trucks with verified drivers and a transparent 5% platform commission.",
    context: "Route distance is approximately 1,500 km via NH-19. Transit time is typically 36–48 hours. The estimate includes base, distance, fuel surcharge, applicable tolls (multiple toll plazas on NH-19/NH-44) and GST. Return loads from Delhi NCR to Kolkata are frequently available for backhaul optimization.",
    areas: ["Kolkata", "Dhanbad", "Varanasi", "Allahabad", "Kanpur", "Delhi NCR"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["32ft container", "/kolkata/32ft-container-truck"], ["Contact us", "/contact"]],
  },
  "kolkata-mumbai": {
    canonical: "/routes/kolkata-to-mumbai",
    title: "Kolkata to Mumbai Goods Transport | Long-Haul FTL Trucking | GoMyTruck",
    description: "Book FTL trucks from Kolkata to Mumbai via NH-49/NH-44. 32ft container, long-haul. 5% commission, verified drivers, GST invoice.",
    eyebrow: "Long-Haul National Corridor",
    h1: "Kolkata to Mumbai Goods Transport",
    intro: "The Kolkata–Mumbai corridor covers approximately 2,000 km and is one of India's most critical long-haul freight lanes. Book 32ft containers and FTL trucks for manufacturing, pharma, FMCG and commercial goods at a transparent 5% commission.",
    context: "Route distance is approximately 2,000 km. Transit time is typically 48–72 hours. Multiple toll plazas and state border crossings apply. Return loads from Mumbai and Pune are available for backhaul optimization. Declare cargo type, weight and any perishable or restricted goods clearly.",
    areas: ["Kolkata", "Nagpur", "Aurangabad", "Pune", "Navi Mumbai", "Mumbai"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["32ft container", "/kolkata/32ft-container-truck"], ["Contact us", "/contact"]],
  },
  "kolkata-hyderabad": {
    canonical: "/routes/kolkata-to-hyderabad",
    title: "Kolkata to Hyderabad Goods Transport | FTL Truck Booking | GoMyTruck",
    description: "Book FTL trucks from Kolkata to Hyderabad for pharma, FMCG and industrial goods. 5% commission, verified drivers, GST invoice.",
    eyebrow: "South India Freight Corridor",
    h1: "Kolkata to Hyderabad Goods Transport",
    intro: "The Kolkata–Hyderabad corridor covers approximately 1,600 km, serving the pharmaceutical, FMCG and IT equipment freight needs between Eastern and Southern India. Book 32ft containers and FTL trucks at a transparent 5% commission.",
    context: "Route distance is approximately 1,600 km via Vijayawada or via Nagpur. Transit time is typically 36–48 hours. Multiple toll plazas apply. Declare cargo type, weight and any temperature-sensitive handling requirements.",
    areas: ["Kolkata", "Bhubaneswar", "Visakhapatnam", "Vijayawada", "Hyderabad", "Secunderabad"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["Kolkata → Bhubaneswar route", "/routes/kolkata-to-bhubaneswar"], ["Contact us", "/contact"]],
  },
  "kolkata-bangalore": {
    canonical: "/routes/kolkata-to-bangalore",
    title: "Kolkata to Bangalore Goods Transport | Long-Haul FTL | GoMyTruck",
    description: "Book FTL trucks from Kolkata to Bangalore for electronics, pharma and FMCG freight. 5% commission, verified drivers, GST invoice.",
    eyebrow: "South India Long-Haul Route",
    h1: "Kolkata to Bangalore Goods Transport",
    intro: "The Kolkata–Bangalore corridor covers approximately 1,900 km and is a growing lane for electronics, pharmaceutical and FMCG freight. Book 32ft containers and FTL trucks with verified drivers at a transparent 5% commission.",
    context: "Route distance is approximately 1,900 km via Hyderabad. Transit time is typically 48–72 hours. Multiple state crossings and toll plazas apply. Declare cargo classification, weight and restricted goods status before booking.",
    areas: ["Kolkata", "Bhubaneswar", "Visakhapatnam", "Hyderabad", "Tumkur", "Bangalore"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["32ft container", "/kolkata/32ft-container-truck"], ["Contact us", "/contact"]],
  },
  "kolkata-chennai": {
    canonical: "/routes/kolkata-to-chennai",
    title: "Kolkata to Chennai Goods Transport | FTL Truck Booking | GoMyTruck",
    description: "Book FTL trucks from Kolkata to Chennai for automotive, electronics and FMCG freight. 5% commission, verified drivers, GST invoice.",
    eyebrow: "East Coast National Freight Lane",
    h1: "Kolkata to Chennai Goods Transport",
    intro: "The Kolkata–Chennai corridor runs approximately 1,700 km via the East Coast NH-16 and is a major lane for automotive parts, electronics and FMCG. Book 32ft containers, closed containers and FTL trucks at a transparent 5% commission.",
    context: "Route distance is approximately 1,700 km via NH-16/NH-5. Transit time is typically 36–48 hours. Multiple toll plazas and state border crossings apply. Return loads from Chennai (automotive parts, textile) are frequently available.",
    areas: ["Kolkata", "Bhubaneswar", "Visakhapatnam", "Nellore", "Chennai Port Trust", "Chennai"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Enterprise logistics", "/enterprise"], ["Kolkata → Bhubaneswar route", "/routes/kolkata-to-bhubaneswar"], ["Contact us", "/contact"]],
  },
  "kolkata-paradeep": {
    canonical: "/routes/kolkata-to-paradeep",
    title: "Kolkata to Paradeep Port Goods Transport | Factory-to-Port Trucks",
    description: "Book factory-to-port trucks from Kolkata to Paradeep. 32ft container, flatbed. 5% commission, verified drivers, GST invoice.",
    eyebrow: "Kolkata–Paradeep Port Route",
    h1: "Kolkata to Paradeep Port Goods Transport",
    intro: "The Kolkata–Paradeep route covers approximately 500 km via NH-16/NH-55, connecting West Bengal's manufacturing clusters to Odisha's Paradeep Port for bulk cargo, fertilizer and industrial export. Book FTL, flatbeds and 32ft containers.",
    context: "Port entry requires customs documents and valid port gate passes. Transit time is typically 10–14 hours. Estimate includes base, distance, fuel, toll and GST. Bulk cargo and hazardous goods require additional documentation.",
    areas: ["Kolkata", "Kharagpur", "Balasore", "Bhubaneswar", "Cuttack", "Paradeep Port"],
    services: [["Book intercity truck", "/intercity/kolkata"], ["Paradeep hub", "/paradeep"], ["Enterprise logistics", "/enterprise"], ["Contact us", "/contact"]],
  },
  "guwahati-kolkata": {
    canonical: "/routes/guwahati-to-kolkata",
    title: "Guwahati to Kolkata Goods Transport | Return Load Backhaul | GoMyTruck",
    description: "Book return load trucks from Guwahati to Kolkata. FTL, PTL, backhaul matching. 5% commission, verified drivers, GST invoice.",
    eyebrow: "Guwahati→Kolkata Return Load Route",
    h1: "Guwahati to Kolkata Goods Transport — Return Load Finder",
    intro: "The Guwahati–Kolkata return route is one of Eastern India's highest-demand backhaul lanes. Truck operators returning empty from Guwahati can significantly reduce costs by finding matched loads. GoMyTruck provides backhaul load matching and direct FTL booking at a transparent 5% commission.",
    context: "Route distance is approximately 1,000 km via NH-27. Transit time is typically 24–36 hours. Return loads typically include FMCG, agri-commodity and pharmaceutical goods originating in the Northeast. Declare cargo, any state border documentation and perishable handling needs.",
    areas: ["Guwahati", "Shillong Road Junction", "Chicken Neck corridor", "Siliguri", "Raiganj", "Kolkata"],
    services: [["Book a truck", "/book-truck-online"], ["Fleet partner registration", "/fleet-partner-registration"], ["Guwahati hub", "/guwahati"], ["Enterprise logistics", "/enterprise"]],
  },
  "cuttack-kolkata": {
    canonical: "/routes/cuttack-to-kolkata",
    title: "Cuttack to Kolkata Goods Transport | Return Load | GoMyTruck",
    description: "Book return load trucks from Cuttack to Kolkata. FTL, PTL, backhaul. 5% commission, verified drivers, GST invoice.",
    eyebrow: "Cuttack→Kolkata Return Route",
    h1: "Cuttack to Kolkata Goods Transport — Return Load Finder",
    intro: "The Cuttack–Kolkata return corridor is approximately 500 km via NH-16. Trucks returning from Odisha can find matched loads for FMCG, agri-commodity and industrial goods originating in Cuttack and Bhubaneswar. GoMyTruck provides backhaul matching at a transparent 5% commission.",
    context: "Route distance approximately 500 km. Transit time typically 10–14 hours. Return loads include engineering goods from Jagatpur, agri-commodity from Puri/Cuttack belt. Declare cargo type, weight and any customs documentation.",
    areas: ["Cuttack", "Bhubaneswar", "Balasore", "Kharagpur", "Kolkata", "Jagatpur Industrial Estate"],
    services: [["Book a truck", "/book-truck-online"], ["Fleet partner registration", "/fleet-partner-registration"], ["Cuttack hub", "/cuttack"], ["Enterprise logistics", "/enterprise"]],
  },
}

export default function LocalSeoPage({ pageKey }) {
  const page = pages[pageKey]
  useEffect(() => { window.scrollTo(0, 0) }, [pageKey])

  if (!page) {
    return <Navigate to="/404" replace />
  }

  // Dynamic FAQ generation for either corridor routes or local city/hub pages
  let dynamicFaqData;
  if (page.canonical?.startsWith("/routes/")) {
    const rawClean = page.h1.replace(/—.*$/, "").replace(/Goods Transport.*/, "").trim()
    const parts = rawClean.split(" to ")
    const fromCity = parts[0] ? parts[0].trim() : "Kolkata"
    const toCity = parts[1] ? parts[1].trim() : "Destination"
    dynamicFaqData = generateRouteFaqs(fromCity, toCity, "standard highway corridor distance", "12 to 36 hours", "National Highway")
  } else {
    const rawCity = page.h1.includes(" in ")
      ? page.h1.split(" in ")[1].split(",")[0].trim()
      : (page.areas[0] || page.eyebrow.split(" ")[0] || "Kolkata")
    dynamicFaqData = generateCityFaqs({ name: rawCity, slug: pageKey }, "hub", page.areas)
  }

  const activeFaqs = dynamicFaqData.faqs
  const faqSchema = dynamicFaqData.jsonLdSchema

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.h1,
      url: `https://gomytruck.com${page.canonical}`,
      provider: { "@id": "https://gomytruck.com/#organization" },
      areaServed: page.areas,
      description: page.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gomytruck.com/" },
        { "@type": "ListItem", position: 2, name: page.h1, item: `https://gomytruck.com${page.canonical}` },
      ],
    },
    faqSchema,
  ]

  return (
    <div className="bg-white min-h-screen pt-20">
      <SEOHead 
        title={page.title} 
        description={page.description} 
        canonical={page.canonical} 
        jsonLd={jsonLd} 
        preloadImage="/hero-bg-960.webp"
        preloadImageSrcSet="/hero-bg-640.webp 640w, /hero-bg-960.webp 960w, /hero-bg-1600.webp 1600w"
      />
      <nav aria-label="Breadcrumb" className="border-b border-slate-200">
        <ol className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 text-sm text-slate-600">
          <li><Link to="/" className="hover:text-brand-700">Home</Link></li><li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-slate-900">{page.h1}</li>
        </ol>
      </nav>

      <header className="bg-slate-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-300 font-bold uppercase tracking-widest text-sm mb-4">{page.eyebrow}</p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl">{page.h1}</h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-3xl">{page.intro}</p>
          <div className="mt-5 inline-flex items-center gap-2 bg-brand-700/30 border border-brand-500/40 rounded-full px-4 py-1.5">
            <BadgePercent size={16} className="text-brand-300" />
            <span className="text-brand-300 font-black text-sm">Only 5% Commission — No Broker Margin</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/book-truck-online" className="min-h-12 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold flex items-center gap-2">Get Instant Estimate <ArrowRight size={18} /></Link>
            <a href="tel:+919331488999" className="min-h-12 px-6 py-3 rounded-xl border border-white/40 hover:bg-white/10 font-bold flex items-center gap-2"><Phone size={18} /> Call 93314 88999</a>
          </div>
        </div>
      </header>

      {/* Return Load CTA — shown on route pages (canonical starts with /routes/) */}
      {page.canonical?.startsWith("/routes/") && (
        <div className="bg-brand-700 text-white py-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-bold text-sm">
              🔄 <strong>Driver / Fleet owner?</strong> Looking for a return load (backhaul) on this route? We match you with loads going the other way — reducing empty running.
            </p>
            <Link to="/fleet-partner-registration" className="shrink-0 bg-white text-brand-700 font-black text-sm px-5 py-2 rounded-lg hover:bg-brand-50 transition-colors">
              Find Return Load →
            </Link>
          </div>
        </div>
      )}

      <main>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <DirectDriverContactBanner
            categoryName="Truck Drivers & Transporters"
            cityName={page.h1 && page.h1.includes("in ") ? page.h1.split("in ")[1] : "your area"}
          />
        </div>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.4fr_1fr] gap-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">What to know before you book</h2>
              <p className="mt-5 text-lg leading-8 text-slate-700">{page.context}</p>
              <p className="mt-5 text-slate-700 leading-7">GoMyTruck is a digital logistics marketplace. Availability, pickup time, service scope and final charges are confirmed in the booking flow and depend on the matching vehicle or workforce partner. Review the goods declaration, cancellation terms and price breakdown before confirming.</p>
            </div>
            <aside className="rounded-2xl bg-brand-50 border border-brand-200 p-6">
              <h2 className="text-xl font-black text-slate-900">Coverage highlights</h2>
              <ul className="mt-4 space-y-3">
                {page.areas.map((area) => <li key={area} className="flex gap-2 text-slate-700"><MapPin size={18} className="text-brand-700 shrink-0 mt-0.5" />{area}</li>)}
              </ul>
            </aside>
          </div>
        </section>

        <section className="py-16 bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900">Related services</h2>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {page.services.map(([label, to]) => (
                <Link key={to} to={to} className="min-h-16 bg-white border border-slate-200 rounded-xl p-5 font-bold text-slate-900 hover:border-brand-500 flex items-center justify-between">{label}<ArrowRight size={18} className="text-brand-700" /></Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900 text-center">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-center mt-2 max-w-xl mx-auto">
              Everything you need to know about pricing, vehicle assignment, and goods transport on this location.
            </p>
            <div className="mt-8 space-y-4">
              {activeFaqs.map((faq, idx) => (
                <details key={idx} className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs open:border-brand-300">
                  <summary className="font-bold cursor-pointer text-slate-900">{faq.question}</summary>
                  <p className="mt-3 text-slate-600 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
