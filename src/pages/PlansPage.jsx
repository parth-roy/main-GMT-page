import React, { useState } from "react"
import { Helmet } from "react-helmet-async"
import { ChevronDown, ChevronUp, Check } from "lucide-react"

export default function PlansPage() {
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    {
      question: "What is the GoMyTruck Partner Subscription Plan?",
      answer: "To maintain the GoMyTruck platform, we incur expenses for maps, cloud servers, and other technology infrastructure. While we constantly work to keep these running costs low, we request our driver partners to pay a nominal subscription fee to support the app's maintenance. This small fee is collected on a per-load basis, ensuring you only pay when you earn."
    },
    {
      question: "Why should I subscribe? What are the benefits?",
      answer: "Subscribing allows you to find continuous commercial loads on the GoMyTruck platform without paying hefty commissions to brokers. We are a minimum commission platform, charging only 0 - 5% so you maximize your take-home profit per trip."
    },
    {
      question: "How much does the subscription cost? When will the payment be due?",
      answer: "The subscription is a minimal per-load fee. Your accumulated platform dues are billed daily, and payment is generally due the following day under our 'Earn Today, Pay Tomorrow' model. There are no fixed monthly charges."
    },
    {
      question: "How do I sign up for the subscription?",
      answer: "You can sign up directly within the GoMyTruck Driver App by setting up an Autopay mandate using your preferred UPI application (PhonePe, Google Pay, Paytm, etc.)."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you have full control. You can pause or cancel your subscription mandate at any time directly through your UPI app or the GoMyTruck app settings."
    },
    {
      question: "Will I still get loads if I don't subscribe to Autopay?",
      answer: "Autopay ensures a seamless experience and uninterrupted access to the load board. Without it, your account may face temporary restrictions on viewing new loads until outstanding dues are cleared manually."
    },
    {
      question: "How will the subscription affect my truck's earnings?",
      answer: "It significantly increases your net profit because you are no longer paying standard 10-15% percentage-based commissions to market brokers. You only pay a flat, nominal technology fee per booking."
    },
    {
      question: "What happens if I face technical issues with the subscription?",
      answer: "You can reach out to our Partner Support hotline or connect directly with our support desk for immediate assistance with any technical or payment-related issues."
    }
  ]

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>GoMyTruck | Partner Plans</title>
        <meta name="description" content="GoMyTruck Subscription Plan for partners. 0 - 5% lowest commission platform with direct payments." />
      </Helmet>

      {/* Header Section */}
      <section className="bg-[#262833] relative min-h-[95vh] lg:min-h-[100vh] flex items-center border-t border-brand-500 overflow-hidden pt-32 pb-48 lg:pb-32 mt-16 lg:mt-0">
        
        {/* Full Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/plan-hero.webp" 
            alt="GoMyTruck Plan Hero" 
            className="w-full h-full object-cover object-right md:object-center opacity-90"
          />
        </div>

        <div className="w-full px-6 md:px-12 lg:px-20 xl:px-24 relative z-10">
          <div className="w-full lg:max-w-[55%] xl:max-w-[60%] pt-10">
            <h1 className="text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 tracking-tight drop-shadow-sm leading-[1.15]">
              GoMyTruck Partner Plans
            </h1>
            <p className="text-lg md:text-xl lg:text-xl xl:text-2xl text-gray-200 leading-relaxed mb-12 drop-shadow-sm font-medium opacity-95">
              We built GoMyTruck to revolutionize logistics by offering 0 - 5% commission loads 
              (the lowest commission logistics platform) and direct earnings for our partners. To sustain this promise and keep our 
              technology running smoothly, we are launching the GoMyTruck Partner Subscription. 
              By paying a small, predictable fee, you help us cover essential platform costs 
              while you keep maximum profit from your trips.
            </p>
            
            <ul className="space-y-6 md:space-y-6">
              <li className="flex items-center text-white">
                <Check className="text-[#00d084] mr-4 drop-shadow-sm" size={28} strokeWidth={3} />
                <span className="font-bold text-lg md:text-xl lg:text-xl xl:text-2xl drop-shadow-sm tracking-wide">0 - 5% Lowest Commission</span>
              </li>
              <li className="flex items-center text-white">
                <Check className="text-[#00d084] mr-4 drop-shadow-sm" size={28} strokeWidth={3} />
                <span className="font-bold text-lg md:text-xl lg:text-xl xl:text-2xl drop-shadow-sm tracking-wide">Earn Today, Pay Tomorrow</span>
              </li>
              <li className="flex items-center text-white">
                <Check className="text-[#00d084] mr-4 drop-shadow-sm" size={28} strokeWidth={3} />
                <span className="font-bold text-lg md:text-xl lg:text-xl xl:text-2xl drop-shadow-sm tracking-wide">Pay only if you take loads</span>
              </li>
            </ul>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-12 text-center tracking-tight">Frequently Asked Questions by Drivers</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <span className="font-semibold text-slate-900 text-lg pr-4">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="text-brand-500 flex-shrink-0" size={24} />
                ) : (
                  <ChevronDown className="text-slate-400 flex-shrink-0" size={24} />
                )}
              </button>
              
              <div 
                className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 py-5 border-t border-slate-100' : 'max-h-0'}`}
              >
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
