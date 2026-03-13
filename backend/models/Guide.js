const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  languages: [{ type: String }],
  experience: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  description: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  profileImage: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  isLive: {
    type: Boolean,
    default: false
  },
});

guideSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Guide', guideSchema);
