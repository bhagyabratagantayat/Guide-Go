import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, Compass, BookOpen, MessageSquare, 
  LogOut, User, ShieldCheck, LayoutDashboard,
  Menu, X, Bell
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Explore Map', path: '/explore-map', icon: Compass, roles: ['tourist', null] },
    { name: 'Guides', path: '/guides', icon: Map, roles: ['tourist', null] },
    { name: 'My Bookings', path: '/bookings', icon: BookOpen, roles: ['tourist', 'guide'] },
    { name: 'AI Assistant', path: '/ai-chat', icon: MessageSquare, roles: ['tourist', null] },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-3 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto glass-card rounded-[2rem] px-6 py-3"
      >
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:rotate-12 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tighter">GuideGo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {/* Conditional Admin/Guide Hubs */}
            {user?.role === 'admin' && (
              <NavLink to="/admin" icon={ShieldCheck} label="Admin Hub" active={location.pathname.startsWith('/admin')} variant="special" />
            )}
            {user?.role === 'guide' && (
              <NavLink to="/guide-dashboard" icon={LayoutDashboard} label="Guide Hub" active={location.pathname === '/guide-dashboard'} variant="special" />
            )}

            {/* Standard Nav Links */}
            {navLinks.map((link) => (
              (link.roles.includes(user?.role || null)) && (
                <NavLink 
                  key={link.path} 
                  to={link.path} 
                  icon={link.icon} 
                  label={link.name} 
                  active={location.pathname === link.path} 
                />
              )
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button className="p-2 text-slate-400 hover:text-primary-500 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-secondary-500 rounded-full border-2 border-white"></span>
                </button>
                
                <Link to="/profile" className="flex items-center space-x-2 p-1 pl-1 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-black text-xs uppercase overflow-hidden ring-2 ring-primary-500/10">
                    {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-slate-700 hidden lg:block">{user.name.split(' ')[0]}</span>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors hidden sm:block"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary-500">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">Join Free</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 glass-card rounded-3xl p-4 space-y-2 mx-auto max-w-7xl"
          >
            {navLinks.map((link) => (
              (link.roles.includes(user?.role || null)) && (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all ${
                    location.pathname === link.path 
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              )
            ))}
            {user && (
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ to, icon: Icon, label, active, variant = 'default' }) => (
  <Link 
    to={to} 
    className={`
      flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
      ${variant === 'special' 
        ? (active ? 'bg-secondary-500 text-white' : 'text-secondary-600 hover:bg-secondary-50')
        : (active ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-600 hover:text-primary-500 hover:bg-slate-50')
      }
    `}
  >
    <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
    <span>{label}</span>
  </Link>
);

export default Navbar;
