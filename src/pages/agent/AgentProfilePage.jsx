import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';
import { apiClient } from '../../api/apiClient';
import { User, Phone, Mail, ShieldAlert, ShieldCheck, LogOut, FileText, Activity, MapPin, CheckCircle2 } from 'lucide-react';

export default function AgentProfilePage() {
  const { user, logout } = useAuth();
  const { currentCity } = useCity();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient('/broker/profile');
        const data = await res.json();
        if (data.success && data.data) {
          setProfile(data.data);
        }
      } catch (err) {
        // fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const isKycVerified = profile ? profile.isKycVerified : true;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Agent Profile</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Manage your commercial transport agent credentials.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200">
          <CheckCircle2 size={14} className="text-green-600" />
          <span>Active Partner</span>
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-center gap-6 border-b border-slate-100">
          <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center text-3xl font-black text-green-700 border border-green-100 shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{user?.name || 'Transport Agent'}</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600">
                <Phone size={14} className="text-slate-400" /> {user?.phone || 'Phone'}
              </span>
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600">
                <MapPin size={14} className="text-green-600" /> {profile?.primaryCity || currentCity?.name || 'Kolkata'}
              </span>
              {user?.email && (
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600">
                  <Mail size={14} className="text-slate-400" /> {user?.email}
                </span>
              )}
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                <ShieldCheck size={13} className="text-green-600" /> Verified Agent
              </span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50/70">
          <div className="p-5 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Loads Fulfilled</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{profile?.totalLoadsFulfilled || 0}</p>
          </div>
          <div className="p-5 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Quotes Submitted</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{profile?.totalQuotesSubmitted || 0}</p>
          </div>
          <div className="p-5 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Bounties</p>
            <p className="text-xl sm:text-2xl font-black text-green-700">₹{profile?.totalBountiesEarned || 0}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          <button className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-slate-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">KYC Documents</p>
                <p className="text-xs text-slate-500">Aadhar, PAN, Bank Details</p>
              </div>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-slate-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                <Activity size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Performance Logs</p>
                <p className="text-xs text-slate-500">View your bidding history and ratings</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <button 
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2 mt-8 cursor-pointer active:scale-98"
      >
        <LogOut size={20} /> Log Out Account
      </button>
    </div>
  );
}
