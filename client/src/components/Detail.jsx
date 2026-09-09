import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useLocation } from "react-router-dom";
import { mockFeaturedTrips } from "../data/mockData";
import { generateOwnerWhatsAppUrl } from "../utils/whatsapp";

const BookingDetail = () => {
  const location = useLocation();
  const tripDetails = location.state || mockFeaturedTrips[0];

  const baseNumericPrice = Number(String(tripDetails.price || 4500).replace(/[^0-9]/g, '')) || 4500;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    groupSize: "1",
    service: tripDetails,
    date: "",
  });

  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(baseNumericPrice);

  // Update total price whenever group size changes
  const updateTotalPrice = () => {
    let multiplier = 1;
    if (formData.groupSize === "2-5") multiplier = 2.5;
    else if (formData.groupSize === "6-10") multiplier = 5.0;
    else if (formData.groupSize === "Private") multiplier = 1.8;

    setTotalPrice(Math.round(baseNumericPrice * multiplier));
  };

  useEffect(() => {
    updateTotalPrice();
  }, [formData.groupSize, baseNumericPrice]);

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Name Validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    // Email Validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone Validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Date Validation
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    // Group Size Validation
    if (!formData.groupSize) {
      newErrors.groupSize = "Please select a group size";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Trigger real-time validation
    validateField(name, value);
  };

  // Validate each field
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value) newErrors.name = "Name is required";
        else delete newErrors.name;
        break;
      case "email":
        if (!value) newErrors.email = "Email is required";
        else if (!validateEmail(value)) newErrors.email = "Please enter a valid email address";
        else delete newErrors.email;
        break;
      case "phone":
        if (!value) newErrors.phone = "Phone number is required";
        else if (!isValidPhoneNumber(value)) newErrors.phone = "Please enter a valid phone number";
        else delete newErrors.phone;
        break;
      case "date":
        if (!value) newErrors.date = "Please select a date";
        else delete newErrors.date;
        break;
      case "groupSize":
        if (!value) newErrors.groupSize = "Please select a group size";
        else delete newErrors.groupSize;
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const groupCount =
        formData.groupSize === "2-5"
          ? 3
          : formData.groupSize === "6-10"
          ? 8
          : formData.groupSize === "Private"
          ? 2
          : 1;

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        numberOfPeople: groupCount,
        groupDisplay: formData.groupSize,
        tripId: tripDetails._id || tripDetails.id || '6581f1b2c45e123456789001',
        serviceName: tripDetails.title || 'Mountain Adventure',
        travelDate: formData.date,
        totalPrice: totalPrice,
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
      toast.success('🎉 Booking confirmed! Send details via WhatsApp to connect with your guide.');

      setFormData({
        name: "",
        email: "",
        phone: "",
        groupSize: "1",
        date: "",
      });
      setTotalPrice(baseNumericPrice);
    } catch (err) {
      console.error('Booking submission error:', err);
      toast.error(err.message || 'Error submitting booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-14">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Breadcrumb / Badge */}
        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] border border-[#D4A373]/30 text-xs uppercase tracking-widest font-semibold">
            🌾 जय जोहार • EXPEDITION RESERVATION
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Trip Details Section (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EADBCE] shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative">
                <img
                  src={tripDetails.headerImage ? tripDetails.headerImage : tripDetails.image}
                  alt={tripDetails.title}
                  className="w-full h-80 object-cover"
                />
                {tripDetails.location && (
                  <div className="absolute bottom-4 left-4 bg-[#11261D]/80 backdrop-blur-sm text-[#E9C46A] text-xs font-bold px-3 py-1.5 rounded-full border border-[#D4A373]/30 flex items-center gap-1.5">
                    <span>📍</span>
                    <span>{tripDetails.location}</span>
                  </div>
                )}
              </div>
              <div className="p-8 sm:p-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1B4332] leading-tight">
                  {tripDetails.title}
                </h2>
                <p className="text-base text-gray-700 mt-4 leading-relaxed">
                  {tripDetails.description}
                </p>

                {tripDetails.inclusions && (
                  <div className="mt-8 pt-6 border-t border-[#F0E5D3]">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#C84B31] mb-3">
                      Included in this Expedition
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-gray-600">
                      {tripDetails.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-[#1B4332] font-bold">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-[#FAF6F0] border-t border-[#EADBCE]">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block">Base Fare</span>
                  <span className="text-lg font-bold text-gray-700">₹{baseNumericPrice} <span className="text-xs font-normal">/ person</span></span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 uppercase tracking-wider block">Calculated Total</span>
                  <span className="text-3xl font-black text-[#C84B31]">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form Section (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EADBCE] shadow-sm p-8 sm:p-10">
            <h3 className="text-2xl font-bold font-serif text-[#1B4332] mb-2">Reserve Your Spot</h3>
            <p className="text-xs text-gray-500 mb-6">Enter your travel details below to confirm booking and connect with your tribal guide.</p>

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
                  className="w-full p-3 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] transition"
                  placeholder="e.g. Ramesh Sahu"
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
                  className="w-full p-3 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] transition"
                  placeholder="e.g. ramesh@example.com"
                />
                {errors.email && <p className="text-[#C84B31] text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone Input */}
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
                  className="w-full p-3 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] transition"
                  placeholder="e.g. +91 98765 43210"
                />
                {errors.phone && <p className="text-[#C84B31] text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Group Size Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1" htmlFor="groupSize">
                  Group Arrangement
                </label>
                <select
                  id="groupSize"
                  name="groupSize"
                  value={formData.groupSize}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] transition"
                >
                  <option value="1">Solo Explorer (1 Person)</option>
                  <option value="2-5">Small Group (2-5 Persons)</option>
                  <option value="6-10">Large Group (6-10 Persons)</option>
                  <option value="Private">Private Dedicated Guide</option>
                </select>
                {errors.groupSize && <p className="text-[#C84B31] text-xs mt-1">{errors.groupSize}</p>}
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
                  className="w-full p-3 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] transition"
                />
                {errors.date && <p className="text-[#C84B31] text-xs mt-1">{errors.date}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 bg-[#C84B31] hover:bg-[#9E321C] text-white font-bold rounded-xl shadow-lg transition-all hover:scale-[1.01] mt-2 ${
                  isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Confirming Reservation...' : 'Confirm Expedition Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* WhatsApp Booking Confirmation Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EADBCE] text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-[#1B4332]/10 text-[#1B4332] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              ✓
            </div>
            
            <h3 className="text-2xl font-bold font-serif text-[#1B4332] mb-2">Booking Confirmed!</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              <span className="text-[#C84B31] font-semibold">जय जोहार, {confirmedBooking.name}!</span> Your expedition for <span className="font-bold text-[#1B4332]">{confirmedBooking.serviceName}</span> is confirmed.
            </p>

            <div className="bg-[#FAF6F0] rounded-2xl p-4 text-left text-xs space-y-2 mb-6 border border-[#EADBCE]">
              <div className="flex justify-between text-gray-600">
                <span>Travel Date:</span>
                <span className="font-bold text-[#1B4332]">{confirmedBooking.travelDate || 'TBD'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Group Size:</span>
                <span className="font-bold text-[#1B4332]">{confirmedBooking.groupDisplay || `${confirmedBooking.numberOfPeople} Persons`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Amount:</span>
                <span className="font-extrabold text-[#C84B31] text-sm">₹{confirmedBooking.totalPrice}</span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={generateOwnerWhatsAppUrl(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition hover:scale-[1.02]"
              >
                <span>💬</span>
                <span>Send Booking to Guide on WhatsApp</span>
              </a>

              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-800 font-medium transition"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;

