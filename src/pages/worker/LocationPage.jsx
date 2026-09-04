import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DirectDriverContactBanner from '../../components/common/DirectDriverContactBanner';

export default function LocationPage() {
  const { location } = useParams();
  const cityName = location ? location.charAt(0).toUpperCase() + location.slice(1) : 'Your City';

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Location hero */}
      <section className="bg-green-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Worker Jobs in {cityName}</h1>
        <p className="text-xl">Find immediate gigs and daily work opportunities in {cityName}.</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {/* Floating Direct Driver & Partner Contact Card */}
        <DirectDriverContactBanner categoryName="Drivers & Logistics Labour" cityName={cityName} />

        {/* Workforce context */}
        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Logistics Hub: {cityName}</h2>
          <p className="text-gray-700 leading-relaxed">
            {cityName} is a bustling hub for logistics, transport, and delivery operations. Our platform connects local businesses and fleet owners with reliable workers on-demand.
          </p>
        </section>

        {/* Available opportunities */}
        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Available Opportunities</h2>
          <div className="space-y-4">
            {['Loader', 'Unloader', 'Helper'].map(role => (
              <div key={role} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{role}</h3>
                  <p className="text-gray-600 text-sm">Multiple active requests in {cityName}</p>
                </div>
                <Link to={`/worker/role/${role.toLowerCase()}/location/${location}`} className="text-green-600 font-bold hover:underline">
                  Explore {role} Jobs →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
