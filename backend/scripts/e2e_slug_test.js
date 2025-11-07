const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

// Ensure models can be required from this script location
const Ad = require(path.join(__dirname, '..', 'models', 'Ad.model'));
const SlugCounter = require(path.join(__dirname, '..', 'models', 'Slug.model'));
const { generateUniqueSlug } = require(path.join(__dirname, '..', 'utils', 'slug.util'));

(async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to in-memory MongoDB for E2E slug test');

  // Clean up
  await Ad.deleteMany({});
  await SlugCounter.deleteMany({});

  const title = 'Test Product for Slug';
  const username = 'Jane Doe';

  // Helper to create an ad using the slug util
  const createAd = async () => {
    const slug = await generateUniqueSlug(Ad, title, username);
    const ad = await Ad.create({
      title,
      description: 'E2E test ad',
      price: 10,
      currency: 'USD',
      category: 'Jobs',
      location: { country: 'USA', state: 'CA', city: 'San Francisco' },
      images: [{ url: 'https://example.com/image.jpg' }],
      user: new mongoose.Types.ObjectId(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      slug
    });
    return ad;
  };

  try {
    // Create two ads concurrently to test atomic reservation
    const results = await Promise.all([createAd(), createAd()]);
    console.log('Created slugs:', results.map(r => r.slug));

    // Fetch one by slug
    const fetched = await Ad.findOne({ slug: results[0].slug }).lean();
    console.log('Fetched ad by slug:', fetched ? { _id: fetched._id.toString(), slug: fetched.slug } : null);

    // Show SlugCounter state
    const counters = await SlugCounter.find({}).lean();
    console.log('Slug counters:', counters.map(c => ({ base: c.base, seq: c.seq })));

  } catch (err) {
    console.error('E2E slug test failed:', err);
  } finally {
    await mongoose.disconnect();
    await mongod.stop();
    console.log('E2E slug test completed and cleaned up');
  }

  process.exit(0);
})();
