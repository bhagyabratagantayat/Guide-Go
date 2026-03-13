const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  images: [{ type: String }],
  audioGuideText: { type: String },
  createdAt: { type: Date, default: Date.now },
});

placeSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Place', placeSchema);
