import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, TrendingUp, Package, Building2, Truck, MessageCircleQuestion } from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import { generateStateFaqs } from '../lib/locationFaqHelper';

const states = {
  "west-bengal": {
    canonical: "/west-bengal",
    title: "Goods Transport & Truck Booking in West Bengal | GoMyTruck",
    description: "Book trucks for goods transport across West Bengal — Kolkata, Howrah, Dankuni, Barrackpore, Durgapur, Asansol, Haldia, Siliguri. Only 5% commission, no brokers.",
    eyebrow: "West Bengal State Logistics Hub",
    h1: "Goods Transport and Truck Booking Across West Bengal",
    intro: "West Bengal is Eastern India's logistics backbone, with Kolkata as the regional freight capital and an industrial corridor stretching from Dankuni-Howrah through Durgapur-Asansol to Haldia port. GoMyTruck provides verified truck booking across the entire state at a transparent 5% platform commission.",
    stateKeyFact: "West Bengal handles over ₹3 lakh crore in annual freight movement across road, rail and sea. GoMyTruck's 5% commission model provides the lowest platform fee for freight booking in the state, compared to traditional broker margins of 10–20%.",
    industrialHubs: [
      {name: "Dankuni", tagline: "Eastern Freight Corridor terminus", slug: "/dankuni"},
      {name: "Howrah", tagline: "Oldest industrial hub of WB", slug: "/howrah"},
      {name: "Barrackpore", tagline: "Jute and textile belt", slug: "/barrackpore"},
      {name: "Uluberia", tagline: "Rubber and food processing", slug: "/uluberia"},
      {name: "Durgapur", tagline: "Steel capital of West Bengal", slug: "/durgapur"},
      {name: "Asansol", tagline: "Coal and heavy industry", slug: "/asansol"},
      {name: "Haldia", tagline: "Port and petrochemicals", slug: "/haldia"},
      {name: "Siliguri", tagline: "North East India gateway", slug: "/siliguri"},
      {name: "Kharagpur", tagline: "Vidyasagar Industrial Park", slug: "/kharagpur"},
      {name: "Burrabazar", tagline: "Largest mandi of WB", slug: "/burrabazar"}
    ],
    keyRoutes: [
      {label: "Kolkata → Durgapur", desc: "170 km • Durgapur Expressway", slug: "/routes/kolkata-to-durgapur"},
      {label: "Kolkata → Haldia Port", desc: "130 km • Factory-to-Port", slug: "/routes/kolkata-to-haldia"},
      {label: "Kolkata → Asansol", desc: "200 km • NH-19", slug: "/routes/kolkata-to-asansol"},
      {label: "Kolkata → Siliguri", desc: "600 km • North Bengal", slug: "/routes/kolkata-to-siliguri"},
      {label: "Kolkata → Guwahati", desc: "1000 km • Northeast gateway", slug: "/routes/kolkata-to-guwahati"}
    ],
    industries: [
      {label: "Steel & Heavy Metals — Durgapur", slug: "/industries/steel-logistics/durgapur"},
      {label: "Jute Transport — Barrackpore", slug: "/industries/jute-logistics/barrackpore"},
      {label: "FMCG Logistics — West Bengal", slug: "/industries/fmcg-logistics/west-bengal"},
      {label: "Tea Transport — Siliguri", slug: "/industries/tea-logistics/siliguri"},
      {label: "Textile & Garments — Kolkata", slug: "/industries/textile-logistics/kolkata"},
      {label: "Construction Material — WB", slug: "/industries/construction-logistics/west-bengal"}
    ]
  },
  "odisha": {
    canonical: "/odisha",
    title: "Goods Transport & Truck Booking in Odisha | GoMyTruck",
    description: "Book trucks for goods transport across Odisha — Bhubaneswar, Cuttack, Paradeep Port, Jagatpur Industrial Estate. Only 5% commission, no brokers.",
    eyebrow: "Odisha State Logistics Hub",
    h1: "Goods Transport and Truck Booking Across Odisha",
    intro: "Odisha is Eastern India's fastest-growing industrial state, with Bhubaneswar's IT and FMCG hubs, Cuttack's Jagatpur Industrial Estate and Paradeep's bulk cargo port driving massive freight demand. GoMyTruck provides verified truck booking across Odisha at a transparent 5% platform commission.",
    stateKeyFact: "Odisha's industrial corridor is one of India's fastest-growing, with planned investments exceeding ₹10 lakh crore. GoMyTruck connects Odisha's manufacturers and traders to verified trucks at a flat 5% commission — no broker margin.",
    industrialHubs: [
      {name: "Bhubaneswar", tagline: "Odisha capital & IT hub", slug: "/bhubaneswar"},
      {name: "Cuttack", tagline: "Jagatpur Industrial Estate", slug: "/cuttack"},
      {name: "Paradeep", tagline: "Major bulk cargo port", slug: "/paradeep"}
    ],
    keyRoutes: [
      {label: "Kolkata → Bhubaneswar", desc: "450 km • NH-16", slug: "/routes/kolkata-to-bhubaneswar"},
      {label: "Kolkata → Cuttack", desc: "500 km • NH-16", slug: "/routes/kolkata-to-cuttack"},
      {label: "Kolkata → Paradeep Port", desc: "500 km • Factory-to-Port", slug: "/routes/kolkata-to-paradeep"},
      {label: "Cuttack → Kolkata Return", desc: "Return load route", slug: "/routes/cuttack-to-kolkata"}
    ],
    industries: [
      {label: "FMCG Logistics — West Bengal (WB→OD)", slug: "/industries/fmcg-logistics/west-bengal"},
      {label: "Enterprise Logistics", slug: "/enterprise"}
    ]
  },
  "bihar": {
    canonical: "/bihar",
    title: "Goods Transport & Truck Booking in Bihar | GoMyTruck",
    description: "Book trucks for goods transport across Bihar — Patna, Hajipur, Muzaffarpur, agricultural and FMCG freight. Only 5% commission, no brokers.",
    eyebrow: "Bihar State Logistics Hub",
    h1: "Goods Transport and Truck Booking Across Bihar",
    intro: "Bihar is one of India's fastest-growing agricultural and commercial freight markets, with Patna as the commercial capital and Hajipur's Industrial Area as the primary manufacturing hub. GoMyTruck provides verified truck booking across Bihar at a transparent 5% platform commission.",
    stateKeyFact: "Bihar's road freight market is estimated at over ₹25,000 crore annually, driven by agricultural produce, FMCG distribution and construction materials. GoMyTruck provides a digital alternative to the traditional intermediary-heavy truck booking system in Bihar.",
    industrialHubs: [
      {name: "Patna", tagline: "Bihar capital & commercial hub", slug: "/patna"},
      {name: "Dhanbad", tagline: "Coal belt logistics", slug: "/dhanbad"},
      {name: "Ranchi", tagline: "Jharkhand capital", slug: "/ranchi"}
    ],
    keyRoutes: [
      {label: "Kolkata → Patna", desc: "600 km • NH-19", slug: "/routes/kolkata-to-patna"},
      {label: "Kolkata → Ranchi", desc: "420 km • NH-33", slug: "/routes/kolkata-to-ranchi"},
      {label: "Kolkata → Dhanbad", desc: "280 km • NH-19", slug: "/routes/kolkata-to-dhanbad"}
    ],
    industries: [
      {label: "Coal & Mining — Dhanbad", slug: "/industries/coal-logistics/dhanbad"},
      {label: "Agri Logistics — East India", slug: "/industries/agri-logistics/east-india"},
      {label: "Enterprise Logistics", slug: "/enterprise"}
    ]
  },
  "assam-northeast": {
    canonical: "/assam-northeast",
    title: "Goods Transport & Truck Booking in Assam & Northeast India | GoMyTruck",
    description: "Book trucks for goods transport in Assam and Northeast India — Guwahati, Siliguri corridor. Only 5% commission, verified drivers, return load matching.",
    eyebrow: "Assam & Northeast India Hub",
    h1: "Goods Transport and Truck Booking in Assam & Northeast India",
    intro: "The Assam and Northeast India freight market is served primarily through Guwahati as the distribution gateway. GoMyTruck connects FMCG distributors, traders and manufacturers to verified trucks on the Kolkata–Guwahati corridor at a transparent 5% commission, with return load (backhaul) matching to reduce empty running.",
    stateKeyFact: "The Kolkata–Guwahati freight corridor handles over 3,000 truck movements daily — making it one of Eastern India's highest-volume freight lanes. GoMyTruck's backhaul matching helps fleet operators reduce empty running on the return route.",
    industrialHubs: [
      {name: "Guwahati", tagline: "Northeast India freight gateway", slug: "/guwahati"},
      {name: "Siliguri", tagline: "Tea & agri-commodity hub", slug: "/siliguri"}
    ],
    keyRoutes: [
      {label: "Kolkata → Guwahati", desc: "1000 km • NH-27", slug: "/routes/kolkata-to-guwahati"},
      {label: "Guwahati → Kolkata Return", desc: "Return load • Backhaul", slug: "/routes/guwahati-to-kolkata"},
      {label: "Kolkata → Siliguri", desc: "600 km • North Bengal", slug: "/routes/kolkata-to-siliguri"}
    ],
    industries: [
      {label: "Tea Transport — Siliguri", slug: "/industries/tea-logistics/siliguri"},
      {label: "FMCG Logistics", slug: "/industries/fmcg-logistics/west-bengal"},
      {label: "Enterprise Logistics", slug: "/enterprise"}
    ]
  }
};

const StateHubPage = ({ stateKey }) => {
  const data = states[stateKey];

  if (!data) {
    return <Navigate to="/404" />;
  }

  const {
    canonical,
    title,
    description,
    eyebrow,
    h1,
    intro,
    stateKeyFact,
    industrialHubs,
    keyRoutes,
    industries
  } = data;
  const stateNameClean = h1.split('Across ')[1] || h1.split('in ')[1] || "the State";
  const stateFaqData = generateStateFaqs(stateNameClean, industrialHubs.length, industrialHubs.map(h => h.name));
  const activeFaqs = stateFaqData.faqs;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Goods Transport and Truck Booking",
      "provider": {
        "@type": "Organization",
        "name": "GoMyTruck"
      },
      "areaServed": {
        "@type": "State",
        "name": stateNameClean
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Logistics Services by City",
        "itemListElement": industrialHubs.map((hub, idx) => ({
          "@type": "OfferCatalog",
          "name": `${hub.name} Truck Booking`,
          "position": idx + 1
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://gomytruck.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": eyebrow,
          "item": `https://gomytruck.com${canonical}`
        }
      ]
    },
    stateFaqData.jsonLdSchema
  ];

  return (
    <div className="flex flex-col w-full min-h-screen font-sans bg-slate-50">
      <SEOHead
        title={title}
        description={description}
        canonical={canonical}
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="bg-slate-950 text-white pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-slate-800/50 rounded-full px-3 py-1 mb-6 border border-slate-700">
              <span className="text-brand-400 font-semibold text-sm">Only 5% Commission</span>
            </div>
            <p className="text-brand-300 font-medium mb-4">{eyebrow}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {h1}
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              {intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/" 
                className="inline-flex justify-center items-center px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
              >
                Get Estimate <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a 
                href="tel:9331488999" 
                className="inline-flex justify-center items-center px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-semibold rounded-lg transition-colors"
              >
                <Phone className="mr-2 w-5 h-5" /> Call 93314 88999
              </a>
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
             <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 max-w-md w-full shadow-2xl">
               <h3 className="text-xl font-bold mb-6 flex items-center"><TrendingUp className="mr-2 text-brand-400" /> State Network</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                   <span className="text-slate-400">Total Hubs</span>
                   <span className="text-2xl font-bold text-white">{industrialHubs.length}</span>
                 </div>
                 <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                   <span className="text-slate-400">Key Routes</span>
                   <span className="text-2xl font-bold text-white">{keyRoutes.length}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-slate-400">Platform Commission</span>
                   <span className="text-2xl font-bold text-brand-400">5% Flat</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* State Key Fact */}
      <section className="bg-brand-50 border-y border-brand-200 py-10 px-4 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 bg-brand-100 p-4 rounded-full text-brand-600">
            <TrendingUp className="w-8 h-8" />
          </div>
          <p className="text-slate-800 text-lg md:text-xl font-medium leading-relaxed">
            {stateKeyFact}
          </p>
        </div>
      </section>

      {/* Industrial Hubs Grid */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Major Industrial Hubs</h2>
          <p className="text-slate-600 max-w-2xl text-lg">
            Direct access to verified transport providers across key commercial centers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {industrialHubs.map((hub, index) => (
            <Link 
              key={index} 
              to={hub.slug} 
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-brand-500 hover:shadow-lg transition-all group flex flex-col items-start"
            >
              <div className="bg-slate-50 p-3 rounded-lg text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{hub.name}</h3>
              <p className="text-slate-600 text-sm">{hub.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Key Routes & Industries Grid */}
      <section className="bg-white py-20 px-4 md:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Routes */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
              <Truck className="mr-3 text-brand-500" /> High-Volume Routes
            </h2>
            <div className="space-y-4">
              {keyRoutes.map((route, index) => (
                <Link 
                  key={index}
                  to={route.slug}
                  className="flex items-center justify-between bg-slate-50 border border-slate-200 hover:border-brand-500 hover:shadow-sm transition-all rounded-lg p-4 group"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{route.label}</h4>
                    <p className="text-sm text-slate-500 mt-1">{route.desc}</p>
                  </div>
                  <ArrowRight className="text-slate-400 group-hover:text-brand-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
              <Building2 className="mr-3 text-brand-500" /> Key Industries
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {industries.map((ind, index) => (
                <Link
                  key={index}
                  to={ind.slug}
                  className="flex items-center p-4 bg-slate-50 border border-slate-200 hover:border-brand-500 hover:shadow-sm transition-all rounded-lg group"
                >
                  <Package className="text-slate-400 mr-3 group-hover:text-brand-500" />
                  <span className="font-medium text-slate-800 group-hover:text-brand-600 transition-colors">{ind.label}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* State FAQ Section */}
      <section className="py-20 px-4 md:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-700 text-xs font-bold tracking-widest uppercase mb-3">
              <MessageCircleQuestion size={14} /> State Logistics FAQs
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Frequently Asked Questions About Transport in {stateNameClean}
            </h2>
            <p className="text-slate-600 text-base">
              Learn how GoMyTruck provides transparent, verified freight transportation across {stateNameClean}.
            </p>
          </div>
          
          <div className="space-y-4">
            {activeFaqs.map((faq, idx) => (
              <details key={idx} className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs open:border-brand-400">
                <summary className="font-bold cursor-pointer text-slate-900 text-base sm:text-lg">{faq.question}</summary>
                <p className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base border-t border-slate-100 pt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-slate-950 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to book transport in {eyebrow.split(' State')[0].split(' &')[0]}?</h2>
          <p className="text-slate-300 text-lg mb-10">
            Join thousands of businesses moving freight reliably at a flat 5% commission. 
            No hidden fees, no broker margins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg transition-colors text-lg"
            >
              Get Instant Estimate
            </Link>
            <Link 
              to="/driver-onboarding" 
              className="px-8 py-4 bg-transparent border-2 border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors text-lg"
            >
              Partner as Fleet Owner
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default StateHubPage;
