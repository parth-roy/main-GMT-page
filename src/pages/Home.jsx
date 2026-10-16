import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Sparkles, ShieldCheck, Zap, Truck, Building2 } from 'lucide-react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQ from '../components/FAQ';
import SEOHead from '../seo/SEOHead';
import { useCity } from '../context/CityContext';
import { ALL_SEO_VEHICLES } from '../lib/vehicles';
import GovtIntegrationsBar from '../components/trust/GovtIntegrationsBar';
import FlatFeeVsCommissionCalc from '../components/calculator/FlatFeeVsCommissionCalc';
import Guarantee48hBadge from '../components/trust/Guarantee48hBadge';

const homeSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://gomytruck.com/#organization",
    "name": "GoMyTruck",
    "url": "https://gomytruck.com",
    "logo": "https://gomytruck.com/go-my-truck-logo.png",
    "contactPoint": { "@type": "ContactPoint", "telephone": "+91-6291957542", "contactType": "customer support" },
    "address": { "@type": "PostalAddress", "addressLocality": "Barrackpore", "addressRegion": "West Bengal", "addressCountry": "IN" }
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Digital Freight Marketplace",
    "provider": { "@id": "https://gomytruck.com/#organization" },
    "areaServed": ["West Bengal", "Eastern India", "India"],
    "description": "GoMyTruck is India's most transparent freight marketplace. Book mini trucks, FTL, PTL and intercity transport across Eastern India — verified drivers, transparent pricing, no hidden broker markups.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "GoMyTruck Logistics & Transport Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mini Truck Booking Kolkata" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tata Ace on Rent Kolkata" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "32ft Container Truck Kolkata" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bolero Pickup Truck on Rent" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Full Truck Load (FTL) Transport" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Part Load Transport (PTL)" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Intercity Goods Transport Kolkata" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Truck Booking Kolkata to Guwahati" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Truck Booking Kolkata to Patna" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Goods Transport Dankuni" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Steel Transport Durgapur" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "FMCG Logistics West Bengal" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Attach Truck to Platform" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Fleet Partner Registration" } }
      ]
    }
  }
];

export default function Home({ selectedService, setSelectedService, onOpenEstimate, onSelectVehicle }) {
  const { currentCity } = useCity();

  useEffect(() => {
    setSelectedService(null)
  }, [setSelectedService])

  const dynamicTitle = currentCity?.name && currentCity.name !== 'Kolkata'
    ? `Online Truck Booking & Goods Transport in ${currentCity.name} | GoMyTruck`
    : "India's Most Transparent Freight Marketplace | GoMyTruck";

  const dynamicDescription = currentCity?.name && currentCity.name !== 'Kolkata'
    ? `Book mini trucks, Tata Ace, FTL, PTL and intercity goods transport across ${currentCity.name} and ${currentCity.state || 'India'}. Verified drivers, transparent pricing, no hidden broker markups.`
    : "Book mini trucks, FTL, PTL and intercity goods transport across Eastern India. Transparent pricing, no hidden fees, verified drivers in Kolkata, Dankuni, Howrah, Durgapur.";

  return (
    <>
      <SEOHead
        title={dynamicTitle}
        description={dynamicDescription}
        canonical="/"
        keywords="online truck booking, book truck online, hire truck for goods, truck booking near me, transport service near me, goods transport services, mini truck booking near me, tata ace on rent, pickup truck booking, FTL transport services, part load transport, goods carrier near me, truck booking Kolkata, truck booking West Bengal, transparent freight marketplace, Dankuni logistics, intercity truck booking"
        jsonLd={homeSchema}
        preloadImage="/hero-bg-960.webp"
        preloadImageSrcSet="/hero-bg-640.webp 640w, /hero-bg-960.webp 960w, /hero-bg-1600.webp 1600w"
        preloadImageMedia="(max-width: 767px)"
      />
      <Hero 
        selectedService={selectedService} 
        setSelectedService={setSelectedService} 
        onOpenEstimate={onOpenEstimate}
        onSelectVehicle={onSelectVehicle}
      />

      {/* ── Enterprise Government & Regulatory Integrations Strip ── */}
      <GovtIntegrationsBar />

      {/* ── Commercial Vehicle Fleet Directory (Transport Vehicles by Payload & Size) ── */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full uppercase mb-1">
                  <Layers size={12} /> Commercial Vehicles
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Transport Vehicles by Payload &amp; Size
                </h2>
              </div>
              <Link to="/truck" className="text-xs font-bold text-brand-600 hover:underline">
                All Vehicles &amp; Pricing →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {ALL_SEO_VEHICLES.map((v) => (
                <Link
                  key={v.slug}
                  to={`/${currentCity?.slug || 'kolkata'}/truck-booking/${v.slug}`}
                  className="p-4 bg-slate-50 hover:bg-brand-50/60 border border-slate-200/80 hover:border-brand-300 rounded-2xl flex flex-col justify-between transition-all group"
                >
                  <div className="aspect-video bg-white rounded-xl mb-3 flex items-center justify-center p-2 border border-slate-100">
                    <img 
                      src={v.image} 
                      alt={v.name} 
                      loading="lazy" 
                      decoding="async" 
                      className="max-h-full object-contain group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-brand-700">{v.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{v.capacityKg} kg · {v.lengthFt}×{v.widthFt} ft</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Strategic Blueprint Section: Zero-Percentage Flat Take Rate & High-Trust Ecosystem ── */}
      <section className="py-12 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              India's Transparent Logistics Revolution
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Zero Percentage Commission. Flat ₹99 / ₹249 per Trip. <br className="hidden sm:inline" />
              <span className="text-brand-600">Keep 100% of Your Freight Earnings.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              While conventional aggregator platforms take 15% to 20% cut from every load, GoMyTruck charges only a nominal flat fee. Drivers and fleet owners save lakhs annually, backed by government-grade VAHAN, ULIP, and TReDS integrations.
            </p>
          </div>

          {/* Interactive Flat Fee vs Commission Take-Home Calculator */}
          <FlatFeeVsCommissionCalc />

          {/* 48-Hour Priority Load Guarantee Safe Harbor */}
          <Guarantee48hBadge />

          {/* 4 Strategic Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {/* Card 1: Driver MEG */}
            <Link
              to="/minimum-earnings-guarantee"
              className="p-5 sm:p-6 rounded-3xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md inline-block mb-1">
                  Code on Social Security 2020
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-800">
                  ₹25,000 MEG Guarantee
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  For driver-owned Tata Ace vehicles. Maintain 26 days login and 90% ping acceptance for total income security.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Apply for MEG</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Fleet Attachment */}
            <Link
              to="/fleet-attachment"
              className="p-5 sm:p-6 rounded-3xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md inline-block mb-1">
                  Commercial Fleets
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-800">
                  ₹5,000 FASTag Credit
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Attach 5+ trucks (14ft to 32ft) to receive upfront FASTag toll credit, 30-day warehouse rolling contracts, and 15-day payouts.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
                <span>Attach Your Fleet</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Enterprise DMP */}
            <Link
              to="/enterprise-dispatch"
              className="p-5 sm:p-6 rounded-3xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md inline-block mb-1">
                  B2B Logistics SaaS
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-800">
                  Enterprise DMP &amp; TReDS
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Single-pane dispatch, 24-hr invoice discounting at 5–8% p.a., automated E-Way Bill Part-B, and API transit insurance.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-indigo-700 group-hover:text-indigo-800">
                <span>Explore Enterprise</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: EV Fleet SaaS */}
            <Link
              to="/ev-fleet-solutions"
              className="p-5 sm:p-6 rounded-3xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md inline-block mb-1">
                  Green Logistics
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-800">
                  Tata Ace EV 1000 SaaS
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Cut running expenses by up to 46% with range-aware routing, charging hub coordination, and ESG carbon tracking.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Calculate EV TCO</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

        </div>
      </section>

      <Services onSelectVehicle={onSelectVehicle} />
      <WhyChooseUs />
      <FAQ />
    </>
  );
}
