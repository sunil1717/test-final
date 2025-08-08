import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';


export default function LoginRegister() {
   const navigate = useNavigate();

  const [step, setStep] = useState('login'); // login | register | otp | reset | resetOtp
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    otp: '',
    newPassword: ''
  });


  const user = useAuthStore((state) => state.user);
    useEffect(() => {
    if (user) {
      navigate('/'); // if already logged in, redirect to home
    }
  }, [user, navigate]);

  const {
    register,
    verify,
    login,
    sendResetOtp,
    resetPassword,
    
    loading,
    error
  } = useAuthStore();

 
 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Register Step 1
  const handleRegister = async () => {
    const success = await register({
      name: form.name,
      phone: form.phone,
      password: form.password
    });
    if (success) setStep('otp');
  };

  // Register Step 2
  const handleVerifyOtp = async () => {
    const success = await verify({
      name: form.name,
      phone: form.phone,
      password: form.password,
      otp: form.otp
    });
    if (success) {
      alert('Registration complete!');
      setStep('login');
    }
  };

  // Login
  const handleLogin = async () => {
    await login({ phone: form.phone, password: form.password });
  };

  // Reset: Send OTP
  const handleSendResetOtp = async () => {
    const success = await sendResetOtp({ phone: form.phone });
    if (success) setStep('resetOtp');
  };

  // Reset: Verify + Update
  const handleVerifyReset = async () => {
    const success = await resetPassword({
      phone: form.phone,
      otp: form.otp,
      newPassword: form.newPassword
    });
    if (success) {
      alert('Password updated!');
      setStep('login');
    }
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-md mx-auto pt-30 bg-white p-6 mt-25 shadow-md rounded-lg space-y-4">
      <h2 className="text-xl font-semibold text-center">
        {step === 'register' ? 'Create Account' :
         step === 'otp' ? 'Verify Registration OTP' :
         step === 'reset' ? 'Forgot Password' :
         step === 'resetOtp' ? 'Verify Reset OTP' :
         'Login'}
      </h2>

      {/* Register Form */}
      {step === 'register' && (
        <>
          <input name="name" placeholder="Name" onChange={handleChange} value={form.name}
            className="w-full p-2 border rounded" />
          <input name="phone" placeholder="Phone" onChange={handleChange} value={form.phone}
            className="w-full p-2 border rounded" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password}
            className="w-full p-2 border rounded" />
          <button onClick={handleRegister} disabled={loading}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 hover:cursor-pointer">
            Send OTP
          </button>
        </>
      )}

      {/* Registration OTP */}
      {step === 'otp' && (
        <>
          <input name="otp" placeholder="Enter OTP" onChange={handleChange} value={form.otp}
            className="w-full p-2 border rounded" />
          <button onClick={handleVerifyOtp} disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 hover:cursor-pointer">
            Verify OTP
          </button>
        </>
      )}

      {/* Login Form */}
      {step === 'login' && (
        <>
          <input name="phone" placeholder="Phone" onChange={handleChange} value={form.phone}
            className="w-full p-2 border rounded" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password}
            className="w-full p-2 border rounded" />
          <button onClick={handleLogin} disabled={loading}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 hover:cursor-pointer">
            Login
          </button>
        </>
      )}

      {/* Forgot password form (send OTP) */}
      {step === 'reset' && (
        <>
          <input name="phone" placeholder="Phone" onChange={handleChange} value={form.phone}
            className="w-full p-2 border rounded" />
          <button onClick={handleSendResetOtp} disabled={loading}
            className="w-full bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700 hover:cursor-pointer">
            Send OTP
          </button>
        </>
      )}

      {/* Verify reset OTP */}
      {step === 'resetOtp' && (
        <>
          <input name="otp" placeholder="Enter OTP" onChange={handleChange} value={form.otp}
            className="w-full p-2 border rounded" />
          <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} value={form.newPassword}
            className="w-full p-2 border rounded" />
          <button onClick={handleVerifyReset} disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 hover:cursor-pointer">
            Reset Password
          </button>
        </>
      )}

      {/* Navigation Links */}
      <div className="text-center text-sm text-gray-600">
        {step === 'login' && (
          <>
            Don't have an account?{' '}
            <button onClick={() => setStep('register')} className="text-red-600 underline hover:cursor-pointer">Register</button>
            <br />
            Forgot Password?{' '}
            <button onClick={() => setStep('reset')} className="text-blue-600 underline hover:cursor-pointer">Reset</button>
          </>
        )}
        {(step === 'register' || step === 'otp' || step === 'reset' || step === 'resetOtp') && (
          <div>
            Already registered?{' '}
            <button onClick={() => setStep('login')} className="text-red-600 underline hover:cursor-pointer">Login</button>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
    </>
  );
}
