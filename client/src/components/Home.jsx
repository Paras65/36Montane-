import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  faCompass,
  faCampground,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import CustomTripSection from "./CustomTripSelection";
import LiveWeather from "./LiveWeather";
import { mockFeaturedTrips, mockServices } from "../data/mockData";
import { getOwnerWhatsAppNumber } from "../utils/whatsapp";

// Info badge with earthy icon
const InfoWithIcon = ({ icon, label, value }) => (
  <p className="flex items-center text-xs text-stone-600">
    <FontAwesomeIcon icon={icon} className="mr-2 text-[#C84B31] text-xs w-3.5 text-center" />
    <span className="font-semibold mr-1">{label}:</span> {value}
  </p>
);

const Homepage = () => {
  const navigate = useNavigate();
  const [heroData] = useState({
    badge: "🌾 जय जोहार • THE 36 FORTS OF CHHATTISGARH",
    title: "Untamed Sal Woodlands & Highland Trails",
    description:
      "Journey into the heart of India's greenest frontier. From mist-veiled Kanger Valley and roar of Chitrakote Falls to bonfires under the Maikal hills — experience authentic Chhattisgarhi eco-trekking with 36 Montane.",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
  });
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [trekkingServices, setTrekkingServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const [tripsRes, servicesRes] = await Promise.all([
        fetch(`${baseUrl}/api/featuredtrips`).catch(() => null),
        fetch(`${baseUrl}/api/services`).catch(() => null),
      ]);

      if (tripsRes?.ok && servicesRes?.ok) {
        const [tripsData, servicesData] = await Promise.all([
          tripsRes.json(),
          servicesRes.json(),
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

  if (isLoading) {
    return <SpinnerWithIcon />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-20 bg-amber-50">
        <h2 className="text-2xl font-bold">Oops! Something went wrong.</h2>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  const ownerWhatsApp = getOwnerWhatsAppNumber();
  const guideWhatsAppUrl = `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(
    "Hello 36 Montane! 🙏 जय जोहार! I am exploring upcoming treks in Chhattisgarh and would like guidance on dates and itineraries."
  )}`;

  return (
    <div className="bg-[#FAF6F0] text-stone-900 font-sans selection:bg-[#C84B31] selection:text-white">
      {/* ==================== 1. HERO SECTION ==================== */}
      <section
        className="relative bg-cover bg-center min-h-[78vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(13, 33, 25, 0.75), rgba(17, 38, 29, 0.85)), url(${heroData.imageUrl})`,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 relative z-10 max-w-4xl">
          {/* Chhattisgarhi Cultural Welcome Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-semibold tracking-wider mb-6 backdrop-blur-md shadow-lg">
            <span>{heroData.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6 font-serif">
            {heroData.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-amber-100/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            {heroData.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#featured-trips"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#C84B31] to-[#A3351E] hover:from-[#D95338] hover:to-[#B8391B] text-white font-bold rounded-2xl shadow-xl shadow-black/40 transition hover:scale-105 border border-amber-400/30 flex items-center justify-center gap-2 text-sm"
            >
              <span>🏕️</span>
              <span>Explore Expeditions</span>
            </a>

            <a
              href={guideWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 bg-[#1B4332]/90 hover:bg-[#2D6A4F] text-amber-100 font-bold rounded-2xl shadow-lg border border-amber-500/30 transition hover:scale-105 flex items-center justify-center gap-2 text-sm backdrop-blur-md"
            >
              <span>💬</span>
              <span>Ask Local Guide on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Tribal Godna / Chevron Motif Ribbon */}
      <div className="tribal-border-motif"></div>

      {/* ==================== 2. QUICK STATS BANNER ==================== */}
      <section className="bg-[#11261D] text-amber-100 py-6 border-b border-[#2D6A4F]/40 shadow-inner">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-emerald-800/40 last:border-none">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif">36+</span>
              <p className="text-xs text-amber-100/70 mt-1 uppercase tracking-wider font-semibold">Forts & Heritage Trails</p>
            </div>
            <div className="border-r border-emerald-800/40 last:border-none">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif">100%</span>
              <p className="text-xs text-amber-100/70 mt-1 uppercase tracking-wider font-semibold">Indigenous Local Guides</p>
            </div>
            <div className="border-r border-emerald-800/40 last:border-none">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif">44%</span>
              <p className="text-xs text-amber-100/70 mt-1 uppercase tracking-wider font-semibold">Protected Forest Canopy</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif">Zero</span>
              <p className="text-xs text-amber-100/70 mt-1 uppercase tracking-wider font-semibold">Trace Eco-Camping</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LIVE SATELLITE WEATHER RADAR & FORECAST ==================== */}
      <LiveWeather />

      {/* ==================== 3. CULTURAL SHOWCASE: THE ESSENCE OF CHHATTISGARH ==================== */}
      <section className="py-20 bg-[#FAF6F0]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#C84B31] bg-[#C84B31]/10 px-3 py-1 rounded-full">
              मोर मयारू छत्तीसगढ़
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3 font-serif">
              Why Journey with 36 Montane?
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
              Named after the thirty-six historical forts of this sacred land, we curate intimate eco-expeditions bridging wild highlands, tribal folklore, and untouched nature.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-[#C84B31]/40 transition duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#C84B31] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🏺
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2 font-serif">Bastar Dokra Heritage</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connect with ancient bell-metal artisans, traditional haats (weekly markets), and living tribal traditions in Jagdalpur and Kondagaon.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-[#C84B31]/40 transition duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#1B4332] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🌲
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2 font-serif">Dandakaranya Sal Canopies</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Trek through ancient virgin forests mentioned in epics, home to teak, sal, wild orchids, and natural limestone cavern systems.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-[#C84B31]/40 transition duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🌊
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2 font-serif">Chitrakote Cascades</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Stand before the majestic horseshoe waterfalls on the Indravati river, known worldwide as the "Niagara of India".
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-[#C84B31]/40 transition duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-[#C84B31] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🍲
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2 font-serif">Campfire Chhattisgarhi Rasoi</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Savor traditional local flavors: steamed *Fara*, crispy *Chila*, local chutneys, and piping hot chai brewed over jungle firewood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. FEATURED EXPEDITIONS SECTION ==================== */}
      <section id="featured-trips" className="py-20 bg-stone-100/70 border-t border-stone-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1B4332] bg-[#1B4332]/10 px-3 py-1 rounded-full">
              हस्ताक्षरित यात्राएं • SIGNATURE EXPEDITIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3 font-serif">
              Featured Chhattisgarh Treks
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2">
              Select your adventure path across plateau viewpoints, ancient Maikal ridges, and sacred waterfalls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTrips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={trip.headerImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"}
                    alt={trip.title}
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/30">
                    ₹{trip.price}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#1B4332]/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                    {trip.location || "Chhattisgarh"}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 font-serif mb-2">{trip.title}</h3>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                      {trip.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 bg-[#FAF6F0] p-3 rounded-xl border border-stone-200 text-xs mb-5">
                      <InfoWithIcon icon={faMountain} label="Trail" value={trip.difficulty || "Moderate"} />
                      <InfoWithIcon icon={faClock} label="Days" value={`${trip.duration || 3} Days`} />
                      <InfoWithIcon icon={faUsers} label="Group" value={`Max ${trip.maxGroupSize || 12}`} />
                      <InfoWithIcon icon={faMapMarkerAlt} label="Region" value={trip.location?.split(',')[0] || "Bastar"} />
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleSubmit(e, trip)}
                    className="w-full py-3 bg-gradient-to-r from-[#C84B31] to-[#A3351E] hover:from-[#D95338] hover:to-[#B8391B] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>🏕️</span>
                    <span>Book Expedition</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. TREKKING & OUTDOOR SERVICES ==================== */}
      <section className="py-20 bg-[#FAF6F0]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#C84B31] bg-[#C84B31]/10 px-3 py-1 rounded-full">
              सेवाएं एवं अनुभव • OUTDOOR EXPERIENCES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3 font-serif">
              Explore Our Outdoor Services
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2">
              From weekend highland camping and jungle cave treks to corporate retreats and wildlife trails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trekkingServices.slice(0, 6).map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={service.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
                    alt={service.title}
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 font-bold text-xs px-2 py-0.5 rounded-full shadow">
                    ★ {service.rating || "4.8"}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-stone-900 font-serif mb-2">{service.title}</h4>
                    <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">{service.description}</p>
                    <div className="space-y-1 mb-4 text-xs">
                      <p className="text-stone-500">📍 <strong>Location:</strong> {service.location || "Chhattisgarh"}</p>
                      <p className="text-stone-500">⏱️ <strong>Duration:</strong> {service.duration || "1-2 Days"}</p>
                      <p className="text-[#1B4332] font-bold">💰 <strong>Price:</strong> {service.price || "Contact"}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleSubmit(e, service)}
                    className="w-full py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>Book Service</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 6. CUSTOM EXPEDITION BANNER ==================== */}
      <section className="py-16 bg-[#11261D] text-amber-100 border-t border-[#2D6A4F]/50">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <span className="text-2xl mb-2 block">🌾</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-4">
            Plan a Bespoke Chhattisgarhi Expedition
          </h2>
          <p className="text-sm sm:text-base text-amber-100/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Organizing a college trip, family weekend, corporate retreat, or birdwatching expedition? Let our certified wilderness guides customize your route, food, tents, and transport.
          </p>
          <CustomTripSection />
        </div>
      </section>

      {/* ==================== 7. FAQ SECTION ==================== */}
      <div className="bg-[#FAF6F0] py-16 border-t border-stone-200">
        <FAQComponent />
      </div>
    </div>
  );
};

export default Homepage;