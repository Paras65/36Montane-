// seed.js - Populates MongoDB with default 36 Montane data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trip = require('./models/Trip');
const TrekkingService = require('./models/TrekkingService');
const Event = require('./models/Events');
const Gallery = require('./models/Gallery');
const Article = require('./models/Article');
const { trips, services, events, galleryItems, articles } = require('./data/seedData');

dotenv.config();

const seedDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/36montane';
  console.log(`Connecting to MongoDB at: ${uri}...`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB');

    // Clear existing collections
    await Trip.deleteMany({});
    await TrekkingService.deleteMany({});
    await Event.deleteMany({});
    await Gallery.deleteMany({});
    await Article.deleteMany({});
    console.log('Cleared existing data.');

    // Insert seed data
    await Trip.insertMany(trips);
    console.log(`✅ Seeded ${trips.length} Trips`);

    await TrekkingService.insertMany(services);
    console.log(`✅ Seeded ${services.length} Trekking Services`);

    await Event.insertMany(events);
    console.log(`✅ Seeded ${events.length} Events`);

    await Gallery.insertMany(galleryItems);
    console.log(`✅ Seeded ${galleryItems.length} Gallery Items`);

    await Article.insertMany(articles);
    console.log(`✅ Seeded ${articles.length} Articles`);

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();

