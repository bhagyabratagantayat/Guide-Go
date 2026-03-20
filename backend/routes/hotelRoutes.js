const express = require('express');
const router = express.Router();
const { getHotels, getNearbyHotels } = require('../controllers/hotelController');

router.get('/', getHotels);
router.get('/nearby', getNearbyHotels);

module.exports = router;
