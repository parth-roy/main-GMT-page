import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import SEOHead from "../seo/SEOHead"
import PartnerHero from "../components/PartnerHero"
import PartnerBenefits from "../components/PartnerBenefits"
import PartnerVehicles from "../components/PartnerVehicles"
import PartnerHowItWorks from "../components/PartnerHowItWorks"

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Fleet Partner Registration — GoMyTruck",
    "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
    "areaServed": "India",
    "serviceType": "Fleet Partner Registration, Truck Attachment, Fleet Owner Onboarding",
    "description": "Apply to register eligible commercial vehicles with GoMyTruck, review available loads, bid where enabled, and manage accepted work. Availability and earnings vary by demand."
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
      { "@type": "ListItem", "position": 2, "name": "Fleet Partner Registration", "item": "https://gomytruck.com/fleet-partner-registration" }
    ]
  }
]

export default function FleetPartnerPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <>
      <SEOHead
        title="Rent Out My Truck | Fleet Partner Registration & Attach Trucks - GoMyTruck"
        description="Fleet owners can apply to register eligible vehicles, review available loads, bid where enabled, and manage accepted trips. Rent out my truck and earn with GoMyTruck today."
        canonical="/fleet-partner-registration"
        keywords="rent out my truck, fleet partner registration, fleet owner registration, attach truck to company, commercial vehicle registration, attach fleet to GoMyTruck, go my truck, gomy truck, go mytruck, my truck, truck booking, truck owner earn money, logistics fleet partner"
        jsonLd={schema}
      />
      
      <main className="font-sans">
        <PartnerHero isFleetOwner={true} />
        <PartnerVehicles />
        <PartnerHowItWorks />
        <PartnerBenefits />
        {/* Note: I'm omitting PartnerFAQ here because this page already has a custom FAQ below in the SEO article */}
      </main>

      {/* SEO Article & FAQs */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate prose-lg">
          <h2 className="text-3xl font-bold text-slate-900 mt-0 mb-6 text-center">Join the GoMyTruck Fleet Partner Program</h2>
          <p>
            Independent fleet owners often need a clearer way to discover loads, compare trip terms, and coordinate drivers. By applying for <strong>Fleet Partner Registration</strong>, eligible owners can attach commercial vehicles to the GoMyTruck platform and review work that matches current route and vehicle requirements.
          </p>
          <p>
            Whether you own one <Link to="/kolkata/tata-ace-booking" className="text-brand-600 font-semibold hover:underline">Tata Ace</Link> or manage several commercial vehicles, the platform can show eligible fixed-price or private-bid loads. Registration, approval, load availability, earnings, and settlement are never guaranteed.
          </p>
          
          <h3 className="text-2xl font-semibold text-slate-800 mt-10 mb-4">Why Attach Your Fleet to GoMyTruck?</h3>
          <p>
            The fleet workflow is designed to provide clearer trip information and operating control:
          </p>
          <ul className="space-y-2 mb-8">
            <li><strong>Eligible Load Discovery:</strong> Review matching local or <Link to="/intercity/kolkata" className="text-brand-600 font-semibold hover:underline">intercity transport</Link> opportunities when customer demand and vehicle requirements align.</li>
            <li><strong>Clear Trip Terms:</strong> Review the route, goods declaration, workforce requirement, and quoted or awarded amount before committing a vehicle.</li>
            <li><strong>Private Bidding:</strong> Where enabled, submit sealed bids, revisions, and messages before a customer awards the load.</li>
            <li><strong>Earnings Records:</strong> Approved earnings are recorded internally. Digital withdrawals and fleet-to-driver transfers are currently paused until those payment capabilities are enabled and certified.</li>
            <li><strong>Complete Control:</strong> You decide your operating routes. Whether you want your trucks running locally within Kolkata, or across West Bengal to Durgapur and Asansol, our Partner App lets you choose loads that fit your fleet's schedule.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-slate-800 mt-10 mb-4">Which Vehicles Can Be Attached?</h3>
          <p>
            We accommodate almost every commercial vehicle category in our network to meet the diverse <Link to="/kolkata/goods-transport" className="text-brand-600 font-semibold hover:underline">goods transport</Link> needs of our clients:
          </p>
          <ol className="space-y-4 mb-8">
            <li><strong>Light Commercial Vehicles (LCV):</strong> Tata Ace (Chota Hathi), Mahindra Maxximo, Ashok Leyland Dost, and Piaggio Ape. Perfect for intracity logistics.</li>
            <li><strong>Medium Commercial Vehicles (MCV):</strong> <Link to="/kolkata/pickup-truck-booking" className="text-brand-600 font-semibold hover:underline">Bolero Pickup</Link>, Tata 407, and 14-ft Eicher trucks. Ideal for mid-mile distribution and heavy B2B deliveries.</li>
            <li><strong>Heavy Commercial Vehicles (HCV):</strong> 17-ft, 19-ft, 22-ft containers, and open-body trucks for long-haul intercity freight.</li>
          </ol>

          <h3 className="text-2xl font-semibold text-slate-800 mt-10 mb-4">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-4 not-prose mt-6">
            <details className="group bg-white border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
                Is there any registration fee to become a Fleet Partner?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                The current application form does not collect an upfront registration payment. Review the latest partner agreement and any load-specific platform fee before accepting work.
              </p>
            </details>
            <details className="group bg-white border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
                What documents are required for registration?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                You will need to provide standard commercial vehicle documentation: RC Book, Fitness Certificate, Commercial Insurance, Pollution Under Control (PUC) certificate, and the driving license/Aadhar card of the assigned driver.
              </p>
            </details>
            <details className="group bg-white border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
                Can I attach a vehicle if I am an individual driver-owner?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Absolutely! Our platform is open to large transport companies and independent driver-owners alike. Whether you drive your own truck or hire drivers, you are welcome to join.
              </p>
            </details>
            <details className="group bg-white border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
                How do I receive trip requests?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                After approval, eligible loads can appear in the partner or fleet workflow based on vehicle, route, and demand. You may accept a fixed-price assignment or bid where private bidding is enabled.
              </p>
            </details>
          </div>

          <div className="my-10 bg-brand-50 border border-brand-200 rounded-2xl p-8 text-center not-prose">
            <h3 className="text-2xl font-bold text-slate-900 mt-0 mb-4">Apply to Join the Fleet Network</h3>
            <p className="text-slate-600 mb-6">
              Submit your fleet details for review. Approval and available loads depend on eligibility, location, vehicle type, and customer demand.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://play.google.com/store/apps/details?id=com.gomytruck.partner" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
                Download Partner App
              </a>
              <a href="https://wa.me/919331488999?text=Hello%20Sir%2FMa'am%20%F0%9F%91%8B%0A%0AThank%20you%20for%20contacting%20GoMyTruck.%0A%0AKindly%20share%20the%20following%20details%3A%0A%0A%F0%9F%93%8D%20Pickup%20Location%3A%0A%F0%9F%93%8D%20Drop%20Location%3A%0A%F0%9F%93%A6%20Goods%20Type%3A%0A%E2%9A%96%20Approx%20Weight%3A%0A%F0%9F%9A%9A%20Truck%20Required%3A%0A%F0%9F%93%85%20Loading%20Date%20%26%20Time%3A%0A%F0%9F%92%B0%20Budget%20(if%20any)%3A%0A%F0%9F%91%A4%20Contact%20Person%3A%0A%F0%9F%93%9E%20Contact%20Number%3A%0A%0AOnce%20received%2C%20we'll%20arrange%20the%20best%20verified%20truck%20for%20you." target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
