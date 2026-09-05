import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQ from '../components/FAQ';
import SEOHead from '../seo/SEOHead';
import { useCity } from '../context/CityContext';

const homeSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://gomytruck.com/#organization",
    "name": "GoMyTruck",
    "url": "https://gomytruck.com",
    "logo": "https://gomytruck.com/go-my-truck-logo.png",
    "contactPoint": { "@type": "ContactPoint", "telephone": "+91-9331488999", "contactType": "customer support" },
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


      <Services onSelectVehicle={onSelectVehicle} />
      <WhyChooseUs />
      <FAQ />
    </>
  );
}
