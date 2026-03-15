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
    <nav className={`fixed top-0 w-full z-[1000] transition-all duration-500 px-6 py-6 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`max-w-7xl mx-auto rounded-[2.5rem] transition-all duration-500 flex justify-between items-center px-8 py-3 
          ${isScrolled 
            ? 'bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
            : 'bg-white/80 backdrop-blur-md border border-slate-100 shadow-soft'}`}
      >
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-4 group">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl group-hover:rotate-12 group-hover:scale-110 
            ${isScrolled ? 'bg-primary-500 text-slate-900' : 'bg-slate-900 text-white shadow-slate-900/20'}`}>
            <Compass className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className={`text-2xl font-black tracking-tighter italic font-serif transition-colors duration-500 ${isScrolled ? 'text-white' : 'text-slate-900'}`}>GuideGo</span>
            <span className={`text-[9px] font-black uppercase tracking-[0.3em] ml-0.5 ${isScrolled ? 'text-primary-400' : 'text-slate-400'}`}>Premium Travel</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {user?.role === 'admin' && (
            <CustomNavLink to="/admin" label="Admin" isScrolled={isScrolled} variant="secondary" />
          )}
          {user?.role === 'guide' && (
            <CustomNavLink to="/guide-dashboard" label="Dashboard" isScrolled={isScrolled} variant="secondary" />
          )}
          
          <CustomNavLink to="/explore-map" label={t('common.explore')} isScrolled={isScrolled} />
          <CustomNavLink to="/guides" label="Experts" isScrolled={isScrolled} />
          <CustomNavLink to="/ai-chat" label={t('common.chat')} isScrolled={isScrolled} />
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center space-x-2 p-3 rounded-2xl transition-all duration-300 ${isScrolled ? 'text-slate-400 hover:text-white bg-white/5' : 'text-slate-500 hover:text-primary-600 bg-slate-50'}`}
              >
                <Globe className="w-5 h-5 text-primary-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">{i18n.language?.split('-')[0].toUpperCase()}</span>
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-4 w-48 rounded-3xl overflow-hidden shadow-2xl border p-2 z-[1100] ${isScrolled ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left ${i18n.language?.startsWith(lang.code) ? 'bg-primary-500/10 text-primary-600' : (isScrolled ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600')}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-xs font-black uppercase tracking-widest">{lang.name}</span>
                        </div>
                        {i18n.language?.startsWith(lang.code) && <ShieldCheck className="w-4 h-4" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-white/10" />

            {user ? (
              <div className="flex items-center space-x-5">
                <div className="flex items-center space-x-2">
                  <button className={`p-3 rounded-2xl transition-colors relative ${isScrolled ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-primary-500'}`}>
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-primary-500 rounded-full border-2 border-slate-900"></span>
                  </button>
                  <button className={`p-3 rounded-2xl transition-colors ${isScrolled ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-primary-500'}`}>
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                <div className="h-8 w-px bg-white/10" />
                
                <Link to="/profile" className="flex items-center space-x-4 p-1 rounded-full group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs uppercase overflow-hidden ring-4 transition-all group-hover:ring-primary-500/30 ${isScrolled ? 'bg-primary-500 text-slate-900 ring-white/10' : 'bg-slate-900 text-white ring-slate-100'}`}>
                    {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                     <p className={`text-[9px] font-black uppercase tracking-widest ${isScrolled ? 'text-primary-400' : 'text-slate-400'}`}>{user.role}</p>
                     <p className={`text-sm font-bold leading-none ${isScrolled ? 'text-white' : 'text-slate-900'}`}>{user.name.split(' ')[0]}</p>
                  </div>
                </Link>

                <button 
                  onClick={handleLogout}
                  className={`p-3 rounded-2xl transition-all active:scale-90 ${isScrolled ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-red-400' : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500'}`}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className={`text-sm font-black uppercase tracking-widest px-6 py-2 transition-colors ${isScrolled ? 'text-white hover:text-primary-500' : 'text-slate-50 hover:text-primary-500'}`}>Login</Link>
                <Link to="/register" className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${isScrolled ? 'bg-primary-500 text-slate-900 hover:bg-white' : 'bg-slate-900 text-white hover:bg-primary-500 hover:text-slate-900'}`}>Join Now</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-3 lg:hidden">
          {/* Mobile Language Switcher Quick Toggle */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const next = i18n.language?.startsWith('en') ? 'hi' : (i18n.language?.startsWith('hi') ? 'or' : 'en');
              changeLanguage(next);
            }}
            className={`p-3 rounded-2xl transition-all active:scale-90 shadow-xl ${isScrolled ? 'bg-white/5 text-white' : 'bg-slate-900 text-white'}`}
          >
            <Globe className="w-6 h-6 text-primary-400" />
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-3 rounded-2xl transition-all active:scale-90 shadow-xl ${isScrolled ? 'bg-white/5 text-white' : 'bg-slate-900 text-white'}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.div>

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
               className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[100] shadow-2xl p-8 flex flex-col"
             >
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold italic">G</div>
                      <span className="text-xl font-black text-slate-900 italic font-serif italic">GuideGo</span>
                   </div>
                   <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                      <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                   <div className="grid grid-cols-3 gap-3 mb-8">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all border-2 ${i18n.language?.startsWith(lang.code) ? 'bg-primary-50 border-primary-500 text-primary-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                        >
                          <span className="text-2xl mb-1">{lang.flag}</span>
                          <span className="text-[10px] font-black uppercase tracking-tighter">{lang.name.slice(0, 3)}</span>
                        </button>
                      ))}
                   </div>

                   <MobileNavLink to="/" label={t('common.home')} icon={Home} onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavLink to="/explore-map" label={t('common.explore')} icon={Map} onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavLink to="/explore" label="Audio Guides" icon={Headset} onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavLink to="/guides" label="Local Experts" icon={User} onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavLink to="/ai-chat" label={t('common.chat')} icon={Sparkles} onClick={() => setIsMobileMenuOpen(false)} />
                   <MobileNavLink to="/bookings" label={t('common.bookings')} icon={Calendar} onClick={() => setIsMobileMenuOpen(false)} />
                </div>

                {user ? (
                   <div className="pt-8 border-t border-slate-100 flex flex-col space-y-4">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-4 p-4 rounded-3xl bg-slate-50 text-slate-900 font-bold"
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
                        className="w-full py-5 bg-red-50 text-red-500 rounded-3xl font-black text-xs uppercase tracking-widest shadow-soft flex items-center justify-center space-x-3"
                      >
                         <LogOut className="w-5 h-5" />
                         <span>{t('common.logout')}</span>
                      </button>
                   </div>
                ) : (
                   <div className="pt-8 border-t border-slate-100 space-y-4">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-5 bg-slate-50 text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest text-center">{t('common.login')}</Link>
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest text-center shadow-premium">Start Exploring</Link>
                   </div>
                )}
             </motion.div>
           </>
         )}
       </AnimatePresence>
    </nav>
  );
};

const CustomNavLink = ({ to, label, isScrolled, variant = 'primary' }) => (
  <RouterNavLink 
    to={to} 
    className={({ isActive }) => `
      px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500
      ${isActive 
        ? (variant === 'primary' ? 'bg-primary-500 text-slate-900 shadow-lg shadow-primary-500/20 scale-105' : 'bg-secondary-500 text-white shadow-lg') 
        : (isScrolled ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-primary-500 hover:bg-primary-50')
      }
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
