const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAllUsers, 
  getAllGuides, 
  updateGuideStatus, 
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
router.get('/bookings', getAllBookings);

module.exports = router;
