import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, MapPin, Compass, Sparkles, User 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const BottomNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: t('common.home') || 'Home', path: '/' },
    { icon: MapPin, label: t('common.explore') || 'Explore', path: '/explore-map' },
    { icon: Compass, label: t('common.guides') || 'Guides', path: '/guides' },
    { icon: Sparkles, label: t('common.oracle') || 'Oracle', path: '/ai-chat' },
    { icon: User, label: t('common.profile') || 'Profile', path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-[1000] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] sm:px-12">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Link 
            key={item.path} 
            to={item.path}
            className="relative flex flex-col items-center justify-center w-16 h-16 group"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              className={`p-2 rounded-2xl transition-all duration-300 ${
                isActive 
                ? 'bg-primary-50 text-primary-500' 
                : 'text-slate-400 group-hover:text-slate-600'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-current opacity-20' : ''}`} />
            </motion.div>
            <span className={`text-[9px] font-black mt-1 uppercase tracking-widest ${
              isActive ? 'text-primary-600 opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100'
            } transition-all`}>
              {item.label}
            </span>
            {isActive && (
              <motion.div 
                layoutId="nav-pill"
                className="absolute -top-1 w-1 h-1 bg-primary-500 rounded-full"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
