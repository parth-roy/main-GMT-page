import React, { useState, useRef, useEffect } from "react"
import { X, User, Phone, Mail, Check, Loader2, LogOut, Briefcase } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { sendOtp, verifyOtp } from "../api/authApi"

import { useAuth } from "../context/AuthContext"

const ROLES = [
  { id: 'CUSTOMER', label: '🚚 Customer / Shipper' },
  { id: 'MIDDLEMAN', label: '🤝 GMT Agent' },
  { id: 'DRIVER', label: '🚛 Driver / Fleet Owner' },
  { id: 'BUSINESS', label: '🏢 B2B Business' },
];

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login, user, logout, loginRole } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1: Login, 2: OTP
  const [registrationFor, setRegistrationFor] = useState('CUSTOMER')
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState(true)
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([])
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [devOtp, setDevOtp] = useState("")
  const [showRoleInfo, setShowRoleInfo] = useState(false)

  // Sync role when modal opens with a requested role (e.g. 'MIDDLEMAN')
  useEffect(() => {
    if (isLoginModalOpen) {
      if (loginRole) {
        setRegistrationFor(loginRole)
      }
      setStep(1)
      setError("")
      setOtp(["", "", "", "", "", ""])
    }
  }, [isLoginModalOpen, loginRole])

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
      return setError(registrationFor === 'MIDDLEMAN' ? "Please enter your agency or contact name." : "Please enter your name.")
    }
    
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) {
      return setError("Please enter a valid 10-digit Indian mobile number.")
    }
    
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setError("Please enter a valid email address.")
    }

    setIsLoading(true)
    try {
      const res = await sendOtp(phone, registrationFor)
      
      // Auto-fill OTP with received random dev OTP
      const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString()
      const receivedDevOtp = (res?.data && (res.data._devOtp || res.data.otp)) 
        ? String(res.data._devOtp || res.data.otp) 
        : fallbackOtp
      
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
      const data = await verifyOtp(phone, otpCode, registrationFor, name?.trim(), email?.trim())
      const token = data?.accessToken || data?.tokens?.access?.token || data?.token
      if (token) {
        const isAgent = registrationFor === 'MIDDLEMAN' || data?.user?.role === 'MIDDLEMAN'
        const userData = {
          ...(data?.user || {}),
          name: (data?.user?.name && data.user.name.trim()) || name?.trim() || (isAgent ? "GMT Agent" : "Customer"),
          phone: data?.user?.phone || phone,
          email: data?.user?.email || email?.trim() || undefined,
          whatsappOptIn: whatsapp,
          ...(isAgent ? { role: 'MIDDLEMAN' } : {}),
        }
        await login(token, userData)
        closeLoginModal()
        
        // Auto-redirect to dedicated GMT Agent portal if logged in as agent
        if (isAgent) {
          navigate('/agent/loads')
        }
      } else {
        closeLoginModal()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ALL hooks are declared unconditionally above!
  if (!isLoginModalOpen) return null

  const isAgentModal = registrationFor === 'MIDDLEMAN'

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={closeLoginModal}></div>

      <div className="relative bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[92vh] my-auto">
        {/* LEFT COLUMN: Image or Agent Brand Banner */}
        <div className={`w-full md:w-5/12 h-44 sm:h-56 md:h-auto relative shrink-0 overflow-hidden flex flex-col justify-end p-6 ${
          isAgentModal ? 'bg-[#182333] text-white' : 'bg-slate-100'
        }`}>
          <img 
            src={isAgentModal ? "/plan-hero.webp" : "/login_poster.webp"} 
            alt={isAgentModal ? "GoMyTruck Agent Partner" : "Delivery Partner"} 
            className={`w-full h-full object-cover absolute inset-0 ${isAgentModal ? 'opacity-30 mix-blend-luminosity' : ''}`}
          />
          {isAgentModal && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40"></div>
          )}
          {isAgentModal ? (
            <div className="relative z-10 space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider rounded-lg backdrop-blur-sm">
                <Briefcase size={12} /> GMT Agent Network
              </span>
              <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">
                Earn 5-10% On Every Commercial Load
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect MSME shippers with verified fleet owners. Real-time load quotes, full trip tracking, and daily digital wallet settlements.
              </p>
              <div className="pt-2 flex flex-col gap-1 text-[11px] text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Pan-India Open Freight Marketplace</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-400 shrink-0" />
                  <span>Attach & Manage Multiple Trucks</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* RIGHT COLUMN: Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-between relative bg-white overflow-y-auto">
          <button onClick={closeLoginModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors z-20">
            <X size={20} />
          </button>

          {showRoleInfo ? (
            <div className="my-auto flex flex-col items-center justify-center text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Login Successful!</h2>
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm mb-6 max-w-sm font-medium">
                Welcome to the GMT Agent portal. Manage all your commercial loads and vehicle attachments.
              </div>
              <button 
                onClick={() => {
                  closeLoginModal()
                  navigate('/agent/loads')
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-600/25 active:scale-95 cursor-pointer"
              >
                Go to Agent Dashboard
              </button>
            </div>
          ) : user ? (
            <div className="my-auto flex flex-col items-center justify-center text-center py-6">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <User size={40} className="text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">You're signed in as</h2>
              <p className="text-xl font-medium text-green-600 mb-6">{user.name || "Customer"}</p>
              
              <div className="flex flex-col gap-3 w-full max-w-sm">
                {(user.role === 'MIDDLEMAN' || registrationFor === 'MIDDLEMAN') && (
                  <button 
                    onClick={() => {
                      closeLoginModal()
                      navigate('/agent/loads')
                    }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Go to Agent Dashboard</span>
                  </button>
                )}
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={closeLoginModal}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all active:scale-95 cursor-pointer"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      logout()
                      setStep(1)
                      closeLoginModal()
                      navigate('/')
                    }}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : step === 1 ? (
            <div className="flex flex-col justify-between h-full">
              <div>
                {isAgentModal ? (
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
                      <Briefcase size={13} className="text-emerald-600" />
                      <span>GMT Agent Partner Access</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#112a46] flex items-center gap-2 mb-1.5">
                      Agent Portal Login <span className="text-2xl">🤝</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Sign in with your mobile number to manage commercial loads, connect trucks, and earn commissions.
                    </p>
                  </div>
                ) : (
                  <div className="mb-5">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#112a46] flex items-center gap-2 mb-1.5">
                      Welcome! <span className="text-2xl">👋</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Sign in or make an account to complete your order with us.
                    </p>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  {/* Role Selector */}
                  {isAgentModal ? (
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          🤝
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">Logging in as GMT Agent</p>
                          <p className="text-[11px] text-emerald-700 font-semibold">Direct Broker & Dispatch Channel</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegistrationFor('CUSTOMER')}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 underline decoration-slate-300 cursor-pointer"
                      >
                        Change Role
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">I am a...</label>
                      <div className="flex flex-wrap gap-2">
                        {ROLES.map(role => (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setRegistrationFor(role.id)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              registrationFor === role.id 
                                ? 'bg-green-600 text-white shadow-sm shadow-green-600/30' 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {role.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Name Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder={isAgentModal ? "Agency Name / Contact Person" : "Your Name"}
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      placeholder={isAgentModal ? "10-digit Agent Mobile Number" : "Phone Number"}
                      required
                      maxLength={10}
                      value={phone}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone(val);
                      }}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email (optional)"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                    />
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-center gap-2.5 cursor-pointer pt-1 group">
                    <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${whatsapp ? 'bg-green-600 border border-green-600' : 'border border-slate-300 group-hover:border-green-500 bg-white'}`}>
                      {whatsapp && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={whatsapp} 
                      onChange={e => setWhatsapp(e.target.checked)} 
                    />
                    <span className="text-xs font-medium text-slate-600">Receive updates via WhatsApp</span>
                  </label>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs">
                      {error}
                    </div>
                  )}

                  {/* Submit Section */}
                  <div className="pt-3 space-y-3">
                    <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                      By proceeding, you agree to the <a href="/legal/terms-conditions" target="_blank" rel="noopener noreferrer" className="font-bold text-green-700 hover:underline">terms of services</a> and <a href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-bold text-green-700 hover:underline">privacy policy</a>
                    </p>
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 text-sm flex justify-center items-center cursor-pointer"
                    >
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : isAgentModal ? "Continue to Agent Dashboard" : "Continue"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between h-full py-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#112a46] mb-2">
                  {isAgentModal ? "Verify Agent Account" : "Verify your account"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 flex justify-between items-center mb-6">
                  <span>OTP sent to <span className="font-bold text-slate-700">(+91) {phone}</span>.</span>
                  <button onClick={() => setStep(1)} className="font-bold text-emerald-600 hover:underline cursor-pointer">Change</button>
                </p>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs mb-4">
                    {error}
                  </div>
                )}

                <div className="flex gap-2 sm:gap-3 justify-between mb-6">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => inputRefs.current[idx] = el}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 border border-slate-300 rounded-xl text-center text-xl font-bold focus:border-green-600 focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                {devOtp && (
                  <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-xs sm:text-sm font-semibold">
                    Test OTP: <span className="font-bold text-base tracking-widest text-emerald-900">{devOtp}</span>
                  </div>
                )}

                <p className="text-xs text-slate-500 text-center">
                  Didn't receive the OTP? <button onClick={handleLoginSubmit} disabled={isLoading} className="font-bold text-emerald-600 hover:underline disabled:opacity-50 cursor-pointer">Resend</button>
                </p>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleVerify}
                  disabled={otp.join("").length !== 6 || isLoading}
                  className={`w-full flex justify-center items-center py-3 rounded-xl font-bold text-sm transition-all ${
                    otp.join("").length === 6 && !isLoading 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer' 
                      : 'bg-emerald-600/40 text-white cursor-not-allowed'
                  }`}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : isAgentModal ? "Verify & Open Agent Dashboard" : "Verify my account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
