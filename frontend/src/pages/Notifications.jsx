import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Cloud, Calendar, AlertTriangle, 
  CheckCircle, Clock, Filter, Trash2,
  ChevronRight, Info, ShieldCheck, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.jsx';

const Notifications = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [filter, setFilter] = useState('all'); // all, alerts, bookings, general
  
  // Mock data for demo purposes
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Monsoon Alert: Puri',
      message: 'Heavy rainfall expected in Puri district over the next 48 hours. Traveling to the Sun Temple is advised during morning hours only.',
      time: '2 hours ago',
      unread: true,
      icon: Cloud,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 2,
      type: 'booking',
      title: 'Booking Confirmed!',
      message: 'Your heritage tour with Guide Rajesh has been confirmed for tomorrow at 10:00 AM.',
      time: '5 hours ago',
      unread: true,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 3,
      type: 'general',
      title: 'Profile Verified',
      message: 'Your identity documents have been verified. You can now access premium features.',
      time: '1 day ago',
      unread: false,
      icon: ShieldCheck,
      color: 'text-primary-500',
      bgColor: 'bg-primary-500/10'
    },
    {
       id: 4,
       type: 'alert',
       title: 'High Humidity Warning',
       message: 'Bhubaneswar reaching 85% humidity. Stay hydrated while exploring the temple complexes.',
       time: '1 day ago',
       unread: false,
       icon: Zap,
       color: 'text-orange-500',
       bgColor: 'bg-orange-500/10'
    },
    {
       id: 5,
       type: 'booking',
       title: 'Feedback Required',
       message: 'How was your recent visit to Chilika Lake? Rate your experience to help other travelers.',
       time: '2 days ago',
       unread: false,
       icon: Clock,
       color: 'text-indigo-500',
       bgColor: 'bg-indigo-500/10'
    }
  ]);

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter || (filter === 'alerts' && n.type === 'alert') || (filter === 'bookings' && n.type === 'booking'));

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-slate-950 pb-32 transition-colors duration-300">
      {/* Premium Header */}
      <div className="bg-slate-900 pt-32 pb-48 px-8 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[120px] -ml-24 -mb-24" />
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
               <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10">
                  <Bell className="w-3.5 h-3.5 text-primary-400" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Signal Hub</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic font-serif leading-none uppercase">
                  Notifications
               </h1>
               <p className="text-slate-400 font-bold text-sm tracking-widest uppercase italic max-w-xl">
                  Your personalized stream of weather alerts, booking reports, and system updates.
               </p>
            </div>

            <div className="flex items-center space-x-4">
               <button 
                  onClick={markAllRead}
                  className="px-6 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
               >
                  Mark All Read
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 -mt-24 relative z-20">
         {/* Filter Bar */}
         <div className="flex overflow-x-auto gap-3 pb-6 no-scrollbar mb-4">
            {['all', 'alerts', 'bookings', 'general'].map((f) => (
               <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-lg ${
                     filter === f 
                     ? 'bg-slate-900 dark:bg-primary-600 text-white shadow-primary-500/20' 
                     : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800'
                  }`}
               >
                  {f === 'all' ? 'All Signals' : f.replace(/s$/, '') + ' Hub'}
               </button>
            ))}
         </div>

         {/* Notifications List */}
         <div className="space-y-4">
            <AnimatePresence mode="popLayout">
               {filteredNotifications.length > 0 ? filteredNotifications.map((notification, index) => {
                  const Icon = notification.icon;
                  return (
                     <motion.div
                        layout
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-premium dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-start gap-8 hover:border-primary-500/30 transition-all duration-500 ${notification.unread ? 'ring-2 ring-primary-500/10' : ''}`}
                     >
                        {/* Status Icon */}
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 ${notification.bgColor} ${notification.color} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                           <Icon className="w-7 h-7" />
                        </div>

                        {/* Content */}
                        <div className="flex-grow space-y-2">
                           <div className="flex items-center justify-between">
                              <h3 className={`text-xl font-black italic font-serif tracking-tight ${notification.unread ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                 {notification.title}
                              </h3>
                              <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{notification.time}</span>
                           </div>
                           <p className="text-sm font-bold text-slate-400 dark:text-slate-500 leading-relaxed uppercase tracking-tight line-clamp-2 italic">
                              "{notification.message}"
                           </p>
                           
                           {notification.type === 'booking' && (
                              <div className="pt-4 flex items-center space-x-4">
                                 <button className="text-[9px] font-black text-primary-500 uppercase tracking-[0.2em] border-b border-primary-500/30 pb-0.5 hover:text-primary-600 transition-colors">View Report</button>
                                 <button className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800 pb-0.5">Dismiss</button>
                              </div>
                           )}
                        </div>

                        {/* Action Reveal */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                           <button onClick={() => deleteNotification(notification.id)} className="p-3 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>

                        {/* Unread marker */}
                        {notification.unread && (
                           <div className="absolute top-8 right-8 w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-glow" />
                        )}
                     </motion.div>
                  );
               }) : (
                  <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="py-40 text-center space-y-6 bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800"
                  >
                     <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-200 dark:text-slate-700">
                        <Bell className="w-10 h-10" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter italic font-serif">Clear Horizons</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No signals detected in this hub.</p>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};

export default Notifications;
