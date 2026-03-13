const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Guide = require('../models/Guide');
const config = require('../config/env');

const guidesData = [
  {
    name: 'Karan Singh',
    email: 'karan.guide@example.com',
    password: 'password123',
    mobile: '9876543210',
    locationName: 'Old Town, Bhubaneswar',
    role: 'guide',
    guideInfo: {
      languages: ['Odia', 'Hindi', 'English'],
      experience: '5 years',
      pricePerHour: 500,
      description: 'Expert in Lingaraj Temple and local history. Born and raised in the heart of Old Town.',
      rating: 4.8,
      isLive: true,
      coords: [85.8245, 20.2661] // [long, lat]
    }
  },
  {
    name: 'Priyanka Das',
    email: 'priyanka.guide@example.com',
    password: 'password123',
    mobile: '9876543211',
    locationName: 'Patia, Bhubaneswar',
    role: 'guide',
    guideInfo: {
      languages: ['English', 'Hindi', 'Bengali'],
      experience: '3 years',
      pricePerHour: 400,
      description: 'Food and lifestyle guide. I can show you the best cafes and modern spots in the city.',
      rating: 4.9,
      isLive: true,
      coords: [85.8420, 20.3200]
    }
  },
  {
    name: 'Amit Mohanty',
    email: 'amit.guide@example.com',
    password: 'password123',
    mobile: '9876543212',
    locationName: 'Khandagiri, Bhubaneswar',
    role: 'guide',
    guideInfo: {
      languages: ['Odia', 'English'],
      experience: '8 years',
      pricePerHour: 600,
      description: 'Archeology enthusiast. Specialized in Udayagiri and Khandagiri caves.',
      rating: 4.7,
      isLive: true,
      coords: [85.7950, 20.2580]
    }
  },
  {
    name: 'Sonalika Jena',
    email: 'sonalika.guide@example.com',
    password: 'password123',
    mobile: '9876543213',
    locationName: 'Saheed Nagar, Bhubaneswar',
    role: 'guide',
    guideInfo: {
      languages: ['English', 'Hindi', 'French'],
      experience: '4 years',
      pricePerHour: 700,
      description: 'Cultural explorer. I love meeting new people and sharing stories about Odia heritage.',
      rating: 4.6,
      isLive: true,
      coords: [85.8450, 20.2880]
    }
  },
  {
    name: 'Rakesh Raut',
    email: 'rakesh.guide@example.com',
    password: 'password123',
    mobile: '9876543214',
    locationName: 'IRC Village, Bhubaneswar',
    role: 'guide',
    guideInfo: {
      languages: ['Odia', 'Hindi'],
      experience: '6 years',
      pricePerHour: 450,
      description: 'Local market and shopping expert. Looking for authentic handlooms? I am your guy.',
      rating: 4.5,
      isLive: true,
      coords: [85.8180, 20.2950]
    }
  }
];

const seedGuides = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clean up existing demo users/guides to avoid duplicates
    const emails = guidesData.map(g => g.email);
    const existingUsers = await User.find({ email: { $in: emails } });
    const userIds = existingUsers.map(u => u._id);
    
    await Guide.deleteMany({ userId: { $in: userIds } });
    await User.deleteMany({ email: { $in: emails } });

    console.log('Cleaned up old demo data');

    for (const data of guidesData) {
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        mobile: data.mobile,
        location: data.locationName,
        isVerified: true
      });

      await Guide.create({
        userId: user._id,
        languages: data.guideInfo.languages,
        experience: data.guideInfo.experience,
        pricePerHour: data.guideInfo.pricePerHour,
        description: data.guideInfo.description,
        rating: data.guideInfo.rating,
        isLive: data.guideInfo.isLive,
        location: {
          type: 'Point',
          coordinates: data.guideInfo.coords
        },
        status: 'approved'
      });

      console.log(`Seeded: ${data.name}`);
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedGuides();
