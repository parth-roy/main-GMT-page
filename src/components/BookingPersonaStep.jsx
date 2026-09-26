import React, { useState } from 'react'
import { User, Building2, FileText, Clock, ChevronRight, Truck } from 'lucide-react'

const PERSONA_OPTIONS = [
  {
    id: 'INDIVIDUAL',
    icon: User,
    label: 'Individual',
    sublabel: 'Single trip, personal move',
    color: 'blue',
  },
  {
    id: 'ENTERPRISE',
    icon: Building2,
    label: 'Enterprise Owner',
    sublabel: 'Business, multiple trucks needed',
    color: 'purple',
  },
  {
    id: 'CONTRACTUAL',
    icon: FileText,
    label: 'Contractual Basis',
    sublabel: 'Daily / Monthly / Long-term',
    color: 'amber',
  },
]

const URGENCY_OPTIONS = [
  { id: 'UNDER_2_HOURS',  label: 'Within 2 Hours',  sublabel: 'Urgent now',        color: 'red' },
  { id: 'UNDER_4_HOURS',  label: 'Within 4 Hours',  sublabel: 'Today — high priority', color: 'orange' },
  { id: 'UNDER_24_HOURS', label: 'Within 24 Hours', sublabel: 'By tomorrow',       color: 'yellow' },
  { id: 'TWO_DAYS',       label: 'Within 2 Days',   sublabel: 'Flexible today/tomorrow', color: 'green' },
  { id: 'FLEXIBLE',       label: 'Flexible / TBD',  sublabel: 'No rush',           color: 'slate' },
]

const COLOR_MAP = {
  blue:   { selected: 'border-blue-600 bg-blue-50',   icon: 'text-blue-600 bg-blue-100',   badge: 'bg-blue-600' },
  purple: { selected: 'border-purple-600 bg-purple-50', icon: 'text-purple-600 bg-purple-100', badge: 'bg-purple-600' },
  amber:  { selected: 'border-amber-500 bg-amber-50', icon: 'text-amber-600 bg-amber-100', badge: 'bg-amber-500' },
  red:    { selected: 'border-red-600 bg-red-50',     badge: 'bg-red-600' },
  orange: { selected: 'border-orange-500 bg-orange-50', badge: 'bg-orange-500' },
  yellow: { selected: 'border-yellow-500 bg-yellow-50', badge: 'bg-yellow-500' },
  green:  { selected: 'border-green-600 bg-green-50', badge: 'bg-green-600' },
  slate:  { selected: 'border-slate-400 bg-slate-50', badge: 'bg-slate-500' },
}

/**
 * BookingPersonaStep
 * Props:
 *   onConfirm({ persona, urgency, truckCount, contractDuration }) => void
 *   onCancel() => void
 *   isLoading: bool
 */
export default function BookingPersonaStep({ onConfirm, onCancel, isLoading }) {
  const [persona, setPersona] = useState('INDIVIDUAL')
  const [urgency, setUrgency] = useState('FLEXIBLE')
  const [truckCount, setTruckCount] = useState(1)
  const [contractDuration, setContractDuration] = useState('')

  const isEnterprise = persona === 'ENTERPRISE'
  const isContractual = persona === 'CONTRACTUAL'
  const showTruckCount = isEnterprise || isContractual

  const handleConfirm = () => {
    onConfirm({ persona, urgency, truckCount, contractDuration })
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="p-6 sm:p-8 space-y-7">
        {/* Header */}
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">One Last Step</h3>
          <p className="text-sm text-slate-500 mt-1">Tell us your requirement type so we can find the right fleet for you.</p>
        </div>

        {/* Persona Selector */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">I am booking as</p>
          <div className="space-y-2.5">
            {PERSONA_OPTIONS.map(opt => {
              const isSelected = persona === opt.id
              const colors = COLOR_MAP[opt.color]
              const IconComponent = opt.icon
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPersona(opt.id)}
                  className={`w-full flex items-center gap-4 p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                    isSelected ? colors.selected : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? colors.icon : 'bg-slate-100 text-slate-500'
                  }`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${ isSelected ? 'text-slate-900' : 'text-slate-700' }`}>{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.sublabel}</p>
                  </div>
                  {isSelected && (
                    <div className={`w-5 h-5 rounded-full ${colors.badge} flex items-center justify-center shrink-0`}>
                      <ChevronRight size={12} className="text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Truck Count (for Enterprise / Contractual) */}
        {showTruckCount && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Truck size={14} />
              How many trucks do you need?
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTruckCount(c => Math.max(1, c - 1))}
                className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center font-bold text-xl text-slate-600 hover:border-slate-400 transition-colors cursor-pointer"
              >-</button>
              <span className="text-2xl font-black text-slate-900 w-12 text-center">{truckCount}</span>
              <button
                type="button"
                onClick={() => setTruckCount(c => Math.min(50, c + 1))}
                className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center font-bold text-xl text-slate-600 hover:border-slate-400 transition-colors cursor-pointer"
              >+</button>
            </div>
          </div>
        )}

        {/* Contract Duration (for Contractual) */}
        {isContractual && (
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Contract Duration</label>
            <select
              value={contractDuration}
              onChange={e => setContractDuration(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">Select duration</option>
              <option value="Daily">Daily Basis</option>
              <option value="Weekly">Weekly Basis</option>
              <option value="Monthly">Monthly Basis</option>
              <option value="3 Months">3 Month Contract</option>
              <option value="6 Months">6 Month Contract</option>
              <option value="Annual">Annual Contract</option>
            </select>
          </div>
        )}

        {/* Urgency Selector */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock size={14} />
            When do you need this fulfilled?
          </p>
          <div className="grid grid-cols-1 gap-2">
            {URGENCY_OPTIONS.map(opt => {
              const isSelected = urgency === opt.id
              const colors = COLOR_MAP[opt.color]
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setUrgency(opt.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected ? colors.selected : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="text-left">
                    <p className={`text-sm font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.sublabel}</p>
                  </div>
                  {isSelected && (
                    <div className={`w-4 h-4 rounded-full ${colors.badge} shrink-0`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 sm:p-6 mt-auto space-y-2.5">
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full bg-[#1e5eff] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-600/20 disabled:opacity-70 cursor-pointer text-sm"
        >
          {isLoading ? <span className="animate-spin">⏳</span> : null}
          {isLoading ? 'Placing your booking…' : 'Confirm & Place Booking'}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-sm cursor-pointer transition-all"
        >
          ← Go Back
        </button>
      </div>
    </div>
  )
}
