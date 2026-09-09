import { useState, useEffect } from "react";
import "../style/Recenttrips.css";
import SpinnerWithIcon  from "./SpinnerWithIcon";
import { mockGalleryItems } from "../data/mockData";

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/gallery/type`;

const MediaCard = ({ trip, onPlay, visible }) => (
  <div className="media-card">
    <div className="media-thumbnail-container">
      {visible ? (
        <img
          className="media-thumbnail"
          src={trip.thumbnail}
          alt={`Thumbnail for ${trip.title}`}
          onClick={() => onPlay(trip.mediaUrl)}
          loading="lazy"
        />
      ) : (
        <div className="thumbnail-placeholder">Loading...</div>
      )}
    </div>
    <h3 className="media-title">{trip.title}</h3>
    <button
      className="play-button"
      onClick={(e) => {
        e.preventDefault();
        onPlay(trip.mediaUrl);
      }}
      aria-label={`View ${trip.title}`}
    >
      {trip.type === "video" && <span className="play-icon">▶</span>}
      {trip.type === "video" ? "Play Video" : "View Photo"}
    </button>
  </div>
);

const RecentTrips = () => {
  const [tripsData, setTripsData] = useState(null);
  const [playingMedia, setPlayingMedia] = useState(null);
  const [visible, setVisible] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch trips data from API
  useEffect(() => {
    const fetchTripsData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        const items = Array.isArray(data) && data.length > 0 ? data : mockGalleryItems;
        setTripsData(items);
        setVisible(new Array(items.length).fill(true));
      } catch (err) {
        console.warn("API unavailable, using fallback gallery:", err);
        setTripsData(mockGalleryItems);
        setVisible(new Array(mockGalleryItems.length).fill(true));
      } finally {
        setLoading(false);
      }
    };
    fetchTripsData();
  }, []);
  

  // Filter trips data based on category
  const handleFilterChange = (category) => {
    setFilter(category);
  };

  const filteredData = tripsData?.filter((trip) => {
    if (filter === "all") return true;
    return trip.type === filter;
  });

  // Fallback UI logic
  if (loading) return <SpinnerWithIcon />;
  

  return (
    <div className="recent-trips-container">
      <h2 className="section-title">Recent Trip Reels, Videos & Photos</h2>

      {/* Category Filter */}
      <div className="filter-buttons">
        {["all", "video", "photo"].map((category) => (
          <button
            key={category}
            onClick={() => handleFilterChange(category)}
            className={`filter-button ${filter === category ? "active" : ""}`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="media-grid">
        {filteredData?.map((trip, index) => (
          <MediaCard
            key={trip.id}
            trip={trip}
            onPlay={setPlayingMedia}
            visible={visible[index]}
          />
        ))}
      </div>

      {/* Media Player */}
      {playingMedia && (
        <div className="media-player-overlay">
          <div className="media-player-container">
            <button
              className="close-button"
              onClick={() => setPlayingMedia(null)}
              aria-label="Close media player"
            >
              X
            </button>
            {playingMedia.includes("youtube") || playingMedia.includes("instagram") ? (
              <iframe
                width="100%"
                height="315"
                src={playingMedia}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Media player"
              ></iframe>
            ) : (
              <img src={playingMedia} alt="Full-size view" className="full-size-photo" />
            )}
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showPopup && (
  <div className="popup-overlay">
    <div className="popup-container">
      <h2>Oops! Something went wrong.</h2>
      <p>We couldn't fetch the latest trips from the server. Here’s some default content:</p>
      
      <button className="close-popup-button" onClick={() => setShowPopup(false)}>
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default RecentTrips;
