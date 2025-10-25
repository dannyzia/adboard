const mongoose = require('mongoose');
const Ad = require('../models/Ad.model');
const User = require('../models/User.model');
require('dotenv').config();

const sampleAds = [
  {
    title: '2019 Honda Civic - Excellent Condition',
    description: 'Well-maintained Honda Civic with only 45,000 miles. Single owner, all service records available. Features include backup camera, Bluetooth connectivity, and excellent fuel economy. Clean title, no accidents.',
    category: 'Vehicles',
    price: 1850000, // $18,500 in cents
    location: {
      city: 'San Francisco',
      state: 'California',
      country: 'USA'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
        order: 0
      },
      {
        url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        order: 1
      }
    ],
    contactEmail: 'john.smith@email.com',
    contactPhone: '+1-415-555-0123',
    status: 'active',
    isFeatured: true
  },
  {
    title: 'MacBook Pro 16" M2 Max - Like New',
    description: 'MacBook Pro 16-inch with M2 Max chip, 32GB RAM, 1TB SSD. Purchased 6 months ago, barely used. Includes original box, charger, and AppleCare+ warranty until 2025. Perfect for professionals and creators.',
    category: 'Electronics',
    price: 280000, // $2,800
    location: {
      city: 'Seattle',
      state: 'Washington',
      country: 'USA'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        order: 0
      },
      {
        url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
        order: 1
      }
    ],
    contactEmail: 'sarah.j@email.com',
    contactPhone: '+1-206-555-0456',
    status: 'active',
    isFeatured: true
  },
  {
    title: 'Spacious 2BR Apartment - Downtown',
    description: 'Beautiful 2-bedroom apartment in the heart of downtown. Features hardwood floors, modern kitchen with stainless steel appliances, in-unit washer/dryer, and stunning city views. Pet-friendly building with gym and rooftop terrace.',
    category: 'Property',
    price: 250000, // $2,500/month
    location: {
      city: 'Austin',
      state: 'Texas',
      country: 'USA'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        order: 0
      },
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        order: 1
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        order: 2
      }
    ],
    contactEmail: 'mchen@realestate.com',
    contactPhone: '+1-512-555-0789',
    status: 'active'
  },
  {
    title: 'Vintage Leather Sofa - Mid-Century Modern',
    description: 'Authentic mid-century modern leather sofa in excellent condition. Tan leather with beautiful patina, solid wood legs. Professionally cleaned and conditioned. Dimensions: 84"L x 36"D x 32"H. A true statement piece!',
    category: 'Home & Garden',
    price: 120000, // $1,200
    location: {
      city: 'Portland',
      state: 'Oregon',
      country: 'USA'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        order: 0
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        order: 1
      }
    ],
    contactEmail: 'emma.w@email.com',
    contactPhone: '+1-503-555-0234',
    status: 'active'
  },
  {
    title: 'Golden Retriever Puppies - AKC Registered',
    description: 'Adorable Golden Retriever puppies ready for their forever homes! 8 weeks old, AKC registered, first shots and deworming completed. Parents are health tested and on-site. Puppies are well-socialized and great with kids.',
    category: 'Pets',
    price: 150000, // $1,500
    location: {
      city: 'Denver',
      state: 'Colorado',
      country: 'USA'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800',
        order: 0
      },
      {
        url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
        order: 1
      }
    ],
    contactEmail: 'lisa.puppies@email.com',
    contactPhone: '+1-720-555-0567',
    status: 'active',
    isFeatured: true
  },
  {
    title: 'Professional Web Developer Available',
    description: 'Experienced full-stack developer specializing in React, Node.js, and MongoDB. 5+ years of experience building modern web applications. Available for freelance projects, consulting, or part-time work. Portfolio available upon request.',
    category: 'Services',
    price: 7500, // $75/hour in cents
    location: {
      city: 'Boston',
      state: 'Massachusetts',
      country: 'USA'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        order: 0
      }
    ],
    contactEmail: 'david.dev@email.com',
    contactPhone: '+1-617-555-0890',
    status: 'active'
  },
  {
    title: 'Trek Mountain Bike - Full Suspension',
    description: 'Trek Fuel EX 8 mountain bike in great condition. Full suspension, 29" wheels, 12-speed Shimano drivetrain. Recently serviced with new brakes and tires. Perfect for trail riding. Size Large.',
    category: 'Sports',
    price: 180000, // $1,800
    location: {
      city: 'Boulder',
      state: 'Colorado',
      country: 'USA'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800',
        order: 0
      },
      {
        url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
        order: 1
      }
    ],
    contactEmail: 'tom.h@email.com',
    contactPhone: '+1-303-555-0345',
    status: 'active'
  },
  {
    title: 'Nikon Z6 II Camera Body + Lens Kit',
    description: 'Professional mirrorless camera in mint condition. Includes Nikon Z6 II body, 24-70mm f/4 lens, battery grip, 3 extra batteries, and camera bag. Less than 5,000 shutter count. Perfect for photography enthusiasts and professionals.',
    category: 'Electronics',
    price: 225000, // $2,250
    location: {
      city: 'Los Angeles',
      state: 'California',
      country: 'USA'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606980707345-885ea91e6dce?w=800',
        order: 0
      },
      {
        url: 'https://images.unsplash.com/photo-1606941369337-3611a3f6e2e9?w=800',
        order: 1
      }
    ],
    contactEmail: 'rachel.photo@email.com',
    contactPhone: '+1-310-555-0678',
    status: 'active'
  }
];

async function seedAds() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find a user to assign ads to (use the first user, or create dummy user)
    let user = await User.findOne({ role: 'user' });
    
    if (!user) {
      console.log('⚠️  No regular user found. Using admin user or first available user...');
      user = await User.findOne();
    }

    if (!user) {
      console.log('❌ No users found in database. Please run "npm run seed" first to create users.');
      process.exit(1);
    }

    console.log(`✅ Using user: ${user.email} for sample ads`);

    // Clear existing ads (optional - comment out if you want to keep existing ads)
    await Ad.deleteMany({});
    console.log('🗑️  Cleared existing ads');

    // Create ads with user reference and expiration date
    const adsToCreate = sampleAds.map(ad => ({
      ...ad,
      user: user._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      views: Math.floor(Math.random() * 500),
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last 7 days
    }));

    // Create ads one by one to trigger the pre-save hook for slug generation
    const createdAds = [];
    for (const adData of adsToCreate) {
      const ad = await Ad.create(adData);
      createdAds.push(ad);
    }
    
    console.log(`✅ Created ${createdAds.length} sample ads`);

    console.log('\n📊 Sample Ads Summary:');
    console.log('- Featured Ads:', createdAds.filter(ad => ad.isFeatured).length);
    console.log('- Categories:', [...new Set(createdAds.map(ad => ad.category))].join(', '));
    console.log('- Price Range: $' + Math.min(...createdAds.map(ad => ad.price))/100 + ' - $' + Math.max(...createdAds.map(ad => ad.price))/100);

    console.log('\n✨ Sample ads seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding ads:', error);
    process.exit(1);
  }
}

// Run the seeder
seedAds();
