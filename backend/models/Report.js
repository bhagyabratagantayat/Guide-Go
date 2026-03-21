const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guide',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  reason: {
    type: String,
    required: true,
    enum: ['Misconduct', 'Safety Concern', 'Overcharging', 'No Show', 'Unprofessional Behavior', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'action_taken'],
    default: 'pending'
  },
  adminAction: {
    type: String,
    enum: ['none', 'warned', 'temporarily_blocked', 'permanently_blocked'],
    default: 'none'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
