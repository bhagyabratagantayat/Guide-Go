const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dropLocationIndex = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/guidego');
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const guidesExists = collections.find(c => c.name === 'guides');
    
    if (guidesExists) {
      console.log('Dropping 2dsphere index on guides collection...');
      try {
        await db.collection('guides').dropIndex('location_2dsphere');
        console.log('Index dropped successfully');
      } catch (e) {
        console.log('Index might not exist or already dropped:', e.message);
      }
    }
    
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

dropLocationIndex();
