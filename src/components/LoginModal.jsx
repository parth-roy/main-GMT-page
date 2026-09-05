import React, { useState, useRef, useEffect } from "react"
import { X, User, Phone, Mail, Check, Loader2 } from "lucide-react"
import { sendOtp, verifyOtp } from "../api/authApi"

import { useAuth } from "../context/AuthContext"

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth()
  
  if (!isLoginModalOpen) return null

  const [step, setStep] = useState(1) // 1: Login, 2: OTP
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState(true)
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([])
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [devOtp, setDevOtp] = useState("")

  // Focus first input on OTP step
  useEffect(() => {
    if (step === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [step])

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!name.trim()) {
      return setError("Please enter your name.")
    }
    
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) {
      return setError("Please enter a valid 10-digit Indian mobile number.")
    }
    
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setError("Please enter a valid email address.")
    }

    setIsLoading(true)
    try {
      const res = await sendOtp(phone)
      
      // Temporary SMS bypass: Auto-fill OTP with 123456 if SMS gateway is not active
      const receivedDevOtp = (res.data && res.data._devOtp) ? res.data._devOtp : "123456"
      
      setDevOtp(receivedDevOtp)
      // Auto-fill OTP
      setOtp(receivedDevOtp.split("").slice(0, 6))
      
      setStep(2) // Move to OTP step
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-focus next
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  // Auto-verify when all 6 digits are filled
  useEffect(() => {
    if (step === 2 && otp.every(digit => digit !== "") && !isLoading) {
      handleVerify()
    }
  }, [otp, step])

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerify = async () => {
    setError("")
    setIsLoading(true)
    const otpCode = otp.join("")
    try {
      const data = await verifyOtp(phone, otpCode)
      const token = data?.accessToken || data?.tokens?.access?.token || data?.token
      if (token) {
        const userData = {
          ...(data?.user || {}),
          name: (data?.user?.name && data.user.name.trim()) || name?.trim() || "Customer",
          phone: data?.user?.phone || phone,
          email: data?.user?.email || email?.trim() || undefined,
          whatsappOptIn: whatsapp,
        }
        await login(token, userData)
      }
      closeLoginModal()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={closeLoginModal}></div>

      <div className="relative bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row min-h-[500px] md:h-[600px]">
        {/* LEFT COLUMN: Image */}
        <div className="w-full md:w-1/2 h-48 md:h-full bg-slate-100 relative">
          <img 
            src="/login_poster.webp" 
            alt="Delivery Partner" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT COLUMN: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative bg-white overflow-y-auto">
          <button onClick={closeLoginModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors z-20">
            <X size={20} />
          </button>

          {step === 1 ? (
            <div className="mt-4 md:mt-8 flex-grow">
              <h2 className="text-3xl font-extrabold text-[#112a46] flex items-center gap-2 mb-2">
                Welcome! <span className="text-2xl">👋</span>
              </h2>
              <p className="text-sm text-slate-500 mb-8">
                Sign in or make an account to complete your order with us.
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Name Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-700" />
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone size={18} className="text-slate-700" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(val);
                    }}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-700" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email (optional)"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer mt-6 group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${whatsapp ? 'bg-purple-600 border-purple-600' : 'border-2 border-slate-300 group-hover:border-purple-400 bg-white'}`}>
                    {whatsapp && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={whatsapp} 
                    onChange={e => setWhatsapp(e.target.checked)} 
                  />
                  <span className="text-sm text-slate-600">Receive updates via WhatsApp</span>
                </label>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm mb-4">
                    {error}
                  </div>
                )}

                {/* Bottom Fixed-ish Section */}
                <div className="mt-12 md:absolute md:bottom-12 md:left-12 md:right-12">
                  <p className="text-xs text-slate-500 text-center mb-4">
                    By proceeding, you agree to the <a href="/legal/terms-conditions" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline">terms of services</a> and <a href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline">privacy policy</a>
                  </p>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1e5eff] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-base flex justify-center items-center"
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Continue"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mt-4 md:mt-8 flex-grow flex flex-col">
              <h2 className="text-3xl font-bold text-[#112a46] mb-4">Verify your account</h2>
              <p className="text-sm text-slate-500 flex justify-between items-center mb-8">
                <span>OTP sent to <span className="font-bold text-slate-700">(+91) {phone}</span>.</span>
                <button onClick={() => setStep(1)} className="font-bold text-blue-600 hover:underline">Change</button>
              </p>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="flex gap-3 justify-between mb-8">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => inputRefs.current[idx] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 border border-slate-300 rounded-lg text-center text-xl font-bold focus:border-blue-600 focus:outline-none transition-colors"
                  />
                ))}
              </div>

              {devOtp && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-center text-sm font-semibold">
                  Test OTP (No SMS Gateway): <span className="font-bold text-lg tracking-widest text-blue-900">{devOtp}</span>
                </div>
              )}

              <p className="text-sm text-slate-500 text-center">
                Didn't receive the OTP? <button onClick={handleLoginSubmit} disabled={isLoading} className="font-bold text-blue-600 hover:underline disabled:opacity-50">Resend</button>
              </p>

              <div className="mt-auto md:absolute md:bottom-12 md:left-12 md:right-12">
                <button 
                  onClick={handleVerify}
                  disabled={otp.join("").length !== 6 || isLoading}
                  className={`w-full flex justify-center items-center py-3.5 rounded-xl font-bold transition-all ${otp.join("").length === 6 && !isLoading ? 'bg-[#1e5eff] hover:bg-blue-700 text-white shadow-lg active:scale-95' : 'bg-blue-600/50 text-white cursor-not-allowed'}`}
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Verify my account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
