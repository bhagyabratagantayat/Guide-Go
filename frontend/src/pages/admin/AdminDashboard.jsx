import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Users, UserCheck, MapPin, BookOpen, 
  TrendingUp, DollarSign, ArrowUpRight, 
  Clock, Calendar, MoreHorizontal, ChevronRight, Activity,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <div className="w-16 h-16 border-4 border-primary-100 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center shadow-soft">
         <Clock className="w-10 h-10" />
      </div>
      <div className="text-center space-y-3">
         <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic font-serif leading-none">Connection Error</h3>
         <p className="subtitle max-w-xs mx-auto italic opacity-60">The data feed has been interrupted. Checking system status.</p>
         <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 text-red-600 font-bold text-[10px] uppercase tracking-widest">{error}</div>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="btn-primary px-8 py-3"
      >
        RETRY CONNECTION
      </button>
    </div>
  );

  if (!data || !data.stats) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-[2rem] flex items-center justify-center mb-6">
         <BookOpen className="w-10 h-10" />
      </div>
      <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px] italic">Fetching Data...</p>
    </div>
  );

  const stats = [
    { label: 'Platform Revenue', value: `₹${data.stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-6 h-6" />, color: 'primary', trend: '+14.2%', desc: 'Current Month' },
    { label: 'Active Explorers', value: data.stats.totalUsers, icon: <Users className="w-6 h-6" />, color: 'secondary', trend: '+5.8%', desc: 'Across India' },
    { label: 'Verified Guides', value: data.stats.totalGuides, icon: <UserCheck className="w-6 h-6" />, color: 'primary', trend: '+2.4%', desc: 'Overall' },
    { label: 'Guide Approvals', value: data.stats.pendingGuides || 0, icon: <ShieldCheck className="w-6 h-6" />, color: 'secondary', trend: 'Action Required', desc: 'Pending Review', path: '/admin/guides' },
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
      className="space-y-10 pb-20"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
         <motion.div variants={item} className="space-y-3">
            <h1 className="text-6xl font-black text-slate-950 tracking-tighter italic font-serif leading-[0.85]">Guide Admin</h1>
            <p className="text-slate-400 font-bold text-[11px] tracking-[0.4em] uppercase flex items-center">
               <Activity className="w-4 h-4 mr-3 text-primary-500 animate-pulse" /> Live Admin Dashboard • v4.0.2
            </p>
         </motion.div>
         <motion.div variants={item} className="flex items-center space-x-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:border-primary-500 transition-colors shadow-soft">
               Download Report
            </button>
            <button className="btn-primary px-5 py-2.5 text-xs">
               Manage Pro-Plans
            </button>
         </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.path || '#'}>
            <motion.div 
              variants={item}
              whileHover={{ y: -5 }}
              className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group h-full"
            >
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                  stat.color === 'primary' ? 'bg-primary-100 text-primary-600' : 'bg-secondary-100 text-secondary-600'
                }`}>
                  {stat.icon}
                </div>
                <div className="flex flex-col items-end">
                   <span className={`text-[10px] font-black px-2 py-1 rounded-full flex items-center mb-1 ${
                     stat.label === 'Guide Approvals' && stat.value > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                   }`}>
                     {stat.trend} <ArrowUpRight className="w-3 h-3 ml-1" />
                   </span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.desc}</span>
                </div>
              </div>
              <div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              </div>
              
              {/* Background Accent */}
              <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-20 ${
                 stat.color === 'primary' ? 'bg-primary-500' : 'bg-secondary-500'
              }`}></div>
            </motion.div>
          </Link>
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
                  <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic font-serif leading-none">System Logs</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Live Transaction Stream</p>
               </div>
               <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Recent Bookings</h3>
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
               <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          <div className="overflow-x-auto flex-1 px-4">
            <table className="w-full text-left mb-8">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Traveler</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guide</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Value</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-6 font-bold text-slate-800">
                       <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black shrink-0">
                             {booking.userId?.name?.charAt(0)}
                          </div>
                          <span className="text-sm">{booking.userId?.name}</span>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <p className="text-sm font-medium text-slate-600">{booking.guideId?.name || 'Local Expert'}</p>
                    </td>
                    <td className="px-6 py-6">
                       <p className="text-sm font-medium text-slate-600 flex items-center opacity-80 italic">
                          <MapPin className="w-3 h-3 mr-1 text-primary-500" /> {booking.location}
                       </p>
                    </td>
                    <td className="px-6 py-6">
                       <span className="text-sm font-black text-slate-900 tracking-tighter">₹{booking.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-6 text-right sm:text-left">
                       <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border ${
                         booking.status === 'confirmed' 
                           ? 'bg-green-50 text-green-600 border-green-100' 
                           : 'bg-orange-50 text-orange-600 border-orange-100'
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
                View All Transaction History <ChevronRight className="w-4 h-4 ml-3 text-primary-500 group-hover:scale-125 transition-transform" />
             </button>
          </div>
        </motion.div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Quick Stats Widget */}
          <motion.div variants={item} className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6">
               <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
               </div>
               <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tighter italic font-serif leading-none">System Health</h3>
                  <p className="text-slate-500 text-sm font-bold leading-relaxed italic">Engine stability is at <span className="text-white">99.9%</span>. Throughput has peaked 12% above mean.</p>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-slate-600">
                     <span>CPU Load</span>
                     <span className="text-white">24.2%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '24%' }}
                        className="h-full bg-primary-500"
                     />
                  </div>
               </div>
               <button className="w-full py-5 bg-white text-slate-950 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary-500 transition-all shadow-2xl shadow-white/5">
                 ADMIN CONSOLE
               </button>
            </div>
            
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>

          {/* Activity Widget refinement */}
          <motion.div variants={item} className="bg-white rounded-[4rem] p-12 border border-surface-50 shadow-premium">
             <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 flex items-center">
               <Clock className="w-4 h-4 mr-4 text-primary-500" /> Recent Activity
             </h3>
             <div className="space-y-10 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
               <ActivityItem time="2m" text="New Guide Registered" user="Karan S." color="bg-primary-500" />
               <ActivityItem time="15m" text="Premium Booking" user="Riya P." color="bg-indigo-500" />
               <ActivityItem time="1h" text="System Optimization" user="System" color="bg-slate-200" />
               <ActivityItem time="3h" text="Server Update" user="Admins" color="bg-red-400" />
             </div>
             
             <button className="w-full mt-10 py-3 border border-slate-100 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-slate-900 hover:border-slate-200 transition-all">
                Load More History
             </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

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
