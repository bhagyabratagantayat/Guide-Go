const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const User = require('../models/User');
const config = require('../config/env');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const logger = require('../utils/logger');
const sendEmail = require('../utils/sendEmail');

const generateOTP = () => {
  return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, mobile, location } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    return next(new ErrorResponse('User already exists', 400, 'USER_EXISTS'));
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  console.log('Registering user:', { name, email: normalizedEmail, role });
  const user = await User.create({ 
    name, 
    email: normalizedEmail, 
    password, 
    role, 
    mobile, 
    location,
    otp,
    otpExpiry,
    isVerified: false
  });

  if (user) {
    // Immediate verification check
    const check = await User.findById(user._id);
    if (!check) {
      console.error('CRITICAL: User was reported as created but could not be found via findById immediately after!', user._id);
      return next(new ErrorResponse('Database synchronization error. Please try again.', 500));
    }
    console.log(`User created [ID: ${user._id}]. Stored OTP: ${user.otp}`);
    logger.info(`Sending OTP email to ${user.email}...`);
    try {
      await sendEmail({
        email: user.email,
        subject: 'GuideGo - Verify your email',
        message: `Your verification code is ${otp}. It will expire in 5 minutes.`
      });
      logger.info(`OTP email triggered successfully for ${user.email}`);
    } catch (error) {
      logger.error(`Failed to send OTP email to ${user.email}: ${error.message}`);
      // We don't crash, but we might want to inform the client
    }

    res.status(201).json({
      message: 'Registration successful. Please verify your email with the OTP sent.',
      email: user.email
    });
  } else {
    return next(new ErrorResponse('Invalid user data', 400, 'INVALID_USER_DATA'));
  }
});

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  console.log('Verifying OTP for:', normalizedEmail, 'with code:', otp);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    console.log('User NOT found during verification for email:', email);
    return next(new ErrorResponse('User not found', 404, 'USER_NOT_FOUND'));
  }
  console.log('User found for verification:', user.email, 'Target OTP:', user.otp);

  if (user.isVerified) {
    return next(new ErrorResponse('User is already verified', 400, 'ALREADY_VERIFIED'));
  }

  if (user.otp !== otp) {
    return next(new ErrorResponse('Invalid OTP', 400, 'INVALID_OTP'));
  }

  if (user.otpExpiry < Date.now()) {
    return next(new ErrorResponse('OTP expired', 400, 'OTP_EXPIRED'));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  logger.info(`User verified successfully: ${user.email}`);

  // Send Welcome Email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Welcome to GuideGo 🎉',
      message: `Hello ${user.name},\n\nYour account has been successfully registered on GuideGo.\n\nExplore tourist destinations, find verified local guides, and use smart audio travel guides.\n\nVisit: https://guidego.vercel.app`,
      htmlMessage: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #3b82f6;">Welcome to GuideGo 🎉</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your account has been successfully registered on GuideGo.</p>
          <p>You can now:</p>
          <ul>
            <li>Explore tourist destinations</li>
            <li>Find verified local guides</li>
            <li>Use smart audio travel guides</li>
            <li>Plan your trips</li>
          </ul>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://guidego.vercel.app" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
          </div>
          <p style="margin-top: 30px; color: #666; font-size: 12px;">If you didn't create this account, please ignore this email.</p>
        </div>
      `
    });
    console.log(`Welcome email sent to: ${user.email}`);
  } catch (error) {
    console.error(`Failed to send welcome email to ${user.email}:`, error);
  }
  
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    mobile: user.mobile,
    location: user.location,
    token: generateToken(user._id, user.role),
  });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    return next(new ErrorResponse('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
  }

  if (!(await user.comparePassword(password))) {
    return next(new ErrorResponse('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
  }

  if (!user.isVerified) {
    return next(new ErrorResponse('Please verify your email first', 403, 'NOT_VERIFIED'));
  }

  logger.info(`User logged in: ${user.email}`);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    mobile: user.mobile,
    location: user.location,
    token: generateToken(user._id, user.role),
  });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User not found', 404, 'USER_NOT_FOUND'));
  }

  const otp = generateOTP();
  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  await user.save();

  try {
    console.log(`Sending password reset OTP to: ${user.email}. Stored Reset OTP: ${otp}`);
    logger.info(`Sending password reset OTP email to ${user.email}...`);
    await sendEmail({
      email: user.email,
      subject: 'GuideGo - Password Reset Request',
      message: `Your password reset OTP is ${otp}. It will expire in 5 minutes.`
    });
    
    console.log(`Password reset OTP sent to: ${user.email}`);
    logger.info(`Password reset OTP triggered successfully for: ${user.email}`);
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();
    return next(new ErrorResponse('Email could not be sent. Please try again later.', 500, 'INTERNAL_SERVER_ERROR'));
  }
});

const verifyResetOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  console.log(`Verifying reset OTP for: ${email}. Provided Code: ${otp}`);
  
  const user = await User.findOne({ email });

  if (!user) {
    console.log(`User not found for reset verification: ${email}`);
    return next(new ErrorResponse('User not found', 404, 'USER_NOT_FOUND'));
  }

  console.log(`User found: ${user.email}. Stored Reset OTP: ${user.resetPasswordOTP}`);

  if (user.resetPasswordOTP !== otp) {
    console.log(`Invalid Reset OTP provided for ${email}. Expected: ${user.resetPasswordOTP}, Got: ${otp}`);
    return next(new ErrorResponse('Invalid OTP', 400, 'INVALID_OTP'));
  }

  if (user.resetPasswordOTPExpiry < Date.now()) {
    console.log(`Reset OTP expired for ${email}`);
    return next(new ErrorResponse('OTP expired', 400, 'OTP_EXPIRED'));
  }

  console.log(`Reset OTP verified successfully for: ${email}`);
  res.json({ message: 'OTP verified. You can now reset your password.' });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User not found', 404, 'USER_NOT_FOUND'));
  }

  if (user.resetPasswordOTP !== otp) {
    return next(new ErrorResponse('Invalid OTP', 400, 'INVALID_OTP'));
  }

  if (user.resetPasswordOTPExpiry < Date.now()) {
    return next(new ErrorResponse('OTP expired', 400, 'OTP_EXPIRED'));
  }

  // Hash password is done by pre-save hook in User model
  user.password = newPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpiry = undefined;
  await user.save();

  logger.info(`Password reset successful for: ${user.email}`);
  res.json({ message: 'Password reset successful. You can now login.' });
});

const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      location: user.location,
    });
  } else {
    return next(new ErrorResponse('User not found', 404, 'USER_NOT_FOUND'));
  }
});

const resendOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return next(new ErrorResponse('User not found', 404, 'USER_NOT_FOUND'));
  }

  if (user.isVerified) {
    return next(new ErrorResponse('User is already verified', 400, 'ALREADY_VERIFIED'));
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await user.save();

  try {
    console.log(`Resending OTP to: ${user.email}. New Stored OTP: ${user.otp}`);
    logger.info(`Sending resend OTP email to ${user.email}...`);
    await sendEmail({
      email: user.email,
      subject: 'GuideGo - New Verification Code',
      message: `Your new verification code is ${otp}. It will expire in 5 minutes.`
    });
    
    console.log(`Resend OTP sent to: ${user.email}`);
    logger.info(`Resend OTP triggered successfully for: ${user.email}`);
    res.json({ message: 'New OTP sent to your email.' });
  } catch (error) {
    logger.error(`Failed to resend OTP email to ${user.email}: ${error.message}`);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    return next(new ErrorResponse('Email could not be sent. Please try again later.', 500, 'INTERNAL_SERVER_ERROR'));
  }
});

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: '30d' });
};

module.exports = { 
  registerUser, 
  loginUser, 
  verifyOTP, 
  resendOTP,
  forgotPassword, 
  verifyResetOTP,
  resetPassword,
  getProfile 
};
