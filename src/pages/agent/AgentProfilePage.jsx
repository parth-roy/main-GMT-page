import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';
import { apiClient } from '../../api/apiClient';
import { 
  User, Phone, Mail, ShieldAlert, ShieldCheck, LogOut, FileText, 
  MapPin, CheckCircle2, AlertTriangle, Clock, ExternalLink, Edit3, 
  CreditCard, Building2, Eye, UserCheck, RefreshCw, Sparkles
} from 'lucide-react';
import AgentKycModal from '../../components/middleman/AgentKycModal';

export default function AgentProfilePage() {
  const { user, logout } = useAuth();
  const { currentCity } = useCity();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [previewDocUrl, setPreviewDocUrl] = useState(null);

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

  useEffect(() => {
    fetchProfile();

    const handleProfileUpdated = (e) => {
      if (e.detail) setProfile(e.detail);
      else fetchProfile();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('agent_profile_updated', handleProfileUpdated);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('agent_profile_updated', handleProfileUpdated);
      }
    };
  }, []);

  const isKycVerified = Boolean(profile?.isKycVerified);
  const hasAadhaar = Boolean(profile?.aadhaarDocUrl);
  const hasPan = Boolean(profile?.panDocUrl);
  const hasBank = Boolean(profile?.bankAccountNumber || profile?.bankUpiId);
  const hasUploadedDocs = hasAadhaar && hasPan;

  const handleKycSuccess = (updatedData) => {
    setProfile(updatedData);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agent_profile_updated', { detail: updatedData }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Agent Profile & KYC</h1>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {profile?.isActive ? 'Active Partner' : 'Registered'}
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Commercial Transport Agent credentials, verified government identity & settlement accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsKycModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Edit3 size={15} />
          <span>{hasUploadedDocs ? 'Update KYC Details' : 'Complete KYC Verification'}</span>
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            {/* Avatar / Photo */}
            <div className="relative group shrink-0">
              {profile?.profilePhotoUrl || user?.profileImageUrl ? (
                <img 
                  src={profile?.profilePhotoUrl || user?.profileImageUrl} 
                  alt={user?.name || 'Agent'} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl flex items-center justify-center text-3xl font-black text-emerald-700 border border-emerald-200 shrink-0">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              )}
              {isKycVerified ? (
                <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-xs" title="KYC Verified">
                  <ShieldCheck size={14} />
                </div>
              ) : (
                <div className="absolute -bottom-1.5 -right-1.5 bg-amber-500 text-white p-1 rounded-full border-2 border-white shadow-xs" title="KYC Pending">
                  <AlertTriangle size={14} />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{user?.name || profile?.user?.name || 'Transport Agent'}</h2>
                {isKycVerified ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    <ShieldCheck size={12} className="text-emerald-600" /> Verified Agent
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    <Clock size={12} className="text-amber-600" /> Verification Pending
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <Phone size={14} className="text-slate-400" /> {user?.phone || 'Phone'}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-emerald-600" /> {profile?.primaryCity || currentCity?.name || 'Kolkata'}, {profile?.primaryState || 'India'}
                </span>
                {user?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-400" /> {user?.email}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                  Role: Transport Agent (MIDDLEMAN)
                </span>
                {profile?.referralCode && (
                  <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                    Code: {profile.referralCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick KYC Action on Right */}
          <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
              isKycVerified ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
            }`}>
              {isKycVerified ? 'Commercial Access: FULL' : 'Commercial Access: RESTRICTED'}
            </span>
            <button
              onClick={() => setIsKycModalOpen(true)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
            >
              {hasUploadedDocs ? 'Review Uploaded Docs →' : 'Upload Documents →'}
            </button>
          </div>
        </div>

        {/* Commercial KPIs */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50/70">
          <div className="p-4 sm:p-5 text-center">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Loads Fulfilled</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{profile?.totalLoadsFulfilled || 0}</p>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Quotes Submitted</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{profile?.totalQuotesSubmitted || 0}</p>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Bounties Earned</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-700">₹{(profile?.totalBountiesEarned || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* KYC Status Tracker Stepper */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className={isKycVerified ? "text-emerald-600" : "text-amber-500"} />
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">KYC Verification Tracker</h3>
          </div>
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            isKycVerified 
              ? 'bg-emerald-100 text-emerald-800' 
              : hasUploadedDocs 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {isKycVerified ? 'Verified & Approved' : hasUploadedDocs ? 'In Ops Review' : 'Action Required'}
          </span>
        </div>

        {/* Visual Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Step 1 */}
          <div className="relative p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                ✓
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Step 1: Agent Registration</p>
                <p className="text-[11px] font-semibold text-emerald-700">Completed</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pl-10">
              Admin registered mobile number verified via OTP. Active agent profile initialized.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`relative p-4 rounded-2xl border ${
            hasUploadedDocs 
              ? 'bg-emerald-50/70 border-emerald-200' 
              : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="flex items-center gap-3 mb-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                hasUploadedDocs ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
              }`}>
                {hasUploadedDocs ? '✓' : '2'}
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Step 2: Documents & ID</p>
                <p className={`text-[11px] font-semibold ${hasUploadedDocs ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {hasUploadedDocs ? 'Uploaded' : 'Action Required'}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pl-10">
              {hasUploadedDocs 
                ? 'Aadhaar, PAN & settlement bank details submitted for verification.' 
                : 'Aadhaar card scan & PAN card required to proceed with load operations.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className={`relative p-4 rounded-2xl border ${
            isKycVerified 
              ? 'bg-emerald-50/70 border-emerald-200' 
              : hasUploadedDocs 
              ? 'bg-blue-50/70 border-blue-200' 
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="flex items-center gap-3 mb-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                isKycVerified 
                  ? 'bg-emerald-600 text-white' 
                  : hasUploadedDocs 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-300 text-slate-600'
              }`}>
                {isKycVerified ? '✓' : '3'}
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Step 3: Ops Verification</p>
                <p className={`text-[11px] font-semibold ${
                  isKycVerified ? 'text-emerald-700' : hasUploadedDocs ? 'text-blue-700' : 'text-slate-400'
                }`}>
                  {isKycVerified ? 'Approved' : hasUploadedDocs ? 'Reviewing' : 'Waiting'}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pl-10">
              {isKycVerified 
                ? 'Verified by GoMyTruck Ops. You can post loads and submit driver quotes.' 
                : hasUploadedDocs 
                ? 'Under verification by our onboarding team. Average SLA is 2 hours.' 
                : 'Unlocks automatically after document submission.'}
            </p>
          </div>
        </div>

        {/* Warning or Success Message */}
        {!isKycVerified && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-900">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">
                  {hasUploadedDocs ? 'Documents In Review' : 'Posting & Bidding Blocked'}
                </p>
                <p className="text-amber-800 text-xs mt-0.5">
                  {hasUploadedDocs 
                    ? 'Our operations team is reviewing your documents. You will receive an SMS once approved.' 
                    : 'Submit your Aadhaar, PAN and settlement bank details to unlock commercial load posting and quoting.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsKycModalOpen(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              {hasUploadedDocs ? 'Update Submission' : 'Submit KYC Documents'}
            </button>
          </div>
        )}
      </div>

      {/* KYC Documents Gallery & Verified Info */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <FileText size={20} className="text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">KYC Documents & Credentials</h3>
          </div>
          <button
            onClick={() => setIsKycModalOpen(true)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <Edit3 size={13} />
            <span>Edit Information</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Aadhaar Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aadhaar Identity</span>
                {hasAadhaar ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={12} /> Uploaded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={12} /> Missing
                  </span>
                )}
              </div>
              <p className="text-sm font-black text-slate-900 font-mono tracking-wider">
                {profile?.aadhaarNumber ? `•••• •••• ${profile.aadhaarNumber.slice(-4)}` : profile?.aadhaarLast4 ? `•••• •••• ${profile.aadhaarLast4}` : 'Not Provided'}
              </p>
            </div>

            {profile?.aadhaarDocUrl ? (
              <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white">
                <div className="h-32 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img 
                    src={profile.aadhaarDocUrl} 
                    alt="Aadhaar Document" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x200?text=Aadhaar+Document';
                    }}
                  />
                </div>
                <div className="p-2.5 flex items-center justify-between bg-white text-xs">
                  <span className="text-slate-600 font-semibold truncate">aadhaar_document.jpg</span>
                  <button
                    type="button"
                    onClick={() => setPreviewDocUrl(profile.aadhaarDocUrl)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={13} /> View
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsKycModalOpen(true)}
                className="h-28 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-white flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <FileText size={22} className="text-slate-400" />
                <span className="text-xs font-bold">Upload Aadhaar Card</span>
              </button>
            )}
          </div>

          {/* PAN Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">PAN Card</span>
                {hasPan ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={12} /> Uploaded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={12} /> Missing
                  </span>
                )}
              </div>
              <p className="text-sm font-black text-slate-900 font-mono tracking-wider">
                {profile?.panNumber ? profile.panNumber.toUpperCase() : 'Not Provided'}
              </p>
            </div>

            {profile?.panDocUrl ? (
              <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white">
                <div className="h-32 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img 
                    src={profile.panDocUrl} 
                    alt="PAN Document" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x200?text=PAN+Document';
                    }}
                  />
                </div>
                <div className="p-2.5 flex items-center justify-between bg-white text-xs">
                  <span className="text-slate-600 font-semibold truncate">pan_card.jpg</span>
                  <button
                    type="button"
                    onClick={() => setPreviewDocUrl(profile.panDocUrl)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={13} /> View
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsKycModalOpen(true)}
                className="h-28 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-white flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <FileText size={22} className="text-slate-400" />
                <span className="text-xs font-bold">Upload PAN Card</span>
              </button>
            )}
          </div>
        </div>

        {/* Bank & Settlement Details */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={15} className="text-emerald-600" /> Settlement Bank & UPI
            </span>
            {hasBank ? (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Configured
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                Action Required
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <p className="text-slate-400 font-semibold text-[10px] uppercase">Bank Name</p>
              <p className="font-bold text-slate-900 mt-0.5">{profile?.bankName || 'Not Provided'}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <p className="text-slate-400 font-semibold text-[10px] uppercase">Account Holder</p>
              <p className="font-bold text-slate-900 mt-0.5">{profile?.bankAccountHolderName || user?.name || 'Not Provided'}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <p className="text-slate-400 font-semibold text-[10px] uppercase">Account Number</p>
              <p className="font-bold text-slate-900 font-mono mt-0.5">
                {profile?.bankAccountNumber ? `••••••••${profile.bankAccountNumber.slice(-4)}` : 'Not Provided'}
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <p className="text-slate-400 font-semibold text-[10px] uppercase">IFSC Code</p>
              <p className="font-bold text-slate-900 font-mono mt-0.5">{profile?.bankIfsc ? profile.bankIfsc.toUpperCase() : 'Not Provided'}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 sm:col-span-2">
              <p className="text-slate-400 font-semibold text-[10px] uppercase">Instant UPI ID</p>
              <p className="font-bold text-emerald-800 font-mono mt-0.5">{profile?.bankUpiId || 'Not Provided'}</p>
            </div>
          </div>
        </div>

        {/* Operational Territory & Address */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin size={15} className="text-emerald-600" /> Operational Territory & Address
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <p className="text-slate-400 font-semibold text-[10px] uppercase">Primary Operating Hub</p>
              <p className="font-bold text-slate-900 mt-0.5">{profile?.primaryCity || currentCity?.name || 'Kolkata'}, {profile?.primaryState || 'India'}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <p className="text-slate-400 font-semibold text-[10px] uppercase">Registered Address</p>
              <p className="font-semibold text-slate-800 mt-0.5 truncate">{profile?.fullAddress || 'Not Provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button 
        type="button"
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold py-3.5 px-4 rounded-2xl transition-colors flex justify-center items-center gap-2 cursor-pointer active:scale-98 border border-red-200 text-xs sm:text-sm"
      >
        <LogOut size={16} /> Log Out Commercial Agent Account
      </button>

      {/* Document Lightbox Preview Modal */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4">
            <div className="flex justify-between items-center mb-3 px-2">
              <span className="text-sm font-bold text-slate-800">Document Preview</span>
              <button 
                onClick={() => setPreviewDocUrl(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-100 rounded-2xl p-2">
              <img src={previewDocUrl} alt="Document" className="max-w-full h-auto rounded-xl object-contain" />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => window.open(previewDocUrl, '_blank')}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <ExternalLink size={14} /> Open Full Size
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent KYC Edit Modal */}
      <AgentKycModal 
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        onSuccess={handleKycSuccess}
        initialData={profile}
      />
    </div>
  );
}
