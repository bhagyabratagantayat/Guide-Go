const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').post(sendMessage);
router.route('/:bookingId').get(getMessages);

module.exports = router;
