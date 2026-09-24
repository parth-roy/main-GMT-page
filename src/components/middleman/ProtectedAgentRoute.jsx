import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Loader2, AlertTriangle, ArrowLeft, Briefcase, LogIn, Check } from 'lucide-react';

import SEOHead from '../../seo/SEOHead';

export default function ProtectedAgentRoute({ children }) {
  const { user, accessToken, openLoginModal } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // If we're fully loaded, or there's definitively no token on mount
    const checkAuth = async () => {
      // In SSR/Initial mount, token might be in localStorage but not context yet
      const token = typeof window !== 'undefined' ? localStorage.getItem('vahan_access_token') : null;
      
      if (!token) {
        setIsInitializing(false);
        if (openLoginModal) {
          openLoginModal('MIDDLEMAN');
        }
        return;
      }

      if (accessToken !== undefined) {
        setIsInitializing(false);
        if (!user && !accessToken) {
          if (openLoginModal) {
            openLoginModal('MIDDLEMAN');
          }
        }
      }
    };
    
    // Slight delay to allow context to populate
    const timer = setTimeout(checkAuth, 400);
    return () => clearTimeout(timer);
  }, [user, accessToken, openLoginModal]);

  // Always include SEO tags for the NOINDEX routes during SSR
  const agentSeo = (
    <SEOHead 
      title="GMT Agent Portal | GoMyTruck" 
      description="Manage your transport agency, quote on commercial loads, and track your wallet via the GoMyTruck Agent Portal." 
      canonical={location.pathname}
      noIndex={true} 
    />
  );

  // Top Branded Header for unauthenticated and access-denied states
  const gatewayHeader = (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/go-my-truck-logo.png" alt="GoMyTruck Logo" className="w-9 h-9 object-cover rounded-xl shadow-xs" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-lg leading-none">
                Go<span className="text-orange-500">My</span>Truck
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                Agent
              </span>
            </div>
            <span className="text-[7.5px] font-bold tracking-[0.14em] uppercase mt-0.5 leading-none text-slate-400">
              ASAN JARIYA TRANSPORT KA
            </span>
          </div>
        </Link>
        <Link 
          to="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Return to Home</span>
        </Link>
      </div>
    </header>
  );

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {agentSeo}
        {gatewayHeader}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="sr-only">GMT Agent Portal</h1>
          <Loader2 size={40} className="animate-spin text-emerald-600 mb-4" />
          <p className="text-slate-600 font-medium text-sm">Verifying GMT Agent Access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {agentSeo}
        {gatewayHeader}
        
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100 shadow-inner">
              <Briefcase size={32} className="text-emerald-600" />
            </div>
            
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider rounded-full mb-3">
              Partner Channel
            </span>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">GMT Agent Portal</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Log in with your registered mobile number to manage open commercial loads, connect trucks, and track agency commissions.
            </p>
            
            <button 
              onClick={() => openLoginModal && openLoginModal('MIDDLEMAN')}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-600/25 active:scale-95 transition-all text-sm cursor-pointer flex items-center justify-center gap-2 mb-4"
            >
              <LogIn size={18} />
              <span>Login as GMT Agent</span>
            </button>
            
            <div className="pt-4 border-t border-slate-100 flex items-center justify-around text-[11px] font-semibold text-slate-500">
              <span>⚡ 5-10% Commission</span>
              <span>•</span>
              <span>🚛 Pan-India Loads</span>
              <span>•</span>
              <span>💼 Daily Payouts</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'MIDDLEMAN' && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {agentSeo}
        {gatewayHeader}
        
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-amber-200">
              <AlertTriangle size={32} className="text-amber-600" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2">Agent Access Required</h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              This portal is restricted to registered GMT Agents. Your currently signed-in account role is <span className="font-bold text-slate-900">{user.role}</span>.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => openLoginModal && openLoginModal('MIDDLEMAN')}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 text-sm cursor-pointer"
              >
                Switch / Log In as GMT Agent
              </button>
              <Link 
                to="/"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl text-sm transition-colors text-center"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
