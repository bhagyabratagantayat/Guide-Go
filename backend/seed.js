const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Guide = require('./models/Guide');
const Place = require('./models/Place');
const Booking = require('./models/Booking');
const config = require('./config/env');

const seedData = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clean up all collections
    await User.deleteMany({});
    await Guide.deleteMany({});
    await Place.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared all collections');

    // 1. Create Users (Admin, Guide, Tourist)
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@demo.com',
      password: 'demo123',
      role: 'admin',
      isVerified: true,
      mobile: '9999999999'
    });

    const guideUser1 = await User.create({
      name: 'Karan Singh (Lite)',
      email: 'guide@demo.com',
      password: 'demo123',
      role: 'guide',
      isVerified: true,
      mobile: '8888888888',
      location: 'Bhubaneswar'
    });

    const guideUser2 = await User.create({
      name: 'Priyanka Das (Pro)',
      email: 'priyanka@demo.com',
      password: 'demo123',
      role: 'guide',
      isVerified: true,
      mobile: '8888888889',
      location: 'Bhubaneswar'
    });

    const guideUser3 = await User.create({
      name: 'Amit Mohanty (Expert)',
      email: 'amit@demo.com',
      password: 'demo123',
      role: 'guide',
      isVerified: true,
      mobile: '8888888890',
      location: 'Bhubaneswar'
    });

    const tourist = await User.create({
      name: 'Riya Sharma',
      email: 'user@demo.com',
      password: 'demo123',
      role: 'user',
      isVerified: true,
      mobile: '7777777777'
    });

    console.log('Users seeded');

    // 2. Create Guide Profiles
    await Guide.create([
      {
        userId: guideUser1._id,
        languages: ['Odia', 'Hindi'],
        experience: '2 years',
        pricePerHour: 350,
        description: 'Friendly local guide for quick city tours.',
        rating: 4.5,
        category: 'lite',
        isLive: true,
        location: { type: 'Point', coordinates: [85.8245, 20.2661] },
        status: 'approved'
      },
      {
        userId: guideUser2._id,
        languages: ['English', 'Hindi', 'Bengali'],
        experience: '6 years',
        pricePerHour: 600,
        description: 'Certified heritage expert with deep knowledge of Odia culture.',
        rating: 4.9,
        category: 'pro',
        isLive: true,
        location: { type: 'Point', coordinates: [85.8420, 20.3200] },
        status: 'approved'
      },
      {
        userId: guideUser3._id,
        languages: ['English', 'Odia', 'French'],
        experience: '12 years',
        pricePerHour: 950,
        description: 'Premium UNESCO guide specializing in ancient temple architecture.',
        rating: 5.0,
        category: 'expert',
        isLive: true,
        location: { type: 'Point', coordinates: [85.8150, 20.2450] },
        status: 'approved'
      }
    ]);
    console.log('Guide profiles seeded');

    // 3. Create Places
    const places = await Place.insertMany([
      {
        name: 'Lingaraj Temple',
        description: 'A 11th-century temple dedicated to Lord Shiva.',
        category: 'Spiritual',
        city: 'Bhubaneswar',
        latitude: 20.2382,
        longitude: 85.8338,
        images: ['https://res.cloudinary.com/demo/image/upload/v1625213678/sample.jpg'],
      },
      {
        name: 'Konark Sun Temple',
        description: 'A 13th-century Sun Temple and UNESCO World Heritage Site.',
        category: 'Heritage',
        city: 'Konark',
        latitude: 19.8876,
        longitude: 86.0945,
        images: ['https://res.cloudinary.com/demo/image/upload/v1625213678/sample.jpg'],
      }
    ]);
    console.log('Places seeded');

    // 4. Create Bookings
    await Booking.create([
      {
        userId: tourist._id,
        guideId: guideUser1._id,
        location: 'Lingaraj Temple',
        bookingTime: new Date(),
        price: 350,
        status: 'confirmed',
        paymentStatus: 'paid'
      },
      {
        userId: tourist._id,
        guideId: guideUser2._id,
        location: 'Konark Sun Temple',
        bookingTime: new Date(Date.now() + 86400000),
        price: 600,
        status: 'pending',
        paymentStatus: 'pending'
      }
    ]);
    console.log('Bookings seeded');

    console.log('✅ SEEDING COMPLETED SUCCESSFULLY');
    process.exit(0);
  } catch (error) {
    console.error('❌ SEEDING FAILED:', error);
    process.exit(1);
  }
};

seedData();
