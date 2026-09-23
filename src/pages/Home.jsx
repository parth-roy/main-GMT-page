import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQ from '../components/FAQ';
import SEOHead from '../seo/SEOHead';
import { useCity } from '../context/CityContext';
import { ALL_SEO_VEHICLES } from '../lib/vehicles';

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
    "description": "GoMyTruck is India's most transparent freight marketplace. Book mini trucks, FTL, PTL and intercity transport across Eastern India at only 5% platform commission — no brokers, no surge pricing.",
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
    : "India's Most Transparent Freight Marketplace | Only 5% Commission | GoMyTruck";

  const dynamicDescription = currentCity?.name && currentCity.name !== 'Kolkata'
    ? `Book mini trucks, Tata Ace, FTL, PTL and intercity goods transport across ${currentCity.name} and ${currentCity.state || 'India'} at only 5% platform commission. Verified drivers, no brokers, no surge pricing.`
    : "Book mini trucks, FTL, PTL and intercity goods transport across Eastern India at only 5% platform commission. No brokers, no surge pricing, no hidden fees. Verified drivers in Kolkata, Dankuni, Howrah, Durgapur.";

  return (
    <>
      <SEOHead
        title={dynamicTitle}
        description={dynamicDescription}
        canonical="/"
        keywords="online truck booking, book truck online, hire truck for goods, truck booking near me, transport service near me, goods transport services, mini truck booking near me, tata ace on rent, pickup truck booking, FTL transport services, part load transport, goods carrier near me, truck booking Kolkata, truck booking West Bengal, 5% commission freight, transparent freight marketplace, Dankuni logistics, intercity truck booking"
        jsonLd={homeSchema}
        preloadImage="/hero-bg-960.webp"
        preloadImageSrcSet="/hero-bg-640.webp 640w, /hero-bg-960.webp 960w, /hero-bg-1600.webp 1600w"
      />
      <Hero 
        selectedService={selectedService} 
        setSelectedService={setSelectedService} 
        onOpenEstimate={onOpenEstimate}
        onSelectVehicle={onSelectVehicle}
      />

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

      <Services onSelectVehicle={onSelectVehicle} />
      <WhyChooseUs />
      <FAQ />
    </>
  );
}
