const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

// Helper to check for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map(err => err.msg).join(', ');
    return next(new ErrorResponse(message, 400, 'VALIDATION_ERROR'));
  }
  next();
};

const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('mobile').isLength({ min: 10, max: 15 }).withMessage('Please provide a valid mobile number'),
  validate
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const validateGuideRegister = [
  body('languages').notEmpty().withMessage('Languages are required'),
  body('experience').notEmpty().withMessage('Experience is required'),
  body('pricePerHour').isNumeric().withMessage('Price per hour must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location.coordinates').isArray().withMessage('Location coordinates must be an array'),
  body('location.coordinates').custom(coord => coord.length === 2).withMessage('Location must have latitude and longitude'),
  validate
];

const validateBooking = [
  body('location').notEmpty().withMessage('Location is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  validate
];

const validatePlace = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('latitude').isNumeric().withMessage('Latitude must be a number'),
  body('longitude').isNumeric().withMessage('Longitude must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
  validate
];

const validateVerifyOTP = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  validate
];

const validateResendOTP = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  validate
];

const validateForgotPassword = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  validate
];

const validateVerifyResetOTP = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  validate
];

const validateResetPassword = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate
];

module.exports = {
  validateRegister,
  validateLogin,
  validateVerifyOTP,
  validateResendOTP,
  validateForgotPassword,
  validateVerifyResetOTP,
  validateResetPassword,
  validateGuideRegister,
  validateBooking,
  validatePlace
};
