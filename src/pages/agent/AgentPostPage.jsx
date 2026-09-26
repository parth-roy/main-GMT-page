import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { useCity } from '../../context/CityContext';
import { VEHICLE_CATEGORIES } from '../../constants/vehicleOptions';
import { 
  CheckCircle2, IndianRupee, Phone, User, Truck, Loader2, 
  MapPin, ArrowRight, ShieldCheck, ShieldAlert, Lock, AlertTriangle, 
  Clock, FileText, Camera, UploadCloud, Eye, Trash2, ExternalLink,
  Calendar, Info, RefreshCw, ChevronDown, Check, Zap
} from 'lucide-react';
import AgentKycModal from '../../components/middleman/AgentKycModal';

const DRAFT_STORAGE_KEY = 'agent_post_form_draft';

const BODY_TYPE_OPTIONS = [
  'Open Body (High Side)',
  'Open Body (Low Side)',
  'Closed Container',
  'Tarpaulin Covered',
  'Flatbed / Platform',
  'Refrigerated / Reefer',
  'Tanker / Bulk Carrier'
];

const PERMIT_OPTIONS = [
  'All India National Permit (NP)',
  'State Commercial Goods Permit',
  'Intra-City Local Goods Carriage',
  'Temporary Transport Permit'
];

export default function AgentPostPage() {
  const [searchParams] = useSearchParams();
  const urlLoadId = searchParams.get('loadId') || '';
  const navigate = useNavigate();
  const { currentCity } = useCity();

  // Agent Profile & KYC Verification State
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  // Available open loads for selection
  const [availableLoads, setAvailableLoads] = useState([]);
  const [isLoadingLoads, setIsLoadingLoads] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);

  // Active form state
  const [formData, setFormData] = useState({
    targetLoadId: urlLoadId,
    // Driver Details
    driverName: '',
    driverPhone: '',
    driverAltPhone: '',
    driverCity: currentCity?.name || '',
    isOwnerDriver: true,
    ownerName: '',
    ownerPhone: '',
    driverLicenseNo: '',
    driverLicensePhotoUrl: '',
    driverAadhaarNo: '',
    driverAadhaarPhotoUrl: '',
    // Truck / Vehicle Details
    vehicleRegNo: '',
    vehicleType: 'TATA_ACE',
    vehicleBodyType: 'Open Body (High Side)',
    vehiclePermitType: 'All India National Permit (NP)',
    vehicleFitnessValidTill: '',
    vehicleInsuranceValidTill: '',
    vehicleRcPhotoUrl: '',
    vehiclePhotoUrl: '',
    // Logistics & Terms
    negotiatedAmount: '',
    advanceRequired: '2000',
    readyToLoadAt: 'Immediate (Within 2 Hours)',
    agentNotes: '',
  });

  // UI States
  const [uploadingField, setUploadingField] = useState(null);
  const [localPreviews, setLocalPreviews] = useState({});
  const [previewLightbox, setPreviewLightbox] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedBooking, setSubmittedBooking] = useState(null);

  // Load draft from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(DRAFT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setFormData(prev => ({
            ...prev,
            ...parsed,
            targetLoadId: urlLoadId || parsed.targetLoadId || prev.targetLoadId
          }));
        }
      } catch (e) {
        // ignore draft parse error
      }
    }
  }, [urlLoadId]);

  // Save draft to sessionStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      } catch (e) {
        // ignore storage error
      }
    }
  }, [formData]);

  // Fetch Agent Profile
  const fetchProfile = async () => {
    try {
      setIsProfileLoading(true);
      const res = await apiClient('/broker/profile');
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
      }
    } catch (err) {
      // fallback
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Fetch Open Loads for picker
  const fetchOpenLoads = async () => {
    try {
      setIsLoadingLoads(true);
      const res = await apiClient('/broker/loads?limit=50&city=all');
      const data = await res.json();
      if (data.success) {
        const list = Array.isArray(data.data) ? data.data : (data.data?.loads || []);
        setAvailableLoads(list);
        if (formData.targetLoadId) {
          const matched = list.find(l => l.id === formData.targetLoadId || l.sourceBookingId === formData.targetLoadId);
          if (matched) setSelectedLoad(matched);
        }
      }
    } catch (err) {
      // ignore
    } finally {
      setIsLoadingLoads(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchOpenLoads();

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

  // Update selected load when targetLoadId changes
  useEffect(() => {
    if (formData.targetLoadId && availableLoads.length > 0) {
      const match = availableLoads.find(l => l.id === formData.targetLoadId || l.sourceBookingId === formData.targetLoadId);
      if (match) {
        setSelectedLoad(match);
        if (match.vehicleType && !formData.vehicleType) {
          setFormData(p => ({ ...p, vehicleType: match.vehicleType }));
        }
      }
    }
  }, [formData.targetLoadId, availableLoads]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // File Upload Helper
  const handleFileUpload = async (field, file, folder = 'driver_docs') => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum file size is 10MB.');
      return;
    }

    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setLocalPreviews(prev => ({ ...prev, [field]: previewUrl }));
    }

    setUploadingField(field);
    setError('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', folder);

      const res = await apiClient('/upload/single', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (json.success && json.data?.url) {
        setFormData(prev => ({ ...prev, [field]: json.data.url }));
      } else {
        throw new Error(json.message || 'File upload failed');
      }
    } catch (err) {
      setError(`Failed to upload ${field}: ${err.message || 'Please try again.'}`);
    } finally {
      setUploadingField(null);
    }
  };

  const removePhoto = (field) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
    setLocalPreviews(prev => ({ ...prev, [field]: '' }));
  };

  // Submit Driver and Vehicle Dossier
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!profile?.isKycVerified) {
      setError('KYC verification is required before you can submit confirmed drivers.');
      setIsKycModalOpen(true);
      return;
    }

    const targetId = formData.targetLoadId.trim() || availableLoads[0]?.id;
    if (!targetId) {
      return setError('Please select an active load requirement or enter a Booking Number.');
    }

    const cleanPhone = formData.driverPhone ? formData.driverPhone.replace(/\D/g, '') : '';
    const cleanRegNo = formData.vehicleRegNo ? formData.vehicleRegNo.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
    const rcPhoto = formData.vehicleRcPhotoUrl || localPreviews.vehicleRcPhotoUrl || '';
    const amount = Number(formData.negotiatedAmount) || 0;

    setIsLoading(true);

    try {
      const payload = {
        // Driver
        driverName: formData.driverName.trim() || 'Driver Partner',
        driverPhone: cleanPhone || undefined,
        driverAltPhone: formData.driverAltPhone.trim() || undefined,
        driverCity: formData.driverCity.trim() || undefined,
        isOwnerDriver: formData.isOwnerDriver,
        ownerName: !formData.isOwnerDriver ? formData.ownerName.trim() : undefined,
        ownerPhone: !formData.isOwnerDriver ? formData.ownerPhone.trim() : undefined,
        driverLicenseNo: formData.driverLicenseNo.trim().toUpperCase() || undefined,
        driverLicensePhotoUrl: formData.driverLicensePhotoUrl || undefined,
        driverAadhaarNo: formData.driverAadhaarNo.trim() || undefined,
        driverAadhaarPhotoUrl: formData.driverAadhaarPhotoUrl || undefined,
        // Vehicle
        vehicleRegNo: cleanRegNo || undefined,
        vehicleType: formData.vehicleType || undefined,
        vehicleBodyType: formData.vehicleBodyType || undefined,
        vehiclePermitType: formData.vehiclePermitType || undefined,
        vehicleFitnessValidTill: formData.vehicleFitnessValidTill || undefined,
        vehicleInsuranceValidTill: formData.vehicleInsuranceValidTill || undefined,
        vehicleRcPhotoUrl: rcPhoto || undefined,
        vehiclePhotoUrl: formData.vehiclePhotoUrl || undefined,
        // Commercial
        negotiatedAmount: amount,
        advanceRequired: Number(formData.advanceRequired) || 0,
        readyToLoadAt: formData.readyToLoadAt.trim() || 'Immediate',
        agentNotes: formData.agentNotes.trim() || undefined,
        flatFeeBounty: 100,
      };

      const res = await apiClient(`/broker/loads/${targetId}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (json.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(DRAFT_STORAGE_KEY);
        }
        setSubmittedBooking({
          loadId: targetId,
          driverName: payload.driverName,
          driverPhone: payload.driverPhone || 'Not Specified',
          vehicleRegNo: payload.vehicleRegNo || 'Pending',
          vehicleType: payload.vehicleType || 'Commercial Vehicle',
          amount: payload.negotiatedAmount || 0,
          quoteId: json.data?.id,
        });
      } else {
        setError(json.message || 'Failed to submit driver dossier.');
      }
    } catch (err) {
      setError(err?.message || 'Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedBooking) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-2 pb-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-emerald-200 overflow-hidden text-center p-6 sm:p-10 space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm animate-bounce">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Confirmed Driver & Truck Linked
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Driver Details Forwarded to Ops!
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Your confirmed driver and vehicle details have been securely submitted to GoMyTruck Operations.
              The admin team is reviewing the documents to dispatch the 25% loading advance and issue the loading OTP.
            </p>
          </div>

          {/* Submission Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-left max-w-md mx-auto space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs text-slate-500 font-semibold">Target Load / Booking:</span>
              <span className="font-mono text-xs font-bold text-slate-800">{submittedBooking.loadId}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Confirmed Driver:</span>
              <span className="font-bold text-slate-900">{submittedBooking.driverName} ({submittedBooking.driverPhone})</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Vehicle RC Plate:</span>
              <span className="font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded border border-amber-300">
                {submittedBooking.vehicleRegNo}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Agreed Driver Rate:</span>
              <span className="font-bold text-emerald-700 text-sm">₹{Number(submittedBooking.amount).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/agent/loads')}
              className="py-3 px-6 bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Browse More Open Loads →
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmittedBooking(null);
                setFormData(prev => ({
                  ...prev,
                  targetLoadId: '',
                  driverName: '',
                  driverPhone: '',
                  vehicleRegNo: '',
                  vehicleRcPhotoUrl: '',
                  vehiclePhotoUrl: '',
                  negotiatedAmount: '',
                }));
                setLocalPreviews({});
              }}
              className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Provide Another Driver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOADING PROFILE SPINNER
  if (isProfileLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-10 sm:p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs mt-4">
        <Loader2 size={36} className="animate-spin text-emerald-600 mx-auto" />
        <p className="text-sm font-bold text-slate-700">Verifying Agent Partner Credentials...</p>
      </div>
    );
  }

  // LOCKED KYC GATE
  if (!profile?.isKycVerified) {
    const hasUploaded = Boolean(profile?.aadhaarDocUrl && profile?.panDocUrl);
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-2 pb-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden text-center p-6 sm:p-10 space-y-6">
          <div className="w-16 h-16 sm:w-18 sm:h-18 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto border border-amber-200 shadow-inner">
            <Lock size={32} className="text-amber-600" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <ShieldAlert size={14} className="text-amber-700" />
              <span>KYC Verification Required</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
              Unlock Driver & Vehicle Provision
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              As per GoMyTruck commercial logistics policy and freight security regulations, all Transport Agents must complete government KYC verification before supplying drivers and vehicles for active loads.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left flex items-start gap-3">
            {hasUploaded ? (
              <>
                <Clock size={20} className="text-blue-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Documents Under Review</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Your KYC documents have been submitted and are being reviewed by Ops.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Documents Missing</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Please submit your Aadhaar card and PAN card to activate commercial driver placement.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsKycModalOpen(true)}
              className="flex-1 py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText size={16} />
              <span>{hasUploaded ? 'Review / Update KYC Details' : 'Complete KYC Verification Now →'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/agent/profile')}
              className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              View Profile Tracker
            </button>
          </div>
        </div>

        <AgentKycModal
          isOpen={isKycModalOpen}
          onClose={() => setIsKycModalOpen(false)}
          initialData={profile}
          onSuccess={(updated) => {
            setProfile(updated);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('agent_profile_updated', { detail: updated }));
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6 pt-1 sm:pt-2 pb-16">
      {/* Page Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20 mb-2">
              <Truck size={13} className="text-amber-600" />
              <span>Confirmed Sourcing Center</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Provide Confirmed Driver & Truck
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Link a verified commercial driver and ready truck to fulfill an active freight booking. 
              Details are highlighted immediately in GoMyTruck Operations for rapid assignment and advance payout.
            </p>
          </div>

          {/* Agent Bounty Card */}
          <div className="shrink-0 self-center bg-gradient-to-b from-emerald-50 via-emerald-50/80 to-emerald-100/60 border border-emerald-300 rounded-2xl p-4 sm:px-6 sm:py-4 text-center shadow-xs flex flex-col items-center justify-center min-w-[150px] sm:min-w-[170px]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 mb-1">
              <Zap size={11} className="text-emerald-700 fill-emerald-600" />
              <span>Agent Bounty</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-900 tracking-tight font-sans my-0.5">
              ₹100
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 whitespace-nowrap">
              Credited upon loading
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-xs font-bold flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* SECTION 1: TARGET LOAD SELECTION */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                Select Target Load / Booking
              </h2>
            </div>
            <span className="text-xs text-slate-400 shrink-0 font-medium">Step 1 of 4</span>
          </div>

          {/* Available Loads Selector */}
          {availableLoads.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Choose from Active Open Loads ({availableLoads.length})
              </label>
              <div className="relative">
                <select
                  value={availableLoads.some(l => l.id === formData.targetLoadId) ? formData.targetLoadId : ''}
                  onChange={e => {
                    if (e.target.value) {
                      setFormData(p => ({ ...p, targetLoadId: e.target.value }));
                    }
                  }}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none appearance-none pr-9 cursor-pointer truncate"
                >
                  <option value="">-- Tap to select an active load requirement --</option>
                  {availableLoads.map(load => (
                    <option key={load.id} value={load.id}>
                      {load.pickupCity} ➔ {load.dropCity} • {load.vehicleType?.replace(/_/g, ' ')} • ₹{Number(load.customerBudget || 0).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {availableLoads.length > 0 && (
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OR ENTER MANUALLY</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          )}

          {/* Manual Input for Booking Number or Load ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Target Load ID or Customer Booking # (Optional)
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. BK-2026-8921 or Load UUID"
                value={formData.targetLoadId}
                onChange={e => setFormData({ ...formData, targetLoadId: e.target.value })}
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Enter customer booking reference number or load ID to link this vehicle.
            </p>
          </div>

          {/* Load Preview Card if resolved */}
          {selectedLoad && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <span>{selectedLoad.pickupCity}</span>
                  <ArrowRight size={13} className="text-emerald-700" />
                  <span>{selectedLoad.dropCity}</span>
                </div>
                <div className="text-slate-600 text-xs flex flex-wrap gap-x-3 gap-y-1">
                  <span>Vehicle: <strong>{selectedLoad.vehicleType?.replace(/_/g, ' ')}</strong></span>
                  <span>Goods: <strong>{selectedLoad.goodsType || 'General Cargo'}</strong></span>
                </div>
              </div>
              <div className="sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-200 flex sm:block items-center justify-between">
                <span className="text-[10px] text-emerald-800 uppercase block font-semibold">Customer Budget</span>
                <span className="text-base sm:text-lg font-black text-emerald-900">
                  ₹{Number(selectedLoad.customerBudget || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: CONFIRMED DRIVER DOSSIER */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                Confirmed Driver Information
              </h2>
            </div>
            <span className="text-xs text-slate-400 shrink-0 font-medium">Step 2 of 4</span>
          </div>

          {/* Driver Relationship Toggle (Responsive layout with whitespace-nowrap) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              Is this driver the truck owner?
            </span>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, isOwnerDriver: true }))}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
                  formData.isOwnerDriver 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Owner-cum-Driver
              </button>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, isOwnerDriver: false }))}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
                  !formData.isOwnerDriver 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Hired Commercial Driver
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Driver Full Name (Optional)</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar Yadav"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Driver Mobile Number (Optional)</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  name="driverPhone"
                  value={formData.driverPhone}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Alternate / WhatsApp Phone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Alternate phone (optional)"
                  name="driverAltPhone"
                  value={formData.driverAltPhone}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Driver Base City</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Kolkata, Howrah, Patna"
                  name="driverCity"
                  value={formData.driverCity}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Hired Driver Owner details if not owner-driver */}
          {!formData.isOwnerDriver && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-900 uppercase mb-1.5">Truck Owner Full Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Name of vehicle owner"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3.5 bg-white border border-amber-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-900 uppercase mb-1.5">Truck Owner Mobile (Optional)</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit owner number"
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3.5 bg-white border border-amber-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Driver License & Aadhaar Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Driving License */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Driving License (DL) No</label>
              <input
                type="text"
                placeholder="e.g. WB01 20180012345"
                name="driverLicenseNo"
                value={formData.driverLicenseNo}
                onChange={handleInputChange}
                className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-sm font-mono uppercase font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />

              <div className="border border-dashed border-slate-300 rounded-2xl p-3 text-center bg-slate-50/60 hover:bg-slate-50 transition-colors">
                {formData.driverLicensePhotoUrl || localPreviews.driverLicensePhotoUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.driverLicensePhotoUrl || localPreviews.driverLicensePhotoUrl}
                      alt="DL Preview"
                      className="h-24 w-36 object-cover rounded-xl border shadow-xs cursor-pointer"
                      onClick={() => setPreviewLightbox({
                        url: formData.driverLicensePhotoUrl || localPreviews.driverLicensePhotoUrl,
                        title: 'Driving License Photo'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto('driverLicensePhotoUrl')}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-3">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && handleFileUpload('driverLicensePhotoUrl', e.target.files[0], 'driver_docs')}
                    />
                    {uploadingField === 'driverLicensePhotoUrl' ? (
                      <Loader2 size={24} className="animate-spin text-emerald-600 mx-auto" />
                    ) : (
                      <>
                        <Camera size={22} className="text-slate-400 mx-auto mb-1" />
                        <span className="text-xs font-bold text-emerald-700 block">Upload DL Photo</span>
                        <span className="text-[10px] text-slate-400">JPG, PNG, WebP up to 10MB</span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            {/* Aadhaar Card */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Driver Aadhaar Card No</label>
              <input
                type="text"
                maxLength={12}
                placeholder="12-digit Aadhaar number"
                name="driverAadhaarNo"
                value={formData.driverAadhaarNo}
                onChange={handleInputChange}
                className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-sm font-mono font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />

              <div className="border border-dashed border-slate-300 rounded-2xl p-3 text-center bg-slate-50/60 hover:bg-slate-50 transition-colors">
                {formData.driverAadhaarPhotoUrl || localPreviews.driverAadhaarPhotoUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.driverAadhaarPhotoUrl || localPreviews.driverAadhaarPhotoUrl}
                      alt="Aadhaar Preview"
                      className="h-24 w-36 object-cover rounded-xl border shadow-xs cursor-pointer"
                      onClick={() => setPreviewLightbox({
                        url: formData.driverAadhaarPhotoUrl || localPreviews.driverAadhaarPhotoUrl,
                        title: 'Driver Aadhaar Photo'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto('driverAadhaarPhotoUrl')}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-3">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && handleFileUpload('driverAadhaarPhotoUrl', e.target.files[0], 'driver_docs')}
                    />
                    {uploadingField === 'driverAadhaarPhotoUrl' ? (
                      <Loader2 size={24} className="animate-spin text-emerald-600 mx-auto" />
                    ) : (
                      <>
                        <UploadCloud size={22} className="text-slate-400 mx-auto mb-1" />
                        <span className="text-xs font-bold text-emerald-700 block">Upload Aadhaar Photo</span>
                        <span className="text-[10px] text-slate-400">JPG, PNG, WebP up to 10MB</span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: CONFIRMED TRUCK / VEHICLE DOSSIER */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                Confirmed Vehicle & RC Information
              </h2>
            </div>
            <span className="text-xs text-slate-400 shrink-0 font-medium">Step 3 of 4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Vehicle Registration No (RC Plate) (Optional)
              </label>
              <div className="relative">
                <Truck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. WB23AB1234 or DL01AB9876"
                  name="vehicleRegNo"
                  value={formData.vehicleRegNo}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-3.5 bg-amber-50/60 border border-amber-300 rounded-xl text-sm sm:text-base font-mono uppercase font-black tracking-wider text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Vehicle Category / Model (Optional)</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none cursor-pointer"
              >
                {VEHICLE_CATEGORIES.map(cat => (
                  <optgroup key={cat.category} label={cat.category}>
                    {cat.options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Truck Body Type</label>
              <select
                name="vehicleBodyType"
                value={formData.vehicleBodyType}
                onChange={handleInputChange}
                className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none cursor-pointer"
              >
                {BODY_TYPE_OPTIONS.map(bt => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Commercial Permit Type</label>
              <select
                name="vehiclePermitType"
                value={formData.vehiclePermitType}
                onChange={handleInputChange}
                className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none cursor-pointer"
              >
                {PERMIT_OPTIONS.map(po => (
                  <option key={po} value={po}>{po}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Fitness Validity Date</label>
              <input
                type="date"
                name="vehicleFitnessValidTill"
                value={formData.vehicleFitnessValidTill}
                onChange={handleInputChange}
                className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Insurance Validity Date</label>
              <input
                type="date"
                name="vehicleInsuranceValidTill"
                value={formData.vehicleInsuranceValidTill}
                onChange={handleInputChange}
                className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* RC Document & Truck Live Photo Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* RC Photo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Vehicle RC Book Document (Optional)</label>
              <div className="border border-dashed border-slate-300 rounded-2xl p-3 text-center bg-slate-50/60 hover:bg-slate-50 transition-colors">
                {formData.vehicleRcPhotoUrl || localPreviews.vehicleRcPhotoUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.vehicleRcPhotoUrl || localPreviews.vehicleRcPhotoUrl}
                      alt="RC Preview"
                      className="h-24 w-36 object-cover rounded-xl border shadow-xs cursor-pointer"
                      onClick={() => setPreviewLightbox({
                        url: formData.vehicleRcPhotoUrl || localPreviews.vehicleRcPhotoUrl,
                        title: 'Vehicle RC Document'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto('vehicleRcPhotoUrl')}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-3">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && handleFileUpload('vehicleRcPhotoUrl', e.target.files[0], 'vehicle_docs')}
                    />
                    {uploadingField === 'vehicleRcPhotoUrl' ? (
                      <Loader2 size={24} className="animate-spin text-emerald-600 mx-auto" />
                    ) : (
                      <>
                        <FileText size={22} className="text-slate-400 mx-auto mb-1" />
                        <span className="text-xs font-bold text-emerald-700 block">Upload Vehicle RC (Optional)</span>
                        <span className="text-[10px] text-slate-400">RC Smart Card or Paper RC</span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            {/* Truck Live Photo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Truck Live / Front Photo</label>
              <div className="border border-dashed border-slate-300 rounded-2xl p-3 text-center bg-slate-50/60 hover:bg-slate-50 transition-colors">
                {formData.vehiclePhotoUrl || localPreviews.vehiclePhotoUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.vehiclePhotoUrl || localPreviews.vehiclePhotoUrl}
                      alt="Truck Preview"
                      className="h-24 w-36 object-cover rounded-xl border shadow-xs cursor-pointer"
                      onClick={() => setPreviewLightbox({
                        url: formData.vehiclePhotoUrl || localPreviews.vehiclePhotoUrl,
                        title: 'Truck Live Photo'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto('vehiclePhotoUrl')}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-3">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && handleFileUpload('vehiclePhotoUrl', e.target.files[0], 'vehicle_photos')}
                    />
                    {uploadingField === 'vehiclePhotoUrl' ? (
                      <Loader2 size={24} className="animate-spin text-emerald-600 mx-auto" />
                    ) : (
                      <>
                        <Camera size={22} className="text-slate-400 mx-auto mb-1" />
                        <span className="text-xs font-bold text-emerald-700 block">Upload Live Truck Photo</span>
                        <span className="text-[10px] text-slate-400">Front view showing number plate</span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: COMMERCIAL TERMS & LOADING READINESS */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                4
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                Commercial Deal & Loading Readiness
              </h2>
            </div>
            <span className="text-xs text-slate-400 shrink-0 font-medium">Step 4 of 4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Agreed Freight Rate with Driver (₹ INR) (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 8500"
                  name="negotiatedAmount"
                  value={formData.negotiatedAmount}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-8 pr-3.5 bg-emerald-50/40 border border-emerald-300 rounded-xl text-base font-black text-emerald-950 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                The total amount agreed between you and the driver/owner for this trip.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Advance Required at Loading (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 2500"
                  name="advanceRequired"
                  value={formData.advanceRequired}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-8 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Amount required by driver for diesel / enroute toll expenses.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Ready to Load Schedule
              </label>
              <div className="relative">
                <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Immediate / Today 4 PM / Tomorrow morning"
                  name="readyToLoadAt"
                  value={formData.readyToLoadAt}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Agent Remarks & Notes for Ops
              </label>
              <input
                type="text"
                placeholder="e.g. Driver verified, ready at Transport Nagar, clean vehicle"
                name="agentNotes"
                value={formData.agentNotes}
                onChange={handleInputChange}
                className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || uploadingField !== null}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold rounded-2xl text-sm sm:text-base transition-all shadow-lg shadow-emerald-600/25 active:scale-[0.99] flex justify-center items-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Validating & Linking Driver to Booking...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                <span>Submit Confirmed Driver & Truck to GoMyTruck Ops →</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            By submitting, you confirm that the driver and truck are ready and agreed for physical loading upon customer confirmation.
          </p>
        </div>
      </form>

      {/* Lightbox Modal */}
      {previewLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPreviewLightbox(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-3 mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b">
              <h4 className="text-sm font-bold text-slate-900">{previewLightbox.title}</h4>
              <button
                type="button"
                onClick={() => setPreviewLightbox(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center">
              <img
                src={previewLightbox.url}
                alt={previewLightbox.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Agent KYC Modal for unverified agents */}
      <AgentKycModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        initialData={profile}
        onSuccess={(updated) => {
          setProfile(updated);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('agent_profile_updated', { detail: updated }));
          }
        }}
      />
    </div>
  );
}
