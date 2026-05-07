import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (newPassword !== confirmPassword) {
      return alert('Passwords do not match');
    }

    if (newPassword.length < 6) {
      return alert('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      if (!email || !otp) {
        alert('Session lost. Please try the forgot password process again.');
        return navigate('/forgot-password');
      }
      await resetPassword(email, otp, newPassword);
      alert('Password reset successful. You can now login.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Password reset failed');
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
            <div className="w-16 h-16 bg-[#ff385c]/10 text-[#ff385c] rounded-2xl flex items-center justify-center mx-auto mb-4">
               <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-[#222222] tracking-tighter italic font-serif">New Password</h1>
            <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">Set your new secure password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-12"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Confirm Password</label>
              <div className="relative">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                   {loading ? 'Resetting...' : 'Reset Password'} 
                   {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /> }
                </span>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
               <ShieldCheck className="w-3 h-3" />
               <span>Passwords are encrypted</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
