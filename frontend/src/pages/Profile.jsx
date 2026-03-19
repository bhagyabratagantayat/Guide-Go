import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Shield, Radio, Power, ChevronRight, 
  Settings, Heart, Star, Languages,
  Camera, Edit3, History, Bookmark,
  LogOut, Bell, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useGuideTracking from '../hooks/useGuideTracking';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
<<<<<<< HEAD
  const { t, i18n } = useTranslation();
=======
>>>>>>> a942ae1
  const [isLive, setIsLive] = useState(false);
  const { startTracking } = useGuideTracking(user);

  useEffect(() => {
    let stopTracking;
    if (isLive) {
      stopTracking = startTracking();
    }
    return () => stopTracking && stopTracking();
  }, [isLive, user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
           <User className="w-10 h-10" />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-bold text-slate-900">Sign in to your profile</h2>
           <p className="text-slate-500 text-sm">Join the GuideGo community to keep track of your journeys.</p>
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
    <div className="min-h-screen bg-white pb-32">
      {/* Simple Header */}
      <div className="px-6 pt-12 pb-8 flex flex-col items-center">
         <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full bg-slate-50 border-4 border-slate-50 shadow-soft overflow-hidden flex items-center justify-center">
               {user.profilePicture ? (
                 <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
               ) : (
                 <User className="w-12 h-12 text-slate-300" />
               )}
            </div>
            <button className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-lg border border-slate-100 text-slate-600 active:scale-90 transition-all">
               <Camera className="w-4 h-4" />
            </button>
            {isLive && (
               <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            )}
         </div>
<<<<<<< HEAD

         <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-sm text-slate-400 font-medium">{user.email}</p>
         </div>

         <div className="mt-6 flex items-center space-x-3">
            <div className="px-4 py-1.5 bg-slate-50 rounded-full flex items-center space-x-2 border border-slate-100">
               <MapPin className="w-3.5 h-3.5 text-primary-500" />
               <span className="text-xs font-bold text-slate-600">{user.location || 'Odisha, Bharat'}</span>
            </div>
            {user.role === 'guide' && (
               <button 
                 onClick={() => setIsLive(!isLive)}
                 className={`px-4 py-1.5 rounded-full flex items-center space-x-2 border transition-all ${
                   isLive ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white border-slate-200 text-slate-400'
                 }`}
               >
                  <Radio className={`w-3.5 h-3.5 ${isLive ? 'animate-pulse' : ''}`} />
                  <span className="text-xs font-bold">{isLive ? 'Live Now' : 'Go Live'}</span>
               </button>
            )}
         </div>
      </div>

      {/* Profile Menu List */}
      <div className="px-6 space-y-8 mt-4">
         <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Account</h3>
            <div className="bg-slate-50/50 rounded-3xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
               <MenuItem 
                 icon={History} 
                 label="My Bookings" 
                 onClick={() => navigate('/bookings')} 
               />
               <MenuItem 
                 icon={Bookmark} 
                 label="Saved Places" 
                 onClick={() => navigate('/explore-map')} 
               />
               <MenuItem 
                 icon={Languages} 
                 label="Language" 
                 value={i18n.language === 'en' ? 'English' : (i18n.language === 'hi' ? 'हिन्दी' : 'ଓଡ଼ିଆ')}
                 onClick={() => navigate('/settings')} 
               />
=======
         
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
               <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic font-serif leading-none">
                  {user.name.toUpperCase()}
               </h1>
               <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">
                     <Mail className="w-3 h-3" />
                     <span>{user.email}</span>
                  </div>
               </div>
            </motion.div>
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-24 relative z-20">
         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[4rem] shadow-premium overflow-hidden border border-slate-100"
         >
            <div className="p-10">
               {/* Quick Info Grid */}
               <div className="grid grid-cols-2 gap-4 mb-12">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center space-x-4 group hover:bg-slate-900 transition-all cursor-pointer">
                     <div className="p-3 bg-white rounded-xl shadow-soft group-hover:bg-slate-800 transition-colors">
                        <MapPin className="w-5 h-5 text-red-500" />
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-500">Location</p>
                        <p className="text-xs font-black text-slate-900 group-hover:text-white uppercase tracking-tight">{user.location || 'Bhubaneswar, IN'}</p>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center space-x-4 group hover:bg-slate-900 transition-all cursor-pointer">
                     <div className="p-3 bg-white rounded-xl shadow-soft group-hover:bg-slate-800 transition-colors">
                        <Star className="w-5 h-5 text-primary-500" />
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-500">Language</p>
                        <p className="text-xs font-black text-slate-900 group-hover:text-white uppercase tracking-tight">{user.language || 'English'}</p>
                     </div>
                  </div>
               </div>

               {/* Quick Realms - WhatsApp Style Action Grid */}
               <div className="space-y-8">
                  <div className="text-center">
                    <h4 className="inline-block text-[9px] font-black text-slate-300 uppercase tracking-[0.6em] italic border-b border-slate-100 pb-2">Quick Realms</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                     <ActionButton 
                        icon={History} 
                        label="History" 
                        color="text-indigo-500"
                        onClick={() => navigate('/bookings')} 
                     />
                     <ActionButton 
                        icon={Heart} 
                        label="Favorites" 
                        color="text-red-500"
                        onClick={() => navigate('/explore')}
                     />
                     <ActionButton 
                        icon={CreditCard} 
                        label="Payments" 
                        color="text-emerald-500"
                        onClick={() => navigate('/bookings')}
                     />
                     <ActionButton 
                        icon={Settings} 
                        label="Settings" 
                        color="text-orange-500"
                        onClick={() => navigate('/settings')}
                     />
                  </div>

                  <div className="pt-12 text-center">
                     <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="flex items-center justify-center space-x-4 mx-auto group"
                     >
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-soft overflow-hidden relative">
                           <Power className="w-5 h-5 relative z-10" />
                           <div className="absolute inset-0 bg-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </div>
                        <div className="text-left">
                           <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Sign Out</p>
                           <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">End Current Session</p>
                        </div>
                     </motion.button>
                  </div>
               </div>
>>>>>>> a942ae1
            </div>
         </div>

         <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Settings & Support</h3>
            <div className="bg-slate-50/50 rounded-3xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
               <MenuItem icon={Bell} label="Notifications" onClick={() => {}} />
               <MenuItem icon={Settings} label="Account Settings" onClick={() => navigate('/settings')} />
               <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => navigate('/support')} />
            </div>
         </div>

         <div className="pt-4">
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full bg-red-50 text-red-500 py-5 rounded-3xl font-bold text-sm flex items-center justify-center space-x-3 active:scale-[0.98] transition-all border border-red-100"
            >
               <LogOut className="w-5 h-5" />
               <span>Sign Out</span>
            </button>
         </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
const MenuItem = ({ icon: Icon, label, value, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full p-5 flex items-center justify-between group active:bg-slate-100/50 transition-all"
  >
     <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-500 shadow-sm ring-1 ring-slate-100 group-hover:ring-primary-100 transition-all">
           <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
     </div>
     <div className="flex items-center space-x-2">
        {value && <span className="text-xs font-bold text-slate-400">{value}</span>}
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
     </div>
  </button>
=======
const ActionButton = ({ icon: Icon, label, color, onClick }) => (
  <motion.button 
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center justify-center space-y-4 group"
  >
     <div className="w-24 h-24 rounded-[3rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:shadow-premium group-hover:border-transparent transition-all relative">
        <Icon className={`w-8 h-8 ${color} opacity-40 group-hover:opacity-100 transition-opacity`} />
        <div className="absolute -inset-1 bg-gradient-to-br from-primary-500/10 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity" />
     </div>
     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-slate-900 transition-colors">{label}</span>
  </motion.button>
>>>>>>> a942ae1
);

export default Profile;
