const User = require('../models/User');
const Guide = require('../models/Guide');
const logger = require('./logger');

const ensureDemoAccounts = async () => {
  try {
    // 1. Create Demo User (Explorer)
    await User.findOneAndUpdate(
      { email: 'user@demo.com' },
      {
        name: 'Demo Traveler',
        password: 'demo123', // Hashed by pre-save middleware
        role: 'user',
        mobile: '9876543210',
        isVerified: true,
        location: 'Puri, Odisha'
      },
      { upsert: true, new: true }
    );

    // 2. Create Demo Admin
    await User.findOneAndUpdate(
      { email: 'admin@demo.com' },
      {
        name: 'Super Admin',
        password: 'demo123',
        role: 'admin',
        mobile: '1234567890',
        isVerified: true,
        location: 'Bhubaneswar'
      },
      { upsert: true, new: true }
    );

    // 3. Create Demo Guide
    const guideUser = await User.findOneAndUpdate(
      { email: 'guide@demo.com' },
      {
        name: 'Expert Guide',
        password: 'demo123',
        role: 'guide',
        mobile: '5556667777',
        isVerified: true,
        location: 'Konark'
      },
      { upsert: true, new: true }
    );

    if (guideUser) {
      await Guide.findOneAndUpdate(
        { userId: guideUser._id },
        {
          experience: '10 Years',
          pricePerHour: 500,
          description: 'Certified heritage expert focusing on the Golden Triangle of Odisha.',
          status: 'approved',
          isLive: true,
          languages: ['English', 'Hindi', 'Odia'],
          location: { type: 'Point', coordinates: [86.0945, 19.8876] },
          packages: [
            { title: 'Heritage Walk', description: 'Explore the Sun Temple and local crafts.', price: 1500, duration: '4 Hours' },
            { title: 'Full Day Odyssey', description: 'Comprehensive tour including lunch.', price: 3000, duration: '8 Hours' }
          ]
        },
        { upsert: true }
      );
    }

    logger.info('Demo Accounts Synchronization: SUCCESS');
  } catch (error) {
    logger.error(`Demo Seeding Error: ${error.message}`);
  }
};

module.exports = { ensureDemoAccounts };
