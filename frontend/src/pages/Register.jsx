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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-primary-50 to-white py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-premium border border-primary-50"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            className="mb-4 flex justify-center"
          >
            <img 
              src="/src/assets/GuideGo Logo.jpeg" 
              alt="GuideGo" 
              className="h-16 w-auto object-contain"
            />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Create Account
          </h1>
          <p className="text-xs text-slate-400 font-medium">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <UserIcon className="absolute left-5 text-slate-300 w-4 h-4" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-secondary-50 border-transparent rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:bg-white focus:border-primary-500 focus:ring-0 transition-all font-medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="relative flex items-center">
            <Mail className="absolute left-5 text-slate-300 w-4 h-4" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-secondary-50 border-transparent rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:bg-white focus:border-primary-500 focus:ring-0 transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative flex items-center">
            <Lock className="absolute left-5 text-slate-300 w-4 h-4" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-secondary-50 border-transparent rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:bg-white focus:border-primary-500 focus:ring-0 transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative flex items-center">
              <Phone className="absolute left-5 text-slate-300 w-4 h-4" />
              <input
                type="text"
                placeholder="Mobile"
                className="w-full bg-secondary-50 border-transparent rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:bg-white focus:border-primary-500 focus:ring-0 transition-all font-medium"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div className="relative flex items-center">
              <CheckCircle className="absolute left-5 text-slate-300 w-4 h-4 pointer-events-none" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-secondary-50 border-transparent rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:bg-white focus:border-primary-500 focus:ring-0 transition-all font-medium appearance-none"
              >
                <option value="tourist">Tourist</option>
                <option value="guide">Guide</option>
              </select>
            </div>
          </div>

          <div className="relative flex items-center">
            <MapPin className="absolute left-5 text-slate-300 w-4 h-4" />
            <input
              type="text"
              placeholder="Location (e.g. Puri, Odisha)"
              className="w-full bg-secondary-50 border-transparent rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:bg-white focus:border-primary-500 focus:ring-0 transition-all font-medium"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className={`w-full bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all text-sm uppercase tracking-widest mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Register'}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-slate-400">
            Already a member? {' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
