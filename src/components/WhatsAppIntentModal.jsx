import React, { useState, useEffect, useRef } from 'react';
import { X, Truck, UserCheck, Building2, HelpCircle, ArrowRight, Check, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.gomytruck.com/api/v1';

// ── Field wrapper — defined at MODULE level so React never remounts inputs ────
function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-slate-600 block mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-500 font-semibold mt-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

const INTENTS = [
  {
    id: 'BOOK',
    title: 'Book a Truck / Tempo',
    badge: 'Customer',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: Truck,
    subtitle: 'I need to move goods'
  },
  {
    id: 'PARTNER',
    title: 'Become a Driver Partner',
    badge: 'Driver',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: UserCheck,
    subtitle: 'I own a vehicle & want work'
  },
  {
    id: 'ENTERPRISE',
    title: 'Enterprise Logistics',
    badge: 'B2B',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Building2,
    subtitle: 'Business needing bulk logistics'
  },
  {
    id: 'SUPPORT',
    title: 'Support & Inquiry',
    badge: 'Support',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: HelpCircle,
    subtitle: 'Help with bookings/billing'
  }
];

export function openGMTWhatsAppModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open_gmt_whatsapp_modal'));
  }
}

export default function WhatsAppIntentModal({ initialIntent = 'BOOK' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState(initialIntent);

  // ── REQUIRED common fields ──────────────────────────────────────────────────
  const [userName, setUserName]   = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [errors, setErrors]       = useState({});

  // ── Intent-specific optional fields ────────────────────────────────────────
  const [pickupCity, setPickupCity] = useState('');
  const [dropCity, setDropCity]     = useState('');
  const [vehicleType, setVehicleType] = useState('Tata Ace/Mini Truck');
  const [goodsType, setGoodsType]   = useState('');
  
  const [partnerCity, setPartnerCity] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [enterpriseCity, setEnterpriseCity] = useState('');
  const [monthlyRequirement, setMonthlyRequirement] = useState('');

  const [bookingNumber, setBookingNumber] = useState('');
  const [query, setQuery] = useState('');

  const nameRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open_gmt_whatsapp_modal', handleOpen);
    return () => window.removeEventListener('open_gmt_whatsapp_modal', handleOpen);
  }, []);

  const onClose = () => setIsOpen(false);

  // Sync intent if prop changes
  useEffect(() => {
    if (initialIntent) setSelectedIntent(initialIntent);
  }, [initialIntent]);

  // Reset errors & required fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  // Scroll-lock + ESC
  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Build WhatsApp message ──────────────────────────────────────────────────
  const getWhatsAppMessage = () => {
    const nameTag  = userName.trim()  || '[Name]';
    const phoneTag = userPhone.trim() || '[Phone]';
    const emailTag = userEmail.trim() || '[Email]';

    if (selectedIntent === 'BOOK') {
      return (
`🚚 *TRUCK BOOKING REQUEST*

👤 Name: ${nameTag}
📞 Phone: ${phoneTag}
📧 Email: ${emailTag}
📍 Pickup: ${pickupCity.trim() || '[Pickup]'}
📍 Drop: ${dropCity.trim() || '[Drop]'}
🚛 Vehicle: ${vehicleType}
📦 Goods: ${goodsType.trim() || '[Goods]'}

Sent via GoMyTruck.com`
      );
    }

    if (selectedIntent === 'PARTNER') {
      return (
`🚗 *DRIVER PARTNER REGISTRATION*

👤 Name: ${nameTag}
📞 Phone: ${phoneTag}
📧 Email: ${emailTag}
🏙️ City: ${partnerCity.trim() || '[City]'}
🚛 Vehicle: ${vehicleType}
🔢 Reg No: ${vehicleNumber.trim() || '[Reg No]'}

Sent via GoMyTruck.com`
      );
    }

    if (selectedIntent === 'ENTERPRISE') {
      return (
`🏢 *ENTERPRISE LOGISTICS ENQUIRY*

👤 Name: ${nameTag}
📞 Phone: ${phoneTag}
📧 Email: ${emailTag}
🏢 Company: ${companyName.trim() || '[Company]'}
🏙️ City: ${enterpriseCity.trim() || '[City]'}
📊 Requirement: ${monthlyRequirement.trim() || '[Requirement]'}
📦 Goods: ${goodsType.trim() || '[Goods]'}

Sent via GoMyTruck.com`
      );
    }

    // SUPPORT
    return (
`💬 *SUPPORT REQUEST*

👤 Name: ${nameTag}
📞 Phone: ${phoneTag}
📧 Email: ${emailTag}
🔖 Booking No: ${bookingNumber.trim() || '[Booking No]'}
❓ Query: ${query.trim() || '[Query]'}

Sent via GoMyTruck.com`
    );
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!userName.trim())                                     newErrors.userName  = 'Name is required';
    if (!userEmail.trim() || !/^\S+@\S+\.\S+$/.test(userEmail)) newErrors.userEmail = 'Valid email is required';
    if (!/^[6-9]\d{9}$/.test(userPhone.replace(/\s/g, '')))  newErrors.userPhone = 'Enter a valid 10-digit mobile number';

    if (selectedIntent === 'BOOK') {
      if (!pickupCity.trim()) newErrors.pickupCity = 'Pickup city is required';
      if (!dropCity.trim()) newErrors.dropCity = 'Drop city is required';
    } else if (selectedIntent === 'PARTNER') {
      if (!partnerCity.trim()) newErrors.partnerCity = 'City is required';
    } else if (selectedIntent === 'ENTERPRISE') {
      if (!companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!enterpriseCity.trim()) newErrors.enterpriseCity = 'City is required';
    }

    return newErrors;
  };

  // ── Send to backend → Google Sheets (fire-and-forget) ──────────────────────
  const sendToSheet = () => {
    const payload = {
      intent: INTENTS.find(i => i.id === selectedIntent)?.title,
      name: userName.trim(),
      phone: userPhone.trim(),
      email: userEmail.trim(),
      pickupCity: selectedIntent === 'BOOK' ? pickupCity.trim() : undefined,
      dropCity: selectedIntent === 'BOOK' ? dropCity.trim() : undefined,
      vehicleType: (selectedIntent === 'BOOK' || selectedIntent === 'PARTNER') ? vehicleType : undefined,
      goodsType: (selectedIntent === 'BOOK' || selectedIntent === 'ENTERPRISE') ? goodsType.trim() : undefined,
      city: selectedIntent === 'PARTNER' ? partnerCity.trim() : selectedIntent === 'ENTERPRISE' ? enterpriseCity.trim() : undefined,
      vehicleNumber: selectedIntent === 'PARTNER' ? vehicleNumber.trim() : undefined,
      companyName: selectedIntent === 'ENTERPRISE' ? companyName.trim() : undefined,
      monthlyRequirement: selectedIntent === 'ENTERPRISE' ? monthlyRequirement.trim() : undefined,
      bookingNumber: selectedIntent === 'SUPPORT' ? bookingNumber.trim() : undefined,
      query: selectedIntent === 'SUPPORT' ? query.trim() : undefined
    };

    fetch(`${API_BASE}/leads/gmt-whatsapp-log`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    }).catch(() => {});
  };

  // ── Open WhatsApp ───────────────────────────────────────────────────────────
  const handleOpenWhatsApp = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrors({});
    sendToSheet();
    const text = getWhatsAppMessage();
    const url  = `https://wa.me/919331488999?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  const vehicleOptions = ['Tata Ace/Mini Truck', '14ft Truck', '17ft Truck', '20ft Truck', '32ft Container Trailer'];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Truck size={20} className="text-white" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-orange-200">
              GoMyTruck Official WhatsApp
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            How can we help you today?
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 font-medium mt-1">
            Fill your details so our team responds immediately with the right information.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* ── REQUIRED FIELDS ─────────────────────────────────────────── */}
          <div ref={nameRef} className="bg-red-50/60 border border-red-200/70 rounded-2xl p-3.5 sm:p-4 space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Your Contact Details <span className="text-red-400">(required)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Field label="Full Name" required error={errors.userName}>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={userName}
                  onChange={(e) => { setUserName(e.target.value); setErrors(p => ({ ...p, userName: '' })); }}
                  className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors ${errors.userName ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'}`}
                />
              </Field>
              <Field label="Email Address" required error={errors.userEmail}>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={userEmail}
                  onChange={(e) => { setUserEmail(e.target.value); setErrors(p => ({ ...p, userEmail: '' })); }}
                  className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors ${errors.userEmail ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'}`}
                />
              </Field>
              <Field label="Phone Number" required error={errors.userPhone}>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={userPhone}
                  maxLength={10}
                  onChange={(e) => { setUserPhone(e.target.value.replace(/\D/g, '')); setErrors(p => ({ ...p, userPhone: '' })); }}
                  className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors ${errors.userPhone ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'}`}
                />
              </Field>
            </div>
          </div>

          {/* ── INTENT SELECTOR ─────────────────────────────────────────── */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5">
              1. Select your requirement:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INTENTS.map((intent) => {
                const Icon = intent.icon;
                const isSelected = selectedIntent === intent.id;
                return (
                  <button
                    key={intent.id}
                    type="button"
                    onClick={() => setSelectedIntent(intent.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0 pr-5">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{intent.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{intent.subtitle}</p>
                    </div>
                    <div className="absolute top-3.5 right-3.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-orange-600 bg-orange-600' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check size={10} className="text-white stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── INTENT-SPECIFIC FIELDS ────────────────────────── */}
          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
              2. Additional Details:
            </label>

            {selectedIntent === 'BOOK' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Field label="Pickup City" required error={errors.pickupCity}>
                    <input type="text" placeholder="e.g. Kolkata" value={pickupCity}
                      onChange={(e) => { setPickupCity(e.target.value); setErrors(p => ({...p, pickupCity: ''})); }}
                      className={`w-full bg-white border ${errors.pickupCity ? 'border-red-400' : 'border-slate-200'} rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500`} />
                  </Field>
                  <Field label="Drop City" required error={errors.dropCity}>
                    <input type="text" placeholder="e.g. Delhi" value={dropCity}
                      onChange={(e) => { setDropCity(e.target.value); setErrors(p => ({...p, dropCity: ''})); }}
                      className={`w-full bg-white border ${errors.dropCity ? 'border-red-400' : 'border-slate-200'} rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500`} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Field label="Vehicle Type">
                    <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500 cursor-pointer">
                      {vehicleOptions.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  </Field>
                  <Field label="Goods Type">
                    <input type="text" placeholder="e.g. Electronics, Furniture" value={goodsType}
                      onChange={(e) => setGoodsType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500" />
                  </Field>
                </div>
              </div>
            )}

            {selectedIntent === 'PARTNER' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Field label="City" required error={errors.partnerCity}>
                    <input type="text" placeholder="e.g. Mumbai" value={partnerCity}
                      onChange={(e) => { setPartnerCity(e.target.value); setErrors(p => ({...p, partnerCity: ''})); }}
                      className={`w-full bg-white border ${errors.partnerCity ? 'border-red-400' : 'border-slate-200'} rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500`} />
                  </Field>
                  <Field label="Vehicle Type">
                    <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500 cursor-pointer">
                      {vehicleOptions.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Vehicle Number">
                  <input type="text" placeholder="e.g. MH01AB1234" value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500" />
                </Field>
              </div>
            )}

            {selectedIntent === 'ENTERPRISE' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Field label="Company Name" required error={errors.companyName}>
                    <input type="text" placeholder="e.g. ABC Pvt Ltd" value={companyName}
                      onChange={(e) => { setCompanyName(e.target.value); setErrors(p => ({...p, companyName: ''})); }}
                      className={`w-full bg-white border ${errors.companyName ? 'border-red-400' : 'border-slate-200'} rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500`} />
                  </Field>
                  <Field label="City" required error={errors.enterpriseCity}>
                    <input type="text" placeholder="e.g. Pune" value={enterpriseCity}
                      onChange={(e) => { setEnterpriseCity(e.target.value); setErrors(p => ({...p, enterpriseCity: ''})); }}
                      className={`w-full bg-white border ${errors.enterpriseCity ? 'border-red-400' : 'border-slate-200'} rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500`} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Field label="Monthly Requirement">
                    <input type="text" placeholder="e.g. 50 trucks/month" value={monthlyRequirement}
                      onChange={(e) => setMonthlyRequirement(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500" />
                  </Field>
                  <Field label="Goods Type">
                    <input type="text" placeholder="e.g. FMCG" value={goodsType}
                      onChange={(e) => setGoodsType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500" />
                  </Field>
                </div>
              </div>
            )}

            {selectedIntent === 'SUPPORT' && (
              <div className="space-y-3">
                <Field label="Booking Number">
                  <input type="text" placeholder="e.g. GMT-12345" value={bookingNumber}
                    onChange={(e) => setBookingNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500" />
                </Field>
                <Field label="Query">
                  <textarea placeholder="Describe your issue..." value={query}
                    onChange={(e) => setQuery(e.target.value)} rows={3}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500" />
                </Field>
              </div>
            )}
          </div>

          {/* ── LIVE PREVIEW ─────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Live WhatsApp Message Preview:
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Pre-formatted template</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-[#EFEAE2] border border-slate-200/80 shadow-inner">
              <div className="bg-[#E7FFDB] text-slate-900 text-xs sm:text-[13px] font-sans leading-relaxed p-3 sm:p-3.5 rounded-2xl rounded-tr-xs shadow-xs border border-emerald-200/60 whitespace-pre-line">
                {getWhatsAppMessage()}
                <div className="flex justify-end items-center gap-1 text-[10px] text-slate-500 mt-2">
                  <span>Just now</span>
                  <span className="text-blue-500 font-bold">✓✓</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span>Open WhatsApp Chat</span>
            <ArrowRight size={18} />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500 text-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Official Number: +91 9331488999 · Typical reply in &lt; 5 mins</span>
          </div>
        </div>

      </div>
    </div>
  );
}
