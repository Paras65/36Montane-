import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icon asset paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const TRAIL_DESTINATIONS = [
  {
    id: 'saroda-dadar',
    name: 'Saroda Dadar Plateau',
    shortName: 'Saroda Dadar',
    district: 'Kawardha',
    lat: 22.01,
    lon: 81.25,
    altitude: '850m',
    category: 'Basecamp',
    difficulty: 'Moderate',
    trailLength: '8.5 km',
    duration: '2 Days / 1 Night',
    tag: 'Sunset Ridge & Stargazing Basecamp',
    description: 'Perched high in the Maikal hills with panoramic sunset views, traditional Baiga campfire dinners, and crisp plateau air.',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
    icon: '⛺'
  },
  {
    id: 'chitrakote',
    name: 'Chitrakote Falls Gorge',
    shortName: 'Chitrakote',
    district: 'Bastar',
    lat: 19.20,
    lon: 81.70,
    altitude: '580m',
    category: 'Waterfall',
    difficulty: 'Easy-Moderate',
    trailLength: '5.2 km',
    duration: 'Full Day Trek',
    tag: 'Niagara of India & Indravati Canyon',
    description: 'Indias widest waterfall cascading 300 meters across horseshoe cliffs. Experience gorge boat expeditions and mist walks.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    icon: '🌊'
  },
  {
    id: 'kanger-valley',
    name: 'Kanger Valley & Caverns',
    shortName: 'Kanger Valley',
    district: 'Jagdalpur',
    lat: 18.87,
    lon: 81.87,
    altitude: '630m',
    category: 'Caves',
    difficulty: 'Challenging',
    trailLength: '12 km',
    duration: '3 Days / 2 Nights',
    tag: 'Virgin Sal Rainforest & Subterranean Caves',
    description: 'A subterranean wonderland containing Kotumsar limestone stalactites, deep Sal riverbeds, and indigenous Bastar biodiversity.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    icon: '🦇'
  },
  {
    id: 'mainpat',
    name: 'Mainpat Highlands',
    shortName: 'Mainpat',
    district: 'Surguja',
    lat: 22.82,
    lon: 83.28,
    altitude: '1,100m',
    category: 'Highland',
    difficulty: 'Moderate',
    trailLength: '10 km',
    duration: '2 Days / 1 Night',
    tag: 'The Shimla of Chhattisgarh & Tiger Point',
    description: 'Cool highland plateaus featuring the oscillating bouncy wetlands of Jaljali, Tibetan Buddhist settlements, and pine ridges.',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=600&q=80',
    icon: '🏔️'
  },
  {
    id: 'bhoramdev',
    name: 'Bhoramdev Ancient Sanctuary',
    shortName: 'Bhoramdev',
    district: 'Kawardha',
    lat: 22.12,
    lon: 81.16,
    altitude: '720m',
    category: 'Heritage',
    difficulty: 'Easy',
    trailLength: '6 km',
    duration: '1 Day Circuit',
    tag: '11th-Century Khajuraho of Chhattisgarh',
    description: 'Carved stone temples nestled at the foothills of the Maikal range, surrounded by sacred lotus reservoirs and dense forests.',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f4439c27?auto=format&fit=crop&w=600&q=80',
    icon: '🛕'
  }
];

const CATEGORIES = ['All', 'Basecamp', 'Waterfall', 'Highland', 'Caves', 'Heritage'];

const TrailMap = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTrail, setSelectedTrail] = useState(TRAIL_DESTINATIONS[0]);

  const filteredTrails = activeCategory === 'All'
    ? TRAIL_DESTINATIONS
    : TRAIL_DESTINATIONS.filter(t => t.category === activeCategory);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Centered on Chhattisgarh (approx 21.0° N, 82.0° E)
    const map = L.map(mapContainerRef.current, {
      center: [21.0, 82.0],
      zoom: 7,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    // CartoDB Voyager High-Resolution Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render & Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    filteredTrails.forEach(trail => {
      // Create custom tribal styled DivIcon
      const customIcon = L.divIcon({
        className: 'custom-trail-marker',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: linear-gradient(135deg, #C84B31, #9E321C);
            border: 3px solid #E9C46A;
            box-shadow: 0 4px 14px rgba(0,0,0,0.45);
            color: #FFF;
            font-size: 18px;
            cursor: pointer;
            transition: transform 0.2s ease;
          "
          onmouseover="this.style.transform='scale(1.15)';"
          onmouseout="this.style.transform='scale(1)';"
          title="${trail.name}">
            <span>${trail.icon}</span>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
        popupAnchor: [0, -22],
      });

      const popupContent = `
        <div style="font-family: sans-serif; max-width: 240px; padding: 2px;">
          <img src="${trail.image}" alt="${trail.name}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 10px; margin-bottom: 8px;" />
          <span style="font-size: 10px; font-weight: 700; color: #C84B31; text-transform: uppercase; letter-spacing: 0.5px;">${trail.tag}</span>
          <h4 style="margin: 3px 0 6px; font-size: 15px; font-weight: 800; color: #11261D;">${trail.name}</h4>
          <p style="margin: 0 0 8px; font-size: 11px; color: #555; line-height: 1.4;">${trail.description}</p>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 10px; color: #333;">
            <span><strong>⛰️ Alt:</strong> ${trail.altitude}</span>
            <span><strong>🥾 Route:</strong> ${trail.trailLength}</span>
          </div>
          <a href="/service" style="display: block; text-align: center; background: #C84B31; color: #FFF; padding: 7px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; text-decoration: none;">
            🏕️ Reserve This Trail
          </a>
        </div>
      `;

      const marker = L.marker([trail.lat, trail.lon], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedTrail(trail);
      });

      markersRef.current[trail.id] = marker;
    });

    // If we have markers, fit bounds or keep center
    if (filteredTrails.length > 0) {
      const bounds = L.latLngBounds(filteredTrails.map(t => [t.lat, t.lon]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [filteredTrails]);

  // Handle focus on location click
  const handleSelectTrail = (trail) => {
    setSelectedTrail(trail);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([trail.lat, trail.lon], 11, { duration: 1.2 });
      const marker = markersRef.current[trail.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 1300);
      }
    }
  };

  return (
    <section id="trail-map" className="py-20 bg-[#FAF6F0] text-stone-900 relative overflow-hidden border-b border-[#EADBCE]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11261D] text-[#E9C46A] text-xs uppercase tracking-widest font-semibold mb-3 border border-amber-400/30">
            <span>🗺️ INTERACTIVE TRAIL TOPOGRAPHY • 36 FORTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-[#11261D]">
            Explore Our Chhattisgarh Trails & Basecamps
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Navigate our expedition basecamps, highland ridges, cascading waterfalls, and subterranean limestone caves across Dandakaranya.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition duration-200 border ${
                  activeCategory === category
                    ? 'bg-[#C84B31] text-white border-[#C84B31] shadow-md scale-105'
                    : 'bg-white text-stone-700 border-[#EADBCE] hover:bg-stone-100'
                }`}
              >
                {category === 'All' ? `All Circuits (${TRAIL_DESTINATIONS.length})` : category}
              </button>
            ))}
          </div>
        </div>

        {/* Map & Trail Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Map Canvas (8 Columns) */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border-2 border-[#D4A373]/50 shadow-2xl bg-stone-100 relative min-h-[480px] sm:min-h-[540px]">
            <div ref={mapContainerRef} className="w-full h-full min-h-[480px] sm:min-h-[540px] z-10" />

            {/* Floating Quick Legend */}
            <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-[#EADBCE] shadow-lg text-[11px] text-stone-700 hidden sm:block">
              <div className="font-bold text-[#11261D] mb-1.5 flex items-center gap-1">
                <span>🧭</span>
                <span>Legend & Pins</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5"><span>⛺</span> <span>Base Camp</span></div>
                <div className="flex items-center gap-1.5"><span>🌊</span> <span>Waterfall</span></div>
                <div className="flex items-center gap-1.5"><span>🏔️</span> <span>Highland Peak</span></div>
                <div className="flex items-center gap-1.5"><span>🦇</span> <span>Limestone Cave</span></div>
              </div>
            </div>
          </div>

          {/* Destination Highlights & Cards (4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Select Destination to Fly & Explore
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredTrails.map(trail => {
                const isSelected = selectedTrail?.id === trail.id;
                return (
                  <div
                    key={trail.id}
                    onClick={() => handleSelectTrail(trail)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-3.5 ${
                      isSelected
                        ? 'bg-white border-[#C84B31] shadow-lg ring-2 ring-[#C84B31]/30 scale-[1.02]'
                        : 'bg-white/80 border-[#EADBCE] hover:bg-white hover:border-[#D4A373]'
                    }`}
                  >
                    <img
                      src={trail.image}
                      alt={trail.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C84B31]">
                          {trail.district}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                          {trail.difficulty}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#11261D] truncate">
                        {trail.icon} {trail.name}
                      </h4>

                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                        {trail.description}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-[#11261D]">
                        <span>⛰️ {trail.altitude}</span>
                        <span>⏱️ {trail.duration}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Book Active Trail CTA Banner */}
            {selectedTrail && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#11261D] to-[#1B4332] text-white border border-[#D4A373]/40 shadow-xl mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#E9C46A]">
                    {selectedTrail.tag}
                  </span>
                  <span className="text-xs bg-[#C84B31] px-2.5 py-0.5 rounded-full font-bold">
                    {selectedTrail.altitude}
                  </span>
                </div>
                <p className="text-xs text-stone-200 mb-3">
                  Ready to trek {selectedTrail.name}? Connect with our certified Baiga & Gond trail guides.
                </p>
                <div className="flex items-center gap-2">
                  <NavLink
                    to="/service"
                    className="flex-1 py-2 px-3 bg-[#C84B31] hover:bg-[#9E321C] text-white text-xs font-bold rounded-xl text-center shadow transition"
                  >
                    🏕️ Book This Trail
                  </NavLink>
                  <a
                    href={`https://wa.me/918770281696?text=${encodeURIComponent(
                      `Jai Johar! I am planning a trek to ${selectedTrail.name} (${selectedTrail.altitude}). What are the upcoming departure dates?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-[#25D366] hover:bg-[#1ebe5b] text-white text-xs font-bold rounded-xl shadow transition"
                    title="Inquire on WhatsApp"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trail Stats Bar */}
        <div className="mt-14 pt-8 border-t border-[#EADBCE] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white border border-[#EADBCE]">
            <span className="text-2xl font-black text-[#C84B31] font-serif">5+</span>
            <p className="text-xs text-stone-600 mt-1 font-semibold">Active Wilderness Circuits</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#EADBCE]">
            <span className="text-2xl font-black text-[#11261D] font-serif">1,100m</span>
            <p className="text-xs text-stone-600 mt-1 font-semibold">Highest Highland Peak (Mainpat)</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#EADBCE]">
            <span className="text-2xl font-black text-[#C84B31] font-serif">100%</span>
            <p className="text-xs text-stone-600 mt-1 font-semibold">Indigenous Baiga Guides</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#EADBCE]">
            <span className="text-2xl font-black text-[#11261D] font-serif">Zero</span>
            <p className="text-xs text-stone-600 mt-1 font-semibold">Leave No Trace Policy</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrailMap;

