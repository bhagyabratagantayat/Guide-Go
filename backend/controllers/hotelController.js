const Hotel = require('../models/Hotel');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all hotels
// @route   GET /api/hotels
const getHotels = asyncHandler(async (req, res, next) => {
  const hotels = await Hotel.find();
  res.json(hotels);
});

// @desc    Get nearby hotels
// @route   GET /api/hotels/nearby
const getNearbyHotels = asyncHandler(async (req, res, next) => {
  const { lat, lng, distance = 10000 } = req.query;

  if (!lat || !lng) {
    return next(new ErrorResponse('Please provide latitude and longitude', 400));
  }

  // Basic bounding box search for simplicity in this demo
  const latDelta = distance / 111000;
  const lngDelta = distance / (111000 * Math.cos(lat * Math.PI / 180));

  const hotels = await Hotel.find({
    latitude: { $gte: Number(lat) - latDelta, $lte: Number(lat) + latDelta },
    longitude: { $gte: Number(lng) - lngDelta, $lte: Number(lng) + lngDelta }
  });

  res.json(hotels);
});

module.exports = { getHotels, getNearbyHotels };
