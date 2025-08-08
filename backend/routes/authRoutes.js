const express = require('express');
const router = express.Router();
const {
  sendOtpForRegistration,
  verifyOtpAndRegister,
  login,
  sendResetOtp,
  verifyResetOtpAndUpdatePassword
} = require('../controllers/authController');

// Registration
router.post('/send-otp', sendOtpForRegistration);
router.post('/verify-otp', verifyOtpAndRegister);

// Login
router.post('/login', login);

// Password Reset
router.post('/send-reset-otp', sendResetOtp);
router.post('/verify-reset-otp', verifyResetOtpAndUpdatePassword);

module.exports = router;
