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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-base)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-[var(--bg-card)] rounded-[3rem] p-10 border border-[var(--border-color)] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] opacity-10 blur-[60px] -translate-y-12 translate-x-12" />
        
        <div className="text-center mb-10 space-y-4">
          <div className="w-16 h-16 bg-[var(--accent-bg)] text-[var(--accent)] rounded-2xl flex items-center justify-center mx-auto shadow-xl">
             <KeyRound className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic font-serif text-[var(--text-primary)] mb-1">Forgot Password?</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Verification code will be sent</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-4">Email Account</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] w-4 h-4 transition-colors" />
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

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className={`btn-primary w-full py-4 uppercase tracking-widest ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Processing...' : 'Send Reset Code'} 
            {!loading && <ArrowRight className="ml-2 w-4 h-4" /> }
          </motion.button>
        </form>

        <div className="mt-10 pt-8 border-t border-[var(--border-color)] text-center space-y-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
            Back to{' '}
            <Link to="/login" className="text-[var(--accent)] hover:underline font-black">Login Page</Link>
          </p>
          <div className="flex items-center justify-center space-x-2 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">
             <ShieldCheck className="w-3 h-3 text-[var(--success)]" />
             <span>Secure Identity Verification</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
