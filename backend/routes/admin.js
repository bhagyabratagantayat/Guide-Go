const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// Middleware to ensure admin only
router.use(authenticateUser);
router.use(authorizeRole('admin'));

// @desc    Get all pending KYC submissions
// @route   GET /api/admin/kyc/pending
// @access  Private (Admin)
router.get('/kyc/pending', asyncHandler(async (req, res, next) => {
  const guides = await Guide.find({ kycStatus: 'pending' })
    .populate('userId', 'name email mobile');

  res.status(200).json(guides);
}));

// @desc    Approve a KYC submission
// @route   PUT /api/admin/kyc/:guideId/approve
// @access  Private (Admin)
router.put('/kyc/:guideId/approve', asyncHandler(async (req, res, next) => {
  const guide = await Guide.findById(req.params.guideId);

  if (!guide) {
    return next(new ErrorResponse('Guide record not found', 404));
  }

  guide.kycStatus = 'approved';
  guide.kycData.reviewedAt = Date.now();
  guide.kycData.rejectionReason = '';

  await guide.save();

  res.status(200).json({ success: true });
}));

// @desc    Reject a KYC submission
// @route   PUT /api/admin/kyc/:guideId/reject
// @access  Private (Admin)
router.put('/kyc/:guideId/reject', asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  if (!reason) {
    return next(new ErrorResponse('Rejection reason is required', 400));
  }

  const guide = await Guide.findById(req.params.guideId);

  if (!guide) {
    return next(new ErrorResponse('Guide record not found', 404));
  }

  guide.kycStatus = 'rejected';
  guide.kycData.rejectionReason = reason;
  guide.kycData.reviewedAt = Date.now();

  await guide.save();

  res.status(200).json({ success: true });
}));

module.exports = router;
