const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const User = require('../models/User');

// Configure Nodemailer with Brevo SMTP from .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * @desc    Send SOS Alert Email
 * @route   POST /api/sos/alert
 * @access  Private
 */
exports.sendSOSAlert = async (req, res) => {
  const { latitude, longitude, userId } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Location coordinates are required' });
  }

  try {
    const user = await User.findById(userId || req.user?._id);
    const userName = user ? user.name : 'Unknown User';
    const userEmail = user ? user.email : 'No email provided';
    const userPhone = user ? user.phone : 'No phone provided';

    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const mailOptions = {
      from: `"GuideGo Emergency" <${process.env.EMAIL_FROM || 'guidego2026@gmail.com'}>`,
      to: 'bhagyabratagantayat@gmail.com',
      subject: `🚨 URGENT: SOS Alert from ${userName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #ff0000; border-radius: 10px;">
          <h1 style="color: #ff0000; text-transform: uppercase;">Help Requested</h1>
          <p>An emergency SOS signal has been triggered by a user.</p>
          <hr />
          <h3>User Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${userName}</li>
            <li><strong>Email:</strong> ${userEmail}</li>
            <li><strong>Phone:</strong> ${userPhone}</li>
            <li><strong>User ID:</strong> ${userId || req.user?._id || 'N/A'}</li>
          </ul>
          <h3>Location:</h3>
          <p>Coordinates: <strong>${latitude}, ${longitude}</strong></p>
          <div style="margin-top: 20px;">
            <a href="${googleMapsUrl}" style="background-color: #ff0000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              VIEW ON GOOGLE MAPS
            </a>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">This alert was generated automatically from the GuideGo Shield Protocol.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    logger.info(`SOS Alert sent for user: ${userName} at ${latitude}, ${longitude}`);

    res.status(200).json({ 
      success: true, 
      message: 'SOS Alert dispatched to emergency response teams and admin.' 
    });
  } catch (error) {
    logger.error(`Error sending SOS Alert: ${error.message}`);
    res.status(500).json({ message: 'Failed to dispatch SOS Alert. Please try calling emergency services directly.' });
  }
};
