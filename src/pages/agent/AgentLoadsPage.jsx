import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { Package, MapPin, IndianRupee, Clock, ArrowRight, Truck } from 'lucide-react';

export default function AgentLoadsPage() {
  const [loads, setLoads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoads = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient('/broker/loads');
        const data = await res.json();
        if (data.success) {
          setLoads(data.data || []);
        } else {
          setError(data.message || 'Failed to fetch loads');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoads();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
        {error}
      </div>
    );
  }

  if (loads.length === 0) {
    return (
      <div className="bg-white py-16 px-4 text-center rounded-2xl shadow-sm border border-slate-100">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No Active Loads</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          There are currently no open loads available. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Available Loads</h1>
          <p className="text-slate-500 text-sm">Find and bid on open requirements.</p>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Showing {loads.length} results
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loads.map(load => (
          <div key={load.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  <Truck size={14} /> {load.vehicleType}
                </div>
                {load.isUrgent && (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md flex items-center gap-1">
                    <Clock size={12} /> URGENT
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-6 relative">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">Pickup</p>
                  <p className="font-bold text-slate-800 truncate" title={load.pickupCity}>{load.pickupCity}</p>
                </div>
                <div className="px-4 text-slate-300">
                  <ArrowRight size={20} />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">Drop</p>
                  <p className="font-bold text-slate-800 truncate" title={load.dropCity}>{load.dropCity}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-t border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Weight / Volume</p>
                  <p className="font-semibold text-slate-700 text-sm">{load.weight} {load.unit || 'Tons'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Budget</p>
                  <p className="font-semibold text-green-600 flex items-center text-sm">
                    <IndianRupee size={14} /> {load.budget || 'Open'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/agent/post?loadId=${load.id}`)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                Submit Quote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
