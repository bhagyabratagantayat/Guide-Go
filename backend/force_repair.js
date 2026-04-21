const mongoose = require('mongoose');
require('dotenv').config();
const Guide = require('./models/Guide');

async function forceRepair() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');
    
    // Force all KYC-approved guides to have status 'approved'
    const result = await Guide.updateMany(
      { kycStatus: 'approved' },
      { $set: { status: 'approved' } }
    );
    console.log(`Successfully forced ${result.modifiedCount} guides to approved status.`);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

forceRepair();
