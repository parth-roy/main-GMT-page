import React, { useState } from "react";
import SEOHead from "../seo/SEOHead";
export default function DriverOnboardingPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    altPhone: "",
    city: "",
    vehicleType: "",
    vehicleNumber: "",
    aadharNumber: "",
    dlNumber: ""
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const data = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      // Append files
      Object.keys(files).forEach(key => {
        if (files[key]) {
          data.append(key, files[key]);
        }
      });

      const response = await fetch("https://api.gomytruck.com/api/v1/form-driver-leads", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form. Please try again.");
      }

      setStatus("success");
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus("error");
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border-t-4 border-green-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering as a driver partner. Our team will review your details and contact you shortly.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-brand-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-brand-700 transition"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Rent Out My Truck | Attach Truck to GoMyTruck | Driver Partner Onboarding" 
        description="Looking to rent out my truck? Join GoMyTruck as a driver partner. Attach your pickup truck or mini truck, fill out the onboarding form, upload your documents, and start earning today."
        canonical="https://gomytruck.com/driver-onboarding"
        keywords="rent out my truck, attach truck to gomytruck, driver partner onboarding, go my truck driver, attach pickup truck, earn with truck, truck driving jobs"
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-brand-600 py-6 px-8 text-white">
          <h1 className="text-2xl font-bold">Driver Partner Onboarding</h1>
          <p className="text-brand-100 mt-1">Join our fleet and start earning today</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border" placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                <input type="tel" name="altPhone" value={formData.altPhone} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border" placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 border" placeholder="e.g. Kolkata" />
              </div>
            </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label} *</label>
                  <input required type="file" name={field.name} onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 border border-gray-300 rounded-md p-1" accept="image/*,.pdf" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={status === "submitting"}
              className={`w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md transition ${status === "submitting" ? "bg-gray-400 cursor-not-allowed" : "bg-brand-600 hover:bg-brand-700"}`}
            >
              {status === "submitting" ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
