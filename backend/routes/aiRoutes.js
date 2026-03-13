const express = require('express');
const router = express.Router();
const { generateTravelAdvice } = require('../controllers/aiController');
const { authenticateUser } = require('../middleware/auth');

router.post('/travel', authenticateUser, generateTravelAdvice);
router.post('/ask', authenticateUser, generateTravelAdvice);

module.exports = router;
