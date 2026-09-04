import React, { useEffect } from 'react';
import SEOHead from '../seo/SEOHead';
import WhyChooseUs from '../components/WhyChooseUs';
import { Target, Shield, Zap, MapPin } from 'lucide-react';
import DirectDriverContactBanner from '../components/common/DirectDriverContactBanner';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      desc: 'To revolutionize the Indian logistics sector by providing an organized, tech-driven platform that empowers truck owners and delivers seamless, transparent freight solutions to businesses.'
    },
    {
      icon: Shield,
      title: 'Our Vision',
      desc: 'To become India\'s most trusted logistics partner, eliminating inefficiencies in freight transport, reducing empty return trips, and fostering a sustainable transport ecosystem.'
    },
    {
      icon: Zap,
      title: 'Core Values',
      desc: 'We believe in absolute transparency, driver empowerment, customer obsession, and leveraging cutting-edge technology to solve real-world supply chain problems.'
    }
  ];

  return (
    <>
      <SEOHead
        title="About Us | GoMyTruck Logistics & Transport Platform"
        description="Learn about GoMyTruck by Parther Technologies Private Limited, its route-based logistics marketplace, partner workflows, and operating principles."
        canonical="/about"
        keywords="about gomytruck, logistics company profile, parther technologies, truck booking startup india, tech logistics company"
      />

      <main className="min-h-screen font-sans bg-slate-50">
        {/* About Hero */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/4"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/4"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-brand-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Who We Are
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold tracking-tight mb-6">
              Moving India <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">
                One Truck At A Time
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              GoMyTruck is a logistics marketplace operated by <strong>Parther Technologies Private Limited</strong>. It connects declared customer transport requirements with eligible driver, fleet, and workforce workflows.
            </p>
          </div>
        </section>

        {/* Direct Driver / Partner Contact Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <DirectDriverContactBanner categoryName="Commercial Truck Drivers & Fleet Partners" />
        </section>

        {/* Mission & Vision */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">{val.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* HQ / Address */}
        <section className="py-20 bg-slate-100 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <MapPin className="text-brand-600" size={28} />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Our Headquarters</h2>
            <p className="text-lg text-slate-600 mb-2"><strong>Parther Technologies Pvt. Ltd.</strong></p>
            <p className="text-slate-500">Chiriyamore, Barrackpore, North 24 Parganas, West Bengal 700120, India</p>
          </div>
        </section>

        <WhyChooseUs />
      </main>
    </>
  );
}
