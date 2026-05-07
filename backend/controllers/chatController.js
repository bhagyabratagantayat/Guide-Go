const Message = require('../models/Message');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all messages for a booking
// @route   GET /api/chat/:bookingId
// @access  Private
exports.getMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ bookingId: req.params.bookingId }).sort({ createdAt: 1 });
  res.status(200).json({ success: true, data: messages });
});

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { bookingId, receiverId, text } = req.body;

  const message = await Message.create({
    bookingId,
    senderId: req.user._id,
    receiverId,
    text
  });

  // Emit socket event for real-time notification
  if (req.io) {
    req.io.to(receiverId.toString()).emit('new_message', message);
  }

  res.status(201).json({ success: true, data: message });
});
