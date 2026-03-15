import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Shield, Radio, Power, ChevronRight, 
  Settings, Heart, Star, CreditCard, 
  History, Camera, Edit3
} from 'lucide-react';
import useGuideTracking from '../hooks/useGuideTracking';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);
  const { startTracking } = useGuideTracking(user);

  useEffect(() => {
    let stopTracking;
    if (isLive) {
      stopTracking = startTracking();
    }
    return () => stopTracking && stopTracking();
  }, [isLive]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center space-y-8">
        <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300">
           <User className="w-12 h-12" />
        </div>
        <div className="space-y-3">
           <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic font-serif leading-none uppercase">The Quest Interrupted</h2>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Please login to view your traveler chronicle.</p>
        </div>
        <a href="/login" className="btn-primary px-12 py-5 shadow-premium text-[10px]">REAWAKEN ACCESS</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-40">
      {/* Immersive Header */}
      <div className="bg-slate-900 pt-32 pb-48 px-8 relative overflow-hidden">
         <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500 rounded-full blur-[150px] -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[150px] -ml-48 -mb-48" />
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
            </div>
         </motion.div>
      </div>
    </div>
  );
};

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
);

export default Profile;
