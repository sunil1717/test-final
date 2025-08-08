import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  sendOtpForRegistration,
  verifyOtpAndRegister,
  loginWithPassword,
  sendResetOtp,
  verifyResetOtp,
} from '../api/authApi';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isVerified: false,
      loading: false,
      error: null,

      // 📌 Step 1: Send OTP for Registration
      register: async (form) => {
        try {
          set({ loading: true, error: null });
          await sendOtpForRegistration(form);
          return true;
        } catch (err) {
          set({ error: err.response?.data?.message || 'OTP send failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      // 📌 Step 2: Verify OTP & Register
      verify: async ({ name, phone, password, otp }) => {
        try {
          set({ loading: true, error: null });
          await verifyOtpAndRegister({ name, phone, password, otp });
          set({ isVerified: true });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.message || 'OTP verification failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      // 📌 Login with Phone & Password
      login: async (form) => {
        try {
          set({ loading: true, error: null });
          const res = await loginWithPassword(form);
          set({ user: res.data.user, isVerified: true });
          localStorage.setItem('userToken', res.data.user.phone); // optional if needed
          window.location.href = '/';
          return true;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Login failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      // 📌 Logout
      logoutUser: () => {
        localStorage.removeItem('userToken');
        set({ user: null, isVerified: false });
        window.location.href = '/';
      },

      // 📌 Send OTP for Password Reset
      sendResetOtp: async ({ phone }) => {
        try {
          set({ loading: true, error: null });
          await sendResetOtp({ phone });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Failed to send reset OTP' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      // 📌 Verify OTP & Update Password
      resetPassword: async ({ phone, otp, newPassword }) => {
        try {
          set({ loading: true, error: null });
          await verifyResetOtp({ phone, otp, newPassword });
          return true;
        } catch (err) {
          set({ error: err.response?.data?.message || 'Reset failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-store', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isVerified: state.isVerified,
      }), // persist only these keys
    }
  )
);

export default useAuthStore;
