import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  React.useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (verifying) return;

    setVerifying(true);
    try {
      if (!email) {
        alert('Email not found. Please register or login again.');
        return navigate('/login');
      }

      if (otp.length !== 6) {
        alert('Please enter exactly 6 digits.');
        setVerifying(false);
        return;
      }

      const data = await verifyOTP(email, otp);
      const role = data.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'guide') navigate('/guide-dashboard');
      else navigate('/');
    } catch (error) {
      console.error('OTP Verification Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'OTP Verification failed';
      alert(errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resending || timer > 0) return;

    setResending(true);
    try {
      await resendOTP(email);
      setTimer(60);
      alert('New OTP sent to your email');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
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
          <button 
            type="submit" 
            disabled={verifying}
            className={`w-full btn-primary mt-4 ${verifying ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {verifying ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-sm text-slate-500">Resend OTP in {timer}s</p>
          ) : (
            <button 
              onClick={handleResend}
              disabled={resending}
              className={`text-primary-600 font-medium hover:underline text-sm ${resending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </div>

        <p className="text-center text-sm text-slate-600 mt-4">
          <Link to="/login" className="text-primary-600 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
