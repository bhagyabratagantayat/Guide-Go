const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: { type: String, required: true },
  bookingTime: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['searching', 'accepted', 'ongoing', 'completed', 'cancelled'], 
    default: 'searching' 
  },
  plan: { type: String },
  language: { type: String },
  otp: { type: String },
  otpVerified: { type: Boolean, default: false },
  startedAt: { type: Date },
  endedAt: { type: Date },
  paymentMethod: { type: String, enum: ['cash', 'upi', 'card'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  transactionId: { type: String },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
