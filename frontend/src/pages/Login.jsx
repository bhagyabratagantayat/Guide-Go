import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, LogIn, ArrowRight, Compass } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(email, password);
      const role = data.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'guide') navigate('/guide-dashboard');
      else navigate('/');
    } catch (error) {
      if (error.response?.data?.errorCode === 'NOT_VERIFIED') {
        const normalizedEmail = email.trim().toLowerCase();
        navigate('/verify-otp', { state: { email: normalizedEmail } });
      } else {
        alert(error.response?.data?.message || 'Login failed');
      }
    }
  };

  return (
    <div className="mobile-container flex items-center justify-center p-6 bg-surface-50 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-20 h-20 bg-primary-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-premium mx-auto mb-6 animate-float"
          >
            <Compass className="w-10 h-10 stroke-[2.5]" />
          </motion.div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic font-serif mb-2 leading-none">
            {t('auth.login_title')}
          </h1>
          <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] font-sans">GuideGo Secure Hub</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="input-group group">
            <Mail className="absolute left-6 top-[54px] text-slate-300 w-5 h-5 pointer-events-none z-10 transition-colors group-focus-within:text-primary-500" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 mb-2 block">{t('auth.email')}</label>
            <input
              type="email"
              placeholder={t('auth.email_placeholder')}
              className="input-field pl-14"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group group">
            <Lock className="absolute left-6 top-[54px] text-slate-300 w-5 h-5 pointer-events-none z-10 transition-colors group-focus-within:text-primary-500" />
            <div className="flex justify-between items-center px-4 mb-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t('auth.password')}</label>
               <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-primary-500 uppercase tracking-widest">
                 {t('auth.forgot_password')}
               </Link>
            </div>
            <input
              type="password"
              placeholder={t('auth.password_placeholder')}
              className="input-field pl-14"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full btn-primary py-6 text-base group"
          >
            {t('common.login')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-slate-400">
            {t('auth.no_account')} {' '}
            <Link to="/register" className="text-primary-500 font-extrabold hover:underline underline-offset-4 decoration-2">
              {t('common.register')}
            </Link>
          </p>
        </div>

        <div className="mt-16 flex justify-center items-center space-x-6 grayscale opacity-20 pointer-events-none">
           <div className="text-[10px] font-black uppercase tracking-tighter">Safe</div>
           <div className="text-[10px] font-black uppercase tracking-tighter">Secure</div>
           <div className="text-[10px] font-black uppercase tracking-tighter">Odisha</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
