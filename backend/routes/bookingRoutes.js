const express = require('express');
const { createBooking, getUserBookings, getGuideBookings, updateBookingStatus, acceptBooking, verifyOtp, endBooking, addBookingReview } = require('../controllers/bookingController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validator');
const router = express.Router();

router.post('/', authenticateUser, authorizeRole('user'), validateBooking, createBooking);
router.put('/accept/:id', authenticateUser, authorizeRole('guide'), acceptBooking);
router.post('/verify-otp/:id', authenticateUser, authorizeRole('guide'), verifyOtp);
router.post('/end/:id', authenticateUser, endBooking);
router.post('/:id/review', authenticateUser, addBookingReview);
router.get('/user', authenticateUser, authorizeRole('user'), getUserBookings);
router.get('/guide', authenticateUser, authorizeRole('guide'), getGuideBookings);
router.put('/:id/status', authenticateUser, updateBookingStatus);

module.exports = router;
