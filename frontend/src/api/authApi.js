import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`; // Update this if deploying

// Step 1: Send OTP for Registration
export const sendOtpForRegistration = async ({ name, phone, password }) => {
  return await axios.post(`${BASE_URL}/send-otp`, { name, phone, password });
};

// Step 2: Verify OTP and Register
export const verifyOtpAndRegister = async ({ name, phone, password, otp }) => {
  return await axios.post(`${BASE_URL}/verify-otp`, { name, phone, password, otp });
};

// Login with phone and password
export const loginWithPassword = async ({ phone, password }) => {
  return await axios.post(`${BASE_URL}/login`, { phone, password });
};

// Send OTP for password reset
export const sendResetOtp = async ({ phone }) => {
  return await axios.post(`${BASE_URL}/send-reset-otp`, { phone });
};

// Verify OTP and Reset Password
export const verifyResetOtp = async ({ phone, otp, newPassword }) => {
  return await axios.post(`${BASE_URL}/verify-reset-otp`, { phone, otp, newPassword });
};
