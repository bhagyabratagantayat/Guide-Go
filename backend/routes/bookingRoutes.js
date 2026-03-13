const express = require('express');
const { createBooking, getUserBookings, getGuideBookings, updateBookingStatus } = require('../controllers/bookingController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validator');
const router = express.Router();

router.post('/', authenticateUser, authorizeRole('tourist'), validateBooking, createBooking);
router.put('/:id/status', authenticateUser, authorizeRole('guide'), updateBookingStatus);
router.get('/user', authenticateUser, getUserBookings);
router.get('/guide', authenticateUser, getGuideBookings);

module.exports = router;
