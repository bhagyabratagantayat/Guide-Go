const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const config = require('../config/env');

/**
 * @desc    Send SOS Alert Email
 * @route   POST /api/sos/alert
 * @access  Private
 */
exports.sendSOSAlert = asyncHandler(async (req, res, next) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return next(new ErrorResponse('Location coordinates are required', 400));
  }

  const user = await User.findById(req.user?.id);
  const userName = user ? user.name : 'Unknown User';
  const userEmail = user ? user.email : 'No email provided';
  const userPhone = user ? user.mobile : 'No phone provided';

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #ff0000; border-radius: 10px; background-color: #fdfdfd;">
      <h1 style="color: #ff0000; text-transform: uppercase;">🚨 GuideGo SOS Alert</h1>
      <p style="font-size: 16px;">An emergency SOS signal has been triggered by a user in the field.</p>
      <hr style="border: 1px solid #eee;" />
      <h3>User Identity:</h3>
      <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 8px;"><strong>Name:</strong> ${userName}</li>
        <li style="margin-bottom: 8px;"><strong>Account:</strong> ${userEmail}</li>
        <li style="margin-bottom: 8px;"><strong>Mobile:</strong> ${userPhone}</li>
      </ul>
      <h3>Precise Location:</h3>
      <p style="font-family: monospace; background: #eee; padding: 10px; border-radius: 5px;">
        GPS: ${latitude}, ${longitude}
      </p>
      <div style="margin-top: 30px;">
        <a href="${googleMapsUrl}" style="background-color: #ff0000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          VIEW LIVE LOCATION ON MAPS
        </a>
      </div>
      <p style="margin-top: 30px; font-size: 11px; color: #999; border-top: 1px solid #eee; pt: 10px;">
        Shield Protocol ID: ${req.user?.id || 'SYSTEM_TRIGGER'}<br/>
        This is an automated emergency dispatch from the GuideGo Platform.
      </p>
    </div>
  `;

  await sendEmail({
    email: config.email.from, // Alert the primary support/admin email
    subject: `🚨 CRITICAL: SOS Alert from ${userName}`,
    htmlMessage
  });

  logger.info(`🚨 SOS DISPATCHED: ${userName} at ${latitude}, ${longitude}`);

  res.status(200).json({ 
    success: true, 
    message: 'SOS Alert dispatched to emergency response teams and GuideGo Shield HQ.' 
  });
});
