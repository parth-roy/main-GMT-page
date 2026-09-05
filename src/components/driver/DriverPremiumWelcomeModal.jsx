import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Zap, ShieldCheck, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DriverPremiumWelcomeModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsOpen(false);
      return;
    }

    const membership = user?.driverMembership;
    const isPremium = user?.isPremiumDriver || membership?.isPremium;
    const daysRemaining = Number(membership?.daysRemaining || 0);

    // Only show if the user is a driver with active premium membership under 90 days
    if (isPremium && daysRemaining > 0) {
      const storageKey = 'gmt_driver_welcome_' + (user.phone || user.id);
      const dismissed = sessionStorage.getItem(storageKey);
      if (!dismissed) {
        setIsOpen(true);
      }
    } else {
      // If 90 days expired or not premium, do not show
      setIsOpen(false);
    }
  }, [user]);

  const handleClose = () => {
    if (user?.phone || user?.id) {
      sessionStorage.setItem('gmt_driver_welcome_' + (user.phone || user.id), 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen || !user?.driverMembership) return null;

  const { daysRemaining, endDate, plan } = user.driverMembership;
  const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : '90 Days';

  return (
    <div className="fixed inset-0 z-[360] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden text-left animate-in zoom-in-95 duration-200">
        
        {/* Background Glowing Blobs */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-amber-400/25 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-44 h-44 rounded-full bg-orange-400/20 blur-2xl pointer-events-none" />

        {/* Header Ribbon */}
        <div className="p-6 pb-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white relative">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 border border-amber-300/30 text-[11px] font-black uppercase tracking-wider mb-2">
            <Crown size={14} className="text-yellow-300 animate-bounce" />
            <span>Verified Driver Partner</span>
          </div>

          <h3 className="text-2xl font-black text-white leading-tight">
            Welcome, {user.name || 'Captain'}! 👋
          </h3>
          <p className="text-xs text-amber-100 font-medium mt-0.5">
            Your 90-Day Premium Membership is active & verified.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Days Remaining Highlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Membership Status</span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">
                {plan || 'PREMIUM'} Driver Access
              </span>
              <span className="text-xs text-slate-500 block">Valid until {formattedEndDate}</span>
            </div>
            <div className="shrink-0 bg-amber-500 text-white px-3.5 py-2 rounded-xl text-center shadow-md shadow-amber-200">
              <span className="text-2xl font-black block leading-none">{daysRemaining}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider block mt-1">Days Left</span>
            </div>
          </div>

          {/* Active Privileges List */}
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <Zap size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Priority Load Allocation:</strong> Commercial loads in your registered hub/location are dispatched to you first.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>100% Earnings Retention:</strong> Zero broker deductions on all direct client bookings for the duration of your membership.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Cross-Platform Profile:</strong> Active across GoMyTruck Web and the official GoMyTruck Driver Mobile App.</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md shadow-amber-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Continue to Platform</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
