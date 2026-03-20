const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Guide = require('../models/Guide');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const createReview = asyncHandler(async (req, res, next) => {
  const { guideId, bookingId, rating, comment } = req.body;

  // Check if booking exists and is completed
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404, 'BOOKING_NOT_FOUND'));
  }

  if (booking.status !== 'completed') {
    return next(new ErrorResponse('You can only review completed tours', 400, 'TOUR_NOT_COMPLETED'));
  }

  // Check if user is the traveler who booked
  if (booking.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to review this booking', 401, 'NOT_AUTHORIZED'));
  }

  // Check if review already exists
  const reviewExists = await Review.findOne({ bookingId });
  if (reviewExists) {
    return next(new ErrorResponse('You have already reviewed this booking', 400, 'REVIEW_EXISTS'));
  }

  const review = await Review.create({
    userId: req.user._id,
    guideId,
    bookingId,
    rating,
    comment
  });

  // Calculate and update Guide average rating and count
  const reviews = await Review.find({ guideId });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Guide.findOneAndUpdate(
    { userId: guideId }, 
    { rating: avgRating, numReviews: reviews.length }
  );

  res.status(201).json(review);
});

const getGuideReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ guideId: req.params.guideId })
    .populate('userId', 'name profilePicture');
  res.json(reviews);
});

module.exports = { createReview, getGuideReviews };
