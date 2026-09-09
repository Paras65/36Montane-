// seedData.js - Default dataset for 36 Montane
const trips = [
  {
    _id: "6581f1b2c45e123456789001",
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
    bookingLink: "/detail"
  },
  {
    _id: "6581f1b2c45e123456789002",
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
    bookingLink: "/detail"
  },
  {
    _id: "6581f1b2c45e123456789003",
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
    bookingLink: "/detail"
  }
];

const services = [
  {
    _id: "6581f1b2c45e123456789011",
    title: "Saroda Dadar Weekend Camp",
    description: "Luxurious dome tents with valley views, bonfires, acoustic music, and stargazing.",
    icon: "tent",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80",
    link: "/detail",
    location: "Saroda Dadar, CG",
    duration: "2 Days / 1 Night",
    price: "₹2,499",
    rating: 4.9,
    category: "Camping"
  },
  {
    _id: "6581f1b2c45e123456789012",
    title: "Chilfi Ghati Sunset Ridge Trek",
    description: "Scenic 8km guided hike reaching panoramic viewpoints above misty clouds at sunset.",
    icon: "hiking",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80",
    link: "/detail",
    location: "Chilfi Ghati, CG",
    duration: "1 Day (6 Hours)",
    price: "₹1,200",
    rating: 4.8,
    category: "Trekking"
  },
  {
    _id: "6581f1b2c45e123456789013",
    title: "Bhoramdev Wilderness Safari",
    description: "Forest jeep trail exploring remote waterfalls, wildlife sightings, and village visits.",
    icon: "compass",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    link: "/detail",
    location: "Kawardha, CG",
    duration: "Full Day",
    price: "₹3,500",
    rating: 4.7,
    category: "Adventure"
  },
  {
    _id: "6581f1b2c45e123456789014",
    title: "Maikal Stargazing Night Out",
    description: "Telescope observation sessions, outdoor cinema, BBQ dinner, and alpine camping.",
    icon: "moon",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    link: "/detail",
    location: "Maikal Hills, CG",
    duration: "Overnight",
    price: "₹2,800",
    rating: 4.9,
    category: "Camping"
  }
];

const events = [
  {
    _id: "6581f1b2c45e123456789021",
    eventName: "Maikal Ridge Monsoon Summit 2026",
    date: new Date("2026-10-15T06:00:00Z"),
    duration: 360,
    description: "Annual community trek through the verdant monsoon slopes of the Maikal mountains with sunrise peak ceremony.",
    location: "Chilfi Ghati Summit, CG",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "6581f1b2c45e123456789022",
    eventName: "Saroda Dadar Full Moon Campout",
    date: new Date("2026-11-24T18:00:00Z"),
    duration: 720,
    description: "Spend an enchanting evening under the bright full moon featuring live folk music, campfires, and astro-photography.",
    location: "Saroda Dadar Plateau, CG",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80"
  }
];

const galleryItems = [
  {
    _id: "6581f1b2c45e123456789031",
    title: "Golden Hour on Saroda Plateau",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    platform: "instagram"
  },
  {
    _id: "6581f1b2c45e123456789032",
    title: "Campfire Nights under Stars",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=400&q=80",
    platform: "instagram"
  },
  {
    _id: "6581f1b2c45e123456789033",
    title: "Maikal Ridge Trail Expedition",
    type: "video",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=400&q=80",
    platform: "youtube"
  },
  {
    _id: "6581f1b2c45e123456789034",
    title: "Morning Mist over Valley",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    platform: "instagram"
  }
];

const articles = [
  {
    _id: "6581f1b2c45e123456789041",
    title: "Top 5 Hiking Trails in the Maikal Range",
    author: "36 Montane Team",
    date: new Date("2026-08-10"),
    shortDescription: "A comprehensive guide to experiencing the rich flora, waterfalls, and viewpoints of Central India's hidden gem.",
    fullContent: "The Satpura-Maikal range is one of the most ecologically diverse hill ranges in Central India. In this guide we cover the 5 most stunning hiking routes, gear checklist, ideal seasons, and local tribal cultural etiquettes."
  },
  {
    _id: "6581f1b2c45e123456789042",
    title: "Essential Camping Gear for Beginners",
    author: "Paras",
    date: new Date("2026-08-25"),
    shortDescription: "Everything you need to pack for a safe, comfortable, and memorable weekend under the stars.",
    fullContent: "Packing the right gear makes the difference between an uncomfortable night and an extraordinary camping journey. From proper sleeping pads and waterproof layers to headlamps and eco-friendly cookware, here is the curated checklist."
  }
];

const bookings = [
  {
    _id: "6581f1b2c45e123456789051",
    name: "Rohan Sharma",
    email: "rohan.sharma@example.com",
    numberOfPeople: 4,
    tripId: "6581f1b2c45e123456789001",
    status: "Confirmed",
    bookingDate: new Date("2026-09-02T10:30:00Z")
  },
  {
    _id: "6581f1b2c45e123456789052",
    name: "Priya Patel",
    email: "priya.p@example.com",
    numberOfPeople: 2,
    tripId: "6581f1b2c45e123456789002",
    status: "Pending",
    bookingDate: new Date("2026-09-05T14:15:00Z")
  },
  {
    _id: "6581f1b2c45e123456789053",
    name: "Aman Verma",
    email: "aman.v@example.com",
    numberOfPeople: 6,
    tripId: "6581f1b2c45e123456789003",
    status: "Confirmed",
    bookingDate: new Date("2026-09-08T09:00:00Z")
  }
];

const contacts = [
  {
    _id: "6581f1b2c45e123456789061",
    name: "Sunil Tiwari",
    email: "sunil.tiwari@example.com",
    phone: "+91 98765 43210",
    message: "Looking for a customized 5-day corporate team trekking retreat in November. Do you arrange bus pickup from Raipur?",
    createdAt: new Date("2026-09-04T11:20:00Z")
  },
  {
    _id: "6581f1b2c45e123456789062",
    name: "Ananya Deshmukh",
    email: "ananya.d@example.com",
    phone: "+91 91234 56789",
    message: "Can beginners participate in the Maikal Ridge monsoon trek? Are sleeping bags provided?",
    createdAt: new Date("2026-09-07T16:45:00Z")
  }
];

module.exports = {
  trips,
  services,
  events,
  galleryItems,
  articles,
  bookings,
  contacts
};

