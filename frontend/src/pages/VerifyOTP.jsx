import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        alert('Email not found. Please register or login again.');
        return navigate('/login');
      }
      const data = await verifyOTP(email, otp);
      const role = data.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'guide') navigate('/guide-dashboard');
      else navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'OTP Verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Verify OTP</h2>
        <p className="text-center text-sm text-slate-600 mb-6">
          Please enter the 6-digit OTP sent to <strong>{email || 'your email'}</strong>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">One Time Password</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 transform rounded-lg focus:outline-none focus:ring-primary-500 text-center tracking-widest text-lg"
              placeholder="123456"
              maxLength="6"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary mt-4">Verify</button>
        </form>
        <p className="text-center text-sm text-slate-600 mt-6">
          <Link to="/login" className="text-primary-600 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
