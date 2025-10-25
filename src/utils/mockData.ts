import { Ad, CategoryType } from '../types';

const categories: CategoryType[] = ['Jobs', 'Products', 'Services', 'Real Estate', 'Events', 'Notices'];
const locations = [
  // United States - Major cities
  { country: 'United States', state: 'California', city: 'Los Angeles' },
  { country: 'United States', state: 'California', city: 'San Francisco' },
  { country: 'United States', state: 'California', city: 'San Diego' },
  { country: 'United States', state: 'New York', city: 'New York City' },
  { country: 'United States', state: 'Texas', city: 'Austin' },
  { country: 'United States', state: 'Texas', city: 'Houston' },
  { country: 'United States', state: 'Florida', city: 'Miami' },
  { country: 'United States', state: 'Illinois', city: 'Chicago' },
  { country: 'United States', state: 'Washington', city: 'Seattle' },
  { country: 'United States', state: 'Georgia', city: 'Atlanta' },
  // Canada
  { country: 'Canada', state: 'Ontario', city: 'Toronto' },
  { country: 'Canada', state: 'Quebec', city: 'Montreal' },
  { country: 'Canada', state: 'British Columbia', city: 'Vancouver' },
  { country: 'Canada', state: 'Alberta', city: 'Calgary' },
  // United Kingdom
  { country: 'United Kingdom', state: 'England', city: 'London' },
  { country: 'United Kingdom', state: 'England', city: 'Manchester' },
  { country: 'United Kingdom', state: 'Scotland', city: 'Edinburgh' },
  { country: 'United Kingdom', state: 'Wales', city: 'Cardiff' },
  // Australia
  { country: 'Australia', state: 'New South Wales', city: 'Sydney' },
  { country: 'Australia', state: 'Victoria', city: 'Melbourne' },
  { country: 'Australia', state: 'Queensland', city: 'Brisbane' },
  // India
  { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
  { country: 'India', state: 'Delhi', city: 'New Delhi' },
  { country: 'India', state: 'Karnataka', city: 'Bangalore' },
  { country: 'India', state: 'Tamil Nadu', city: 'Chennai' },
  // Germany
  { country: 'Germany', state: 'Berlin', city: 'Berlin' },
  { country: 'Germany', state: 'Bavaria', city: 'Munich' },
  { country: 'Germany', state: 'Hesse', city: 'Frankfurt' },
  // France
  { country: 'France', state: 'Île-de-France', city: 'Paris' },
  { country: 'France', state: 'Provence-Alpes-Côte d\'Azur', city: 'Marseille' },
  { country: 'France', state: 'Auvergne-Rhône-Alpes', city: 'Lyon' },
  // Spain
  { country: 'Spain', state: 'Madrid', city: 'Madrid' },
  { country: 'Spain', state: 'Catalonia', city: 'Barcelona' },
  { country: 'Spain', state: 'Andalusia', city: 'Seville' },
  // Italy
  { country: 'Italy', state: 'Lazio', city: 'Rome' },
  { country: 'Italy', state: 'Lombardy', city: 'Milan' },
  { country: 'Italy', state: 'Campania', city: 'Naples' },
  // Brazil
  { country: 'Brazil', state: 'São Paulo', city: 'São Paulo' },
  { country: 'Brazil', state: 'Rio de Janeiro', city: 'Rio de Janeiro' },
  // Mexico
  { country: 'Mexico', state: 'Mexico City', city: 'Mexico City' },
  { country: 'Mexico', state: 'Jalisco', city: 'Guadalajara' },
  // Japan
  { country: 'Japan', state: 'Tokyo', city: 'Tokyo' },
  { country: 'Japan', state: 'Osaka', city: 'Osaka' },
  // China
  { country: 'China', state: 'Beijing', city: 'Beijing' },
  { country: 'China', state: 'Shanghai', city: 'Shanghai' },
  { country: 'China', state: 'Guangdong', city: 'Guangzhou' },
  // UAE
  { country: 'UAE', state: 'Dubai', city: 'Dubai' },
  { country: 'UAE', state: 'Abu Dhabi', city: 'Abu Dhabi' },
  // Singapore
  { country: 'Singapore', state: 'Central Region', city: 'Singapore City' },
  // South Africa
  { country: 'South Africa', state: 'Gauteng', city: 'Johannesburg' },
  { country: 'South Africa', state: 'Western Cape', city: 'Cape Town' },
  // Other countries
  { country: 'Netherlands', state: 'North Holland', city: 'Amsterdam' },
  { country: 'Sweden', state: 'Stockholm', city: 'Stockholm' },
  { country: 'Switzerland', state: 'Zürich', city: 'Zürich' },
  { country: 'Turkey', state: 'Istanbul', city: 'Istanbul' },
  { country: 'Thailand', state: 'Bangkok', city: 'Bangkok' },
  { country: 'Malaysia', state: 'Kuala Lumpur', city: 'Kuala Lumpur' },
  { country: 'Indonesia', state: 'Jakarta', city: 'Jakarta' },
  { country: 'Philippines', state: 'Metro Manila', city: 'Manila' },
  { country: 'Vietnam', state: 'Ho Chi Minh City', city: 'Ho Chi Minh City' },
  { country: 'New Zealand', state: 'Auckland', city: 'Auckland' },
  { country: 'Argentina', state: 'Buenos Aires', city: 'Buenos Aires' },
  { country: 'Chile', state: 'Santiago', city: 'Santiago' },
  { country: 'Colombia', state: 'Bogotá', city: 'Bogotá' },
];

const titles: Record<CategoryType, string[]> = {
  Jobs: ['Senior Software Engineer', 'Marketing Manager', 'UX Designer', 'Data Analyst', 'Sales Representative'],
  Products: ['MacBook Pro 16"', 'Wireless Headphones', 'Gaming PC', 'Smart Watch', 'DSLR Camera'],
  Services: ['House Cleaning', 'Pro Plumbing 24/7', 'Pet Grooming', 'Tutoring Services', 'Web Design'],
  'Real Estate': ['2BR Apartment', 'Luxury 3BR Condo', 'Studio Downtown', 'Family House', 'Office Space'],
  Events: ['Tech Conference 2025', 'Food Festival', 'Yoga Workshop', 'Music Concert', 'Art Exhibition'],
  Notices: ['Lost Dog - Reward', 'Found Keys', 'Roommate Wanted', 'Free Piano', 'Community Meeting'],
};

const descriptions: Record<CategoryType, string[]> = {
  Jobs: [
    'Full-stack developer, remote work available',
    '5+ years experience, B2B SaaS background',
    'Remote position, Figma expert required',
    'SQL, Python, Tableau experience needed',
    'Commission + base salary offered',
  ],
  Products: [
    'Like new, 64GB RAM, 2TB storage included',
    'Sony WH-1000XM5, excellent condition',
    'RTX 4090, i9-13900K, custom water cooling',
    'Apple Watch Series 9, GPS + Cellular',
    'Canon EOS R5, 2 lenses included',
  ],
  Services: [
    'Professional, eco-friendly products',
    'Emergency services, licensed and insured',
    'All breeds, gentle care provided',
    'Math, Science, English - All grades',
    'Custom websites, SEO optimization',
  ],
  'Real Estate': [
    'Downtown, updated kitchen and bath',
    'Penthouse, ocean view, luxury finishes',
    'Walking distance to subway, utilities included',
    '4BR, 3BA, large backyard, great schools',
    '1200 sqft, parking included, modern',
  ],
  Events: [
    'Industry leaders, networking opportunities',
    '50+ vendors, live music, family friendly',
    'Beginner friendly, all equipment provided',
    'Outdoor venue, multiple stages',
    'Local artists, wine and cheese reception',
  ],
  Notices: [
    'Golden Retriever, Max, last seen near park',
    'Car keys with blue keychain',
    'Quiet, non-smoker preferred',
    'Must be able to move it yourself',
    'Discussion on new park proposal',
  ],
};

const images = [
  'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
];

const link1Options = [
  'https://company.com/apply',
  'https://jobs.indeed.com/position',
  'https://linkedin.com/jobs/view',
  'https://website.com/details',
  'https://facebook.com/marketplace',
  'https://ebay.com/item',
  'https://amazon.com/product',
  'https://craigslist.org/listing',
  'https://booking.com/venue',
  'https://eventbrite.com/event',
  'https://meetup.com/group',
  'https://zillow.com/property',
  'https://realtor.com/home',
  'https://apartments.com/unit',
];

const link2Options = [
  'https://instagram.com/profile',
  'https://twitter.com/user',
  'https://youtube.com/video',
  'https://github.com/repo',
  'https://drive.google.com/file',
  'https://docs.google.com/document',
  'https://calendly.com/schedule',
  'https://map.google.com/location',
];

export function generateMockAd(index: number): Ad {
  const category = categories[index % categories.length];
  const location = locations[index % locations.length];
  const titleIndex = index % titles[category].length;
  
  const now = new Date();
  const hoursAgo = (index * 3) % 72; // Consistent time based on index
  const createdAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
  const expiresAt = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);

  // 70% of ads have link1, 40% have link2
  const hasLink1 = index % 10 < 7;
  const hasLink2 = index % 10 < 4;

  return {
    _id: `mock-${index}`,
    title: titles[category][titleIndex],
    shortDescription: descriptions[category][titleIndex],
    fullDescription: `${descriptions[category][titleIndex]}\n\nThis is a detailed description with more information about this listing. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nKey features:\n- Feature 1\n- Feature 2\n- Feature 3\n\nContact us for more details!`,
    category,
    price: category === 'Products' || category === 'Real Estate' ? ((index * 37) % 30) * 100 + 100 : undefined, // Consistent price based on index
    images: [images[index % images.length]],
    location,
    links: {
      link1: hasLink1 ? link1Options[index % link1Options.length] : undefined,
      link2: hasLink2 ? link2Options[index % link2Options.length] : undefined,
    },
    contact: {
      email: 'contact@example.com',
      phone: '+1 (555) 123-4567',
    },
    userId: 'mock-user-1',
    views: (index * 17) % 2000, // Consistent views based on index
    isFeatured: index % 5 === 0, // Every 5th ad is featured
    status: 'active',
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export function generateMockAds(count: number, startIndex: number = 0): Ad[] {
  return Array.from({ length: count }, (_, i) => generateMockAd(startIndex + i));
}
