import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Users, UserCheck, MapPin, BookOpen, 
  TrendingUp, DollarSign, ArrowUpRight, 
  Clock, Calendar, MoreHorizontal, ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats');
        if (data.success && data.data) {
          setData(data.data);
          setError(null);
        } else {
          setError('Failed to load statistics');
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setError(error.response?.data?.message || 'Error connecting to server');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary-100 rounded-[2rem]"></div>
        <div className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-[2rem] animate-spin absolute top-0"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[3rem] flex items-center justify-center shadow-premium rotate-6">
         <Clock className="w-10 h-10" />
      </div>
      <div className="text-center space-y-3">
         <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic font-serif leading-none">Transmission Error</h3>
         <p className="subtitle max-w-xs mx-auto italic opacity-60">The data feed has been interrupted. Security protocols are active.</p>
         <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 text-red-600 font-bold text-[10px] uppercase tracking-widest">{error}</div>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="btn-primary px-12 py-5 text-[11px] tracking-[0.4em]"
      >
        RE-INITIALIZE QUANTUM LINK
      </button>
    </div>
  );

  if (!data || !data.stats) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-20 h-20 bg-surface-100 text-slate-300 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
         <BookOpen className="w-10 h-10" />
      </div>
      <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px] italic">Awaiting Telemetry...</p>
    </div>
  );

  const stats = [
    { label: 'Platform Revenue', value: `₹${data.stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-7 h-7" />, color: 'primary', trend: '+14.2%', desc: 'Current Cycle' },
    { label: 'Active Explorers', value: data.stats.totalUsers, icon: <Users className="w-7 h-7" />, color: 'secondary', trend: '+5.8%', desc: 'Total Registrations' },
    { label: 'Verified Guides', value: data.stats.totalGuides, icon: <UserCheck className="w-7 h-7" />, color: 'accent', trend: '+2.4%', desc: 'Approved Experts' },
    { label: 'Completed Journeys', value: data.stats.totalBookings, icon: <MapPin className="w-7 h-7" />, color: 'primary', trend: '+8.1%', desc: 'Global Success' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
         <motion.div variants={item} className="space-y-3">
            <h1 className="text-6xl font-black text-slate-950 tracking-tighter italic font-serif leading-[0.85]">Project Oracle</h1>
            <p className="text-slate-400 font-bold text-[11px] tracking-[0.4em] uppercase flex items-center">
               <Activity className="w-4 h-4 mr-3 text-primary-500 animate-pulse" /> Live Telemetry Dashboard • v4.0.2
            </p>
         </motion.div>
         <motion.div variants={item} className="flex items-center space-x-4">
            <button className="px-8 py-4 bg-white border border-surface-200 text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.25em] hover:bg-slate-900 hover:text-white transition-all shadow-premium">
               Extract Data
            </button>
            <button className="btn-primary px-10 py-4 text-[10px] tracking-[0.3em]">
               NEW RESOURCE
            </button>
         </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((stat) => (
          <motion.div 
            key={stat.label} 
            variants={item}
            whileHover={{ y: -6 }}
            className="bg-white p-10 rounded-[3.5rem] relative overflow-hidden group border border-surface-50 shadow-premium"
          >
            <div className="flex items-center justify-between mb-10">
              <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-12 ${
                stat.color === 'primary' ? 'bg-primary-50 text-primary-600' : 
                stat.color === 'secondary' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {stat.icon}
              </div>
              <div className="flex flex-col items-end">
                 <span className={`text-[10px] font-black px-3 py-1.5 rounded-full flex items-center mb-2 shadow-sm ${
                    stat.color === 'primary' ? 'bg-primary-100 text-primary-700' : 
                    stat.color === 'secondary' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                 }`}>
                   {stat.trend} <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                 </span>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{stat.desc}</span>
              </div>
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
               <h3 className="text-5xl font-black text-slate-950 tracking-tighter italic font-serif leading-none">{stat.value}</h3>
            </div>
            
            {/* Background Decorative Element */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 ${
               stat.color === 'primary' ? 'bg-primary-500' : 
               stat.color === 'secondary' ? 'bg-indigo-500' : 'bg-emerald-500'
            }`}></div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid content from original but improved */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Bookings refined */}
        <motion.div variants={item} className="lg:col-span-2 bg-white rounded-[4rem] overflow-hidden flex flex-col border border-surface-50 shadow-premium">
          <div className="p-12 pb-8 flex items-center justify-between">
            <div className="flex items-center space-x-5">
               <div className="w-14 h-14 bg-slate-950 rounded-[1.5rem] flex items-center justify-center text-white rotate-6">
                  <BookOpen className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic font-serif leading-none">Journal Logs</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Live Transaction Stream</p>
               </div>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1 px-8">
            <table className="w-full text-left mb-8">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="px-8 py-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Explorer</th>
                  <th className="px-8 py-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Anchor</th>
                  <th className="px-8 py-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Locale</th>
                  <th className="px-8 py-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Value</th>
                  <th className="px-8 py-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {data.recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-8">
                       <div className="flex items-center space-x-4">
                          <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-serif font-black text-xs shrink-0 group-hover:rotate-12 transition-transform">
                             {booking.touristId?.name?.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 tracking-tight uppercase">{booking.touristId?.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 tracking-tighter">{booking.touristId?.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                       <p className="text-sm font-bold text-slate-700">{booking.guideId?.name || 'Grand Vizier'}</p>
                    </td>
                    <td className="px-8 py-8">
                       <p className="text-xs font-black text-slate-500 flex items-center opacity-70 italic">
                          <MapPin className="w-3.5 h-3.5 mr-2 text-primary-500" /> {booking.location}
                       </p>
                    </td>
                    <td className="px-8 py-8">
                       <span className="text-xl font-black text-slate-950 tracking-tighter italic">₹{booking.price}</span>
                    </td>
                    <td className="px-8 py-8 text-center">
                       <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] border shadow-sm ${
                         booking.status === 'confirmed' 
                           ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                           : 'bg-primary-50 text-primary-600 border-primary-100'
                       }`}>
                         {booking.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-10 border-t border-surface-50 bg-slate-50/50 flex justify-center mt-auto">
             <button className="text-[10px] font-black text-slate-900 flex items-center hover:translate-x-2 transition-transform uppercase tracking-[0.4em] group">
                Access Deep Archives <ChevronRight className="w-4 h-4 ml-3 text-primary-500 group-hover:scale-125 transition-transform" />
             </button>
          </div>
        </motion.div>

        {/* Improved Sidebar Widgets */}
        <div className="space-y-12">
          {/* Platform Health refinement */}
          <motion.div variants={item} className="bg-slate-950 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-premium group">
            <div className="relative z-10 space-y-10">
               <div className="flex items-center justify-between">
                  <div className="w-16 h-16 bg-white/5 rounded-[1.8rem] flex items-center justify-center text-primary-400 shadow-inner group-hover:bg-primary-500 group-hover:text-slate-950 transition-all border border-white/10">
                     <TrendingUp className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/20">OPERATIONAL</span>
               </div>
               <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tighter italic font-serif leading-none">Global Pulse</h3>
                  <p className="text-slate-500 text-sm font-bold leading-relaxed italic">Engine stability is at <span className="text-white">99.9%</span>. Throughput has peaked 12% above mean.</p>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-slate-600">
                     <span>Thread Load</span>
                     <span className="text-white">24.2%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '24%' }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                     />
                  </div>
               </div>
               <button className="w-full py-5 bg-white text-slate-950 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary-500 transition-all shadow-2xl shadow-white/5">
                 CORE TERMINAL
               </button>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none -mr-32 -mt-32"></div>
          </motion.div>

          {/* Activity Widget refinement */}
          <motion.div variants={item} className="bg-white rounded-[4rem] p-12 border border-surface-50 shadow-premium">
             <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 flex items-center">
               <Clock className="w-4 h-4 mr-4 text-primary-500" /> Recent Chronicles
             </h3>
             <div className="space-y-10 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
               <ActivityItem time="2m" text="Agent Onboarding" user="Karan S." color="bg-primary-500" />
               <ActivityItem time="15m" text="Premium Ritual" user="Riya P." color="bg-indigo-500" />
               <ActivityItem time="1h" text="Grid Calibration" user="System" color="bg-slate-200" />
               <ActivityItem time="3h" text="Vortex Resolution" user="Admins" color="bg-red-400" />
             </div>
             
             <button className="w-full mt-12 py-5 border border-surface-100 text-slate-300 rounded-[1.8rem] font-black text-[9px] uppercase tracking-[0.4em] hover:text-slate-900 hover:border-slate-900 transition-all group">
                Load History <ChevronRight className="w-3 h-3 ml-2 inline group-hover:translate-x-1 transition-transform" />
             </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityItem = ({ time, text, user, color }) => (
  <div className="flex items-start space-x-7 relative z-10">
    <div className={`w-4 h-4 rounded-full ${color} mt-1.5 flex-shrink-0 border-4 border-white shadow-soft`}></div>
    <div className="space-y-1.5 flex-grow">
      <p className="text-[13px] font-black text-slate-800 leading-tight tracking-tight uppercase">{text}</p>
      <div className="flex items-center space-x-3">
        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest cursor-pointer hover:underline">{user}</span>
        <span className="w-1 h-1 bg-slate-100 rounded-full"></span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60 italic">{time} ago</span>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ time, text, user, color }) => (
  <div className="flex items-start space-x-6 relative z-10">
    <div className={`w-4 h-4 rounded-full ${color} mt-1 flex-shrink-0 border-4 border-white shadow-sm`}></div>
    <div className="space-y-1">
      <p className="text-sm font-bold text-slate-800 leading-tight">{text}</p>
      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-black text-primary-600 uppercase tracking-tighter cursor-pointer hover:underline">{user}</span>
        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
        <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{time}</span>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
