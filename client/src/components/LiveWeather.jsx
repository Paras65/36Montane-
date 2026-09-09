import React, { useState, useEffect, useCallback } from 'react';
import { FaTemperatureHigh, FaWind, FaTint, FaCloudRain, FaSyncAlt, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

export const CHHATTISGARH_TRAIL_LOCATIONS = [
  {
    id: 'saroda-dadar',
    name: 'Saroda Dadar Plateau',
    shortName: 'Saroda Dadar',
    district: 'Kawardha',
    altitude: '850m',
    lat: 22.01,
    lon: 81.25,
    tag: 'Base Camp & Sunset Ridge',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'chitrakote',
    name: 'Chitrakote Falls',
    shortName: 'Chitrakote',
    district: 'Bastar',
    altitude: '580m',
    lat: 19.20,
    lon: 81.70,
    tag: 'Niagara of India & Gorge',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'kanger-valley',
    name: 'Kanger Valley & Caves',
    shortName: 'Kanger Valley',
    district: 'Jagdalpur',
    altitude: '630m',
    lat: 18.87,
    lon: 81.87,
    tag: 'Sal Rainforest & Caverns',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mainpat',
    name: 'Mainpat Highlands',
    shortName: 'Mainpat',
    district: 'Surguja',
    altitude: '1,100m',
    lat: 22.82,
    lon: 83.28,
    tag: 'Shimla of Chhattisgarh',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bhoramdev',
    name: 'Bhoramdev Valley',
    shortName: 'Bhoramdev',
    district: 'Kawardha',
    altitude: '720m',
    lat: 22.12,
    lon: 81.16,
    tag: '11th-Century Heritage Sanctuary',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f4439c27?auto=format&fit=crop&w=600&q=80'
  }
];

// WMO Weather Interpretation Codes
export function getWeatherInfo(code) {
  switch (code) {
    case 0:
      return { label: 'Clear Sky', icon: '☀️', advisory: 'Prime trekking weather with crystal clear mountain vistas.' };
    case 1:
      return { label: 'Mainly Clear', icon: '🌤️', advisory: 'Pleasant and sunny. Perfect for ridgeline exploration.' };
    case 2:
      return { label: 'Partly Cloudy', icon: '⛅', advisory: 'Comfortable hill breeze and mild shade along the trail.' };
    case 3:
      return { label: 'Overcast', icon: '☁️', advisory: 'Cool overcast canopy. Excellent for long-distance hiking.' };
    case 45:
    case 48:
      return { label: 'Mountain Mist / Fog', icon: '🌫️', advisory: 'Misty plateau views. Carry headlights for early morning trails.' };
    case 51:
    case 53:
    case 55:
      return { label: 'Light Drizzle', icon: '🌦️', advisory: 'Gentle forest drizzle. Fresh scent of wet Sal leaves.' };
    case 61:
    case 63:
    case 65:
      return { label: 'Rain Showers', icon: '🌧️', advisory: 'Active rainfall. Waterfalls roaring at full glory! Poncho recommended.' };
    case 80:
    case 81:
    case 82:
      return { label: 'Scattered Showers', icon: '🌦️', advisory: 'Passing showers. Pack waterproof covers for backpack and cameras.' };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', icon: '⛈️', advisory: 'Wilderness storm. Campfire activities moved to sheltered basecamp.' };
    default:
      return { label: 'Pleasant Weather', icon: '🌤️', advisory: 'Great day to be outdoors in Dandakaranya.' };
  }
}

const LiveWeather = ({ isCompact = false }) => {
  const [selectedLocation, setSelectedLocation] = useState(CHHATTISGARH_TRAIL_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (loc) => {
    try {
      setLoading(true);
      setError(null);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather service unavailable');
      const data = await res.json();
      setWeatherData(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Weather fetch error:', err);
      setError('Unable to load live weather. Showing estimated trail conditions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(selectedLocation);
  }, [selectedLocation, fetchWeather]);

  const current = weatherData?.current;
  const weatherInfo = current ? getWeatherInfo(current.weather_code) : { label: 'Pleasant', icon: '🌤️', advisory: 'Good trail weather' };

  // Temperature advisory tweak
  let tempAdvisory = weatherInfo.advisory;
  if (current) {
    if (current.temperature_2m < 20) {
      tempAdvisory += ' Chilly evening expected; pack a warm fleece jacket for the campfire.';
    } else if (current.temperature_2m > 32) {
      tempAdvisory += ' Warm daytime sunshine; keep a 2L hydration bottle handy.';
    }
  }

  const whatsappInquiryUrl = `https://wa.me/918770281696?text=${encodeURIComponent(
    `Jai Johar! What are the current trail and camping conditions at ${selectedLocation.name} right now?`
  )}`;

  // Compact Mode (for Navbar or mini widget)
  if (isCompact) {
    return (
      <a
        href="/home#live-weather"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1B4332]/90 hover:bg-[#2D6A4F] border border-[#D4A373]/40 text-[#FAF6F0] text-xs transition duration-200 cursor-pointer shadow-sm hover:scale-105"
        title="View live mountain weather radar"
      >
        <span className="text-sm">{weatherInfo.icon}</span>
        <span className="font-semibold text-[#E9C46A]">{selectedLocation.shortName}</span>
        <span className="font-mono font-bold text-white">{current ? `${Math.round(current.temperature_2m)}°C` : '...'}</span>
      </a>
    );
  }

  return (
    <section id="live-weather" className="py-16 bg-gradient-to-b from-[#11261D] to-[#0D2319] text-[#FAF6F0] relative overflow-hidden border-y border-[#2D6A4F]/40 shadow-2xl">
      {/* Background Ambient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C84B31]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D6A4F]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C84B31]/20 border border-[#D4A373]/40 text-[#E9C46A] text-xs uppercase tracking-widest font-semibold mb-3">
            <span>📡 LIVE SATELLITE RADAR • DANDAKARANYA WEATHER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-[#FAF6F0]">
            Live Trail Weather & Mountain Forecast
          </h2>
          <p className="text-sm text-[#D8CFBC] mt-2">
            Real-time atmospheric readings across our key basecamps, waterfalls, and plateau ridges in Chhattisgarh.
          </p>
        </div>

        {/* Location Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {CHHATTISGARH_TRAIL_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#C84B31] text-white shadow-lg shadow-[#C84B31]/30 border border-[#D4A373] scale-105'
                    : 'bg-[#1B4332]/60 hover:bg-[#1B4332] text-[#D8CFBC] border border-[#2D6A4F]/50'
                }`}
              >
                <span>📍</span>
                <span>{loc.shortName}</span>
                <span className="text-[10px] opacity-75 hidden md:inline">({loc.altitude})</span>
              </button>
            );
          })}
        </div>

        {/* Main Weather Card */}
        <div className="bg-[#11261D]/90 backdrop-blur-md rounded-3xl border border-[#D4A373]/40 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Location, Temp & Condition (5 cols) */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#2D6A4F]/60 pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A373] flex items-center gap-1.5">
                  <FaMapMarkerAlt />
                  {selectedLocation.district} District, Chhattisgarh
                </span>
                {lastUpdated && (
                  <button
                    onClick={() => fetchWeather(selectedLocation)}
                    className="text-[11px] text-gray-400 hover:text-[#E9C46A] flex items-center gap-1 transition"
                    title="Refresh weather"
                  >
                    <FaSyncAlt className={loading ? 'animate-spin' : ''} />
                    <span>Live {lastUpdated}</span>
                  </button>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
                {selectedLocation.name}
              </h3>
              <p className="text-xs text-[#E9C46A] font-medium mt-0.5">
                {selectedLocation.tag} • Altitude {selectedLocation.altitude}
              </p>

              {/* Big Temp Display */}
              <div className="mt-6 flex items-baseline gap-4">
                <span className="text-5xl sm:text-6xl font-black font-serif text-[#FAF6F0] tracking-tight">
                  {current ? `${Math.round(current.temperature_2m)}°` : '--°'}
                </span>
                <div>
                  <div className="flex items-center gap-2 text-xl font-bold text-[#E9C46A]">
                    <span>{weatherInfo.icon}</span>
                    <span>{weatherInfo.label}</span>
                  </div>
                  <span className="text-xs text-gray-400 block mt-0.5">
                    Feels like {current ? `${Math.round(current.apparent_temperature)}°C` : '--'}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Col: Atmospheric Metrics (4 cols) */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="bg-[#1B4332]/50 p-4 rounded-2xl border border-[#2D6A4F]/40">
                <div className="flex items-center gap-2 text-[#D4A373] text-xs uppercase tracking-wider font-semibold mb-1">
                  <FaTint />
                  <span>Humidity</span>
                </div>
                <span className="text-xl font-bold text-white">
                  {current ? `${current.relative_humidity_2m}%` : '--'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Relative moisture</span>
              </div>

              <div className="bg-[#1B4332]/50 p-4 rounded-2xl border border-[#2D6A4F]/40">
                <div className="flex items-center gap-2 text-[#D4A373] text-xs uppercase tracking-wider font-semibold mb-1">
                  <FaWind />
                  <span>Wind Speed</span>
                </div>
                <span className="text-xl font-bold text-white">
                  {current ? `${current.wind_speed_10m} km/h` : '--'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Hilltop breeze</span>
              </div>

              <div className="bg-[#1B4332]/50 p-4 rounded-2xl border border-[#2D6A4F]/40">
                <div className="flex items-center gap-2 text-[#D4A373] text-xs uppercase tracking-wider font-semibold mb-1">
                  <FaCloudRain />
                  <span>Precipitation</span>
                </div>
                <span className="text-xl font-bold text-white">
                  {current ? `${current.precipitation} mm` : '0 mm'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Rainfall rate</span>
              </div>

              <div className="bg-[#1B4332]/50 p-4 rounded-2xl border border-[#2D6A4F]/40">
                <div className="flex items-center gap-2 text-[#D4A373] text-xs uppercase tracking-wider font-semibold mb-1">
                  <FaTemperatureHigh />
                  <span>Day Range</span>
                </div>
                <span className="text-xl font-bold text-white">
                  {weatherData?.daily
                    ? `${Math.round(weatherData.daily.temperature_2m_min[0])}° - ${Math.round(weatherData.daily.temperature_2m_max[0])}°`
                    : '--'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Min - Max</span>
              </div>
            </div>

            {/* Right Col: 3-Day Forecast & WhatsApp (3 cols) */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-4">
              <div className="bg-[#0B1D15] p-4 rounded-2xl border border-[#2D6A4F]/40">
                <span className="text-[11px] uppercase tracking-wider text-[#D4A373] font-bold block mb-2.5">
                  3-Day Outlook:
                </span>
                <div className="space-y-2 text-xs">
                  {weatherData?.daily?.time.slice(0, 3).map((dateStr, idx) => {
                    const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : new Date(dateStr).toLocaleDateString([], { weekday: 'short' });
                    const code = weatherData.daily.weather_code[idx];
                    const info = getWeatherInfo(code);
                    const maxT = Math.round(weatherData.daily.temperature_2m_max[idx]);
                    const minT = Math.round(weatherData.daily.temperature_2m_min[idx]);

                    return (
                      <div key={dateStr} className="flex items-center justify-between text-gray-300">
                        <span className="w-16 font-medium">{dayName}</span>
                        <span>{info.icon}</span>
                        <span className="font-mono text-white">{maxT}° / {minT}°</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition hover:scale-105"
              >
                <FaWhatsapp className="text-base" />
                <span>Ask Guide About Trail Conditions</span>
              </a>
            </div>
          </div>

          {/* Bottom Advisory Banner */}
          <div className="mt-8 pt-5 border-t border-[#2D6A4F]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="text-base shrink-0">🧭</span>
              <p className="text-[#FAF6F0] leading-relaxed">
                <strong className="text-[#E9C46A]">Trekker Advisory:</strong> {tempAdvisory}
              </p>
            </div>
            <span className="shrink-0 text-[11px] text-gray-400 font-mono">
              Live data from Open-Meteo satellite feed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveWeather;
