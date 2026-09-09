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
          onClick={() => handleBooking(item.type, item.title)}
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
  const [bookingDetails, setBookingDetails] = useState({ name: '', email: '', serviceOrTrip: '', itemName: '' });

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

  const handleBooking = (itemType, itemName) => {
    setBookingDetails({ ...bookingDetails, serviceOrTrip: itemType, itemName: itemName });
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = () => {
    if (!bookingDetails.name || !bookingDetails.email) {
      setError("Please fill out all the fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingDetails.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Replace alert with toast notification
    toast.success(`Booking confirmed for ${bookingDetails.itemName} (${bookingDetails.serviceOrTrip}).`);

    setIsBookingModalOpen(false);
    setError(null);
  };

  const handleModalClose = () => {
    setIsBookingModalOpen(false);
    setError(null); // Reset error when modal is closed
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-2xl mb-4">Booking for {bookingDetails.itemName}</h3>
            <form>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={bookingDetails.name}
                onChange={handleChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={bookingDetails.email}
                onChange={handleChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesAndTrips;
