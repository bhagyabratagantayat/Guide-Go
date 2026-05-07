import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Smartphone } from 'lucide-react';

const VerifyResetOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyResetOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (!email) {
        alert('Email context lost. Please try the forgot password process again.');
        return navigate('/forgot-password');
      }

      if (otp.length !== 6) {
        alert('Please enter exactly 6 digits.');
        setLoading(false);
        return;
      }

      await verifyResetOTP(email, otp);
      alert('OTP verified successfully.');
      navigate('/reset-password', { state: { email, otp } });
    } catch (error) {
      console.error('OTP Verification Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'OTP Verification failed';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px] -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff385c] to-[#ff385c]/80"></div>
          
          <div className="text-center mb-10 space-y-2">
            <div className="w-16 h-16 bg-[#ff385c]/10 text-[#ff385c] rounded-2xl flex items-center justify-center mx-auto mb-4">
               <Smartphone className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-[#222222] tracking-tighter italic font-serif">Verify OTP</h1>
            <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase md:px-4">Enter the 6-digit code sent to <br/><span className="text-[#ff385c] lowercase">{email}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">6-Digit Code</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="000000"
                  className="input-field pl-12 tracking-[1em] font-black text-center"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 6) setOtp(val);
                  }}
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full btn-primary py-4 text-lg flex items-center justify-center group overflow-hidden mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                <span className="relative z-10 flex items-center">
                   {loading ? 'Verifying...' : 'Verify Code'} 
                   {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /> }
                </span>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center space-y-4">
            <p className="text-sm font-bold text-slate-500">
              Didn't get a code?{' '}
              <button 
                onClick={() => navigate('/forgot-password')} 
                className="text-primary-500 font-black hover:text-primary-600"
              >
                Try Again
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyResetOTP;
