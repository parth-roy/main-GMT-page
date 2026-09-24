import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { 
  Users, ShieldCheck, CheckCircle2, ArrowRight, PhoneCall, 
  IndianRupee, Briefcase, Zap, HelpCircle, ChevronDown, ChevronUp, 
  MapPin, Building, Star, Award, Clock, Truck, ShieldAlert
} from "lucide-react";
import SEOHead from "../seo/SEOHead";
import TrustBadgeRow from "../components/TrustBadgeRow";
import { SEO_CITIES } from "../lib/cities";
import { useCity } from "../context/CityContext";
import { useAuth } from "../context/AuthContext";

export default function TransportAgentCityPage() {
  const { city } = useParams();
  const location = useLocation();
  const { currentCity, setCity } = useCity();
  const { user, requireAuth, setIsLoginModalOpen } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [tripsPerDay, setTripsPerDay] = useState(3);

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

  useEffect(() => {
    if (!isNational && cityConfig && currentCity?.slug !== cityConfig.slug) {
      setCity({
        name: cityConfig.name,
        slug: cityConfig.slug,
        state: cityConfig.state || "India",
        region: cityConfig.state || "India",
      }, true);
    }
  }, [cityConfig, currentCity?.slug, setCity, isNational]);

  const cityName = cityConfig.name;
  const stateName = cityConfig.state || "India";
  const canonicalPath = isNational 
    ? "/partners/transport-agents" 
    : `/partners/transport-agents/${cityConfig.slug}`;

  const handleRegister = () => {
    if (user?.role === "MIDDLEMAN") {
      window.location.href = "/agent/loads";
    } else {
      requireAuth((token, userData) => {
        window.location.href = "/agent/loads";
      });
    }
  };

  const estimatedMonthlyIncome = tripsPerDay * 500 * 26; // ₹500 avg bounty * 26 working days

  const pageFaqs = [
    {
      question: `Who can become a GoMyTruck Transport Agent in ${cityName}?`,
      answer: `Any individual, transport broker, booking agent, fleet coordinator, or commission agent with knowledge of the local transport market in ${cityName} can register. No vehicle ownership or capital investment is required. You only need a smartphone, valid Aadhaar/PAN for KYC, and connections with local truck drivers.`
    },
    {
      question: `How does the GoMyTruck Transport Agent bounty system work?`,
      answer: `GoMyTruck posts live shipper cargo loads in ${cityName} with preferred budgets. Agents source a verified driver and vehicle RC. Once the customer pays the 25% advance and the driver verifies the physical loading OTP at the pickup site, your flat-fee bounty is confirmed and credited to your ledger for manual bank settlement by GoMyTruck Operations.`
    },
    {
      question: `Is there any upfront fee or deposit to join as an agent in ${cityName}?`,
      answer: `No. Joining as a GoMyTruck Digital Transport Agent is 100% free with zero registration fees, zero security deposits, and zero hardware requirements.`
    },
    {
      question: `How are bounties paid out to Transport Agents in ${cityName}?`,
      answer: `Once physical loading is confirmed via OTP between driver and shipper, bounties become eligible immediately. GoMyTruck operations reviews and manually settles your accumulated earnings directly to your verified bank account via NEFT/IMPS.`
    },
    {
      question: `What types of commercial trucks can I source in ${cityName}?`,
      answer: `You can source all commercial vehicles registered on GoMyTruck: 3-Wheelers, Tata Ace (Chota Hathi), 8ft Bolero Pickup, 14ft/17ft/19ft/22ft Eicher trucks, and 32ft Multi-Axle Containers for both intracity and intercity routes originating in ${cityName}.`
    }
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
      "mainEntity": pageFaqs.map((faq) => ({
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

      <div className="bg-slate-50 min-h-screen text-slate-800">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 md:pt-16 md:pb-24 border-b border-slate-800">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6DBE45_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
              <Link to="/" className="hover:text-green-400">Home</Link>
              <span>/</span>
              <Link to="/partners/transport-agents" className="hover:text-green-400">Transport Agents</Link>
              {!isNational && (
                <>
                  <span>/</span>
                  <span className="text-slate-200">{cityName}</span>
                </>
              )}
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs md:text-sm font-semibold">
                  <Zap size={15} />
                  <span>Pan-India Transport Agent Network • {cityName}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Become a Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Transport Agent</span> in {cityName}
                </h1>

                {/* GEO ANSWER TARGET PARAGRAPH FOR AI ENGINE CITATIONS */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-sm md:text-base leading-relaxed">
                  <p>
                    In <strong className="text-white">{cityName}</strong>, GoMyTruck's Digital Transport Agent Network empowers local transport coordinators, commission agents, and logistics brokers to fulfill active customer loads. By sourcing verified commercial trucks matching shippers' preferred budgets, agents earn guaranteed flat-fee bounties on every physically loaded vehicle with zero capital investment and complete operational transparency.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={handleRegister}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Register as Transport Agent</span>
                    <ArrowRight size={18} />
                  </button>
                  <a
                    href="tel:6291957542"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <PhoneCall size={18} />
                    <span>Help: 6291957542</span>
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
                  <div>
                    <div className="text-2xl font-black text-white">₹0</div>
                    <div className="text-xs text-slate-400 mt-1">Upfront Investment</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-green-400">₹300 - ₹1,500</div>
                    <div className="text-xs text-slate-400 mt-1">Bounty Per Loaded Trip</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">100%</div>
                    <div className="text-xs text-slate-400 mt-1">OTP Verified Milestones</div>
                  </div>
                </div>
              </div>

              {/* EARNINGS CALCULATOR CARD */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
                  <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold text-white">Agent Income Calculator</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Projected earnings in {cityName}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                      <IndianRupee size={22} />
                    </div>
                  </div>

                  <div className="space-y-6 pt-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-slate-300">Loads Sourced Per Day:</span>
                        <span className="text-green-400 font-bold text-base">{tripsPerDay} Loads</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={tripsPerDay}
                        onChange={(e) => setTripsPerDay(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                        <span>1 Load</span>
                        <span>5 Loads</span>
                        <span>10 Loads</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Average Flat Bounty</span>
                        <span className="text-slate-200 font-semibold">₹500 / Trip</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Working Days / Month</span>
                        <span className="text-slate-200 font-semibold">26 Days</span>
                      </div>
                      <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                        <span className="text-sm font-bold text-white">Estimated Monthly Income:</span>
                        <span className="text-2xl font-black text-green-400">₹{estimatedMonthlyIncome.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                        <span>Instant notification for open loads in {cityName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                        <span>Manual weekly bank settlement direct from Operations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                        <span>Driver app onboarding retention micro-bonuses</span>
                      </div>
                    </div>

                    <button
                      onClick={handleRegister}
                      className="w-full py-3.5 px-4 rounded-xl text-center text-sm font-bold bg-green-500 hover:bg-green-600 text-white transition-colors"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
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
              {[
                `${cityName} Central Transport Nagar`,
                `${cityName} APMC Wholesale Mandi`,
                `${cityName} Industrial Estate / SEZ`,
                `${cityName} Logistics & Warehousing Park`,
                `${cityName} Highway Freight Terminal`,
                `${cityName} Rail Goods Yard Hub`,
                `${cityName} Heavy Vehicle Parking Zone`,
                `${cityName} Inter-State Bypass Junction`
              ].map((hub, idx) => (
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
            {pageFaqs.map((faq, index) => {
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
