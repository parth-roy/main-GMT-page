import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { useCity } from '../../context/CityContext';
import { Package, MapPin, IndianRupee, Clock, ArrowRight, Truck, RefreshCw, PlusCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AgentLoadsPage() {
  const [loads, setLoads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filterMode, setFilterMode] = useState('city'); // 'city' | 'all'
  const { currentCity } = useCity();
  const navigate = useNavigate();

  const fetchLoads = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const cityParam = filterMode === 'city' && currentCity?.name ? `?city=${encodeURIComponent(currentCity.name)}` : '';
      const res = await apiClient(`/broker/loads${cityParam}`);
      const data = await res.json();
      if (data.success) {
        setLoads(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch loads');
      }
    } catch (err) {
      setError('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filterMode, currentCity?.name]);

  useEffect(() => {
    fetchLoads();
  }, [fetchLoads]);

  return (
    <div className="space-y-6">
      {/* Header with Title and Location / Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Open Freight Loads</h1>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Real-time bookings from customers and shippers across India.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setFilterMode('city')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'city' ? 'bg-white text-green-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              📍 {currentCity?.name || 'Local'}
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'all' ? 'bg-white text-green-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              🇮🇳 All India
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchLoads(true)}
            disabled={isRefreshing}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Refresh loads"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-green-600' : ''} />
          </button>

          {/* Post Requirement Button */}
          <button
            onClick={() => navigate('/agent/post')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>Post Load</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="h-10 bg-slate-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center space-y-3">
          <p className="font-bold text-sm">{error}</p>
          <button
            onClick={() => fetchLoads()}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : loads.length === 0 ? (
        /* Empty State */
        <div className="bg-white py-16 px-4 text-center rounded-2xl shadow-xs border border-slate-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <Package size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No Open Loads in {filterMode === 'city' ? currentCity?.name : 'India'}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              {filterMode === 'city'
                ? `Currently no pending booking requests originated from ${currentCity?.name}. Switch to All India or post a new shipment requirement.`
                : 'All current customer bookings have been matched. Check back in a few minutes or post a load directly.'}
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            {filterMode === 'city' && (
              <button
                onClick={() => setFilterMode('all')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
              >
                View All-India Loads
              </button>
            )}
            <button
              onClick={() => navigate('/agent/post')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              Post a Requirement
            </button>
          </div>
        </div>
      ) : (
        /* Loads Grid */
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-3 px-1">
            <span>Showing {loads.length} requirements available for sourcing</span>
            <span>25% Advance Protected</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loads.map(load => {
              const formattedBudget = load.customerBudget
                ? `₹${Number(load.customerBudget).toLocaleString('en-IN')}`
                : 'Market Rate';
              const formattedWeight = load.goodsWeightKg
                ? `${load.goodsWeightKg} kg`
                : (load.goodsType || 'General Cargo');
              const vehicleLabel = (load.vehicleType || 'COMMERCIAL').replace(/_/g, ' ');

              return (
                <div
                  key={load.id}
                  className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden hover:shadow-md hover:border-green-300 transition-all flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    {/* Header: Vehicle & Status Badge */}
                    <div className="flex justify-between items-start">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
                        <Truck size={14} className="text-green-600" />
                        <span>{vehicleLabel}</span>
                      </div>
                      
                      {load.isUrgent ? (
                        <span className="text-[11px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock size={11} /> URGENT
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {load.sourceBookingId ? 'DIRECT BOOKING' : 'OPEN LOAD'}
                        </span>
                      )}
                    </div>

                    {/* Route: Pickup & Drop */}
                    <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup</p>
                          <p className="font-bold text-slate-900 text-sm truncate" title={load.pickupCity}>
                            {load.pickupCity}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate" title={load.pickupAddress}>
                            {load.pickupAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200/50">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination</p>
                          <p className="font-bold text-slate-900 text-sm truncate" title={load.dropCity}>
                            {load.dropCity}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate" title={load.dropAddress}>
                            {load.dropAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Weight & Budget Specs */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Weight / Goods</p>
                        <p className="font-bold text-slate-800 text-xs sm:text-sm truncate mt-0.5" title={formattedWeight}>
                          {formattedWeight}
                        </p>
                      </div>
                      <div className="bg-green-50/60 border border-green-100 p-2.5 rounded-xl">
                        <p className="text-[10px] font-semibold text-green-700 uppercase">Target Fare</p>
                        <p className="font-black text-green-800 text-xs sm:text-sm mt-0.5 flex items-center">
                          {formattedBudget}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Quote Action */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => navigate(`/agent/post?loadId=${load.id}`)}
                      className="w-full bg-slate-900 hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all flex justify-center items-center gap-2 cursor-pointer shadow-xs active:scale-98"
                    >
                      <span>Submit Truck Quote</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
