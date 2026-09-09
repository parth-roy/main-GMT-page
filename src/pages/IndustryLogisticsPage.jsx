import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Phone, Factory, TrendingUp, Shield, FileText, CheckCircle2 } from "lucide-react"
import SEOHead from "../seo/SEOHead"

const industries = {
  "steel-durgapur": {
    canonical: "/industries/steel-logistics/durgapur",
    title: "Steel & Heavy Goods Transport in Durgapur | Industrial Logistics | GoMyTruck",
    description: "Book verified trucks for steel, iron and heavy industrial goods transport in Durgapur. FTL, flatbed, 32ft containers. 5% commission, GST invoice, no brokers.",
    h1: "Steel and Heavy Goods Transport in Durgapur",
    eyebrow: "Industrial Logistics — Steel Sector",
    industry: "Steel & Heavy Metals",
    city: "Durgapur",
    intro: "Durgapur is West Bengal's steel and heavy-industry capital, home to SAIL Durgapur Steel Plant, Durgapur Chemicals and major petrochemical clusters. GoMyTruck connects steel manufacturers, traders and EPC contractors to verified flatbed, open-body and 32ft container trucks with a transparent 5% commission — eliminating the 10–15% broker margin.",
    challenges: [
      "Oversize and overweight loads require special permits",
      "Steel coils and TMT bars require proper lashing and bedding",
      "Factory gate and highway weight restrictions must be checked",
      "GST compliance for GTA (Goods Transport Agency) must be maintained",
      "Return loads (backhaul) are critical for cost optimization",
    ],
    gtmSolutions: [
      { title: "5% Commission Only", desc: "vs 10–20% broker margins on industrial steel freight" },
      { title: "100% GST Compliant", desc: "Digital GTA invoices with RCM/FCM breakdown per shipment" },
      { title: "Verified Flatbed Operators", desc: "Pre-screened drivers with steel transport experience" },
      { title: "Return Load Matching", desc: "Backhaul finding from Asansol/Durgapur to Kolkata" },
      { title: "Enterprise SLA", desc: "Custom contracts for volume shippers with dedicated AM support" },
    ],
    vehicles: [
      { type: "Open Flatbed 32ft", use: "TMT bars, steel coils, pipes" },
      { type: "Closed Container 32ft", use: "Finished steel products, packaging" },
      { type: "14ft Eicher", use: "Medium batch steel dispatch" },
      { type: "Low-Bed Trailer", use: "Heavy machinery and transformers" },
    ],
    routes: [
      ["/routes/kolkata-to-durgapur", "Kolkata → Durgapur"],
      ["/durgapur", "Durgapur Hub"],
      ["/asansol", "Asansol Hub"],
      ["/intercity/kolkata", "Intercity FTL"],
    ],
    keyFact: "The average freight rate for a 32ft flatbed truck from Kolkata to Durgapur is ₹8,000–₹14,000 depending on load, toll and timing. GoMyTruck facilitates this at a transparent 5% platform commission.",
  },
  "jute-barrackpore": {
    canonical: "/industries/jute-logistics/barrackpore",
    title: "Jute Transport & Logistics in Barrackpore | GoMyTruck",
    description: "Book trucks for jute bale transport in Barrackpore, Naihati and North 24 Parganas jute belt. Verified drivers, 5% commission, GST invoice.",
    h1: "Jute Transport and Logistics in Barrackpore",
    eyebrow: "Industrial Logistics — Jute Sector",
    industry: "Jute & Textiles",
    city: "Barrackpore",
    intro: "Barrackpore and the North 24 Parganas jute belt represent one of West Bengal's most active raw material freight corridors. GoMyTruck connects jute mills, exporters and traders to verified trucks for bale transport, mill-to-port and intra-state distribution — at a transparent 5% commission with no broker middlemen.",
    challenges: [
      "Jute bales are bulky and require open-body or container trucks",
      "Mill-to-port routing needs customs and port documentation",
      "Seasonal demand spikes require pre-arranged fleet capacity",
      "MSME jute units often lack formal freight procurement systems",
    ],
    gtmSolutions: [
      { title: "Open Body & Container Trucks", desc: "Right-sized vehicle for jute bale dimensions" },
      { title: "Mill-to-Port Routing", desc: "Verified drivers familiar with Haldia and Kolkata Port routes" },
      { title: "5% Commission Only", desc: "No broker margin on jute transport" },
      { title: "MSME-Friendly Booking", desc: "Book via WhatsApp or app, no minimum volume" },
      { title: "GST Compliant Invoices", desc: "Digital GTA invoices for each consignment" },
    ],
    vehicles: [
      { type: "Open Body Truck (14ft/20ft)", use: "Jute bale transport" },
      { type: "Closed Container", use: "Export-ready jute products" },
      { type: "Mini Truck / 407", use: "Mill-to-local-market" },
      { type: "32ft Container", use: "Bulk export consignments" },
    ],
    routes: [
      ["/barrackpore/truck-booking", "Barrackpore Truck Booking"],
      ["/barrackpore/goods-transport", "Barrackpore Goods Transport"],
      ["/routes/kolkata-to-haldia", "Barrackpore → Haldia Port"],
      ["/intercity/kolkata", "Intercity Transport"],
    ],
    keyFact: "Barrackpore, Titagarh, Naihati and Shyamnagar form the core jute belt of West Bengal. GoMyTruck provides instant digital truck booking across this corridor at a transparent 5% platform commission.",
  },
  "fmcg-west-bengal": {
    canonical: "/industries/fmcg-logistics/west-bengal",
    title: "FMCG Logistics & Transport in West Bengal | GoMyTruck",
    description: "Book trucks for FMCG distribution across West Bengal. Sankrail Food Park, Dankuni, Kolkata. Last-mile and FTL with 5% commission, no brokers.",
    h1: "FMCG Logistics and Transport in West Bengal",
    eyebrow: "Industrial Logistics — FMCG Sector",
    industry: "FMCG & Consumer Goods",
    city: "West Bengal",
    intro: "West Bengal's FMCG distribution network spans Sankrail Food Park, Dankuni warehousing corridor, Kolkata's wholesale markets and North Bengal retail routes. GoMyTruck provides verified trucks for primary, secondary and last-mile FMCG distribution at a transparent 5% platform commission — no broker, no surge pricing.",
    challenges: [
      "FMCG requires time-definite delivery SLAs",
      "Cold chain and temperature-sensitive goods need specialized vehicles",
      "Peak season demand requires pre-arranged fleet capacity",
      "Return loads optimization is critical for logistics cost control",
    ],
    gtmSolutions: [
      { title: "5% Commission Only", desc: "Lowest take rate for FMCG distributors in Eastern India" },
      { title: "Time-Definite Options", desc: "Enterprise contracts with SLA commitment" },
      { title: "Multi-City Coverage", desc: "Dankuni, Sankrail, Kolkata, Siliguri, Guwahati" },
      { title: "Return Load Matching", desc: "Reduce per-trip cost with backhaul optimization" },
      { title: "GST Invoicing", desc: "Per-consignment digital GTA invoices" },
    ],
    vehicles: [
      { type: "Tata Ace / 407", use: "Last-mile FMCG distribution" },
      { type: "14ft Closed Container", use: "Secondary distribution" },
      { type: "32ft Container", use: "Primary FTL distribution" },
      { type: "Refrigerated Trucks", use: "Cold chain — request via Enterprise" },
    ],
    routes: [
      ["/dankuni", "Dankuni Hub"],
      ["/sankrail", "Sankrail Hub"],
      ["/kolkata/truck-booking", "Kolkata Transport"],
      ["/routes/kolkata-to-siliguri", "Kolkata → Siliguri"],
    ],
    keyFact: "Sankrail and Dankuni together form West Bengal's primary FMCG warehousing and distribution corridor. GoMyTruck provides instant truck matching for FMCG loads at a transparent 5% platform commission.",
  },
  "pharma-kolkata": {
    canonical: "/industries/pharma-logistics/kolkata",
    title: "Pharmaceutical Logistics & Transport in Kolkata | GoMyTruck",
    description: "Book verified trucks for pharma goods transport in Kolkata. GST compliant, documented chain of custody, 5% commission, no brokers.",
    h1: "Pharmaceutical Logistics and Transport in Kolkata",
    eyebrow: "Industrial Logistics — Pharma Sector",
    industry: "Pharmaceuticals",
    city: "Kolkata",
    intro: "Kolkata is a major pharmaceutical distribution hub for Eastern India, serving Bengal, Odisha, Bihar, Jharkhand and the Northeast. GoMyTruck provides verified, documented truck transport for pharmaceutical goods with GST-compliant invoicing and a transparent 5% platform commission.",
    challenges: [
      "Pharma goods require temperature control and clean, contamination-free vehicles",
      "Regulatory documentation (Form 26, drug license) must accompany consignments",
      "Chain of custody and proof of delivery are mandatory",
      "Timely delivery is critical for medicine supply chain continuity",
    ],
    gtmSolutions: [
      { title: "Verified Drivers", desc: "KYC-screened drivers with document compliance" },
      { title: "Digital POD", desc: "Proof of delivery captured in-app for every consignment" },
      { title: "GST Compliant Invoicing", desc: "GTA invoices for each pharma shipment" },
      { title: "5% Commission Only", desc: "No broker margin on pharma logistics" },
      { title: "Enterprise Contracts", desc: "Volume contracts with dedicated fleet for pharma distributors" },
    ],
    vehicles: [
      { type: "Closed Container Truck", use: "Pharma primary distribution" },
      { type: "14ft Eicher", use: "Secondary pharma distribution" },
      { type: "Mini Truck / 407", use: "Last-mile pharmacy delivery" },
      { type: "Refrigerated Trucks", use: "Cold chain biologics — Enterprise only" },
    ],
    routes: [
      ["/kolkata/truck-booking", "Kolkata Truck Booking"],
      ["/intercity/kolkata", "Intercity Distribution"],
      ["/routes/kolkata-to-patna", "Kolkata → Patna"],
      ["/enterprise", "Enterprise Pharma Contracts"],
    ],
    keyFact: "GoMyTruck provides GST-compliant goods transport for pharmaceutical companies in Kolkata with full digital proof of delivery and a transparent 5% platform commission — no broker margin.",
  },
  "agri-east-india": {
    canonical: "/industries/agri-logistics/east-india",
    title: "Agricultural & Mandi Transport in East India | GoMyTruck",
    description: "Book trucks for agricultural goods, mandi transport and agri-commodity distribution across West Bengal, Bihar and Odisha. 5% commission.",
    h1: "Agricultural and Mandi Transport in East India",
    eyebrow: "Industrial Logistics — Agriculture Sector",
    industry: "Agriculture & Mandi",
    city: "East India",
    intro: "Eastern India's agricultural freight corridor spans Burrabazar's wholesale mandi, North Bengal's tea and produce belt, Bihar's grain mandis and Odisha's agri-processing zones. GoMyTruck connects farmers, traders and aggregators to verified trucks for mandi-to-market and agri-commodity distribution at a flat 5% commission.",
    challenges: [
      "Perishable goods require time-sensitive delivery windows",
      "Seasonal volume spikes require pre-arranged fleet capacity",
      "Mandi access and entry timing restrictions in urban markets",
      "Agricultural mandis often operate on cash, requiring flexible payment options",
    ],
    gtmSolutions: [
      { title: "Instant Booking", desc: "Book a mini truck or pickup in under 2 minutes via app or WhatsApp" },
      { title: "LCV Specialist", desc: "Tata Ace and Bolero pickups for narrow mandi lanes" },
      { title: "5% Commission Only", desc: "No broker middlemen for agri-commodity freight" },
      { title: "Burrabazar Coverage", desc: "Specialist in Kolkata's largest wholesale mandi" },
      { title: "Intercity Agri Routes", desc: "Kolkata to Patna, Siliguri, Guwahati for bulk agri-loads" },
    ],
    vehicles: [
      { type: "Tata Ace / 3-Wheeler", use: "Mandi last-mile delivery" },
      { type: "Bolero Pickup", use: "Produce market distribution" },
      { type: "Mini Truck (407)", use: "Mandi-to-retailer" },
      { type: "Open Body Truck", use: "Bulk agri-commodity FTL" },
    ],
    routes: [
      ["/burrabazar", "Burrabazar Mandi"],
      ["/routes/kolkata-to-patna", "Kolkata → Patna Agri Route"],
      ["/routes/kolkata-to-siliguri", "Kolkata → Siliguri Tea Belt"],
      ["/intercity/kolkata", "Intercity Agri Transport"],
    ],
    keyFact: "Burrabazar is Kolkata's largest agri-wholesale mandi with over 5,000 traders. GoMyTruck provides instant mini truck and pickup booking for mandi-to-retail delivery at a transparent 5% commission — bypassing traditional transport syndicate margins.",
    disclaimer: "Actual vehicle availability, charges and transit times depend on booking conditions. GoMyTruck is a platform — declare cargo type, weight and access requirements accurately.",
  },
  "coal-dhanbad": {
    canonical: "/industries/coal-logistics/dhanbad",
    title: "Coal & Mining Logistics in Dhanbad — Transport Services | GoMyTruck",
    description: "Book trucks for coal, mining equipment and heavy industrial goods in Dhanbad. FTL, flatbed. 5% commission, verified drivers, GST invoice.",
    eyebrow: "Industrial Logistics — Coal & Mining",
    h1: "Coal & Mining Logistics in Dhanbad",
    industry: "Coal & Mining",
    city: "Dhanbad",
    intro: "Dhanbad is India's coal capital, home to BCCL (Bharat Coking Coal Limited), Eastern Coalfields and major mining support industries. GoMyTruck connects coal sector companies to verified FTL, flatbed and open-body trucks at a transparent 5% commission — eliminating broker margins on mining logistics.",
    challenges: ["Coal and mining goods require specialized flatbed and open-body vehicles", "Oversize and overweight loads need special permits and fitness certificates", "Weight check posts on NH-19 require compliance with load limits", "Mining zone entry restrictions vary by colliery", "Return loads (backhaul) optimization is critical for mining logistics"],
    gtmSolutions: [{title:"Open Flatbed & Tipper",desc:"Specialized vehicles for coal and mining support freight"},{title:"5% Commission Only",desc:"vs 15–25% syndicate margins on mining routes"},{title:"Weight Compliance Support",desc:"Driver briefing on checkpost requirements"},{title:"Return Load Matching",desc:"Backhaul from Asansol/Durgapur to reduce empty running"},{title:"Enterprise Contracts",desc:"Volume contracts for mining companies with dedicated fleet"}],
    vehicles: [{type:"Open Flatbed 32ft",use:"Coal and bulk mineral transport"},{type:"Tipper/Dumper",use:"Quarry and mining site"},{type:"14ft Open Body",use:"Small mining equipment"},{type:"Heavy Multi-Axle",use:"Oversize mining machinery"}],
    routes: [["/routes/kolkata-to-dhanbad", "Kolkata → Dhanbad route"],["/dhanbad", "Dhanbad hub"],["/asansol", "Asansol hub"],["/enterprise", "Enterprise logistics"]],
    keyFact: "Dhanbad produces over 30% of India's coking coal output. GoMyTruck provides verified truck booking for BCCL contractors and mining support companies at a transparent 5% platform commission — significantly below traditional broker margins of 15–25%.",
    disclaimer: "Actual vehicle availability, charges and transit times depend on booking conditions. GoMyTruck is a platform — declare cargo type, weight and access requirements accurately.",
  },
  "tea-siliguri": {
    canonical: "/industries/tea-logistics/siliguri",
    title: "Tea Transport & Cold Chain Logistics in Siliguri | GoMyTruck",
    description: "Book trucks for Darjeeling and Assam tea transport from Siliguri. Verified drivers, 5% commission, GST invoice. Mandi-to-auction and factory-to-port logistics.",
    eyebrow: "Industrial Logistics — Tea Sector",
    h1: "Tea Transport & Cold Chain Logistics in Siliguri",
    industry: "Tea & Agri-Commodity",
    city: "Siliguri",
    intro: "Siliguri is the transit hub for Darjeeling tea, Dooars tea and Assam tea consignments moving south to Kolkata auctions and north to Guwahati. GoMyTruck connects tea companies and brokers to verified closed-body and temperature-managed trucks at a transparent 5% commission.",
    challenges: ["Tea requires clean, contamination-free closed vehicles", "Auction timing at Kolkata Tea Auction is strict and time-definite", "Seasonal flush volumes create peak-season fleet demand spikes", "North Bengal terrain requires drivers familiar with hill roads", "Factory-to-auction documentation (Tea Board permits) must accompany consignments"],
    gtmSolutions: [{title:"Closed Container Trucks",desc:"Clean, contamination-free vehicles for tea transport"},{title:"Time-Definite Options",desc:"Enterprise SLA for auction timing compliance"},{title:"5% Commission Only",desc:"No broker margin on tea logistics"},{title:"Siliguri-Kolkata Route",desc:"Verified trucks for the primary tea transport corridor"},{title:"Tea Board Documentation",desc:"Driver briefing on Tea Board transport documentation"}],
    vehicles: [{type:"Closed Container 20ft/32ft",use:"Bulk tea chest and packet transport"},{type:"14ft Closed Container",use:"Smaller tea consignments"},{type:"Mini Truck",use:"Garden-to-factory short haul"},{type:"Temperature-Managed",use:"Premium orthodox tea — Enterprise only"}],
    routes: [["/routes/kolkata-to-siliguri", "Kolkata → Siliguri route"],["/siliguri", "Siliguri hub"],["/guwahati", "Guwahati hub"],["/enterprise", "Enterprise logistics"]],
    keyFact: "Over 80 million kg of tea passes through Siliguri's logistics network annually. GoMyTruck provides verified, clean vehicle booking for tea transport at a transparent 5% platform commission — with no broker margin on Siliguri-to-Kolkata auction routes.",
    disclaimer: "Actual vehicle availability, charges and transit times depend on booking conditions. GoMyTruck is a platform — declare cargo type, weight and access requirements accurately.",
  },
  "textile-kolkata": {
    canonical: "/industries/textile-logistics/kolkata",
    title: "Garment & Textile Transport in Kolkata | GoMyTruck",
    description: "Book trucks for garment, textile and apparel logistics in Kolkata. Metiabruz, Howrah garment belt. Verified drivers, 5% commission, GST invoice.",
    eyebrow: "Industrial Logistics — Textile & Garment",
    h1: "Garment & Textile Transport in Kolkata",
    industry: "Textiles & Garments",
    city: "Kolkata",
    intro: "Kolkata is one of India's largest garment manufacturing hubs, with the Metiabruz-Howrah belt, Garden Reach and Central Kolkata's wholesale cloth markets producing and distributing apparel nationally. GoMyTruck connects garment manufacturers and traders to verified closed-body trucks at a transparent 5% commission.",
    challenges: ["Garments require clean, dry, closed vehicles to prevent damage", "Narrow lanes in Metiabruz require LCVs and mini trucks", "Peak season (festive pre-Durga Puja, pre-Eid) demand spikes", "Export garment consignments need customs documentation", "Multiple pickup points within the garment belt require consolidation"],
    gtmSolutions: [{title:"Closed Container LCVs",desc:"Clean vehicles for garment and apparel transport"},{title:"Metiabruz Belt Coverage",desc:"LCV and mini truck specialists for narrow lanes"},{title:"5% Commission Only",desc:"No broker margin on garment logistics"},{title:"Export Documentation Support",desc:"Enterprise accounts with customs coordination"},{title:"Peak Season Pre-booking",desc:"Reserve fleet capacity before festive surges"}],
    vehicles: [{type:"Mini Truck (407)",use:"Metiabruz belt garment consolidation"},{type:"14ft Closed Container",use:"Wholesale cloth market distribution"},{type:"32ft Closed Container",use:"Export consignment to port"},{type:"Tata Ace",use:"Small batch garment delivery"}],
    routes: [["/kolkata/truck-booking", "Kolkata truck booking"],["/howrah/goods-transport", "Howrah goods transport"],["/routes/kolkata-to-haldia", "Kolkata → Haldia Port"],["/enterprise", "Enterprise logistics"]],
    keyFact: "Metiabruz and Garden Reach together produce over 40% of Kolkata's garment output. GoMyTruck provides instant mini truck and closed container booking for the garment belt at a transparent 5% commission — bypassing the traditional 12–18% broker margin.",
    disclaimer: "Actual vehicle availability, charges and transit times depend on booking conditions. GoMyTruck is a platform — declare cargo type, weight and access requirements accurately.",
  },
  "ecommerce-kolkata": {
    canonical: "/industries/ecommerce-logistics/kolkata",
    title: "E-Commerce Logistics & Last-Mile Delivery in Kolkata | GoMyTruck",
    description: "Book trucks for e-commerce last-mile delivery, bulk dispatch and cross-dock logistics in Kolkata. Verified drivers, 5% commission, digital POD.",
    eyebrow: "Industrial Logistics — E-Commerce",
    h1: "E-Commerce Logistics & Last-Mile Delivery in Kolkata",
    industry: "E-Commerce & D2C",
    city: "Kolkata",
    intro: "Kolkata is Eastern India's largest e-commerce distribution hub, with major fulfillment centers in New Town, Rajarhat and Dankuni. GoMyTruck provides verified trucks for first-mile bulk pickup, cross-dock and last-mile B2B delivery at a transparent 5% commission.",
    challenges: ["E-commerce requires strict time-window deliveries", "Digital Proof of Delivery (POD) is mandatory for reconciliation", "High-volume daily dispatch requires pre-arranged fleet capacity", "Returns logistics (reverse logistics) adds complexity", "Weekend and holiday delivery requires driver availability guarantee"],
    gtmSolutions: [{title:"Digital POD",desc:"Proof of delivery captured in-app for every consignment"},{title:"Pre-arranged Fleet",desc:"Enterprise contracts with daily capacity commitment"},{title:"5% Commission Only",desc:"No broker margin on e-commerce logistics"},{title:"Dankuni Fulfilment Routes",desc:"Verified trucks from Dankuni to all Kolkata zones"},{title:"Returns Support",desc:"Reverse logistics handled via Enterprise accounts"}],
    vehicles: [{type:"Tata Ace",use:"Last-mile B2B delivery"},{type:"Mini Truck (407)",use:"Bulk first-mile pickup"},{type:"14ft Container",use:"Fulfilment center dispatch"},{type:"32ft Container",use:"Cross-dock bulk FTL"}],
    routes: [["/dankuni", "Dankuni hub"],["/kolkata/truck-booking", "Kolkata truck booking"],["/new-town", "New Town hub"],["/enterprise", "Enterprise logistics"]],
    keyFact: "Kolkata's e-commerce market is growing at 18% annually. GoMyTruck provides digital-first, POD-enabled truck booking for e-commerce companies at a transparent 5% commission — with no broker margin and full GST compliance.",
    disclaimer: "Actual vehicle availability, charges and transit times depend on booking conditions. GoMyTruck is a platform — declare cargo type, weight and access requirements accurately.",
  },
  "construction-westbengal": {
    canonical: "/industries/construction-logistics/west-bengal",
    title: "Construction Material Transport in West Bengal | GoMyTruck",
    description: "Book trucks for sand, brick, cement, TMT and construction material transport in West Bengal. Verified drivers, 5% commission, GST invoice.",
    eyebrow: "Industrial Logistics — Construction Sector",
    h1: "Construction Material Transport in West Bengal",
    industry: "Construction & Building Materials",
    city: "West Bengal",
    intro: "West Bengal's construction sector drives massive freight demand for sand, brick, cement, TMT bars, steel and tiles. GoMyTruck connects contractors, developers and construction companies to verified trucks at a transparent 5% commission — no sand mafia broker margin.",
    challenges: ["Sand and stone quarry transport requires valid mining permits and quality certificates", "Brick kilns have seasonal production and irregular dispatch schedules", "TMT and steel require proper lashing and flatbed vehicles", "Construction site access is often on unmade roads", "Multiple small suppliers (sand, brick, cement) require fleet coordination"],
    gtmSolutions: [{title:"Quarry-to-Site Coverage",desc:"Verified trucks from quarries and brick kilns directly to construction sites"},{title:"Flatbed for TMT & Steel",desc:"Proper lashing and open flatbed for structural steel"},{title:"5% Commission Only",desc:"vs 20–30% transport syndicate margins"},{title:"GST Compliance",desc:"Tax-compliant invoices even for sand and brick transport"},{title:"Multi-Material Coordination",desc:"Enterprise accounts for coordinated construction logistics"}],
    vehicles: [{type:"Tipper/Dumper",use:"Sand, gravel and stone transport"},{type:"Open Flatbed 32ft",use:"TMT bars and structural steel"},{type:"14ft Open Body",use:"Brick and tile delivery"},{type:"Mini Truck",use:"Small batch construction material"}],
    routes: [["/book-truck-online", "Book a truck"],["/durgapur", "Durgapur hub (steel)"],["/uluberia", "Uluberia hub"],["/enterprise", "Enterprise logistics"]],
    keyFact: "West Bengal's construction sector accounts for over ₹50,000 crore in annual freight movement. GoMyTruck provides instant verified truck booking for construction material transport at a transparent 5% commission — significantly below traditional 20–30% syndicate margins in the sand and brick transport sector.",
    disclaimer: "Actual vehicle availability, charges and transit times depend on booking conditions. GoMyTruck is a platform — declare cargo type, weight and access requirements accurately.",
  },
}

export default function IndustryLogisticsPage({ industryKey }) {
  const ind = industries[industryKey]
  useEffect(() => { window.scrollTo(0, 0) }, [industryKey])

  if (!ind) return null

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: ind.h1,
      url: `https://gomytruck.com${ind.canonical}`,
      provider: { "@id": "https://gomytruck.com/#organization" },
      description: ind.description,
      serviceType: `${ind.industry} Logistics`,
      areaServed: ind.city,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gomytruck.com/" },
        { "@type": "ListItem", position: 2, name: "Industries", item: "https://gomytruck.com/industries" },
        { "@type": "ListItem", position: 3, name: ind.h1, item: `https://gomytruck.com${ind.canonical}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How does GoMyTruck help ${ind.industry} companies in ${ind.city}?`,
          acceptedAnswer: { "@type": "Answer", text: `GoMyTruck is a digital freight marketplace that connects ${ind.industry} shippers in ${ind.city} with verified truck operators at a transparent 5% platform commission. There are no broker margins, no surge pricing and every transaction comes with a GST-compliant digital invoice.` }
        },
        {
          "@type": "Question",
          name: "What is GoMyTruck's commission?",
          acceptedAnswer: { "@type": "Answer", text: "GoMyTruck charges only 5% platform commission. Total Freight Cost = Driver Payout (95%) + GoMyTruck Commission (5%) + Applicable GST/Tolls. There are no hidden fees or broker margins." }
        }
      ]
    }
  ]

  return (
    <div className="bg-white min-h-screen pt-20">
      <SEOHead title={ind.title} description={ind.description} canonical={ind.canonical} jsonLd={jsonLd} />

      <nav aria-label="Breadcrumb" className="border-b border-slate-200">
        <ol className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 text-sm text-slate-500 flex-wrap">
          <li><Link to="/" className="hover:text-brand-700">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/goods-transport-services" className="hover:text-brand-700">Industries</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-slate-900">{ind.h1}</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="bg-slate-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-300 font-bold uppercase tracking-widest text-sm mb-4">{ind.eyebrow}</p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl">{ind.h1}</h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-3xl">{ind.intro}</p>
          <div className="mt-5 inline-flex items-center gap-2 bg-brand-700/30 border border-brand-500/40 rounded-full px-4 py-1.5">
            <span className="text-brand-300 font-black text-sm">Only 5% Commission — vs 10–20% broker margins</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book-truck-online" className="min-h-12 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold flex items-center gap-2">
              Get a Freight Quote <ArrowRight size={18} />
            </Link>
            <Link to="/enterprise" className="min-h-12 px-6 py-3 rounded-xl border border-white/40 hover:bg-white/10 font-bold flex items-center gap-2">
              Enterprise Contract
            </Link>
            <Link to="/direct-driver-contact?openModal=true" className="min-h-12 px-6 py-3 rounded-xl border border-white/40 hover:bg-white/10 font-bold flex items-center gap-2">
              <Phone size={18} /> Talk to Drivers
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Key Fact — AI-optimized definitive phrasing */}
        <section className="py-10 bg-brand-50 border-b border-brand-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-slate-700 font-semibold text-lg leading-relaxed">
              <span className="text-brand-700 font-black">Key fact: </span>{ind.keyFact}
            </p>
          </div>
        </section>

        {/* Challenges & Solutions */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                <Factory size={24} className="text-brand-600" /> Sector Challenges
              </h2>
              <ul className="mt-6 space-y-3">
                {ind.challenges.map((c) => (
                  <li key={c} className="flex gap-2 text-slate-700 py-2 border-b border-slate-100">
                    <span className="text-brand-600 shrink-0 mt-0.5">→</span> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                <TrendingUp size={24} className="text-brand-600" /> GoMyTruck Solutions
              </h2>
              <div className="mt-6 space-y-4">
                {ind.gtmSolutions.map(({ title, desc }) => (
                  <div key={title} className="flex gap-3 bg-brand-50 border border-brand-100 rounded-xl p-4">
                    <CheckCircle2 size={20} className="text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-slate-900 text-sm">{title}</p>
                      <p className="text-slate-600 text-sm mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle Types */}
        <section className="py-14 bg-slate-50 border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900">Available vehicle types</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {ind.vehicles.map(({ type, use }) => (
                <div key={type} className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="font-black text-slate-900">{type}</p>
                  <p className="text-slate-500 text-sm mt-1">{use}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-14 bg-slate-950 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-black">Transparent Freight Pricing</h2>
            <p className="mt-3 text-slate-300 max-w-xl mx-auto">
              Total Cost = Driver Payout (95%) + GoMyTruck Commission (5%) + Applicable GST/Tolls
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {[
                { label: "Commission", value: "Only 5%", sub: "vs brokers charging 10–20%" },
                { label: "GST Invoicing", value: "100%", sub: "Compliant GTA digital invoices" },
                { label: "Surge Pricing", value: "Never", sub: "Fixed transparent rates" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                  <p className="text-brand-400 text-xs font-bold uppercase tracking-widest">{label}</p>
                  <p className="text-white font-black text-2xl mt-1">{value}</p>
                  <p className="text-slate-500 text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Routes */}
        <section className="py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-slate-900">Key routes & hubs</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {ind.routes.map(([to, label]) => (
                <Link key={to} to={to} className="min-h-14 bg-white border border-slate-200 rounded-xl p-5 font-bold text-slate-900 hover:border-brand-500 flex items-center justify-between transition-colors">
                  {label}<ArrowRight size={18} className="text-brand-700" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
