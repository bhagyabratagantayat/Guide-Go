const mongoose = require('mongoose');
const User = require('./models/User');
const Guide = require('./models/Guide');
const Place = require('./models/Place');
const Hotel = require('./models/Hotel');
const Restaurant = require('./models/Restaurant');
const config = require('./config/env');

const seedData = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('connected to MongoDB for super seeding...');

    // Clear existing data
    await User.deleteMany({ email: { $ne: 'admin@demo.com' } }); 
    await Guide.deleteMany({});
    await Place.deleteMany({});
    await Hotel.deleteMany({});
    await Restaurant.deleteMany({});
    
    console.log('database cleared (except main admin)...');

    // 1. CREATE USERS & GUIDES
    const guideData = [
      { name: 'Arjun Das', email: 'arjun@guide.com', bio: 'Expert in Kalinga architecture and temple history.', coordinates: [85.8338, 20.2382], rating: 4.8 },
      { name: 'Sita Mohapatra', email: 'sita@guide.com', bio: 'Local culture specialist and traditional weaver expert.', coordinates: [85.8245, 20.2661], rating: 4.9 },
      { name: 'Rajesh Mishra', email: 'rajesh@guide.com', bio: 'Young, energetic guide specializing in street food and hidden gems.', coordinates: [85.8420, 20.3200], rating: 4.5 },
      { name: 'Deepa Nayak', email: 'deepa@guide.com', bio: 'Certified historian with focus on Ashokan edicts and Buddhist heritage.', coordinates: [85.8150, 20.2450], rating: 5.0 },
      { name: 'Kabir Khan', email: 'kabir@guide.com', bio: 'Multi-lingual guide fluent in French, German, and Odia.', coordinates: [85.8500, 20.2900], rating: 4.7 }
    ];

    for (const g of guideData) {
      const user = await User.create({
        name: g.name,
        email: g.email,
        password: 'password123',
        role: 'guide',
        isVerified: true,
        mobile: '9' + Math.floor(100000000 + Math.random() * 900000000)
      });

      await Guide.create({
        userId: user._id,
        languages: ['English', 'Odia', 'Hindi'],
        experience: Math.floor(Math.random() * 15) + 2 + ' years',
        pricePerHour: 400 + Math.floor(Math.random() * 600),
        description: g.bio,
        rating: g.rating,
        category: g.rating > 4.7 ? 'expert' : 'pro',
        isLive: true,
        location: { type: 'Point', coordinates: g.coordinates },
        status: 'approved'
      });
    }
    console.log('5 Guides seeded...');

    // 2. CREATE PLACES (Heritage & Nature)
    const places = [
      { name: 'Lingaraj Temple', desc: '11th-century temple dedicated to Lord Shiva, an architectural masterpiece.', cat: 'Spiritual', lat: 20.2382, lng: 85.8338 },
      { name: 'Udayagiri & Khandagiri Caves', desc: 'Partly natural and partly artificial caves of archaeological importance.', cat: 'Heritage', lat: 20.2580, lng: 85.7861 },
      { name: 'Dhauli Shanti Stupa', desc: 'The Peace Pagoda marking the site where Kalinga War ended.', cat: 'Heritage', lat: 20.1925, lng: 85.8394 },
      { name: 'Nandankanan Zoological Park', desc: 'Premier zoo and botanical garden known for white tigers.', cat: 'Nature', lat: 20.3957, lng: 85.8252 },
      { name: 'Mukiteshvara Temple', desc: 'Known as the "Gem of Odisha Architecture".', cat: 'Spiritual', lat: 20.2435, lng: 85.8341 },
      { name: 'Rajarani Temple', desc: 'Unique temple with no presiding deity, famous for its sculptures.', cat: 'Heritage', lat: 20.2513, lng: 85.8427 },
      { name: 'Ekamra Kanan', desc: 'Large botanical garden and park in the heart of the city.', cat: 'Nature', lat: 20.3015, lng: 85.8202 },
      { name: 'Puri Jagannath Temple', desc: 'One of the Char Dham pilgrimage sites.', cat: 'Spiritual', lat: 19.8048, lng: 85.8179 },
      { name: 'Chilika Lake', desc: 'Asias largest brackish water lagoon, home to Irrawaddy dolphins.', cat: 'Nature', lat: 19.6841, lng: 85.3217 },
      { name: 'Konark Sun Temple', desc: '13th-century UNESCO World Heritage Site in the shape of a chariot.', cat: 'Heritage', lat: 19.8876, lng: 86.0945 }
    ];

    await Place.insertMany(places.map(p => ({
      name: p.name,
      description: p.desc,
      category: p.cat,
      city: p.lng > 86 ? 'Konark' : (p.lat < 19.9 ? 'Puri' : 'Bhubaneswar'),
      latitude: p.lat,
      longitude: p.lng,
      images: ['https://images.unsplash.com/photo-1625213678396-74581574164?q=80&w=1000&auto=format&fit=crop'] // Placeholder
    })));
    console.log('10 Places seeded...');

    // 3. CREATE HOTELS
    const hotels = [
      { name: 'Mayfair Lagoon', desc: 'Luxury resort with lush greenery and premium villas.', pricePerNight: 8500, latitude: 20.3060, longitude: 85.8270, cat: 'luxury' },
      { name: 'Trident Bhubaneswar', desc: 'Elegant 5-star hotel near the business district.', pricePerNight: 7200, latitude: 20.3000, longitude: 85.8200, cat: 'luxury' },
      { name: 'Hotel Swosti Premium', desc: 'Large business hotel with great dining options.', pricePerNight: 4500, latitude: 20.3050, longitude: 85.8450, cat: 'mid-range' },
      { name: 'Ginger Hotel', desc: 'Modern budget-friendly hotel for smart travelers.', pricePerNight: 2800, latitude: 20.3150, longitude: 85.8250, cat: 'budget' },
      { name: 'The New Marrion', desc: 'Centrally located hotel with a vintage charm.', pricePerNight: 3800, latitude: 20.2850, longitude: 85.8400, cat: 'mid-range' }
    ];

    await Hotel.insertMany(hotels.map(h => ({
      ...h,
      address: 'Major Road, City Center',
      city: 'Bhubaneswar',
      amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym'],
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop'],
      rating: 4.0 + Math.random(),
      reviewsCount: Math.floor(Math.random() * 500) + 50
    })));
    console.log('5 Hotels seeded...');

    // 4. CREATE RESTAURANTS
    const restaurants = [
      { name: 'Dalma', desc: 'Authentic Odia cuisine specializing in traditional Dalma and Pakhala.', lat: 20.2900, lng: 85.8450, cat: 'Authentic' },
      { name: 'The Zaika', desc: 'Premium North Indian and Mughlai delights.', lat: 20.2850, lng: 85.8420, cat: 'Fine Dining' },
      { name: 'Balaram Mullick', desc: 'Famous for traditional sweets like Chenna Poda and Rasagola.', lat: 20.2750, lng: 85.8350, cat: 'Desserts' },
      { name: 'Trupti Restaurant', desc: 'Best vegetarian thali in the city.', lat: 20.2650, lng: 85.8380, cat: 'Casual' },
      { name: 'Michael\'s Kitchen', desc: 'Gourmet continental and seafood by the beach.', lat: 19.8100, lng: 85.8250, cat: 'Seafood' }
    ];

    await Restaurant.insertMany(restaurants.map(r => ({
      name: r.name,
      description: r.desc,
      location: { type: 'Point', coordinates: [r.lng, r.lat] },
      category: r.cat,
      rating: 4.2 + Math.random() * 0.8,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop'
    })));
    console.log('5 Restaurants seeded...');

    console.log('✅ SUPER SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ SEEDING ERROR:', error);
    process.exit(1);
  }
};

seedData();
