const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const Booking = require('../backend/models/Booking');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const latest = await Booking.findOne({ status: 'accepted' })
    .populate('userId guideId')
    .sort('-createdAt');
  
  if (latest) {
    console.log('LATEST_ACCEPTED_BOOKING:', JSON.stringify(latest, null, 2));
  } else {
    const ongoing = await Booking.findOne({ status: 'ongoing' })
      .populate('userId guideId')
      .sort('-createdAt');
    console.log('LATEST_ONGOING_BOOKING:', JSON.stringify(ongoing, null, 2));
  }
  process.exit(0);
}

run();
