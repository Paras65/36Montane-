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
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg my-10 max-w-4xl">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Book Your Next Adventure
      </h2>

      {apiMessage && (
        <div
          className={`p-5 mb-6 rounded-xl text-center border ${
            apiMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <p className="font-semibold text-base mb-2">{apiMessage.text}</p>
          {confirmedBooking && (
            <div className="mt-3">
              <a
                href={generateOwnerWhatsAppUrl(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl text-sm shadow-md transition hover:scale-105"
              >
                <span>💬</span>
                <span>Send Booking to Guide on WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="mb-4">
          <label
            className="block text-lg font-medium text-gray-700"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter your full name"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label
            className="block text-lg font-medium text-gray-700"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter your email address"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone / WhatsApp Input */}
        <div className="mb-4">
          <label
            className="block text-lg font-medium text-gray-700"
            htmlFor="phone"
          >
            Phone / WhatsApp Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="e.g. +91 98765 43210"
          />
        </div>

        {/* Service Selection */}
        <div className="mb-4">
          <label
            className="block text-lg font-medium text-gray-700"
            htmlFor="service"
          >
            Select Service
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          >
            <option value="">Choose your adventure</option>
            <option value="Camping">Camping</option>
            <option value="Trekking">Trekking</option>
            <option value="Guided Tour">Guided Tour</option>
          </select>
          {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label
            className="block text-lg font-medium text-gray-700"
            htmlFor="date"
          >
            Preferred Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting Booking...' : 'Book Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Booking;
