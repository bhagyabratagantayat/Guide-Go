const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User'); 
const Booking = require('../models/Booking'); 
const Review = require('../models/Review'); 
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function migrate() {
    try {
        console.log('Connecting to DB...');
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Rename role 'tourist' to 'user'
        const resUser = await User.updateMany({ role: 'tourist' }, { $set: { role: 'user' } });
        console.log(`Updated ${resUser.modifiedCount} users from "tourist" to "user"`);

        // 2. Rename field 'touristId' to 'userId' in Bookings
        const resBooking = await Booking.updateMany(
            { touristId: { $exists: true } }, 
            { $rename: { touristId: 'userId' } }
        );
        console.log(`Renamed 'touristId' to 'userId' in ${resBooking.modifiedCount} bookings`);

        // 3. Rename field 'touristId' to 'userId' in Reviews
        const resReview = await Review.updateMany(
            { touristId: { $exists: true } }, 
            { $rename: { touristId: 'userId' } }
        );
        console.log(`Renamed 'touristId' to 'userId' in ${resReview.modifiedCount} reviews`);
        
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}
migrate();
