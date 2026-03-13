const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'admin@guidego.com';
    
    console.log(`Deleting existing admin if any: ${email}`);
    await User.deleteMany({ email });
    
    console.log(`Creating new admin...`);
    await User.create({
      name: 'GuideGo Administrator',
      email,
      password: 'Admin@Reset2026',
      role: 'admin',
      mobile: '9999999999',
      isVerified: true,
      location: 'Bhubaneswar'
    });
    
    console.log('Admin account recreated successfully with role: admin');
    process.exit(0);
  } catch (err) {
    console.error('Reset failed:', err);
    process.exit(1);
  }
};

resetAdmin();
