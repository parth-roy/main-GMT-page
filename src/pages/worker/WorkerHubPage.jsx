import React from 'react';
import { Link } from 'react-router-dom';
import DirectDriverContactBanner from '../../components/common/DirectDriverContactBanner';

export default function WorkerHubPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Hero */}
      <section className="bg-green-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Gig Work That Fits Your Schedule</h1>
        <p className="text-xl mb-8">Join the largest network of verified workers and start earning daily.</p>
        <Link to="/worker/jobs" className="bg-white text-green-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition">Find Work</Link>
      </section>

      {/* Floating Direct Driver & Partner Contact Card */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <DirectDriverContactBanner categoryName="Logistics Workforce & Drivers" />
      </div>

      {/* Popular Roles */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Roles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Loader', 'Unloader', 'Helper'].map(role => (
            <Link key={role} to={`/worker/role/${role.toLowerCase()}`} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-bold text-green-600 mb-2">{role}</h3>
              <p className="text-gray-600">Find {role.toLowerCase()} jobs near you.</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Locations */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-white rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Locations</h2>
        <div className="flex flex-wrap gap-4">
          {['Kolkata', 'Barrackpore', 'Howrah'].map(loc => (
            <Link key={loc} to={`/worker/location/${loc.toLowerCase()}`} className="px-6 py-2 bg-gray-100 rounded-full text-gray-800 hover:bg-green-100 transition">
              {loc}
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Work With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-bold mb-2">Flexible Hours</h3>
            <p className="text-gray-600">Work when you want, where you want.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Daily Payouts</h3>
            <p className="text-gray-600">Get paid directly to your wallet every day.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Verified Jobs</h3>
            <p className="text-gray-600">Safe, secure, and verified opportunities.</p>
          </div>
        </div>
      </section>

      {/* Worker CTA */}
      <section className="bg-gray-900 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start earning?</h2>
        <p className="text-xl mb-8">Download the Worker App and get verified today.</p>
        <button className="bg-green-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-green-500 transition">Download App</button>
      </section>
    </main>
  );
}
