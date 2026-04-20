import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '../utils/supabase';
import logo from '../assets/GuideGo Logo.jpeg';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(email, password);
      const role = data.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'guide') navigate('/guide/verify');
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

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback'
      }
    });
    if (error) console.error('Google login error:', error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-base)]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-[var(--bg-card)] rounded-[2.5rem] p-10 border border-[var(--border-color)] shadow-2xl"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mb-6 flex justify-center"
          >
            <img 
              src={logo} 
              alt="GuideGo" 
              className="h-20 w-20 object-cover rounded-2xl border border-[var(--border-color)] shadow-xl"
            />
          </motion.div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Welcome Back</h1>
          <p className="text-[11px] text-[var(--text-muted)] font-black uppercase tracking-widest">Identify Yourself</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <Mail className="absolute left-5 text-[var(--text-muted)] w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              className="input-field pl-14"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <div className="relative flex items-center">
              <Lock className="absolute left-5 text-[var(--text-muted)] w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                className="input-field pl-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--accent)] transition-all uppercase tracking-widest">
                Recovery?
              </Link>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 mt-2">Login Access</button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-[var(--border-color)]" />
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Or Secure Link</span>
          <div className="flex-1 h-[1px] bg-[var(--border-color)]" />
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="w-full py-4 bg-[var(--bg-card-hover)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-[var(--text-primary)] text-[12px] font-bold flex items-center justify-center gap-3 hover:bg-[var(--bg-base)] transition-all"
        >
          <GoogleIcon /> Continue with Google
        </button>

        <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
           <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => { setEmail('user@demo.com'); setPassword('demo123'); }}
                className="flex items-center justify-between px-6 py-3.5 bg-white/5 border border-white/5 rounded-xl hover:bg-[var(--accent-bg)] hover:text-[var(--accent)] transition-all group"
              >
                 <span className="text-[10px] font-black uppercase tracking-widest">Explorer Demo</span>
                 <ArrowRight className="w-4 h-4 opacity-30 group-hover:opacity-100" />
              </button>
              <button 
                onClick={() => { setEmail('guide@demo.com'); setPassword('demo123'); }}
                className="flex items-center justify-between px-6 py-3.5 bg-white/5 border border-white/5 rounded-xl hover:bg-[var(--accent-bg)] hover:text-[var(--accent)] transition-all group"
              >
                 <span className="text-[10px] font-black uppercase tracking-widest">Guide Demo</span>
                 <ArrowRight className="w-4 h-4 opacity-30 group-hover:opacity-100" />
              </button>
           </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] font-bold text-[var(--text-muted)]">
            New here? {' '}
            <Link to="/register" className="text-[var(--accent)] hover:underline uppercase tracking-widest">
              Join Us
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
