const mongoose = require('mongoose');
require('dotenv').config();
const Ad = require('../models/Ad.model');
const { COUNTRIES, STATES, CITIES } = require('../config/locations.config');
const User = require('../models/User.model');

async function seedLocations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find an admin user to assign as ad owner (or use first user)
    let user = await User.findOne({ role: 'admin' });
    if (!user) user = await User.findOne();
    if (!user) throw new Error('No user found to assign ads');

    // Get valid categories from backend config
    const { getCategoryValues } = require('../config/categories.config');
    const validCategories = getCategoryValues();
    let ads = [];
    for (const country of COUNTRIES) {
      const states = STATES[country] || [];
      for (const state of states) {
        const cities = CITIES[state] || [];
        for (const city of cities) {
          const randomCategory = validCategories[Math.floor(Math.random() * validCategories.length)];
          const title = `Test Ad in ${city}, ${state}, ${country}`;
          // Generate slug: title + city + state + country + random string
          const slugBase = `${title}-${city}-${state}-${country}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const slug = `${slugBase}-${Math.random().toString(36).substring(2, 8)}-${Date.now()}`;
          ads.push({
            title,
            description: `Dummy ad for ${city}, ${state}, ${country}`,
            price: Math.floor(Math.random() * 1000) + 10,
            currency: 'USD',
            category: randomCategory,
            location: { country, state, city },
            images: [],
            user: user._id,
            contactEmail: user.email,
            status: 'active',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            slug,
          });
        }
      }
    }

    if (ads.length) {
      await Ad.insertMany(ads);
      console.log(`Inserted ${ads.length} dummy ads with location data.`);
    } else {
      console.log('No ads to insert. Check location data.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding locations:', err);
    process.exit(1);
  }
}

seedLocations();
