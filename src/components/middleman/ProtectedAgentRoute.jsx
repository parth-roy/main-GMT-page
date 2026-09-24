import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ProtectedAgentRoute({ children }) {
  const { user, accessToken, requireAuth } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // If we're fully loaded, or there's definitively no token on mount
    const checkAuth = async () => {
      // In SSR/Initial mount, token might be in localStorage but not context yet
      const token = typeof window !== 'undefined' ? localStorage.getItem('vahan_access_token') : null;
      
      if (!token) {
        setIsInitializing(false);
        requireAuth(() => {});
        return;
      }

      if (accessToken !== undefined) {
        setIsInitializing(false);
        if (!user && !accessToken) {
          requireAuth(() => {});
        }
      }
    };
    
    // Slight delay to allow context to populate
    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, [user, accessToken, requireAuth]);

  if (isInitializing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 size={40} className="animate-spin text-green-500 mb-4" />
        <p className="text-slate-500">Verifying access...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Authentication Required</h2>
        <p className="text-slate-500 mb-6">Please log in to access the Agent portal.</p>
        <button 
          onClick={() => requireAuth(() => {})}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg"
        >
          Log In Now
        </button>
      </div>
    );
  }

  if (user.role !== 'MIDDLEMAN') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
          <AlertTriangle size={40} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Access Denied</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          This portal is restricted to registered Transport Agents. Your current account role is <span className="font-bold">{user.role}</span>.
        </p>
        <Link 
          to="/"
          className="flex items-center gap-2 text-slate-600 hover:text-green-500 transition-colors font-semibold"
        >
          <ArrowLeft size={20} /> Return to Home
        </Link>
      </div>
    );
  }

  return children;
}
