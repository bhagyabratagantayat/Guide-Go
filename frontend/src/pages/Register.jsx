import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User as UserIcon, Mail, Lock, Phone, 
  MapPin, CheckCircle, ArrowRight, Compass 
} from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tourist');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      await register(name, email, password, role, mobile, location);
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container p-6 flex flex-col pt-12 bg-surface-50 min-h-screen pb-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ rotate: -20, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-premium mx-auto mb-4"
          >
            <Compass className="w-8 h-8 stroke-[2.5]" />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic font-serif leading-none">
            {t('auth.register_title')}
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Join the GuideGo Culture</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="input-group group">
            <UserIcon className="absolute left-6 top-[44px] text-slate-300 w-4 h-4 z-10 transition-colors group-focus-within:text-primary-500" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 mb-1 block">Full Name</label>
            <input
              type="text"
              placeholder="Jagannath Das"
              className="input-field pl-12 py-3.5 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group group">
            <Mail className="absolute left-6 top-[44px] text-slate-300 w-4 h-4 z-10 transition-colors group-focus-within:text-primary-500" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 mb-1 block">{t('auth.email')}</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="input-field pl-12 py-3.5 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group group">
            <Lock className="absolute left-6 top-[44px] text-slate-300 w-4 h-4 z-10 transition-colors group-focus-within:text-primary-500" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 mb-1 block">{t('auth.password')}</label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              className="input-field pl-12 py-3.5 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group group">
              <Phone className="absolute left-6 top-[44px] text-slate-300 w-4 h-4 z-10 transition-colors group-focus-within:text-primary-500" />
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 mb-1 block">Mobile</label>
              <input
                type="text"
                placeholder="+91..."
                className="input-field pl-12 py-3.5 text-sm"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div className="input-group group">
              <CheckCircle className="absolute left-6 top-[44px] text-slate-300 w-4 h-4 z-10 transition-colors group-focus-within:text-primary-500" />
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 mb-1 block">I am a</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field pl-12 py-3.5 text-sm appearance-none cursor-pointer"
              >
                <option value="tourist">Tourist</option>
                <option value="guide">Guide</option>
              </select>
            </div>
          </div>

          <div className="input-group group">
            <MapPin className="absolute left-6 top-[44px] text-slate-300 w-4 h-4 z-10 transition-colors group-focus-within:text-primary-500" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 mb-1 block">Location</label>
            <input
              type="text"
              placeholder="Bhubaneswar, Odisha"
              className="input-field pl-12 py-3.5 text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className={`w-full btn-primary py-5 text-sm mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : (t('common.register'))}
            {!loading && <ArrowRight className="w-5 h-5 ml-2 inline-block transition-transform group-hover:translate-x-1" />}
          </motion.button>
        </form>

        <div className="mt-8 text-center pb-10">
          <p className="text-sm font-bold text-slate-400">
            {t('auth.already_member')} {' '}
            <Link to="/login" className="text-primary-500 font-extrabold hover:underline underline-offset-4 decoration-2">{t('common.login')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
