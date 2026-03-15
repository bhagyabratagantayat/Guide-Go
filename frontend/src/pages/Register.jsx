import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Phone, 
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
    <div className="mobile-container p-6 flex flex-col pt-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/20 mx-auto mb-4"
          >
            <Compass className="w-8 h-8 stroke-[2.5]" />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic font-serif leading-none">Create Account</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Join the GuideGo Global Community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="input-group">
            <User className="absolute left-6 top-[44px] text-slate-400 w-4 h-4 z-10" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="input-field pl-12 py-3.5 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Mail className="absolute left-6 top-[44px] text-slate-400 w-4 h-4 z-10" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="input-field pl-12 py-3.5 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="absolute left-6 top-[44px] text-slate-400 w-4 h-4 z-10" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Password</label>
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
            <div className="input-group">
              <Phone className="absolute left-6 top-[44px] text-slate-400 w-4 h-4 z-10" />
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Mobile</label>
              <input
                type="text"
                placeholder="+91..."
                className="input-field pl-12 py-3.5 text-sm"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <CheckCircle className="absolute left-6 top-[44px] text-slate-400 w-4 h-4 z-10" />
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">I am a</label>
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

          <div className="input-group">
            <MapPin className="absolute left-6 top-[44px] text-slate-400 w-4 h-4 z-10" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Location</label>
            <input
              type="text"
              placeholder="City, Country"
              className="input-field pl-12 py-3.5 text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className={`w-full btn-orange py-4 text-sm mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Start My Journey'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-bold text-slate-400">
            Member already?{' '}
            <Link to="/login" className="text-primary-500 font-extrabold hover:underline underline-offset-4 decoration-2">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
