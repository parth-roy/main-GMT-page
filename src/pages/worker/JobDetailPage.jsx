import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function JobDetailPage() {
  const { jobId } = useParams();

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Job Header */}
        <section className="bg-white p-8 rounded-t-lg shadow border-b mt-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Warehouse Loader Required</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-gray-200 rounded-full"></span>
                Kolkata Industrial Park
              </p>
            </div>
            <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm">
              Urgent
            </span>
          </div>
        </section>

        {/* Details & Compensation */}
        <section className="bg-white p-8 shadow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-b pb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="font-bold text-gray-900">Loader</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="font-bold text-gray-900">8 Hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Workers Needed</p>
              <p className="font-bold text-gray-900">4</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Compensation</p>
              <p className="font-bold text-green-600">₹600 / shift</p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Job Description</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We are looking for physically fit and reliable loaders to help move packaged goods from our warehouse staging area onto delivery trucks. Safety gear will be provided on-site.
          </p>

          <h2 className="text-xl font-bold mb-4">Requirements</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
            <li>Must have active worker profile on app.</li>
            <li>Ability to lift up to 25kg safely.</li>
            <li>Punctuality is strictly enforced.</li>
          </ul>
        </section>

        {/* How to Apply */}
        <section className="bg-gray-50 p-8 rounded-b-lg shadow border-t flex flex-col items-center text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">How to Apply</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Open the Worker App to accept this job instantly. If you don't have the app yet, download it to get verified and start earning.
          </p>
          <div className="flex gap-4">
            <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition">
              Open in App
            </button>
            <Link to="/worker" className="bg-white text-gray-800 border px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition">
              Learn More
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
