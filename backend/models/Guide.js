const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // KYC Section
  kycStatus: {
    type: String,
    enum: ['not_submitted', 'pending', 'approved', 'rejected'],
    default: 'not_submitted'
  },
  kycData: {
    aadhaarNumber: { type: String, default: '' },
    aadhaarFront:  { type: String, default: '' }, // Base64
    aadhaarBack:   { type: String, default: '' },  // Base64
    selfie:        { type: String, default: '' },         // Base64
    submittedAt:   { type: Date },
    reviewedAt:    { type: Date },
    rejectionReason: { type: String, default: '' }
  },

  // Service Section
  bio:          { type: String, default: '' },
  languages:    { type: [String], default: [] },
  specialties:  { type: [String], default: [] },
  primaryCity:  { type: String, default: '' },
  pricePerHour: { type: Number, default: 0 },
  pricePerDay:  { type: Number, default: 0 },
  upiId:        { type: String, default: '' },
  availableDays:{ type: [String], default: [] },
  profileComplete: { type: Boolean, default: false },

  // Metadata
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  location: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'blocked', 'temporarily_blocked'], 
    default: 'pending' 
  },
  isLive: {
    type: Boolean,
    default: false
  },
  blockedUntil: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Guide', guideSchema);
