const mongoose = require('mongoose');
require('dotenv').config();
const Guide = require('./models/Guide');
const User = require('./models/User');

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Fetching all guides...');
    const guides = await Guide.find().sort({ 
      kycStatus: -1, 
      status: -1, 
      profileComplete: -1 
    });

    const seen = new Set();
    const toDelete = [];
    const kept = [];

    for (const g of guides) {
      if (!g.userId) continue;
      const uId = g.userId.toString();
      if (seen.has(uId)) {
        console.log(`Duplicate found for user ${uId}: Guide ID ${g._id} (Status: ${g.status}, KYC: ${g.kycStatus}). Marking for deletion.`);
        toDelete.push(g._id);
      } else {
        console.log(`Keeping primary record for user ${uId}: Guide ID ${g._id} (Status: ${g.status}, KYC: ${g.kycStatus})`);
        seen.add(uId);
        kept.push(g);
      }
    }

    if (toDelete.length > 0) {
      console.log(`Deleting ${toDelete.length} duplicate records...`);
      const result = await Guide.deleteMany({ _id: { $in: toDelete } });
      console.log(`Successfully deleted ${result.deletedCount} duplicates.`);
    } else {
      console.log('No duplicates found.');
    }

    // Fix consistency
    console.log('Ensuring consistency for kept records...');
    for (const g of kept) {
      let changed = false;
      if (g.kycStatus === 'approved' && g.status !== 'approved') {
        console.log(`Fixing status for guide ${g._id} (currently ${g.status} -> setting to approved)`);
        g.status = 'approved';
        changed = true;
      }
      if (changed) await g.save();
    }

    console.log('Cleanup and repair finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('CRITICAL ERROR DURING CLEANUP:', error);
    process.exit(1);
  }
}

cleanup();
