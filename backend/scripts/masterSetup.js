const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Guide = require('../models/Guide');
const Place = require('../models/Place');
const config = require('../config/env');

const seedData = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // 1. DEFAULT ADMIN ACCOUNT
    const adminEmail = 'admin@guidego.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'GuideGo Admin',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
        mobile: '0000000000',
        isVerified: true,
        location: 'Bhubaneswar'
      });
      console.log('Default admin created: admin@guidego.com');
    } else {
      console.log('Admin account already exists.');
    }

    // 2. DEMO TOURIST PLACES
    const placesCount = await Place.countDocuments();
    if (placesCount === 0) {
      const demoPlaces = [
        {
          name: 'Konark Sun Temple',
          description: 'A 13th-century Sun Temple and UNESCO World Heritage site, famous for its intricate carvings and chariot-like structure.',
          latitude: 19.8876,
          longitude: 86.0945,
          category: 'Spiritual',
          image: 'https://images.unsplash.com/photo-1596402184320-417d7178a2cd'
        },
        {
          name: 'Puri Jagannath Temple',
          description: 'One of the Char Dhams, this major pilgrimage site is dedicated to Lord Jagannath.',
          latitude: 19.8135,
          longitude: 85.8179,
          category: 'Spiritual',
          image: 'https://images.unsplash.com/photo-1621360841013-c7683c659ec6'
        },
        {
          name: 'Lingaraj Temple',
          description: 'The largest temple in Bhubaneswar, dedicated to Lord Shiva, representing the Kalinga architectural style.',
          latitude: 20.2403,
          longitude: 85.8335,
          category: 'Ancient',
          image: 'https://images.unsplash.com/photo-1590733403305-675c9298585e'
        },
        {
          name: 'Udayagiri Caves',
          description: 'Ancient rock-cut caves with historical inscriptions and Buddhist artifacts.',
          latitude: 20.2580,
          longitude: 85.7950,
          category: 'Caves',
          image: 'https://images.unsplash.com/photo-1524492459422-ad5193910f54'
        },
        {
          name: 'Nandankanan Zoo',
          description: 'A botanical garden and zoo famous for its white tiger safari.',
          latitude: 20.3956,
          longitude: 85.8260,
          category: 'Nature',
          image: 'https://images.unsplash.com/photo-1525923838299-2312b60f6d69'
        }
      ];
      await Place.insertMany(demoPlaces);
      console.log('Seeded 5 demo tourist places.');
    } else {
      console.log('Places collection is not empty.');
    }

    // 3. DEMO GUIDE DATA (5 Guides near Bhubaneswar)
    const guidesCount = await Guide.countDocuments();
    if (guidesCount === 0) {
      const demoGuides = [
        {
          name: 'Karan Singh',
          email: 'karan@guidego.com',
          guideData: {
            languages: ['Odia', 'Hindi', 'English'],
            experience: '5 years',
            pricePerHour: 500,
            description: 'Expert in Old Town heritage and Lingaraj Temple history.',
            coords: [85.8335, 20.2403],
            rating: 4.8
          }
        },
        {
          name: 'Sonalika Das',
          email: 'sonalika@guidego.com',
          guideData: {
            languages: ['English', 'Bengali'],
            experience: '3 years',
            pricePerHour: 400,
            description: 'Specialized in museums and market explorations.',
            coords: [85.8245, 20.2961],
            rating: 4.7
          }
        },
        {
          name: 'Amit Mohanty',
          email: 'amit@guidego.com',
          guideData: {
            languages: ['Odia', 'Hindi'],
            experience: '10 years',
            pricePerHour: 700,
            description: 'Senior guide for caves and archeological sites.',
            coords: [85.7950, 20.2580],
            rating: 4.9
          }
        },
        {
          name: 'Riya Roy',
          email: 'riya@guidego.com',
          guideData: {
            languages: ['English', 'Spanish'],
            experience: '4 years',
            pricePerHour: 600,
            description: 'Enthusiastic guide for wildlife and nature safaris.',
            coords: [85.8260, 20.3956],
            rating: 4.6
          }
        },
        {
          name: 'Vikram Jenax',
          email: 'vikram@guidego.com',
          guideData: {
            languages: ['Odia', 'English', 'Telugu'],
            experience: '6 years',
            pricePerHour: 450,
            description: 'Local expert for Puri beach and temple tours.',
            coords: [85.8179, 19.8135],
            rating: 4.5
          }
        }
      ];

      for (const dg of demoGuides) {
        let user = await User.findOne({ email: dg.email });
        if (!user) {
          user = await User.create({
            name: dg.name,
            email: dg.email,
            password: 'Password@123',
            role: 'guide',
            mobile: Math.random().toString().slice(2, 12),
            isVerified: true,
            location: 'Bhubaneswar'
          });
        }
        await Guide.create({
          userId: user._id,
          languages: dg.guideData.languages,
          experience: dg.guideData.experience,
          pricePerHour: dg.guideData.pricePerHour,
          description: dg.guideData.description,
          rating: dg.guideData.rating,
          isLive: true,
          location: {
            type: 'Point',
            coordinates: dg.guideData.coords
          },
          status: 'approved'
        });
      }
      console.log('Seeded 5 demo guides.');
    } else {
      console.log('Guides collection is not empty.');
    }

    console.log('Master Audit Setup Finished Successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Audit Setup Failed:', err);
    process.exit(1);
  }
};

seedData();
