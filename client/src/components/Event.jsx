import { useState, useEffect, useCallback } from 'react';
import { format, addMinutes } from 'date-fns';
import SpinnerWithIcon from './SpinnerWithIcon';
import { mockEvents } from '../data/mockData';

const EventCard = ({ event, timeLeft, onSave }) => (
  <div className="bg-white text-black p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <img
      src={event.image || 'https://picsum.photos/500/300'}
      alt={event.eventName}
      className="w-full h-48 object-cover rounded-lg mb-4"
    />
    <h3 className="text-xl font-semibold">{event.eventName}</h3>
    <p className="text-sm text-gray-500">
      {format(new Date(event.date), 'MM/dd/yyyy')} at {format(new Date(event.date), 'hh:mm a')}
    </p>
    <p className="mt-2 text-gray-600">{event.description}</p>
    <p className="mt-2 text-sm text-gray-500">Location: {event.location}</p>
    <div className="mt-4">
      <h4 className="text-lg font-bold text-gray-700">Time Left:</h4>
      <div className="text-3xl font-semibold text-indigo-600">{timeLeft || 'Event Started'}</div>
    </div>
    <div className="mt-4">
      <button
        onClick={() => onSave(event)}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Save to Calendar
      </button>
    </div>
  </div>
);

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarStatus, setCalendarStatus] = useState(''); // For save to calendar status

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/events`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setEvents(Array.isArray(data) && data.length > 0 ? data : mockEvents);
    } catch (err) {
      console.warn('Error fetching events, using mock fallback:', err);
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const updateTimeLeft = () => {
      const updatedTimeLeft = {};
      events.forEach((event) => {
        const eventTime = new Date(event.date);
        const now = new Date();
        const timeDiff = eventTime - now;

        if (timeDiff <= 0) {
          updatedTimeLeft[event.eventName] = 'Event Started';
        } else {
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          updatedTimeLeft[event.eventName] = `${hours}h ${minutes}m ${seconds}s`;
        }
      });

      setTimeLeft((prevTimeLeft) => {
        if (JSON.stringify(prevTimeLeft) !== JSON.stringify(updatedTimeLeft)) {
          return updatedTimeLeft;
        }
        return prevTimeLeft;
      });
    };

    const interval = setInterval(updateTimeLeft, 1000);
    updateTimeLeft();

    return () => clearInterval(interval);
  }, [events]);

  const today = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.date) >= today);
  const pastEvents = events.filter((event) => new Date(event.date) < today);

  const isSameDate = (eventDate, selectedDate) => {
    const eventDateObj = new Date(eventDate);
    const selectedDateObj = new Date(selectedDate);
    return eventDateObj.toDateString() === selectedDateObj.toDateString();
  };

  const filteredEvents = selectedDate
    ? events.filter((event) => isSameDate(event.date, selectedDate))
    : upcomingEvents;

  const saveToCalendar = (event) => {
    const { eventName, date, description, location, duration } = event;
    const eventDate = new Date(date);
    const durationMins = Number(duration) || 60;
    const endDate = addMinutes(eventDate, durationMins);

    const formattedStartDate = format(eventDate, "yyyyMMdd'T'HHmmss");
    const formattedEndDate = format(endDate, "yyyyMMdd'T'HHmmss");
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventName}
DTSTART:${formattedStartDate}Z
DTEND:${formattedEndDate}Z
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `${eventName}_${format(eventDate, 'MM-dd-yyyy')}.ics`;
    
    link.click();
    URL.revokeObjectURL(url);

    setCalendarStatus('success');
    setTimeout(() => setCalendarStatus(''), 3000);  // Reset status after 3 seconds
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const resetDate = () => {
    setSelectedDate(null);
  };

  const retryFetch = () => {
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex flex-col">
      <header className="bg-transparent shadow-lg p-6">
        <h1 className="text-4xl font-extrabold text-center">Upcoming Events</h1>
      </header>

      <main className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row justify-between gap-8">

  {/* Event List Section */}
  <section className="w-full md:w-2/3">
    {loading && (
      <div className="flex justify-center items-center h-full">
        <SpinnerWithIcon />
      </div>
    )}

    {error && !loading && (
      <div className="error-container text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={retryFetch}
          className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )}

    {!selectedDate && (
      <>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.length === 0 ? (
            <p className="text-center text-gray-600">No upcoming events.</p>
          ) : (
            upcomingEvents.map((event, index) => (
              <EventCard
                key={event.eventName || index}
                event={event}
                timeLeft={timeLeft[event.eventName]}
                onSave={saveToCalendar}
              />
            ))
          )}
        </div>
      </>
    )}

    {selectedDate && (
      <>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Events for {format(selectedDate, 'MM/dd/yyyy')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length === 0 ? (
            <p className="text-center text-gray-600">No events for this date.</p>
          ) : (
            filteredEvents.map((event, index) => (
              <EventCard
                key={event.eventName || index}
                event={event}
                timeLeft={timeLeft[event.eventName]}
                onSave={saveToCalendar}
              />
            ))
          )}
        </div>
      </>
    )}

    {calendarStatus && (
      <div className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg transition duration-300 transform hover:scale-105">
        Event saved to calendar!
      </div>
    )}

    <section className="mt-16">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pastEvents.length === 0 ? (
          <p className="text-center text-gray-600">No past events.</p>
        ) : (
          pastEvents.map((event, index) => (
            <div
              key={index}
              className="bg-gray-200 text-black p-6 rounded-lg shadow-lg"
            >
              <img
                src={event.image || 'https://picsum.photos/500/300'}
                alt={event.eventName}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{event.eventName}</h3>
              <p className="text-sm text-gray-500">
                {format(new Date(event.date), 'MM/dd/yyyy')} at {format(new Date(event.date), 'hh:mm a')}
              </p>
              <p className="mt-2 text-gray-600">{event.description}</p>
              <p className="mt-2 text-sm text-gray-500">Location: {event.location}</p>
              <div className="mt-4">
                <h4 className="text-lg font-bold text-gray-700">Event Finished</h4>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  </section>
</main>

    </div>
  );
};

export default EventPage;
