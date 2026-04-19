const Guide = require('../models/Guide');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const cloudinary = require('../config/cloudinary');

const getGuides = asyncHandler(async (req, res, next) => {
  const guides = await Guide.find({ 
    profileComplete: true,
    kycStatus: 'approved' 
  }).populate('userId', 'name email profilePicture');
  res.json(guides);
});

const getGuideById = asyncHandler(async (req, res, next) => {
  const guide = await Guide.findById(req.params.id).populate('userId', 'name email profilePicture mobile');
  
  if (!guide) {
    return next(new ErrorResponse('Guide not found', 404));
  }

  if (!guide.profileComplete) {
    return next(new ErrorResponse('This guide profile is not yet complete', 403));
  }

  res.json(guide);
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
    profileComplete: true,
    kycStatus: 'approved',
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

const getOnboardingStatus = asyncHandler(async (req, res, next) => {
  const guide = await Guide.findOne({ userId: req.user._id });
  if (!guide) {
    return next(new ErrorResponse('Guide not found', 404));
  }
  res.json({
    profileComplete: guide.profileComplete,
    onboardingStep: guide.onboardingStep
  });
});

const updateOnboardingStep = asyncHandler(async (req, res, next) => {
  const stepNumber = parseInt(req.params.stepNumber);
  const guide = await Guide.findOne({ userId: req.user._id });

  if (!guide) {
    return next(new ErrorResponse('Guide profile not found. Please register as a guide first.', 404));
  }

  const updateData = { ...req.body, onboardingStep: stepNumber };
  
  // Handle complex objects parsing if they come as strings (common with multipart/form-data)
  const jsonFields = ['availability', 'packages', 'portfolio', 'languages', 'specialties', 'serviceAreas', 'location'];
  jsonFields.forEach(field => {
    if (typeof req.body[field] === 'string') {
      try {
        updateData[field] = JSON.parse(req.body[field]);
      } catch (e) {
        // Fallback or ignore if not valid JSON
      }
    }
  });

  // Handle file uploads if any
  if (req.files && req.files.length > 0) {
    if (!updateData.portfolio) updateData.portfolio = guide.portfolio ? JSON.parse(JSON.stringify(guide.portfolio)) : { photos: [], certificates: [], videoIntro: '' };

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: `guidego/guides/${req.user._id}`,
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      if (file.fieldname === 'upiQrCode') {
        updateData.upiQrCode = result.secure_url;
      } else if (file.fieldname === 'profileImage') {
        updateData.profileImage = result.secure_url;
      } else if (file.fieldname === 'tourPhotos') {
        if (!updateData.portfolio.photos) updateData.portfolio.photos = [];
        updateData.portfolio.photos.push(result.secure_url);
      } else if (file.fieldname === 'certificates') {
        if (!updateData.portfolio.certificates) updateData.portfolio.certificates = [];
        updateData.portfolio.certificates.push(result.secure_url);
      } else if (file.fieldname === 'videoIntro') {
        updateData.portfolio.videoIntro = result.secure_url;
      }
    }
  }

  if (stepNumber === 6) {
    updateData.profileComplete = true;
  }

  const updatedGuide = await Guide.findOneAndUpdate(
    { userId: req.user._id },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    profileComplete: updatedGuide.profileComplete,
    onboardingStep: updatedGuide.onboardingStep,
    data: updatedGuide
  });
});

module.exports = { 
  getGuides, 
  getGuideById,
  registerGuide, 
  getNearbyGuides, 
  toggleLiveStatus, 
  getGuideProfile,
  getOnboardingStatus,
  updateOnboardingStep
};
