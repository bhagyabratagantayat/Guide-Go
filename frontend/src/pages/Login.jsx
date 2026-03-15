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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-primary-50 to-white">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-premium border border-primary-50"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mb-6 flex justify-center"
          >
            <img 
              src="/src/assets/GuideGo Logo.jpeg" 
              alt="GuideGo" 
              className="h-24 w-auto object-contain"
            />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-400 font-medium">Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <div className="relative flex items-center">
              <Mail className="absolute left-5 text-slate-300 w-5 h-5" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-secondary-50 border-transparent rounded-2xl pl-14 pr-6 py-4 text-sm focus:bg-white focus:border-primary-500 focus:ring-0 transition-all placeholder:text-slate-400 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative flex items-center">
              <Lock className="absolute left-5 text-slate-300 w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-secondary-50 border-transparent rounded-2xl pl-14 pr-6 py-4 text-sm focus:bg-white focus:border-primary-500 focus:ring-0 transition-all placeholder:text-slate-400 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end p-1">
              <Link to="/forgot-password" size="sm" className="text-[11px] font-bold text-slate-400 hover:text-primary-500 transition-colors uppercase tracking-widest">
                Forgot Password?
              </Link>
            </div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all text-sm uppercase tracking-widest mt-4"
          >
            Login
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-xs font-bold text-slate-400">
            Don't have an account? {' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-600">
              Create One
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
