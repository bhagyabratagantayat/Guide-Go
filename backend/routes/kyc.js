const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');
const { authenticateUser } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Submit KYC data
// @route   POST /api/kyc/submit
// @access  Private (Guide)
router.post('/submit', authenticateUser, upload.fields([
  { name: 'aadhaarFront', maxCount: 1 },
  { name: 'aadhaarBack', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]), asyncHandler(async (req, res, next) => {
  const { aadhaarNumber } = req.body;

  if (!aadhaarNumber || !req.files['aadhaarFront'] || !req.files['aadhaarBack'] || !req.files['selfie']) {
    return next(new ErrorResponse('Please provide Aadhaar number and all 3 photos', 400));
  }

  const aadhaarFrontBase64 = 'data:' + req.files['aadhaarFront'][0].mimetype + ';base64,' + req.files['aadhaarFront'][0].buffer.toString('base64');
  const aadhaarBackBase64 = 'data:' + req.files['aadhaarBack'][0].mimetype + ';base64,' + req.files['aadhaarBack'][0].buffer.toString('base64');
  const selfieBase64 = 'data:' + req.files['selfie'][0].mimetype + ';base64,' + req.files['selfie'][0].buffer.toString('base64');

  let guide = await Guide.findOne({ userId: req.user.id });

  if (!guide) {
    guide = new Guide({ userId: req.user.id });
  }

  guide.kycStatus = 'pending';
  guide.kycData = {
    aadhaarNumber,
    aadhaarFront: aadhaarFrontBase64,
    aadhaarBack: aadhaarBackBase64,
    selfie: selfieBase64,
    submittedAt: Date.now(),
    rejectionReason: ''
  };

  await guide.save();

  res.status(200).json({
    success: true,
    kycStatus: 'pending'
  });
}));

// @desc    Get KYC status
// @route   GET /api/kyc/status
// @access  Private
router.get('/status', authenticateUser, asyncHandler(async (req, res, next) => {
  const guide = await Guide.findOne({ userId: req.user.id });

  if (!guide) {
    return res.status(200).json({
      kycStatus: 'not_submitted',
      profileComplete: false
    });
  }

  res.status(200).json({
    kycStatus: guide.kycStatus,
    rejectionReason: guide.kycData ? guide.kycData.rejectionReason : '',
    profileComplete: guide.profileComplete
  });
}));

// @desc    Save service details after KYC approval
// @route   POST /api/kyc/service
// @access  Private (Approved Guide)
router.post('/service', authenticateUser, asyncHandler(async (req, res, next) => {
  let guide = await Guide.findOne({ userId: req.user.id });

  if (!guide || guide.kycStatus !== 'approved') {
    return next(new ErrorResponse('Guide profile not found or not KYC verified yet', 403));
  }

  const { 
    bio, 
    languages, 
    specialties, 
    primaryCity, 
    pricePerHour, 
    pricePerDay, 
    upiId, 
    availableDays 
  } = req.body;

  if (!bio || !primaryCity || !pricePerHour) {
    return next(new ErrorResponse('Bio, primary city, and price per hour are required', 400));
  }

  guide.bio = bio;
  guide.languages = languages || [];
  guide.specialties = specialties || [];
  guide.primaryCity = primaryCity;
  guide.pricePerHour = pricePerHour;
  guide.pricePerDay = pricePerDay || 0;
  guide.upiId = upiId || '';
  guide.availableDays = availableDays || [];
  guide.profileComplete = true;

  // Sync to original description field for backward compatibility
  guide.description = bio;
  guide.experience = "Verified Expert"; // Placeholder or update based on registration
  
  await guide.save();

  res.status(200).json({
    success: true,
    profileComplete: true
  });
}));

module.exports = router;
