import React from 'react';
import Services from '../components/Services';
import SEOHead from '../seo/SEOHead';
import DirectDriverContactBanner from '../components/common/DirectDriverContactBanner';

export default function ServicesPage({ onSelectVehicle }) {
  return (
    <>
      <SEOHead
        title="Truck, Bike Delivery & Packers and Movers Services"
        description="Explore GoMyTruck vehicle and logistics service categories. Choose the route and load that fit your requirement, then review a current estimate."
        canonical="/services"
      />
      <header className="bg-slate-950 px-4 pb-12 pt-32 text-center text-white">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-300">GoMyTruck services</p>
        <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Choose a Vehicle for Your Goods Transport Requirement
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
          Compare practical load capacities, then enter your route and goods details for a current estimate.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <DirectDriverContactBanner categoryName="Commercial Truck Drivers" />
      </div>

      <Services onSelectVehicle={onSelectVehicle} />
    </>
  );
}

