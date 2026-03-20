const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const connectDB = require('../config/db');
require('dotenv').config();

const seedDiscovery = async () => {
  try {
    await connectDB();

    // Clear existing
    await Hotel.deleteMany();
    await Restaurant.deleteMany();

    const hotels = [
      {
        name: 'Mayfair Lagoon',
        description: 'Luxury resort with traditional Odia architecture.',
        address: '8-10 Jayadev Vihar, Bhubaneswar',
        city: 'Bhubaneswar',
        latitude: 20.3015,
        longitude: 85.8262,
        pricePerNight: 8500,
        amenities: ['Pool', 'Spa', 'WiFi', 'Gym'],
        category: 'luxury',
        rating: 4.8
      },
      {
        name: 'Ginger Bhubaneswar',
        description: 'Modern budget hotel for business and leisure.',
        address: 'Jayadev Vihar Rd, Bhubaneswar',
        city: 'Bhubaneswar',
        latitude: 20.2985,
        longitude: 85.8320,
        pricePerNight: 2800,
        amenities: ['WiFi', 'Restaurant', 'AC'],
        category: 'budget',
        rating: 4.2
      },
      {
        name: 'Toshali Sands',
        description: 'Ethnic village resort near Puri beach.',
        address: 'Konark Marine Drive, Puri',
        city: 'Puri',
        latitude: 19.8350,
        longitude: 85.8750,
        pricePerNight: 5500,
        amenities: ['Private Beach', 'Garden', 'WiFi'],
        category: 'mid-range',
        rating: 4.5
      }
    ];

    const restaurants = [
      {
        name: 'Dalma Restaurant',
        description: 'Authentic Odia cuisine specializing in Dalma and Pakhala.',
        location: { type: 'Point', coordinates: [85.8235, 20.2965] },
        category: 'Traditional',
        rating: 4.7
      },
      {
        name: 'Chilika Dhaba',
        description: 'Famous for fresh prawn and crab delicacies.',
        location: { type: 'Point', coordinates: [85.8150, 19.8140] },
        category: 'Seafood',
        rating: 4.6
      }
    ];

    await Hotel.insertMany(hotels);
    await Restaurant.insertMany(restaurants);

    console.log('Discovery data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding discovery data:', error);
    process.exit(1);
  }
};

seedDiscovery();
