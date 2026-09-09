import { useState, useEffect } from 'react';
import '../style/CustomTripSection.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSuitcase,
  faTimesCircle,
  faMapMarkerAlt,
  faCheckCircle,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';

const CustomTripSection = () => {
  const [destination, setDestination] = useState('');
  const [tripStartDate, setTripStartDate] = useState('');
  const [tripEndDate, setTripEndDate] = useState('');
  const [tripDuration, setTripDuration] = useState(0);
  const [guestCount, setGuestCount] = useState(1);
  const [activities, setActivities] = useState({});
  const [additionalRequests, setAdditionalRequests] = useState('');
  const [showModal, setShowModal] = useState(false);

  const destinations = [
    { name: 'Bhoramdev', activities: ['Temple Visit', 'Nature Walk', 'Trekking', 'Wildlife Watching', 'Bonfire'] },
    { name: 'Kanha National Park', activities: ['Safari', 'Jungle Trekking', 'Wildlife Watching', 'Bird Watching'] },
    { name: 'Kullu Valley', activities: ['Trekking', 'Camping', 'Local Culture Tour', 'Rafting'] },
  ];

  const handleActivityChange = (activity) => {
    setActivities((prevActivities) => {
      const updatedActivities = { ...prevActivities };
      updatedActivities[activity] = !updatedActivities[activity];
      return updatedActivities;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination) {
      toast.error('Please select a destination.');
      return;
    }
    if (guestCount < 1) {
      toast.error('Guest count must be at least 1.');
      return;
    }
    if (!tripStartDate || !tripEndDate) {
      toast.error('Please select both start and end dates.');
      return;
    }

    if (new Date(tripEndDate) < new Date(tripStartDate)) {
      toast.error("End date cannot be earlier than the start date.");
      return;
    }

    const selectedActivities = Object.keys(activities)
      .filter((activity) => activities[activity])
      .join(', ');

    toast.success(`Trip booked to ${destination} from ${tripStartDate} to ${tripEndDate} for ${guestCount} guests.\nSelected Activities: ${selectedActivities}\nAdditional Requests: ${additionalRequests}`);
    
    resetForm();
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    setActivities({}); // Reset activities when destination changes
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false); // Close modal if the overlay is clicked
      resetForm(); // Reset form fields when modal closes
    }
  };

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setTripStartDate(selectedStartDate);
    setTripEndDate(''); // Reset end date if the start date changes
    setTripDuration(0); // Reset duration if the start date changes
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    setTripEndDate(selectedEndDate);

    if (tripStartDate) {
      const startDate = new Date(tripStartDate);
      const endDate = new Date(selectedEndDate);
      const duration = Math.ceil((endDate - startDate) / (1000 * 3600 * 24)); // Calculate days between dates
      setTripDuration(duration);
    }
  };

  const resetForm = () => {
    setDestination('');
    setTripStartDate('');
    setTripEndDate('');
    setTripDuration(0);
    setGuestCount(1);
    setActivities({});
    setAdditionalRequests('');
  };

  useEffect(() => {
    if (showModal) {
      document.querySelector('#destination').focus();
    }
  }, [showModal]);

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => setShowModal(true)}
        className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all ease-in-out duration-300"
        aria-label="Book your trip now"
      >
        <FontAwesomeIcon icon={faSuitcase} className="mr-2" /> Customize Your Trip
      </button>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={handleOverlayClick}
          aria-hidden={!showModal}
        >
          <div
            className="modal-content"
            id="modalContent"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="modalTitle"
            aria-describedby="modalDescription"
          >
            <button onClick={() => setShowModal(false)} aria-label="Close modal" className="close-button">
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>

            <h1 id="modalTitle" className="text-4xl font-semibold text-center text-gray-900 mb-6">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Customize Your Dream Trip
            </h1>
            <p id="modalDescription" className="text-lg text-gray-600 text-center mb-6">
              Fill out the form to book your customized trip, including your destination, trip dates, activities, and more.
            </p>

            <form onSubmit={handleSubmit} className="form-card shadow-lg rounded-lg p-8 bg-white">
              <div className="form-field">
                <label className="label">Destination</label>
                <select
                  id="destination"
                  value={destination}
                  onChange={handleDestinationChange}
                  className="select"
                  required
                  autoFocus
                >
                  <option value="">Select Destination</option>
                  {destinations.map((dest, index) => (
                    <option key={index} value={dest.name}>
                      {dest.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="label">Trip Start Date</label>
                <input
                  type="date"
                  value={tripStartDate}
                  onChange={handleStartDateChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-field">
                <label className="label">Trip End Date</label>
                <input
                  type="date"
                  value={tripEndDate}
                  onChange={handleEndDateChange}
                  className="input"
                  required
                />
              </div>

              {tripDuration > 0 && (
                <div className="form-field">
                  <label className="label">Trip Duration</label>
                  <input
                    type="text"
                    value={`${tripDuration} days`}
                    readOnly
                    className="input"
                  />
                </div>
              )}

              <div className="form-field">
                <label className="label">Guests</label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="input"
                  min="1"
                  required
                />
              </div>

              <div className="form-field">
                <label className="label">Select Activities</label>
                <div className="activities-list">
                  {destination &&
                    destinations
                      .find((dest) => dest.name === destination)
                      ?.activities.map((activity) => (
                        <div key={activity} className="activity-item">
                          <input
                            type="checkbox"
                            id={activity}
                            checked={activities[activity] || false}
                            onChange={() => handleActivityChange(activity)}
                            className="checkbox"
                          />
                          <label htmlFor={activity} className="activity-label">
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-600" /> {activity}
                          </label>
                        </div>
                      ))}
                </div>
              </div>

              <div className="form-field">
                <label className="label">Additional Requests</label>
                <textarea
                  value={additionalRequests}
                  onChange={(e) => setAdditionalRequests(e.target.value)}
                  className="textarea"
                  placeholder="Enter any additional requests or special needs here..."
                />
              </div>

              <button type="submit" className="submit-button bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full py-3 px-6 mt-6 hover:from-yellow-600 hover:to-yellow-400 transition-all duration-300">
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> Book Trip
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomTripSection;
