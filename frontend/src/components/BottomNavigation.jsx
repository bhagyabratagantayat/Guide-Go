import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Compass, Calendar, Sparkles, 
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const BottomNavigation = () => {
  const { t } = useTranslation();
  
  const navItems = [
    { icon: Home, label: t('common.home'), path: '/' },
    { icon: Compass, label: t('common.explore'), path: '/explore-map' },
    { icon: Sparkles, label: t('common.chat'), path: '/ai-chat' },
    { icon: Calendar, label: t('common.bookings'), path: '/bookings' },
    { icon: User, label: t('common.profile'), path: '/profile' },
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
