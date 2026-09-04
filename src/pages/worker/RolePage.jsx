import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DirectDriverContactBanner from '../../components/common/DirectDriverContactBanner';

export default function RolePage() {
  const { role } = useParams();
  const title = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Worker';

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Role hero */}
      <section className="bg-green-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">{title} Jobs</h1>
        <p className="text-xl">Everything you need to know about being a {title}.</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {/* Floating Direct Driver & Partner Contact Card */}
        <DirectDriverContactBanner categoryName={`${title} & Transporters`} />

        {/* Definition */}
        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">What is a {title}?</h2>
          <p className="text-gray-700 leading-relaxed">
            A {title} plays a crucial role in the logistics and transport supply chain, ensuring that goods are handled safely and efficiently.
          </p>
        </section>

        {/* Responsibilities */}
        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Key Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Safely handle goods according to instructions.</li>
            <li>Coordinate with drivers and supervisors on-site.</li>
            <li>Maintain a safe and organized work environment.</li>
            <li>Report any damages or discrepancies immediately.</li>
          </ul>
        </section>

        {/* Requirements */}
        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Requirements</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Physical stamina and ability to lift heavy items.</li>
            <li>Valid identification for background verification.</li>
            <li>Basic communication skills.</li>
            <li>Smartphone for the Worker App.</li>
          </ul>
        </section>

        {/* Work context */}
        <section className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Work Context</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Work usually takes place at warehouses, delivery hubs, or customer locations. Conditions vary based on the specific job request.
          </p>
          <Link to={`/worker/jobs?role=${title.toLowerCase()}`} className="inline-block bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">
            View Available {title} Jobs
          </Link>
        </section>
      </div>
    </main>
  );
}
