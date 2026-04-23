import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User as UserIcon, Mail, Lock, Phone, 
  MapPin, CheckCircle, ArrowRight, Compass 
} from 'lucide-react';
import logo from '../assets/GuideGo Logo.jpeg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-base)] py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-[var(--bg-card)] rounded-[3rem] p-10 border border-[var(--border-color)] shadow-2xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] opacity-10 blur-[60px] -translate-y-12 translate-x-12" />

        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            className="mb-4 flex justify-center"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-[var(--accent)] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <img 
                src={logo} 
                alt="GuideGo" 
                className="relative h-20 w-20 object-cover rounded-full border-2 border-[var(--border-color)] shadow-2xl"
              />
            </div>
          </motion.div>
          <h1 className="text-2xl font-black italic font-serif text-[var(--text-primary)] mb-1">
            Create Account
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center group">
            <UserIcon className="absolute left-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] w-4 h-4 transition-colors" />
            <input
              type="text"
              placeholder="Full Name"
              className="input-field pl-12"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="relative flex items-center group">
            <Mail className="absolute left-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] w-4 h-4 transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              className="input-field pl-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative flex items-center group">
            <Lock className="absolute left-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] w-4 h-4 transition-colors" />
            <input
              type="password"
              placeholder="Password"
              className="input-field pl-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative flex items-center group">
              <Phone className="absolute left-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] w-4 h-4 transition-colors" />
              <input
                type="text"
                placeholder="Mobile"
                className="input-field pl-12"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div className="relative flex items-center group">
              <CheckCircle className="absolute left-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] w-4 h-4 transition-colors pointer-events-none" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field pl-12 appearance-none bg-[var(--bg-input)]"
              >
                <option value="user" className="bg-[var(--bg-card)]">User</option>
                <option value="guide" className="bg-[var(--bg-card)]">Guide</option>
              </select>
            </div>
          </div>

          <div className="relative flex items-center group">
            <MapPin className="absolute left-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] w-4 h-4 transition-colors" />
            <input
              type="text"
              placeholder="Location (e.g. Puri, Odisha)"
              className="input-field pl-12"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className={`btn-primary w-full py-4 mt-4 uppercase tracking-widest ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Register Now'}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
            Already a member? {' '}
            <Link to="/login" className="text-[var(--accent)] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
