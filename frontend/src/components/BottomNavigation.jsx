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
      className="fixed bottom-0 left-0 right-0 md:hidden z-[1000] px-4 pb-8"
    >
      <div className="bg-slate-900/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => 
              `relative flex-1 flex flex-col items-center justify-center py-3 transition-all duration-500 ${isActive ? 'text-primary-500' : 'text-slate-500 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative z-10">
                   <item.icon className={`w-6 h-6 transition-transform duration-500 ${isActive ? 'scale-110' : 'scale-100'}`} />
                </div>
                
                <span className={`text-[8px] font-black uppercase tracking-widest mt-1.5 transition-all duration-500 ${isActive ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-1'}`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-x-2 inset-y-1 bg-white/5 rounded-2xl -z-0"
                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                  />
                )}
                
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute -bottom-1 w-1 h-1 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(255,153,51,0.8)]"
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
