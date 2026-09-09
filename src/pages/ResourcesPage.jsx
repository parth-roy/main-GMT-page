import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Phone, BookOpen, FileText, CheckCircle2, AlertTriangle, Info, ExternalLink } from "lucide-react"
import SEOHead from "../seo/SEOHead"

const resources = {
  "gst-for-gta": {
    canonical: "/resources/gst-for-goods-transport-agency",
    title: "GST for Goods Transport Agency (GTA) — Complete Guide 2025 | GoMyTruck",
    description: "Complete guide to GST for Goods Transport Agency (GTA) in India 2025. RCM vs FCM, 5% vs 12% rates, GTA definition, registration, invoice format, ITC eligibility.",
    eyebrow: "GST Compliance Guide",
    h1: "GST for Goods Transport Agency (GTA) — Complete Guide 2025",
    intro: "This guide explains GST rules for Goods Transport Agencies (GTAs) operating in India, including rate options, Reverse Charge Mechanism (RCM), invoice requirements and ITC eligibility for 2025.",
    sections: [
      {
        heading: "What is a Goods Transport Agency (GTA) under GST?",
        content: "A Goods Transport Agency is defined under GST as any person who provides a service of transport of goods by road and issues a consignment note. The consignment note is the critical document that distinguishes a GTA from a simple truck operator. Under GST, GTA services are treated distinctly from pure freight transport."
      },
      {
        heading: "GST Rate Options for GTAs in 2025",
        content: "A GTA has two rate options: (1) 5% GST without Input Tax Credit (ITC) — this is the most common choice for small GTAs, where the recipient pays under RCM. (2) 12% GST with ITC — the GTA charges 12% GST and can claim input tax credits on fuel, vehicle hire and other inputs. The choice must be declared at the start of each financial year and cannot be changed mid-year."
      },
      {
        heading: "Reverse Charge Mechanism (RCM) for GTA",
        content: "Under RCM, the recipient of GTA services (not the GTA) is responsible for paying GST. RCM applies when the GTA chooses the 5% rate option and the recipient is a GST-registered business. The recipient must self-invoice, pay GST under RCM, and can claim ITC on it. Unregistered recipients and individual consumers do not attract RCM."
      },
      {
        heading: "GST Registration Requirement for GTAs",
        content: "A GTA must register under GST if their annual aggregate turnover exceeds ₹20 lakhs (₹10 lakhs in special category states). Even below this threshold, voluntary registration is advisable to issue proper consignment notes and build trust with large shippers. GTAs operating entirely under RCM (where the recipient pays) may be exempt from mandatory registration in some cases — consult a CA for your specific situation."
      },
      {
        heading: "Consignment Note — Required for GTA Status",
        content: "The consignment note is the legal document that triggers GTA status under GST. It must include: name and address of consignor and consignee, registration number of vehicle, origin and destination, road registration number (vehicle permit), and gross weight of consignment. Without a proper consignment note, the transaction may be treated as a pure freight service, not a GTA service."
      },
      {
        heading: "GST Exemptions for GTA",
        content: "GTA services are exempt from GST when provided to: (a) agriculturalist for agriculture produce transport, (b) government department, (c) milk, salt, newspaper, organic manure transport — under specific conditions. The threshold exemption of ₹750 per carriage and ₹1,500 per consignment for small consignments also applies."
      }
    ],
    keyFact: "GoMyTruck is a Motor Vehicle Aggregator (not a GTA) operating under the Motor Vehicles Aggregator Guidelines 2025. GoMyTruck charges a 5% platform commission. GST on the freight amount is collected separately as per applicable GTA rules for the partner operator. Each booking includes a GST-compliant digital invoice.",
    disclaimer: "This guide is for general informational purposes only and does not constitute tax or legal advice. GST rules change frequently — consult a qualified Chartered Accountant for advice specific to your business situation.",
    relatedLinks: [["E-Way Bill Guide", "/resources/e-way-bill-guide"], ["GST RCM for Transporters", "/resources/gst-rcm-transporters"], ["FTL vs PTL Guide", "/resources/ftl-vs-ptl"], ["Book a Truck", "/book-truck-online"]]
  },
  "e-way-bill-guide": {
    canonical: "/resources/e-way-bill-guide",
    title: "E-Way Bill Generation Guide for Goods Transport — Complete 2025 | GoMyTruck",
    description: "Complete guide to E-Way Bill generation for goods transport in India 2025. Who generates, threshold, validity, PART-A and PART-B, states, cancellation rules.",
    eyebrow: "E-Way Bill Compliance Guide",
    h1: "E-Way Bill Generation Guide for Goods Transport — 2025",
    intro: "E-Way Bill is mandatory for movement of goods worth more than ₹50,000 (in most states) in India. This guide explains who generates it, the threshold, validity periods, cancellation rules and state-specific variations for 2025.",
    sections: [
      {
        heading: "What is an E-Way Bill?",
        content: "An E-Way Bill (Electronic Way Bill) is a document required for the movement of goods worth more than ₹50,000 within India. It is generated on the GST E-Way Bill portal (ewaybillgst.gov.in) and must accompany the consignment. It contains details of the goods, supplier, recipient and vehicle."
      },
      {
        heading: "E-Way Bill Threshold in 2025",
        content: "The threshold for E-Way Bill is ₹50,000 per consignment at the national level. Several states have reduced thresholds for intra-state movement — e.g., Odisha requires E-Way Bills for intra-state movement above ₹25,000. Check the GST portal for state-specific thresholds before dispatching."
      },
      {
        heading: "Who Generates the E-Way Bill?",
        content: "The E-Way Bill can be generated by: (1) Supplier — for outward supply, (2) Recipient — for inward supply or imports, (3) Transporter (GTA) — if the supplier or recipient has not generated it and the value exceeds the threshold. The transporter must fill PART-B with vehicle details before goods can be transported."
      },
      {
        heading: "PART-A and PART-B Explained",
        content: "PART-A contains: GSTIN of supplier and recipient, place of dispatch and delivery, HSN code of goods, invoice value, reason for transport. PART-B contains: vehicle number, transporter ID. PART-B can be updated by the transporter each time the vehicle changes. Without PART-B, the E-Way Bill is incomplete and the consignment can be detained."
      },
      {
        heading: "E-Way Bill Validity",
        content: "Validity is calculated from the date of generation: Up to 100 km → 1 day. For every 100 km thereafter → 1 additional day. Multimodal transport (including ship/rail legs) gets double validity. If the goods cannot be moved within the validity period due to exceptional circumstances (breakdown, natural disaster), an extension can be applied for on the portal."
      },
      {
        heading: "E-Way Bill Cancellation",
        content: "An E-Way Bill can be cancelled within 24 hours of generation if the goods are not transported or if details entered are incorrect. Once a vehicle scan/verification is done by tax authorities, cancellation is not permitted. Use the GST portal or the GoMyTruck app's built-in E-Way Bill integration for management."
      }
    ],
    keyFact: "GoMyTruck's enterprise logistics solution includes E-Way Bill integration support for business accounts. The driver app displays E-Way Bill status for each consignment. Shippers are responsible for generating and sharing valid E-Way Bills with the driver before dispatch.",
    disclaimer: "E-Way Bill rules are updated by the GST Council periodically. Always verify current thresholds and validity periods on the official GST E-Way Bill portal (ewaybillgst.gov.in) before dispatch.",
    relatedLinks: [["GST for GTA Guide", "/resources/gst-for-goods-transport-agency"], ["GST RCM Guide", "/resources/gst-rcm-transporters"], ["Book a Truck", "/book-truck-online"], ["Enterprise Logistics", "/enterprise"]]
  },
  "gst-rcm-transporters": {
    canonical: "/resources/gst-rcm-transporters",
    title: "GST Reverse Charge Mechanism for Transporters — Guide 2025 | GoMyTruck",
    description: "Complete guide to GST Reverse Charge Mechanism (RCM) for goods transport in India 2025. Who pays, self-invoice, ITC claims, compliance steps for shippers and GTAs.",
    eyebrow: "GST RCM Compliance Guide",
    h1: "GST Reverse Charge Mechanism for Transporters — Guide 2025",
    intro: "Under the GST Reverse Charge Mechanism (RCM) for goods transport, the recipient of the service (not the transporter) pays GST directly to the government. This guide explains how RCM works for GTA services, who is liable, how to self-invoice, and how to claim Input Tax Credit.",
    sections: [
      {
        heading: "When Does RCM Apply for GTA Services?",
        content: "RCM applies to GTA services when: (a) The GTA is registered under GST and has opted for the 5% rate, OR (b) The GTA is unregistered. The recipient of GTA services must pay GST under RCM if they are one of these notified categories: factory, society, cooperative society, registered person, body corporate, partnership firm, or government entity."
      },
      {
        heading: "How Much GST to Pay Under RCM?",
        content: "Under RCM for GTA services: 5% GST (2.5% CGST + 2.5% SGST for intra-state, or 5% IGST for inter-state) where the GTA has opted for the 5% rate. 12% GST applies if the GTA has opted for Forward Charge with ITC. Individual consumers and small agriculturalists receiving GTA services are exempt from RCM."
      },
      {
        heading: "Self-Invoice — Required Under RCM",
        content: "When you pay GST under RCM as a recipient, you must issue a self-invoice. A self-invoice is a document you create for yourself as the recipient, containing: supplier (GTA) details, your GSTIN as recipient, invoice date, description of service, value, and RCM GST amount. This self-invoice is your document to claim ITC."
      },
      {
        heading: "Claiming ITC on RCM Payments",
        content: "You can claim Input Tax Credit on GST paid under RCM for GTA services, subject to conditions: (a) The service is used for business purposes, (b) You have filed the RCM return (GSTR-3B), (c) The ITC is not restricted under Section 17(5). ITC can be claimed in the same period in which the RCM is paid, not earlier."
      },
      {
        heading: "RCM Compliance Steps for Businesses Using Trucks",
        content: "Step 1: Verify if your GTA is registered and which rate option they have chosen. Step 2: Obtain the consignment note from the GTA. Step 3: Calculate the RCM GST amount. Step 4: Issue a self-invoice. Step 5: Pay RCM GST in GSTR-3B by the 20th of the following month. Step 6: Claim ITC in the same period's GSTR-3B."
      }
    ],
    keyFact: "GoMyTruck provides GST-compliant digital invoices for every booking. Enterprise accounts receive monthly consolidated GST statements for RCM compliance. Contact enterprise@gomytruck.com for business account setup.",
    disclaimer: "RCM rules for GTA services are complex and subject to change. Consult a qualified Chartered Accountant for advice specific to your business. This guide is for general informational purposes only.",
    relatedLinks: [["GST for GTA Guide", "/resources/gst-for-goods-transport-agency"], ["E-Way Bill Guide", "/resources/e-way-bill-guide"], ["Enterprise Logistics", "/enterprise"], ["Book a Truck", "/book-truck-online"]]
  },
  "ftl-vs-ptl": {
    canonical: "/resources/ftl-vs-ptl",
    title: "FTL vs PTL Freight — What's Right for Your Business? | GoMyTruck",
    description: "FTL vs PTL comparison for Indian shippers 2025. Full Truck Load vs Part Load — cost, transit time, security, when to choose each for Eastern India logistics.",
    eyebrow: "Freight Guide for Shippers",
    h1: "FTL vs PTL Freight — What's Right for Your Business?",
    intro: "Full Truck Load (FTL) and Part Truck Load (PTL) are the two primary freight modes in Indian logistics. This guide explains the cost, transit time, cargo security and use-case differences for shippers in Eastern India.",
    sections: [
      {
        heading: "What is FTL (Full Truck Load)?",
        content: "In FTL, you book the entire truck exclusively for your consignment. The truck goes directly from pickup to your drop point without intermediate stops. FTL is faster, more secure (no co-loading) and ideal when your load fills 50% or more of the vehicle capacity. The cost is higher per kg but lower per shipment for large volumes."
      },
      {
        heading: "What is PTL (Part Truck Load)?",
        content: "In PTL (also called LTL — Less-than-Truck Load), your cargo shares the truck with other shippers' goods. The truck may make multiple pickups and drops. PTL is cost-effective for smaller loads but has longer transit times, more handling touches and slightly higher damage risk due to co-loading. Minimum chargeable weight and volumetric weight rules apply."
      },
      {
        heading: "FTL vs PTL — Cost Comparison",
        content: "FTL: You pay for the entire truck regardless of how much you fill. PTL: You pay only for the space your cargo uses (per kg or per CBM). For loads above 3–4 tonnes, FTL is often more economical than PTL once you factor in PTL handling fees, delays and damage risk. For loads below 500 kg–1 ton, PTL is usually more cost-effective."
      },
      {
        heading: "Transit Time Comparison",
        content: "FTL: Point-to-point, no intermediate stops. Kolkata to Guwahati FTL is typically 24–36 hours. PTL: Multiple pickup/delivery stops add 24–72 hours vs equivalent FTL times. Time-sensitive loads (pharma, perishables, e-commerce) should always prefer FTL."
      },
      {
        heading: "When to Choose FTL",
        content: "Choose FTL when: (a) Your load is 50%+ of truck capacity, (b) You need dedicated vehicle and direct routing, (c) Cargo is high-value, fragile or temperature-sensitive, (d) You have a hard delivery deadline, (e) Cargo requires specialized handling (steel coils, machinery)."
      },
      {
        heading: "When to Choose PTL",
        content: "Choose PTL when: (a) Load is under 500 kg to 2 tonnes, (b) Transit time flexibility allows 1–3 extra days, (c) Regular small-batch shipments on established lanes, (d) Budget is the primary constraint."
      }
    ],
    keyFact: "GoMyTruck supports both FTL and PTL bookings. Get an instant route estimate that shows you the best vehicle class for your declared cargo weight and dimensions — the booking flow automatically recommends FTL or PTL based on your load size.",
    disclaimer: "Actual freight rates depend on route, vehicle availability, fuel prices and market conditions at the time of booking. Estimates shown in the GoMyTruck booking flow reflect live conditions.",
    relatedLinks: [["Book a Truck", "/book-truck-online"], ["32ft Container Truck", "/kolkata/32ft-container-truck"], ["Intercity Transport", "/intercity/kolkata"], ["Enterprise Logistics", "/enterprise"]]
  },
  "mv-aggregator-guidelines": {
    canonical: "/resources/motor-vehicle-aggregator-guidelines-2025",
    title: "Motor Vehicle Aggregator Guidelines 2025 — What Transporters Must Know | GoMyTruck",
    description: "Complete guide to Motor Vehicle Aggregator Guidelines 2025 India. Licensing, driver conditions, surge pricing rules, cancellation policy, grievance redressal for freight aggregators.",
    eyebrow: "Regulatory Compliance Guide",
    h1: "Motor Vehicle Aggregator Guidelines 2025 — What Transporters & Drivers Must Know",
    intro: "The Motor Vehicle Aggregator Guidelines 2025 (updated from the 2020 framework) govern digital freight and passenger aggregators in India, including platforms like GoMyTruck. This guide explains the key requirements for drivers, fleet owners and shippers using digital freight platforms.",
    sections: [
      {
        heading: "What is a Motor Vehicle Aggregator?",
        content: "Under the Motor Vehicles Act, 1988 (as amended by the Motor Vehicles Amendment Act, 2019), a Motor Vehicle Aggregator is a digital intermediary or marketplace that can be used by a passenger or goods customer to connect with a driver of a motor vehicle. This includes apps and web platforms that connect shippers with trucks — like GoMyTruck."
      },
      {
        heading: "Aggregator Licensing Requirements",
        content: "Under the 2020/2025 Guidelines, aggregators must: (a) Obtain a State-level Aggregator License from the State Transport Department, (b) Maintain minimum technology standards including GPS tracking, digital trip records and driver verification, (c) Comply with data protection and privacy standards for customer data, (d) Have a grievance redressal mechanism."
      },
      {
        heading: "Driver Requirements Under the Guidelines",
        content: "Drivers operating on an aggregator platform must: (a) Hold a valid Commercial Driving License (CDL) with LMV-T, HMV or appropriate endorsement, (b) Complete a background verification (police clearance), (c) Have a valid vehicle fitness certificate, (d) Not drive more than the permitted hours in a 24-hour cycle (road fatigue regulations apply)."
      },
      {
        heading: "Surge Pricing Rules",
        content: "Under the 2020 Aggregator Guidelines, surge pricing is allowed but must be capped and disclosed to the consumer BEFORE the ride/trip is confirmed. GoMyTruck does not use surge pricing — freight estimates are transparent and fixed based on route parameters. This is one of GoMyTruck's key compliance advantages."
      },
      {
        heading: "Cancellation Policy Requirements",
        content: "Aggregators must have a published cancellation policy. Cancellation fees must be reasonable, disclosed upfront and not excessive. GoMyTruck's cancellation policy is published on the platform and is available on the Cancellation & Refund Policy page."
      },
      {
        heading: "Grievance Redressal",
        content: "Aggregators must designate a Grievance Officer and publish contact details. Complaints must be acknowledged within 24 hours and resolved within 30 days. GoMyTruck's support team is available via in-app support, direct contact desk and email."
      }
    ],
    keyFact: "GoMyTruck operates as a Motor Vehicle Aggregator (not a GTA) under the Motor Vehicles Aggregator Guidelines. GoMyTruck charges a 5% platform commission with zero surge pricing and provides a GST-compliant digital invoice for every transaction.",
    disclaimer: "Aggregator Guidelines vary by state. The 2020 Model Guidelines issued by the Ministry of Road Transport & Highways serve as the base framework, but individual states may issue modified versions. Verify the applicable guidelines in your state with a transport law specialist.",
    relatedLinks: [["GST for GTA Guide", "/resources/gst-for-goods-transport-agency"], ["Driver Partner", "/driver-partner"], ["Fleet Partner Registration", "/fleet-partner-registration"], ["GoMyTruck Verified", "/gomytruck-verified"]]
  },
  "hsn-codes-for-logistics": {
    canonical: "/resources/hsn-codes-for-logistics",
    title: "HSN & SAC Codes for Logistics and Transport 2025 | GoMyTruck",
    description: "Complete list of HSN and SAC codes for logistics, goods transport agency (GTA), courier, and cargo services in India for 2025 GST compliance.",
    eyebrow: "GST Compliance Guide",
    h1: "HSN & SAC Codes for Logistics and Transport 2025",
    intro: "Understanding the correct Harmonized System of Nomenclature (HSN) and Service Accounting Codes (SAC) is critical for accurate GST invoicing and E-Way Bill generation in the Indian logistics sector.",
    sections: [
      {
        heading: "What are SAC Codes?",
        content: "Under GST, services are classified using Service Accounting Codes (SAC). For transport and logistics, correct SAC classification determines whether your service attracts 5%, 12%, or 18% GST, and whether the Reverse Charge Mechanism (RCM) applies."
      },
      {
        heading: "Important SAC Codes for Transport",
        content: "SAC 996511: Road transport services of Goods including letters, parcels, live animals, household & office furniture, containers etc by Goods Transport Agencies (GTA). SAC 996512: Road transport services of Goods by motor vehicles (other than GTA). SAC 996513: Road transport services of Goods by man-drawn vehicles. SAC 996519: Other road transport services of goods n.e.c."
      },
      {
        heading: "SAC Codes for Courier and Cargo Handling",
        content: "SAC 996811: Postal services. SAC 996812: Courier services. SAC 996813: Local delivery services. For cargo handling: SAC 996711: Cargo handling services provided for freight in land transport."
      }
    ],
    keyFact: "GoMyTruck charges a transparent 5% platform commission — vs the standard 10–20% broker margins. As a trusted Motor Vehicle Aggregator, we provide GST-compliant digital invoices for every transaction, complete with correct SAC codes.",
    disclaimer: "Tax codes and regulations are subject to change. Please consult with a qualified tax professional or Chartered Accountant to verify the correct SAC/HSN codes for your specific transactions.",
    relatedLinks: [["GST for GTA Guide", "/resources/gst-for-goods-transport-agency"], ["GST RCM Guide", "/resources/gst-rcm-transporters"], ["Book a Truck", "/book-truck-online"]]
  },
  "section-9-5-vs-52-gta": {
    canonical: "/resources/section-9-5-vs-52-gta",
    title: "GST Section 9(5) vs Section 52 for Logistics Platforms | GoMyTruck",
    description: "Understand the difference between GST Section 9(5) and Section 52 TCS for digital freight aggregators, GTAs, and transport platforms in India.",
    eyebrow: "Regulatory Compliance Guide",
    h1: "GST Section 9(5) vs Section 52 for Logistics Platforms",
    intro: "For digital aggregators in the logistics space, GST compliance hinges on whether the platform operates under Section 9(5) or Section 52 of the CGST Act. Here is what transporters and shippers need to know.",
    sections: [
      {
        heading: "Section 52: Tax Collected at Source (TCS)",
        content: "Under Section 52, an Electronic Commerce Operator (ECO) is required to collect a small percentage (TCS) on the net value of taxable supplies made through it by other suppliers. The platform facilitates the transaction but does not assume the tax liability of the underlying service."
      },
      {
        heading: "Section 9(5): E-Commerce Operator as the Supplier",
        content: "Section 9(5) notifies specific services where the ECO is liable to pay GST as if they were the actual supplier. For passenger transport (like cabs), Section 9(5) clearly applies. For goods transport, the application depends on the exact nature of the platform's contract and whether it functions as a GTA."
      },
      {
        heading: "Impact on GTAs and Fleet Owners",
        content: "If a platform falls under Section 52, fleet owners (the actual suppliers) handle their own GST compliance, subject to the TCS collected by the platform. If the platform operates under Section 9(5), the platform itself assumes the GST liability, removing that compliance burden from the individual transporter."
      }
    ],
    keyFact: "GoMyTruck charges a transparent 5% platform commission — vs the standard 10–20% broker margins. As a trusted Motor Vehicle Aggregator, we ensure 100% compliance with all GST ECO provisions to protect our shippers and fleet owners.",
    disclaimer: "GST laws governing e-commerce and aggregators are complex and continually evolving. This summary does not constitute legal or tax advice. Consult a Chartered Accountant for specific guidance.",
    relatedLinks: [["Motor Vehicle Aggregator Guidelines", "/resources/motor-vehicle-aggregator-guidelines-2025"], ["GST for GTA Guide", "/resources/gst-for-goods-transport-agency"], ["Book a Truck", "/book-truck-online"]]
  }
}

export default function ResourcesPage({ resourceKey }) {
  const res = resources[resourceKey]
  useEffect(() => { window.scrollTo(0, 0) }, [resourceKey])

  if (!res) return null

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gomytruck.com/" },
        { "@type": "ListItem", position: 2, name: "Resources", item: "https://gomytruck.com/resources" },
        { "@type": "ListItem", position: 3, name: res.title, item: `https://gomytruck.com${res.canonical}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: res.sections.map((sec) => ({
        "@type": "Question",
        name: sec.heading,
        acceptedAnswer: { "@type": "Answer", text: sec.content }
      }))
    }
  ]

  return (
    <div className="bg-white min-h-screen pt-20">
      <SEOHead title={res.title} description={res.description} canonical={res.canonical} jsonLd={jsonLd} />

      <nav aria-label="Breadcrumb" className="border-b border-slate-200">
        <ol className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 text-sm text-slate-500 flex-wrap">
          <li><Link to="/" className="hover:text-brand-700">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/resources" className="hover:text-brand-700">Resources</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-slate-900">{res.title}</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="bg-slate-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-300 font-bold uppercase tracking-widest text-sm mb-4">{res.eyebrow}</p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl">{res.h1}</h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-3xl">{res.intro}</p>
          <div className="mt-5 inline-flex items-center gap-2 bg-brand-700/30 border border-brand-500/40 rounded-full px-4 py-1.5">
            <span className="text-brand-300 font-black text-sm">Only 5% Commission — vs 10–20% broker margins</span>
          </div>
        </div>
      </header>

      <main>
        {/* Key Fact */}
        <section className="py-10 bg-brand-50 border-b border-brand-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4 items-start">
            <Info size={28} className="text-brand-600 mt-1 shrink-0" />
            <p className="text-slate-700 font-semibold text-lg leading-relaxed">
              <span className="text-brand-700 font-black">Key fact: </span>{res.keyFact}
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {res.sections.map((sec, idx) => (
              <div key={idx}>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2 mb-4">
                  <FileText size={24} className="text-brand-600 shrink-0" />
                  {sec.heading}
                </h2>
                <p className="text-slate-700 text-lg leading-relaxed">{sec.content}</p>
              </div>
            ))}

            {/* Disclaimer */}
            <div className="mt-12 bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-3 text-sm text-slate-500 items-start">
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p>{res.disclaimer}</p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-14 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Related Resources</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {res.relatedLinks.map(([label, to], idx) => (
                <Link key={idx} to={to} className="bg-white border border-slate-200 rounded-xl p-5 font-bold text-slate-900 hover:border-brand-500 flex items-center justify-between transition-colors">
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
