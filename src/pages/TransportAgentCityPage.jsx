import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { 
  CheckCircle2, ArrowRight, PhoneCall, 
  IndianRupee, Zap, ChevronDown, ChevronUp, 
  MapPin, Clock, Truck
} from "lucide-react";
import SEOHead from "../seo/SEOHead";
import TrustBadgeRow from "../components/TrustBadgeRow";
import { SEO_CITIES } from "../lib/cities";
import { useCity } from "../context/CityContext";
import { useAuth } from "../context/AuthContext";
import { generateCityFaqs } from "../lib/locationFaqHelper";

export default function TransportAgentCityPage() {
  const { city } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setCity } = useCity();
  const { user, requireAuth } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [tripsPerDay, setTripsPerDay] = useState(3);

  // Scroll to top whenever city URL param changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [city]);

  // Support both /partners/transport-agents and /partners/transport-agents/:city
  const isNational = !city || city === "india";
  const cityConfig = isNational 
    ? { name: "Pan-India", slug: "india", state: "India" }
    : (SEO_CITIES.find((c) => c.slug === city) || {
        name: city.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        slug: city,
        state: "India"
      });

  // Sync global CityContext so navbar city pill shows correct city — but only when it differs
  useEffect(() => {
    if (!isNational && cityConfig?.slug) {
      setCity({
        name: cityConfig.name,
        slug: cityConfig.slug,
        state: cityConfig.state || "India",
        region: cityConfig.state || "India",
      }, false); // false = do NOT replace URL (we already have the correct URL)
    }
  }, [city]); // eslint-disable-line react-hooks/exhaustive-deps

  const cityName = cityConfig.name;
  const stateName = cityConfig.state || "India";
  const canonicalPath = isNational 
    ? "/partners/transport-agents" 
    : `/partners/transport-agents/${cityConfig.slug}`;

  const handleRegister = () => {
    if (user?.role === "MIDDLEMAN") {
      navigate("/agent/loads");
    } else {
      requireAuth(() => {
        navigate("/agent/loads");
      });
    }
  };

  const estimatedMonthlyIncome = tripsPerDay * 500 * 26; // ₹500 avg bounty * 26 working days

  // ── Dynamic, hyper-local FAQs (same system as the 26K PSEO pages) ──────────
  const cityFaqData = useMemo(() => generateCityFaqs(cityConfig, "truck-booking"), [city]);
  const agentSpecificFaqs = [
    {
      question: `Who can become a GoMyTruck Transport Agent in ${cityName}?`,
      answer: `Any individual, transport broker, booking agent, fleet coordinator, or commission agent with knowledge of the local transport market in ${cityName} can register. No vehicle ownership or capital investment is required. You only need a smartphone, valid Aadhaar/PAN for KYC, and connections with local truck drivers in ${cityName}.`
    },
    {
      question: `How does the GoMyTruck Transport Agent bounty system work in ${cityName}?`,
      answer: `GoMyTruck posts live shipper cargo loads in ${cityName} with preferred budgets. As an agent in ${cityName}, you source a verified driver and vehicle RC. Once the customer pays the 25% advance and the driver verifies the physical loading OTP at the pickup site in ${cityName}, your flat-fee bounty (₹300–₹1,500 per trip) is confirmed and credited to your ledger for bank settlement by GoMyTruck Operations.`
    },
    {
      question: `Is there any upfront fee or deposit to join as an agent in ${cityName}?`,
      answer: `No. Joining as a GoMyTruck Digital Transport Agent in ${cityName} is 100% free with zero registration fees, zero security deposits, and zero hardware requirements. You earn only when a load is physically confirmed.`
    },
    {
      question: `How are bounties paid out to Transport Agents in ${cityName}?`,
      answer: `Once physical loading is confirmed via OTP between driver and shipper in ${cityName}, bounties become eligible immediately. GoMyTruck operations reviews and manually settles your accumulated earnings directly to your verified bank account via NEFT/IMPS, typically within the week.`
    },
    ...cityFaqData.faqs.slice(0, 3), // Pull city-specific transport FAQs dynamically
  ];

  // ── Dynamic local hub list from locationFaqHelper's city areas map ──────────
  const CITY_AREAS_MAP = {
    kolkata: ["Burrabazar", "Park Street", "Dum Dum", "Taratala Industrial Estate", "New Town IT Hub", "Salt Lake Sector V"],
    bengaluru: ["Peenya Industrial Area", "Bommasandra KIADB", "Electronic City Phase 2", "Whitefield Tech Cluster", "Yeshwanthpur Goods Terminal"],
    hyderabad: ["Sanath Nagar Industrial Area", "Jeedimetla SIDCO", "Kattedan Industrial Estate", "Medchal Logistics Zone", "Cherlapally Freight Station"],
    mumbai: ["Andheri MIDC", "Kanjurmarg Warehousing", "Bhiwandi Logistics Hub", "APMC Vashi", "Bandra Kurla Complex"],
    chennai: ["Ambattur Industrial Estate", "Guindy Industrial Area", "Oragadam Auto Cluster", "Ennore Port Corridor", "Sriperumbudur Manufacturing Hub"],
    delhi: ["Okhla Phase 1-3", "Mayapuri Scrap Hub", "Narela Industrial Area", "Bawana DSIIDC", "Patparganj Industrial Estate"],
    "new-delhi": ["Okhla Phase 1-3", "Mayapuri Scrap Hub", "Narela Industrial Area", "Bawana DSIIDC", "Patparganj Industrial Estate"],
    pune: ["Chakan MIDC Phase 1-4", "Bhosari Industrial Belt", "Hinjawadi IT Park", "Pimpri Industrial Zone", "Hadapsar Estate"],
    ahmedabad: ["Changodar GIDC", "Sanand Automotive Hub", "Naroda GIDC", "Vatva Chemical Zone", "Odhav Industrial Area"],
    surat: ["Sachin GIDC", "Pandesara Textile Zone", "Hazira Industrial Area", "Udhna Estate", "Katargam Hub"],
    visakhapatnam: ["Autonagar", "Gajuwaka Steel Zone", "Visakhapatnam Port Trust", "Duvvada SEZ", "Madhurawada IT Corridor"],
    patna: ["Patliputra Industrial Area", "Fatuha Industrial Estate", "Anisabad Mandi Zone", "Boring Road Commercial Hub", "Danapur Logistics"],
    jaipur: ["Sitapura Industrial Area", "Vishwakarma Industrial (VKI)", "Bagru RIICO Zone", "Mansarovar Transport Nagar", "Jhotwara Hub"],
    lucknow: ["Transport Nagar", "Amausi KGIDC", "Chinhat Industrial Area", "Sarojini Nagar Commercial", "Talkatora Zone"],
    indore: ["Pithampur Auto Cluster", "Sanwer Road Industrial", "Dewas Naka Goods Terminal", "Palasia Commercial Hub"],
    bhopal: ["Mandideep Industrial Area", "Govindpura MIDC", "Hoshangabad Road Corridor", "Bairagarh Logistics"],
    nagpur: ["MIHAN SEZ", "Hingna MIDC", "Butibori Industrial Estate", "Kamptee Road Hub", "Wadi Transport Nagar"],
    coimbatore: ["SIDCO Phase 1-2", "Ganapathy Industrial", "Peelamedu Air Cargo Zone", "Saravanampatti Tech Cluster"],
    kochi: ["Willingdon Island Port", "Kalamassery Industrial", "Eloor Petrochemical Belt", "Aluva Transit Hub"],
    bhubaneswar: ["Mancheswar Industrial Estate", "Chandaka IDCO SEZ", "Rasulgarh Commercial", "Patia IT Corridor"],
  };
  const localAreas = CITY_AREAS_MAP[cityConfig.slug] || [
    `${cityName} Central Transport Nagar`,
    `${cityName} APMC Wholesale Mandi`,
    `${cityName} Industrial Estate / SEZ`,
    `${cityName} Logistics & Warehousing Park`,
    `${cityName} Highway Freight Terminal`,
    `${cityName} Rail Goods Yard Hub`,
    `${cityName} Heavy Vehicle Parking Zone`,
    `${cityName} Inter-State Bypass Junction`
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
        { "@type": "ListItem", "position": 2, "name": "Partners", "item": "https://gomytruck.com/driver-partner" },
        { "@type": "ListItem", "position": 3, "name": `Transport Agents ${cityName}`, "item": `https://gomytruck.com${canonicalPath}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": `Independent Transport Agent & Logistics Sourcing Partner - ${cityName}`,
      "description": `Join GoMyTruck as an Independent Digital Transport Agent in ${cityName}. Source verified trucks for customer loads, coordinate pickup milestones, and earn attractive flat-fee bounties with 0% investment.`,
      "datePosted": "2026-01-01",
      "validThrough": "2026-12-31",
      "employmentType": "CONTRACTOR",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "GoMyTruck Logistics Platform",
        "sameAs": "https://gomytruck.com",
        "logo": "https://gomytruck.com/logo.webp"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName,
          "addressRegion": stateName,
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": 45000,
          "unitText": "MONTH"
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": agentSpecificFaqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ];

  return (
    <>
      <SEOHead
        title={`Transport Agent in ${cityName} | Earn Bounties Sourcing Trucks - GoMyTruck`}
        description={`Become a verified GoMyTruck Transport Agent in ${cityName}. Match verified trucks with customer loads, earn guaranteed flat-fee bounties per loaded trip with zero investment.`}
        canonical={canonicalPath}
        keywords={`transport agent ${cityName}, truck commission agent ${cityName}, freight booking agent ${cityName}, transport broker ${cityName}, logistics agent ${cityName}, become transport coordinator ${cityName}, truck sourcing bounty ${cityName}, GoMyTruck partner agent`}
        jsonLd={jsonLd}
      />

      <div className="bg-white min-h-screen text-slate-800">
        {/* HERO SECTION — white/light mode, navbar-safe top offset */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/40 to-emerald-50/60 pt-28 pb-16 md:pt-32 md:pb-20 mt-[68px] border-b border-green-100">
          {/* Subtle dot grid background */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#6DBE45_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb — dark text on white */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-8">
              <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
              <span className="text-slate-300">/</span>
              <Link to="/partners/transport-agents" className="hover:text-green-600 transition-colors">Transport Agents</Link>
              {!isNational && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-800 font-semibold">{cityName}</span>
                </>
              )}
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* LEFT: Headline + GEO paragraph + CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-100 border border-green-200 text-green-700 text-xs md:text-sm font-semibold">
                  <Zap size={14} className="fill-green-600 text-green-600" />
                  <span>Pan-India Transport Agent Network · {cityName}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Become a Verified{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                    Transport Agent
                  </span>{" "}
                  in {cityName}
                </h1>

                {/* GEO ANSWER TARGET — visible on white, readable */}
                <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl">
                  In <strong className="text-slate-900">{cityName}</strong>, GoMyTruck's Digital Transport Agent Network empowers local transport coordinators, commission agents, and logistics brokers to fulfill active customer loads. Earn guaranteed flat-fee bounties (₹300–₹1,500) on every physically loaded vehicle — zero capital investment required.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleRegister}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Register as Transport Agent</span>
                    <ArrowRight size={18} />
                  </button>
                  <a
                    href="tel:6291957542"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-colors"
                  >
                    <PhoneCall size={16} className="text-green-600" />
                    <span>Help: 6291957542</span>
                  </a>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-green-100">
                  <div>
                    <div className="text-2xl font-black text-slate-900">₹0</div>
                    <div className="text-xs text-slate-500 mt-1">Upfront Investment</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-green-600">₹300–₹1,500</div>
                    <div className="text-xs text-slate-500 mt-1">Bounty Per Loaded Trip</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">OTP</div>
                    <div className="text-xs text-slate-500 mt-1">Verified Milestones</div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Earnings Calculator Card */}
              <div className="lg:col-span-5">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
                  <div className="flex items-center justify-between pb-5 border-b border-slate-100 relative z-10">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Agent Income Calculator</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Projected earnings in {cityName}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                      <IndianRupee size={22} />
                    </div>
                  </div>

                  <div className="space-y-5 pt-5 relative z-10">
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-slate-600">Loads Sourced Per Day:</span>
                        <span className="text-green-600 font-bold text-base">{tripsPerDay} Loads</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={tripsPerDay}
                        onChange={(e) => setTripsPerDay(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                        <span>1 Load</span>
                        <span>5 Loads</span>
                        <span>10 Loads</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Average Flat Bounty</span>
                        <span className="text-slate-700 font-semibold">₹500 / Trip</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Working Days / Month</span>
                        <span className="text-slate-700 font-semibold">26 Days</span>
                      </div>
                      <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                        <span className="text-sm font-bold text-slate-900">Est. Monthly Income:</span>
                        <span className="text-2xl font-black text-green-600">₹{estimatedMonthlyIncome.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
                        <span>Instant notification for open loads in {cityName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
                        <span>Manual weekly bank settlement from GoMyTruck Operations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
                        <span>Driver app onboarding retention micro-bonuses</span>
                      </div>
                    </div>

                    <button
                      onClick={handleRegister}
                      className="w-full py-3.5 px-4 rounded-xl text-center text-sm font-bold bg-green-600 hover:bg-green-700 text-white transition-colors"
                    >
                      Start Sourcing Loads Today
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST ROW */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-slate-100">
          <TrustBadgeRow />
        </div>


        {/* HOW IT WORKS SECTION */}
        <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              How the Transport Agent System Works in {cityName}
            </h2>
            <p className="mt-3 text-slate-600 text-sm md:text-base">
              A transparent 4-step workflow that protects both your earnings and the shipper's goods through strict digital milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">View Open Loads</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Log in to the Agent portal to view real-time cargo loads posted by {cityName} shippers with customer target budgets and pickup dates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Submit Driver Quote</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Contact your trusted truck owners, negotiate the trip fare, and submit the driver's phone, vehicle RC photo, and rate to GoMyTruck.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">25% Advance Lock</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                GoMyTruck Ops reviews the quote and collects a 25% trip advance from the customer, locking the booking and dispatching the truck.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">OTP Loading & Bounty</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                When the truck arrives and physically loads, the driver submits the shipper's 4-digit Loading OTP. Your flat bounty is confirmed for settlement!
              </p>
            </div>
          </div>
        </section>

        {/* LOGISTICS HUBS IN THIS REGION */}
        <section className="py-12 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Key Sourcing Hubs & Transport Nagars in {cityName}
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                High-demand industrial zones, warehousing clusters, and wholesale mandis where GoMyTruck agents actively source commercial vehicles.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {localAreas.map((hub, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700">
                  <MapPin size={16} className="text-green-600 flex-shrink-0" />
                  <span className="truncate font-medium">{hub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQS SECTION */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm mt-1">Common questions about joining the GoMyTruck Agent Network in {cityName}</p>
          </div>

          <div className="space-y-4">
            {agentSpecificFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left font-semibold text-slate-800 flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={18} className="text-green-600" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Ready to Earn with GoMyTruck in {cityName}?
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto text-sm md:text-base">
              Join thousands of local transport agents who turn truck driver connections into steady daily income. Sign up in 60 seconds with your mobile number.
            </p>
            <div className="pt-2">
              <button
                onClick={handleRegister}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-white text-green-700 hover:bg-green-50 shadow-xl transition-all"
              >
                <span>Activate Transport Agent Profile</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
