import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, MapPin, Radio, Power, ChevronRight, 
  Settings, Heart, Languages, Camera, History, 
  Bell, HelpCircle, CreditCard
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext.jsx';
import useGuideTracking from '../hooks/useGuideTracking';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { darkMode } = useTheme();
  const [isLive, setIsLive] = useState(false);
  const { startTracking } = useGuideTracking(user);

  useEffect(() => {
    let stopTracking;
    if (isLive && user) {
      stopTracking = startTracking();
    }
    return () => stopTracking && stopTracking();
  }, [isLive, user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center space-y-6 bg-white dark:bg-slate-950">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700">
           <User className="w-10 h-10" />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to your profile</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm">Join the GuideGo community to keep track of your journeys.</p>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="bg-primary-500 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-32 transition-colors duration-300">
      {/* Premium Header */}
      <div className="bg-slate-900 pt-32 pb-48 px-8 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500 rounded-full blur-[120px] -mr-48 -mt-48" />
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="mb-8"
            >
               <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-4 border-primary-500 p-1 bg-slate-800 shadow-2xl">
                     <div className="w-full h-full rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-white text-4xl font-black italic">
                        {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                     </div>
                  </div>
                  <div className="absolute bottom-0 right-0 p-2 bg-primary-500 rounded-full border-4 border-slate-900 shadow-lg cursor-pointer">
                     <Camera className="w-4 h-4 text-slate-900" />
                  </div>
               </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-4"
            >
               <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic font-serif leading-none uppercase">
                  {user.name}
               </h1>
               <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">
                     <Mail className="w-3 h-3" />
                     <span>{user.email}</span>
                  </div>
                  {user.role === 'guide' && (
                    <button 
                      onClick={() => setIsLive(!isLive)}
                      className={`px-4 py-1.5 rounded-full flex items-center space-x-2 border transition-all ${
                        isLive ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/10 border-white/20 text-white'
                      }`}
                    >
                       <Radio className={`w-3.5 h-3.5 ${isLive ? 'animate-pulse' : ''}`} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{isLive ? 'Live Now' : 'Go Live'}</span>
                    </button>
                  )}
               </div>
            </motion.div>
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-24 relative z-20">
         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[4rem] shadow-premium dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800"
         >
            <div className="p-10">
               {/* Quick Info Grid */}
               <div className="grid grid-cols-2 gap-4 mb-12">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4 group hover:bg-slate-900 dark:hover:bg-primary-600 transition-all cursor-pointer">
                     <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-soft group-hover:bg-slate-800 dark:group-hover:bg-primary-700 transition-colors">
                        <MapPin className="w-5 h-5 text-red-500" />
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-500 dark:group-hover:text-primary-200">Location</p>
                        <p className="text-xs font-black text-slate-900 dark:text-slate-300 group-hover:text-white uppercase tracking-tight">{user.location || 'Bhubaneswar, IN'}</p>
                     </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4 group hover:bg-slate-900 dark:hover:bg-primary-600 transition-all cursor-pointer" onClick={() => navigate('/settings')}>
                     <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-soft group-hover:bg-slate-800 dark:group-hover:bg-primary-700 transition-colors">
                        <Languages className="w-5 h-5 text-primary-500" />
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-500 dark:group-hover:text-primary-200">Language</p>
                        <p className="text-xs font-black text-slate-900 dark:text-slate-300 group-hover:text-white uppercase tracking-tight">
                           {i18n.language === 'en' ? 'English' : (i18n.language === 'hi' ? 'हिन्दी' : 'ଓଡ଼ିଆ')}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Quick Realms - Action Grid */}
               <div className="space-y-8">
                  <div className="text-center">
                    <h4 className="inline-block text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.6em] italic border-b border-slate-100 dark:border-slate-800 pb-2">Quick Realms</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     <ActionButton 
                        icon={History} 
                        label="History" 
                        color="text-indigo-500"
                        onClick={() => navigate('/bookings')} 
                        darkMode={darkMode}
                     />
                     <ActionButton 
                        icon={Heart} 
                        label="Favorites" 
                        color="text-red-500"
                        onClick={() => navigate('/explore-map')}
                        darkMode={darkMode}
                     />
                     <ActionButton 
                        icon={CreditCard} 
                        label="Payments" 
                        color="text-emerald-500"
                        onClick={() => navigate('/bookings')}
                        darkMode={darkMode}
                     />
                     <ActionButton 
                        icon={Settings} 
                        label="Settings" 
                        color="text-orange-500"
                        onClick={() => navigate('/settings')}
                        darkMode={darkMode}
                     />
                  </div>

                  <div className="pt-12 text-center">
                     <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="flex items-center justify-center space-x-4 mx-auto group"
                     >
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-soft overflow-hidden relative">
                           <Power className="w-5 h-5 relative z-10" />
                           <div className="absolute inset-0 bg-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </div>
                        <div className="text-left">
                           <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Sign Out</p>
                           <p className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">End Session</p>
                        </div>
                     </motion.button>
                  </div>
               </div>
            </div>
         </motion.div>

         <div className="mt-12 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4 px-8">Quick Links</h3>
            <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden mx-4">
               <MenuItem icon={Bell} label="Notifications" onClick={() => {}} />
               <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => navigate('/support')} />
            </div>
         </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, color, onClick, darkMode }) => (
  <motion.button 
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center justify-center space-y-4 group"
  >
     <div className="w-24 h-24 rounded-[3rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-premium group-hover:border-transparent transition-all relative">
        <Icon className={`w-8 h-8 ${color} opacity-40 group-hover:opacity-100 transition-opacity`} />
        <div className="absolute -inset-1 bg-gradient-to-br from-primary-500/10 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity" />
     </div>
     <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-center">{label}</span>
  </motion.button>
);

const MenuItem = ({ icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full p-6 flex items-center justify-between group active:bg-slate-100/50 dark:active:bg-slate-800/50 transition-all"
  >
     <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:text-primary-500 shadow-soft transition-all">
           <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-black tracking-tight text-slate-700 dark:text-slate-300">{label}</span>
     </div>
     <ChevronRight className="w-4 h-4 text-slate-200 dark:text-slate-700 group-hover:text-primary-500 transition-colors" />
  </button>
);

export default Profile;
