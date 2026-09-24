import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { Upload, CheckCircle, IndianRupee, Phone, User, Truck, Loader2 } from 'lucide-react';

export default function AgentPostPage() {
  const [searchParams] = useSearchParams();
  const loadId = searchParams.get('loadId');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    driverPhone: '',
    driverName: '',
    vehicleRegNo: '',
    rcPhotoUrl: '',
    truckPhotoUrl: '',
    negotiatedAmount: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const draft = sessionStorage.getItem('agent_post_form_draft');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed.loadId === loadId) {
            setFormData(parsed.data);
          }
        } catch (e) {}
      }
    }
  }, [loadId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('agent_post_form_draft', JSON.stringify({ loadId, data: newData }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loadId) {
      return setError('No Load ID provided. Please select a load first.');
    }
    if (!/^[6-9]\d{9}$/.test(formData.driverPhone)) {
      return setError('Please enter a valid 10-digit driver phone number.');
    }
    if (!formData.vehicleRegNo) {
      return setError('Vehicle Registration Number is required.');
    }
    if (!formData.negotiatedAmount || isNaN(formData.negotiatedAmount) || Number(formData.negotiatedAmount) <= 0) {
      return setError('Please enter a valid negotiated amount.');
    }

    setIsLoading(true);
    try {
      const res = await apiClient(`/broker/loads/${loadId}/quote`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('agent_post_form_draft');
        }
        setTimeout(() => navigate('/agent/loads'), 2000);
      } else {
        setError(data.message || 'Failed to submit quote.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-green-100 text-center mt-10">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Quote Submitted!</h2>
        <p className="text-slate-500 mb-6">Your bid has been successfully posted. Redirecting to loads...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Submit Quote</h1>
        <p className="text-slate-500 text-sm">Provide driver and vehicle details for load {loadId}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Driver Phone <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-slate-400" />
                </div>
                <input 
                  type="tel"
                  name="driverPhone"
                  maxLength={10}
                  required
                  value={formData.driverPhone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    handleChange({ target: { name: 'driverPhone', value: val } });
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Driver Name (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-slate-400" />
                </div>
                <input 
                  type="text"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                  placeholder="e.g. Rajesh Kumar"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Reg. No <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Truck size={16} className="text-slate-400" />
                </div>
                <input 
                  type="text"
                  name="vehicleRegNo"
                  required
                  value={formData.vehicleRegNo}
                  onChange={(e) => {
                    handleChange({ target: { name: 'vehicleRegNo', value: e.target.value.toUpperCase() } });
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors uppercase"
                  placeholder="e.g. WB23A1234"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Final Quote Amount (₹) <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee size={16} className="text-slate-400" />
                </div>
                <input 
                  type="number"
                  name="negotiatedAmount"
                  required
                  min="1"
                  value={formData.negotiatedAmount}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                  placeholder="e.g. 15000"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-700 mb-4">Document Uploads</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50 transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">Upload RC Photo</p>
                <p className="text-xs text-slate-500 mt-1">Tap to select (Required)</p>
                {/* Note: In a real app this would use a file input + S3 upload, just setting string for now based on requirement */}
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50 transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">Upload Truck Photo</p>
                <p className="text-xs text-slate-500 mt-1">Tap to select (Optional)</p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isLoading || !loadId}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Submit Quote & Lock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
