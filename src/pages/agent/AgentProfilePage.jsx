import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Mail, ShieldAlert, ShieldCheck, LogOut, FileText, Activity } from 'lucide-react';

export default function AgentProfilePage() {
  const { user, logout } = useAuth();

  // Mock KYC status - in reality this comes from user data
  const isKycVerified = user?.kycStatus === 'VERIFIED';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Agent Profile</h1>

      {!isKycVerified && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
          <ShieldAlert className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-yellow-800 text-sm">KYC Verification Pending</h4>
            <p className="text-yellow-700 text-sm mt-1 mb-3">
              Your account is restricted. Please complete your KYC to unlock full Agent portal features like bidding and withdrawals.
            </p>
            <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 rounded-lg text-sm transition-colors">
              Complete KYC Now
            </button>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-center gap-6 border-b border-slate-100">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl font-bold text-slate-400">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.name || 'Agent User'}</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Phone size={14} /> {user?.phone}
              </span>
              {user?.email && (
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Mail size={14} /> {user?.email}
                </span>
              )}
            </div>
            <div className="mt-4">
              {isKycVerified ? (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full">
                  <ShieldCheck size={14} /> KYC Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">
                  <ShieldAlert size={14} /> KYC Pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50">
          <div className="p-6 text-center">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Fulfilled</p>
            <p className="text-2xl font-black text-slate-800">24</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Success Rate</p>
            <p className="text-2xl font-black text-slate-800">92%</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Bounties</p>
            <p className="text-2xl font-black text-green-600">₹4.5K</p>
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
        onClick={logout}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2 mt-8"
      >
        <LogOut size={20} /> Log Out Account
      </button>
    </div>
  );
}
