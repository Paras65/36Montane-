import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock } from "react-icons/fa";
import { getOwnerWhatsAppNumber } from "../utils/whatsapp";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.message) newErrors.message = "Please enter your message";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message, please try again later.");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-14">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] border border-[#D4A373]/30 text-xs uppercase tracking-widest font-semibold mb-3">
            🌾 जय जोहार • BASECAMP INQUIRY
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-[#1B4332] mb-4">
            Connect With Our Guides
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Planning a trek to Saroda Dadar, Kanger Valley caves, or a weekend campfire? Send us a message or chat with our basecamp leader directly on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Form Section (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#EADBCE] shadow-sm">
            <h2 className="text-2xl font-bold font-serif text-[#1B4332] mb-2">Send an Inquiry</h2>
            <p className="text-xs text-gray-500 mb-6">Our trail desk typically responds within 2-4 business hours.</p>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
                <p className="font-bold">🙏 संदेश प्राप्त हुआ (Message Sent)!</p>
                <p className="text-xs mt-1">Thank you for reaching out. A 36 Montane expedition guide will contact you shortly.</p>
              </div>
            )}

            {apiError && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-[#C84B31] text-xs font-semibold text-center">
                <p>{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] text-gray-800 transition"
                  placeholder="e.g. Ramesh Sahu"
                  required
                />
                {errors.name && <p className="text-[#C84B31] text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] text-gray-800 transition"
                  placeholder="e.g. ramesh@example.com"
                  required
                />
                {errors.email && <p className="text-[#C84B31] text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Phone / WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] text-gray-800 transition"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              {/* Message Input */}
              <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Your Inquiry / Travel Dates
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] text-gray-800 transition"
                  placeholder="Tell us about the trails you'd like to explore, number of explorers, or dates..."
                  required
                ></textarea>
                {errors.message && <p className="text-[#C84B31] text-xs mt-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3.5 bg-[#C84B31] hover:bg-[#9E321C] text-white font-bold rounded-xl shadow-lg transition duration-200 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Sending Inquiry..." : "Submit Inquiry"}
              </button>
            </form>
          </div>

          {/* Contact Info & Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-[#EADBCE] shadow-sm">
              <h3 className="text-xl font-bold font-serif text-[#1B4332] mb-4">Base Camp Information</h3>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center shrink-0 text-base">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block text-xs uppercase tracking-wider">Base Camp Address</span>
                    <p className="text-xs text-gray-600 mt-0.5">36 Montane Adventure Camping, Saroda Dadar, Mahali, Kawardha, Chhattisgarh 491559</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C84B31]/10 text-[#C84B31] flex items-center justify-center shrink-0 text-base">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block text-xs uppercase tracking-wider">Direct Hotline</span>
                    <a href={`tel:+${getOwnerWhatsAppNumber()}`} className="text-xs text-[#C84B31] font-semibold hover:underline block mt-0.5">+91 96693 24552</a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#D4A373]/20 text-[#9E6B28] flex items-center justify-center shrink-0 text-base">
                    <FaEnvelope />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block text-xs uppercase tracking-wider">Email Dispatch</span>
                    <a href="mailto:info@36montane.com" className="text-xs text-gray-600 hover:text-gray-900 block mt-0.5">info@36montane.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E9C46A]/20 text-[#8C6B10] flex items-center justify-center shrink-0 text-base">
                    <FaClock />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block text-xs uppercase tracking-wider">Trail Office Hours</span>
                    <p className="text-xs text-gray-600 mt-0.5">Mon - Sun: 7:00 AM – 9:00 PM IST</p>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp CTA Button */}
              <div className="mt-6 pt-5 border-t border-[#F0E5D3]">
                <a
                  href={`https://wa.me/${getOwnerWhatsAppNumber()}?text=${encodeURIComponent(
                    "Jai Johar! I have an inquiry regarding trekking with 36 Montane."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition hover:scale-[1.02]"
                >
                  <FaWhatsapp className="text-base" />
                  <span>Chat With Guide on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="bg-white p-3 rounded-3xl border border-[#EADBCE] shadow-sm overflow-hidden h-64">
              <iframe
                className="w-full h-full rounded-2xl"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29689.21596359117!2d81.707786!3d20.6944108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28f4c68833e5e1%3A0xd77560f57320d6d9!2s36%20Montane%20Adventure%20Camping%2C%20Saroda%2C%20Dadar%2C%20Mahali%2C%20Chhattisgarh%20491559!5e0!3m2!1sen!2sin!4v1713948503181!5m2!1sen!2sin"
                title="Google Map - 36 Montane Adventure Camping"
                allowFullScreen
                loading="lazy"
                frameBorder="0"
                aria-label="Map of 36 Montane Adventure Camping, Saroda Dadar, Chhattisgarh"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

