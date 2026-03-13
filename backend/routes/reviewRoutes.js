const express = require('express');
const router = express.Router();
const { createReview, getGuideReviews } = require('../controllers/reviewController');
const { authenticateUser } = require('../middleware/auth');

router.get('/guide/:guideId', getGuideReviews);
router.post('/', authenticateUser, createReview);

module.exports = router;
