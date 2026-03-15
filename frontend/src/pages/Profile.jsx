import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Shield, Radio, Power, ChevronRight, 
  Settings, Heart, Star, CreditCard, 
  History, Camera, Edit3
} from 'lucide-react';
import useGuideTracking from '../hooks/useGuideTracking';

const Profile = () => {
  const { user } = useAuth();
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
         
         <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col lg:flex-row lg:items-end justify-between gap-12"
            >
               <div className="space-y-6">
                  <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
                     <Shield className="w-4 h-4 text-primary-400" />
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Verified Traveler Realm</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic font-serif leading-none">
                     YOUR <span className="text-primary-500">LEGEND</span>
                  </h1>
               </div>

               <div className="flex items-center space-x-4">
                  <button className="p-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all">
                     <Settings className="w-6 h-6" />
                  </button>
                  <button className="px-8 py-4 bg-primary-500 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center space-x-3">
                     <Edit3 className="w-4 h-4" />
                     <span>Edit Chronicle</span>
                  </button>
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
            <div className="p-12 lg:p-20">
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
                     <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] bg-slate-900 p-1 shadow-2xl overflow-hidden group-hover:rotate-6 transition-transform">
                           <div className="w-full h-full rounded-[2.5rem] bg-primary-500 flex items-center justify-center text-slate-900 font-serif italic font-black text-6xl uppercase overflow-hidden">
                              {user.profilePicture ? <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                           </div>
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-4 bg-white text-slate-900 rounded-[1.5rem] shadow-xl hover:scale-110 transition-transform active:scale-90 border border-slate-100">
                           <Camera className="w-5 h-5" />
                        </button>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                           <h2 className="text-5xl font-black text-slate-800 tracking-tighter italic font-serif leading-none">{user.name}</h2>
                           {isLive && (
                             <div className="px-5 py-2 bg-green-500/10 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-ping" />
                                LIVE
                             </div>
                           )}
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                           <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                              <MapPin className="w-3.5 h-3.5 text-red-500" />
                              <span>{user.location || 'Odisha, Bharat'}</span>
                           </div>
                           <div className="w-1 h-1 bg-slate-200 rounded-full" />
                           <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                              <Calendar className="w-3.5 h-3.5 text-blue-500" />
                              <span>Member since March 2026</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {user.role === 'guide' && (
                     <button 
                        onClick={() => setIsLive(!isLive)}
                        className={`flex items-center px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl group ${
                           isLive 
                           ? 'bg-green-500 text-white shadow-green-500/20' 
                           : 'bg-slate-900 text-white hover:bg-primary-500 hover:text-slate-900'
                        }`}
                     >
                        <Radio className={`w-5 h-5 mr-3 ${isLive ? 'animate-pulse' : 'group-hover:rotate-12'}`} />
                        {isLive ? 'TRANSMITTING...' : 'ENABLE TRAVEL BEACON'}
                     </button>
                  )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <ProfileCard icon={Mail} label="CHRONICLE EMAIL" value={user.email} color="text-indigo-500" />
                  <ProfileCard icon={Phone} label="COMMUNICATION LINE" value={user.phone || 'Disconnected'} color="text-emerald-500" />
                  <ProfileCard icon={Shield} label="SECURITY LEVEL" value={`${user.role} Access`} color="text-primary-500" />
                  <ProfileCard icon={Star} label="QUEST SCORE" value="4.9 Elite Traveler" color="text-orange-500" />
               </div>

               <div className="mt-20 pt-16 border-t border-slate-50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10">QUICK REALMS</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                     <ActionButton icon={History} label="History" />
                     <ActionButton icon={Heart} label="Favorites" />
                     <ActionButton icon={CreditCard} label="Payments" />
                     <ActionButton icon={Power} label="Sign Out" variant="danger" />
                  </div>
               </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
};

const ProfileCard = ({ icon: Icon, label, value, color }) => (
  <div className="p-8 bg-slate-50/50 rounded-[3rem] border border-slate-50 group hover:bg-white hover:shadow-premium transition-all">
     <div className="flex items-center space-x-6">
        <div className={`p-4 bg-white rounded-2xl shadow-soft group-hover:scale-110 transition-transform ${color}`}>
           <Icon className="w-6 h-6" />
        </div>
        <div>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
           <p className="text-lg font-black text-slate-800 tracking-tight italic font-serif">{value}</p>
        </div>
     </div>
  </div>
);

const ActionButton = ({ icon: Icon, label, variant = 'default' }) => (
  <button className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all active:scale-95 space-y-3 ${
     variant === 'danger' 
     ? 'bg-red-50/50 border-red-50 text-red-500 hover:bg-red-500 hover:text-white' 
     : 'bg-slate-50/50 border-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white'
  }`}>
     <Icon className="w-6 h-6" />
     <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default Profile;
