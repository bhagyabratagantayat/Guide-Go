const User = require('../models/User');
const Guide = require('../models/Guide');
const Booking = require('../models/Booking');
const Place = require('../models/Place');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalGuides = await Guide.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const totalPlaces = await Place.countDocuments();

  // Calculate total revenue
  const revenue = await Booking.aggregate([
    { $match: { status: 'confirmed' } },
    { $group: { _id: null, total: { $sum: '$price' } } }
  ]);

  const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

  // Recent bookings
  const recentBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('touristId', 'name')
    .populate('guideId', 'name');

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalGuides,
        totalBookings,
        totalPlaces,
        totalRevenue
      },
      recentBookings
    }
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

// @desc    Get all guides (for approval)
// @route   GET /api/admin/guides
// @access  Private/Admin
const getAllGuides = asyncHandler(async (req, res, next) => {
  const guides = await Guide.find()
    .populate('userId', 'name email phone profilePicture')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: guides });
});

// @desc    Approve or reject a guide
// @route   PUT /api/admin/guides/:id/status
// @access  Private/Admin
const updateGuideStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  if (!['approved', 'rejected'].includes(status)) {
    return next(new ErrorResponse('Invalid status', 400));
  }

  const guide = await Guide.findById(req.params.id);

  if (!guide) {
    return next(new ErrorResponse('Guide not found', 404));
  }

  guide.status = status;
  await guide.save();

  // Notify guide via socket
  if (req.io) {
    req.io.to(guide.userId.toString()).emit('notification', {
      title: status === 'approved' ? 'Profile Approved!' : 'Profile Update',
      message: `Your guide profile has been ${status} by the admin.`,
      type: 'guide_status_update',
      status: status
    });
  }

  res.json({ success: true, data: guide });
});

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate('touristId', 'name email')
    .populate('guideId', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse('User not found', 404));

  user.role = role;
  await user.save();
  res.json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse('User not found', 404));
  
  await user.deleteOne();
  res.json({ success: true, message: 'User removed' });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllGuides,
  updateGuideStatus,
  getAllBookings
};
