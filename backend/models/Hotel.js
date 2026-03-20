const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  amenities: [{ type: String }],
  images: [{ type: String }],
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  category: { type: String, enum: ['budget', 'mid-range', 'luxury'], default: 'budget' },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotel', hotelSchema);
