import React from "react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <Helmet>
        <title>Page Not Found | GoMyTruck</title>
        <meta name="description" content="The page you are looking for does not exist or has been moved." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <h1 className="text-6xl font-display font-extrabold text-brand-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Page Not Found</h2>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        We couldn't find the page you're looking for. It might have been removed, renamed, or is temporarily unavailable.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link to="/" className="px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors">
          Go to Homepage
        </Link>
        <Link to="/contact" className="px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
          Contact Support
        </Link>
      </div>
    </div>
  )
}
