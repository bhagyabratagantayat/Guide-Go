const Place = require('../models/Place');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const cloudinary = require('../config/cloudinary');

const getPlaces = asyncHandler(async (req, res, next) => {
  const places = await Place.find();
  res.json(places);
});

const getPlaceById = asyncHandler(async (req, res, next) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    return next(new ErrorResponse('Place not found', 404, 'PLACE_NOT_FOUND'));
  }
  res.json(place);
});

const createPlace = asyncHandler(async (req, res, next) => {
  const { name, description, latitude, longitude, category, audioGuideText } = req.body;
  
  let imageUrl = '';
  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'guidego/places' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    imageUrl = result.secure_url;
  }

  const place = await Place.create({
    name,
    description,
    latitude,
    longitude,
    category,
    audioGuideText,
    image: imageUrl
  });

  res.status(201).json(place);
});

const updatePlace = asyncHandler(async (req, res, next) => {
  let place = await Place.findById(req.params.id);
  if (!place) {
    return next(new ErrorResponse('Place not found', 404));
  }

  const { name, description, latitude, longitude, category, audioGuideText } = req.body;
  
  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'guidego/places' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    place.image = result.secure_url;
  }

  place.name = name || place.name;
  place.description = description || place.description;
  place.latitude = latitude || place.latitude;
  place.longitude = longitude || place.longitude;
  place.category = category || place.category;
  place.audioGuideText = audioGuideText || place.audioGuideText;

  await place.save();
  res.json(place);
});

const deletePlace = asyncHandler(async (req, res, next) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    return next(new ErrorResponse('Place not found', 404));
  }
  await place.deleteOne();
  res.json({ success: true, message: 'Place removed' });
});

const getNearbyPlaces = asyncHandler(async (req, res, next) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return next(new ErrorResponse('Please provide latitude and longitude', 400));
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  // Haversine formula to calculate distance in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const allPlaces = await Place.find();
  const nearbyPlaces = allPlaces.filter(place => {
    const distance = calculateDistance(userLat, userLng, place.latitude, place.longitude);
    return distance <= 10; // 10 km radius
  });

  res.json(nearbyPlaces);
});

module.exports = { getPlaces, getPlaceById, createPlace, updatePlace, deletePlace, getNearbyPlaces };
