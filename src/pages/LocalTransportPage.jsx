import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Truck,
  Clock,
  Zap,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import { useCity } from '../context/CityContext';
import { SEO_CITIES } from '../lib/cities';


const reasons = [
  {
    icon: <Zap className="w-8 h-8 text-brand-600" />,
    title: 'Save Time',
    body: 'Enter the route and load online, then review the estimate and assignment status in the booking flow.',
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-brand-600" />,
    title: 'Transparent Price',
    body: 'Review the available fare components before payment. Trip actuals and disclosed service changes may affect the final amount.',
  },
  {
    icon: <Truck className="w-8 h-8 text-brand-600" />,
    title: 'Verified Drivers',
    body: 'Identity, licence and vehicle records applicable to the partner role are collected during onboarding.',
  },
];

/* ─── Component ───────────────────────────────────────────────── */
export default function LocalTransportPage() {
  const { city: routeCity } = useParams();
  const { currentCity, setCity } = useCity();

  // Match URL city parameter or fallback to active selected city
  const matchedCity = routeCity ? SEO_CITIES.find((c) => c.slug === routeCity) : null;
  const cityName = matchedCity ? matchedCity.name : currentCity.name;
  const citySlug = matchedCity ? matchedCity.slug : currentCity.slug;
  const stateName = matchedCity ? (matchedCity.state || 'India') : (currentCity.state || 'India');

  // Localized use cases tailored to active city
  const useCases = [
    {
      icon: '\uD83C\uDFE0',
      title: `Home Shifting within ${cityName}`,
      desc: `Request local mini truck or pickup transport for furniture, appliances, and packed cartons across ${cityName}.`,
    },
    {
      icon: '\uD83D\uDED2',
      title: 'Shop & Wholesale Delivery',
      desc: `Deliver commercial stock, raw materials, and retail goods directly to your shop in ${cityName}.`,
    },
    {
      icon: '\uD83D\uDDA5\uFE0F',
      title: 'Office & Workstation Shifting',
      desc: `Relocate computers, desks, files, and commercial inventory smoothly across ${cityName} commercial hubs.`,
    },
    {
      icon: '\uD83C\uDFAA',
      title: 'Industrial & Event Logistics',
      desc: `Move exhibition material, industrial machinery, and event fabrications with fast on-demand dispatch.`,
    },
  ];

  // Dynamic areas list based on city metadata or popular commercial zones
  const areas = (matchedCity?.areas && matchedCity.areas.length > 0)
    ? matchedCity.areas
    : [
        `${cityName} Central`,
        `${cityName} Industrial Area`,
        `${cityName} Wholesale Market`,
        `${cityName} Railway Hub`,
        `${cityName} Bypass Zone`,
        `${cityName} Ring Road Hub`,
        `${cityName} Transport Nagar`,
        `${cityName} Express Corridor`,
      ];

  const stats = [
    { icon: <Clock className="w-7 h-7 text-brand-400" />, value: '~20 min', label: 'Avg. Pickup Time' },
    { icon: <img src="/google-maps-icon.webp" alt="Location" width={28} height={28} className="w-7 h-7 object-contain" />, value: '100% Coverage', label: `Across ${cityName}` },
    { icon: <Zap className="w-7 h-7 text-brand-400" />, value: 'Online', label: 'Instant Booking' },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (matchedCity && currentCity.slug !== matchedCity.slug) {
      setCity({
        name: matchedCity.name,
        slug: matchedCity.slug,
        state: matchedCity.state || 'India',
        region: matchedCity.state || 'India',
      }, false);
    }
  }, [matchedCity, currentCity.slug, setCity]);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Local Transport Services in ${cityName}`,
    description: `Request local goods transport in ${cityName} by mini truck, Tata Ace, tempo, or eligible bike delivery. Check route serviceability and partner availability before confirming.`,
    provider: {
      '@type': 'Organization',
      name: 'GoMyTruck – GoMyTruck',
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
      name: cityName,
    },
    serviceType: 'Intracity Goods Transport',
    url: `https://gomytruck.com/local-transport/${citySlug}`,
  };

  const breadcrumbSchema = {
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
        name: `Local Transport Services - ${cityName}`,
        item: `https://gomytruck.com/local-transport/${citySlug}`,
      },
    ],
  };

  return (
    <>
      <SEOHead
        title={`Local Transport Services in ${cityName} | Truck and Goods Requests`}
        description={`Request local transport in ${cityName} by mini truck, Tata Ace, tempo, or eligible bike delivery. Review the route estimate and current partner availability before confirming.`}
        canonical={`/local-transport/${citySlug}`}
        keywords={`local transport services, local goods transport ${cityName}, same day delivery ${cityName}, local truck booking, local tempo service, local mini truck, goods delivery ${cityName}, intracity transport, local lorry booking, same day truck ${cityName}`}
        jsonLd={[serviceSchema, breadcrumbSchema]}
      />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative bg-slate-900 overflow-hidden">
        {/* decorative gradient blobs */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-600 opacity-20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-brand-500 opacity-10 blur-2xl pointer-events-none"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center gap-6">
          {/* badge */}
          <span className="inline-flex items-center gap-2 bg-brand-600/20 text-brand-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full ring-1 ring-brand-600/40">
            <Zap className="w-3.5 h-3.5" /> Local City Transport
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-3xl">
            Local Transport Services{' '}
            <span className="text-brand-400">in {cityName}</span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Request a mini truck, tempo, or Tata Ace for a declared {cityName} route and load.
            Review the estimate, current availability, and assignment status before relying on a schedule.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              to="/book-truck-online"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-brand-900/40 transition-all duration-200"
            >
              Book Local Truck Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/direct-driver-contact?openModal=true"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl ring-1 ring-white/20 transition-all duration-200"
            >
              📞 Talk to Drivers
            </Link>
          </div>

          {/* trust strip */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-6 text-slate-400 text-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-400" /> Verified Drivers
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-400" /> GPS-Tracked Vehicles
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-400" /> Zero Hidden Charges
            </span>
          </div>
        </div>
      </section>

      {/* ── 3 Reasons Section ──────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              3 Reasons to Book Local Transport Online
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              The online workflow records the route, load, vehicle, and pricing inputs before confirmation.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="group flex flex-col gap-4 p-8 rounded-2xl border border-slate-100 hover:border-brand-200 bg-slate-50 hover:bg-brand-50 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-white shadow-sm group-hover:shadow-brand-100 transition-shadow">
                  {r.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{r.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use-Case Grid ──────────────────────────────────────── */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              What Can You Transport Locally?
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              From home-moving enquiries to event logistics, each request is checked for route, load, vehicle, and partner availability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="flex flex-col gap-3 p-6 bg-white rounded-2xl border border-slate-100 hover:border-brand-300 hover:shadow-lg transition-all duration-200 group"
              >
                <span className="text-4xl">{uc.icon}</span>
                <h3 className="text-base font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                  {uc.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Areas Covered ──────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
              <img src="/google-maps-icon.webp" alt="Location" width={16} height={16} className="w-4 h-4 object-contain shrink-0" /> Service Coverage
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Areas Covered in Kolkata
            </h2>
            <p className="mt-3 text-slate-500 max-w-lg mx-auto">
              These are common Kolkata service-area enquiries. Enter the exact addresses or call the team to check current route serviceability.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {areas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-200 text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-100 transition-colors cursor-default"
              >
                <img src="/google-maps-icon.webp" alt="Location" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0" />
                {area}
              </span>
            ))}
          </div>

          <p className="text-center mt-8 text-slate-500 text-sm">
            Need coverage in another area?{' '}
            <a
              href="https://wa.me/919331488999?text=Hello%20Sir%2FMa'am%20%F0%9F%91%8B%0A%0AThank%20you%20for%20contacting%20GoMyTruck.%0A%0AKindly%20share%20the%20following%20details%3A%0A%0A%F0%9F%93%8D%20Pickup%20Location%3A%0A%F0%9F%93%8D%20Drop%20Location%3A%0A%F0%9F%93%A6%20Goods%20Type%3A%0A%E2%9A%96%20Approx%20Weight%3A%0A%F0%9F%9A%9A%20Truck%20Required%3A%0A%F0%9F%93%85%20Loading%20Date%20%26%20Time%3A%0A%F0%9F%92%B0%20Budget%20(if%20any)%3A%0A%F0%9F%91%A4%20Contact%20Person%3A%0A%F0%9F%93%9E%20Contact%20Number%3A%0A%0AOnce%20received%2C%20we'll%20arrange%20the%20best%20verified%20truck%20for%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 font-semibold hover:underline"
            >
              WhatsApp us →
            </a>
          </p>
        </div>
      </section>

      {/* ── Speed / Stats Section ──────────────────────────────── */}
      <section className="bg-slate-900 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              How Fast Is Local Transport?
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto">
              Speed is our promise. Here&apos;s what you can expect when you book
              with GoMyTruck in Kolkata.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-3 bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-brand-600 transition-colors"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-700">
                  {s.icon}
                </div>
                <span className="text-4xl font-extrabold text-white">
                  {s.value}
                </span>
                <span className="text-slate-400 text-sm text-center">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="bg-brand-600 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Ready to Request Local Transport in Kolkata?
          </h2>
          <p className="text-brand-100 text-lg max-w-xl">
            Enter the route and load online, or call if the requirement needs a manual serviceability review.
          </p>
          <Link
            to="/book-truck-online"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-xl shadow-xl hover:bg-brand-50 active:scale-95 transition-all duration-200"
          >
            Book Local Truck <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── SEO Article & FAQs ───────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate prose-lg">
          <h2 className="text-3xl font-bold text-slate-900 mt-0 mb-6 text-center">Fast & Reliable Local Transport Services in {cityName}</h2>
          <p>
            Navigating the bustling streets and industrial zones of {cityName} requires a logistics partner who understands the local geography. <strong>GoMyTruck</strong> provides dependable <strong>local transport services in {cityName}</strong>, ensuring your goods are moved safely across all major markets, distribution centers, and residential neighborhoods.
          </p>
          <p>
            Local transport supports stock replenishment, residential moves, and distribution work. GoMyTruck collects the exact route, declared goods, vehicle, and handling requirements, calculates a current estimate, and starts partner matching after confirmation. Supported active trips can provide status and location updates.
          </p>
          
          <h3 className="text-2xl font-semibold text-slate-800 mt-10 mb-4">Comprehensive Local Goods Transport Solutions</h3>
          <p>
            We cater to a diverse array of local transport needs. Our services are designed to be flexible, accommodating varying load capacities and route requirements in {cityName}:
          </p>
          <ul className="space-y-2 mb-8">
            <li><strong>House & Room Shifting:</strong> Moving within {cityName}? We provide right-sized vehicles like <Link to={`/${citySlug}/truck-booking/tata-ace`} className="text-brand-600 font-semibold hover:underline">Mini Trucks</Link> and Tata Aces, perfect for shifting 1BHKs, PG luggage, and individual rooms through narrow alleys without a hitch.</li>
            <li><strong>B2B Logistics & Retail Distribution:</strong> For SMEs and wholesalers, we offer dedicated fleet assignments. Transport raw materials to your factory, or distribute finished goods to retailers across {cityName} and nearby industrial estates effortlessly.</li>
            <li><strong>Heavy Commercial Deliveries:</strong> When a Tata Ace isn't enough, book our sturdy <Link to={`/${citySlug}/truck-booking/bolero-pickup`} className="text-brand-600 font-semibold hover:underline">Pickup Trucks</Link> (like the Bolero Pickup) or 14-ft Eicher trucks. They are ideal for transporting construction materials, heavy machinery, and bulk wholesale goods.</li>
            <li><strong>E-Commerce & Courier Last-Mile:</strong> Businesses can book on-demand or recurring local distribution for express parcels and palletized cargo.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-slate-800 mt-10 mb-4">Why GoMyTruck is {cityName}'s Preferred Local Transporter</h3>
          <p>
            The local transport market is often plagued by unreliable service, hidden broker commissions, and unavailable vehicles. GoMyTruck eliminates these pain points entirely:
          </p>
          <ol className="space-y-4 mb-8">
            <li><strong>Availability Status:</strong> The booking enters partner matching after confirmation. Allocation and arrival depend on the route, goods, vehicle class, traffic, and current partner supply in {cityName}.</li>
            <li><strong>Pricing Breakdown:</strong> The estimate uses mapped distance and time, vehicle, fuel, and demand inputs with 0% hidden middleman markups.</li>
            <li><strong>Wide Range of Vehicles:</strong> Our fleet in {cityName} includes everything from Tata Aces, Bolero Pickups, to 14ft and 20ft trucks, ensuring an optimal match for your cargo volume.</li>
            <li><strong>Direct Driver Option:</strong> Unlock direct phone numbers of 10 local {cityName} truck drivers for just ₹99 with zero broker commission.</li>
          </ol>

          <h3 className="text-2xl font-semibold text-slate-800 mt-10 mb-4">Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-4 not-prose mt-6">
            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
                How do I book a local transport vehicle in {cityName}?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Visit the <Link to="/book-truck-online" className="text-brand-600 font-semibold hover:underline">booking page</Link> or connect on WhatsApp. Enter pickup and drop addresses in {cityName}, choose a vehicle, declare the goods, and review the live estimate.
              </p>
            </details>
            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
                Do you provide labor for loading and unloading in {cityName}?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Yes, driver-helper or additional labor options are available during the booking process for a nominal charge, ensuring your goods are handled safely.
              </p>
            </details>
            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
                Are there any "No Entry" timing restrictions for local trucks in {cityName}?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Commercial vehicle restrictions and peak-hour "no-entry" zones vary across municipal zones in {cityName}. Our verified local drivers are experienced with local traffic guidelines and optimal transit timings.
              </p>
            </details>
            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-6 open:shadow-md transition-all">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900">
                Can I get direct phone numbers of {cityName} truck drivers?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Yes! Through GoMyTruck Direct Driver Connect, you can instantly unlock 10 verified phone numbers of commercial drivers stationed in {cityName} for a one-time ₹99 pass.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ── Internal Links ─────────────────────────────────────── */}
      <section className="bg-slate-50 py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Explore More Transport Services in {cityName}
          </h2>
          <p className="text-slate-500 mb-8 text-sm">
            GoMyTruck connects you to a full range of logistics solutions across {cityName} and {stateName}.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                to: `/${citySlug}/truck-booking`,
                label: `Truck Booking in ${cityName}`,
                desc: `Full city-wide commercial goods transport.`,
                icon: <Truck className="w-5 h-5" />,
              },
              {
                to: `/${citySlug}/truck-booking/tata-ace`,
                label: `Tata Ace in ${cityName}`,
                desc: `750kg mini truck for city logistics.`,
                icon: <Truck className="w-5 h-5" />,
              },
              {
                to: `/${citySlug}/truck-booking/14ft-truck`,
                label: `14ft Eicher Truck in ${cityName}`,
                desc: `Up to 4-ton commercial & industrial transport.`,
                icon: <Truck className="w-5 h-5" />,
              },
              {
                to: `/drivers/${citySlug}/tata-ace`,
                label: `Driver Load Hub: ${cityName}`,
                desc: `Connect directly with local truck owners.`,
                icon: <Zap className="w-5 h-5" />,
              },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex flex-col gap-2 p-5 bg-white rounded-xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all duration-200"
              >
                <span className="flex items-center gap-2 text-brand-600 font-semibold text-sm group-hover:text-brand-700">
                  {link.icon} {link.label}
                </span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {link.desc}
                </p>
                <span className="flex items-center gap-1 text-brand-500 text-xs font-medium mt-auto group-hover:gap-2 transition-all">
                  Book or View Rates <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Breadcrumb (visible) ───────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="bg-white border-t border-slate-100 py-3"
      >
        <ol className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-sm text-slate-500">
          <li>
            <Link to="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          </li>
          <li className="text-slate-800 font-medium">
            Local Transport Services
          </li>
        </ol>
      </nav>
    </>
  );
}
