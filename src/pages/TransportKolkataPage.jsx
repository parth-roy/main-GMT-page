import React from "react"
import { Link } from "react-router-dom"
import CityTransportPage from "../components/CityTransportPage"

const kolkataAreas = [
  "Park Street", "Salt Lake (Bidhannagar)", "New Town (Rajarhat)", "Howrah", "Dum Dum",
  "Behala", "Tollygunge", "Jadavpur", "Kasba", "Garia", "Barasat", "Barrackpore",
  "Ballygunge", "Kalighat", "Ultadanga", "Bagbazar", "Shyambazar", "Maniktala",
  "Entally", "Phoolbagan", "Kankurgachi", "Topsia", "Tiljala", "Tangra",
]

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Transport Services in Kolkata — GoMyTruck",
    "provider": { "@type": "Organization", "name": "GoMyTruck", "url": "https://gomytruck.com" },
    "areaServed": { "@type": "City", "name": "Kolkata", "sameAs": "https://en.wikipedia.org/wiki/Kolkata" },
    "serviceType": "Goods Transport, Truck Booking, Last-Mile Delivery, Packers and Movers",
    "description": "Request mini trucks, Tata Ace, larger goods vehicles, bike delivery, or a moving quote in Kolkata. Review serviceability and route-based pricing before confirming."
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gomytruck.com" },
      { "@type": "ListItem", "position": 2, "name": "Goods Transport Services", "item": "https://gomytruck.com/goods-transport-services" },
      { "@type": "ListItem", "position": 3, "name": "Transport Services in Kolkata", "item": "https://gomytruck.com/kolkata/truck-booking" }
    ]
  }
]

export default function TransportKolkataPage() {
  const customFaqs = (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group bg-white border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
            <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
              How do I book transport services in Kolkata?
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Booking is fast and easy with GoMyTruck. Simply visit our website, enter your pickup and drop locations in Kolkata, choose your required vehicle (like a Mini Truck, Tata Ace, or Full Truck Load), and confirm. You can also book by talking to drivers directly or sending a WhatsApp message.
            </p>
          </details>
          <details className="group bg-white border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
            <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
              What are the truck booking charges in Kolkata?
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <p className="mt-4 text-slate-600 leading-relaxed">
              The estimate uses the route, vehicle, duration, current pricing configuration, declared goods and optional services. Review the component breakdown and any stated toll or waiting treatment before confirming.
            </p>
          </details>
          <details className="group bg-white border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
            <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
              Do you provide intercity transport from Kolkata?
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Yes! Alongside local city transport, GoMyTruck provides comprehensive intercity transport services from Kolkata to major hubs across West Bengal and India. We handle Full Truck Load (FTL) and Part Truck Load (PTL) requirements.
            </p>
          </details>
          <details className="group bg-white border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
            <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
              Are your drivers and trucks verified?
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <p className="mt-4 text-slate-600 leading-relaxed">
              GoMyTruck collects and reviews the identity, driving and vehicle documents applicable to each partner role. This onboarding review reduces risk but is not a guarantee against delay, loss, damage or misconduct.
            </p>
          </details>
        </div>
      </div>
    </section>
  )

  return (
    <CityTransportPage
      city="Kolkata"
      slug="kolkata"
      canonical="/kolkata/truck-booking"
      headline="Transport Services in Kolkata"
      subheadline="Request a mini truck, Tata Ace, bike delivery, or moving quote in Kolkata. Review route-based pricing and current availability."
      description="Request transport services in Kolkata, including mini trucks, Tata Ace, larger goods vehicles, eligible bike delivery, and scoped moving quotes."
      keywords="transport services Kolkata, truck booking Kolkata, goods transport Kolkata, mini truck Kolkata, logistics company Kolkata, movers and packers Kolkata, transport company Kolkata, cargo delivery Kolkata, tempo service Kolkata, freight services Kolkata, same day delivery Kolkata, truck rental Kolkata"
      areas={kolkataAreas}
      jsonLd={schema}
      customFaqs={customFaqs}
    >
      <h2>Reliable and Fast Transport Services in Kolkata</h2>
      <p>
        Navigating the streets of Kolkata requires route, access and vehicle details to be captured accurately. <strong>GoMyTruck</strong> is a digital marketplace for <strong>transport requests in Kolkata</strong>, connecting customers with eligible driver and fleet partners. Assignment, pickup time and trip outcome depend on the declared load, route and current partner availability.
      </p>
      <p>
        The web flow supports requests ranging from an eligible <Link to="/bike">bike delivery</Link> to a <Link to="/kolkata/mini-truck-booking">mini truck</Link> or a larger goods vehicle. The current estimate and its available components are shown before confirmation; route changes, tolls, waiting and service-scope changes can affect trip actuals.
      </p>

      <h3>How the GoMyTruck Kolkata Workflow Helps</h3>
      <p>
        Kolkata transport requirements vary by route, goods, access, vehicle, and timing. The platform is designed to collect those details before confirmation:
      </p>
      <ul>
        <li><strong>Online Request:</strong> Enter both addresses, choose a vehicle, declare the goods, and state optional workforce needs before partner matching starts.</li>
        <li><strong>Pricing Breakdown:</strong> Review the available base, distance, time, fuel, demand, workforce, and tax components plus any stated toll or waiting treatment.</li>
        <li><strong>Vehicle options:</strong> Compare options such as a <strong><Link to="/kolkata/tata-ace-booking">Tata Ace</Link></strong>, pickup or larger truck. Eligibility is checked against declared weight, dimensions, route and availability.</li>
        <li><strong>Trip Visibility:</strong> Supported active bookings can provide trip-status and location updates after a partner is assigned.</li>
        <li><strong>Partner Review:</strong> Applicable identity, driving, and vehicle documents are collected during onboarding. This reduces risk but is not a performance guarantee.</li>
      </ul>

      <h3>Comprehensive Goods Transport Solutions</h3>
      <p>
        At GoMyTruck, we cater to a diverse array of logistics needs under one roof. Our <strong><Link to="/kolkata/goods-transport">goods transport services in Kolkata</Link></strong> are categorized to serve different use cases efficiently:
      </p>

      <h4>1. Mini Truck & Tata Ace Booking</h4>
      <p>
        For intra-city transport of light to medium goods, nothing beats the agility of a mini truck. Whether it's shifting a 1 BHK, delivering FMCG products to retailers, or transporting electronics, booking a Tata Ace or <Link to="/kolkata/pickup-truck-booking">Pickup Truck</Link> ensures fast navigation through Kolkata's dense traffic.
      </p>

      <h4>2. Full Truck Load (FTL) Services</h4>
      <p>
        Manufacturing hubs in Howrah, Barrackpore, and industrial estates around Kolkata rely on our robust FTL transport services. We provide heavy commercial vehicles capable of moving raw materials, construction supplies, and finished products directly from factories to distribution centers across the state and beyond.
      </p>

      <h4>3. Professional Packers and Movers</h4>
      <p>
        Moving to a new home or relocating an office? Our dedicated Packers and Movers team handles the heavy lifting. We provide premium packing materials, careful loading, safe transit, and careful unloading, ensuring your valuable furniture and appliances remain scratch-free. 
      </p>

      <h4>4. B2B and Enterprise Logistics</h4>
      <p>
        We partner with SMEs and large corporations to streamline their supply chain. Our <Link to="/fleet-partner-registration">fleet partners</Link> work on dedicated contracts, providing reliable daily distribution services for retail, e-commerce, and manufacturing sectors.
      </p>

      <h3>Intercity and Local Transport</h3>
      <p>
        While we excel in <strong><Link to="/local-transport/kolkata">local transport services within Kolkata</Link></strong>, our network stretches far beyond the city limits. We provide highly efficient <strong><Link to="/intercity/kolkata">intercity transport from Kolkata</Link></strong> to destinations like Asansol, Durgapur, Siliguri, Haldia, and neighboring states. Whether it is a single factory shipment or regular regional distribution, we maintain the same high standards of punctuality and safety.
      </p>

      <div className="my-10 bg-brand-50 border border-brand-200 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mt-0 mb-4">Ready to Book Your Truck?</h3>
        <p className="text-slate-600 mb-6">
          Enter the Kolkata route and declared load to review a current estimate and check partner availability.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/book-truck-online" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
            Book Truck Online
          </Link>
          <a href="https://wa.me/919331488999?text=Hello%20Sir%2FMa'am%20%F0%9F%91%8B%0A%0AThank%20you%20for%20contacting%20GoMyTruck.%0A%0AKindly%20share%20the%20following%20details%3A%0A%0A%F0%9F%93%8D%20Pickup%20Location%3A%0A%F0%9F%93%8D%20Drop%20Location%3A%0A%F0%9F%93%A6%20Goods%20Type%3A%0A%E2%9A%96%20Approx%20Weight%3A%0A%F0%9F%9A%9A%20Truck%20Required%3A%0A%F0%9F%93%85%20Loading%20Date%20%26%20Time%3A%0A%F0%9F%92%B0%20Budget%20(if%20any)%3A%0A%F0%9F%91%A4%20Contact%20Person%3A%0A%F0%9F%93%9E%20Contact%20Number%3A%0A%0AOnce%20received%2C%20we'll%20arrange%20the%20best%20verified%20truck%20for%20you." target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
            Book via WhatsApp
          </a>
        </div>
      </div>
    </CityTransportPage>
  )
}
