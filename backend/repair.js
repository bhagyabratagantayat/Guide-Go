const mongoose = require('mongoose');
require('dotenv').config();
const Guide = require('./models/Guide');
const User = require('./models/User');

async function repair() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Repairing guide statuses...');
    const result = await Guide.updateMany(
      { kycStatus: 'approved', status: { $ne: 'approved' } },
      { $set: { status: 'approved' } }
    );
    console.log(`Updated ${result.modifiedCount} records to status: approved`);

    // Also handle users where role is set but enum mismatch happened
    console.log('Checking for user role mismatches...');
    const users = await User.updateMany(
      { role: 'traveler' },
      { $set: { role: 'user' } } // Fallback to 'user' if 'traveler' becomes an issue
    );
    console.log(`Updated ${users.modifiedCount} users with traveler role`);

    process.exit(0);
  } catch (error) {
    console.error('Repair failed:', error);
    process.exit(1);
  }
}

repair();
