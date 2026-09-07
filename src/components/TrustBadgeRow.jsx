import React from 'react';
import { ShieldCheck, PackageCheck, Clock } from 'lucide-react';

export default function TrustBadgeRow({ city }) {
  const badges = [
    { icon: ShieldCheck, title: "Protection Options", subtitle: "Eligibility shown before confirmation" },
    { icon: PackageCheck, title: "Partner Documents", subtitle: "Onboarding records are reviewed" },
    { icon: Clock, title: "Availability Updates", subtitle: "Assignment timing shown separately" },
    { icon: () => <img src="/google-maps-icon.webp" alt="Route" width={24} height={24} className="w-6 h-6 object-contain" />, title: `Check ${city || 'Your Route'}`, subtitle: "Tracking on supported active trips" }
  ];

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-brand-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-brand-50 p-3 rounded-full mb-3 text-brand-600">
            <badge.icon size={24} />
          </div>
          <h4 className="font-bold text-slate-800 text-sm mb-1">{badge.title}</h4>
          <p className="text-xs text-slate-500 leading-tight">{badge.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
