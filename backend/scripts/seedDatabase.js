const mongoose = require('mongoose');
require('dotenv').config();
const SubscriptionPlan = require('../models/SubscriptionPlan.model');
const User = require('../models/User.model');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data (optional - comment out if you don't want to clear)
    await SubscriptionPlan.deleteMany({});
    console.log('🗑️  Cleared existing subscription plans');
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');
    
    // Create subscription plans
    const plans = [
      {
        name: 'Free',
        tier: 'free',
        price: 0,
        currency: 'USD',
        interval: 'month',
        features: {
          adsPerMonth: 5,
          listingDuration: 7,
          imagesPerAd: 2,
          maxImageSize: 2,
          isFeatured: false,
          hasAnalytics: false,
          hasPrioritySupport: false,
          hasPriorityPlacement: false,
          hasApiAccess: false,
          hasCustomBranding: false,
          allowedCategories: []
        },
        isActive: true,
        isVisible: true,
        displayOrder: 1,
        metadata: {
          description: 'Perfect for trying out AdBoard',
          badge: '',
          color: '#6B7280'
        }
      },
      {
        name: 'Basic',
        tier: 'basic',
        price: 999, // $9.99
        currency: 'USD',
        interval: 'month',
        features: {
          adsPerMonth: 20,
          listingDuration: 30,
          imagesPerAd: 5,
          maxImageSize: 5,
          isFeatured: true,
          hasAnalytics: true,
          hasPrioritySupport: false,
          hasPriorityPlacement: false,
          hasApiAccess: false,
          hasCustomBranding: false,
          allowedCategories: []
        },
        isActive: true,
        isVisible: true,
        displayOrder: 2,
        metadata: {
          description: 'For regular sellers and businesses',
          badge: 'POPULAR',
          color: '#3B82F6'
        }
      },
      {
        name: 'Pro',
        tier: 'pro',
        price: 2999, // $29.99
        currency: 'USD',
        interval: 'month',
        features: {
          adsPerMonth: 'unlimited',
          listingDuration: 90,
          imagesPerAd: 10,
          maxImageSize: 10,
          isFeatured: true,
          hasAnalytics: true,
          hasPrioritySupport: true,
          hasPriorityPlacement: true,
          hasApiAccess: true,
          hasCustomBranding: true,
          allowedCategories: []
        },
        isActive: true,
        isVisible: true,
        displayOrder: 3,
        metadata: {
          description: 'For power users and growing businesses',
          badge: 'BEST VALUE',
          color: '#8B5CF6'
        }
      }
    ];
    
    const createdPlans = await SubscriptionPlan.insertMany(plans);
    console.log(`✅ Created ${createdPlans.length} subscription plans`);
    
    // Create admin user
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      const freePlan = createdPlans.find(p => p.tier === 'free');
      
      const admin = await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@adboard.com',
        password: process.env.ADMIN_PASSWORD || 'admin1122',
        role: 'admin',
        subscription: {
          planId: freePlan._id,
          tier: 'free',
          status: 'active',
          adsRemaining: 5,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
      
      console.log('✅ Created admin user');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin1122'}`);
    } else {
      console.log('ℹ️  Admin user already exists');
    }
    
    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
