const mongoose = require('mongoose');
const User = require('./models/User');
const Guide = require('./models/Guide');
const dotenv = require('dotenv');

dotenv.config();

const checkArjun = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/guide-go');
    console.log('Connected to DB');

    const user = await User.findOne({ name: /Arjun Das/i });
    if (!user) {
      console.log('User Arjun Das not found');
      process.exit();
    }

    console.log('User:', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    });

    const guide = await Guide.findOne({ userId: user._id });
    if (!guide) {
      console.log('Guide record not found for Arjun Das');
    } else {
      console.log('Guide Status:', {
          kycStatus: guide.kycStatus,
          status: guide.status,
          profileComplete: guide.profileComplete,
          aadhaarNumber: guide.kycData?.aadhaarNumber
      });
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkArjun();
