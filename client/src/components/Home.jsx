import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FAQComponent from "./Faq";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpinnerWithIcon from "./SpinnerWithIcon";
import {
  faMapMarkerAlt,
  faMountain,
  faClock,
  faUsers,
  faRupeeSign,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import CustomTripSection from "./CustomTripSelection";
import { mockFeaturedTrips, mockServices } from "../data/mockData";

// InfoWithIcon component to reduce repetition
const InfoWithIcon = ({ icon, label, value }) => (
  <p>
    <FontAwesomeIcon icon={icon} className="mr-2 text-gray-600 text-base" />
    <strong>{label}:</strong> {value}
  </p>
);

const Homepage = () => {
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState({
    title: "Explore the Great Outdoors",
    description:
      "Join us for unforgettable camping and trekking experiences across breathtaking landscapes.",
    imageUrl:
      "https://picsum.photos/1500/800?text=Premium+Camping+and+Trekking",
    buttonText: "Book Your Adventure",
    buttonLink: "/detail",
  });
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [trekkingServices, setTrekkingServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const tripsResponse = await fetch(`${baseUrl}/api/featuredtrips`);
      const servicesResponse = await fetch(`${baseUrl}/api/services`);

      if (tripsResponse.ok && servicesResponse.ok) {
        const [tripsData, servicesData] = await Promise.all([
          tripsResponse.json(),
          servicesResponse.json(),
        ]);
        setFeaturedTrips(tripsData && tripsData.length > 0 ? tripsData : mockFeaturedTrips);
        setTrekkingServices(servicesData && servicesData.length > 0 ? servicesData : mockServices);
      } else {
        setFeaturedTrips(mockFeaturedTrips);
        setTrekkingServices(mockServices);
      }
    } catch (err) {
      console.warn("API unavailable, using fallback mock data:", err);
      setFeaturedTrips(mockFeaturedTrips);
      setTrekkingServices(mockServices);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e, bookingData) => {
    e.preventDefault();
    navigate("/detail", {
      state: bookingData,
    });
  };

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return <SpinnerWithIcon />;
  }

  // Show error message if there was an issue during the data fetch
  if (error) {
    return (
      <div className="error-message text-center text-red-500">
        <h2 className="text-2xl font-semibold">Oops! Something went wrong.</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 font-serif">
      {/* Hero Section */}
      {heroData && (
        <section
          className="relative bg-cover bg-center h-[70vh]"
          style={{ backgroundImage: `url(${heroData.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black opacity-30" aria-hidden="true"></div>
          <div className="container mx-auto text-center text-white relative z-10 py-32">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gradient bg-clip-text text-transparent mb-6">
              {heroData.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">{heroData.description}</p>
            
              <button
               onClick={(e) => handleSubmit(e, {
                title: "Default Adventure",
                description: "A unique outdoor adventure you don't want to miss!",
                image: "https://picsum.photos/1500/800",
                price: "5000",
                duration: "3",
                location: "Himalayas",
                difficulty: "Medium",
                maxGroupSize: 12,
              })}
                className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all ease-in-out duration-300"
                aria-label="Book your adventure"
              >
                {heroData.buttonText}
              </button>
           
          </div>
        </section>
      )}

      {/* Featured Trips Section */}
      {featuredTrips.length > 0 ? (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Featured Trips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredTrips.map((trip) => (
                <div key={trip._id} className="relative border border-gray-300 rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
                  <div className="relative overflow-hidden">
                    <img
                      className="w-full h-[20vh] object-cover transform group-hover:scale-110 transition-transform duration-500"
                      src={trip.headerImage}
                      alt={trip.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-left">{trip.title}</h3>
                    <p className="text-gray-600 text-lg mb-4 text-left">{trip.description}</p>
                    <div className="mt-4 text-sm text-gray-500 text-left">
                      <InfoWithIcon icon={faMapMarkerAlt} label="Location" value={trip.location} />
                      <InfoWithIcon icon={faMountain} label="Difficulty" value={trip.difficulty} />
                      <InfoWithIcon icon={faClock} label="Duration" value={`${trip.duration} days`} />
                      <InfoWithIcon icon={faUsers} label="Group Size" value={`Max ${trip.maxGroupSize} people`} />
                    </div>
                    <div className="mt-6 text-left">
                      <p className="text-xl font-semibold text-gray-900">
                        <FontAwesomeIcon icon={faRupeeSign} className="mr-2 text-base" />
                        ₹{trip.price}
                      </p>
                      <button
                        onClick={(e) => handleSubmit(e, trip)}  // Handle trip booking
                        className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md transform hover:scale-105 hover:shadow-xl transition duration-300"
                        aria-label={`Book ${trip.title}`}
                      >
                        <FontAwesomeIcon icon={faBookmark} className="mr-2 text-base" />
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="text-center text-gray-500 py-20">
          No featured trips available at the moment.
        </div>
      )}

      {/* Trekking Services Section */}
      {trekkingServices.length > 0 ? (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Trekking Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {trekkingServices.map((service) => (
          <div key={service._id} className="relative border border-gray-300 rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
            <div className="relative overflow-hidden">
              <img
                className="w-full h-[20vh] object-cover transform group-hover:scale-110 transition-transform duration-500"
                src={service.image || "https://via.placeholder.com/400x250"}  // Default image if none provided
                alt={service.title}
                loading="lazy"
              />
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-left">{service.title}</h3>
              <p className="text-gray-600 text-lg mb-4 text-left">{service.description}</p>
              <div className="mt-4 text-sm text-gray-500 text-left">
                <InfoWithIcon icon={faMapMarkerAlt} label="Location" value={service.location} />
                <InfoWithIcon icon={faMountain} label="Difficulty" value="Not Available" />
                <InfoWithIcon icon={faClock} label="Duration" value={service.duration} />
              </div>
              <div className="mt-6 text-left">
                <p className="text-xl font-semibold text-gray-900">
                  <FontAwesomeIcon icon={faRupeeSign} className="mr-2 text-base" />
                  ₹{service.price}
                </p>
                <button
                  onClick={(e) => handleSubmit(e, service)}  // Handle service booking
                  className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md transform hover:scale-105 hover:shadow-xl transition duration-300"
                  aria-label={`Book ${service.title}`}
                >
                  <FontAwesomeIcon icon={faBookmark} className="mr-2 text-base" />
                  Book Now
                </button>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs py-1 px-3 rounded-full shadow-md">
              {service.rating} ⭐
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
) : (
  <div className="text-center text-gray-500 py-20">
    No trekking services available at the moment.
  </div>
)}

      {/* Custom Trip Section */}
      <section className="py-20 bg-gray-800 text-gray-200">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-6 text-white">Ready to Book Your Adventure?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-400">
            Choose your next adventure from the exclusive services above and start your journey towards the most scenic destinations.
          </p>
          <CustomTripSection />
        </div>
      </section>

      {/* FAQ Section */}
      <div className="bg-gray-100 flex items-center justify-center py-10">
        <FAQComponent />
      </div>
    </div>
  );
};

export default Homepage;