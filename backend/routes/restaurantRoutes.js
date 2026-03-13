const express = require('express');
const router = express.Router();
const { getRestaurants, createRestaurant } = require('../controllers/restaurantController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getRestaurants);
router.post('/', authenticateUser, authorizeRole('admin'), upload.single('image'), createRestaurant);

module.exports = router;
