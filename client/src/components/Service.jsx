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

// Categories for filtering
const categories = [
  "All", "Outdoor Adventures", "Camping", "Wildlife", "Water Sports", "Cultural Tours", "Nature Tours", "Urban Tours"
];

// ItemCard Component (Memoized for performance optimization)
const ItemCard = React.memo(({ item, handleBooking }) => (
  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition duration-300 flex flex-col justify-between">
    <LazyLoad height={200} offset={100}>
      <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
    </LazyLoad>
    <div className="p-6 flex flex-col flex-grow justify-between">
      <div>
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faHiking} className="text-green-600 mr-2" size="lg" />
          <h4 className="text-xl font-semibold text-gray-800">{item.title}</h4>
        </div>
        <p className="text-sm text-gray-700">{item.description}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-green-600">Price: {item.price}</p>
        <p className="text-sm text-gray-500">Duration: {item.duration}</p>
        <p className="text-sm text-gray-500">Location: {item.location}</p>
        <p className="mt-1 text-sm text-yellow-500">Rating: {item.rating} ⭐</p>
        <button
          onClick={() => handleBooking(item)}
          className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          Book Now
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
  };

  const handleChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const noDataFound = filteredItems.length === 0;

  return (
    <div className="container mx-auto px-4 py-10 bg-green-50">
      <h2 className="text-4xl font-semibold text-black text-center mb-8">Explore Services and Trips in Chhattisgarh</h2>

      <div className="mb-8 text-center">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 mx-2 text-lg font-semibold ${selectedCategory === category ? "bg-green-600 text-white" : "bg-green-200 text-green-800"} rounded-lg hover:bg-green-500 hover:text-white transition duration-300`}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mb-8 relative max-w-md mx-auto">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-green-500 rounded-lg"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search services and trips"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      {loading && <SpinnerWithIcon />}
      {error && <div className="text-center text-red-600">{error}</div>}
      {noDataFound && <div className="text-center text-gray-500">No services or trips found for the selected category. Try different keywords or clear filters.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item.title} item={item} handleBooking={handleBooking} />
        ))}
      </div>

      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl">
            {confirmedBooking ? (
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                <p className="text-sm text-gray-600 mb-5">
                  Thank you, <span className="font-semibold text-gray-800">{confirmedBooking.name}</span>! Your request for <span className="font-semibold text-green-700">{confirmedBooking.serviceName}</span> has been received.
                </p>

                <div className="space-y-3">
                  <a
                    href={generateOwnerWhatsAppUrl(confirmedBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition hover:scale-[1.02]"
                  >
                    <span>💬</span>
                    <span>Send Booking to Guide on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="w-full py-2 text-xs text-gray-500 hover:text-gray-800 font-medium"
                  >
                    Close & Return
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4 pb-3 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800">{bookingDetails.itemName}</h3>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                    {bookingDetails.serviceOrTrip && (
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">
                        {bookingDetails.serviceOrTrip}
                      </span>
                    )}
                    {bookingDetails.price > 0 && (
                      <span className="font-semibold text-green-700">
                        ₹{bookingDetails.price}
                      </span>
                    )}
                    {bookingDetails.location && (
                      <span>• {bookingDetails.location}</span>
                    )}
                  </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleBookingSubmit(); }}>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={bookingDetails.name}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={bookingDetails.email}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. +91 98765 43210"
                      value={bookingDetails.phone}
                      onChange={handleChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {error && <div className="text-red-600 text-xs mb-3 font-medium bg-red-50 p-2 rounded">{error}</div>}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition ${
                        isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesAndTrips;
