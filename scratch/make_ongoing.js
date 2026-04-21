const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const Booking = require('../backend/models/Booking');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const latest = await Booking.findOne({ status: 'accepted' }).sort('-createdAt');
  
  if (latest) {
    latest.status = 'ongoing';
    latest.startedAt = new Date();
    await latest.save();
    console.log('TRANSITIONED_TO_ONGOING:', latest._id);
  } else {
    console.log('NO_ACCEPTED_BOOKING_FOUND');
  }
  process.exit(0);
}

run();
