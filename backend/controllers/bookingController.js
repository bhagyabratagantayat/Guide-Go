const Booking = require('../models/Booking');
const Guide = require('../models/Guide');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a booking (starts in 'searching' state)
// @route   POST /api/bookings
const createBooking = asyncHandler(async (req, res, next) => {
  const { location, plan, language, price, bookingTime } = req.body;

  const booking = await Booking.create({
    userId: req.user._id,
    location,
    plan,
    language,
    price,
    bookingTime: bookingTime || Date.now(),
    status: 'searching'
  });

  // Broadcast to all approved guides
  if (req.io) {
    req.io.emit('new_booking_broadcast', {
      message: 'New tour request nearby!',
      booking
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

  // Populate guide details for the user
  const guideInfo = await User.findById(req.user._id).select('name phone profilePicture');

  // Notify User
  if (req.io) {
    req.io.to(booking.userId.toString()).emit('booking_accepted', {
      bookingId: booking._id,
      guide: guideInfo,
      otp: otp
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
    req.io.to(booking.userId.toString()).emit('trip_started', { bookingId: booking._id });
    req.io.to(booking.guideId.toString()).emit('trip_started', { bookingId: booking._id });
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
    .populate('guideId', 'name email phone profilePicture')
    .sort('-createdAt');
  res.json(bookings);
});

const getGuideBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ guideId: req.user._id })
    .populate('userId', 'name email phone profilePicture')
    .sort('-createdAt');
  res.json(bookings);
});

const updateBookingStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(booking);
});

// @desc    Add review for a booking
// @route   POST /api/bookings/:id/review
const addBookingReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  // Ensure only the traveler who made the booking can review it
  if (booking.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to review this booking', 401));
  }

  booking.review = { rating, comment };
  await booking.save();

  // Update guide average rating
  const guideBookings = await Booking.find({ guideId: booking.guideId, 'review.rating': { $exists: true } });
  if (guideBookings.length > 0) {
    const totalRating = guideBookings.reduce((sum, b) => sum + b.review.rating, 0);
    const avgRating = totalRating / guideBookings.length;
    await User.findByIdAndUpdate(booking.guideId, { rating: avgRating });
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
