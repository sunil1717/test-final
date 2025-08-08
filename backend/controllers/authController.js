const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOtp, verifyOtp } = require('../utils/sendOtp');

// ========== 1. Send OTP for registration ==========
exports.sendOtpForRegistration = async (req, res) => {
  const { name, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await sendOtp(phone);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ========== 2. Verify OTP & Register ==========
exports.verifyOtpAndRegister = async (req, res) => {
  const { name, phone, password, otp } = req.body;
  try {
    const isOtpValid = await verifyOtp(phone, otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, phone, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// ========== 3. Login ==========
exports.login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', user: { name: user.name, phone: user.phone, _id: user._id,} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// ========== 4. Send OTP for Password Reset ==========
exports.sendResetOtp = async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await sendOtp(phone);
    res.status(200).json({ message: 'OTP sent for password reset' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ========== 5. Verify OTP and Reset Password ==========
exports.verifyResetOtpAndUpdatePassword = async (req, res) => {
  const { phone, otp, newPassword } = req.body;
  try {
    const isOtpValid = await verifyOtp(phone, otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ phone }, { password: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Password reset failed' });
  }
};
