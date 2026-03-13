import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import useGuideTracking from '../hooks/useGuideTracking';
import { 
  Wifi, WifiOff, MapPin, Calendar, CheckCircle, 
  XCircle, DollarSign, User, Clock, Star, 
  ArrowUpRight, ChevronRight, Activity, Shield
} from 'lucide-react';

const GuideDashboard = () => {
  const { user } = useAuth();
  const { startTracking } = useGuideTracking(user);
  const [isLive, setIsLive] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalEarnings: 0, pendingBookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (isLive) {
      const stopTracking = startTracking();
      return () => stopTracking && stopTracking();
    }
  }, [isLive]);

  const fetchDashboardData = async () => {
    try {
      const [{ data: bookingData }, { data: guideData }] = await Promise.all([
        axios.get('/api/bookings/guide'),
        axios.get('/api/guides/profile')
      ]);
      setBookings(bookingData);
      setIsLive(guideData.isLive);
      
      const earnings = bookingData
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.price, 0);
      const pending = bookingData.filter(b => b.status === 'pending').length;
      
      setStats({ totalEarnings: earnings, pendingBookings: pending });
    } catch (error) {
      console.error('Error fetching guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLive = async () => {
    try {
      const newStatus = !isLive;
      const { data } = await axios.put('/api/guides/live', { 
        isLive: newStatus 
      });
      setIsLive(data.isLive);
      // alert replaced with custom toast-like feedback logic if needed, but keeping for logic
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleBooking = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}`, { status });
      fetchDashboardData();
    } catch (error) {
      alert('Failed to update booking status');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-100 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 pb-20">
      {/* Welcome & Status Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-10 rounded-[3rem] shadow-soft border border-slate-100 relative overflow-hidden"
      >
        <div className="space-y-2 relative z-10">
           <div className="inline-flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full border border-primary-100 mb-2">
              <Shield className="w-3 h-3 text-primary-500" />
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Verified Local Expert</span>
           </div>
           <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic font-serif">Welcome, {user?.name.split(' ')[0]}</h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Ready to showcase your city?</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10">
           <div className="text-right mr-4 hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
              <p className={`text-xs font-black uppercase tracking-tighter ${isLive ? 'text-green-500' : 'text-slate-400'}`}>
                 {isLive ? 'Broadcasting Location' : 'Standing By'}
              </p>
           </div>
           <button 
             onClick={toggleLive}
             className={`w-full sm:w-auto flex items-center justify-center space-x-3 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-500 group relative overflow-hidden ${
               isLive 
               ? 'bg-green-500 text-white shadow-2xl shadow-green-500/30' 
               : 'bg-slate-900 text-white hover:bg-slate-800'
             }`}
           >
             <AnimatePresence mode="wait">
                <motion.div
                  key={isLive ? 'live' : 'offline'}
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                   {isLive ? <Wifi className="w-5 h-5 animate-pulse" /> : <WifiOff className="w-5 h-5" />}
                </motion.div>
             </AnimatePresence>
             <span>{isLive ? 'Go Offline' : 'Go Live Now'}</span>
             
             {isLive && (
               <motion.div 
                 layoutId="livePulse"
                 className="absolute inset-0 bg-white/20 pointer-none"
                 animate={{ opacity: [0.1, 0.3, 0.1] }}
                 transition={{ duration: 2, repeat: Infinity }}
               />
             )}
           </button>
        </div>
        
        {/* Abstract Background Curve */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-500/5 -skew-x-12 translate-x-1/2 rounded-l-full"></div>
      </motion.div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard label="Net Earnings" value={`₹${stats.totalEarnings.toLocaleString()}`} icon={<DollarSign />} color="primary" trend="+₹1.2k today" />
        <StatCard label="Pending Requests" value={stats.pendingBookings} icon={<Clock />} color="secondary" trend="Action required" />
        <StatCard label="Expert Rating" value="4.8" icon={<Star />} color="primary" trend="Top 5% in Odisha" />
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-[3.5rem] shadow-premium border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                 <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Tour Requests</h3>
           </div>
           <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 bg-slate-50 px-5 py-2 rounded-full border border-slate-100">
              <Activity className="w-3 h-3 text-secondary-500" />
              <span className="uppercase tracking-[0.2em]">{bookings.length} Total Logs</span>
           </div>
        </div>

        <div className="divide-y divide-slate-50">
          {bookings.length === 0 ? (
            <div className="p-32 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200">
                 <User className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm">Waiting for new travelers...</p>
            </div>
          ) : (
            <AnimatePresence>
               {bookings.map((booking, idx) => (
                 <motion.div 
                   key={booking._id} 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className="p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-slate-50/50 transition-all group"
                 >
                   <div className="flex items-center space-x-8">
                     <div className="relative">
                        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shadow-inner group-hover:shadow-soft transition-shadow">
                           <User className="w-10 h-10 opacity-40" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                     </div>
                     <div className="space-y-2">
                       <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic">{booking.touristId?.name || 'Curious Traveler'}</h4>
                       <div className="flex flex-wrap items-center gap-4">
                          <p className="text-xs font-bold text-slate-500 flex items-center">
                             <MapPin className="w-4 h-4 mr-1 text-primary-500" /> {booking.location}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 flex items-center uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-soft">
                             <Calendar className="w-3 h-3 mr-1.5 text-secondary-500" /> {new Date(booking.bookingTime).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 flex items-center uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-soft">
                             <Clock className="w-3 h-3 mr-1.5 text-primary-500" /> {new Date(booking.bookingTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                     {booking.status === 'pending' ? (
                       <div className="flex items-center space-x-3 w-full sm:w-auto">
                         <button 
                           onClick={() => handleBooking(booking._id, 'confirmed')}
                           className="flex-1 sm:flex-none px-8 py-4 bg-primary-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center justify-center shadow-xl shadow-primary-500/20 group/btn"
                         >
                           <CheckCircle className="w-4 h-4 mr-2 group-hover/btn:scale-120 transition-transform" /> Confirm
                         </button>
                         <button 
                           onClick={() => handleBooking(booking._id, 'rejected')}
                           className="flex-1 sm:flex-none px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                         >
                           <XCircle className="w-4 h-4 mr-2" /> Decline
                         </button>
                       </div>
                     ) : (
                       <div className="flex items-center space-x-3">
                          <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-soft ${
                            booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 
                            booking.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {booking.status}
                          </span>
                          <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-primary-500 transition-colors shadow-soft">
                             <ChevronRight className="w-4 h-4" />
                          </button>
                       </div>
                     )}
                   </div>
                 </motion.div>
               ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-slate-100 relative overflow-hidden group"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${
       color === 'primary' ? 'bg-primary-100 text-primary-600' : 'bg-secondary-100 text-secondary-600'
    }`}>
      {React.cloneElement(icon, { className: "w-6 h-6" })}
    </div>
    <div className="space-y-1">
       <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
       <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
       <div className="flex items-center space-x-2 pt-2">
          <ArrowUpRight className="w-3 h-3 text-green-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{trend}</span>
       </div>
    </div>
    
    {/* Subtle Glow */}
    <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-10 ${
       color === 'primary' ? 'bg-primary-500' : 'bg-secondary-500'
    }`}></div>
  </motion.div>
);

export default GuideDashboard;
