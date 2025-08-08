const twilio = require('twilio');
require('dotenv').config();

const otpStore = new Map(); // Replace with Redis in production

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOtp = async (phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP temporarily
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  // Send OTP via Twilio
  try {
    await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}` // Adjust this if international
    });

    console.log(`OTP ${otp} sent to ${phone}`);
    return true;
  } catch (error) {
    console.error('Twilio error:', error.message);
    throw new Error('Failed to send OTP');
  }
};

exports.verifyOtp = async (phone, otp) => {
  const record = otpStore.get(phone);
  if (!record) return false;
  if (record.otp !== otp) return false;
  if (record.expiresAt < Date.now()) return false;

  otpStore.delete(phone); // Invalidate OTP after use
  return true;
};
