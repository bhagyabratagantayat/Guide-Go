const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'guide', 'admin'], default: 'user' },
  mobile: { type: String, required: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: true },
  location: { type: mongoose.Schema.Types.Mixed },
  profilePicture: { type: String, default: '' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
  experience: { type: Number, default: 0 }, // For guides
  specialization: [{ type: String }], // For guides
  resetPasswordOTP: { type: String },
  resetPasswordOTPExpiry: { type: Date },
  provider: { type: String, default: 'local' },
  supabaseId: { type: String, default: '' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  refreshToken: { type: String },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
