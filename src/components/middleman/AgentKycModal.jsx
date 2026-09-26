import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ShieldCheck, Camera, FileText, CreditCard, UploadCloud, 
  CheckCircle2, AlertTriangle, Loader2, Building2, MapPin, Eye, ExternalLink, RefreshCw
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';

export default function AgentKycModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    primaryCity: '',
    primaryState: '',
    age: '',
    gender: 'MALE',
    educationLevel: 'Graduate',
    fullAddress: '',
    profilePhotoUrl: '',
    aadhaarNumber: '',
    aadhaarDocUrl: '',
    panNumber: '',
    panDocUrl: '',
    bankName: '',
    bankAccountHolderName: '',
    bankAccountNumber: '',
    bankIfsc: '',
    bankUpiId: '',
  });

  const [activeTab, setActiveTab] = useState('docs'); // 'docs' | 'personal' | 'bank'
  const [uploadingField, setUploadingField] = useState(null); // 'profilePhotoUrl' | 'aadhaarDocUrl' | 'panDocUrl'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localPreviews, setLocalPreviews] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill existing data if available
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        name: initialData.user?.name || initialData.name || prev.name,
        email: initialData.user?.email || initialData.email || prev.email,
        primaryCity: initialData.primaryCity || prev.primaryCity,
        primaryState: initialData.primaryState || prev.primaryState,
        age: initialData.age ? String(initialData.age) : prev.age,
        gender: initialData.gender || prev.gender,
        educationLevel: initialData.educationLevel || prev.educationLevel,
        fullAddress: initialData.fullAddress || prev.fullAddress,
        profilePhotoUrl: initialData.profilePhotoUrl || initialData.user?.profileImageUrl || prev.profilePhotoUrl,
        aadhaarNumber: initialData.aadhaarNumber || prev.aadhaarNumber,
        aadhaarDocUrl: initialData.aadhaarDocUrl || prev.aadhaarDocUrl,
        panNumber: initialData.panNumber || prev.panNumber,
        panDocUrl: initialData.panDocUrl || prev.panDocUrl,
        bankName: initialData.bankName || prev.bankName,
        bankAccountHolderName: initialData.bankAccountHolderName || prev.bankAccountHolderName,
        bankAccountNumber: initialData.bankAccountNumber || prev.bankAccountNumber,
        bankIfsc: initialData.bankIfsc || prev.bankIfsc,
        bankUpiId: initialData.bankUpiId || prev.bankUpiId,
      }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  // Handle generic input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  // Upload file to server /api/v1/upload/single
  const handleFileUpload = async (field, file, folder = 'documents') => {
    if (!file) return;

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('File size too large. Maximum limit is 8MB.');
      return;
    }

    // Set local immediate preview for images
    if (file.type.startsWith('image/')) {
      const blobUrl = URL.createObjectURL(file);
      setLocalPreviews(prev => ({ ...prev, [field]: blobUrl }));
    }

    setUploadingField(field);
    setUploadProgress(20);
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', folder);

      setUploadProgress(50);
      const res = await apiClient('/upload/single', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      setUploadProgress(100);

      if (json.success && json.data?.url) {
        setFormData(p => ({ ...p, [field]: json.data.url }));
      } else {
        throw new Error(json.message || 'File upload failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error uploading file. Please try again.');
    } finally {
      setUploadingField(null);
      setUploadProgress(0);
    }
  };

  // Validate and submit KYC
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic Validations
    if (!formData.profilePhotoUrl && !localPreviews.profilePhotoUrl) {
      setActiveTab('docs');
      return setErrorMsg('Please upload a passport-size profile photograph.');
    }
    if (!formData.aadhaarDocUrl && !localPreviews.aadhaarDocUrl) {
      setActiveTab('docs');
      return setErrorMsg('Please upload a scan or clear photo of your Aadhaar card.');
    }
    if (!formData.panDocUrl && !localPreviews.panDocUrl) {
      setActiveTab('docs');
      return setErrorMsg('Please upload a scan or clear photo of your PAN card.');
    }
    if (!formData.primaryCity?.trim()) {
      setActiveTab('personal');
      return setErrorMsg('Please specify your primary operational city.');
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        primaryCity: formData.primaryCity.trim(),
        primaryState: formData.primaryState.trim() || undefined,
        operatingCities: [formData.primaryCity.trim()],
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender,
        educationLevel: formData.educationLevel,
        fullAddress: formData.fullAddress.trim() || undefined,
        profilePhotoUrl: formData.profilePhotoUrl || undefined,
        aadhaarNumber: formData.aadhaarNumber.trim() || undefined,
        aadhaarLast4: formData.aadhaarNumber ? formData.aadhaarNumber.slice(-4) : undefined,
        aadhaarDocUrl: formData.aadhaarDocUrl || undefined,
        panNumber: formData.panNumber.trim().toUpperCase() || undefined,
        panDocUrl: formData.panDocUrl || undefined,
        bankName: formData.bankName.trim() || undefined,
        bankAccountHolderName: formData.bankAccountHolderName.trim() || undefined,
        bankAccountNumber: formData.bankAccountNumber.trim() || undefined,
        bankIfsc: formData.bankIfsc.trim().toUpperCase() || undefined,
        bankUpiId: formData.bankUpiId.trim() || undefined,
      };

      const res = await apiClient('/broker/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setIsSuccess(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gmt_agent_kyc_submitted', 'true');
        }
        if (onSuccess) {
          onSuccess(result.data);
        }
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2200);
      } else {
        setErrorMsg(result.message || 'Failed to submit KYC data.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network error while submitting KYC.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isImg = (url) => {
    if (!url) return false;
    const l = url.toLowerCase();
    return l.startsWith('blob:') || l.startsWith('data:') || l.includes('.jpg') || l.includes('.jpeg') || l.includes('.png') || l.includes('.webp');
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 text-white p-5 sm:p-6 shrink-0 relative">
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-white/10 border border-white/20">
              <ShieldCheck size={22} className="text-emerald-300" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                Transport Agent KYC Verification
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                GoMyTruck Verified Partner Program
              </span>
            </div>
          </div>
          
          <p className="text-xs text-emerald-50/90 leading-relaxed mt-1">
            Complete your KYC and banking credentials to activate load sourcing, quote on live consignments, and receive flat-fee bounties.
          </p>
        </div>

        {/* Success Modal View */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">KYC Submitted Successfully!</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              Your profile documents and banking details have been uploaded. Our operations team is reviewing your agency credentials. You will receive an instant notification once verified.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
              <RefreshCw size={14} className="animate-spin" />
              <span>Updating Agent Workspace...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            
            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('docs')}
                className={`pb-2.5 flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'docs' 
                    ? 'border-emerald-600 text-emerald-700' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText size={14} />
                <span>1. Documents & Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`pb-2.5 flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'personal' 
                    ? 'border-emerald-600 text-emerald-700' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MapPin size={14} />
                <span>2. Territory & Info</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className={`pb-2.5 flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'bank' 
                    ? 'border-emerald-600 text-emerald-700' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <CreditCard size={14} />
                <span>3. Bank & Payouts</span>
              </button>
            </div>

            {/* TAB 1: DOCUMENTS (Photo, Aadhaar, PAN) */}
            {activeTab === 'docs' && (
              <div className="space-y-4">
                
                {/* 1. Profile Photograph */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Camera size={15} className="text-emerald-600" />
                        Agent Passport Photograph <span className="text-red-500">*</span>
                      </span>
                      <p className="text-[11px] text-slate-500">Recent photo for ID card & trust badge (JPEG, PNG, WEBP)</p>
                    </div>
                    {(formData.profilePhotoUrl || localPreviews.profilePhotoUrl) && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Uploaded
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Preview Thumbnail */}
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                      {(localPreviews.profilePhotoUrl || formData.profilePhotoUrl) ? (
                        <img 
                          src={localPreviews.profilePhotoUrl || formData.profilePhotoUrl} 
                          alt="Agent Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera size={24} className="text-slate-300" />
                      )}
                    </div>

                    {/* Upload Input Button */}
                    <div className="flex-1">
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98">
                        {uploadingField === 'profilePhotoUrl' ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-emerald-600" />
                            <span>Uploading {uploadProgress}%</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud size={14} className="text-emerald-600" />
                            <span>{(formData.profilePhotoUrl || localPreviews.profilePhotoUrl) ? 'Change Photo' : 'Upload Passport Photo'}</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingField !== null}
                          onChange={(e) => handleFileUpload('profilePhotoUrl', e.target.files[0], 'profile')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Aadhaar Card */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText size={15} className="text-emerald-600" />
                        Aadhaar Card Verification <span className="text-red-500">*</span>
                      </span>
                      <p className="text-[11px] text-slate-500">Government UIDAI Identity Document (Front/Back)</p>
                    </div>
                    {(formData.aadhaarDocUrl || localPreviews.aadhaarDocUrl) && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Uploaded
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      placeholder="12-digit Aadhaar Number (e.g. 1234 5678 9012)"
                      maxLength={14}
                      className="w-full text-xs font-mono font-bold p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />

                    <div className="flex items-center gap-3">
                      {(localPreviews.aadhaarDocUrl || formData.aadhaarDocUrl) && (
                        <div className="w-14 h-14 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0">
                          {isImg(localPreviews.aadhaarDocUrl || formData.aadhaarDocUrl) ? (
                            <img 
                              src={localPreviews.aadhaarDocUrl || formData.aadhaarDocUrl} 
                              alt="Aadhaar Document" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[9px] font-bold text-red-600 bg-red-50">
                              <FileText size={16} /> PDF
                            </div>
                          )}
                        </div>
                      )}

                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98">
                        {uploadingField === 'aadhaarDocUrl' ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-emerald-600" />
                            <span>Uploading {uploadProgress}%</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud size={14} className="text-emerald-600" />
                            <span>{(formData.aadhaarDocUrl || localPreviews.aadhaarDocUrl) ? 'Re-upload Aadhaar' : 'Upload Aadhaar File'}</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          disabled={uploadingField !== null}
                          onChange={(e) => handleFileUpload('aadhaarDocUrl', e.target.files[0], 'documents')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 3. PAN Card */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <CreditCard size={15} className="text-emerald-600" />
                        PAN Card Verification <span className="text-red-500">*</span>
                      </span>
                      <p className="text-[11px] text-slate-500">Income Tax Department Permanent Account Number</p>
                    </div>
                    {(formData.panDocUrl || localPreviews.panDocUrl) && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Uploaded
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => setFormData(p => ({ ...p, panNumber: e.target.value.toUpperCase() }))}
                      placeholder="10-character PAN (e.g. ABCDE1234F)"
                      maxLength={10}
                      className="w-full text-xs font-mono font-bold p-2.5 bg-white border border-slate-300 rounded-xl uppercase focus:ring-2 focus:ring-emerald-500 outline-none"
                    />

                    <div className="flex items-center gap-3">
                      {(localPreviews.panDocUrl || formData.panDocUrl) && (
                        <div className="w-14 h-14 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0">
                          {isImg(localPreviews.panDocUrl || formData.panDocUrl) ? (
                            <img 
                              src={localPreviews.panDocUrl || formData.panDocUrl} 
                              alt="PAN Document" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[9px] font-bold text-red-600 bg-red-50">
                              <FileText size={16} /> PDF
                            </div>
                          )}
                        </div>
                      )}

                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98">
                        {uploadingField === 'panDocUrl' ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-emerald-600" />
                            <span>Uploading {uploadProgress}%</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud size={14} className="text-emerald-600" />
                            <span>{(formData.panDocUrl || localPreviews.panDocUrl) ? 'Re-upload PAN' : 'Upload PAN Card'}</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          disabled={uploadingField !== null}
                          onChange={(e) => handleFileUpload('panDocUrl', e.target.files[0], 'documents')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('personal')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Next: Territory & Personal Info →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: PERSONAL & TERRITORY */}
            {activeTab === 'personal' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Full Name / Agency Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Agency or Contact Name"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="agent@example.com"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Primary Operational City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="primaryCity"
                      value={formData.primaryCity}
                      onChange={handleChange}
                      placeholder="e.g. Kolkata, Delhi, Jaipur"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Primary State</label>
                    <input
                      type="text"
                      name="primaryState"
                      value={formData.primaryState}
                      onChange={handleChange}
                      placeholder="e.g. West Bengal, Maharashtra"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="e.g. 32"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Business / Residential Address</label>
                  <textarea
                    rows={2}
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    placeholder="Enter complete office address, street, landmark, pincode"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('docs')}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    ← Back to Documents
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bank')}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Next: Bank & Payouts →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: BANKING & SETTLEMENTS */}
            {activeTab === 'bank' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] leading-relaxed">
                  💡 <strong>Bounty Payout Readiness:</strong> When you connect matching trucks and verify physical loading with the 4-digit OTP, your flat-fee bounties are transferred to this bank account or UPI ID.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="e.g. State Bank of India, HDFC Bank"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Account Holder Name</label>
                    <input
                      type="text"
                      name="bankAccountHolderName"
                      value={formData.bankAccountHolderName}
                      onChange={handleChange}
                      placeholder="Matches Aadhaar / PAN"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Account Number</label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      placeholder="e.g. 100029384756"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">IFSC Code</label>
                    <input
                      type="text"
                      name="bankIfsc"
                      value={formData.bankIfsc}
                      onChange={(e) => setFormData(p => ({ ...p, bankIfsc: e.target.value.toUpperCase() }))}
                      placeholder="e.g. SBIN0001234"
                      maxLength={11}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-700">UPI ID / VPA (Optional - for Fast Settlements)</label>
                    <input
                      type="text"
                      name="bankUpiId"
                      value={formData.bankUpiId}
                      onChange={handleChange}
                      placeholder="e.g. agentphone@okaxis, agency@upi"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-emerald-700"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab('personal')}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    ← Back to Personal Info
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingField !== null}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Submitting KYC...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Submit KYC for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>
        )}

      </div>
    </div>
  );
}
