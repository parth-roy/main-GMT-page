import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/apiClient';
import { MapPin, Navigation, Phone, KeySquare } from 'lucide-react';

export default function AgentTrackPage() {
  const [trackingLoads, setTrackingLoads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call for tracking loads
    // In reality this would fetch `/broker/tracking` filtering by BOOKING_LOCKED or LOADING_CONFIRMED
    setTimeout(() => {
      setTrackingLoads([
        {
          id: 'LD-84920',
          status: 'BOOKING_LOCKED',
          pickup: 'Mumbai',
          drop: 'Pune',
          driverPhone: '9876543210',
          vehicle: 'MH12AB1234',
          loadingOtp: '4829'
        },
        {
          id: 'LD-84921',
          status: 'LOADING_CONFIRMED',
          pickup: 'Delhi',
          drop: 'Jaipur',
          driverPhone: '9988776655',
          vehicle: 'DL01C4567',
          loadingOtp: null
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading tracking data...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)]">
      {/* Left List */}
      <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Active Tracking</h2>
        
        {trackingLoads.map(load => (
          <div key={load.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:border-green-400 cursor-pointer transition-colors relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${load.status === 'BOOKING_LOCKED' ? 'bg-orange-400' : 'bg-green-500'}`} />
            
            <div className="flex justify-between items-start mb-3 pl-2">
              <span className="text-xs font-bold text-slate-500">{load.id}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                load.status === 'BOOKING_LOCKED' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
              }`}>
                {load.status.replace('_', ' ')}
              </span>
            </div>

            <div className="pl-2 mb-4">
              <p className="font-bold text-slate-800">{load.pickup} → {load.drop}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Phone size={12} /> {load.driverPhone} • {load.vehicle}
              </p>
            </div>

            {load.status === 'BOOKING_LOCKED' && load.loadingOtp && (
              <div className="pl-2 mt-3 pt-3 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                    <KeySquare size={16} /> Loading OTP
                  </div>
                  <div className="text-xl font-black text-slate-800 tracking-widest">{load.loadingOtp}</div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 text-center">Share this OTP with driver for pickup</p>
              </div>
            )}
          </div>
        ))}
        
        {trackingLoads.length === 0 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500">
            No active loads to track.
          </div>
        )}
      </div>

      {/* Right Map Placeholder */}
      <div className="w-full md:w-2/3 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden h-[400px] md:h-auto">
        {/* Fake Map Background */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPg==')] mix-blend-multiply"></div>
        
        <div className="relative z-10 text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl max-w-sm mx-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation size={32} className="text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Live Tracking</h3>
          <p className="text-slate-500 mb-6 text-sm">Full GPS tracking via driver app integration is coming soon in a future update.</p>
          <div className="inline-block bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-full">
            In Development
          </div>
        </div>
      </div>
    </div>
  );
}
