import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import SpinnerWithIcon from "./SpinnerWithIcon";
import { faHiking } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { mockServices } from '../data/mockData';
import { generateOwnerWhatsAppUrl } from '../utils/whatsapp';
import UpiPaymentModal from './UpiPaymentModal';

// Categories for filtering
const categories = [
  "All", "Outdoor Adventures", "Camping", "Wildlife", "Water Sports", "Cultural Tours", "Nature Tours", "Urban Tours"
];

// ItemCard Component (Memoized for performance optimization)
const ItemCard = React.memo(({ item, handleBooking }) => (
  <div className="relative bg-white rounded-2xl border border-[#EADBCE] shadow-sm hover:shadow-xl overflow-hidden hover:-translate-y-1 transition duration-300 flex flex-col justify-between group">
    <div className="relative">
      <LazyLoad height={200} offset={100}>
        <img src={item.image} alt={item.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
      </LazyLoad>
      <div className="absolute top-3 right-3 bg-[#11261D]/80 backdrop-blur-sm text-[#E9C46A] text-xs font-bold px-3 py-1 rounded-full border border-[#D4A373]/30">
        ⭐ {item.rating}
      </div>
      {item.category && (
        <div className="absolute bottom-3 left-3 bg-[#C84B31] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
          {item.category}
        </div>
      )}
    </div>
    <div className="p-6 flex flex-col flex-grow justify-between">
      <div>
        <div className="flex items-center mb-3">
          <FontAwesomeIcon icon={faHiking} className="text-[#1B4332] mr-2" size="lg" />
          <h4 className="text-xl font-bold font-serif text-[#1B4332] group-hover:text-[#C84B31] transition">{item.title}</h4>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.description}</p>
      </div>
      <div className="mt-5 pt-4 border-t border-[#F0E5D3]">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-xs text-gray-500 block">Starting from</span>
            <span className="text-xl font-extrabold text-[#C84B31]">{item.price}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 block">Duration</span>
            <span className="text-xs font-bold text-[#1B4332]">{item.duration}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
          <span>📍</span> {item.location}
        </p>
        <button
          onClick={() => handleBooking(item)}
          className="w-full py-2.5 bg-[#C84B31] hover:bg-[#9E321C] text-white font-bold rounded-xl shadow transition duration-200"
        >
          Book Expedition
        </button>
      </div>
    </div>
  </div>
));

const ServicesAndTrips = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    serviceOrTrip: '',
    itemName: '',
    tripId: '675c9a8391b1dffb0e46bdf3',
    price: 0,
    duration: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showUpiModal, setShowUpiModal] = useState(false);

  // Fetch data function with improved API binding
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL || '';
      const params = {
        search: debouncedSearchQuery,
        category: selectedCategory !== 'All' ? selectedCategory : '',
      };

      const response = await axios.get(`${apiUrl}/api/services`, { params });

      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        setItems(response.data);
      } else {
        setItems(mockServices);
      }
    } catch (err) {
      console.warn('API error or unavailable, using fallback mock services:', err.message);
      setItems(mockServices);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, selectedCategory]);

  // Debounced search query handler
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter items based on search query and category
  const filteredItems = items.filter(item => 
    (item.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) &&
    (selectedCategory === "All" || item.category === selectedCategory)
  );

  const handleBooking = (item) => {
    const rawPrice = item?.price ? String(item.price).replace(/[^0-9]/g, '') : '0';
    const numericPrice = Number(rawPrice) || 0;
    const isValidHexId = item?._id && /^[0-9a-fA-F]{24}$/.test(item._id);
    const resolvedTripId = isValidHexId ? item._id : '675c9a8391b1dffb0e46bdf3';

    setBookingDetails({
      name: '',
      email: '',
      phone: '',
      serviceOrTrip: item?.category || item?.type || 'Adventure Service',
      itemName: item?.title || 'Adventure Service',
      tripId: resolvedTripId,
      price: numericPrice,
      duration: item?.duration || '',
      location: item?.location || '',
    });
    setConfirmedBooking(null);
    setError(null);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async () => {
    if (!bookingDetails.name || !bookingDetails.email) {
      setError("Please fill out your name and email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingDetails.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const payload = {
        name: bookingDetails.name,
        email: bookingDetails.email,
        phone: bookingDetails.phone,
        numberOfPeople: 1,
        tripId: bookingDetails.tripId || '675c9a8391b1dffb0e46bdf3',
        service: bookingDetails.itemName,
        serviceName: `${bookingDetails.itemName} (${bookingDetails.serviceOrTrip || 'Service'})`,
        travelDate: new Date().toISOString().split('T')[0],
        totalPrice: bookingDetails.price || 0,
      };

      const res = await axios.post(`${baseUrl}/api/booking`, payload);
      if (res.status === 200 || res.status === 201) {
        toast.success(`Booking confirmed for ${bookingDetails.itemName}!`);
        setConfirmedBooking(payload);
        setError(null);
      }
    } catch (err) {
      console.error('Service booking error:', err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to submit booking. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsBookingModalOpen(false);
    setError(null);
    setConfirmedBooking(null);
    setShowUpiModal(false);
  };

  const handleChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const noDataFound = filteredItems.length === 0;

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] border border-[#D4A373]/40 text-xs uppercase tracking-widest font-semibold mb-3">
            🌾 जय जोहार • DANDAKARANYA EXPEDITIONS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#1B4332] mb-4">
            Explore Services & Forest Trails
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            From the misty plateaus of Saroda Dadar to the thunderous Chitrakote cascades, pick your next wilderness escape across the 36 Forts of Central India.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition duration-200 ${
                selectedCategory === category
                  ? "bg-[#C84B31] text-white shadow-md shadow-[#C84B31]/20 scale-105"
                  : "bg-white text-[#1B4332] border border-[#EADBCE] hover:bg-[#F0E5D3]"
              }`}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-10 relative max-w-md mx-auto">
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-[#EADBCE] rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] shadow-sm transition"
            placeholder="Search by location, trail, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search services and trips"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4A373] text-base" />
        </div>

        {loading && <SpinnerWithIcon />}
        {error && <div className="text-center text-[#C84B31] font-medium bg-red-50 p-4 rounded-xl max-w-md mx-auto mb-6">{error}</div>}
        {noDataFound && (
          <div className="text-center text-gray-500 py-12 bg-white rounded-2xl border border-[#EADBCE] max-w-md mx-auto p-8">
            <p className="text-3xl mb-3">🧭</p>
            <p className="font-semibold text-[#1B4332]">No expeditions found</p>
            <p className="text-xs text-gray-500 mt-1">Try searching with a different keyword or selecting "All" categories.</p>
          </div>
        )}

        {/* Expeditions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.title} item={item} handleBooking={handleBooking} />
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl border border-[#EADBCE] animate-in fade-in zoom-in duration-200">
            {confirmedBooking ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-[#1B4332]/10 text-[#1B4332] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold font-serif text-[#1B4332] mb-2">Booking Confirmed!</h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  <span className="text-[#C84B31] font-semibold">जय जोहार, {confirmedBooking.name}!</span> Your request for <span className="font-bold text-[#1B4332]">{confirmedBooking.serviceName}</span> is safely registered.
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowUpiModal(true)}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#11261D] to-[#1B4332] hover:from-[#1B4332] hover:to-[#2D6A4F] text-amber-200 font-bold rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md transition border border-amber-400/30"
                  >
                    <span>💳</span>
                    <span>Pay Token Advance via UPI QR</span>
                  </button>

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
                    type="button"
                    onClick={handleModalClose}
                    className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-800 font-medium"
                  >
                    Close & Return
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5 pb-4 border-b border-[#F0E5D3]">
                  <span className="text-[11px] font-bold text-[#C84B31] uppercase tracking-wider block mb-1">
                    EXPEDITION RESERVATION
                  </span>
                  <h3 className="text-xl font-bold font-serif text-[#1B4332]">{bookingDetails.itemName}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-2">
                    {bookingDetails.serviceOrTrip && (
                      <span className="bg-[#FAF6F0] border border-[#EADBCE] text-[#1B4332] px-2 py-0.5 rounded font-medium">
                        {bookingDetails.serviceOrTrip}
                      </span>
                    )}
                    {bookingDetails.price > 0 && (
                      <span className="font-bold text-[#C84B31]">
                        ₹{bookingDetails.price}
                      </span>
                    )}
                    {bookingDetails.location && (
                      <span>• 📍 {bookingDetails.location}</span>
                    )}
                  </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleBookingSubmit(); }}>
                  <div className="mb-3.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Ramesh Sahu"
                      value={bookingDetails.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] bg-[#FAF6F0]"
                      required
                    />
                  </div>
                  <div className="mb-3.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. ramesh@example.com"
                      value={bookingDetails.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] bg-[#FAF6F0]"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">WhatsApp / Contact Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. +91 98765 43210"
                      value={bookingDetails.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-[#EADBCE] rounded-xl text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] bg-[#FAF6F0]"
                    />
                  </div>

                  {error && <div className="text-[#C84B31] text-xs mb-3 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</div>}

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-5 py-2.5 bg-[#C84B31] hover:bg-[#9E321C] text-white rounded-xl text-xs font-bold shadow-md transition ${
                        isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Confirming...' : 'Confirm Expedition'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {showUpiModal && confirmedBooking && (
        <UpiPaymentModal
          booking={confirmedBooking}
          onClose={() => setShowUpiModal(false)}
        />
      )}
    </div>
  );
};

export default ServicesAndTrips;
