import React from "react"
import { Link } from "react-router-dom"
import { PhoneCall } from "lucide-react"

export default function SecondaryContact() {
  return (
    <section className="w-full bg-slate-100 py-16 lg:py-24 border-y border-slate-200 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Left Column: 2D Illustration */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <img 
              src="/enterprise_contact_illustration_v2.webp" 
              alt="Logistics Delivery Illustration" 
              className="w-full max-w-lg lg:scale-110 object-contain drop-shadow-2xl"
            />
          </div>

          {/* Right Column: Text & CTA */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 uppercase tracking-tight">
              Ready to Scale Your Deliveries?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              Share the routes, shipment profile, frequency, vehicle classes, reporting needs, and operational constraints. The team will confirm feasible coverage, integrations, account support, and any service level in a written commercial scope.
            </p>
            
            <div className="pt-4">
              <a href="#enterprise-enquiry" className="inline-flex items-center gap-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-base px-6 py-3.5 rounded-full shadow-lg shadow-brand-500/30 transition-all duration-300 hover:-translate-y-1 group">
                <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                  <PhoneCall size={18} className="text-white" />
                </div>
                <span>Request Callback</span>
              </a>
            </div>
            
            <p className="text-slate-500 text-sm mt-4">
              Or connect directly with drivers: <Link to="/direct-driver-contact?openModal=true" className="text-brand-600 font-bold hover:underline">Talk to Drivers</Link>
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}
