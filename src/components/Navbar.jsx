import React, { useState, useRef, useEffect } from "react"
import { Menu, X, ChevronRight, ChevronDown, PhoneCall, LogIn, LogOut, Truck, Package, Building2, Users, MapPin, ArrowRight, Zap } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import AppDownloadModal from "./AppDownloadModal"
import { useAuth } from "../context/AuthContext"

// Dropdown data
const shippersMenu = [
  {
    heading: "Book by Service",
    items: [
      { label: "Mini Truck Booking", to: "/kolkata/mini-truck-booking", desc: "Tata Ace, 407" },
      { label: "Full Truck Load (FTL)", to: "/goods-transport-services", desc: "32ft container, flatbed" },
      { label: "Part Load (PTL)", to: "/goods-transport-services", desc: "Share truck space" },
      { label: "Intercity Transport", to: "/intercity/kolkata", desc: "Pan-India routes" },
      { label: "Enterprise Logistics", to: "/enterprise", desc: "B2B contracts" },
      { label: "Book Truck Online", to: "/book-truck-online", desc: "Instant booking" },
    ],
  },
  {
    heading: "Book by Vehicle",
    items: [
      { label: "Tata Ace / 3-Wheeler", to: "/kolkata/tata-ace-booking", desc: "Up to 750 kg" },
      { label: "Pickup / Bolero", to: "/kolkata/pickup-truck-booking", desc: "Up to 1.5 ton" },
      { label: "Mini Truck (407)", to: "/kolkata/mini-truck-booking", desc: "Up to 3 ton" },
      { label: "14 Feet Truck", to: "/kolkata/14-feet-truck-rental", desc: "Up to 5 ton" },
      { label: "Packers & Movers", to: "/packers-and-movers", desc: "Home & office moves" },
    ],
  },
  {
    heading: "Cities & Routes",
    items: [
      { label: "Kolkata", to: "/kolkata", desc: "Local & intercity" },
      { label: "Dankuni Hub", to: "/dankuni", desc: "Freight corridor" },
      { label: "Howrah", to: "/howrah", desc: "Industrial routes" },
      { label: "Durgapur / Asansol", to: "/durgapur", desc: "Steel belt" },
      { label: "Kolkata → Guwahati", to: "/routes/kolkata-to-guwahati", desc: "~1000 km" },
      { label: "Kolkata → Patna", to: "/routes/kolkata-to-patna", desc: "~600 km" },
    ],
  },
]

const transportersMenu = [
  {
    heading: "Driver & Fleet Partners",
    items: [
      { label: "Attach My Truck", to: "/fleet-partner-registration", desc: "Register your vehicle" },
      { label: "Driver Partner", to: "/driver-partner", desc: "Earn from every trip" },
      { label: "Fleet Owner Portal", to: "/fleet-partner-registration", desc: "Manage your fleet" },
    ],
  },
  {
    heading: "Partner Benefits",
    items: [
      { label: "Instant Trip Matching", to: "/driver-partner", desc: "< 20 min assignment" },
      { label: "Return Load Finder", to: "/driver-partner", desc: "No empty running" },
      { label: "Partner Plans", to: "/plans", desc: "Subscription benefits" },
      { label: "GoMyTruck Verified", to: "/gomytruck-verified", desc: "Trust badge" },
    ],
  },
]

function DropdownMenu({ sections, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-2 w-[680px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 grid grid-cols-3 gap-5 z-50">
      {sections.map((section) => (
        <div key={section.heading}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{section.heading}</p>
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={onClose}
                className="flex flex-col px-2 py-2 rounded-lg hover:bg-brand-50 group transition-colors"
              >
                <span className="text-slate-800 font-bold text-sm group-hover:text-brand-700">{item.label}</span>
                <span className="text-slate-400 text-xs">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Navbar({ onOpenEstimate, onScrollToSection }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null) // "shippers" | "transporters" | null

  const { user, accessToken, logout, setIsLoginModalOpen } = useAuth()
  const location = useLocation()
  const dropdownRef = useRef(null)

  const isDarkTheme = location.pathname === "/plans"
  const isLoggedIn = Boolean(accessToken || user || (typeof window !== "undefined" && localStorage.getItem("vahan_access_token")))

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const simpleNavItems = [
    { name: "Enterprise", id: "enterprise" },
    { name: "About", id: "about" },
    { name: "Support", id: "support" },
  ]

  const handleNavClick = (id) => {
    setIsOpen(false)
    setActiveDropdown(null)
    onScrollToSection(id)
  }

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name))
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDarkTheme
            ? "bg-[#262833]/90 backdrop-blur-md shadow-md py-1 border-b border-white/10"
            : "bg-white/90 backdrop-blur-md shadow-md py-1 border-b border-slate-200/50"
          : isDarkTheme
          ? "bg-[#262833] py-1.5 border-b border-transparent"
          : "bg-brand-50 py-1.5 border-b border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-0.5" ref={dropdownRef}>
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center gap-2 sm:gap-3 cursor-pointer"
            onClick={() => onScrollToSection("home")}
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 shrink-0">
              <img src="/go-my-truck-logo.png" alt="GoMyTruck Logo" className="w-full h-full object-cover rounded-xl shadow-sm" />
            </div>
            <div className="flex flex-col justify-center items-start">
              <span className={`font-sans font-bold text-[18px] sm:text-[22px] tracking-tight leading-none ${isDarkTheme ? "text-white" : "text-slate-900"}`}>
                Go<span className="text-orange-500">My</span>Truck
              </span>
              <span className={`text-[7px] sm:text-[8.5px] font-bold tracking-[0.15em] uppercase mt-0.5 leading-none whitespace-nowrap ${isDarkTheme ? "text-gray-400" : "text-slate-500"}`}>
                ASAN JARIYA TRANSPORT KA
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {/* Shippers Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("shippers")}
                className={`flex items-center gap-1 font-bold text-sm px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  activeDropdown === "shippers"
                    ? "bg-brand-600 text-white"
                    : isDarkTheme
                    ? "text-gray-200 hover:bg-white/10"
                    : "text-slate-700 hover:bg-slate-100 hover:text-brand-700"
                }`}
              >
                <Truck size={15} />
                Book a Truck
                <ChevronDown size={14} className={`transition-transform ${activeDropdown === "shippers" ? "rotate-180" : ""}`} />
              </button>
              {activeDropdown === "shippers" && (
                <DropdownMenu sections={shippersMenu} onClose={() => setActiveDropdown(null)} />
              )}
            </div>

            {/* Transporters Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("transporters")}
                className={`flex items-center gap-1 font-bold text-sm px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  activeDropdown === "transporters"
                    ? "bg-slate-900 text-white"
                    : isDarkTheme
                    ? "text-gray-200 hover:bg-white/10"
                    : "text-slate-700 hover:bg-slate-100 hover:text-brand-700"
                }`}
              >
                <Users size={15} />
                Attach Truck
                <ChevronDown size={14} className={`transition-transform ${activeDropdown === "transporters" ? "rotate-180" : ""}`} />
              </button>
              {activeDropdown === "transporters" && (
                <DropdownMenu sections={transportersMenu} onClose={() => setActiveDropdown(null)} />
              )}
            </div>

            <div className={`h-6 w-px ${isDarkTheme ? "bg-gray-700" : "bg-slate-300"}`} />

            {/* Simple nav items */}
            {simpleNavItems.map((item) =>
              item.url ? (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-semibold text-sm whitespace-nowrap transition-colors relative py-1 px-2 ${
                    isDarkTheme ? "text-gray-200 hover:text-white" : "text-slate-600 hover:text-brand-600"
                  }`}
                >
                  {item.name}
                </a>
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.id)}
                  className={`font-semibold text-sm whitespace-nowrap transition-colors relative py-1 px-2 ${
                    isDarkTheme ? "text-gray-200 hover:text-white" : "text-slate-600 hover:text-brand-600"
                  }`}
                >
                  {item.name}
                </button>
              )
            )}

            <div className={`h-6 w-px ${isDarkTheme ? "bg-gray-700" : "bg-slate-300"}`} />

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:9331488999"
                className={`flex items-center gap-1.5 font-bold text-sm transition-colors ${
                  isDarkTheme ? "text-white hover:text-gray-300" : "text-slate-700 hover:text-brand-600"
                }`}
              >
                <PhoneCall size={15} className={isDarkTheme ? "text-white" : "text-brand-500"} />
                <span className="hidden lg:inline">9331488999</span>
              </a>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 hidden xl:inline">
                    {user?.name || (user?.phone ? `+91 ${user.phone}` : "Account")}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`font-bold text-sm transition-colors px-2 cursor-pointer ${isDarkTheme ? "text-gray-200 hover:text-rose-400" : "text-slate-600 hover:text-rose-600"}`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className={`font-bold text-sm transition-colors px-2 flex items-center gap-1 cursor-pointer ${
                    isDarkTheme ? "text-white hover:text-gray-300" : "text-slate-600 hover:text-brand-600"
                  }`}
                >
                  <LogIn size={16} />
                  Login
                </button>
              )}

              <button
                onClick={onOpenEstimate}
                className="btn-ripple bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-4 py-1.5 rounded-lg shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span className="relative z-10 whitespace-nowrap">Get Estimate</span>
                <ChevronRight size={16} className="relative z-10" />
              </button>

              <button
                onClick={() => setIsDownloadModalOpen(true)}
                className="btn-ripple bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm px-4 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.093 2.05A2.32 2.32 0 003 4.155v15.69c0 .878.47 1.674 1.223 2.08l10.364-10.426L4.093 2.05z" fill="#00C1FF" />
                  <path d="M15.918 10.31L19.46 8.3c1.19-.675 1.19-2.368 0-3.044L15.918 3.24l-1.332 1.334L15.918 10.31z" fill="#FFC900" />
                  <path d="M14.586 11.644L4.093 2.05l9.16 9.22 1.333.374z" fill="#00E676" />
                  <path d="M14.586 11.644l-10.493 10.56 11.825-6.68-1.332-3.88z" fill="#FF3A44" />
                </svg>
                <span className="relative z-10 whitespace-nowrap">Download App</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-3">
            <a href="tel:9331488999" className="p-2 rounded-lg text-slate-700 hover:bg-slate-100" title="Call Support">
              <PhoneCall size={18} />
            </a>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg transition-colors text-slate-800 hover:bg-slate-100" aria-label="Toggle Menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen border-t border-slate-200" : "max-h-0 pointer-events-none"}`}>
        <div className="bg-brand-50/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-1 shadow-2xl">
          {/* Book a Truck section */}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 pt-2 pb-1">Book a Truck</p>
          <Link to="/book-truck-online" onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg">Mini Truck / FTL / PTL</Link>
          <Link to="/intercity/kolkata" onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg">Intercity Transport</Link>
          <Link to="/enterprise" onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg">Enterprise Logistics</Link>
          <Link to="/kolkata" onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg">All Cities & Routes</Link>

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Attach Your Truck</p>
          <Link to="/fleet-partner-registration" onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg">Fleet Partner Registration</Link>
          <Link to="/driver-partner" onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg">Driver Partner</Link>
          <Link to="/plans" onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg">Partner Plans</Link>

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Company</p>
          {simpleNavItems.map((item) =>
            item.url ? (
              <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg">
                {item.name}
              </a>
            ) : (
              <button key={item.name} onClick={() => handleNavClick(item.id)} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg">
                {item.name}
              </button>
            )
          )}

          <div className="h-px bg-slate-200 my-3" />
          <div className="grid grid-cols-2 gap-3 px-2">
            <a href="tel:9331488999" className="flex items-center justify-center gap-2 border border-slate-300 text-slate-800 font-bold py-3 rounded-lg text-sm hover:bg-slate-50 active:scale-98 transition-all">
              <PhoneCall size={16} className="text-brand-600" />
              <span>Call Now</span>
            </a>
            <button onClick={() => { setIsOpen(false); onOpenEstimate() }} className="btn-ripple bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3 px-4 rounded-lg shadow-md shadow-brand-500/20 active:scale-98 transition-all">
              <span className="relative z-10">Get Estimate</span>
            </button>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 border border-rose-200 bg-rose-50 text-rose-600 font-bold py-3 rounded-lg text-sm hover:bg-rose-100 active:scale-98 transition-all cursor-pointer">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            ) : (
              <button onClick={() => { setIsOpen(false); setIsLoginModalOpen(true) }} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-800 font-bold py-3 rounded-lg text-sm hover:bg-slate-50 active:scale-98 transition-all cursor-pointer">
                <LogIn size={16} />
                <span>Login</span>
              </button>
            )}
            <button onClick={() => { setIsOpen(false); setIsDownloadModalOpen(true) }} className="flex items-center justify-center gap-2 border border-slate-300 bg-slate-50 text-slate-800 font-bold py-3 rounded-lg text-sm hover:bg-slate-100 active:scale-98 transition-all">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.093 2.05A2.32 2.32 0 003 4.155v15.69c0 .878.47 1.674 1.223 2.08l10.364-10.426L4.093 2.05z" fill="#00C1FF" />
                <path d="M15.918 10.31L19.46 8.3c1.19-.675 1.19-2.368 0-3.044L15.918 3.24l-1.332 1.334L15.918 10.31z" fill="#FFC900" />
                <path d="M14.586 11.644L4.093 2.05l9.16 9.22 1.333.374z" fill="#00E676" />
                <path d="M14.586 11.644l-10.493 10.56 11.825-6.68-1.332-3.88z" fill="#FF3A44" />
              </svg>
              <span>Download App</span>
            </button>
          </div>
        </div>
      </div>

      <AppDownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
    </nav>
  )
}
