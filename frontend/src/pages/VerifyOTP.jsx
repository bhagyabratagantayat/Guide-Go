import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ArrowRight, RefreshCcw, Mail } from 'lucide-react';
import logo from '../assets/GuideGo Logo.jpeg';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const email = location.state?.email || '';

  useEffect(() => {
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
      else if (role === 'guide') navigate('/guide/verify');
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-primary-50 to-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-premium border border-primary-50"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            className="mb-4 flex justify-center"
          >
            <img 
              src={logo} 
              alt="GuideGo" 
              className="h-20 w-20 object-cover rounded-full ring-4 ring-primary-500/10 shadow-xl"
            />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Verify Your Email
          </h1>
          <p className="text-xs text-slate-400 font-medium">Please enter the 6-digit OTP sent to</p>
          <p className="text-[11px] font-bold text-primary-500 mt-1">{email || 'your email'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-secondary-50 border-transparent rounded-2xl p-5 text-center text-3xl font-bold tracking-[0.5em] text-slate-900 focus:bg-white focus:border-primary-500 focus:ring-0 transition-all font-serif"
              placeholder="000000"
              maxLength="6"
              required
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={verifying}
            className={`w-full bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all text-sm uppercase tracking-widest ${verifying ? 'opacity-70' : ''}`}
          >
            {verifying ? 'Verifying...' : 'Verify'}
          </motion.button>
        </form>
        
        <div className="mt-8 text-center uppercase tracking-widest text-[10px] font-bold">
          <AnimatePresence mode="wait">
            {timer > 0 ? (
              <motion.p 
                key="timer"
                className="text-slate-400"
              >
                Resend OTP in <span className="text-primary-500">{timer}s</span>
              </motion.p>
            ) : (
              <motion.button 
                key="resend"
                onClick={handleResend}
                disabled={resending}
                className={`text-primary-500 hover:text-primary-600 transition-colors ${resending ? 'opacity-50' : ''}`}
              >
                {resending ? 'Resending...' : 'Resend OTP'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 text-center">
          <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
