import React, { useState } from 'react';
import { IndianRupee, Wallet as WalletIcon, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';

export default function AgentWalletPage() {
  const [activeTab, setActiveTab] = useState('pending');

  const pendingBounties = [
    { id: 'LD-9921', city: 'Kolkata → Patna', amount: 1200, date: '2023-11-20', status: 'Pending Delivery' },
    { id: 'LD-9934', city: 'Asansol → Durgapur', amount: 800, date: '2023-11-22', status: 'Pending Verification' },
  ];

  const settledBounties = [
    { id: 'LD-8812', city: 'Howrah → Haldia', amount: 1500, date: '2023-11-15', status: 'Settled' },
    { id: 'LD-8805', city: 'Siliguri → Malda', amount: 950, date: '2023-11-10', status: 'Settled' },
    { id: 'LD-8799', city: 'Kolkata → Ranchi', amount: 2100, date: '2023-11-05', status: 'Settled' },
  ];

  const displayList = activeTab === 'pending' ? pendingBounties : settledBounties;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agent Wallet</h1>
          <p className="text-slate-500 text-sm">Manage your bounties and settlements.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <WalletIcon size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-green-100 font-medium mb-1">Total Earned (Settled)</p>
            <h2 className="text-4xl font-black flex items-center mb-4">
              <IndianRupee size={32} strokeWidth={3} /> 4,550
            </h2>
            <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm">
              Withdraw to Bank
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-500 font-medium mb-1">Pending Bounties</p>
            <h2 className="text-4xl font-black text-slate-800 flex items-center mb-4">
              <IndianRupee size={32} strokeWidth={3} /> 2,000
            </h2>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Clock size={16} /> Awaiting delivery completion
            </p>
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${activeTab === 'pending' ? 'text-green-600 border-b-2 border-green-500 bg-green-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Pending ({pendingBounties.length})
          </button>
          <button 
            onClick={() => setActiveTab('settled')}
            className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${activeTab === 'settled' ? 'text-slate-800 border-b-2 border-slate-800 bg-slate-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Settled ({settledBounties.length})
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {displayList.map(item => (
            <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`mt-1 p-2 rounded-full ${activeTab === 'settled' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  {activeTab === 'settled' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{item.city}</h4>
                  <p className="text-xs text-slate-500 mt-1">Load ID: {item.id} • {item.date}</p>
                  <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'settled' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-lg flex items-center justify-end ${activeTab === 'settled' ? 'text-green-600' : 'text-slate-700'}`}>
                  + <IndianRupee size={16} strokeWidth={3} /> {item.amount}
                </p>
              </div>
            </div>
          ))}
          
          {displayList.length === 0 && (
            <div className="p-10 text-center text-slate-500">
              No records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
