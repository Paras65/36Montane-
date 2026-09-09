export const mockFeaturedTrips = [
  {
    _id: "trip-1",
    title: "Saroda Dadar Forest Trail",
    description: "Immerse yourself in lush Sal forests, tranquil plateau views, and scenic wildlife trails in Saroda Dadar.",
    headerImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    location: "Saroda Dadar, Chhattisgarh",
    difficulty: "Moderate",
    duration: 3,
    maxGroupSize: 12,
    price: 4500,
    details: "Explore the untouched wilderness of Saroda Dadar with professional guides, campfire dinners, and tent camping under starry skies.",
    inclusions: ["Tents & Sleeping Bags", "All Meals & Snacks", "Certified Mountain Guide", "First Aid & Emergency Kit"],
    bookingLink: "/Detail"
  },
  {
    _id: "trip-2",
    title: "Bhoramdev Valley Trek & Heritage",
    description: "Discover the historic 11th-century temples nestled in the Maikal hills followed by scenic riverside camping.",
    headerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    location: "Kawardha, Chhattisgarh",
    difficulty: "Easy to Moderate",
    duration: 2,
    maxGroupSize: 15,
    price: 3200,
    details: "A cultural and trekking getaway exploring ancient stone architecture and tranquil forest valleys.",
    inclusions: ["Heritage Tour Entry", "Campfire Gathering", "Breakfast & Dinner", "Trekking Poles"],
    bookingLink: "/Detail"
  },
  {
    _id: "trip-3",
    title: "Maikal Hills Ridge Expedition",
    description: "An exhilarating ridge trek along the Satpura-Maikal range with panoramic valley sunrises and stargazing.",
    headerImage: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80",
    location: "Maikal Range, Chhattisgarh",
    difficulty: "Challenging",
    duration: 4,
    maxGroupSize: 10,
    price: 6800,
    details: "Summit rocky outcrops, traverse deep woodlands, and camp at scenic high-altitude viewpoints.",
    inclusions: ["All Trekking Permits", "Porter & Guide Support", "High-Altitude Tents", "Nutritious Trail Meals"],
    bookingLink: "/Detail"
  }
];

export const mockServices = [
  {
    _id: "srv-1",
    title: "Saroda Dadar Weekend Camp",
    description: "Luxurious dome tents with valley views, bonfires, acoustic music, and stargazing.",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80",
    location: "Saroda Dadar, CG",
    duration: "2 Days / 1 Night",
    price: "₹2,499",
    rating: 4.9,
    type: "Camping",
    category: "Camping"
  },
  {
    _id: "srv-2",
    title: "Maikal Forest Guided Trek",
    description: "Full-day wilderness hike exploring hidden streams, rock caves, and native flora.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80",
    location: "Maikal Hills, CG",
    duration: "1 Day",
    price: "₹1,299",
    rating: 4.8,
    type: "Trekking",
    category: "Outdoor Adventures"
  },
  {
    _id: "srv-3",
    title: "Kanha Fringe Wildlife Safari",
    description: "Jeep expedition along buffer forest zones tracking deer, leopards, and rare avian species.",
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80",
    location: "Kanha Border, CG-MP",
    duration: "2 Days",
    price: "₹5,500",
    rating: 4.9,
    type: "Wildlife Tour",
    category: "Wildlife"
  },
  {
    _id: "srv-4",
    title: "Bhoramdev Heritage Walk",
    description: "Guided storytelling tour through 11th-century temple art, tribal culture, and local craft villages.",
    image: "https://images.unsplash.com/photo-1600100397608-f010f4439c27?auto=format&fit=crop&w=600&q=80",
    location: "Kawardha, CG",
    duration: "Half Day",
    price: "₹899",
    rating: 4.7,
    type: "Cultural Tour",
    category: "Cultural Tours"
  },
  {
    _id: "srv-5",
    title: "River Kayaking & Water Adventures",
    description: "Calm water kayaking and river rafting thrills for beginners and enthusiasts alike.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    location: "Chilpi River, CG",
    duration: "4 Hours",
    price: "₹1,499",
    rating: 4.8,
    type: "Water Sports",
    category: "Water Sports"
  },
  {
    _id: "srv-6",
    title: "Sunset Ridge Photography Tour",
    description: "Golden hour photo expedition across scenic ridgelines capturing majestic cloudscapes.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    location: "Saroda Dadar, CG",
    duration: "1 Day",
    price: "₹1,799",
    rating: 4.9,
    type: "Nature Tours",
    category: "Nature Tours"
  }
];

export const mockEvents = [
  {
    eventName: "Maikal Monsoon Night Trek",
    date: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 2 days from now
    duration: 240,
    description: "An unforgettable evening trek under misty hilltops with starry skies and a midnight bonfire.",
    location: "Saroda Dadar, Chhattisgarh",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80"
  },
  {
    eventName: "36 Montane Weekend Campfest",
    date: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(), // 5 days from now
    duration: 720,
    description: "Live acoustic performances, barbecue, stargazing workshops, and sunrise yoga in the wilderness.",
    location: "Adventure Camp, Saroda",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
  },
  {
    eventName: "Wildlife & Birding Trail",
    date: new Date(Date.now() + 1000 * 60 * 60 * 240).toISOString(), // 10 days from now
    duration: 180,
    description: "Early morning bird-watching trail led by seasoned naturalists across the Maikal foothills.",
    location: "Bhoramdev Sanctuary Fringe",
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80"
  }
];

export const mockGalleryItems = [
  {
    id: 1,
    title: "Campfire Nights at Saroda Dadar",
    mediaUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80",
    type: "photo",
    platform: "web"
  },
  {
    id: 2,
    title: "Maikal Ridge Sunrise Trek",
    mediaUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    type: "photo",
    platform: "web"
  },
  {
    id: 3,
    title: "River Kayaking Expedition",
    mediaUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    type: "photo",
    platform: "web"
  },
  {
    id: 4,
    title: "Tent Camping in the Wilderness",
    mediaUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
    type: "photo",
    platform: "web"
  }
];

export const mockArticles = [
  {
    id: 1,
    title: "Trekking in Chhattisgarh: Why Saroda Dadar Should Be Your Next Destination",
    author: "Paras & 36 Montane Team",
    date: "January 15, 2025",
    shortDescription: "From misty plateaus to lush Sal canopies, discover why Chhattisgarh's Maikal range is Central India's best-kept adventure secret.",
    fullContent: `
      <p>Often overlooked in favor of the Himalayas, Chhattisgarh holds a raw, untamed charm for trekkers seeking tranquil nature without tourist crowds.</p>
      <h2 style="font-size: 1.5rem; font-weight: bold; margin: 15px 0 10px;">The Magic of Saroda Dadar</h2>
      <p>Perched high on the Maikal range, Saroda Dadar offers dramatic views where the plateau suddenly drops into sweeping green valleys. The trails weave through ancient Baiga tribal lands, offering a deep cultural connection alongside physical adventure.</p>
      <h2 style="font-size: 1.5rem; font-weight: bold; margin: 15px 0 10px;">Best Time to Visit</h2>
      <p>October through March provides crisp, sunny days and cool nights ideal for campfire camping. Monsoons (July-September) turn the entire landscape into an emerald dream with cascading seasonal waterfalls.</p>
    `
  },
  {
    id: 2,
    title: "Essential Packing Checklist for Weekend Camping",
    author: "Adventure Guide Team",
    date: "February 2, 2025",
    shortDescription: "A curated guide on what to bring for a comfortable, eco-friendly camping trip in the forest hills.",
    fullContent: `
      <p>Whether it's your first night under canvas or your fiftieth, having the right gear ensures you spend your time soaking in the views rather than dealing with hassles.</p>
      <h2 style="font-size: 1.5rem; font-weight: bold; margin: 15px 0 10px;">Key Essentials</h2>
      <ul>
        <li><strong>Sturdy hiking footwear:</strong> Terrain can be rocky and slippery near water bodies.</li>
        <li><strong>Layered clothing:</strong> Hill breezes can turn chilly quickly after sundown.</li>
        <li><strong>Headlamp or flashlight:</strong> Freeing your hands around camp is essential.</li>
        <li><strong>Reusable water bottle:</strong> Practice Leave No Trace by minimizing single-use plastic.</li>
      </ul>
    `
  }
];

