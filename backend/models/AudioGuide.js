const mongoose = require('mongoose');

const audioGuideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  audioUrl: { type: String },
  accent: { type: String, default: '#ff385c' },
  fullDetails: {
    history: { type: String },
    highlights: [{ type: String }],
    bestTime: { type: String },
    stops: [
      {
        title: { type: String },
        time: { type: String },
        description: { type: String }
      }
    ]
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AudioGuide', audioGuideSchema);
