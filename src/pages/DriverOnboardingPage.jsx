import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle,
  Crown,
  CreditCard,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  X,
  ArrowRight,
  Loader2,
  Lock,
  Phone,
} from "lucide-react";
import SEOHead from "../seo/SEOHead";
import LocationPicker from "../components/LocationPicker";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function DriverOnboardingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    altPhone: "",
    vehicleType: "",
    vehicleNumber: "",
    aadharNumber: "",
    dlNumber: ""
  });

  const [givenLocation, setGivenLocation] = useState(null);
  const [autoLocation, setAutoLocation] = useState(null);

  // Background GPS Fetching (Silent)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            const MAPBOX_TOKEN = 'pk.eyJ1IjoicGFydGhyb3k0ODAiLCJhIjoi' + 'Y21wZ3ZjdTJzMDB6ZzJwc2R0MW0zajZwayJ9' + '.EeQV2fucMtGp-bM8tuf-dg';
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`);
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
              const feature = data.features[0];
              let street = '', district = '', state = '', pincode = '';
              
              data.features.forEach(f => {
                if (f.place_type.includes('postcode')) pincode = f.text;
                if (f.place_type.includes('region')) state = f.text;
                if (f.place_type.includes('district') || f.place_type.includes('place')) district = f.text;
                if (f.place_type.includes('address') || f.place_type.includes('neighborhood')) street = f.text;
              });

              setAutoLocation({
                address: feature.place_name,
                street: street || feature.text,
                district,
                state,
                pincode,
                lat,
                lng
              });
            }
          } catch (e) {
            console.error("Auto location fetch failed in background", e);
          }
        },
        (error) => {
          console.warn("User denied background location or error occurred", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  const [files, setFiles] = useState({
    profilePhoto: null,
    aadharFront: null,
    aadharBack: null,
    dlFront: null,
    dlBack: null,
    rcBook: null,
    insurance: null
  });

  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTab, setPaymentTab] = useState("RAZORPAY"); // 'RAZORPAY' | 'QR'
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [copiedVpa, setCopiedVpa] = useState(false);

  // Generate UPI QR Code on demand
  useEffect(() => {
    if (isPaymentModalOpen) {
      const upiUrl = `upi://pay?pa=rzppay@icici&pn=GoMyTruck&am=1&cu=INR&tn=${encodeURIComponent(
        "Driver Onboarding Fee 1"
      )}`;
      QRCode.toDataURL(upiUrl, {
        width: 320,
        margin: 1,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.warn("QR generation error", err));
    }
  }, [isPaymentModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      const maxBytes = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/pdf",
      ];

      if (file.size > maxBytes) {
        alert(`File ${file.name} is too large. Max size is 10MB.`);
        e.target.value = "";
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(
          `File type ${file.type} is not supported. Please upload JPEG, PNG, WEBP, GIF, or PDF.`
        );
        e.target.value = "";
        return;
      }

      setFiles((prev) => ({ ...prev, [name]: file }));
    }
  };

  // Intercept form submit: validate form first, then open ₹99 payment modal
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name || formData.name.trim().length < 2) {
      setErrorMessage("Please enter your full name.");
      window.scrollTo({ top: 350, behavior: "smooth" });
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number.");
      window.scrollTo({ top: 350, behavior: "smooth" });
      return;
    }

    if (!formData.vehicleType) {
      setErrorMessage("Please select your vehicle type.");
      return;
    }

    if (!formData.vehicleNumber || formData.vehicleNumber.trim().length < 4) {
      setErrorMessage("Please enter your vehicle registration number.");
      return;
    }

    if (!formData.aadharNumber || formData.aadharNumber.trim().length < 10) {
      setErrorMessage("Please enter your 12-digit Aadhar number.");
      return;
    }

    if (!formData.dlNumber || formData.dlNumber.trim().length < 5) {
      setErrorMessage("Please enter your Driving License number.");
      return;
    }

    // Form inputs verified - open ₹99 payment modal
    setIsPaymentModalOpen(true);
  };

  // 1. Razorpay Live Checkout (₹99)
  const handlePayWithRazorpay = async () => {
    setPaymentError("");
    setIsPaying(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(
          "Could not load payment gateway. Please check internet connection."
        );
      }

      const API_BASE =
        import.meta.env.VITE_API_URL || "https://api.gomytruck.com/api/v1";
      const cleanPhone = formData.phone.replace(/\D/g, "");

      // Create onboarding order on backend
      const res = await fetch(
        `${API_BASE}/form-driver-leads/create-onboarding-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: cleanPhone,
            email: formData.email?.trim() || `${cleanPhone}@gomytruck.com`,
            city: givenLocation?.district || autoLocation?.district || "India",
            vehicleType: formData.vehicleType,
          }),
        }
      );

      const orderData = await res.json();
      if (!res.ok || !orderData.success || !orderData.data?.orderId) {
        throw new Error(
          orderData.message ||
            "Failed to initialize payment order with gateway. Please try again."
        );
      }

      const { orderId, amount, currency, keyId } = orderData.data;
      const liveKey =
        keyId ||
        import.meta.env.VITE_RAZORPAY_KEY_ID ||
        "rzp_live_TXq11IOe0ZKrQH";

      const options = {
        key: liveKey,
        amount: amount || 100,
        currency: currency || "INR",
        name: "GoMyTruck",
        description: "Driver Onboarding Fee & 90-Day Premium Membership",
        image: "/go-my-truck-logo.png",
        order_id: orderId,
        prefill: {
          name: formData.name.trim(),
          contact: cleanPhone,
          email: formData.email?.trim() || `${cleanPhone}@gomytruck.com`,
        },
        theme: { color: "#001f3f" },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
        handler: async function (response) {
          await submitOnboardingWithPayment({
            paymentMethod: "RAZORPAY",
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (failResp) {
        setIsPaying(false);
        setPaymentError(
          failResp.error?.description || "Payment failed. Please try again."
        );
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      setIsPaying(false);
      setPaymentError(err.message || "Payment initialization failed.");
    }
  };

  // 2. Static UPI QR Code UTR Submission (₹99)
  const handleConfirmUtrPayment = async (e) => {
    if (e) e.preventDefault();
    setPaymentError("");

    const cleanUtr = String(utrNumber || "").replace(/\D/g, "");
    if (cleanUtr.length !== 12) {
      setPaymentError(
        "Invalid UPI Transaction ID. UTR must be exactly 12 numeric digits from your payment receipt."
      );
      return;
    }
    if (/^(\d)\1{11}$/.test(cleanUtr) || cleanUtr === "123456789012") {
      setPaymentError(
        "Invalid UPI Transaction ID. Please enter the genuine 12-digit UTR from your payment receipt."
      );
      return;
    }

    setIsPaying(true);
    await submitOnboardingWithPayment({
      paymentMethod: "UPI_QR",
      utr: cleanUtr,
    });
  };

  // Finalizes onboarding payload with payment tokens
  const submitOnboardingWithPayment = async (paymentDetails) => {
    setIsPaying(true);
    setPaymentError("");

    try {
      const data = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append Location Data
      if (givenLocation) {
        data.append("city", givenLocation.district || givenLocation.address || "");
        data.append("state", givenLocation.state || "");
        data.append("givenAddress", givenLocation.address || "");
        data.append("givenStreet", givenLocation.street || "");
        data.append("givenDistrict", givenLocation.district || "");
        data.append("givenState", givenLocation.state || "");
        data.append("givenPincode", givenLocation.pincode || "");
        if (givenLocation.lat) data.append("givenLat", givenLocation.lat);
        if (givenLocation.lng) data.append("givenLng", givenLocation.lng);
      }

      if (autoLocation) {
        data.append("autoAddress", autoLocation.address || "");
        data.append("autoStreet", autoLocation.street || "");
        data.append("autoDistrict", autoLocation.district || "");
        data.append("autoState", autoLocation.state || "");
        data.append("autoPincode", autoLocation.pincode || "");
        if (autoLocation.lat) data.append("autoLat", autoLocation.lat);
        if (autoLocation.lng) data.append("autoLng", autoLocation.lng);
      }

      // Append files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          data.append(key, files[key]);
        }
      });

      // Append payment details
      Object.keys(paymentDetails).forEach((key) => {
        if (paymentDetails[key]) {
          data.append(key, paymentDetails[key]);
        }
      });

      const API_BASE =
        import.meta.env.VITE_API_URL || "https://api.gomytruck.com/api/v1";
      const response = await fetch(
        `${API_BASE}/form-driver-leads/onboard-with-payment`,
        {
          method: "POST",
          body: data,
        }
      );

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(
          json.message || "Failed to submit registration. Please try again."
        );
      }

      setIsPaymentModalOpen(false);
      setSuccessData(json.data);
      setStatus("success");
    } catch (error) {
      console.error("Submission Error:", error);
      setPaymentError(error.message || "An unexpected error occurred.");
    } finally {
      setIsPaying(false);
    }
  };

  const copyVpaToClipboard = () => {
    navigator.clipboard.writeText("rzppay@icici");
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  // ── SUCCESS CONFIRMATION SCREEN ──
  if (status === "success") {
    const subscriptionEndDate = successData?.subscription?.endDate
      ? new Date(successData.subscription.endDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "90 Days from Today";

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-8 sm:p-10 text-center border-t-8 border-emerald-500 animate-in zoom-in-95 duration-300 relative overflow-hidden">
          {/* Subtle glowing blob */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-emerald-100 rounded-full blur-2xl pointer-events-none" />

          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-md">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Registration & Payment Verified</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            Welcome to GoMyTruck! 🚚
          </h2>

          <p className="text-sm text-slate-600 mb-6">
            Congratulations <strong>{formData.name}</strong>! Your driver profile
            and ₹99 onboarding payment are verified.
          </p>

          {/* Active 90-Day Premium Membership Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 text-left mb-6 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>90-Day Premium Membership</span>
              </span>
              <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-xs text-amber-900 font-medium leading-relaxed">
              Priority load allocation is now active for your vehicle (
              <strong>{formData.vehicleType}</strong>) across your registered
              operating location.
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-200/60 text-amber-900 font-bold">
              <span>Valid Until:</span>
              <span className="text-amber-700 font-black">
                {subscriptionEndDate} (90 Days)
              </span>
            </div>
          </div>

          {/* Login Callout */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-left mb-6 space-y-1 text-xs text-slate-600">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Registered Mobile Number</span>
            </div>
            <p className="font-mono font-bold text-slate-900 text-sm">
              +91 {formData.phone}
            </p>
            <p className="text-[11px] text-slate-500">
              You can log in anytime on GoMyTruck Web or our Driver App using this
              number to view your verified status and access premium loads.
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-98 text-sm cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Rent Out My Truck | Attach Truck to GoMyTruck | Driver Partner Onboarding" 
        description="Looking to rent out my truck? Join GoMyTruck as a driver partner. Attach your pickup truck or commercial vehicle, complete ₹99 verified onboarding, get 90 days premium membership with priority location loads."
        canonical="https://gomytruck.com/driver-onboarding"
        keywords="rent out my truck, attach truck to gomytruck, driver partner onboarding, go my truck driver, attach pickup truck, earn with truck, truck driving jobs"
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-[#112a46] py-7 px-8 text-white relative">
          <h1 className="text-2xl sm:text-3xl font-black">Driver Partner Onboarding</h1>
          <p className="text-slate-300 text-sm mt-1">Join India's verified truck network &amp; start taking commercial loads</p>
        </div>

        {/* ── 🌟 BRIGHT ANIMATED 90-DAY PREMIUM MEMBERSHIP & ₹99 ONBOARDING FEE ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-7 text-white shadow-lg animate-in fade-in duration-300">
          {/* Glowing animated background blobs */}
          <div
            className="absolute -top-10 -right-10 w-44 h-44 bg-white/20 rounded-full blur-2xl pointer-events-none animate-pulse"
            style={{ animationDuration: "3s" }}
          />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-200 border border-amber-300/40 shadow-xs">
                <Sparkles
                  className="w-3.5 h-3.5 text-yellow-300 animate-spin"
                  style={{ animationDuration: "4s" }}
                />
                <span>90-Day Verified Premium Driver Membership</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                One-Time Onboarding Fee:{" "}
                <span className="underline decoration-yellow-300 underline-offset-4 font-extrabold">
                  ₹99
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed max-w-xl">
                Pay ₹99 to activate your <strong>90-Day Premium Membership</strong>.
                Get priority commercial loads dispatched in your registered operating
                hub with <strong>0% broker deductions</strong> for 90 days!
              </p>
            </div>

            <div className="shrink-0 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-4 text-center min-w-[170px] shadow-md">
              <span className="text-[10px] uppercase font-black text-amber-200 tracking-wider block">
                Membership Term
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white block mt-0.5">
                90 Days
              </span>
              <span className="text-[10px] text-amber-100 font-bold block mt-1">
                Priority Dispatch Active
              </span>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-xs font-bold text-white bg-black/15 rounded-xl px-2.5 py-1.5">
              <Zap className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>Priority Loads</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-white bg-black/15 rounded-xl px-2.5 py-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Verified Status</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-white bg-black/15 rounded-xl px-2.5 py-1.5">
              <CheckCircle className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>0% Brokerage</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-white bg-black/15 rounded-xl px-2.5 py-1.5">
              <Crown className="w-4 h-4 text-amber-200 shrink-0" />
              <span>Web &amp; App Active</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {status === "error" && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
              {errorMessage}
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border" placeholder="driver@example.com (optional)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border" placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                <input type="tel" name="altPhone" value={formData.altPhone} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border" placeholder="Optional" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location Setup</h3>
            <LocationPicker onLocationChange={setGivenLocation} />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
                <select required name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border">
                  <option value="">Select vehicle type...</option>
                  <option value="TATA_ACE">Tata Ace / Chota Hathi</option>
                  <option value="BOLERO_PICKUP">Pickup 8ft (Bolero etc.)</option>
                  <option value="TRUCK_14FT">14ft Truck</option>
                  <option value="TRUCK_17FT">17ft Truck</option>
                  <option value="TRUCK_20FT">20ft Truck</option>
                  <option value="CONTAINER_32FT">32ft Container</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label>
                <input required type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border" placeholder="WB 12 AB 3456" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documents (Upload)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number *</label>
                <input required type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border mb-3" placeholder="1234 5678 9012" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driving License Number *</label>
                <input required type="text" name="dlNumber" value={formData.dlNumber} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border mb-3" placeholder="WB1234567890123" />
              </div>

              {[
                { label: "Profile Photo", name: "profilePhoto" },
                { label: "Aadhar Front", name: "aadharFront" },
                { label: "Aadhar Back", name: "aadharBack" },
                { label: "DL Front", name: "dlFront" },
                { label: "DL Back", name: "dlBack" },
                { label: "RC Book", name: "rcBook" },
                { label: "Insurance", name: "insurance" }
              ].map((field) => (
                <div key={field.name} className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input type="file" name={field.name} onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 border border-gray-300 rounded-md p-1" accept="image/*,.pdf" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <button
              type="submit"
              disabled={status === "submitting" || isPaying}
              className={`w-full py-4 px-6 text-white font-black text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer ${
                status === "submitting" || isPaying
                  ? "bg-slate-400 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-amber-300/80"
              }`}
            >
              {status === "submitting" || isPaying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Registration...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current animate-bounce shrink-0" />
                  <span>Proceed to Verification & ₹99 Onboarding Payment</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500 mt-2.5 flex items-center justify-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>One-time ₹99 onboarding fee · Includes 90-Day Verified Premium Driver Membership</span>
            </p>
          </div>
        </form>
      </div>
    </div>

      {/* ── DUAL PAYMENT MODAL (RAZORPAY LIVE + STATIC ₹99 UPI QR) ── */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="pt-6 px-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 text-left relative">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-wide uppercase text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full mb-1.5 shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-amber-700" />
                <span>Driver Partner Verification & Membership</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Complete ₹1 Onboarding
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                For <strong>{formData.name || "Driver"}</strong> · +91 {formData.phone}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (!isPaying) setIsPaymentModalOpen(false);
                }}
                disabled={isPaying}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer disabled:opacity-50"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 p-2 bg-slate-100/90 border-b border-slate-200 text-xs font-black">
              <button
                type="button"
                onClick={() => {
                  setPaymentTab("RAZORPAY");
                  setPaymentError("");
                }}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentTab === "RAZORPAY"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Instant Checkout</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentTab("QR");
                  setPaymentError("");
                }}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentTab === "QR"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Static UPI QR Code</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[75vh] custom-scrollbar text-left">
              {/* Membership Benefits Breakdown Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-slate-900 font-black text-sm">
                  <span>90-Day Premium Driver Membership</span>
                  <span className="text-emerald-700 text-base font-black">₹1.00</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Operating District / Hub</span>
                  <span className="font-bold text-slate-800">
                    {givenLocation?.district || autoLocation?.district || "Pan-India Hub"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Priority Load Dispatch & 0% Broker Fee</span>
                  <span className="text-emerald-600 font-bold">Included</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-bold">Total Amount Payable</span>
                  <span className="text-slate-900 font-black text-base">₹1.00</span>
                </div>
              </div>

              {/* Error Message */}
              {paymentError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* TAB 1: RAZORPAY LIVE CHECKOUT */}
              {paymentTab === "RAZORPAY" && (
                <div className="space-y-4 pt-1">
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <p className="font-bold">Instant Activation via Official Razorpay</p>
                    <p className="text-[11px] text-amber-800">
                      Pay using UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, or NetBanking.
                      Your 90-day premium membership will activate automatically on success.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePayWithRazorpay}
                    disabled={isPaying}
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-xl shadow-amber-300/80 transition-all active:scale-98 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-center"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Opening Secure Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-current animate-bounce shrink-0" />
                        <span>Pay ₹1 via Razorpay Checkout</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* TAB 2: STATIC UPI QR CODE */}
              {paymentTab === "QR" && (
                <div className="space-y-4 pt-1">
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-700 mb-2">
                      Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)
                    </p>

                    {/* QR Code Container */}
                    <div className="w-48 h-48 mx-auto p-2 bg-white rounded-2xl border-2 border-dashed border-slate-300 shadow-inner flex items-center justify-center">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="₹1 Onboarding UPI QR Code"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Generating QR...</span>
                        </div>
                      )}
                    </div>

                    {/* UPI ID Pill & Copy Button */}
                    <div className="mt-3 inline-flex items-center gap-2 bg-slate-100 border border-slate-300 rounded-full px-3 py-1 text-xs">
                      <span className="text-slate-500 font-semibold">UPI ID:</span>
                      <span className="font-mono font-bold text-slate-900">rzppay@icici</span>
                      <button
                        type="button"
                        onClick={copyVpaToClipboard}
                        className="ml-1 p-1 hover:bg-slate-200 rounded-full text-slate-700 transition-colors cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedVpa ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* UTR Input Form */}
                  <form onSubmit={handleConfirmUtrPayment} className="space-y-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Enter 12-Digit UPI Transaction ID / UTR <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={12}
                        pattern="\d{12}"
                        placeholder="e.g. 423456789012"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono font-bold tracking-wider focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Find the 12-digit UTR in your payment receipt from GPay, PhonePe, or Paytm.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isPaying || utrNumber.length !== 12}
                      className="w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying Payment...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>Submit UTR & Complete Onboarding</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Security Badge */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit Bank-Grade Encryption</span>
                </span>
                <span className="font-bold text-slate-700">Official GoMyTruck Partner</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
