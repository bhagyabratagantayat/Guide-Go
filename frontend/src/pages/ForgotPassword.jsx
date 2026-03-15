import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      alert('Reset OTP sent to your email.');
      navigate('/verify-reset-otp', { state: { email: email.trim().toLowerCase() } });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send reset OTP');
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
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
          
          <div className="text-center mb-10 space-y-2">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic font-serif">Forgot Password?</h1>
            <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">We'll send you a reset code.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input-field pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                   {loading ? 'Sending...' : 'Send Reset Code'} 
                   {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /> }
                </span>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center space-y-4">
            <p className="text-sm font-bold text-slate-500">
              Back to{' '}
              <Link to="/login" className="text-primary-500 font-black hover:text-primary-600">Login</Link>
            </p>
            <div className="flex items-center justify-center space-x-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
               <ShieldCheck className="w-3 h-3" />
               <span>Secure Verification</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
