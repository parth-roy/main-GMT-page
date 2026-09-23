import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Minus,
  Truck,
  ArrowRight,
  CheckCircle,
  BadgeCheck,
} from 'lucide-react';
import SEOHead from '../seo/SEOHead';

/* ─────────────────────────── JSON-LD ─────────────────────────── */
const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'GoMyTruck Truck Booking Service – Pricing',
    provider: {
      '@type': 'Organization',
      name: 'GoMyTruck',
      url: 'https://gomytruck.com',
      telephone: '+916291957542',
      email: 'hello@parthertech.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Chiriyamore, Barrackpore',
        addressLocality: 'North 24 Parganas',
        addressRegion: 'West Bengal',
        postalCode: '700120',
        addressCountry: 'IN',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Kolkata',
    },
    description:
      'Pricing guide for GoMyTruck route-based logistics estimates. The booking flow shows the current fare components before confirmation.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://gomytruck.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Pricing',
        item: 'https://gomytruck.com/pricing',
      },
    ],
  },
];

/* ─────────────────────────── Data ─────────────────────────── */
import { fetchVehicles } from '../api/pricingApi';

const VEHICLE_VISUALS = {
  BIKE: { emoji: '🛵', color: 'from-sky-50 to-white', accent: 'bg-sky-100 text-sky-700', bestFor: 'Documents & light parcels' },
  '3_WHEELER': { emoji: '🛺', color: 'from-violet-50 to-white', accent: 'bg-violet-100 text-violet-700', bestFor: 'Small goods & furniture' },
  TATA_ACE: { emoji: '🚐', color: 'from-brand-50 to-white', accent: 'bg-brand-100 text-brand-700', bestFor: 'Business delivery & shop stock', popular: true },
  MINI_TRUCK: { emoji: '🚛', color: 'from-amber-50 to-white', accent: 'bg-amber-100 text-amber-700', bestFor: 'Large shifting & FTL loads' },
  TRUCK_14FT: { emoji: '🚚', color: 'from-blue-50 to-white', accent: 'bg-blue-100 text-blue-700', bestFor: 'Commercial goods & large moves' },
  TRUCK_17FT: { emoji: '🚚', color: 'from-indigo-50 to-white', accent: 'bg-indigo-100 text-indigo-700', bestFor: 'Commercial goods & heavy loads' },
  TRUCK_20FT: { emoji: '🚚', color: 'from-teal-50 to-white', accent: 'bg-teal-100 text-teal-700', bestFor: 'Industrial cargo & wholesale' },
  CONTAINER_32FT: { emoji: '🏗️', color: 'from-slate-100 to-white', accent: 'bg-slate-200 text-slate-800', bestFor: 'Container & bulk freight' },
};

const howItWorks = [
  {
    icon: <CheckCircle className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />,
    heading: 'Route and vehicle form the starting point',
    body: 'The pricing engine starts with the active vehicle configuration, route distance and estimated duration, then applies the current commercial rules.',
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />,
    heading: 'Review every applicable component',
    body: 'The estimate can include base, distance, time, fuel adjustment, demand adjustment, GST, waiting, toll, labour and optional protection where relevant.',
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />,
    heading: 'Estimate first, final trip amount after actuals',
    body: 'Review the estimate before confirmation. Changes to the route, waiting time, tolls, declared load or requested services can affect the final payable amount.',
  },
];

const faqs = [
  {
    q: 'How is the truck booking fare calculated?',
    a: 'The estimate uses the active vehicle configuration, route distance, estimated duration and current pricing rules. Applicable fuel adjustment, demand adjustment, minimum platform price, GST, toll, waiting, labour and optional protection are shown in the booking breakdown.',
  },
  {
    q: 'Are there any hidden charges in truck booking?',
    a: 'GoMyTruck displays the fare components available at confirmation. The final amount can change for actual tolls, waiting, route or service-scope changes; these should appear in the trip record or invoice.',
  },
  {
    q: 'What if the route changes mid-trip?',
    a: 'A route or destination change can affect distance, duration, tolls and the final amount. Agree the change through the supported trip workflow and review the updated record or invoice instead of relying on a generic per-kilometre promise.',
  },
  {
    q: 'Is loading and unloading included in the price?',
    a: 'Loading and unloading assistance is separate unless the booking explicitly includes linked workforce. Select the required workforce type and count so the server can include the applicable amount in the estimate.',
  },
  {
    q: 'Do truck booking prices vary by time of day?',
    a: 'The backend currently returns the demand multiplier configured for the estimate; dynamic surge logic is not yet active. If this capability is enabled later, the booking breakdown must show the applied adjustment before confirmation.',
  },
];

/* ─────────────────────────── Sub-components ─────────────────── */

function PricingCard({ vehicle }) {
  const {
    displayName,
    vehicleType,
    baseFare,
    pricePerKm,
    minFare,
    capacityDesc,
  } = vehicle;

  const visual = VEHICLE_VISUALS[vehicleType] || {
    emoji: '🚛', color: 'from-slate-50 to-white', accent: 'bg-slate-100 text-slate-700', bestFor: 'General transport'
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border ${
        visual.popular
          ? 'border-brand-500 shadow-xl shadow-brand-100 scale-[1.02]'
          : 'border-slate-200 shadow-md hover:shadow-xl'
      } bg-gradient-to-b ${visual.color} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
    >
      {/* Popular badge */}
      {visual.popular && (
        <div className="absolute top-0 inset-x-0 flex justify-center">
          <span className="inline-flex items-center gap-1 bg-brand-600 text-white text-xs font-semibold px-4 py-1 rounded-b-xl tracking-wide">
            <BadgeCheck className="w-3.5 h-3.5" />
            Most Popular
          </span>
        </div>
      )}

      <div className={`p-6 ${visual.popular ? 'pt-9' : ''} flex flex-col gap-4 grow`}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">{visual.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {displayName}
            </h3>
            <span
              className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${visual.accent}`}
            >
              {capacityDesc}
            </span>
          </div>
        </div>

        {/* Fare details */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white rounded-xl py-3 px-1 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Base Fare</p>
            <p className="text-xl font-extrabold text-slate-900">
              &#8377;{baseFare}
            </p>
          </div>
          <div className="bg-white rounded-xl py-3 px-1 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Per Km</p>
            <p className="text-xl font-extrabold text-brand-600">
              &#8377;{pricePerKm}
            </p>
          </div>
          <div className="bg-white rounded-xl py-3 px-1 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Min Fare</p>
            <p className="text-xl font-extrabold text-slate-900">
              &#8377;{minFare}
            </p>
          </div>
        </div>

        {/* Best for */}
        <p className="text-sm text-slate-600 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
          <span>
            <span className="font-semibold text-slate-700">Best for: </span>
            {visual.bestFor}
          </span>
        </p>

        {/* CTA */}
        <div className="mt-auto pt-2">
          <Link
            to={`/book-truck-online?vehicle=${vehicleType}`}
            className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
              visual.popular
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'bg-slate-900 text-white hover:bg-slate-700'
            }`}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-slate-800 text-sm sm:text-base">
          {faq.q}
        </span>
        <span className="shrink-0 text-brand-600">
          {isOpen ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 bg-slate-50 border-t border-slate-100">
          <p className="text-slate-600 text-sm leading-relaxed pt-3">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Fetch live vehicle pricing data
    fetchVehicles()
      .then(data => setVehicles(data))
      .catch(err => console.error('Error fetching vehicles:', err));
  }, []);

  const toggleFaq = (idx) => setOpenFaq((prev) => (prev === idx ? null : idx));

  return (
    <>
      <SEOHead
        title="Truck Booking Charges in Kolkata | Fare Calculator & Pricing Guide"
        description="Learn how GoMyTruck builds route-based estimates for 3-wheelers, Tata Ace, mini trucks and larger goods vehicles, then request the current fare online."
        canonical="/pricing"
        keywords="truck booking charges, truck booking fare, mini truck rent per km, Tata Ace rent price, transport charges Kolkata, logistics pricing, truck rental rates India, freight cost calculator, tempo rent charges"
        jsonLd={jsonLd}
      />

      {/* ── Hero ── */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <Truck className="w-3.5 h-3.5" />
            Route-based estimate
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Understand Your Truck Booking Estimate{' '}
            <span className="text-brand-400">Before You Confirm</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            From bike deliveries to full-size mini trucks, every fare on
            GoMyTruck uses route, vehicle and trip conditions to build an estimate.
            Review its components and the conditions that can change the final amount.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/book-truck-online"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors"
            >
              Get Fare Estimate <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/truck"
              className="inline-flex items-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-7 py-3 rounded-xl transition-colors"
            >
              View Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* ── Breadcrumb ── */}
      <nav
        aria-label="Breadcrumb"
        className="bg-slate-50 border-b border-slate-200 px-4 py-2.5"
      >
        <ol className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <li>
            <Link to="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-slate-800 font-medium">Pricing</li>
        </ol>
      </nav>

      {/* ── Pricing cards ── */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Illustrative Vehicle Pricing Examples
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              These examples explain base, distance and minimum-fare concepts; they are not live quotes. Use the booking flow for the current route-specific estimate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {vehicles.map((v) => (
              <PricingCard key={v.id} vehicle={v} />
            ))}
          </div>

          {/* Legend */}
          <p className="mt-8 text-center text-xs text-slate-400">
            * Illustrative examples only—not a rate card or offer. Current values and all applicable fare components are returned by the live estimate. GST and trip actuals may apply.
          </p>
        </div>
      </section>

      {/* ── How pricing works ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              How Our Pricing Works
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              A clear breakdown of inputs and possible adjustments.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {howItWorks.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-brand-200 transition-colors"
              >
                {item.icon}
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">
                    {item.heading}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fare Calculator Teaser ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-brand-600 to-brand-800">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <BadgeCheck className="w-3.5 h-3.5" />
            Current estimate
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Get Your Current Fare Estimate
          </h2>
          <p className="text-brand-100 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            Enter your pick-up and drop locations, pick a vehicle, and get your
            current route estimate before you confirm a booking.
          </p>
          <Link
            to="/book-truck-online"
            className="inline-flex items-center gap-3 bg-white text-brand-700 font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-brand-50 transition-all duration-200 text-base"
          >
            Calculate My Fare Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-5 text-brand-200 text-xs">
            Current price rules &middot; Route-based estimate &middot; Review before confirming
          </p>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Pricing FAQs
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Common questions about truck booking charges answered.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <FaqItem
                key={idx}
                faq={faq}
                isOpen={openFaq === idx}
                onToggle={() => toggleFaq(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal links / footer CTA ── */}
      <section className="py-14 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6 text-center">
            Explore More on GoMyTruck
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                to: '/book-truck-online',
                title: 'Book a Truck Online',
                desc: 'Enter route and goods details',
                icon: '📦',
              },
              {
                to: '/truck',
                title: 'All Vehicle Types',
                desc: 'Compare trucks for your load',
                icon: '🚚',
              },
              {
                to: '/mini-truck-booking',
                title: 'Mini Truck Booking',
                desc: 'Tata Ace & tempo on demand',
                icon: '🚐',
              },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-3xl">{link.icon}</span>
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors text-sm">
                    {link.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 ml-auto mt-1 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
