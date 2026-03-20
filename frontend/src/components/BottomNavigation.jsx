import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Compass, Calendar, Sparkles, 
  User, LayoutDashboard, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const BottomNavigation = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  
  if (!auth) {
    console.error('Auth context not found in BottomNavigation');
    return null;
  }

  const { user, loading } = auth;
  
  if (loading) return null;

  const navItems = user?.role === 'guide' ? [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/guide' },
    { icon: Calendar, label: 'Requests', path: '/guide' }, // Mapped to /guide as requested
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
    { icon: Sparkles, label: 'Chat', path: '/ai-chat' },
    { icon: User, label: 'Profile', path: '/profile' },
  ] : user?.role === 'admin' ? [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: User, label: 'Users', path: '/admin/users' },
    { icon: User, label: 'Guides', path: '/admin/guides' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ] : [
    { icon: Home, label: t('common.home') || 'Home', path: '/' },
    { icon: Compass, label: t('common.explore') || 'Explore', path: '/explore-map' },
    { icon: Calendar, label: t('common.bookings') || 'Bookings', path: '/bookings' },
    { icon: Sparkles, label: t('common.chat') || 'Chat', path: '/ai-chat' },
    { icon: User, label: t('common.profile') || 'Profile', path: '/profile' },
  ];

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 md:hidden z-[1000]"
    >
      <div className="bg-slate-900 border-t border-white/10 p-2 flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.5)] safe-area-bottom">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => 
              `relative flex-1 flex flex-col items-center justify-center py-2 transition-all duration-500 ${isActive ? 'text-primary-500' : 'text-slate-500'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative z-10">
                   <item.icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'scale-100'}`} />
                </div>
                
                <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute -top-2 w-8 h-1 bg-primary-500 rounded-full shadow-[0_0_15px_rgba(255,153,51,0.6)]"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;
