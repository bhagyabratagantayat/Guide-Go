const mongoose = require('mongoose');
require('dotenv').config();
const Guide = require('./models/Guide');

async function fixArjun() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');
    
    const result = await Guide.updateOne(
      { userId: '69e22ecb49fd991117cd50db' },
      { $set: { status: 'approved', kycStatus: 'approved' } }
    );
    console.log('Update result:', result);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixArjun();
