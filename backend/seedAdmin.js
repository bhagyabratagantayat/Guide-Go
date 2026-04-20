const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@guidego.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.role = 'admin';
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log('Existing user promoted to admin');
    } else {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'adminpassword123',
        mobile: '9999999999',
        role: 'admin',
        isVerified: true
      });
      console.log('New admin created: admin@guidego.com / adminpassword123');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
