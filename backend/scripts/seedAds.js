const mongoose = require('mongoose');
const Ad = require('../models/Ad.model');
const User = require('../models/User.model');
require('dotenv').config();

// Categories from your config (matching categories.config.js)
const CATEGORIES = ['Jobs', 'Electronics', 'Services', 'Property', 'Events & Shows', 'Notices'];

// Sample data for each category
const AD_TEMPLATES = {
  Jobs: [
    { title: 'Senior Software Engineer', desc: 'Looking for experienced full-stack developer with 5+ years experience. Must know React, Node.js, and MongoDB. Competitive salary and benefits.', price: 12000000 },
    { title: 'Marketing Manager', desc: 'Lead our marketing team to drive growth. 3+ years experience in digital marketing, SEO, and content strategy required.', price: 9500000 },
    { title: 'Graphic Designer', desc: 'Creative designer needed for branding and marketing materials. Proficient in Adobe Creative Suite. Portfolio required.', price: 6500000 },
    { title: 'Sales Representative', desc: 'Motivated sales professional wanted. Base salary plus commission. Experience in B2B sales preferred.', price: 5500000 },
    { title: 'Customer Support Specialist', desc: 'Help our customers succeed! Excellent communication skills required. Remote work available.', price: 4500000 },
    { title: 'Data Analyst', desc: 'Analyze business data and create insights. SQL, Python, and Tableau experience required.', price: 8500000 },
    { title: 'Project Manager', desc: 'Manage multiple projects and teams. PMP certification preferred. Great leadership opportunity.', price: 10500000 },
    { title: 'UX/UI Designer', desc: 'Design beautiful and intuitive user interfaces. Figma and user research experience required.', price: 8000000 },
  ],
  Electronics: [
    { title: 'iPhone 14 Pro Max 256GB', desc: 'Like new condition, unlocked, includes original box and accessories. AppleCare+ until 2025.', price: 89999 },
    { title: 'MacBook Air M2 2023', desc: 'Barely used, 8GB RAM, 256GB SSD. Perfect for students and professionals. Includes charger.', price: 119999 },
    { title: 'Sony PlayStation 5', desc: 'Brand new, sealed box. Disc version with 2 controllers. Hard to find!', price: 49999 },
    { title: 'Samsung 55" 4K Smart TV', desc: 'Excellent condition, 4K UHD, smart features, HDR support. Moving sale!', price: 39999 },
    { title: 'Canon EOS R6 Camera', desc: 'Professional mirrorless camera, low shutter count, includes 24-70mm lens and accessories.', price: 199999 },
    { title: 'Herman Miller Aeron Chair', desc: 'Ergonomic office chair, size B, fully adjustable. Originally $1,500, selling for less.', price: 69999 },
    { title: 'iPad Pro 12.9" 2022', desc: 'M2 chip, 128GB, WiFi + Cellular. Includes Magic Keyboard and Apple Pencil.', price: 129999 },
    { title: 'Dyson V15 Vacuum Cleaner', desc: 'Latest model, powerful suction, great for pet hair. Barely used, like new.', price: 54999 },
  ],
  Services: [
    { title: 'Professional House Cleaning', desc: 'Reliable cleaning service for homes and offices. Eco-friendly products, insured and bonded.', price: 12000 },
    { title: 'Web Development Services', desc: 'Custom websites and web applications. Modern design, SEO optimized, responsive. Portfolio available.', price: 50000 },
    { title: 'Personal Training', desc: 'Certified personal trainer offering 1-on-1 sessions. Fitness assessment and custom workout plans included.', price: 6000 },
    { title: 'Plumbing Services', desc: 'Licensed plumber available for repairs, installations, and emergencies. Same-day service available.', price: 8000 },
    { title: 'Photography Services', desc: 'Professional photographer for events, portraits, and real estate. High-quality photos delivered quickly.', price: 15000 },
    { title: 'Tutoring - Math & Science', desc: 'Experienced tutor for high school and college students. Flexible scheduling, online or in-person.', price: 5000 },
    { title: 'Lawn Care & Landscaping', desc: 'Complete lawn maintenance, landscaping design, and seasonal cleanup. Free estimates.', price: 10000 },
    { title: 'Auto Repair Services', desc: 'Honest and affordable car repairs. Brake service, oil changes, diagnostics. 20+ years experience.', price: 7500 },
  ],
  Property: [
    { title: '3BR/2BA House for Rent', desc: 'Spacious family home with large backyard, updated kitchen, hardwood floors. Pet-friendly. $2,500/month.', price: 250000 },
    { title: 'Luxury Condo - Downtown', desc: 'Modern 2BR condo with city views, gym, pool, concierge. Walk to restaurants and shops. $3,200/month.', price: 320000 },
    { title: 'Studio Apartment Available', desc: 'Cozy studio with kitchenette, perfect for students or young professionals. Utilities included. $1,200/month.', price: 120000 },
    { title: 'Commercial Office Space', desc: '2,000 sq ft office in business district. Reception area, conference rooms, parking. $4,000/month.', price: 400000 },
    { title: 'Beachfront Villa for Sale', desc: 'Stunning 4BR oceanfront property with private beach access, infinity pool. Must see! $1.2M.', price: 120000000 },
    { title: 'Investment Property - Duplex', desc: 'Great rental income! Two 2BR units, good condition, tenants in place. $450,000.', price: 45000000 },
    { title: 'Land for Sale - 5 Acres', desc: 'Build your dream home! Beautiful wooded lot with creek, utilities available. $120,000.', price: 12000000 },
    { title: 'Townhouse for Rent', desc: '3BR/2.5BA townhouse in gated community. HOA includes pool, gym, and maintenance. $2,800/month.', price: 280000 },
  ],
  'Events & Shows': [
    { title: 'Live Music Concert - Jazz Night', desc: 'Join us for an evening of smooth jazz with local musicians. Drinks and appetizers available. $25/person.', price: 2500 },
    { title: 'Community Yard Sale', desc: 'Huge neighborhood yard sale this Saturday 8am-2pm. Furniture, toys, clothes, and more! Free admission.', price: 0 },
    { title: 'Tech Meetup - AI Discussion', desc: 'Monthly tech meetup discussing AI and machine learning. Pizza and networking 6-8pm. RSVP required.', price: 0 },
    { title: 'Yoga Workshop - All Levels', desc: 'Introduction to yoga and meditation. Bring your mat. Beginners welcome! $20 drop-in.', price: 2000 },
    { title: 'Food Festival - This Weekend', desc: 'Taste dishes from 50+ local restaurants. Live music, family-friendly. Tickets $15 in advance.', price: 1500 },
    { title: 'Charity Run 5K', desc: 'Annual charity run to support local schools. All ages welcome, prizes for winners. Register now!', price: 3000 },
    { title: 'Art Exhibition Opening', desc: 'Local artists showcase their work. Wine and cheese reception Friday evening. Free entry.', price: 0 },
    { title: 'Farmers Market - Every Sunday', desc: 'Fresh produce, baked goods, crafts, and more. Support local farmers! Open 9am-1pm.', price: 0 },
  ],
  Notices: [
    { title: 'Lost Dog - Golden Retriever', desc: 'Lost in downtown area on Oct 20. Brown collar, answers to Max. Reward offered. Please call if found!', price: 0 },
    { title: 'Free Kittens to Good Home', desc: '8-week-old kittens need loving homes. Litter trained, playful and healthy. Two orange, one gray.', price: 0 },
    { title: 'Seeking Roommate', desc: 'Clean, responsible roommate wanted. 2BR apartment, your own bathroom. $800/month + utilities.', price: 80000 },
    { title: 'Community Garage Sale', desc: 'Moving sale - everything must go! Furniture, appliances, tools, and household items. Saturday 7am.', price: 0 },
    { title: 'Looking for Carpool Partner', desc: 'Daily commute from suburbs to downtown. Share gas costs. Leave 8am, return 5:30pm. Contact me!', price: 0 },
    { title: 'Free Firewood', desc: 'Oak and pine firewood available for pickup. Cut and split, you haul. First come, first served!', price: 0 },
    { title: 'Seeking Band Members', desc: 'Rock band looking for drummer and bassist. Weekly rehearsals, aim to gig locally. All levels welcome!', price: 0 },
    { title: 'Study Group - Accounting', desc: 'Forming study group for CPA exam. Meet twice weekly at library. Serious students only please.', price: 0 },
  ]
};

// Countries, states, and cities from your constants
const LOCATIONS = {
  'United States': {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
    'Illinois': ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford'],
  },
  'Canada': {
    'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'],
    'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil'],
    'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'],
    'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'],
  },
  'United Kingdom': {
    'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
    'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'],
    'Wales': ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry'],
  },
  'Australia': {
    'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Maitland'],
    'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton'],
    'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns'],
  }
};

// Sample images from Unsplash
const SAMPLE_IMAGES = {
  Jobs: [
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
  ],
  Electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  ],
  Services: [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
  ],
  Property: [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  ],
  'Events & Shows': [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
  ],
  Notices: [
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
  ]
};

// Generate random email
function generateEmail(index) {
  const names = ['john', 'jane', 'mike', 'sarah', 'david', 'emma', 'chris', 'lisa', 'tom', 'mary'];
  const domains = ['email.com', 'mail.com', 'example.com', 'test.com'];
  return `${names[index % names.length]}${Math.floor(index / names.length)}@${domains[index % domains.length]}`;
}

// Generate random phone
function generatePhone(countryCode) {
  const num = Math.floor(Math.random() * 9000000) + 1000000;
  return `${countryCode}-555-${String(num).slice(0, 4)}`;
}

// Generate 2400 ads
function generateAds() {
  const ads = [];
  const totalAds = 2400;
  const adsPerCategory = Math.floor(totalAds / CATEGORIES.length);
  
  let adIndex = 0;
  
  for (const category of CATEGORIES) {
    const templates = AD_TEMPLATES[category];
    const images = SAMPLE_IMAGES[category];
    
    for (let i = 0; i < adsPerCategory; i++) {
      // Cycle through templates
      const template = templates[i % templates.length];
      
      // Cycle through locations
      const countries = Object.keys(LOCATIONS);
      const country = countries[adIndex % countries.length];
      const states = Object.keys(LOCATIONS[country]);
      const state = states[(adIndex * 3) % states.length];
      const cities = LOCATIONS[country][state];
      const city = cities[(adIndex * 7) % cities.length];
      
      // Select images
      const numImages = Math.floor(Math.random() * 3) + 1; // 1-3 images
      const adImages = [];
      for (let j = 0; j < numImages; j++) {
        adImages.push({
          url: images[j % images.length],
          order: j
        });
      }
      
      // Country codes for phone
      const countryCode = country === 'United States' ? '+1' : 
                         country === 'Canada' ? '+1' :
                         country === 'United Kingdom' ? '+44' : '+61';
      
      // Random dates within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      
      // Featured (10% chance)
      const isFeatured = Math.random() < 0.1;
      
      ads.push({
        title: `${template.title} - ${city}`,
        description: template.desc,
        category,
        price: template.price,
        location: {
          city,
          state,
          country
        },
        images: adImages,
        contactEmail: generateEmail(adIndex),
        contactPhone: generatePhone(countryCode),
        status: 'active',
        isFeatured,
        views: Math.floor(Math.random() * 500),
        createdAt,
        expiresAt: new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
      });
      
      adIndex++;
    }
  }
  
  return ads;
}

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

    // Generate 2400 ads
    console.log('🔄 Generating 2400 sample ads...');
    const generatedAds = generateAds();
    
    // Add user reference to all ads
    const adsToCreate = generatedAds.map(ad => ({
      ...ad,
      user: user._id
    }));

    console.log('💾 Inserting ads into database...');
    
    // Insert ads one by one to trigger slug generation via pre-save hook
    const createdAds = [];
    let successCount = 0;
    
    for (let i = 0; i < adsToCreate.length; i++) {
      try {
        const ad = await Ad.create(adsToCreate[i]);
        createdAds.push(ad);
        successCount++;
        
        // Show progress every 100 ads
        if ((i + 1) % 100 === 0) {
          console.log(`   Inserted ${i + 1}/${adsToCreate.length} ads...`);
        }
      } catch (error) {
        console.error(`   Error inserting ad ${i + 1}:`, error.message);
      }
    }
    
    console.log(`\n✅ Successfully created ${successCount}/${adsToCreate.length} ads`);

    console.log('\n📊 Sample Ads Summary:');
    console.log('- Total Ads:', createdAds.length);
    console.log('- Featured Ads:', createdAds.filter(ad => ad.isFeatured).length);
    
    // Count by category
    const categoryCounts = {};
    createdAds.forEach(ad => {
      categoryCounts[ad.category] = (categoryCounts[ad.category] || 0) + 1;
    });
    console.log('- Categories:', Object.entries(categoryCounts).map(([cat, count]) => `${cat} (${count})`).join(', '));
    
    // Count by country
    const countryCounts = {};
    createdAds.forEach(ad => {
      countryCounts[ad.location.country] = (countryCounts[ad.location.country] || 0) + 1;
    });
    console.log('- Countries:', Object.entries(countryCounts).map(([country, count]) => `${country} (${count})`).join(', '));
    
    console.log('\n✨ Database seeded successfully with 2400 ads!');
    console.log('📍 Ads distributed across all categories, countries, states, and cities');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding ads:', error);
    process.exit(1);
  }
}

// Run the seeder
seedAds();
