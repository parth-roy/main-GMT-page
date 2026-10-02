import React, { useState } from "react"
import { createPortal } from "react-dom"
import { AlertTriangle, X } from "lucide-react"
import { lockScroll, unlockScroll } from "../utils/scrollLock"

const GOODS_TYPES = [
  "General Goods", "Electronics / Consumer Durables", "Building Materials",
  "Machines / Equipment / Spare Parts", "Textiles / Garments",
  "Furniture / Home Furnishings", "House Shifting", "Paper / Plywood / Timber",
]

const initialForm = {
  goodsType: "General Goods", goodsDescription: "", goodsWeightKg: "", goodsQuantity: "1",
  containsRestrictedGoods: false, declarationConfirmed: false,
  laborRequired: false, laborersCount: "1", laborType: "BOTH", handlingInstructions: "",
}

export default function GoodsTypeModal({ isOpen, onClose, onSelect, onSave, initialData }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState("")

  React.useEffect(() => {
    if (initialData) {
      setForm((current) => ({ ...current, ...initialData }))
    }
  }, [initialData, isOpen])

  React.useEffect(() => {
    if (isOpen) {
      lockScroll()
    } else {
      unlockScroll()
    }
    return () => {
      if (isOpen) {
        unlockScroll()
      }
    }
  }, [isOpen])

  if (!isOpen || typeof document === "undefined") return null

  const update = (event) => {
    const { name, type, checked, value } = event.target
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }))
    setError("")
  }

  const submit = (event) => {
    event.preventDefault()
    if (form.goodsDescription.trim().length < 2) return setError("Describe the goods being transported.")
    if (!(Number(form.goodsWeightKg) > 0)) return setError("Enter the total approximate weight in kilograms.")
    if (!(Number(form.goodsQuantity) >= 1)) return setError("Enter a valid quantity.")
    if (!form.declarationConfirmed) return setError("Confirm that the goods declaration is accurate.")
    
    const payload = {
      goodsType: form.goodsType,
      goodsDescription: form.goodsDescription.trim(),
      goodsWeightKg: Number(form.goodsWeightKg),
      goodsQuantity: Number(form.goodsQuantity),
      containsRestrictedGoods: form.containsRestrictedGoods,
      handlingInstructions: form.handlingInstructions.trim() || undefined,
      laborRequired: form.laborRequired,
      ...(form.laborRequired ? { laborersCount: Number(form.laborersCount), laborType: form.laborType } : {}),
    }

    const callback = onSave || onSelect
    if (callback) {
      callback(payload)
    }
  }

  return createPortal(
    <div data-modal-portal="true" data-modal-open="true" className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="goods-dialog-title">
      <button type="button" className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs cursor-pointer" onClick={onClose} aria-label="Close goods details" />
      <form onSubmit={submit} className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-xl shadow-2xl z-10 max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-3 pb-4 border-b border-slate-200 shrink-0">
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2 sm:hidden" />
          <div className="flex items-center justify-between">
            <div>
              <h2 id="goods-dialog-title" className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Declare your goods</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Accurate load details prevent vehicle mismatches.</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer active:scale-95 transition-all" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 overscroll-contain">
          {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 p-3 text-xs sm:text-sm font-semibold">{error}</div>}
          
          <label className="block text-sm font-bold text-slate-700">Goods category
            <select name="goodsType" value={form.goodsType} onChange={update} className="mt-1.5 w-full min-h-11 rounded-xl border border-slate-300 px-3 bg-white text-sm">
              {GOODS_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>

          <label className="block text-sm font-bold text-slate-700">Description
            <textarea name="goodsDescription" value={form.goodsDescription} onChange={update} required maxLength={500} rows={3} placeholder="For example: 12 sealed cartons of garments" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal" />
          </label>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <label className="text-sm font-bold text-slate-700">Total weight (kg)
              <input name="goodsWeightKg" type="number" min="0.1" step="0.1" value={form.goodsWeightKg} onChange={update} required inputMode="decimal" className="mt-1.5 w-full min-h-11 rounded-xl border border-slate-300 px-3 text-sm font-normal" />
            </label>
            <label className="text-sm font-bold text-slate-700">Quantity
              <input name="goodsQuantity" type="number" min="1" step="1" value={form.goodsQuantity} onChange={update} required inputMode="numeric" className="mt-1.5 w-full min-h-11 rounded-xl border border-slate-300 px-3 text-sm font-normal" />
            </label>
          </div>

          <label className="block text-sm font-bold text-slate-700">Handling instructions (optional)
            <textarea name="handlingInstructions" value={form.handlingInstructions} onChange={update} maxLength={1000} rows={2} placeholder="Fragile items, stairs, access restrictions…" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal" />
          </label>

          <div className="rounded-xl border border-slate-200 p-3.5 sm:p-4 space-y-3 bg-slate-50/50">
            <label className="flex items-start gap-3 cursor-pointer">
              <input name="laborRequired" type="checkbox" checked={form.laborRequired} onChange={update} className="mt-0.5 h-5 w-5 rounded text-blue-600" />
              <span>
                <strong className="text-sm text-slate-900 block leading-snug">Request loading/unloading workforce</strong>
                <span className="block text-xs text-slate-500 mt-0.5">Assigned separately and subject to worker availability.</span>
              </span>
            </label>
            {form.laborRequired && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                <label className="text-xs sm:text-sm font-bold text-slate-700">Workers
                  <select name="laborersCount" value={form.laborersCount} onChange={update} className="mt-1 w-full min-h-10 border border-slate-300 rounded-lg px-2 text-sm bg-white">
                    {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </label>
                <label className="text-xs sm:text-sm font-bold text-slate-700">Task
                  <select name="laborType" value={form.laborType} onChange={update} className="mt-1 w-full min-h-10 border border-slate-300 rounded-lg px-2 text-sm bg-white">
                    <option value="LOADING">Loading</option>
                    <option value="UNLOADING">Unloading</option>
                    <option value="BOTH">Both</option>
                  </select>
                </label>
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 sm:p-4 cursor-pointer">
            <input name="containsRestrictedGoods" type="checkbox" checked={form.containsRestrictedGoods} onChange={update} className="mt-0.5 h-5 w-5 rounded text-amber-600" />
            <span className="text-xs sm:text-sm">
              <strong className="flex items-center gap-1.5 text-amber-900 leading-snug">
                <AlertTriangle size={16} className="shrink-0 text-amber-600" /> This load may contain restricted or regulated goods
              </strong>
              <span className="block mt-1 text-amber-800 text-xs">Declare this now. The booking may require review or may not be accepted.</span>
            </span>
          </label>

          <label className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 cursor-pointer">
            <input name="declarationConfirmed" type="checkbox" checked={form.declarationConfirmed} onChange={update} className="mt-0.5 h-5 w-5 rounded text-blue-600" required />
            <span>I confirm the category, description, weight and quantity are accurate and I have read the prohibited-goods rules in the <a href="/legal/terms" className="font-bold text-brand-700 underline">Terms</a>.</span>
          </label>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 sm:p-5 shrink-0 z-10 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button type="submit" className="w-full min-h-12 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold cursor-pointer transition-all shadow-md">
            Save goods details
          </button>
        </div>
      </form>
    </div>,
    document.body
  )
}
