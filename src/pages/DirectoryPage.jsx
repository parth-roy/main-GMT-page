import React from 'react';
import { Link } from 'react-router-dom';
import { SEO_CITIES } from '../lib/cities';
import SEOHead from '../seo/SEOHead';

const DirectoryPage = () => {
  // Group cities by state
  const citiesByState = SEO_CITIES.reduce((acc, city) => {
    if (!acc[city.state]) {
      acc[city.state] = [];
    }
    acc[city.state].push(city);
    return acc;
  }, {});

  // Sort states alphabetically
  const sortedStates = Object.keys(citiesByState).sort();

  return (
    <>
      <SEOHead
        title="All India City Logistics & Truck Booking Directory | GoMyTruck"
        description="Explore GoMyTruck's pan-India truck booking and goods transport directory covering 500+ cities, industrial estates, logistics corridors, and seaports."
        canonical="/directory"
        keywords="truck booking directory, transport service areas, goods transport cities india, pan india logistics network"
      />
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            GoMyTruck Service Directory
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Find reliable and affordable truck booking, goods transport, and logistics services in your city.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedStates.map((state) => (
            <div key={state} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-brand-500/10 px-6 py-4 border-b border-brand-500/20">
                <h2 className="text-xl font-bold text-brand-700">{state}</h2>
              </div>
              <ul className="p-4 space-y-3">
                {citiesByState[state].sort((a, b) => a.name.localeCompare(b.name)).map(city => (
                  <li key={city.slug}>
                    <Link 
                      to={`/${city.slug}`}
                      className="flex items-center text-slate-600 hover:text-brand-600 font-medium transition-colors group"
                    >
                      <svg className="w-4 h-4 mr-2 text-slate-400 group-hover:text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);
};

export default DirectoryPage;
