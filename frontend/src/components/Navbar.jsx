import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  LogOut, Bell, ShieldCheck, LayoutDashboard, 
  Compass, Menu, X, User, ChevronRight,
  Sparkles, Map, Heart, Search, Home, Headset, Calendar,
  Languages, Globe, Moon, Sun, Settings
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import logo from '../assets/GuideGo Logo.jpeg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
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
    <nav className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-soft py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center">
          <img 
            src={logo} 
            alt="GuideGo" 
            className="h-10 w-10 object-cover rounded-full ring-2 ring-primary-500/20 shadow-lg"
          />
          <span className={`ml-3 text-xl font-black italic tracking-tighter ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>GuideGo</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {user?.role === 'guide' ? (
            <>
              <NavLink to="/guide" label="Dashboard" />
              <NavLink to="/guide" label="Booking Requests" />
              <NavLink to="/bookings" label="My Bookings" />
              <NavLink to="/guide" label="Earnings" />
              <NavLink to="/ai-chat" label="Chat" />
            </>
          ) : user?.role === 'admin' ? (
            <>
              <NavLink to="/admin" label="Dashboard" />
              <NavLink to="/admin/users" label="User Management" />
              <NavLink to="/admin/guides" label="Guide Management" />
              <NavLink to="/admin/bookings" label="Bookings" />
              <NavLink to="/admin" label="Reports" />
              <NavLink to="/settings" label="Settings" />
            </>
          ) : (
            <>
              <NavLink to="/" label="Home" />
              <NavLink to="/explore-map" label="Explore" />
              <NavLink to="/guides" label="Services" />
              <NavLink to="/bookings" label="My Bookings" />
              <NavLink to="/ai-chat" label="AI Assistant" />
            </>
          )}
          
          <button 
            onClick={toggleDarkMode}
            className={`p-3 rounded-2xl transition-all active:scale-90 ${isScrolled ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-300' : 'bg-slate-900/10 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          
          {user ? (
            <div className="flex items-center space-x-5">
              <div className="flex items-center space-x-2">
                <button className={`p-3 rounded-2xl transition-colors relative ${isScrolled ? 'text-slate-400 hover:text-primary-500' : 'text-slate-500 hover:text-primary-500'}`}>
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-primary-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>
              </div>

              <Link to="/profile" className="flex items-center space-x-4 p-1 rounded-full group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs uppercase overflow-hidden ring-4 transition-all group-hover:ring-primary-500/30 ${isScrolled ? 'bg-primary-500 text-white ring-slate-100 dark:ring-slate-800' : 'bg-slate-900 text-white ring-slate-100 dark:ring-slate-800'}`}>
                  {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{user.role}</p>
                   <p className={`text-sm font-bold leading-none ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>{user.name.split(' ')[0]}</p>
                </div>
              </Link>

              <button 
                onClick={handleLogout}
                className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 rounded-2xl transition-all active:scale-90"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-black uppercase tracking-widest px-6 py-2 text-slate-500 hover:text-primary-500 transition-colors">Login</Link>
              <Link to="/register" className="px-8 py-4 bg-slate-900 dark:bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary-500 transition-all active:scale-95">Join Now</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-3 lg:hidden">
          <button 
            onClick={toggleDarkMode}
            className={`p-3 rounded-2xl transition-all active:scale-90 ${isScrolled ? 'bg-slate-50 dark:bg-slate-800 text-slate-400' : 'bg-slate-900/10 dark:bg-white/10 text-white'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-3 rounded-2xl transition-all active:scale-90 shadow-xl ${isScrolled ? 'bg-white/5 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700' : 'bg-slate-900 dark:bg-primary-600 text-white'}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[90]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 z-[100] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-900 dark:bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold italic">G</div>
                    <span className="text-xl font-black text-slate-900 dark:text-white italic font-serif">GuideGo</span>
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="flex-grow space-y-4 overflow-y-auto pr-2 no-scrollbar">
                 <div className="grid grid-cols-3 gap-3 mb-8">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all border-2 ${i18n.language?.startsWith(lang.code) ? 'bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900/20' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 dark:text-slate-500'}`}
                      >
                        <span className="text-2xl mb-1">{lang.flag}</span>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{lang.name.slice(0, 3)}</span>
                      </button>
                    ))}
                 </div>

                 {user?.role === 'guide' ? (
                    <>
                      <MobileNavLink to="/guide" label="Dashboard" icon={LayoutDashboard} onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/guide" label="Requests" icon={Bell} onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/bookings" label="Bookings" icon={Calendar} onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/ai-chat" label="Chat" icon={Sparkles} onClick={() => setIsMobileMenuOpen(false)} />
                    </>
                  ) : user?.role === 'admin' ? (
                    <>
                      <MobileNavLink to="/admin" label="Dashboard" icon={LayoutDashboard} onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/admin/users" label="Users" icon={User} onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/admin/guides" label="Guides" icon={ShieldCheck} onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/admin/bookings" label="Bookings" icon={Calendar} onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/settings" label="Settings" icon={Settings} onClick={() => setIsMobileMenuOpen(false)} />
                    </>
                  ) : (
                    <>
                      <MobileNavLink to="/" label="Home" icon={Home} onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/explore-map" label="Explore" icon={Map} onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/bookings" label="Bookings" icon={Calendar} onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/ai-chat" label="Chat" icon={Sparkles} onClick={() => setIsMobileMenuOpen(false)} />
                      <MobileNavLink to="/profile" label="Profile" icon={User} onClick={() => setIsMobileMenuOpen(false)} />
                    </>
                  )}
              </div>

              {user ? (
                 <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-4">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    >
                       <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center font-black text-white text-lg italic">
                          {user.name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-400 tracking-widest uppercase">{user.role}</p>
                          <p className="text-lg font-black tracking-tight">{user.name}</p>
                       </div>
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="w-full py-5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-3xl font-black text-xs uppercase tracking-widest shadow-soft flex items-center justify-center space-x-3"
                    >
                       <LogOut className="w-5 h-5" />
                       <span>Logout</span>
                    </button>
                 </div>
              ) : (
                 <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-3xl font-black text-xs uppercase tracking-widest text-center">Login</Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-5 bg-slate-900 dark:bg-primary-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest text-center shadow-premium">Start Exploring</Link>
                 </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ to, label }) => (
  <RouterNavLink 
    to={to} 
    className={({ isActive }) => `
      text-xs font-bold uppercase tracking-widest transition-all
      ${isActive ? 'text-primary-500' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}
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
      ${isActive ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
    `}
  >
    {({ isActive }) => (
      <>
        <div className="flex items-center space-x-4">
           <Icon className={`w-6 h-6 ${isActive ? 'text-primary-500' : 'text-slate-300 dark:text-slate-600'}`} />
           <span className="text-xs font-black uppercase tracking-widest italic">{label}</span>
        </div>
        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-primary-500' : 'text-slate-200 dark:text-slate-700'}`} />
      </>
    )}
  </RouterNavLink>
);

export default Navbar;
