import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RefreshCw, Smartphone } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      await verifyOTP(email, otp);
      alert('Email verified successfully! Please login.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);
      alert('New OTP sent to your email.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-base)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-[var(--bg-card)] rounded-[3rem] p-10 border border-[var(--border-color)] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--accent)] opacity-10 blur-[60px] translate-y-12 -translate-x-12" />
        
        <div className="text-center mb-10 space-y-4">
          <div className="w-16 h-16 bg-[var(--accent-bg)] text-[var(--accent)] rounded-2xl flex items-center justify-center mx-auto shadow-xl">
             <Smartphone className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic font-serif text-[var(--text-primary)] mb-1">Verify Email</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Code sent to: {email.substring(0,3)}...@{email.split('@')[1]}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 group">
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-4">6-Digit Access Code</label>
            <input
              type="text"
              maxLength="6"
              placeholder="000000"
              className="input-field text-center text-3xl font-black tracking-[0.5em] py-6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading || otp.length < 6}
            className={`btn-primary w-full py-4 uppercase tracking-widest ${loading || otp.length < 6 ? 'opacity-70' : ''}`}
          >
            {loading ? 'Verifying...' : 'Authenticate'} 
            {!loading && <ArrowRight className="ml-2 w-4 h-4" /> }
          </motion.button>
        </form>

        <div className="mt-10 pt-8 border-t border-[var(--border-color)] text-center space-y-6">
          <button 
            onClick={handleResend}
            className="flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
             <RefreshCw size={14} /> Resend OTP Code
          </button>
          
          <div className="flex items-center justify-center space-x-2 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">
             <ShieldCheck className="w-3 h-3 text-[var(--success)]" />
             <span>Encrypted Auth Gateway</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
