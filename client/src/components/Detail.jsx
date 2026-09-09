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
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Trip Details Section */}
        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden">
          <img
            src={tripDetails.headerImage ? tripDetails.headerImage : tripDetails.image}
            alt="Trekking Adventure"
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <div className="p-8">
            <h2 className="text-3xl font-extrabold text-gray-800">{tripDetails.title}</h2>
            <p className="text-lg text-gray-700 mt-4">{tripDetails.description}</p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800">Pricing</h3>
              <p className="text-lg text-gray-800 mt-2">Base Price: <span className="text-green-600">₹{baseNumericPrice}</span></p>
              <p className="text-lg text-gray-800 mt-2">Total Price: <span className="text-green-600">₹{totalPrice}</span></p>
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="bg-gray-50 rounded-xl shadow-lg p-8">
          <h3 className="text-3xl font-extrabold text-gray-800 mb-8">Book Your Adventure</h3>
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
            </div>

            {/* Phone Input */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
            </div>

            {/* Group Size Selector */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700" htmlFor="groupSize">
                Group Size
              </label>
              <select
                id="groupSize"
                name="groupSize"
                value={formData.groupSize}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
              >
                <option value="1">Solo</option>
                <option value="2-5">Group of 2-5</option>
                <option value="6-10">Group of 6-10</option>
                <option value="Private">Private Guide</option>
              </select>
              {errors.groupSize && <p className="text-red-500 text-sm mt-2">{errors.groupSize}</p>}
            </div>

            {/* Date Picker */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700" htmlFor="date">
                Preferred Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]} // Disable past dates
                className="w-full p-4 border-2 border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
              />
              {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-green-600 text-white py-3 rounded-lg mt-6 font-bold transition-all hover:bg-green-700 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Confirming Booking...' : 'Book Now'}
            </button>
          </form>
        </div>
      </div>

      {/* WhatsApp Booking Confirmation Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
              ✓
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Thank you, <span className="font-semibold text-gray-800">{confirmedBooking.name}</span>! Your booking for <span className="font-semibold text-emerald-700">{confirmedBooking.serviceName}</span> is saved in our system.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 text-left text-xs space-y-2 mb-6 border border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Travel Date:</span>
                <span className="font-semibold text-gray-800">{confirmedBooking.travelDate || 'TBD'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Group Size:</span>
                <span className="font-semibold text-gray-800">{confirmedBooking.groupDisplay || `${confirmedBooking.numberOfPeople} Persons`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Price:</span>
                <span className="font-bold text-emerald-600 text-sm">₹{confirmedBooking.totalPrice}</span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={generateOwnerWhatsAppUrl(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-500/20 transition hover:scale-[1.02]"
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

