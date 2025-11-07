/**
 * Simple seed script to insert example blog posts into the database.
 * Usage: node backend/scripts/seedBlogs.js
 * Make sure MONGODB_URI is set in your environment or in a .env file at the project root.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const Blog = require(path.join(__dirname, '..', 'models', 'Blog.model'));

const sampleBlogs = [
  {
    title: 'How to Get the Best Local Deals',
    excerpt: 'Tips and tricks for finding the best bargains in your city.',
    content: 'Local markets, negotiation, and timing can make a huge difference when buying second-hand items.\n\nStart by checking weekend markets and community boards...',
    author: { name: 'Editorial Team', _id: null },
    image: { url: '', alt: 'Local deals' },
    category: 'Guides',
    status: 'published',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // one week ago
  },
  {
    title: 'Selling Faster: Photos that Work',
    excerpt: 'A short guide to taking photos that help sell your items faster.',
    content: 'Good lighting and clear angles are essential. Include a close-up of any flaws and provide multiple angles...',
    author: { name: 'Photo Guru', _id: null },
    image: { url: '', alt: 'Selling tips' },
    category: 'Tips',
    status: 'published',
    publishDate: new Date()
  },
  {
    title: 'Upcoming Trends in Local Marketplaces',
    excerpt: 'What to watch for in the coming months.',
    content: 'Sustainability, refurbished electronics, and local delivery options are shaping the next wave of classifieds...',
    author: { name: 'Market Watch', _id: null },
    image: { url: '', alt: 'Trends' },
    category: 'News',
    status: 'published',
    publishDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) // in 3 days
  },
  {
    title: 'How to Price Your Used Furniture',
    excerpt: 'Practical pricing advice for furniture sellers',
    content: 'Research similar items, factor in condition, and be transparent in your description. Start slightly higher to allow negotiation...',
    author: { name: 'Home & Living', _id: null },
    image: { url: '', alt: 'Pricing furniture' },
    category: 'Guides',
    status: 'published',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  }
];

const uri = process.env.MONGODB_URI || '';
if (!uri) {
  console.error('MONGODB_URI not set. Set it in .env or environment variables.');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding');

    // Insert sample blogs
    const inserted = await Blog.insertMany(sampleBlogs);
    console.log(`Inserted ${inserted.length} blog posts.`);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  }
};

run();
