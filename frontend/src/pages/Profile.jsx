import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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
  const { t, i18n } = useTranslation();
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
);

export default Profile;
