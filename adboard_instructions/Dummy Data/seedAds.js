import mongoose from 'mongoose';
import dotenv from 'dotenv';

// --- Database & Model Imports ---
// (We assume you have these files in your project)
import Ad from '../models/adModel.js'; 
import connectDB from '../config/db.js'; 

// --- Data Imports ---
// Import the 35 categories
import { CATEGORIES } from '../config/categories.config.js'; 

// Import the new, complete location data
import { COUNTRIES, STATES, CITIES } from '../config/locations.constants.js'; 

dotenv.config();

// --- Dummy Data Helpers ---
const DUMMY_USER_IDS = [
  '60d5ec49f1f0a26f8c8b4567', // Replace with actual user IDs from your DB
  '60d5ec49f1f0a26f8c8b4568',
  '60d5ec49f1f0a26f8c8b4569',
];

const DUMMY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', filename: 'sample1.jpg' },
  { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', filename: 'sample2.jpg' },
  { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', filename: 'sample3.jpg' },
];

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

/**
 * Gets a random element from any array.
 */
const getRandomElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Generates a single dummy ad object.
 */
const generateAdData = (city, state, country) => {
  const randomCategory = getRandomElement(CATEGORIES); // Get one of the 35 categories
  const randomUser = getRandomElement(DUMMY_USER_IDS);
  const randomPrice = Math.floor(Math.random() * 1000) + 10; 

  return {
    title: `For Sale: ${randomCategory.name} in ${city}`,
    description: LOREM_IPSUM,
    category: randomCategory.name, 
    price: randomPrice,
    location: {
      country: country,
      state: state,
      city: city,
    },
    images: DUMMY_IMAGES,
    user: new mongoose.Types.ObjectId(randomUser),
  };
};

// --- Main Seeding Function ---

const seedDatabase = async () => {
  let adsCreatedCount = 0;
  try {
    await connectDB();
    console.log('Database connected.');

    // 1. Clear existing ads
    await Ad.deleteMany({});
    console.log('Previous ads cleared.');

    const adsToCreate = [];

    // 2. Loop through the new, structured location data
    COUNTRIES.forEach((countryName) => {
      const statesInCountry = STATES[countryName] || [];
      
      statesInCountry.forEach((stateName) => {
        const citiesInState = CITIES[stateName] || [];
        
        citiesInState.forEach((cityName) => {
          // 3. Create 3 ads for *each* city
          for (let i = 0; i < 3; i++) {
            const newAd = generateAdData(cityName, stateName, countryName);
            adsToCreate.push(newAd);
          }
        });
      });
    });

    // 4. Insert all generated ads into the database
    if (adsToCreate.length > 0) {
      await Ad.insertMany(adsToCreate);
      adsCreatedCount = adsToCreate.length;
    }

    console.log(`✅ Success! Seeded ${adsCreatedCount} ads to the database.`);
    console.log(`(3 ads for each of the 838 cities across 50 countries)`);

  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  } finally {
    // 5. Disconnect from the database
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// --- Execute Script ---
seedDatabase();