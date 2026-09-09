// src/Booking.js
import { useState } from "react";
import { generateOwnerWhatsAppUrl } from "../utils/whatsapp";

const Booking = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.service) newErrors.service = "Service selection is required";
    if (!formData.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiMessage(null);
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        numberOfPeople: 1,
        tripId: '675c9a8391b1dffb0e46bdf3',
        service: formData.service,
        serviceName: formData.service,
        travelDate: formData.date,
      };

      const res = await fetch(`${baseUrl}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to submit booking');
      }

      setConfirmedBooking(payload);
      setApiMessage({
        type: 'success',
        text: `Your booking for "${formData.service}" on ${formData.date} has been successfully confirmed!`,
      });
      setFormData({ name: "", email: "", phone: "", service: "", date: "" });
    } catch (err) {
      console.error('Booking error:', err);
      setApiMessage({
        type: 'error',
        text: err.message || 'Failed to submit booking. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-14">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EADBCE] shadow-sm">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] border border-[#D4A373]/30 text-xs uppercase tracking-widest font-semibold mb-3">
              🌾 जय जोहार • RESERVE YOUR SPOT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1B4332]">
              Book Your Chhattisgarh Expedition
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Select your trail, pick a travel date, and we'll connect you directly with a local tribal guide.
            </p>
          </div>

          {apiMessage && (
            <div
              className={`p-6 mb-8 rounded-2xl text-center border ${
                apiMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                  : 'bg-red-50 text-red-900 border-red-200'
              }`}
            >
              <p className="font-bold text-base mb-2">{apiMessage.text}</p>
              {confirmedBooking && (
                <div className="mt-4">
                  <a
                    href={generateOwnerWhatsAppUrl(confirmedBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl text-sm shadow-md transition hover:scale-105"
                  >
                    <span>💬</span>
                    <span>Send Booking to Guide on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3.5 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] text-gray-800 transition"
                placeholder="e.g. Ramesh Sahu"
                required
              />
              {errors.name && <p className="text-[#C84B31] text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3.5 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] text-gray-800 transition"
                placeholder="e.g. ramesh@example.com"
                required
              />
              {errors.email && <p className="text-[#C84B31] text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone / WhatsApp Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1" htmlFor="phone">
                WhatsApp / Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3.5 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] text-gray-800 transition"
                placeholder="e.g. +91 98765 43210"
              />
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1" htmlFor="service">
                Choose Expedition / Trail
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full p-3.5 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] text-gray-800 transition"
                required
              >
                <option value="">Select your trail or campsite</option>
                <option value="Saroda Dadar Weekend Camp">Saroda Dadar Weekend Camp (₹2,499)</option>
                <option value="Maikal Forest Guided Trek">Maikal Forest Guided Trek (₹1,299)</option>
                <option value="Bhoramdev Valley Trek & Heritage">Bhoramdev Valley Trek & Heritage (₹3,200)</option>
                <option value="Kanger Valley & Caves Exploration">Kanger Valley & Caves Exploration (₹1,799)</option>
                <option value="Chitrakote Falls Night Safari">Chitrakote Falls Night Safari (₹4,500)</option>
                <option value="River Kayaking & Water Adventures">River Kayaking & Water Adventures (₹1,499)</option>
                <option value="Custom Dandakaranya Expedition">Custom Dandakaranya Expedition</option>
              </select>
              {errors.service && <p className="text-[#C84B31] text-xs mt-1">{errors.service}</p>}
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1" htmlFor="date">
                Preferred Travel Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3.5 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] text-gray-800 transition"
                required
              />
              {errors.date && <p className="text-[#C84B31] text-xs mt-1">{errors.date}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-[#C84B31] hover:bg-[#9E321C] text-white font-bold rounded-xl shadow-lg transition duration-200 ${
                  isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Confirming Expedition...' : 'Confirm Expedition Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
