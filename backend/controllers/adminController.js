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
  const [
    totalUsers,
    totalGuides,
    pendingGuides,
    totalBookings,
    totalPlaces,
    revenue,
    recentBookings
  ] = await Promise.all([
    User.countDocuments(),
    Guide.countDocuments(),
    Guide.countDocuments({ status: 'pending' }),
    Booking.countDocuments(),
    Place.countDocuments(),
    Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]),
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name')
      .populate('guideId', 'name')
  ]);

  const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalGuides,
        pendingGuides,
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

const getAllGuides = asyncHandler(async (req, res, next) => {
  const guides = await Guide.find()
    .populate('userId', 'name email mobile profilePicture')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: guides });
});

// @desc    Delete guide
// @route   DELETE /api/admin/guides/:id
// @access  Private/Admin
const deleteGuide = asyncHandler(async (req, res, next) => {
  const guide = await Guide.findById(req.params.id);
  if (!guide) return next(new ErrorResponse('Guide not found', 404));
  
  await guide.deleteOne();
  res.json({ success: true, message: 'Guide profile removed successfully' });
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

  // SYNC: If approved, ensure the User model role is also 'guide'
  if (status === 'approved') {
    await User.findByIdAndUpdate(guide.userId, { role: 'guide' });
  }

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
    .populate('userId', 'name email')
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

  // Cascading Delete: Remove associated Guide profile
  if (user.role === 'guide') {
    await Guide.findOneAndDelete({ userId: user._id });
  }

  // Optional: Remove associated bookings (or mark them as cancelled)
  await Booking.deleteMany({ userId: user._id });
  await Booking.deleteMany({ guideId: user._id });
  
  await user.deleteOne();
  res.json({ success: true, message: 'User and all associated data removed successfully' });
});

// @desc    Create a new admin
// @route   POST /api/admin/users/admin
// @access  Private/Admin
const createAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, password, mobile } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('User with this email already exists', 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    mobile,
    role: 'admin',
    isVerified: true // Admin created secondary admin is verified by default
  });

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Moderate guide (block/unblock)
// @route   PUT /api/admin/guides/:id/moderate
// @access  Private/Admin
const updateGuideModeration = asyncHandler(async (req, res, next) => {
  const { action, durationDays } = req.body;
  const guide = await Guide.findById(req.params.id);

  if (!guide) {
    return next(new ErrorResponse('Guide not found', 404));
  }

  if (action === 'block') {
    guide.status = 'blocked';
    guide.blockedUntil = null;
  } else if (action === 'temp_block') {
    guide.status = 'temporarily_blocked';
    const until = new Date();
    until.setDate(until.getDate() + (durationDays || 7));
    guide.blockedUntil = until;
  } else if (action === 'unblock') {
    guide.status = 'approved';
    guide.blockedUntil = null;
  }

  await guide.save();

  // Notify guide via socket
  if (req.io) {
    req.io.to(guide.userId.toString()).emit('notification', {
      title: 'Account Status Update',
      message: `Your guide account has been ${action}ed by the admin.`,
      type: 'guide_moderation',
      action: action
    });
  }

  res.json({ success: true, data: guide });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllGuides,
  updateGuideStatus,
  updateGuideModeration,
  deleteGuide,
  getAllBookings,
  createAdmin
};
