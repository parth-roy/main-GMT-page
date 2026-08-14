import React from "react"
import { Link } from "react-router-dom"
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Smartphone } from "lucide-react"

export default function Footer({ onScrollToSection }) {
  const cities = [
    { name: "Kolkata",       to: "/kolkata" },
    { name: "Barrackpore",   to: "/barrackpore" },
    { name: "Howrah",        to: "/howrah" },
    { name: "Salt Lake",     to: "/salt-lake" },
    { name: "New Town",      to: "/new-town" },
    { name: "Kolkata–Asansol", to: "/routes/kolkata-to-asansol" },
  ]

  // Popular Searches — consolidated to prevent Link Equity Dilution
  const popularSearches = [
    { label: "Online Truck Booking",         to: "/book-truck-online" },
    { label: "Mini Truck Booking Near Me",   to: "/mini-truck-booking" },
    { label: "Tata Ace on Rent",             to: "/kolkata/tata-ace-booking" },
    { label: "Goods Transport Services",     to: "/goods-transport-services" },
    { label: "Local Transport Near Me",      to: "/local-transport/kolkata" },
    { label: "Intercity Transport",          to: "/intercity/kolkata" },
    { label: "Find Return Load Online",      to: "/driver-partner" },
    { label: "Attach Truck to Company",      to: "/fleet-partner-registration" },
    { label: "B2B Logistics Services",       to: "/enterprise" },
    { label: "Truck Booking Kolkata",        to: "/kolkata/truck-booking" },
    { label: "Truck Booking Barrackpore",    to: "/barrackpore/truck-booking" },
    { label: "Pickup Truck Near Me",         to: "/kolkata/pickup-truck-booking" },
    { label: "GoMyTruck Verified",           to: "/gomytruck-verified" },
  ]

  return (
    <footer id="support" className="bg-[#050505] text-white pt-16 pb-12 text-left relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Left Side / Right Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12">
          
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => onScrollToSection('home')}>
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 shrink-0">
                <img 
                  src="/go-my-truck-logo.png"
                  alt="GoMyTruck - Online Truck Booking & Goods Transport Services India" 
                  loading="lazy"
                  className="w-full h-full object-cover rounded-xl shadow-sm" 
                />
              </div>
              <div className="flex flex-col justify-center items-start">
                <span className="font-sans font-bold text-[20px] sm:text-[24px] tracking-tight leading-none text-white">
                  Go<span className="text-orange-500">My</span>Truck
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.15em] uppercase mt-1 leading-none text-gray-400 whitespace-nowrap">
                  ASAN JARIYA TRANSPORT KA
                </span>
              </div>
            </div>

            {/* Company Description with WB Local SEO signals */}
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              A digital marketplace for truck booking, goods transport and linked logistics services.
              Headquartered in <strong className="text-gray-300">Barrackpore, West Bengal</strong>. Route and vehicle availability are confirmed during booking.
            </p>

            <div className="border-t border-dashed border-gray-700 w-full max-w-[200px]"></div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm">Follow us on</h4>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/gomytruck" rel="noopener noreferrer" aria-label="GoMyTruck on Facebook" className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"><Facebook size={16} fill="currentColor" className="text-gray-400" /></a>
                <a href="https://twitter.com/gomytruck" rel="noopener noreferrer" aria-label="GoMyTruck on Twitter" className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"><Twitter size={16} fill="currentColor" className="text-gray-400" /></a>
                <a href="https://www.instagram.com/gomytruck" rel="noopener noreferrer" aria-label="GoMyTruck on Instagram" className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"><Instagram size={16} className="text-gray-400" /></a>
                <a href="https://www.linkedin.com/company/gomytruck" rel="noopener noreferrer" aria-label="GoMyTruck on LinkedIn" className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"><Linkedin size={16} fill="currentColor" className="text-gray-400" /></a>
                <a href="https://www.youtube.com/@gomytruck" rel="noopener noreferrer" aria-label="GoMyTruck on YouTube" className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"><Youtube size={16} fill="currentColor" className="text-gray-400" /></a>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-700 w-full max-w-[200px]"></div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <img 
                  src="/download-qr.webp" 
                  alt="Scan to Download GoMyTruck App" 
                  className="w-48 h-auto rounded-xl drop-shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 flex flex-col gap-14">
            
            {/* Top Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h4 className="text-white font-bold text-sm tracking-wide">Company</h4>
                <ul className="space-y-3">
                  <li><Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="About GoMyTruck - Online Truck Booking Company India">About Us</Link></li>
                  <li><Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium">Contact Us</Link></li>
                  <li><Link to="/workforce" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium">Join Workforce</Link></li>
                  <li><Link to="/plans" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium">Partner Plans</Link></li>
                  <li><Link to="/blog" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium">Blog</Link></li>
                  <li><Link to="/gomytruck-verified" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium">GoMyTruck Verified</Link></li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-white font-bold text-sm tracking-wide">Services</h4>
                <ul className="space-y-3">
                  <li><Link to="/truck" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="Online truck booking & mini truck hire">Mini Truck Booking</Link></li>
                  <li><Link to="/services" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="FTL full truck load transport services">FTL Transport</Link></li>
                  <li><Link to="/services" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="Part load transport PTL logistics">Part Load (PTL)</Link></li>
                  <li><Link to="/enterprise" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="B2B enterprise logistics solutions">Enterprise Logistics</Link></li>
                  <li><Link to="/bike" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="Two-wheeler courier & delivery service">Two Wheeler Courier</Link></li>
                  <li><Link to="/packers-and-movers" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="Packers and movers service – GoMyTruck">Packers & Movers</Link></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-bold text-sm tracking-wide">Support</h4>
                <ul className="space-y-3">
                  <li><Link to="/support" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium">Support Center</Link></li>
                  <li><Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium">Contact Us</Link></li>
                  {/* <li><Link to="/pricing" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium">Pricing & Fare Estimate</Link></li> */}
                  <li><Link to="/legal/privacy-policy" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium">Privacy Policy</Link></li>
                  <li><Link to="/legal/terms" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium">Terms of Service</Link></li>
                  <li><Link to="/legal/partner-terms" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="Driver partner terms and conditions">Partner Agreement</Link></li>
                  <li><Link to="/legal/refund-cancellation" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="Cancellation and refund rules">Refund & Cancellation</Link></li>
                  <li><Link to="/legal/community-guidelines" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="Community Guidelines">Community Guidelines</Link></li>
                </ul>
              </div>

              {/* <div className="space-y-4">
                <h4 className="text-white font-bold text-sm tracking-wide">Truck Owners</h4>
                <ul className="space-y-3">
                  <li><Link to="/driver-partner" className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="Find return load online — load board India">Find Return Load</Link></li>
                  <li><Link to="/driver-partner" className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="Attach commercial vehicle to GoMyTruck">Attach Truck</Link></li>
                  <li><Link to="/driver-partner" className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="Truck owner registration — fleet platform">Register as Owner</Link></li>
                  <li><Link to="/driver-partner" className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium" title="Driver and fleet load marketplace">Load Marketplace</Link></li>
                </ul>
              </div> */}
            </div>

            {/* Popular Searches — keyword-rich SEO block */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm tracking-wide">Popular Searches</h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item, i) => (
                  <Link
                    key={i}
                    to={item.to}
                    title={item.label}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="px-2.5 py-1 bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-[11px] font-medium rounded-full transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Domestic Cities Grid */}
            <div className="space-y-5">
              <h4 className="text-white font-bold text-sm tracking-wide">Service Areas &amp; Route Guides</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-4 gap-x-4">
                {cities.map((city, index) => (
                  <Link
                    key={index}
                    to={city.to}
                    title={`Truck booking in ${city.name} — mini truck & goods transport`}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="text-gray-400 hover:text-white transition-colors text-[13px] font-medium"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="pt-8 border-t border-[#222222] text-left">
          <div className="space-y-1.5 text-gray-500 text-[11px] leading-relaxed max-w-4xl">
            <h4 className="text-gray-300 font-bold text-xs mb-3">Registered Office:</h4>
            <p>© 2026 Parther Technologies Private Limited (GoMyTruck)</p>
            <p>Chiriyamore, Barrackpore, North 24 Parganas, West Bengal, 700120, India</p>
            <p className="mt-5 pt-3 text-gray-400 font-medium">Parther Technologies Private Limited (GoMyTruck) | CIN: U62099WR2026PTC293183 | GSTIN: [Pending] | MSME: [Pending]</p>
            <p>Email: <a href="mailto:hello@parthertech.com" className="hover:text-gray-300 transition-colors">hello@parthertech.com</a></p>
            <p>Phone: <a href="tel:+919331488999" className="hover:text-gray-300 transition-colors">+91 9331488999</a></p>
            <p className="mt-2 text-gray-600">
              GoMyTruck connects customers with independent logistics partners. Coverage, assignment, price and service scope are confirmed for each booking.
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}
