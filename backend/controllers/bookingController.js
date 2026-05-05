const Booking = require('../models/Booking');
const Guide = require('../models/Guide');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a booking (starts in 'searching' state)
// @route   POST /api/bookings
const createBooking = asyncHandler(async (req, res, next) => {
  const { location, plan, language, price, bookingTime, userLat, userLng } = req.body;

  const booking = await Booking.create({
    userId: req.user._id,
    location,
    plan,
    language,
    price,
    bookingTime: bookingTime || Date.now(),
    status: 'searching',
    userLat,
    userLng
  });

  // Broadcast to all approved guides
  if (req.io) {
    // Count active guides
    const activeCount = await Guide.countDocuments({ isLive: true });
    
    req.io.emit('new_booking_broadcast', {
      message: 'New tour request nearby!',
      booking
    });

    // Notify the specific user about active guides
    req.io.to(req.user._id.toString()).emit('booking_stats_initial', {
      activeCount
    });
  }

  res.status(201).json(booking);
});

// @desc    Guide accepts a booking
// @route   PUT /api/bookings/accept/:id
const acceptBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  if (booking.status !== 'searching') {
    return next(new ErrorResponse('Booking already taken or unavailable', 400));
  }

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  booking.guideId = req.user._id;
  booking.status = 'accepted';
  booking.otp = otp;
  await booking.save();

  // Notify User
  if (req.io) {
    // Notify Traveler
    req.io.to(booking.userId.toString()).emit('booking_accepted', {
      booking: booking,
      guide: {
        name: req.user.name,
        mobile: req.user.mobile,
        rating: req.user.rating || 5.0,
        profilePicture: req.user.profilePicture,
        lat: req.body.lat,
        lng: req.body.lng
      }
    });

    // Notify Guide (themselves) to refresh dashboard
    req.io.to(req.user._id.toString()).emit('booking_accepted_guide', {
      booking: booking
    });
  }

  res.json({ booking, otp });
});

// @desc    Verify OTP and start trip
// @route   POST /api/bookings/verify-otp/:id
const verifyOtp = asyncHandler(async (req, res, next) => {
  const { otpEntered } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  if (booking.otp !== otpEntered) {
    return next(new ErrorResponse('Invalid OTP sequence', 400));
  }

  booking.otpVerified = true;
  booking.status = 'ongoing';
  booking.startedAt = Date.now();
  await booking.save();

  // Notify both
  if (req.io) {
    req.io.to(booking.userId.toString()).emit('trip_started', { 
      bookingId: booking._id,
      startedAt: booking.startedAt
    });
    req.io.to(booking.guideId.toString()).emit('trip_started', { 
      bookingId: booking._id,
      startedAt: booking.startedAt
    });
  }

  res.json(booking);
});

// @desc    End the trip
// @route   POST /api/bookings/end/:id
const endBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  booking.status = 'completed';
  booking.endedAt = Date.now();
  await booking.save();

  // Notify User to pay/review
  if (req.io) {
    req.io.to(booking.userId.toString()).emit('trip_ended', { bookingId: booking._id });
  }

  res.json(booking);
});

const getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate('guideId', 'name email mobile profilePicture rating')
    .sort('-createdAt');
  res.json({ success: true, data: bookings });
});

const getGuideBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ guideId: req.user._id })
    .populate('userId', 'name mobile profilePicture')
    .sort('-createdAt');
  res.json({ success: true, data: bookings });
});

const updateBookingStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404));
    }

    // Auth check: Only traveler or guide of this booking
    const isOwner = booking.userId.toString() === req.user._id.toString();
    const isAssignedGuide = booking.guideId?.toString() === req.user._id.toString();

    if (!isOwner && !isAssignedGuide && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this booking', 401));
    }

    booking.status = status;
    await booking.save();

    // If cancelled by guide, notify user
    if (status === 'cancelled' && isAssignedGuide && req.io) {
      req.io.to(booking.userId.toString()).emit('booking_cancelled', {
        bookingId: booking._id,
        reason: 'Cancelled by guide'
      });
    }

    // If cancelled by traveler, notify guide
    if (status === 'cancelled' && isOwner && booking.guideId && req.io) {
      req.io.to(booking.guideId.toString()).emit('booking_cancelled', {
        bookingId: booking._id,
        reason: 'Cancelled by traveler'
      });
    }

    res.json(booking);
});

// @desc    Add review for a booking
// @route   POST /api/bookings/:id/review
const addBookingReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  console.log("REVIEW SUBMIT ATTEMPT:", { bookingId: req.params.id, rating, comment, userId: req.user?._id });

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    console.error("REVIEW ERROR: Booking not found");
    return next(new ErrorResponse('Booking not found', 404));
  }

  // Ensure only the traveler who made the booking can review it
  if (booking.userId.toString() !== req.user._id.toString()) {
    console.error("REVIEW ERROR: Auth mismatch", { bookingUser: booking.userId, reqUser: req.user._id });
    return next(new ErrorResponse('Not authorized to review this booking', 401));
  }

  booking.review = { rating, comment };
  await booking.save();

  // Update guide average rating and review count
  const guideBookings = await Booking.find({ guideId: booking.guideId, 'review.rating': { $exists: true } });
  if (guideBookings.length > 0) {
    const totalRating = guideBookings.reduce((sum, b) => sum + b.review.rating, 0);
    const avgRating = totalRating / guideBookings.length;
    
    // Update Guide profile
    await Guide.findOneAndUpdate(
      { userId: booking.guideId }, 
      { rating: avgRating, numReviews: guideBookings.length }
    );
  }

  res.json(booking);
});

module.exports = { 
  createBooking, 
  acceptBooking, 
  verifyOtp, 
  endBooking, 
  getUserBookings, 
  getGuideBookings, 
  updateBookingStatus,
  addBookingReview
};
