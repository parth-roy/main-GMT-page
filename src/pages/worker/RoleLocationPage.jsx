import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DirectDriverContactBanner from '../../components/common/DirectDriverContactBanner';

export default function RoleLocationPage() {
  const { role, location } = useParams();
  const roleName = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Worker';
  const cityName = location ? location.charAt(0).toUpperCase() + location.slice(1) : 'City';

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Role+Location Hero */}
      <section className="bg-green-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">{roleName} Jobs in {cityName}</h1>
        <p className="text-xl">Your guide to finding {roleName.toLowerCase()} opportunities locally.</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {/* Floating Direct Driver & Partner Contact Card */}
        <DirectDriverContactBanner categoryName={`${roleName} & Transporters`} cityName={cityName} />

        {/* Local context */}
        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Working as a {roleName} in {cityName}</h2>
          <p className="text-gray-700 leading-relaxed">
            The demand for {roleName.toLowerCase()}s in {cityName} is consistently high due to active commercial and transport sectors. Expect regular opportunities near wholesale markets, transport hubs, and industrial zones.
          </p>
        </section>

        {/* Opportunity area */}
        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Latest Openings</h2>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{roleName} Required - Shift {i}</h3>
                  <p className="text-gray-600 text-sm">Industrial Area, {cityName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">₹500 / shift</span>
                  <Link to="/worker/job/mock-id" className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
