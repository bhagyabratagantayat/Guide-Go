const express = require('express');
const { 
  registerUser, 
  loginUser, 
  verifyOTP, 
  resendOTP,
  forgotPassword, 
  verifyResetOTP,
  resetPassword,
  getProfile,
  updateProfile,
  testEmail,
  googleSync,
  refreshToken,
  logoutUser
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
router.post('/google-sync', googleSync);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, updateProfile);

module.exports = router;
