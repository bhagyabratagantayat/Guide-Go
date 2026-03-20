const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI;

const places = [
  {
    name: 'Odisha State Tribal Museum',
    description: 'A "Museum of Man" showcasing the life and culture of over 60 tribal communities residing in Odisha. Features five galleries with over 2,247 artifacts, including traditional costumes, ornaments, and musical instruments.',
    latitude: 20.2741,
    longitude: 85.8080,
    category: 'Museum',
    city: 'Bhubaneswar',
    image: 'https://images.unsplash.com/photo-1590050752117-23a9d7f28243?w=800&q=80',
    audioGuideText: 'Welcome to the Odisha State Tribal Museum. This place is a living testimony to the rich cultural heritage of Odisha\'s indigenous tribes...'
  },
  {
    name: 'Udayagiri and Khandagiri Caves',
    description: 'Ancient rock-cut shelters primarily carved out during the 1st and 2nd Century BCE. These were residential blocks for Jain monks to rest and meditate.',
    latitude: 20.2631,
    longitude: 85.7863,
    category: 'Historical',
    city: 'Bhubaneswar',
    image: 'https://images.unsplash.com/photo-1624462615024-5d9c73f3096b?w=800&q=80',
    audioGuideText: 'You are standing before the Udayagiri caves. "Udayagiri" means "Sunrise Hill". These caves date back to the 1st century BC...'
  },
  {
    name: 'Lingaraj Temple',
    description: 'A monumental 11th-century Hindu temple dedicated to Lord Harihara. It is a masterpiece of Kalinga architecture with a tower reaching 180 feet.',
    latitude: 20.2382,
    longitude: 85.8338,
    category: 'Temple',
    city: 'Bhubaneswar',
    image: 'https://images.unsplash.com/photo-1594140707328-98e8bf02641d?w=800&q=80',
    audioGuideText: 'The Lingaraj Temple is the largest temple in Bhubaneswar. It was built by King Jajati Keshari in the 11th century...'
  },
  {
    name: 'Nandankanan Zoological Park',
    description: 'A vast 437-hectare zoo and botanical garden. Famous for its white tiger safari and for being the first zoo in India to breed white tigers in captivity.',
    latitude: 20.4000,
    longitude: 85.8333,
    category: 'Zoo',
    city: 'Bhubaneswar',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    audioGuideText: 'Welcome to Nandankanan, the "Garden of Heaven". Established in 1960, it is one of the few zoos in the world where animals live in a natural forest environment...'
  }
];

const hotels = [
  {
    name: 'Mayfair Waves',
    description: 'A luxurious beachfront resort in Puri, offering breathtaking views of the Bay of Bengal.',
    address: 'Chakra Tirtha Road, Puri, Odisha 752002',
    city: 'Puri',
    latitude: 19.8135,
    longitude: 85.8333,
    pricePerNight: 8500,
    amenities: ['Beachfront', 'Pool', 'Spa', 'Fine Dining'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80'],
    rating: 4.8,
    category: 'luxury'
  },
  {
    name: 'Trident Bhubaneswar',
    description: 'Set in 14 acres of landscaped gardens, Trident is the perfect base to explore the "Temple City".',
    address: 'CB-1, Nayapalli, Bhubaneswar, Odisha 751013',
    city: 'Bhubaneswar',
    latitude: 20.2989,
    longitude: 85.8208,
    pricePerNight: 12000,
    amenities: ['Gardens', 'Pool', 'Fitness Center', 'Bar'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80'],
    rating: 4.9,
    category: 'luxury'
  },
  {
    name: 'Sterling Puri',
    description: 'Located where the river meets the sea, Sterling Puri is one of the most popular resorts in Odisha.',
    address: 'New Marine Drive, Baliapanda, Puri, Odisha 752001',
    city: 'Puri',
    latitude: 19.7825,
    longitude: 85.7958,
    pricePerNight: 7200,
    amenities: ['Riverfront', 'Pool', 'Games Room', 'Dining'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80'],
    rating: 4.2,
    category: 'mid-range'
  },
  {
    name: 'Z Hotel',
    description: 'A charming heritage hotel in Puri that captures the essence of old-world charm.',
    address: 'Chakra Tirtha Road, Puri, Odisha 752002',
    city: 'Puri',
    latitude: 19.8140,
    longitude: 85.8340,
    pricePerNight: 3500,
    amenities: ['Heritage', 'Garden', 'Cafe'],
    images: ['https://images.unsplash.com/photo-1544124499-589139396621?w=1200&q=80'],
    rating: 4.4,
    category: 'budget'
  }
];

const restaurants = [
  {
    name: 'Dalma Restaurant',
    description: 'Authentic Odia cuisine restaurant famous for its traditional Dalma and seafood.',
    location: { type: 'Point', coordinates: [85.8190, 20.2882] },
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
    rating: 4.6,
    category: 'Odia Cuisine'
  },
  {
    name: 'Chilika Dhaba',
    description: 'Specializes in fresh catch from the Chilika lake, served in a rustic dhaba style.',
    location: { type: 'Point', coordinates: [85.8300, 20.3050] },
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80',
    rating: 4.4,
    category: 'Seafood'
  }
];

const guides = [
  {
    name: 'Karan Mishra',
    email: 'karan@guidego.com',
    password: 'password123',
    role: 'guide',
    mobile: '9876543210',
    isVerified: true,
    experience: 5,
    specialization: ['History', 'Culture', 'Museums'],
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80'
  },
  {
    name: 'Priya Dash',
    email: 'priya@guidego.com',
    password: 'password123',
    role: 'guide',
    mobile: '9876543211',
    isVerified: true,
    experience: 3,
    specialization: ['Nature', 'Wildlife', 'Photography'],
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'
  },
  {
    name: 'Alok Jena',
    email: 'alok@guidego.com',
    password: 'password123',
    role: 'guide',
    mobile: '9876543212',
    isVerified: true,
    experience: 8,
    specialization: ['Temples', 'Architecture', 'Spiritual'],
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Place.deleteMany({});
    await Hotel.deleteMany({});
    await Restaurant.deleteMany({});
    await User.deleteMany({ role: 'guide' });

    await Place.insertMany(places);
    await Hotel.insertMany(hotels);
    await Restaurant.insertMany(restaurants);
    await User.insertMany(guides);

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
