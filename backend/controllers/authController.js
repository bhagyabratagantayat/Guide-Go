const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const User = require('../models/User');
const config = require('../config/env');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const logger = require('../utils/logger');
const sendEmail = require('../utils/sendEmail');
const Guide = require('../models/Guide');

const generateOTP = () => {
  return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
};

// ── TOKEN HELPERS ───────────────────────────────────────────
const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: '15m' }); // Short lived
};

const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, config.refreshTokenSecret, { expiresIn: '30d' }); // 30 days persistence
};

const setTokenCookies = (res, user) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  const isProd = process.env.NODE_ENV === 'production';
  
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  };

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, cookieOptions);

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, mobile, location } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    return next(new ErrorResponse('User already exists', 400, 'USER_EXISTS'));
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  const user = await User.create({ 
    name, 
    email: normalizedEmail, 
    password, 
    role, 
    mobile, 
    location,
    isVerified: false,
    otp,
    otpExpiry
  });

  if (user) {
    const welcomeHtml = `
      <div style="font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 40px; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          <div style="background: #0f172a; padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-style: italic; font-weight: 900; letter-spacing: -0.05em; font-size: 32px;">GuideGo</h1>
            <p style="margin-top: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; font-size: 10px; color: #38bdf8;">Your Journey Starts Here</p>
          </div>
          <div style="padding: 40px;">
            <h2 style="margin-top: 0; font-weight: 900; tracking-tighter; letter-spacing: -0.02em;">Welcome to GuideGo, ${name}!</h2>
            <p style="line-height: 1.6; color: #64748b;">To activate your explorer profile and start your journey, please use the verification code below:</p>
            <div style="background: #f1f5f9; padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0;">
              <span style="font-size: 48px; font-weight: 900; letter-spacing: 0.2em; color: #0f172a;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">Code expires in 10 minutes. Safe travels!</p>
          </div>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your GuideGo Account',
        htmlMessage: welcomeHtml,
        message: `Your verification code is ${otp}`
      });
    } catch (err) {
      logger.error('Failed to send registration OTP');
    }

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email. Please verify to continue.',
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

  // Send Professional Welcome Email
  try {
    const successHtml = `
      <div style="font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 40px; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 60px 40px; text-align: center; color: white;">
            <div style="background: #38bdf8; width: 60px; hieght: 60px; border-radius: 20px; display: inline-flex; items-center: center; justify-content: center; margin-bottom: 20px;">
              <span style="font-size: 30px;">✈️</span>
            </div>
            <h1 style="margin: 0; font-style: italic; font-weight: 900; letter-spacing: -0.05em; font-size: 36px;">Verified!</h1>
            <p style="margin-top: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3em; font-size: 11px; color: #38bdf8;">Access Granted to GuideGo</p>
          </div>
          <div style="padding: 40px; text-align: center;">
            <h2 style="font-weight: 900; letter-spacing: -0.02em; color: #0f172a;">Welcome to the Fold, ${user.name}</h2>
            <p style="line-height: 1.6; color: #64748b; margin-bottom: 30px;">Your explorer profile is now live. You can start booking verified local guides or managing your tour operations immediately.</p>
            <a href="${config.clientUrl}/login" style="display: inline-block; background: #0f172a; color: white; padding: 18px 40px; border-radius: 16px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; shadow: 0 10px 15px rgba(0,0,0,0.2);">Enter the Platform</a>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Welcome to GuideGo - Profile Verified 🎉',
      htmlMessage: successHtml,
      message: `Your GuideGo profile is verified! Login at: ${config.clientUrl}/login`
    });
  } catch (error) {
    logger.error(`Welcome email failure: ${error.message}`);
  }
  
  // Fetch guide status if user is a guide
  let kycStatus = 'not_submitted';
  let profileComplete = false;
  
  if (user.role === 'guide') {
    const Guide = require('../models/Guide');
    const guide = await Guide.findOne({ userId: user._id });
    if (guide) {
      kycStatus = guide.kycStatus;
      profileComplete = guide.profileComplete;
    }
  }
  
  // Set cookies
  const { accessToken, refreshToken } = setTokenCookies(res, user);
  user.refreshToken = refreshToken;
  await user.save();
  
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    mobile: user.mobile,
    location: user.location,
    kycStatus,
    profileComplete,
    token: accessToken
  });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  
  // Special Demo Login Logic
  let user;
  if (password === 'demo123') {
    if (normalizedEmail === 'user@demo.com') user = await User.findOne({ role: 'user' });
    else if (normalizedEmail === 'guide@demo.com') user = await User.findOne({ role: 'guide' });
    else if (normalizedEmail === 'admin@demo.com') user = await User.findOne({ role: 'admin' });
    
    if (user) {
      logger.info(`Demo login successful for role: ${user.role}`);
      
      // Set cookies for demo user
      const { accessToken, refreshToken } = setTokenCookies(res, user);
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        location: user.location,
        isDemo: true,
        token: accessToken
      });
    }
  }

  user = await User.findOne({ email: normalizedEmail });
  
  if (!user) {
    return next(new ErrorResponse('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
  }

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    return next(new ErrorResponse('Account locked due to too many failed attempts. Please try again later.', 403, 'ACCOUNT_LOCKED'));
  }

  if (!(await user.comparePassword(password))) {
    // Increment login attempts
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 mins lock
      user.loginAttempts = 0; // Reset after lock
      await user.save();
      return next(new ErrorResponse('Account locked due to too many failed attempts. Please try again later.', 403, 'ACCOUNT_LOCKED'));
    }
    await user.save();
    return next(new ErrorResponse('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
  }

  // Reset attempts on success
  user.loginAttempts = 0;
  user.lockUntil = undefined;

  // 🛠️ AUTO DATA REPAIR (Bypass validation errors)
  let dataRepaired = false;
  if (!user.mobile || user.mobile === '0000000000') {
    user.mobile = '98' + Math.floor(10000000 + Math.random() * 90000000); // Random professional 10-digit
    dataRepaired = true;
  }
  if (!user.location || typeof user.location !== 'string') {
    user.location = 'Bhubaneswar, Odisha';
    dataRepaired = true;
  }
  if (dataRepaired) await user.save({ validateBeforeSave: false });

  logger.info(`User logged in: ${user.email} ${dataRepaired ? '(Data Repaired)' : ''}`);

  // Fetch guide status if user is a guide
  let kycStatus = 'not_submitted';
  let profileComplete = false;
  
  if (user.role === 'guide') {
    const Guide = require('../models/Guide');
    const guide = await Guide.findOne({ userId: user._id });
    if (guide) {
      kycStatus = guide.kycStatus;
      profileComplete = guide.profileComplete;
    }
  }

  // Set cookies
  const { accessToken, refreshToken } = setTokenCookies(res, user);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    mobile: user.mobile,
    location: user.location,
    kycStatus,
    profileComplete,
    token: accessToken
  });
});

const refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new ErrorResponse('Not authorized', 401));

  const decoded = jwt.verify(token, config.refreshTokenSecret);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    return next(new ErrorResponse('Invalid refresh token', 401));
  }

  const accessToken = generateAccessToken(user._id, user.role);
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000
  });

  res.json({ success: true });
});

const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('accessToken', '', { maxAge: 1 });
  res.cookie('refreshToken', '', { maxAge: 1 });
  
  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
  }

  res.json({ success: true });
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
    const resetHtml = `
      <div style="font-family: 'Inter', sans-serif; background-color: #fff1f2; padding: 40px; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          <div style="background: #e11d48; padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-style: italic; font-weight: 900; letter-spacing: -0.05em; font-size: 32px;">Security Protocol</h1>
            <p style="margin-top: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; font-size: 10px; color: #fda4af;">Password Reset Authorized</p>
          </div>
          <div style="padding: 40px; text-align: center;">
            <h2 style="margin-top: 0; font-weight: 900; tracking-tighter; letter-spacing: -0.02em;">Account Access Recovery</h2>
            <p style="line-height: 1.6; color: #64748b; margin-bottom: 30px;">A secure request was made to unlock your GuideGo account. Use the unique code below to set a new password:</p>
            <div style="background: #fff1f2; padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0;">
              <span style="font-size: 48px; font-weight: 900; letter-spacing: 0.2em; color: #e11d48;">${otp}</span>
            </div>
            <p style="font-size: 11px; color: #94a3b8;">This protocol expires in 5 minutes. If this wasn't you, secure your email immediately.</p>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: 'CRITICAL: GuideGo Security Reset',
      htmlMessage: resetHtml,
      message: `Your password reset code is ${otp}`
    });
    
    console.log(`Password reset OTP sent to: ${user.email}`);
    logger.info(`Password reset OTP triggered successfully for: ${user.email}`);
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();
    logger.error(`Error in forgotPassword: ${error.message}`);
    return next(new ErrorResponse(`[V3-SMTP] Email could not be sent: ${error.message}. Please check your SMTP settings.`, 500, 'INTERNAL_SERVER_ERROR'));
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

const testEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next(new ErrorResponse('Please provide an email address', 400));
  }

  logger.info(`Sending test email to ${email} using Brevo SMTP...`);
  
  try {
    await sendEmail({
      email: email,
      subject: 'GuideGo - Brevo Relay Test',
      message: 'If you see this, your Brevo SMTP configuration is working perfectly! 🚀'
    });

    res.status(200).json({
      success: true,
      message: `Test email sent successfully to ${email}`
    });
  } catch (error) {
    return next(new ErrorResponse(`Failed to send test email: ${error.message}`, 500));
  }
});

const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return next(new ErrorResponse('User not found', 404));

  let kycStatus = 'not_submitted';
  let profileComplete = false;
  
  if (user.role === 'guide') {
    const Guide = require('../models/Guide');
    const guide = await Guide.findOne({ userId: user._id });
    if (guide) {
      kycStatus = guide.kycStatus;
      profileComplete = guide.profileComplete;
    }
  }

  res.json({
    ...user.toObject(),
    kycStatus,
    profileComplete
  });
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
    return next(new ErrorResponse(`[V3-SMTP] Email could not be sent. Please try again later.`, 500, 'INTERNAL_SERVER_ERROR'));
  }
});

const googleSync = asyncHandler(async (req, res, next) => {
  try {
    const { supabaseId, email, name, avatar, provider, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    console.log(`[GoogleSync] Attempting sync for ${normalizedEmail} with role: ${role || 'user'}`);

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user if not found
      user = await User.create({
        name,
        email: normalizedEmail,
        password: supabaseId, // Fallback password
        role: role || 'user',
        mobile: '0000000000',
        provider: provider || 'google',
        supabaseId,
        avatar,
        isVerified: true
      });
      console.log(`[GoogleSync] New user created: ${user.email} as ${user.role}`);
    } else {
      // Sync IDs if user exists but was created via email/pass
      let updated = false;
      if (!user.supabaseId) {
        user.supabaseId = supabaseId;
        updated = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        updated = true;
      }
      // Note: We don't force change the role if they already exist
      if (updated) await user.save({ validateBeforeSave: false });
      
      console.log(`[GoogleSync] Existing user synced: ${user.email}`);
    }

    // 🛠️ AUTO DATA REPAIR for Social Login (Ensure mobile and location exist)
    let dataRepaired = false;
    if (!user.mobile || user.mobile === '0000000000') {
      user.mobile = '9' + Math.floor(Math.random() * 900000000 + 100000000);
      dataRepaired = true;
    }
    if (!user.location || typeof user.location !== 'string') {
      user.location = 'Odisha, India';
      dataRepaired = true;
    }
    if (dataRepaired) await user.save({ validateBeforeSave: false });

    // Set cookies
    const { accessToken, refreshToken } = setTokenCookies(res, user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        location: user.location,
        avatar: user.avatar || user.profilePicture,
        token: accessToken
      }
    });
  } catch (error) {
    console.error('[GoogleSync Error]:', error);
    return next(new ErrorResponse('Google synchronization failed', 500));
  }
});


const updateProfile = asyncHandler(async (req, res, next) => {
  try {
    const { name, mobile, location, profilePicture, bio, languages, specialties, pricePerHour, pricePerDay, upiId } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return next(new ErrorResponse('User not found', 404));

    // Update common user fields
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (location) user.location = typeof location === 'object' ? JSON.stringify(location) : location;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save({ validateBeforeSave: false });

    // Update guide-specific fields if user is a guide
    if (user.role === 'guide') {
      let guide = await Guide.findOne({ userId: user._id });
      
      if (guide) {
        if (bio !== undefined) guide.bio = bio;
        if (languages !== undefined) guide.languages = languages;
        if (specialties !== undefined) guide.specialties = specialties;
        if (pricePerHour !== undefined) guide.pricePerHour = Number(pricePerHour) || 0;
        if (pricePerDay !== undefined) guide.pricePerDay = Number(pricePerDay) || 0;
        if (upiId !== undefined) guide.upiId = upiId;
        if (location) guide.location = typeof location === 'object' ? JSON.stringify(location) : location;
        if (profilePicture) guide.profileImage = profilePicture;
        
        await guide.save();
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        location: user.location,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return next(new ErrorResponse(error.message || 'Server Error updating profile', 500));
  }
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new ErrorResponse('Invalid current password', 401));
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

const updateSettings = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorResponse('User not found', 404));

  user.settings = { ...user.settings, ...req.body };
  await user.save({ validateBeforeSave: false });

  res.json({ success: true, settings: user.settings });
});

const deleteAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorResponse('User not found', 404));

  // If user is a guide, delete guide profile too
  if (user.role === 'guide') {
    await Guide.findOneAndDelete({ userId: user._id });
  }

  await User.findByIdAndDelete(user._id);
  
  res.cookie('accessToken', '', { maxAge: 1 });
  res.cookie('refreshToken', '', { maxAge: 1 });

  res.json({ success: true, message: 'Account deleted successfully' });
});

module.exports = { 
  registerUser, 
  loginUser, 
  logoutUser,
  refreshToken,
  verifyOTP, 
  resendOTP,
  forgotPassword, 
  verifyResetOTP,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  testEmail,
  googleSync,
  updateSettings,
  deleteAccount
};
