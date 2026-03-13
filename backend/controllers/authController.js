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
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('User already exists', 400, 'USER_EXISTS'));
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const user = await User.create({ 
    name, 
    email, 
    password, 
    role, 
    mobile, 
    location,
    otp,
    otpExpiry,
    isVerified: false
  });

  if (user) {
    logger.info(`User registered, awaiting verification: ${user.email}`);
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'GuideGo - Verify your email',
        message: `Your verification code is ${otp}. It will expire in 5 minutes.`
      });
    } catch (error) {
      logger.error('Failed to send OTP email after registration');
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
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User not found', 404, 'USER_NOT_FOUND'));
  }

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
  await user.save();

  logger.info(`User verified successfully: ${user.email}`);
  
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
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  await user.save();

  try {
    await sendEmail({
      email: user.email,
      subject: 'GuideGo - Password Reset Request',
      message: `Your password reset OTP is ${otp}. It will expire in 5 minutes.`
    });
    
    logger.info(`Password reset OTP sent to: ${user.email}`);
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    return next(new ErrorResponse('Email could not be sent. Please try again later.', 500, 'INTERNAL_SERVER_ERROR'));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User not found', 404, 'USER_NOT_FOUND'));
  }

  if (user.otp !== otp) {
    return next(new ErrorResponse('Invalid OTP', 400, 'INVALID_OTP'));
  }

  if (user.otpExpiry < Date.now()) {
    return next(new ErrorResponse('OTP expired', 400, 'OTP_EXPIRED'));
  }

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
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

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: '30d' });
};

module.exports = { 
  registerUser, 
  loginUser, 
  verifyOTP, 
  forgotPassword, 
  resetPassword,
  getProfile 
};
