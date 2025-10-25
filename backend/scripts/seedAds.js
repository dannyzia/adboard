const mongoose = require('mongoose');
const Ad = require('../models/Ad.model');
const User = require('../models/User.model');
require('dotenv').config();

// Categories from your config (matching categories.config.js)
const CATEGORIES = [
  'Electronics', 'Cars & Trucks', 'Motorcycles', 'Boats & Marine', 'RVs & Campers',
  'Houses for Sale', 'Apartments for Rent', 'Commercial Property', 'Vacation Rentals',
  'Jobs', 'Services', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Pets',
  'Food & Dining', 'Travel & Resorts', 'Deals & Offers', 'Tickets', 'Events & Shows',
  'Auction', 'Buy & Sell', 'Notices', 'Health & Beauty', 'Baby & Kids', 'Arts & Crafts',
  'Musical Instruments', 'Office Supplies', 'Digital Products', 'Software & Apps',
  'Tutoring & Lessons', 'Home Repair', 'Free', 'Other'
];

// Sample data for each category
const AD_TEMPLATES = {
  Electronics: [
    { title: 'iPhone 14 Pro Max 256GB', desc: 'Like new condition, unlocked, includes original box and accessories. AppleCare+ until 2025.', price: 89999 },
    { title: 'MacBook Air M2 2023', desc: 'Barely used, 8GB RAM, 256GB SSD. Perfect for students and professionals. Includes charger.', price: 119999 },
    { title: 'Sony PlayStation 5', desc: 'Brand new, sealed box. Disc version with 2 controllers. Hard to find!', price: 49999 },
    { title: 'Samsung 55" 4K Smart TV', desc: 'Excellent condition, 4K UHD, smart features, HDR support. Moving sale!', price: 39999 },
    { title: 'Canon EOS R6 Camera', desc: 'Professional mirrorless camera, low shutter count, includes 24-70mm lens and accessories.', price: 199999 },
    { title: 'iPad Pro 12.9" 2022', desc: 'M2 chip, 128GB, WiFi + Cellular. Includes Magic Keyboard and Apple Pencil.', price: 129999 },
    { title: 'Dyson V15 Vacuum Cleaner', desc: 'Latest model, powerful suction, great for pet hair. Barely used, like new.', price: 54999 },
    { title: 'AirPods Pro 2nd Gen', desc: 'Brand new, sealed. Active noise cancellation, spatial audio. Perfect gift!', price: 24999 },
  ],
  'Cars & Trucks': [
    { title: '2019 Honda Civic EX', desc: 'Well-maintained, 45k miles, one owner, clean title. Excellent fuel economy, backup camera.', price: 1850000 },
    { title: '2020 Ford F-150 XLT', desc: '4x4, crew cab, tow package. Only 30k miles, garage kept. Perfect work truck!', price: 3500000 },
    { title: '2021 Toyota Camry LE', desc: 'Low miles, great condition. Reliable and fuel efficient. Still under warranty.', price: 2200000 },
    { title: '2018 Tesla Model 3', desc: 'Long range, autopilot, premium interior. Free supercharging included!', price: 2800000 },
    { title: '2017 Jeep Wrangler Unlimited', desc: 'Lifted, new tires, hardtop and soft top. Ready for adventure!', price: 2500000 },
    { title: '2022 Mazda CX-5', desc: 'Premium package, leather seats, sunroof. Like new with only 12k miles.', price: 2900000 },
    { title: '2019 Chevrolet Silverado', desc: 'Heavy duty, diesel engine, towing package. Perfect for work or play.', price: 3200000 },
    { title: '2020 Honda Accord Sport', desc: 'Turbo engine, manual transmission, low miles. Fun to drive!', price: 2400000 },
  ],
  Motorcycles: [
    { title: 'Harley Davidson Street 750', desc: 'Classic cruiser, perfect for beginners. Well maintained, new tires. Ready to ride!', price: 650000 },
    { title: 'Yamaha YZF-R6', desc: 'Sport bike, track ready, low miles. Upgraded exhaust and suspension.', price: 850000 },
    { title: 'Honda Gold Wing Tour', desc: 'Touring bike with all options. Comfortable for long rides, excellent condition.', price: 1800000 },
    { title: 'Kawasaki Ninja 400', desc: 'Perfect beginner sport bike. Fuel efficient, reliable, one owner.', price: 450000 },
    { title: 'BMW R 1250 GS', desc: 'Adventure touring motorcycle. Premium package, panniers, crash bars included.', price: 1500000 },
    { title: 'Ducati Monster 821', desc: 'Naked sport bike, aggressive styling. Termignoni exhaust, low miles.', price: 950000 },
    { title: 'Indian Scout Bobber', desc: 'American cruiser, blacked out, custom seat. Turns heads everywhere!', price: 1200000 },
    { title: 'Suzuki V-Strom 650', desc: 'Versatile adventure bike, luggage included. Great for commuting or touring.', price: 700000 },
  ],
  'Boats & Marine': [
    { title: '24ft Center Console Boat', desc: 'Fishing boat with T-top, twin engines, GPS, fish finder. Trailer included!', price: 4500000 },
    { title: 'Sea-Doo Jet Ski GTI', desc: 'Low hours, 3-seater, very stable. Perfect for family fun on the water.', price: 850000 },
    { title: 'Pontoon Boat 22ft', desc: 'Party barge with sound system, coolers, Bimini top. Seats 12 comfortably.', price: 2500000 },
    { title: 'Kayak - Perception Pescador', desc: 'Fishing kayak, sit-on-top, stable. Includes paddle and fishing rod holders.', price: 65000 },
    { title: '18ft Bowrider Boat', desc: 'Great family boat, wakeboard tower, stereo. Seats 8, includes trailer.', price: 1800000 },
    { title: 'Sailboat - Catalina 27', desc: 'Classic cruiser, sleeps 4, well maintained. Ready for coastal cruising.', price: 1200000 },
    { title: 'Inflatable Raft - Mercury', desc: 'Heavy duty, seats 6, includes oars and pump. Perfect for rivers or lakes.', price: 45000 },
    { title: 'Bass Boat 21ft', desc: 'Tournament ready, trolling motor, live wells, rod lockers. Very fast!', price: 3200000 },
  ],
  'RVs & Campers': [
    { title: '2020 Airstream Flying Cloud', desc: 'Luxury travel trailer, 25ft, solar panels, full bathroom. Sleeps 4.', price: 8500000 },
    { title: 'Class A Motorhome', desc: '2019 model, 35ft, diesel pusher, 2 slide-outs. Like a home on wheels!', price: 15000000 },
    { title: 'Pop-up Camper - Forest River', desc: 'Lightweight, easy to tow, sleeps 6. Perfect for weekend camping trips.', price: 650000 },
    { title: 'Fifth Wheel RV 2021', desc: '40ft, residential fridge, king bed, washer/dryer prep. Luxury living!', price: 6500000 },
    { title: 'Teardrop Trailer', desc: 'Compact and cute! Sleeps 2, kitchenette, easy to tow with any vehicle.', price: 1200000 },
    { title: 'Class C RV 2018', desc: '28ft, sleeps 6, low miles. Great for family adventures, well maintained.', price: 7500000 },
    { title: 'Toy Hauler 2022', desc: '24ft, rear ramp, fuel station. Bring your ATVs or motorcycles!', price: 4500000 },
    { title: 'VW Westfalia Camper Van', desc: 'Classic 1985 model, restored, pop-top, kitchenette. Turns heads!', price: 3500000 },
  ],
  'Houses for Sale': [
    { title: '4BR Family Home', desc: 'Spacious 2,500 sq ft home, updated kitchen, hardwood floors, large backyard. Move-in ready!', price: 45000000 },
    { title: 'Modern Luxury Home', desc: '5BR/4BA, smart home features, pool, 3-car garage. Stunning architecture!', price: 85000000 },
    { title: 'Cozy Starter Home', desc: '3BR/2BA, great neighborhood, close to schools. Perfect for first-time buyers!', price: 28000000 },
    { title: 'Victorian Mansion', desc: 'Historic home, 6BR, original details, wrap-around porch. On 2 acres!', price: 95000000 },
    { title: 'Waterfront Property', desc: 'Lakefront home, private dock, 4BR, floor-to-ceiling windows. Amazing views!', price: 125000000 },
    { title: 'Ranch Style Home', desc: 'Single story, 3BR, open floor plan, updated throughout. Low maintenance yard.', price: 35000000 },
    { title: 'New Construction', desc: '4BR/3BA, builder warranties, energy efficient. Pick your finishes!', price: 52000000 },
    { title: 'Investment Property', desc: 'Duplex, both units rented, excellent cash flow. Solid investment!', price: 38000000 },
  ],
  'Apartments for Rent': [
    { title: '2BR Downtown Apartment', desc: 'Modern finishes, stainless appliances, gym access. Walk to everything! $2,200/mo', price: 220000 },
    { title: 'Luxury Studio Loft', desc: 'High ceilings, exposed brick, updated kitchen. Utilities included. $1,800/mo', price: 180000 },
    { title: '3BR Family Apartment', desc: 'Spacious layout, laundry in unit, parking included. Pet-friendly! $2,800/mo', price: 280000 },
    { title: '1BR Garden Apartment', desc: 'Ground floor, patio access, quiet complex. Heat and hot water included. $1,400/mo', price: 140000 },
    { title: 'Penthouse 2BR', desc: 'Top floor, city views, rooftop access, concierge service. $4,500/mo', price: 450000 },
    { title: 'Affordable Studio', desc: 'Perfect for students, close to university, all utilities included. $950/mo', price: 95000 },
    { title: '2BR with Balcony', desc: 'Pool, fitness center, parking, updated appliances. Great location! $2,400/mo', price: 240000 },
    { title: 'Furnished Executive Apt', desc: '2BR, short-term lease available, all utilities, WiFi included. $3,200/mo', price: 320000 },
  ],
  'Commercial Property': [
    { title: 'Retail Space Downtown', desc: '2,000 sq ft, high foot traffic, large windows. Perfect for restaurant or retail. $6,000/mo', price: 600000 },
    { title: 'Office Building for Sale', desc: '10,000 sq ft, multiple suites, parking lot. Great investment property! $1.8M', price: 180000000 },
    { title: 'Warehouse Space', desc: '5,000 sq ft, loading dock, high ceilings, zoned industrial. $4,500/mo', price: 450000 },
    { title: 'Medical Office Suite', desc: 'Turn-key, reception area, 4 exam rooms, X-ray room. $8,000/mo', price: 800000 },
    { title: 'Restaurant Space', desc: 'Full kitchen, dining for 80, liquor license available. Prime location! $10,000/mo', price: 1000000 },
    { title: 'Strip Mall - Investment', desc: '8 units, fully leased, great cash flow. Excellent condition. $2.5M', price: 250000000 },
    { title: 'Flex Space', desc: 'Office/warehouse combo, 3,000 sq ft, perfect for contractor or small business. $3,500/mo', price: 350000 },
    { title: 'Storefront on Main Street', desc: 'High visibility, corner lot, ample parking. Build your dream business! $5,500/mo', price: 550000 },
  ],
  'Vacation Rentals': [
    { title: 'Beach House - Weekly', desc: 'Oceanfront, 4BR, sleeps 10, deck with views. Perfect summer getaway! $3,500/week', price: 350000 },
    { title: 'Mountain Cabin Retreat', desc: 'Secluded, hot tub, fireplace, hiking trails. Romantic escape! $1,800/week', price: 180000 },
    { title: 'Ski Chalet', desc: 'Slopeside, 5BR, game room, fireplace. Winter wonderland! $4,500/week', price: 450000 },
    { title: 'Downtown Condo', desc: 'Walk to attractions, 2BR, parking included. Perfect city stay! $200/night', price: 20000 },
    { title: 'Lakefront Cottage', desc: '3BR, private dock, kayaks included, peaceful setting. $2,200/week', price: 220000 },
    { title: 'Desert Villa with Pool', desc: 'Modern, 4BR, heated pool, mountain views. Luxury retreat! $3,000/week', price: 300000 },
    { title: 'Historic B&B Room', desc: 'Charming, breakfast included, walking distance to downtown. $150/night', price: 15000 },
    { title: 'Glamping Tent', desc: 'Luxury camping, real bed, electricity, private bathroom. Unique experience! $120/night', price: 12000 },
  ],
  Jobs: [
    { title: 'Senior Software Engineer', desc: 'Full-stack developer, 5+ years experience. React, Node.js, MongoDB. Competitive salary + benefits.', price: 12000000 },
    { title: 'Marketing Manager', desc: 'Lead marketing team, 3+ years experience. Digital marketing, SEO, content strategy.', price: 9500000 },
    { title: 'Graphic Designer', desc: 'Creative designer, Adobe Creative Suite. Portfolio required. Great team!', price: 6500000 },
    { title: 'Sales Representative', desc: 'Motivated sales pro, B2B experience. Base + commission. Unlimited earning potential!', price: 5500000 },
    { title: 'Customer Support', desc: 'Help customers succeed! Excellent communication skills. Remote available.', price: 4500000 },
    { title: 'Data Analyst', desc: 'Business intelligence, SQL, Python, Tableau. Make an impact with data!', price: 8500000 },
    { title: 'Project Manager', desc: 'Manage teams and projects. PMP preferred. Great leadership opportunity!', price: 10500000 },
    { title: 'UX/UI Designer', desc: 'Design intuitive interfaces, Figma, user research. Join innovative team!', price: 8000000 },
  ],
  Services: [
    { title: 'Professional House Cleaning', desc: 'Reliable cleaning for homes and offices. Eco-friendly products, insured and bonded.', price: 12000 },
    { title: 'Web Development', desc: 'Custom websites and apps. Modern design, SEO optimized, responsive. Portfolio available.', price: 50000 },
    { title: 'Personal Training', desc: 'Certified trainer, 1-on-1 sessions. Fitness assessment and custom workout plans.', price: 6000 },
    { title: 'Plumbing Services', desc: 'Licensed plumber, repairs, installations, emergencies. Same-day service available.', price: 8000 },
    { title: 'Photography', desc: 'Professional photographer for events, portraits, real estate. High-quality photos.', price: 15000 },
    { title: 'Tutoring - Math & Science', desc: 'Experienced tutor for high school and college. Flexible scheduling, online or in-person.', price: 5000 },
    { title: 'Lawn Care', desc: 'Complete maintenance, landscaping design, seasonal cleanup. Free estimates.', price: 10000 },
    { title: 'Auto Repair', desc: 'Honest and affordable car repairs. Brake service, oil changes, diagnostics. 20+ years experience.', price: 7500 },
  ],
  Fashion: [
    { title: 'Designer Handbag - Gucci', desc: 'Authentic, like new condition, comes with dust bag and authenticity card. Retail $2,500.', price: 180000 },
    { title: 'Mens Suit - Hugo Boss', desc: 'Size 42R, charcoal gray, wool blend. Worn twice, dry cleaned. Perfect condition.', price: 35000 },
    { title: 'Wedding Dress', desc: 'Size 8, ivory lace, never worn. Alterations included. Beautiful gown! Save thousands!', price: 120000 },
    { title: 'Designer Sunglasses - Ray Ban', desc: 'Aviator style, case included. No scratches, perfect condition.', price: 8500 },
    { title: 'Leather Jacket', desc: 'Genuine leather, mens large, vintage style. Barely worn, excellent quality.', price: 15000 },
    { title: 'Evening Gown', desc: 'Size 6, floor length, sequined bodice. Worn once to gala. Stunning!', price: 25000 },
    { title: 'Designer Shoes - Louboutin', desc: 'Red bottoms, size 8, black pumps. Worn 3 times. In box with dust bags.', price: 45000 },
    { title: 'Vintage Rolex Watch', desc: 'Mens Submariner, 1985, serviced recently. Investment piece! With papers.', price: 850000 },
  ],
  'Home & Garden': [
    { title: 'Patio Furniture Set', desc: '6-piece outdoor set, weather resistant, includes cushions. Great condition!', price: 45000 },
    { title: 'Riding Lawn Mower', desc: 'John Deere, 42" deck, well maintained, new battery. Cuts beautifully!', price: 120000 },
    { title: 'BBQ Grill - Weber', desc: 'Propane grill, 4 burners, side burner, cover included. Barely used!', price: 35000 },
    { title: 'Garden Tools Set', desc: 'Complete set: shovels, rakes, pruners, wheelbarrow. Everything you need!', price: 15000 },
    { title: 'Hot Tub - 6 Person', desc: 'Works perfectly, new cover, jets, LED lights. Must be moved. Great deal!', price: 280000 },
    { title: 'Above Ground Pool', desc: '24ft round, filter and pump included, ladder, cover. Fun for summer!', price: 85000 },
    { title: 'Gazebo 10x12', desc: 'Hardtop gazebo, mosquito netting, curtains. Perfect for entertaining!', price: 65000 },
    { title: 'Plant Collection', desc: 'Various indoor plants, includes pots. Downsizing, must go! 20+ plants.', price: 5000 },
  ],
  Sports: [
    { title: 'Mountain Bike - Trek', desc: 'Full suspension, 29er, hydraulic brakes. Excellent condition, recently tuned.', price: 120000 },
    { title: 'Golf Clubs Set', desc: 'Titleist irons, TaylorMade driver, Ping putter. Bag and cart included.', price: 85000 },
    { title: 'Kayak with Paddle', desc: '12ft recreational kayak, very stable, includes life jacket and paddle.', price: 35000 },
    { title: 'Treadmill - NordicTrack', desc: 'Foldable, incline, digital display, iFit compatible. Barely used!', price: 65000 },
    { title: 'Snowboard Setup', desc: 'Burton board, bindings, boots (size 10). Great intermediate setup!', price: 40000 },
    { title: 'Baseball Glove - Rawlings', desc: 'Pro model, broken in, infield glove. Excellent leather quality.', price: 8500 },
    { title: 'Fishing Rod & Reel Combo', desc: 'Shimano reel, Ugly Stik rod, tackle box included. Ready to fish!', price: 12000 },
    { title: 'Tennis Racket - Wilson', desc: 'Pro Staff model, strung and ready. Includes cover and extra grip.', price: 15000 },
  ],
  Books: [
    { title: 'First Edition Harry Potter', desc: 'Philosophers Stone, first print, excellent condition. Collectors item!', price: 450000 },
    { title: 'College Textbooks', desc: 'Chemistry, Biology, Calculus. Current editions, like new. Save money!', price: 25000 },
    { title: 'Vintage Comics Collection', desc: '50+ comics from 1960s-1980s. Some key issues. Great investment!', price: 180000 },
    { title: 'Cookbook Collection', desc: '20 cookbooks, various cuisines. Julia Child, Gordon Ramsay, more!', price: 8500 },
    { title: 'Complete Encyclopedia Set', desc: 'Britannica, 1985 edition, all volumes, excellent condition. Display piece!', price: 15000 },
    { title: 'Signed Stephen King Novel', desc: 'The Shining, first edition, author signed. Certificate of authenticity.', price: 85000 },
    { title: 'Childrens Books Lot', desc: '40+ books, ages 3-8, Dr. Seuss, Disney, classics. Great for daycare!', price: 6000 },
    { title: 'Art History Books', desc: '10 large format art books, coffee table quality. Beautiful photography.', price: 12000 },
  ],
  Pets: [
    { title: 'Golden Retriever Puppies', desc: 'AKC registered, health checked, first shots. Ready for forever homes! $1,500 each.', price: 150000 },
    { title: 'Fish Tank Setup', desc: '55 gallon tank, stand, filter, heater, decorations. Everything included!', price: 25000 },
    { title: 'Purebred Persian Cat', desc: '2 years old, spayed, all shots current. Loves to cuddle, great with kids!', price: 45000 },
    { title: 'Horse for Sale', desc: 'Quarter Horse mare, 8 years old, trail broke, gentle. Great family horse!', price: 350000 },
    { title: 'Parrot - African Grey', desc: 'Talks, 3 years old, tame, comes with large cage. Needs experienced owner.', price: 120000 },
    { title: 'Reptile Terrarium', desc: '40 gallon terrarium, heat lamp, substrate. Perfect for bearded dragon!', price: 15000 },
    { title: 'Dog Training Services', desc: 'Professional trainer, obedience classes, in-home training. Transform your dog!', price: 8000 },
    { title: 'Rabbit with Cage', desc: 'Lop-eared rabbit, very friendly, includes cage, food, supplies. Free to good home!', price: 0 },
  ],
  'Food & Dining': [
    { title: 'Private Chef Services', desc: 'Gourmet meals prepared in your home. Any cuisine, dietary restrictions accommodated.', price: 25000 },
    { title: 'Wedding Cake Designer', desc: 'Custom wedding cakes, tastings included. Beautiful and delicious!', price: 50000 },
    { title: 'Meal Prep Service', desc: 'Healthy meals delivered weekly. Customized macros, organic ingredients.', price: 15000 },
    { title: 'Restaurant Equipment', desc: 'Commercial oven, stainless steel prep tables, shelving. Package deal!', price: 850000 },
    { title: 'Catering for Events', desc: 'Full service catering, any size event. Appetizers to full dinner, staff included.', price: 35000 },
    { title: 'Food Truck for Sale', desc: 'Fully equipped, passes health inspection. Ready to start your business!', price: 4500000 },
    { title: 'Homemade Jam & Preserves', desc: 'Farm fresh, no preservatives. Strawberry, blueberry, peach. $8 per jar.', price: 800 },
    { title: 'Coffee Roaster - Commercial', desc: 'Probat roaster, 5kg capacity. Perfect for small coffee shop or roastery.', price: 1200000 },
  ],
  'Travel & Resorts': [
    { title: 'Timeshare Week', desc: 'Premium resort, 1-week stay, any season. Ski resort access, spa, pools!', price: 180000 },
    { title: 'Cruise Tickets - Caribbean', desc: '7-day cruise for 2, balcony cabin, all meals included. Must sell, cant go!', price: 250000 },
    { title: 'Hotel Voucher', desc: '3 nights at 5-star hotel, any major city. Transferable, expires Dec 2026.', price: 65000 },
    { title: 'Resort Membership', desc: 'Annual membership, access to 50+ resorts worldwide. Huge savings on travel!', price: 450000 },
    { title: 'Flight Tickets - Europe', desc: 'Round trip tickets for 2, business class, flexible dates. Save $2,000!', price: 350000 },
    { title: 'All-Inclusive Resort Week', desc: 'Mexico resort, 7 nights, all food & drinks, activities. Peak season!', price: 320000 },
    { title: 'Safari Adventure Package', desc: '10-day African safari, lodging, meals, guided tours. Trip of a lifetime!', price: 850000 },
    { title: 'Ski Resort Condo Share', desc: '2 weeks per year, slopeside, sleeps 6. Great investment and vacation!', price: 1500000 },
  ],
  'Deals & Offers': [
    { title: 'Buy 1 Get 1 - Restaurant', desc: 'BOGO dinner entrees, any night this week. Award-winning Italian restaurant!', price: 0 },
    { title: '50% Off Car Detailing', desc: 'Interior and exterior detail, normally $200, now $100. Limited time!', price: 10000 },
    { title: 'Gym Membership Deal', desc: 'No initiation fee, first month free! Full gym access, classes included.', price: 0 },
    { title: 'Carpet Cleaning Special', desc: '3 rooms for $99! Includes Scotchgard treatment. Book this week!', price: 9900 },
    { title: 'Massage Therapy Package', desc: '5 sessions for $300 (save $125). Licensed therapist, very relaxing!', price: 30000 },
    { title: 'Photography Session Deal', desc: 'Family photos, 1-hour session, 10 digital images. Normally $300, now $150!', price: 15000 },
    { title: 'Dental Cleaning Special', desc: 'New patients: exam, x-rays, cleaning $75 (save $200). Insurance accepted.', price: 7500 },
    { title: 'Oil Change + Inspection', desc: 'Full synthetic oil, tire rotation, 20-point inspection. Only $49!', price: 4900 },
  ],
  Tickets: [
    { title: 'Concert Tickets - Taylor Swift', desc: '2 tickets, floor seats, front row! Cant make it anymore, face value.', price: 85000 },
    { title: 'NFL Game Tickets', desc: '4 tickets, 50-yard line, club seats. Sunday game, includes parking pass.', price: 120000 },
    { title: 'Broadway Show - Hamilton', desc: '2 orchestra seats, Saturday matinee. Amazing show, great seats!', price: 65000 },
    { title: 'Theme Park Passes', desc: '2 multi-day passes, any park. Valid through December. Save $200!', price: 45000 },
    { title: 'NBA Finals Tickets', desc: 'Lower bowl, Game 7. Once in a lifetime! Selling at cost.', price: 350000 },
    { title: 'Comedy Show Tickets', desc: '4 tickets, famous comedian, VIP seating. Meet & greet included!', price: 40000 },
    { title: 'Music Festival Weekend', desc: '3-day pass, camping included. 50+ bands, food vendors, great vibes!', price: 35000 },
    { title: 'Opera Tickets', desc: '2 tickets, box seats, opening night. Formal attire, unforgettable experience!', price: 28000 },
  ],
  'Events & Shows': [
    { title: 'Live Music - Jazz Night', desc: 'Evening of smooth jazz with local musicians. Drinks and appetizers available. $25/person.', price: 2500 },
    { title: 'Community Yard Sale', desc: 'Huge neighborhood sale this Saturday 8am-2pm. Furniture, toys, clothes, more!', price: 0 },
    { title: 'Tech Meetup - AI Discussion', desc: 'Monthly tech meetup, AI and machine learning. Pizza and networking 6-8pm. RSVP!', price: 0 },
    { title: 'Yoga Workshop', desc: 'Introduction to yoga and meditation. All levels welcome! Bring your mat. $20.', price: 2000 },
    { title: 'Food Festival Weekend', desc: 'Taste dishes from 50+ restaurants. Live music, family-friendly. $15 advance tickets.', price: 1500 },
    { title: 'Charity Run 5K', desc: 'Annual run supporting local schools. All ages, prizes for winners. Register now!', price: 3000 },
    { title: 'Art Exhibition Opening', desc: 'Local artists showcase. Wine and cheese reception Friday. Free entry!', price: 0 },
    { title: 'Farmers Market - Sundays', desc: 'Fresh produce, baked goods, crafts. Support local farmers! Open 9am-1pm.', price: 0 },
  ],
  Auction: [
    { title: 'Estate Auction - Antiques', desc: 'Furniture, jewelry, art, collectibles. Preview Friday, auction Saturday 10am.', price: 0 },
    { title: 'Car Auction - Classic Cars', desc: '30+ vintage cars, no reserve. Mustangs, Corvettes, Camaros. Register to bid!', price: 0 },
    { title: 'Charity Auction - Luxury', desc: 'Vacation packages, jewelry, experiences. Proceeds benefit childrens hospital.', price: 0 },
    { title: 'Storage Unit Auction', desc: 'Contents of 5 storage units. Cash only, you haul. Preview Sunday morning.', price: 0 },
    { title: 'Art Auction - Contemporary', desc: 'Original paintings and sculptures. Online bidding available. Catalog online!', price: 0 },
    { title: 'Jewelry Auction Event', desc: 'Diamond rings, gold, watches. GIA certificates included. In-person and online.', price: 0 },
    { title: 'Wine Collection Auction', desc: 'Rare vintages, properly stored. 100+ bottles, some from 1970s. Sommelier on site.', price: 0 },
    { title: 'Sports Memorabilia Auction', desc: 'Signed jerseys, balls, photos. Authentication included. Legends weekend!', price: 0 },
  ],
  'Buy & Sell': [
    { title: 'Power Tools Lot', desc: 'DeWalt drill, circular saw, impact driver, chargers, cases. Great condition!', price: 35000 },
    { title: 'Antique Furniture', desc: 'Oak dining table, 6 chairs, buffet. Solid wood, refinished. Beautiful set!', price: 120000 },
    { title: 'Kids Toys Bundle', desc: 'Large lot, ages 3-8. Legos, action figures, games. Clean, smoke-free home.', price: 8500 },
    { title: 'Kitchen Appliances', desc: 'Mixer, blender, food processor, slow cooker. All work perfectly!', price: 15000 },
    { title: 'Vintage Vinyl Records', desc: '200+ records, 60s-80s rock, jazz, soul. Some rare! Great collection.', price: 45000 },
    { title: 'Camping Gear', desc: 'Tent, sleeping bags, camp stove, cooler, lanterns. Complete setup!', price: 25000 },
    { title: 'Designer Furniture', desc: 'Leather sofa, matching chairs, coffee table. Moving, must sell!', price: 180000 },
    { title: 'Game Console Bundle', desc: 'Nintendo Switch, 10 games, extra controllers, carrying case. Great deal!', price: 35000 },
  ],
  Notices: [
    { title: 'Lost Dog - Golden Retriever', desc: 'Lost downtown Oct 20. Brown collar, answers to Max. Reward offered!', price: 0 },
    { title: 'Free Kittens', desc: '8-week-old kittens need loving homes. Litter trained, playful. Two orange, one gray.', price: 0 },
    { title: 'Seeking Roommate', desc: 'Clean, responsible roommate wanted. 2BR apartment, own bathroom. $800/month + utilities.', price: 80000 },
    { title: 'Moving Sale - Everything!', desc: 'Moving overseas! Furniture, appliances, tools, household items. Saturday 7am.', price: 0 },
    { title: 'Carpool Partner Wanted', desc: 'Daily commute to downtown. Share gas costs. Leave 8am, return 5:30pm.', price: 0 },
    { title: 'Free Firewood', desc: 'Oak and pine, cut and split. You haul, first come first served!', price: 0 },
    { title: 'Seeking Band Members', desc: 'Rock band needs drummer and bassist. Weekly rehearsals, gig locally. All levels!', price: 0 },
    { title: 'Study Group - CPA Exam', desc: 'Forming study group for CPA exam. Meet twice weekly at library. Serious students!', price: 0 },
  ],
  'Health & Beauty': [
    { title: 'Massage Therapy', desc: 'Licensed therapist, deep tissue, Swedish, sports massage. Relax and rejuvenate!', price: 8000 },
    { title: 'Hair Salon Services', desc: 'Cut, color, highlights, extensions. Experienced stylists, premium products.', price: 12000 },
    { title: 'Skincare Products', desc: 'Organic skincare line, anti-aging, acne treatment. Natural ingredients, results!', price: 5500 },
    { title: 'Personal Makeup Artist', desc: 'Wedding makeup, special events, lessons. Portfolio available, trial included.', price: 15000 },
    { title: 'Teeth Whitening', desc: 'Professional whitening, dramatic results in one session. Safe and effective!', price: 25000 },
    { title: 'Nail Salon - Manicure/Pedicure', desc: 'Full service nail care, gel, acrylics, nail art. Clean and relaxing!', price: 4500 },
    { title: 'Barber Services', desc: 'Classic mens cuts, beard trims, hot towel shaves. Old-school barbershop!', price: 3500 },
    { title: 'Yoga Classes', desc: 'Beginner to advanced, various styles. Flexible schedule, great instructors!', price: 2000 },
  ],
  'Baby & Kids': [
    { title: 'Baby Crib with Mattress', desc: 'Convertible crib, excellent condition, includes mattress. Smoke-free home!', price: 18000 },
    { title: 'Stroller - Double', desc: 'Side-by-side double stroller, cup holders, storage. Perfect for twins!', price: 15000 },
    { title: 'Kids Clothes Lot', desc: 'Size 2T-4T, 30+ pieces, name brands. Boys clothes, great condition!', price: 6500 },
    { title: 'High Chair - Adjustable', desc: 'Easy to clean, multiple heights, tray included. Like new!', price: 8500 },
    { title: 'Baby Monitor Video', desc: 'Night vision, two-way audio, temperature sensor. Still in box!', price: 12000 },
    { title: 'Playpen/Pack n Play', desc: 'Travel-friendly, includes bassinet and changing station. Barely used!', price: 9500 },
    { title: 'Kids Bike with Training Wheels', desc: '16" bike, perfect for ages 4-6, includes helmet. Ready to ride!', price: 6000 },
    { title: 'Toys Bundle - Toddler', desc: 'Educational toys, blocks, puzzles, books. Clean, complete sets!', price: 4500 },
  ],
  'Arts & Crafts': [
    { title: 'Sewing Machine - Brother', desc: 'Computerized machine, 100+ stitches, embroidery capable. Excellent condition!', price: 35000 },
    { title: 'Art Supplies Bundle', desc: 'Paints, brushes, canvases, easel. Everything to start painting!', price: 12000 },
    { title: 'Cricut Machine', desc: 'Cutting machine with accessories, mats, tools. Perfect for crafters!', price: 25000 },
    { title: 'Yarn Collection', desc: 'Premium yarn, various colors and weights. 50+ skeins. Great deal!', price: 8500 },
    { title: 'Pottery Wheel', desc: 'Electric wheel, foot pedal, works perfectly. Start your pottery journey!', price: 45000 },
    { title: 'Jewelry Making Kit', desc: 'Beads, wire, tools, findings. Make bracelets, necklaces, earrings!', price: 6500 },
    { title: 'Calligraphy Set', desc: 'Pens, nibs, ink, practice paper, instruction book. Beautiful art form!', price: 4500 },
    { title: 'Quilting Fabric Lot', desc: '100+ pieces, various patterns and colors. Perfect for quilters!', price: 15000 },
  ],
  'Musical Instruments': [
    { title: 'Acoustic Guitar - Martin', desc: 'Solid wood, beautiful tone, includes hard case. Professionally set up!', price: 85000 },
    { title: 'Electric Piano - Yamaha', desc: '88 weighted keys, stand, pedal, headphones. Perfect for learning!', price: 65000 },
    { title: 'Drum Set - Complete', desc: '5-piece set, cymbals, hardware, throne. Ready to rock!', price: 55000 },
    { title: 'Violin with Case', desc: 'Student violin, bow, rosin, shoulder rest. Great starter instrument!', price: 25000 },
    { title: 'Saxophone - Alto', desc: 'Yamaha, excellent condition, recently serviced. Includes case and mouthpiece.', price: 75000 },
    { title: 'Bass Guitar - Fender', desc: 'Precision bass, active pickups, includes amp and cable. Sounds amazing!', price: 45000 },
    { title: 'Trumpet - Bach', desc: 'Professional horn, silver plated, great valves. Includes case and mouthpiece.', price: 95000 },
    { title: 'Ukulele - Kala', desc: 'Concert size, solid mahogany, sweet tone. Includes gig bag and tuner!', price: 18000 },
  ],
  'Office Supplies': [
    { title: 'Standing Desk - Electric', desc: 'Height adjustable, memory presets, solid wood top. Like new!', price: 45000 },
    { title: 'Office Chair - Ergonomic', desc: 'Herman Miller Aeron, fully adjustable, mesh back. Excellent support!', price: 65000 },
    { title: 'Filing Cabinets', desc: '2 lateral file cabinets, 4-drawer, locking. Great for home office!', price: 18000 },
    { title: 'Printer - Laser', desc: 'Brother laser printer, fast, double-sided, network capable. Low cost per page!', price: 25000 },
    { title: 'Bookshelf - 6ft Tall', desc: 'Solid wood, 5 shelves, adjustable. Perfect for books or displays!', price: 12000 },
    { title: 'Desk Organizer Set', desc: 'Leather desk accessories, pen holder, tray, blotter. Classy look!', price: 6500 },
    { title: 'Whiteboard - Large', desc: '6x4 magnetic whiteboard, aluminum frame, includes markers and eraser.', price: 15000 },
    { title: 'Paper Shredder', desc: 'Cross-cut shredder, handles credit cards, quiet operation. Secure!', price: 8500 },
  ],
  'Digital Products': [
    { title: 'Website Template Bundle', desc: '50+ responsive templates, HTML/CSS, commercial license. Instant download!', price: 4500 },
    { title: 'Stock Photo Collection', desc: '10,000 high-res photos, various categories, royalty-free. Great for designers!', price: 8500 },
    { title: 'eBook - Digital Marketing', desc: 'Comprehensive guide, 300+ pages, case studies. Learn proven strategies!', price: 2500 },
    { title: 'Lightroom Presets Pack', desc: '100+ professional presets for photo editing. Instant improvements!', price: 1500 },
    { title: 'Online Course - Web Development', desc: '50 hours of video content, project files, lifetime access. Build real projects!', price: 9900 },
    { title: 'Logo Design Templates', desc: '200+ customizable logo templates, AI and PSD files. Launch your brand!', price: 3500 },
    { title: 'Music Loops & Samples', desc: '1000+ royalty-free loops, various genres. Perfect for producers!', price: 5500 },
    { title: 'Resume Templates', desc: '25 professional resume designs, Word and PDF, ATS-friendly. Stand out!', price: 1200 },
  ],
  'Software & Apps': [
    { title: 'Adobe Creative Cloud', desc: 'Annual subscription, all apps included. Photoshop, Illustrator, Premiere, more!', price: 60000 },
    { title: 'Microsoft Office 365', desc: 'Family plan, 6 users, Word, Excel, PowerPoint, 1TB storage per user.', price: 10000 },
    { title: 'Antivirus Software', desc: 'Norton 360, 5 devices, VPN included, cloud backup. Full protection!', price: 5000 },
    { title: 'Video Editing Software', desc: 'Final Cut Pro, professional editing, lifetime license. For Mac users!', price: 30000 },
    { title: 'Accounting Software', desc: 'QuickBooks Pro, small business accounting, invoicing, reports. Essential tool!', price: 35000 },
    { title: 'Password Manager', desc: '1Password family plan, unlimited devices, secure vaults. Never forget passwords!', price: 6000 },
    { title: 'VPN Service - 3 Years', desc: 'NordVPN, fast speeds, no logs, access geo-blocked content. Privacy!', price: 9900 },
    { title: 'Project Management Tool', desc: 'Asana premium, unlimited projects, timeline, dashboards. Organize your team!', price: 12000 },
  ],
  'Tutoring & Lessons': [
    { title: 'Piano Lessons', desc: 'Experienced teacher, all ages and levels. Classical and modern styles. $50/hour.', price: 5000 },
    { title: 'Math Tutoring', desc: 'Algebra through Calculus, patient teacher, online or in-person. $40/hour.', price: 4000 },
    { title: 'Language Lessons - Spanish', desc: 'Native speaker, conversational and business Spanish. Flexible schedule. $35/hour.', price: 3500 },
    { title: 'Guitar Lessons', desc: 'Acoustic and electric, beginners welcome. Learn your favorite songs! $45/hour.', price: 4500 },
    { title: 'SAT/ACT Prep', desc: 'Proven strategies, practice tests, score improvement guarantee. $60/hour.', price: 6000 },
    { title: 'Cooking Lessons', desc: 'Learn to cook delicious meals, any cuisine. In-home lessons. $75/session.', price: 7500 },
    { title: 'Dance Lessons', desc: 'Ballroom, salsa, swing. Private or group lessons. Fun and fitness! $50/hour.', price: 5000 },
    { title: 'Computer Programming', desc: 'Learn Python, JavaScript, or Java. Build real projects. $55/hour.', price: 5500 },
  ],
  'Home Repair': [
    { title: 'Handyman Services', desc: 'General repairs, drywall, painting, minor electrical/plumbing. Fair prices!', price: 7500 },
    { title: 'Roof Repair', desc: 'Leak repairs, shingle replacement, inspections. Licensed and insured!', price: 15000 },
    { title: 'HVAC Maintenance', desc: 'AC and furnace service, tune-ups, repairs. Keep your system running!', price: 12000 },
    { title: 'Electrical Services', desc: 'Licensed electrician, outlets, fixtures, panels. Safe and reliable!', price: 10000 },
    { title: 'Drywall Repair', desc: 'Holes, cracks, water damage. Professional finish, paint matching. $150 minimum.', price: 15000 },
    { title: 'Gutter Cleaning', desc: 'Remove debris, check for damage, flush downspouts. Prevent water damage!', price: 8000 },
    { title: 'Deck Refinishing', desc: 'Power wash, stain, seal. Restore your deck! Free estimates.', price: 25000 },
    { title: 'Window Repair', desc: 'Glass replacement, seal repair, hardware replacement. Quick service!', price: 12000 },
  ],
  Free: [
    { title: 'Free Firewood', desc: 'Seasoned oak and pine, cut and split. You haul away. First come!', price: 0 },
    { title: 'Free Moving Boxes', desc: 'Large collection of boxes, various sizes, clean. Great for moving!', price: 0 },
    { title: 'Free Dirt/Fill', desc: 'Clean fill dirt available, good for landscaping. You load and haul.', price: 0 },
    { title: 'Free Kittens', desc: '6 weeks old, litter trained, very playful. Need good homes!', price: 0 },
    { title: 'Free Mulch', desc: 'Wood chips/mulch pile, great for gardens. Bring your own bags/truck.', price: 0 },
    { title: 'Free Piano', desc: 'Upright piano, needs tuning. You move it! Was $2,000 new.', price: 0 },
    { title: 'Free Bricks', desc: 'Pile of used bricks, good for projects. Approximately 500 bricks.', price: 0 },
    { title: 'Free Desk', desc: 'Office desk, some scratches but sturdy. Must pick up this week!', price: 0 },
  ],
  Other: [
    { title: 'Miscellaneous Items', desc: 'Various household items, some tools, decor. Come see! Make an offer.', price: 5000 },
    { title: 'Storage Unit Contents', desc: 'Bought storage unit, misc items to sell. Furniture, boxes, tools.', price: 15000 },
    { title: 'Mystery Box', desc: 'Random items, could be anything! Fun surprise. Perfect for resellers!', price: 2500 },
    { title: 'Collectibles Lot', desc: 'Various collectibles, coins, stamps, memorabilia. Not sure of value!', price: 8500 },
    { title: 'Costume Jewelry', desc: 'Large lot of costume jewelry, necklaces, bracelets, earrings. Fun pieces!', price: 4500 },
    { title: 'Vintage Items', desc: 'Old bottles, signs, tools. Great for collectors or decorators!', price: 12000 },
    { title: 'Party Supplies', desc: 'Decorations, tableware, balloons. Enough for large party!', price: 3500 },
    { title: 'Craft Supplies', desc: 'Random craft items, fabric, ribbons, buttons. Crafters paradise!', price: 6000 },
  ],
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
  Electronics: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
  'Cars & Trucks': ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'],
  Motorcycles: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800', 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800'],
  'Boats & Marine': ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'https://images.unsplash.com/photo-1494587351196-bbf5f29cff42?w=800', 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800'],
  'RVs & Campers': ['https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800', 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'],
  'Houses for Sale': ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
  'Apartments for Rent': ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
  'Commercial Property': ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  'Vacation Rentals': ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
  Jobs: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'],
  Services: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800'],
  Fashion: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800'],
  'Home & Garden': ['https://images.unsplash.com/photo-1585128792103-d2eb53c50c3e?w=800', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', 'https://images.unsplash.com/photo-1584622781867-b4c5315901e8?w=800'],
  Sports: ['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800', 'https://images.unsplash.com/photo-1593766787879-e8c78e09cec0?w=800'],
  Books: ['https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'],
  Pets: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800', 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800'],
  'Food & Dining': ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
  'Travel & Resorts': ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'],
  'Deals & Offers': ['https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800', 'https://images.unsplash.com/photo-1601937417916-13425f4f4e4e?w=800'],
  Tickets: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
  'Events & Shows': ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800'],
  Auction: ['https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'],
  'Buy & Sell': ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800'],
  Notices: ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'],
  'Health & Beauty': ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'],
  'Baby & Kids': ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
  'Arts & Crafts': ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'],
  'Musical Instruments': ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'],
  'Office Supplies': ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800'],
  'Digital Products': ['https://images.unsplash.com/photo-1547658719-da2b51169166?w=800', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'],
  'Software & Apps': ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800', 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800', 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800'],
  'Tutoring & Lessons': ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800'],
  'Home Repair': ['https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800', 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800', 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800'],
  Free: ['https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800'],
  Other: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800'],
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
