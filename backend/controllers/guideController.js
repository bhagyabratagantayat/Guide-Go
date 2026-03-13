const Guide = require('../models/Guide');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const cloudinary = require('../config/cloudinary');

const getGuides = asyncHandler(async (req, res, next) => {
  const guides = await Guide.find().populate('userId', 'name email profilePicture');
  res.json(guides);
});

const getGuideProfile = asyncHandler(async (req, res, next) => {
  const guide = await Guide.findOne({ userId: req.user._id }).populate('userId', 'name email mobile');
  if (!guide) {
    return next(new ErrorResponse('Guide not found', 404));
  }
  res.json(guide);
});

const registerGuide = asyncHandler(async (req, res, next) => {
  const { languages, experience, pricePerHour, description, location } = req.body;
  
  let profileImage = '';

  if (req.file) {
    // Upload image to cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'guidego/guides' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    profileImage = result.secure_url;
  }

  const guide = await Guide.create({
    userId: req.user._id,
    languages: typeof languages === 'string' ? JSON.parse(languages) : languages,
    experience,
    pricePerHour,
    description,
    location: typeof location === 'string' ? JSON.parse(location) : location,
    profileImage,
  });
  res.status(201).json(guide);
});

const getNearbyGuides = asyncHandler(async (req, res, next) => {
  const { lng, lat, distance } = req.query; // distance in meters
  const guides = await Guide.find({
    isLive: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseInt(distance) || 10000,
      },
    },
  }).populate('userId', 'name profilePicture');
  res.json(guides);
});

const toggleLiveStatus = asyncHandler(async (req, res, next) => {
  const { isLive, location } = req.body;
  const updateData = { isLive };
  if (location) updateData.location = location;
  
  const guide = await Guide.findOneAndUpdate(
    { userId: req.user._id },
    updateData,
    { new: true, runValidators: true }
  );

  if (!guide) {
    return next(new ErrorResponse('Guide profile not found', 404));
  }

  res.json({
    success: true,
    isLive: guide.isLive,
    location: guide.location
  });
});

module.exports = { getGuides, registerGuide, getNearbyGuides, toggleLiveStatus, getGuideProfile };
