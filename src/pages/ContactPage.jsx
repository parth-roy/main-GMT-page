import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import { trackLead, trackWhatsAppClick } from '../utils/analytics';

/* ─── JSON-LD schemas ─────────────────────────────────────── */
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'GoMyTruck',
  telephone: '+919331488999',
  email: 'hello@parthertech.com',
  url: 'https://gomytruck.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Chiriyamore, Barrackpore',
    addressLocality: 'North 24 Parganas',
    addressRegion: 'West Bengal',
    postalCode: '700120',
    addressCountry: 'IN',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '20:00',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+919331488999',
    contactType: 'customer support',
    availableLanguage: ['English', 'Bengali', 'Hindi'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gomytruck.com/' },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://gomytruck.com/contact' },
  ],
};

const jsonLd = [localBusinessSchema, breadcrumbSchema];

/* ─── Quick links data ────────────────────────────────────── */
const quickLinks = [
  { to: '/book-truck-online', label: 'Book a Truck Online' },
  // { to: '/pricing', label: 'View Pricing' },
  { to: '/driver-partner', label: 'Become a Driver Partner' },
  { to: '/gomytruck-verified', label: 'GoMyTruck Verified' },
];

/* ─── Component ───────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("https://api-test.gomytruck.com/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSubmitted(true);
        trackLead('contact_form_api', 'support');
      } else {
        alert("Failed to send message. Please try WhatsApp directly.");
      }
    } catch (err) {
      alert("An error occurred. Please try WhatsApp directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Contact GoMyTruck | WhatsApp, Call & Email Support"
        description="Contact GoMyTruck for truck booking help, active-trip support, partnerships or complaints by WhatsApp, phone or email."
        canonical="/contact"
        keywords="GoMyTruck contact, truck booking support, contact transport company, logistics helpline, GoMyTruck WhatsApp, GoMyTruck phone number"
        jsonLd={jsonLd}
      />

      <main className="min-h-screen bg-slate-50">

        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-slate-900">
          {/* decorative blobs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-green-500/15 blur-3xl pointer-events-none" />
          {/* grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-4 py-24 text-center">
            {/* badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-600/20 border border-brand-500/30 px-4 py-1.5 text-sm font-medium text-brand-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Phone, WhatsApp and email support
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Get in Touch with{' '}
              <span className="bg-gradient-to-r from-brand-400 to-green-400 bg-clip-text text-transparent">
                GoMyTruck
              </span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Contact our team for booking questions, active-trip coordination, freight enquiries and account support.
              Pick your preferred channel below.
            </p>

            {/* trust pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                'WhatsApp enquiries',
                'Dedicated phone line',
                'Hindi · Bengali · English',
              ].map((pill) => (
                <span
                  key={pill}
                  className="flex items-center gap-1.5 rounded-full bg-slate-800/70 border border-slate-700 px-3 py-1 text-sm text-slate-300"
                >
                  <CheckCircle size={13} className="text-green-400 shrink-0" />
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Three CTA Cards ───────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 -mt-10 z-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* WhatsApp — most prominent */}
            <div className="md:col-span-1 group relative rounded-2xl bg-white border-2 border-green-400 shadow-2xl shadow-green-500/20 p-8 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 opacity-60" />
              <div className="relative z-10 flex flex-col items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle size={36} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-1">
                    Fastest response
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">WhatsApp Us</h2>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Start a WhatsApp conversation for booking and support enquiries.
                  </p>
                </div>
                <a
                  href="https://wa.me/919331488999?text=Hello%20Sir%2FMa'am%20%F0%9F%91%8B%0A%0AThank%20you%20for%20contacting%20GoMyTruck.%0A%0AKindly%20share%20the%20following%20details%3A%0A%0A%F0%9F%93%8D%20Pickup%20Location%3A%0A%F0%9F%93%8D%20Drop%20Location%3A%0A%F0%9F%93%A6%20Goods%20Type%3A%0A%E2%9A%96%20Approx%20Weight%3A%0A%F0%9F%9A%9A%20Truck%20Required%3A%0A%F0%9F%93%85%20Loading%20Date%20%26%20Time%3A%0A%F0%9F%92%B0%20Budget%20(if%20any)%3A%0A%F0%9F%91%A4%20Contact%20Person%3A%0A%F0%9F%93%9E%20Contact%20Number%3A%0A%0AOnce%20received%2C%20we'll%20arrange%20the%20best%20verified%20truck%20for%20you."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 text-base shadow-md shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-200 group-hover:scale-[1.02]"
                >
                  <MessageCircle size={20} />
                  Chat on WhatsApp
                </a>
                <p className="text-xs text-slate-400">+91 93314 88999</p>
              </div>
            </div>

            {/* Phone Call */}
            <div className="group relative rounded-2xl bg-white border border-slate-200 shadow-xl p-8 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-50 to-slate-50 opacity-60" />
              <div className="relative z-10 flex flex-col items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30 group-hover:scale-110 transition-transform duration-300">
                  <PhoneCall size={36} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-1">
                    Speak directly
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">Call Us</h2>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Talk to a logistics expert who will help you get the right truck, right now.
                  </p>
                </div>
                <a
                  href="tel:9331488999"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 text-base shadow-md shadow-brand-600/30 hover:shadow-brand-600/50 transition-all duration-200 group-hover:scale-[1.02]"
                >
                  <PhoneCall size={20} />
                  Call 9331488999
                </a>
                <p className="text-xs text-slate-400">Mon–Sat · 8 AM – 8 PM</p>
              </div>
            </div>

            {/* Email */}
            <div className="group relative rounded-2xl bg-white border border-slate-200 shadow-xl p-8 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 opacity-70" />
              <div className="relative z-10 flex flex-col items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center shadow-lg shadow-slate-700/30 group-hover:scale-110 transition-transform duration-300">
                  <Mail size={36} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
                    Formal queries
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">Email Us</h2>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Use email for partnerships, invoices or detailed complaints.
                  </p>
                </div>
                <a
                  href="mailto:hello@parthertech.com"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 text-base shadow-md shadow-slate-800/30 hover:shadow-slate-800/50 transition-all duration-200 group-hover:scale-[1.02]"
                >
                  <Mail size={20} />
                  Email Us
                </a>
                <p className="text-xs text-slate-400">hello@parthertech.com</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Office Info + Contact Form ─────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Office Info Card — dark glassmorphism */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-2xl p-8 flex flex-col gap-7">
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-brand-600/25 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-green-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-1">Our Office</h2>
              <p className="text-slate-400 text-sm">Come visit us or drop a letter</p>
            </div>

            {/* Address */}
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
                <MapPin size={20} className="text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Address</p>
                <address className="not-italic text-slate-200 leading-relaxed text-sm">
                  Chiriyamore, Barrackpore<br />
                  North 24 Parganas<br />
                  West Bengal – 700120<br />
                  India
                </address>
              </div>
            </div>

            {/* Business Hours */}
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Clock size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Business Hours</p>
                <p className="text-slate-200 text-sm leading-relaxed">
                  Monday – Saturday<br />
                  <span className="text-white font-semibold">8:00 AM – 8:00 PM IST</span>
                </p>
                <p className="text-slate-400 text-xs mt-1">For active trips, use the in-app support options shown on your booking.</p>
              </div>
            </div>

            {/* Phone */}
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
                <PhoneCall size={20} className="text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Phone & WhatsApp</p>
                <a href="tel:9331488999" className="text-white font-semibold hover:text-brand-300 transition-colors text-sm">
                  +91 93314 88999
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center">
                <Mail size={20} className="text-slate-300" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Email</p>
                <a href="mailto:hello@parthertech.com" className="text-white font-semibold hover:text-brand-300 transition-colors text-sm">
                  hello@parthertech.com
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Send Us a Message</h2>
            <p className="text-slate-500 text-sm mb-7">
              Fill in the details below and we'll get back to you shortly.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-14 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Thank you for reaching out. Our support team will get back to you shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', message: '' }); }}
                  className="mt-2 text-sm text-brand-600 hover:underline font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-sm font-semibold text-slate-700">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Rajan Sharma"
                    value={form.name}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-phone" className="text-sm font-semibold text-slate-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel-national"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    placeholder="e.g. 9831000000"
                    value={form.phone}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-sm font-semibold text-slate-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help you…"
                    value={form.message}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-70 disabled:hover:bg-brand-600 text-white font-bold py-4 px-8 text-base shadow-md shadow-brand-600/30 hover:shadow-brand-600/50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  We respect your privacy. Your details are never shared with third parties.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* ── Quick Links ───────────────────────────────────── */}
        <section className="bg-slate-900 py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white">Explore GoMyTruck</h2>
              <p className="text-slate-400 mt-2 text-sm">
                Everything you need — just one click away.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center justify-between gap-3 rounded-xl bg-slate-800 hover:bg-brand-600 border border-slate-700 hover:border-brand-500 px-5 py-4 text-sm font-semibold text-slate-200 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>{label}</span>
                  <ArrowRight size={16} className="shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Floating WhatsApp button ──────────────────────── */}
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href={`https://wa.me/919331488999?text=${encodeURIComponent("Hello GoMyTruck 👋\n\nI am looking to book a truck. Here are my details:\n\n📍 Pickup Location: \n📍 Drop Location: \n📦 Goods Type: \n⚖ Approx Weight: \n🚚 Truck Required: \n📅 Loading Date & Time: \n💰 Budget (if any): \n👤 Contact Person: \n📞 Contact Number: \n\nPlease arrange a verified truck for me!")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex items-center gap-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 hover:-translate-y-1 transition-all duration-200"
          >
            <MessageCircle size={22} />
            <span className="text-sm">WhatsApp Us</span>
          </a>
        </div>

      </main>
    </>
  );
}
