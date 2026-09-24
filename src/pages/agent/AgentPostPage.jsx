import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { useCity } from '../../context/CityContext';
import { CheckCircle, IndianRupee, Phone, User, Truck, Loader2, PlusCircle, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

const VEHICLE_OPTIONS = [
  { value: "TATA_ACE", label: "Tata Ace (Chota Hathi) - 750 kg" },
  { value: "BOLERO_PICKUP", label: "8ft Bolero Pickup - 1.2 - 1.7 Ton" },
  { value: "TRUCK_14FT", label: "14ft Eicher / Canter - 3.5 - 4 Ton" },
  { value: "TRUCK_17FT", label: "17ft Medium Duty Truck - 5 - 6 Ton" },
  { value: "TRUCK_19FT", label: "19ft ICV Truck - 7 - 9 Ton" },
  { value: "TRUCK_22FT", label: "22ft Multi-Axle Truck - 10 - 15 Ton" },
  { value: "CONTAINER_32FT", label: "32ft Container - 7 - 18 Ton" },
];

export default function AgentPostPage() {
  const [searchParams] = useSearchParams();
  const initialLoadId = searchParams.get('loadId') || '';
  const [mode, setMode] = useState(initialLoadId ? 'quote' : 'post'); // 'post' | 'quote'
  const [loadId, setLoadId] = useState(initialLoadId);
  const navigate = useNavigate();
  const { currentCity } = useCity();

  // Quote Form State
  const [quoteData, setQuoteData] = useState({
    driverPhone: '',
    driverName: '',
    vehicleRegNo: '',
    negotiatedAmount: '',
    vehicleRcPhotoUrl: 'https://gomytruck-public.s3.ap-south-1.amazonaws.com/demo-rc.webp',
  });

  // Post Load Form State
  const [postData, setPostData] = useState({
    pickupCity: currentCity?.name || 'Kolkata',
    pickupAddress: '',
    dropCity: '',
    dropAddress: '',
    vehicleType: 'TATA_ACE',
    goodsType: 'General Commercial Goods',
    goodsWeightKg: '1000',
    customerBudget: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (initialLoadId) {
      setMode('quote');
      setLoadId(initialLoadId);
    }
  }, [initialLoadId]);

  useEffect(() => {
    if (!postData.pickupCity && currentCity?.name) {
      setPostData(prev => ({ ...prev, pickupCity: currentCity.name }));
    }
  }, [currentCity?.name, postData.pickupCity]);

  // Submit Driver Quote
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loadId) {
      return setError('Please enter or select a valid Load ID.');
    }
    if (!/^[6-9]\d{9}$/.test(quoteData.driverPhone)) {
      return setError('Please enter a valid 10-digit driver phone number.');
    }
    if (!quoteData.vehicleRegNo) {
      return setError('Vehicle Registration Number is required.');
    }
    if (!quoteData.negotiatedAmount || Number(quoteData.negotiatedAmount) <= 0) {
      return setError('Please enter a valid quote amount.');
    }

    setIsLoading(true);
    try {
      const res = await apiClient(`/broker/loads/${loadId}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverPhone: quoteData.driverPhone,
          driverName: quoteData.driverName || 'Driver Partner',
          vehicleRegNo: quoteData.vehicleRegNo.toUpperCase(),
          negotiatedAmount: Number(quoteData.negotiatedAmount),
          vehicleRcPhotoUrl: quoteData.vehicleRcPhotoUrl,
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccessMsg('Your quote has been submitted successfully! Redirecting to loads feed...');
        setTimeout(() => navigate('/agent/loads'), 2000);
      } else {
        setError(data.message || 'Failed to submit quote.');
      }
    } catch (err) {
      setError('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Post New Load Requirement
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!postData.pickupCity.trim() || !postData.dropCity.trim()) {
      return setError('Please enter both pickup and destination cities.');
    }
    if (!postData.customerBudget || Number(postData.customerBudget) < 100) {
      return setError('Please enter a realistic target freight budget (min ₹100).');
    }

    setIsLoading(true);
    try {
      const payload = {
        pickupCity: postData.pickupCity.trim(),
        pickupAddress: postData.pickupAddress.trim() || `${postData.pickupCity.trim()} Transport Nagar`,
        dropCity: postData.dropCity.trim(),
        dropAddress: postData.dropAddress.trim() || `${postData.dropCity.trim()} Industrial Hub`,
        vehicleType: postData.vehicleType,
        goodsType: postData.goodsType,
        goodsWeightKg: Number(postData.goodsWeightKg) || 1000,
        customerBudget: Number(postData.customerBudget),
        targetCities: [postData.pickupCity.trim().toLowerCase(), postData.dropCity.trim().toLowerCase()]
      };

      const res = await apiClient('/broker/loads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg('New load requirement posted successfully! Redirecting to loads feed...');
        setTimeout(() => navigate('/agent/loads'), 2000);
      } else {
        setError(data.message || 'Failed to post load requirement.');
      }
    } catch (err) {
      setError('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (successMsg) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-green-200 text-center mt-10 space-y-4">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={36} />
        </div>
        <h2 className="text-xl font-black text-slate-900">Success!</h2>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{successMsg}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl text-xs font-bold text-slate-600">
        <button
          type="button"
          onClick={() => { setMode('post'); setError(''); }}
          className={`flex-1 py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'post' ? 'bg-white text-green-700 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <PlusCircle size={15} />
          <span>Post Load Requirement</span>
        </button>
        <button
          type="button"
          onClick={() => { setMode('quote'); setError(''); }}
          className={`flex-1 py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'quote' ? 'bg-white text-green-700 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Truck size={15} />
          <span>Submit Driver Quote</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-xs font-bold">
          {error}
        </div>
      )}

      {/* MODE 1: POST LOAD REQUIREMENT */}
      {mode === 'post' ? (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900">Post a Load Requirement</h2>
            <p className="text-slate-500 text-xs mt-1">
              Add a customer freight requirement. It will instantly broadcast to open loads in your location.
            </p>
          </div>

          <form onSubmit={handlePostSubmit} className="p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Pickup City *</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-green-600 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kolkata"
                    value={postData.pickupCity}
                    onChange={e => setPostData({ ...postData, pickupCity: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-green-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Destination City *</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-orange-500 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patna, Asansol, Bengaluru"
                    value={postData.dropCity}
                    onChange={e => setPostData({ ...postData, dropCity: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-green-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Vehicle Type *</label>
                <select
                  value={postData.vehicleType}
                  onChange={e => setPostData({ ...postData, vehicleType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-green-600 focus:outline-none"
                >
                  {VEHICLE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Cargo Weight (kg) *</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={postData.goodsWeightKg}
                  onChange={e => setPostData({ ...postData, goodsWeightKg: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-green-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Target Freight Budget (₹ INR) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  required
                  min="100"
                  placeholder="Enter budget (e.g. 8500)"
                  value={postData.customerBudget}
                  onChange={e => setPostData({ ...postData, customerBudget: e.target.value })}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:border-green-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-green-600/20 active:scale-98 flex justify-center items-center gap-2 cursor-pointer"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Post Requirement to Network'}
            </button>
          </form>
        </div>
      ) : (
        /* MODE 2: SUBMIT DRIVER QUOTE */
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900">Submit Driver & Truck Quote</h2>
            <p className="text-slate-500 text-xs mt-1">
              Lock in a verified commercial vehicle for an open load requirement.
            </p>
          </div>

          <form onSubmit={handleQuoteSubmit} className="p-6 md:p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Load ID *</label>
              <input
                type="text"
                required
                placeholder="Enter or select Load ID"
                value={loadId}
                onChange={e => setLoadId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:border-green-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Driver Phone *</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit driver number"
                    value={quoteData.driverPhone}
                    onChange={e => setQuoteData({ ...quoteData, driverPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-green-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Driver Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Singh"
                    value={quoteData.driverName}
                    onChange={e => setQuoteData({ ...quoteData, driverName: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:border-green-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Vehicle Reg. No (RC) *</label>
                <div className="relative">
                  <Truck size={15} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. WB23A1234"
                    value={quoteData.vehicleRegNo}
                    onChange={e => setQuoteData({ ...quoteData, vehicleRegNo: e.target.value.toUpperCase() })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 uppercase focus:border-green-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Your Final Quote (₹ INR) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="e.g. 7500"
                    value={quoteData.negotiatedAmount}
                    onChange={e => setQuoteData({ ...quoteData, negotiatedAmount: e.target.value })}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:border-green-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !loadId}
              className="w-full py-3.5 bg-slate-900 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-98 flex justify-center items-center gap-2 cursor-pointer"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Submit Quote & Lock Load'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
