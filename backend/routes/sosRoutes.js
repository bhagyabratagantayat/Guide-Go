const express = require('express');
const router = express.Router();
const { sendSOSAlert } = require('../controllers/sosController');
const { protect } = require('../middleware/auth');

// Allow both protected and unprotected alerts (for maximum safety, though user ID should be sent)
router.post('/alert', sendSOSAlert);

module.exports = router;
