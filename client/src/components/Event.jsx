import { useState, useEffect, useCallback } from 'react';
import { format, addMinutes } from 'date-fns';
import SpinnerWithIcon from './SpinnerWithIcon';
import { mockEvents } from '../data/mockData';

const EventCard = ({ event, timeLeft, onSave }) => (
  <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
    <div>
      <div className="overflow-hidden rounded-2xl mb-4 h-52">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80'}
          alt={event.eventName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#C84B31] block mb-1">
        CAMPFIRE & NIGHT EXPEDITION
      </span>
      <h3 className="text-xl font-bold font-serif text-[#1B4332] group-hover:text-[#C84B31] transition">
        {event.eventName}
      </h3>
      <p className="text-xs text-[#D4A373] font-semibold mt-1 flex items-center gap-1.5">
        <span>📅</span>
        <span>{format(new Date(event.date), 'MMMM dd, yyyy')} at {format(new Date(event.date), 'hh:mm a')}</span>
      </p>
      <p className="mt-3 text-sm text-gray-600 leading-relaxed">{event.description}</p>
      <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
        <span>📍</span>
        <span>{event.location}</span>
      </p>
    </div>

    <div className="mt-6 pt-4 border-t border-[#F0E5D3]">
      <div className="mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Countdown to Trail:</span>
        <div className="text-2xl font-black text-[#C84B31] font-mono mt-0.5">{timeLeft || 'Expedition Started'}</div>
      </div>
      <button
        onClick={() => onSave(event)}
        className="w-full py-2.5 bg-[#1B4332] hover:bg-[#11261D] text-white text-xs font-bold rounded-xl shadow transition duration-200 flex items-center justify-center gap-2"
      >
        <span>📅</span>
        <span>Add to Google / iCal</span>
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
    <div className="bg-[#FAF6F0] min-h-screen py-14 text-[#1A211D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] border border-[#D4A373]/30 text-xs uppercase tracking-widest font-semibold mb-3">
            🌾 जय जोहार • WILDERNESS CALENDAR
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-[#1B4332] mb-4">
            Upcoming Camps & Night Treks
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Stargazing camps, full-moon plateau treks, and seasonal wildlife trails across the 36 Forts of Central India.
          </p>
        </div>

        {loading && (
          <div className="py-20 flex justify-center items-center">
            <SpinnerWithIcon />
          </div>
        )}

        {error && !loading && (
          <div className="text-center p-8 bg-red-50 border border-red-200 rounded-3xl max-w-md mx-auto mb-10">
            <p className="text-sm text-[#C84B31] font-semibold">{error}</p>
            <button
              onClick={retryFetch}
              className="mt-4 px-6 py-2.5 bg-[#C84B31] text-white text-xs font-bold rounded-xl shadow hover:bg-[#9E321C] transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Upcoming Events Grid */}
        {!selectedDate && (
          <div className="mb-20">
            <h2 className="text-2xl font-bold font-serif text-[#1B4332] mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C84B31]"></span>
              Scheduled Expeditions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-[#EADBCE] text-gray-500">
                  <p className="text-3xl mb-2">🏕️</p>
                  <p className="font-semibold">No upcoming events scheduled right now.</p>
                  <p className="text-xs text-gray-400 mt-1">Check back soon for new monsoon and winter trail announcements.</p>
                </div>
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
          </div>
        )}

        {/* Selected Date View */}
        {selectedDate && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-serif text-[#1B4332]">
                Events for {format(selectedDate, 'MMMM dd, yyyy')}
              </h2>
              <button
                onClick={resetDate}
                className="text-xs text-[#C84B31] font-bold hover:underline"
              >
                View All Events →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.length === 0 ? (
                <p className="col-span-full text-center py-8 text-gray-500">No events found for this specific date.</p>
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
          </div>
        )}

        {calendarStatus && (
          <div className="fixed bottom-6 right-6 bg-[#1B4332] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D4A373] text-xs font-bold z-50 animate-in fade-in slide-in-from-bottom-2">
            ✓ Event saved to your calendar (.ics downloaded)!
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="pt-10 border-t border-[#EADBCE]">
            <h2 className="text-xl font-bold font-serif text-gray-500 mb-6">Past Campfires & Concluded Treks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 opacity-75">
              {pastEvents.map((event, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl border border-[#EADBCE] p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={event.image || 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=500&q=80'}
                      alt={event.eventName}
                      className="w-full h-44 object-cover rounded-2xl mb-4 grayscale"
                    />
                    <h3 className="text-lg font-bold font-serif text-gray-700">{event.eventName}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Concluded on {format(new Date(event.date), 'MMMM dd, yyyy')}
                    </p>
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed">{event.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>📍 {event.location}</span>
                    <span className="font-semibold text-gray-500">Concluded</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default EventPage;
