const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { 
  getDashboardStats, 
  getAllUsers, 
  getAllGuides, 
  updateGuideStatus, 
  deleteGuide,
  getAllBookings 
} = require('../controllers/adminController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// All routes are admin only
router.use(authenticateUser);
router.use(authorizeRole('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/users/admin', require('../controllers/adminController').createAdmin);
router.put('/users/:id/role', require('../controllers/adminController').updateUserRole);
router.delete('/users/:id', require('../controllers/adminController').deleteUser);
router.get('/guides', getAllGuides);
router.put('/guides/:id/status', updateGuideStatus);
router.delete('/guides/:id', deleteGuide);
router.put('/guides/:id/moderate', require('../controllers/adminController').updateGuideModeration);
router.get('/bookings', getAllBookings);

// KYC Management
router.get('/kyc/pending', asyncHandler(async (req, res, next) => {
  const guides = await Guide.find({ kycStatus: 'pending' })
    .populate('userId', 'name email mobile profilePicture');
  res.status(200).json(guides);
}));

router.put('/kyc/:guideId/approve', asyncHandler(async (req, res, next) => {
  const guide = await Guide.findById(req.params.guideId);
  if (!guide) return next(new ErrorResponse('Guide record not found', 404));
  
  guide.kycStatus = 'approved';
  if (guide.kycData) guide.kycData.reviewedAt = Date.now();
  await guide.save();
  res.status(200).json({ success: true });
}));

router.put('/kyc/:guideId/reject', asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  if (!reason) return next(new ErrorResponse('Rejection reason is required', 400));
  
  const guide = await Guide.findById(req.params.guideId);
  if (!guide) return next(new ErrorResponse('Guide record not found', 404));
  
  guide.kycStatus = 'rejected';
  if (guide.kycData) {
    guide.kycData.rejectionReason = reason;
    guide.kycData.reviewedAt = Date.now();
  }
  await guide.save();
  res.status(200).json({ success: true });
}));

module.exports = router;
