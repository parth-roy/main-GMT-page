import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Package, PlusCircle, MapPin, Wallet, User as UserIcon, LogOut, ChevronDown, AlertTriangle, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';
import CitySelectorModal from '../CitySelectorModal';
import AgentKycModal from './AgentKycModal';
import { apiClient } from '../../api/apiClient';

const NAV_LINKS = [
  { label: 'Loads', to: '/agent/loads', icon: Package },
  { label: 'Post', to: '/agent/post', icon: PlusCircle },
  { label: 'Track', to: '/agent/track', icon: MapPin },
  { label: 'Wallet', to: '/agent/wallet', icon: Wallet },
  { label: 'Profile', to: '/agent/profile', icon: UserIcon },
];

export default function MiddlemanLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [brokerProfile, setBrokerProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentCity } = useCity();

  // Fetch Agent Profile & Check KYC Status
  const fetchProfile = async () => {
    try {
      setIsProfileLoading(true);
      const res = await apiClient('/broker/profile');
      const data = await res.json();
      if (data.success && data.data) {
        setBrokerProfile(data.data);

        // Auto-prompt KYC modal on first login if unverified & documents not submitted
        const isKycDone = Boolean(data.data.isKycVerified);
        const hasDocs = Boolean(data.data.aadhaarDocUrl && data.data.panDocUrl);
        const promptShown = typeof window !== 'undefined' ? sessionStorage.getItem('gmt_agent_kyc_prompted') : 'true';
        if (!isKycDone && !hasDocs && !promptShown) {
          setIsKycModalOpen(true);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('gmt_agent_kyc_prompted', 'true');
          }
        }
      }
    } catch (err) {
      // Silently handle error
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleOpenModal = () => setIsKycModalOpen(true);
    const handleProfileUpdated = (e) => {
      if (e.detail) setBrokerProfile(e.detail);
      else fetchProfile();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('open_agent_kyc_modal', handleOpenModal);
      window.addEventListener('agent_profile_updated', handleProfileUpdated);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('open_agent_kyc_modal', handleOpenModal);
        window.removeEventListener('agent_profile_updated', handleProfileUpdated);
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isKycVerified = Boolean(brokerProfile?.isKycVerified);
  const hasUploadedDocs = Boolean(brokerProfile?.aadhaarDocUrl && brokerProfile?.panDocUrl);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Persistent KYC Alert Banner */}
      {!isProfileLoading && !isKycVerified && (
        <div className={`px-4 py-2.5 text-xs sm:text-sm font-medium transition-all shadow-xs ${
          hasUploadedDocs 
            ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white' 
            : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white'
        }`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              {hasUploadedDocs ? (
                <Clock size={18} className="shrink-0 text-blue-200 animate-pulse" />
              ) : (
                <AlertTriangle size={18} className="shrink-0 text-amber-200 animate-bounce" />
              )}
              <span>
                {hasUploadedDocs ? (
                  <>
                    <strong className="font-extrabold tracking-wide">KYC Under Verification:</strong> Your documents have been submitted to GoMyTruck Ops. Load posting & quote awards will activate upon approval.
                  </>
                ) : (
                  <>
                    <strong className="font-extrabold tracking-wide">KYC Verification Required:</strong> Complete your agent registration with Aadhaar & PAN to unlock posting freight loads and quoting rates.
                  </>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsKycModalOpen(true)}
              className={`shrink-0 px-3.5 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                hasUploadedDocs 
                  ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30' 
                  : 'bg-white text-orange-700 hover:bg-orange-50 active:scale-95'
              }`}
            >
              {hasUploadedDocs ? 'Review / Update Documents' : 'Complete KYC Now →'}
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left: Logo & City Selector & Mobile Toggle */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-green-600 rounded-md"
              >
                <Menu size={24} />
              </button>
              
              <Link to="/agent/loads" className="flex-shrink-0 flex items-center gap-2.5 sm:gap-3 group">
                <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 shrink-0">
                  <img src="/go-my-truck-logo.png" alt="GoMyTruck Logo" className="w-full h-full object-cover rounded-xl shadow-xs" />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans font-bold text-[18px] sm:text-[20px] tracking-tight leading-none text-slate-900">
                      Go<span className="text-orange-500">My</span>Truck
                    </span>
                    <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Agent
                    </span>
                  </div>
                  <span className="text-[7.5px] font-bold tracking-[0.14em] uppercase mt-0.5 leading-none whitespace-nowrap text-slate-400">
                    ASAN JARIYA TRANSPORT KA
                  </span>
                </div>
              </Link>

              {/* Operational City Selector Badge */}
              <button
                type="button"
                onClick={() => setIsCityModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-green-200 bg-green-50 text-green-900 hover:bg-green-100 transition-all cursor-pointer ml-1"
                title="Change Operational City"
              >
                <MapPin size={13} className="text-green-600" />
                <span className="max-w-[100px] truncate">{currentCity?.name || "Kolkata"}</span>
                <ChevronDown size={11} className="text-slate-400" />
              </button>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex space-x-8">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors ${
                    location.pathname === link.to || location.pathname.startsWith(`${link.to}/`)
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-slate-500 hover:text-green-600 hover:border-green-300'
                  }`}
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-800">{user?.name || 'Agent'}</p>
                <p className="text-[11px] text-green-700 font-semibold">{currentCity?.name || 'Verified Agent'}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 cursor-pointer"
                title="Logout to Home"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* City Selector Modal */}
      {isCityModalOpen && (
        <CitySelectorModal isOpen={isCityModalOpen} onClose={() => setIsCityModalOpen(false)} />
      )}

      {/* Mobile Off-Canvas Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-slate-800"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center gap-2.5 px-4 pb-4 border-b border-slate-100">
                <img src="/go-my-truck-logo.png" alt="GoMyTruck Logo" className="w-9 h-9 object-cover rounded-xl" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 text-lg leading-tight">
                    Go<span className="text-orange-500">My</span>Truck
                  </span>
                  <span className="text-[9px] font-extrabold text-green-700 uppercase">Agent Portal</span>
                </div>
              </div>
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <MapPin size={14} className="text-green-600" />
                  <span>{currentCity?.name || "Kolkata"}</span>
                </div>
                <button 
                  onClick={() => { setIsSidebarOpen(false); setIsCityModalOpen(true); }}
                  className="text-xs font-bold text-green-700 hover:underline"
                >
                  Change
                </button>
              </div>
              <nav className="mt-8 px-2 space-y-1">
                {NAV_LINKS.map(link => {
                  const isActive = location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`group flex items-center px-2 py-3 text-base font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-green-50 text-green-500'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-green-500'
                      }`}
                    >
                      <link.icon className={`mr-4 flex-shrink-0 h-6 w-6 ${isActive ? 'text-green-500' : 'text-slate-400 group-hover:text-green-500'}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex items-center justify-between border-t border-slate-200 p-4">
              <div className="flex items-center">
                <div className="inline-block h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-slate-700">{user?.name || 'Agent'}</p>
                  <p className="text-sm font-medium text-slate-500">GMT Agent</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  handleLogout();
                }}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Logout to Home"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* KYC Modal */}
      <AgentKycModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        initialData={brokerProfile}
        onSuccess={(updated) => {
          setBrokerProfile(updated);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('agent_profile_updated', { detail: updated }));
          }
        }}
      />
    </div>
  );
}
