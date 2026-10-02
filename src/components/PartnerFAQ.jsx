import React, { useState } from "react"
import { Plus, Minus, MessageCircleQuestion } from "lucide-react"

export default function PartnerFAQ({ isFleetOwner = false }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      q: "Is there any registration fee?",
      a: "Driver registration on GoMyTruck is 100% free with zero security deposits. A nominal one-time ₹99 verification fee applies to activate your 90-Day Verified Premium Driver Membership, unlocking priority location loads and zero broker deductions."
    },
    {
      q: "What documents do I need to register?",
      a: "You will need your Aadhaar Card, PAN Card, Driving License (DL), Vehicle RC, and a bank account detail (Passbook/Cancelled Cheque) for payouts."
    },
    {
      q: "When will I get paid for my trips?",
      a: "The app records approved earnings against completed work. Digital withdrawals and participant-to-participant transfers are currently paused, so do not rely on an advertised daily or weekly bank settlement. The applicable settlement method must be confirmed with the operations team."
    },
    {
      q: "Can I choose my own working hours?",
      a: "You can choose whether to accept an eligible load shown for your vehicle and area. Load quantity, timing, and route availability are not guaranteed."
    },
    {
      q: "Do I have to wear a uniform?",
      a: "While we provide branded GoMyTruck t-shirts for professionalism, it is currently optional. However, wearing the brand helps build trust with enterprise clients."
    }
  ]

  if (isFleetOwner) {
    faqs.push({
      q: "Can I attach multiple trucks under one account?",
      a: "The fleet workflow supports multiple vehicles and drivers under an owner account. Each vehicle and driver remains subject to document review and the platform's current limits."
    })
  }

  return (
    <section className="py-24 bg-transparent relative overflow-hidden border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/50 border border-brand-200 text-brand-700 text-xs font-bold tracking-widest uppercase mb-4">
            <MessageCircleQuestion size={14} />
            Support &amp; FAQs
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight mb-4">
            Frequently Asked <span className="text-brand-600">Questions</span>
          </h2>
          <p className="text-slate-600 font-light text-lg max-w-2xl mx-auto">
            Everything you need to know about partnering with us.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-0">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            
            return (
              <div 
                key={index}
                className={`bg-transparent border-b border-slate-200/60 transition-all duration-300 overflow-hidden ${
                  isOpen ? "" : "hover:border-brand-300"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className={`font-semibold text-base sm:text-lg pr-8 transition-colors ${
                    isOpen ? "text-brand-700" : "text-slate-800 group-hover:text-brand-600"
                  }`}>
                    {faq.q}
                  </span>
                  <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    isOpen ? "bg-brand-600 text-white rotate-180" : "bg-slate-100 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600"
                  }`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-5 sm:p-6 pt-0 text-slate-600 font-light leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
