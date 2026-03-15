import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ArrowRight, RefreshCcw, Mail } from 'lucide-react';

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
    <div className="mobile-container flex items-center justify-center p-6 bg-surface-50 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="w-20 h-20 bg-primary-500 rounded-[2rem] flex items-center justify-center text-white shadow-premium mx-auto mb-6"
          >
            <ShieldCheck className="w-10 h-10 stroke-[2.5]" />
          </motion.div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic font-serif mb-2 leading-none">
            {t('auth.verify_otp')}
          </h1>
          <div className="flex items-center justify-center space-x-2 text-slate-400">
             <Mail className="w-3 h-3" />
             <p className="text-[10px] font-black uppercase tracking-widest">{email || 'Verified Gateway'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">
              Enter 6-Digit Secure Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-6 text-center text-4xl font-black tracking-[0.5em] text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-soft"
              placeholder="000000"
              maxLength="6"
              required
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={verifying}
            className={`w-full py-6 bg-slate-900 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest shadow-premium flex items-center justify-center space-x-3 transition-all ${verifying ? 'opacity-70' : 'hover:bg-primary-600'}`}
          >
            {verifying ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
               <>
                 <span>Validate Code</span>
                 <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
               </>
            )}
          </motion.button>
        </form>
        
        <div className="mt-10 text-center">
          <AnimatePresence mode="wait">
            {timer > 0 ? (
              <motion.p 
                key="timer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-black text-slate-400 uppercase tracking-widest"
              >
                Code expires in <span className="text-primary-500">{timer}s</span>
              </motion.p>
            ) : (
              <motion.button 
                key="resend"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={handleResend}
                disabled={resending}
                className={`flex items-center space-x-2 mx-auto text-xs font-black text-primary-500 uppercase tracking-widest hover:text-primary-600 transition-colors ${resending ? 'opacity-50' : ''}`}
              >
                <RefreshCcw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                <span>{resending ? 'Resending...' : 'Resend Secure Code'}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-16 text-center">
          <Link to="/login" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
            {t('auth.back_to_login')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
