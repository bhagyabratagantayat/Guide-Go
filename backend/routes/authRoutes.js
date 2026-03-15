const express = require('express');
const { 
  registerUser, 
  loginUser, 
  verifyOTP, 
  resendOTP,
  forgotPassword, 
  verifyResetOTP,
  resetPassword,
  getProfile 
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin, 
  validateVerifyOTP, 
  validateResendOTP,
  validateForgotPassword, 
  validateVerifyResetOTP,
  validateResetPassword 
} = require('../middleware/validator');

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/verify-otp', validateVerifyOTP, verifyOTP);
router.post('/resend-otp', validateResendOTP, resendOTP);
router.post('/login', validateLogin, loginUser);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/verify-reset-otp', validateVerifyResetOTP, verifyResetOTP);
router.post('/reset-password', validateResetPassword, resetPassword);
router.get('/profile', authenticateUser, getProfile);

module.exports = router;
