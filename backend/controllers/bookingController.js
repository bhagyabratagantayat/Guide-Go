const Booking = require('../models/Booking');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const createBooking = asyncHandler(async (req, res, next) => {
  const { guideId, location, bookingTime, price, paymentMethod } = req.body;
  const booking = await Booking.create({
    touristId: req.user._id,
    guideId,
    location,
    bookingTime,
    price,
    paymentMethod: paymentMethod || 'cash',
    paymentStatus: 'pending'
  });

  // Notify guide
  if (req.io) {
    req.io.to(guideId.toString()).emit('notification', {
      title: 'New Booking!',
      message: `You have a new booking request for ${location}`,
      type: 'booking_received',
      bookingId: booking._id
    });
  }

  res.status(201).json(booking);
});

const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404, 'BOOKING_NOT_FOUND'));
  }

  // Check if guide is authorized
  if (booking.guideId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to update this booking', 401, 'NOT_AUTHORIZED'));
  }

  booking.status = status;
  await booking.save();

  // Notify tourist
  if (req.io) {
    req.io.to(booking.touristId.toString()).emit('notification', {
      title: status === 'confirmed' ? 'Booking Accepted!' : 'Booking Status Updated',
      message: `Your booking for ${booking.location} has been ${status}`,
      type: 'booking_status_update',
      status: status,
      bookingId: booking._id
    });
  }

  res.json(booking);
});

const getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ touristId: req.user._id })
    .populate('guideId', 'name email phone');
  res.json(bookings);
});

const getGuideBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ guideId: req.user._id })
    .populate('touristId', 'name email phone');
  res.json(bookings);
});

module.exports = { createBooking, getUserBookings, getGuideBookings, updateBookingStatus };
