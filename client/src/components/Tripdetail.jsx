import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TripDetailPage = () => {
  const { id } = useParams(); // Get the 'id' from the URL params
  const [tripData, setTripData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trip data based on the 'id' from the URL
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gettrip/${id}`); // Fetch based on the trip id
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (!data) {
          throw new Error('No data found for this trip');
        }
        setTripData(data); // Set the fetched trip data
      } catch (err) {
        setError(err.message); // Set the error if fetch fails
      } finally {
        setIsLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchTripData();
  }, [id]); // Fetch again whenever 'id' changes

  // Loading state
  if (isLoading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  // Main content
  return (
    <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-white text-gray-800">
      {/* Header Section */}
      <section className="relative h-[30vh]">
        <img
          src={tripData.headerImage} // Dynamic image from API response
          alt="Trip"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10 p-8 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 mb-4">
            {tripData.title} {/* Dynamic title from API */}
          </h1>
          <p className="text-xl sm:text-2xl mb-6 text-gray-700">
            {tripData.description} {/* Dynamic description from API */}
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Trip Details</h2>
            <p className="text-lg leading-relaxed text-gray-800">
              {tripData.details || "Details coming soon."} {/* Fallback message if no details */}
            </p>
            <ul className="mt-6 space-y-4 text-lg text-gray-800">
              <li><strong>Duration:</strong> {tripData.duration || "N/A"} Days</li>
              <li><strong>Location:</strong> {tripData.location || "N/A"}</li>
              <li><strong>Difficulty:</strong> {tripData.difficulty || "N/A"}</li>
              <li><strong>Group Size:</strong> Max {tripData.maxGroupSize || "N/A"} People</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-4">What’s Included?</h2>
            <ul className="text-lg leading-loose text-gray-800">
              {tripData.inclusions.length > 0 ? (
                tripData.inclusions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>No inclusions available</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Action Section */}
      <section className="bg-gray-100 text-gray-800 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-6">Ready to embark on the adventure?</h2>
        <a href={tripData.bookingLink} target="_blank" rel="noopener noreferrer">
          <button className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-bold shadow-md hover:bg-blue-500 transition">
            Book Your Trip
          </button>
        </a>
      </section>
    </div>
  );
};

export default TripDetailPage;
