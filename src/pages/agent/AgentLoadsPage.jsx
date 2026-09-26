import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { useCity } from '../../context/CityContext';
import { 
  Package, MapPin, IndianRupee, Clock, ArrowRight, Truck, RefreshCw, 
  PlusCircle, CheckCircle2, ShieldCheck, ShieldAlert, Search, 
  SlidersHorizontal, X, Globe, AlertTriangle
} from 'lucide-react';
import AgentKycModal from '../../components/middleman/AgentKycModal';

const VEHICLE_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Vehicles' },
  { value: 'TATA_ACE', label: 'Tata Ace (750 kg)' },
  { value: 'BOLERO_PICKUP', label: 'Bolero Pickup (1.5 Ton)' },
  { value: 'TRUCK_14FT', label: '14ft Eicher (4 Ton)' },
  { value: 'TRUCK_17FT', label: '17ft Truck (6 Ton)' },
  { value: 'TRUCK_19FT', label: '19ft ICV (9 Ton)' },
  { value: 'TRUCK_22FT', label: '22ft Multi-Axle (15 Ton)' },
  { value: 'CONTAINER_32FT', label: '32ft Container (18 Ton)' },
];

const BUDGET_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Budgets' },
  { value: 'UNDER_5K', label: 'Under ₹5,000' },
  { value: '5K_15K', label: '₹5,000 – ₹15,000' },
  { value: '15K_35K', label: '₹15,000 – ₹35,000' },
  { value: 'ABOVE_35K', label: '₹35,000+' },
];

export default function AgentLoadsPage() {
  const [loads, setLoads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filtration State
  const [filterMode, setFilterMode] = useState('city'); // 'city' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('ALL');
  const [budgetRange, setBudgetRange] = useState('ALL');
  const [isUrgentOnly, setIsUrgentOnly] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt' | 'customerBudget'
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Agent Profile for KYC Gate
  const [profile, setProfile] = useState(null);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  const { currentCity } = useCity();
  const navigate = useNavigate();

  // Fetch Agent Profile
  const fetchProfile = async () => {
    try {
      const res = await apiClient('/broker/profile');
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleUpdated = (e) => {
      if (e.detail) setProfile(e.detail);
      else fetchProfile();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('agent_profile_updated', handleUpdated);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('agent_profile_updated', handleUpdated);
      }
    };
  }, []);

  // Fetch Loads with Robust Filters
  const fetchLoads = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filterMode === 'city' && currentCity?.name) {
        params.append('city', currentCity.name);
      } else {
        params.append('city', 'all');
      }

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (selectedVehicle && selectedVehicle !== 'ALL') {
        params.append('vehicleType', selectedVehicle);
      }
      if (budgetRange === 'UNDER_5K') {
        params.append('maxBudget', '5000');
      } else if (budgetRange === '5K_15K') {
        params.append('minBudget', '5000');
        params.append('maxBudget', '15000');
      } else if (budgetRange === '15K_35K') {
        params.append('minBudget', '15000');
        params.append('maxBudget', '35000');
      } else if (budgetRange === 'ABOVE_35K') {
        params.append('minBudget', '35000');
      }
      if (isUrgentOnly) {
        params.append('isUrgent', 'true');
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await apiClient(`/broker/loads${queryString}`);
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
  }, [filterMode, currentCity?.name, searchQuery, selectedVehicle, budgetRange, isUrgentOnly, sortBy, sortOrder]);

  // Debounced load fetch on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLoads();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchLoads]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedVehicle !== 'ALL') count++;
    if (budgetRange !== 'ALL') count++;
    if (isUrgentOnly) count++;
    if (sortBy !== 'createdAt') count++;
    return count;
  }, [searchQuery, selectedVehicle, budgetRange, isUrgentOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedVehicle('ALL');
    setBudgetRange('ALL');
    setIsUrgentOnly(false);
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const handleQuoteClick = (loadId) => {
    if (!profile?.isKycVerified) {
      setIsKycModalOpen(true);
      return;
    }
    navigate(`/agent/post?loadId=${loadId}`);
  };

  const isKycVerified = Boolean(profile?.isKycVerified);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Open Freight Loads</h1>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Marketplace
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Verified transport requirements from shippers and enterprises across India.
          </p>
        </div>

        {/* Action Controls & Pan-India Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Main Location vs Pan-India Toggle */}
          <div className="flex bg-slate-200/90 p-1 rounded-2xl text-xs font-bold text-slate-700 shadow-inner">
            <button
              type="button"
              onClick={() => setFilterMode('city')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                filterMode === 'city' 
                  ? 'bg-white text-emerald-800 shadow-xs font-black' 
                  : 'hover:text-slate-900'
              }`}
              title={`Showing loads for ${currentCity?.name || 'Local City'}`}
            >
              <MapPin size={14} className={filterMode === 'city' ? "text-emerald-600" : "text-slate-500"} />
              <span>{currentCity?.name || 'Local'} Loads</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                filterMode === 'all' 
                  ? 'bg-white text-emerald-800 shadow-xs font-black' 
                  : 'hover:text-slate-900'
              }`}
              title="View freight loads from all cities across India"
            >
              <Globe size={14} className={filterMode === 'all' ? "text-emerald-600" : "text-slate-500"} />
              <span>All India (Pan-India)</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchLoads(true)}
            disabled={isRefreshing}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors cursor-pointer shadow-xs"
            title="Refresh open loads"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-emerald-600' : ''} />
          </button>

          {/* Post Requirement Button */}
          <button
            type="button"
            onClick={() => {
              if (!isKycVerified) {
                setIsKycModalOpen(true);
              } else {
                navigate('/agent/post');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <PlusCircle size={15} />
            <span>Post Requirement</span>
          </button>
        </div>
      </div>

      {/* Robust Filtration Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by city, address, cargo type, or load ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowFiltersMobile(p => !p)}
            className="md:hidden flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 rounded-xl text-xs font-bold text-slate-700"
          >
            <SlidersHorizontal size={15} />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          {/* Desktop Filter Dropdowns */}
          <div className="hidden md:flex items-center gap-3">
            {/* Vehicle Type Dropdown */}
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-emerald-600 focus:outline-none cursor-pointer"
            >
              {VEHICLE_FILTER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Target Budget Dropdown */}
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-emerald-600 focus:outline-none cursor-pointer"
            >
              {BUDGET_FILTER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('_');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-emerald-600 focus:outline-none cursor-pointer"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="customerBudget_desc">Budget: High to Low</option>
              <option value="customerBudget_asc">Budget: Low to High</option>
            </select>

            {/* Urgent Toggle Chip */}
            <button
              type="button"
              onClick={() => setIsUrgentOnly(p => !p)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isUrgentOnly 
                  ? 'bg-rose-50 text-rose-700 border-rose-200 font-black' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Clock size={13} className={isUrgentOnly ? 'text-rose-600' : 'text-slate-400'} />
              <span>Urgent Only</span>
            </button>
          </div>
        </div>

        {/* Mobile Expanded Filters */}
        {showFiltersMobile && (
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Vehicle Category</label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                {VEHICLE_FILTER_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Budget Range</label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                {BUDGET_FILTER_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Sort Loads By</label>
              <select
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [sb, so] = e.target.value.split('_');
                  setSortBy(sb);
                  setSortOrder(so);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="createdAt_desc">Newest First</option>
                <option value="customerBudget_desc">Budget: High to Low</option>
                <option value="customerBudget_asc">Budget: Low to High</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setIsUrgentOnly(p => !p)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  isUrgentOnly 
                    ? 'bg-rose-50 text-rose-700 border-rose-200 font-black' 
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Clock size={13} />
                <span>Urgent Loads Only</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Summary & Quick Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              {filterMode === 'city' ? (
                <>Originating / Terminating in <strong className="text-slate-900 font-black">{currentCity?.name || 'Local'}</strong></>
              ) : (
                <>All-India Network: <strong className="text-slate-900 font-black">All Cities</strong></>
              )}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-emerald-700">{loads.length} loads available</span>
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <X size={13} /> Clear all filters ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* KYC Warning Banner if Unverified */}
      {!isKycVerified && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <span>
              <strong>KYC Verification Required:</strong> Complete your agent profile & upload documents to submit quotes and lock truck bookings.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsKycModalOpen(true)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Complete KYC Now
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200 animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-14 bg-slate-100 rounded-2xl"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="h-10 bg-slate-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-8 rounded-3xl border border-red-200 text-center space-y-3 max-w-lg mx-auto">
          <p className="font-bold text-sm">{error}</p>
          <button
            type="button"
            onClick={() => fetchLoads()}
            className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
          >
            Try Again
          </button>
        </div>
      ) : loads.length === 0 ? (
        /* Empty State */
        <div className="bg-white py-16 px-6 text-center rounded-3xl shadow-xs border border-slate-200 max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100">
            <Package size={32} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              No Open Loads Found
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              {filterMode === 'city'
                ? `Currently no pending booking requests match your filters in ${currentCity?.name || 'this city'}. Try switching to All-India or adjust your search.`
                : 'No open bookings match your selected vehicle and budget filters across India.'}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {filterMode === 'city' && (
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Globe size={14} />
                <span>Switch to All-India Loads</span>
              </button>
            )}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (!isKycVerified) setIsKycModalOpen(true);
                else navigate('/agent/post');
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle size={14} />
              <span>Post New Requirement</span>
            </button>
          </div>
        </div>
      ) : (
        /* Loads Grid */
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-3 px-1">
            <span>Showing {loads.length} requirements available for sourcing</span>
            <span className="hidden sm:inline-block">25% Advance Protected • Fraud-Free OTP Loading</span>
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
                  className="bg-white rounded-3xl shadow-xs border border-slate-200/90 overflow-hidden hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    {/* Header: Vehicle & Status Badge */}
                    <div className="flex justify-between items-start">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
                        <Truck size={14} className="text-emerald-600" />
                        <span>{vehicleLabel}</span>
                      </div>
                      
                      {load.isUrgent ? (
                        <span className="text-[11px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Clock size={11} className="text-rose-600 animate-pulse" /> URGENT LOAD
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {load.sourceBookingId ? 'DIRECT BOOKING' : 'OPEN LOAD'}
                        </span>
                      )}
                    </div>

                    {/* Route: Pickup & Drop */}
                    <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0 shadow-xs" />
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
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1 shrink-0 shadow-xs" />
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
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Weight / Goods</p>
                        <p className="font-bold text-slate-800 text-xs sm:text-sm truncate mt-0.5" title={formattedWeight}>
                          {formattedWeight}
                        </p>
                      </div>
                      <div className="bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl">
                        <p className="text-[10px] font-semibold text-emerald-800 uppercase">Target Fare</p>
                        <p className="font-black text-emerald-900 text-xs sm:text-sm mt-0.5 flex items-center">
                          {formattedBudget}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Quote Action */}
                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => handleQuoteClick(load.id)}
                      className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all flex justify-center items-center gap-2 cursor-pointer shadow-xs active:scale-98"
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

      {/* KYC Modal Prompt */}
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
