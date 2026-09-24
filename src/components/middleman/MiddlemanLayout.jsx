import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Package, PlusCircle, MapPin, Wallet, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Loads', to: '/agent/loads', icon: Package },
  { label: 'Post', to: '/agent/post', icon: PlusCircle },
  { label: 'Track', to: '/agent/track', icon: MapPin },
  { label: 'Wallet', to: '/agent/wallet', icon: Wallet },
  { label: 'Profile', to: '/agent/profile', icon: UserIcon },
];

export default function MiddlemanLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left: Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-green-500 rounded-md"
              >
                <Menu size={24} />
              </button>
              <Link to="/agent/loads" className="flex-shrink-0 flex items-center">
                <img src="/logo.webp" alt="GoMyTruck" className="h-8 md:h-10 w-auto object-contain" />
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex space-x-8">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    location.pathname === link.to || location.pathname.startsWith(`${link.to}/`)
                      ? 'border-green-500 text-green-500'
                      : 'border-transparent text-slate-500 hover:text-green-500 hover:border-green-300'
                  }`}
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">Agent</p>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

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
              <div className="flex-shrink-0 flex items-center px-4">
                <img src="/logo.webp" alt="GoMyTruck" className="h-8 w-auto object-contain" />
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
            <div className="flex-shrink-0 flex border-t border-slate-200 p-4">
              <div className="flex-shrink-0 group block w-full">
                <div className="flex items-center">
                  <div>
                    <div className="inline-block h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 font-bold">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-slate-700">{user?.name}</p>
                    <p className="text-sm font-medium text-slate-500">Agent Account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
