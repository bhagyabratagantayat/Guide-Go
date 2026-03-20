import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Compass, Hotel, Coffee, 
  HeartPulse, Bike, ArrowRight, Star,
  LayoutDashboard, Calendar, User, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const quickActions = [
    { icon: MapPin, label: 'Find Guide', path: '/explore-map?filter=guides', color: 'bg-primary-500' },
    { icon: Compass, label: 'Explore Map', path: '/explore-map', color: 'bg-indigo-500' },
    { icon: Hotel, label: 'Hotels', path: '/explore-map?filter=hotels', color: 'bg-pink-500' },
    { icon: Coffee, label: 'Restaurants', path: '/explore-map?filter=restaurants', color: 'bg-orange-500' },
    { icon: HeartPulse, label: 'Emergency', path: '/emergency', color: 'bg-red-500' },
    { icon: Bike, label: 'Transport', path: '/explore-map?filter=transport', color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 pt-28 transition-colors duration-300">
      {/* Header / Greeting */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            {user?.role === 'tourist' ? 'Namaste, Explorer' : 'Namaste, Local Expert'}
          </p>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none uppercase">
            {user ? user.name.split(' ')[0] : 'Traveler'}
          </h1>
        </motion.div>
        
        {user?.role === 'tourist' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-2xl border border-primary-100 dark:border-primary-900/30"
          >
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">Active Search</span>
          </motion.div>
        )}
      </div>

      {/* Hero Search */}
      <div className="px-6 mb-12">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text"
            placeholder={user?.role === 'guide' ? "Find fellow guides..." : "Where to next?"}
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] py-6 pl-14 pr-6 shadow-premium dark:shadow-none font-bold text-lg placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-primary-500/30 transition-all text-slate-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Unified Quick Actions Grid - Uber Style */}
      <div className="px-6 mb-16">
        <h3 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em] mb-6 italic border-b border-slate-100 dark:border-slate-800 pb-2 inline-block">
          {user?.role === 'guide' ? 'Guide Tools' : 'Fast Launch'}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {(user?.role === 'guide' ? [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/guide', color: 'bg-primary-500' },
            { icon: Calendar, label: 'Bookings', path: '/bookings', color: 'bg-indigo-500' },
            { icon: Sparkles, label: 'Guide AI', path: '/ai-chat', color: 'bg-pink-500' },
            { icon: User, label: 'Profile', path: '/profile', color: 'bg-orange-500' },
            { icon: MapPin, label: 'Locals', path: '/guides', color: 'bg-blue-500' },
            { icon: Compass, label: 'Explore', path: '/explore-map', color: 'bg-slate-900' },
          ] : quickActions).map((action, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center space-y-3 group"
            >
              <div className={`w-20 h-20 ${action.color} rounded-[2rem] flex items-center justify-center text-white shadow-lg active:shadow-inner transition-all relative overflow-hidden`}>
                 <action.icon className="w-8 h-8 relative z-10" />
                 <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[9px] font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest text-center leading-tight">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {user?.role !== 'guide' && (
        <>
          {/* Featured Cities - Horizontal Scroll */}
          <div className="mb-16">
             <div className="px-6 mb-6 flex justify-between items-end">
                <h3 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em] italic">Top Havens</h3>
                <button className="text-[8px] font-black uppercase tracking-widest text-primary-500">View All</button>
             </div>
             <div className="flex space-x-6 overflow-x-auto no-scrollbar px-6 pb-4">
                {['Puri', 'Konark', 'Bhubaneswar', 'Cuttack'].map((city, idx) => (
                   <motion.div 
                      key={city}
                      whileHover={{ y: -10 }}
                      className="flex-shrink-0 w-64 h-80 bg-white dark:bg-slate-900 rounded-[3rem] shadow-premium dark:shadow-none overflow-hidden border border-slate-50 dark:border-slate-800 relative group cursor-pointer"
                   >
                      <img src={`https://source.unsplash.com/featured/?${city},temple`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={city} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 dark:from-slate-950 via-transparent to-transparent" />
                      <div className="absolute bottom-8 left-8">
                         <p className="text-[8px] font-black text-primary-500 dark:text-primary-400 uppercase tracking-[0.4em] mb-1">Odisha, IN</p>
                         <p className="text-3xl font-black text-white italic font-serif uppercase tracking-tighter">{city}</p>
                      </div>
                      <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 dark:bg-slate-800/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                         <Compass className="w-5 h-5" />
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>

          {/* Guide Preview Section */}
          <div className="px-6 pb-12">
             <div className="bg-slate-900 dark:bg-primary-900/20 rounded-[3.5rem] p-10 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="relative z-10 space-y-6">
                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-primary-400 uppercase tracking-[0.4em]">Expert Storytellers</p>
                      <h4 className="text-3xl font-black text-white italic font-serif uppercase leading-none">Find your Perfect Guide</h4>
                   </div>
                   <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed max-w-[240px]">Connect with verified locals who know every secret corner of the city.</p>
                   <button 
                     onClick={() => navigate('/guides')}
                     className="bg-white dark:bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-500 hover:text-white transition-all active:scale-95 flex items-center space-x-3"
                   >
                     <span>Explore Guides</span>
                     <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
                
                <div className="absolute -bottom-10 -right-10 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                   <MapPlaceholder className="w-64 h-64" />
                </div>
             </div>
          </div>
        </>
      )}

      {user?.role === 'guide' && (
        <div className="px-6 pb-12">
          <div className="bg-primary-500 rounded-[3.5rem] p-10 relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.4em]">Ready to Roll?</p>
                <h4 className="text-3xl font-black text-slate-900 italic font-serif uppercase leading-none">Go Live to Get Bookings</h4>
              </div>
              <button 
                onClick={() => navigate('/guide')}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all active:scale-95"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MapPlaceholder = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" strokeDasharray="10 10" />
    <path d="M100 60V140M60 100H140" stroke="white" strokeWidth="2" />
    <circle cx="100" cy="100" r="20" fill="white" />
  </svg>
);

export default Home;
