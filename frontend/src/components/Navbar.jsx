import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  LogOut, Bell, ShieldCheck, LayoutDashboard, 
  Compass, Menu, X, User, ChevronRight,
  Sparkles, Map, Heart, Search, Home, Headset, Calendar,
  Languages, Globe
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' }
  ];

  return (
    <nav className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${isScrolled ? 'bg-white shadow-soft py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center">
          <img 
            src="/src/assets/GuideGo Logo.jpeg" 
            alt="GuideGo" 
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavLink to="/explore-map" label="Explore" />
          <NavLink to="/guides" label="Guides" />
          <NavLink to="/ai-chat" label={t('common.oracle') || 'Guide AI'} />
          <div className="h-6 w-px bg-slate-200" />
          {user ? (
            <Link to="/profile" className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border border-primary-200">
               {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold text-primary-600 uppercase">{user.name.charAt(0)}</span>}
            </Link>
          ) : (
            <Link to="/login" className="text-xs font-bold text-primary-500 uppercase tracking-widest">Login</Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-4 lg:hidden">
          <button 
            onClick={() => changeLanguage(i18n.language?.startsWith('en') ? 'hi' : (i18n.language?.startsWith('hi') ? 'or' : 'en'))}
            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"
          >
            <Globe className="w-5 h-5" />
          </button>
          {!user && (
            <Link to="/login" className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, label }) => (
  <RouterNavLink 
    to={to} 
    className={({ isActive }) => `
      text-xs font-bold uppercase tracking-widest transition-all
      ${isActive ? 'text-primary-500' : 'text-slate-400 hover:text-slate-600'}
    `}
  >
    {label}
  </RouterNavLink>
);

const MobileNavLink = ({ to, label, icon: Icon, onClick }) => (
  <RouterNavLink 
    to={to} 
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center justify-between p-5 rounded-[2rem] transition-all duration-300
      ${isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50'}
    `}
  >
    {({ isActive }) => (
      <>
        <div className="flex items-center space-x-4">
           <Icon className={`w-6 h-6 ${isActive ? 'text-primary-500' : 'text-slate-300'}`} />
           <span className="text-xs font-black uppercase tracking-widest italic">{label}</span>
        </div>
        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-primary-500' : 'text-slate-200'}`} />
      </>
    )}
  </RouterNavLink>
);

export default Navbar;
