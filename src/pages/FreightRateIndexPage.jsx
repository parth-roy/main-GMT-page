import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { TrendingUp, Truck, BarChart3, Info, ArrowRight } from "lucide-react"
import SEOHead from "../seo/SEOHead"

export default function FreightRateIndexPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const title = "Eastern India Freight Rate Index (Q3 2026) | GoMyTruck"
  const description = "Track the latest Eastern India Freight Rate Index. See current truck freight rates, historical trends, and price forecasts for Kolkata, Guwahati, Patna, and Bhubaneswar routes."
  const canonical = "/freight-rate-index"

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gomytruck.com/" },
        { "@type": "ListItem", position: 2, name: "Freight Rate Index", item: `https://gomytruck.com${canonical}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": "Eastern India Freight Rate Index (Q3 2026)",
      "description": "Quarterly freight rate index and market trends for major transport routes originating from Eastern India.",
      "license": "https://creativecommons.org/licenses/by/4.0/",
      "creator": {
        "@type": "Organization",
        "name": "GoMyTruck"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Organization",
        "name": "GoMyTruck"
      },
      "publisher": {
        "@type": "Organization",
        "name": "GoMyTruck",
        "logo": {
          "@type": "ImageObject",
          "url": "https://gomytruck.com/logo.png"
        }
      },
      "datePublished": "2026-08-01"
    }
  ]

  const rateData = [
    { route: "Kolkata to Guwahati", vehicle: "32ft Container", avgRate: "₹85,000", trend: "+2.5%", demand: "High" },
    { route: "Kolkata to Patna", vehicle: "20ft Truck", avgRate: "₹35,000", trend: "-1.0%", demand: "Medium" },
    { route: "Kolkata to Bhubaneswar", vehicle: "14ft Truck", avgRate: "₹22,000", trend: "Stable", demand: "High" },
    { route: "Guwahati to Siliguri", vehicle: "17ft Truck", avgRate: "₹28,000", trend: "+3.2%", demand: "High" },
    { route: "Patna to Ranchi", vehicle: "20ft Truck", avgRate: "₹24,500", trend: "+1.5%", demand: "Medium" }
  ]

  return (
    <div className="bg-white min-h-screen pt-20">
      <SEOHead title={title} description={description} canonical={canonical} jsonLd={jsonLd} />

      <nav aria-label="Breadcrumb" className="border-b border-slate-200">
        <ol className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 text-sm text-slate-500 flex-wrap">
          <li><Link to="/" className="hover:text-brand-700">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-slate-900">Freight Rate Index</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="bg-slate-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-300 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={18} /> Q3 2026 Market Report
          </p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl">Eastern India Freight Rate Index</h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-3xl">
            Stay ahead of the market with our quarterly analysis of truck freight rates across key corridors in Eastern India. Track pricing trends and plan your logistics budget with confidence.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 bg-brand-700/30 border border-brand-500/40 rounded-full px-4 py-1.5">
            <span className="text-brand-300 font-black text-sm">Updated August 2026</span>
          </div>
        </div>
      </header>

      <main>
        {/* Key Fact */}
        <section className="py-10 bg-brand-50 border-b border-brand-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4 items-start">
            <Info size={28} className="text-brand-600 mt-1 shrink-0" />
            <p className="text-slate-700 font-semibold text-lg leading-relaxed">
              <span className="text-brand-700 font-black">Market Highlight: </span>
              The average freight rate for a 32ft container from Kolkata to Guwahati is ₹85,000. GoMyTruck facilitates this at a transparent 5% platform commission.
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2 mb-4">
                <BarChart3 size={24} className="text-brand-600 shrink-0" />
                Q3 2026 Average Freight Rates
              </h2>
              <p className="text-slate-700 text-lg leading-relaxed mb-6">
                The Eastern India logistics market is experiencing stable growth with slight seasonal fluctuations. Key routes like Kolkata to Guwahati are seeing high demand due to pre-festive stocking.
              </p>
              
              <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Route</th>
                      <th className="px-6 py-4">Vehicle Type</th>
                      <th className="px-6 py-4">Avg. Rate</th>
                      <th className="px-6 py-4">QoQ Trend</th>
                      <th className="px-6 py-4">Demand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rateData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                          <img src="/google-maps-icon.webp" alt="Route" width={16} height={16} className="w-4 h-4 object-contain shrink-0" />
                          {row.route}
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <Truck size={16} className="text-slate-400" />
                          {row.vehicle}
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-slate-800">{row.avgRate}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${row.trend.startsWith('+') ? 'bg-red-50 text-red-700' : row.trend.startsWith('-') ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                            {row.trend}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${row.demand === 'High' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                            {row.demand}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2 mb-4">
                Market Analysis & Forecast
              </h2>
              <div className="space-y-4 text-slate-700 text-lg leading-relaxed">
                <p>
                  <strong>Kolkata to North-East Corridor:</strong> We observe a 2.5% increase in rates for 32ft containers bound for Guwahati, driven by infrastructure projects and FMCG restocking. The backhaul (Guwahati to Siliguri/Kolkata) remains slightly softer, though rates for 17ft trucks have firmed up.
                </p>
                <p>
                  <strong>Bihar & Jharkhand Lanes:</strong> Rates for Kolkata to Patna and Ranchi are largely stable. There is a slight dip in 20ft truck pricing due to increased fleet availability in the region, making it an optimal time for bulk commodity shippers to secure contracts.
                </p>
                <p>
                  <strong>Odisha Sector:</strong> The Kolkata to Bhubaneswar route continues to show robust, stable pricing with high demand for 14ft trucks. Industrial supplies and consumer durables dominate this corridor.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Get Real-Time Rates for Your Route</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Our dynamic pricing engine provides instant, transparent freight estimates based on live market conditions. Book your truck today and save with our flat 5% platform commission.
            </p>
            <Link to="/book-truck-online" className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-brand-700 transition-colors shadow-sm">
              Get an Instant Quote <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
