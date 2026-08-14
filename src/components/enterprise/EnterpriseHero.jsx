import React, { useState } from "react"
import { User, Briefcase, Phone, Mail, CheckCircle2 } from "lucide-react"
import { trackLead, trackWhatsAppClick } from "../../utils/analytics"
import { useAuth } from "../../context/AuthContext"

export default function EnterpriseHero() {
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "" })
  const [submitted, setSubmitted] = useState(false)
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const { requireAuth } = useAuth()
  
  const submit = (event) => {
    event.preventDefault()
    requireAuth(async (token) => {
      try {
        const headers = { "Content-Type": "application/json" }
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }
        
        // Save as a lead in backend with role 'Enterprise'
        await fetch("https://api-test.gomytruck.com/api/v1/leads/workforce", {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone,
            city: "Enterprise (Not specified)", 
            role: `Enterprise - ${form.company}`,
          }),
        }).catch(err => console.warn("Failed to save enterprise lead", err))
      } finally {
        const text = `Enterprise logistics enquiry from ${form.name}, ${form.company}. Phone: ${form.phone}. Email: ${form.email || "not supplied"}.`
        window.open(`https://wa.me/919331488999?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer")
        trackLead("enterprise_form_whatsapp", "enterprise_logistics")
        trackWhatsAppClick("enterprise_form")
        setSubmitted(true)
      }
    })
  }

  const fields = [
    { name: "name", type: "text", label: "Your name", autoComplete: "name", Icon: User, required: true },
    { name: "company", type: "text", label: "Company name", autoComplete: "organization", Icon: Briefcase, required: true },
    { name: "phone", type: "tel", label: "10-digit phone number", autoComplete: "tel-national", Icon: Phone, required: true, pattern: "[0-9]{10}", inputMode: "numeric" },
    { name: "email", type: "email", label: "Work email (optional)", autoComplete: "email", Icon: Mail },
  ]

  return (
    <section className="relative w-full bg-slate-950 overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="absolute inset-0">
        <img src="/enterprise-hero.webp" alt="GoMyTruck enterprise logistics operations" className="w-full h-full object-cover" fetchpriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent w-full lg:w-2/3" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-bold text-brand-200 uppercase tracking-widest">GoMyTruck Enterprise</p>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">Enterprise logistics planned around your lanes and volumes</h1>
          <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-slate-100">
            {["Route and vehicle planning", "Digital trip visibility", "GST invoice records", "API requirements assessment"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="text-brand-300 shrink-0" size={20} />{item}</li>)}
          </ul>
        </div>

        <div className="w-full max-w-md mx-auto lg:ml-auto lg:mr-0 bg-slate-900/90 rounded-2xl shadow-2xl p-7 border border-white/15">
          {submitted ? (
            <div className="text-center py-10 text-white">
              <CheckCircle2 size={48} className="mx-auto text-green-400" />
              <h2 className="text-2xl font-black mt-4">WhatsApp opened</h2>
              <p className="text-slate-300 mt-2">Review the pre-filled enquiry and tap Send to share it with our enterprise team.</p>
              <button type="button" onClick={() => setSubmitted(false)} className="mt-5 underline font-bold text-brand-200">Start another enquiry</button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={submit}>
              <h2 className="text-2xl font-bold text-white mb-5">Discuss your logistics requirement</h2>
              {fields.map(({ Icon, label, ...field }) => (
                <label key={field.name} className="block">
                  <span className="sr-only">{label}</span>
                  <span className="relative block">
                    <Icon aria-hidden="true" className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <input {...field} placeholder={label} value={form[field.name]} onChange={update} className="w-full min-h-12 pl-10 pr-4 rounded-xl border border-white/15 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400" />
                  </span>
                </label>
              ))}
              <button type="submit" className="w-full min-h-12 bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg rounded-xl">Continue on WhatsApp</button>
              <p className="text-xs text-slate-400 leading-5">By continuing, you agree to our <a href="/legal/privacy-policy" className="underline text-slate-200">Privacy Policy</a>. We use these details only to respond to this enquiry.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
