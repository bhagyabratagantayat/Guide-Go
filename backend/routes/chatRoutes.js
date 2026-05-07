const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateUser);

router.route('/').post(sendMessage);
router.route('/:bookingId').get(getMessages);

module.exports = router;
