import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import useGuideTracking from '../hooks/useGuideTracking';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
  Wifi, WifiOff, MapPin, Calendar, CheckCircle, 
  XCircle, DollarSign, User, Clock, Star, 
  ArrowUpRight, ChevronRight, Activity, Shield
} from 'lucide-react';

const GuideDashboard = () => {
  const { user } = useAuth();
  const { startTracking } = useGuideTracking(user);
  const { darkMode } = useTheme();
  const [isLive, setIsLive] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [guideStatus, setGuideStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalEarnings: 0, pendingBookings: 0, rating: 5.0 });
  const [packages, setPackages] = useState([]);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'packages'

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (isLive && guideStatus === 'approved') {
      const stopTracking = startTracking();
      return () => stopTracking && stopTracking();
    } else if (isLive && guideStatus !== 'approved') {
      setIsLive(false);
    }
  }, [isLive, guideStatus]);

  const fetchDashboardData = async () => {
    try {
      const [{ data: bookingData }, { data: guideData }] = await Promise.all([
        axios.get('/api/bookings/guide'),
        axios.get('/api/guides/profile')
      ]);
      setBookings(bookingData);
      setIsLive(guideData.isLive);
      setGuideStatus(guideData.status);
      
      const earnings = bookingData
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.price || 500), 0);
      const pending = bookingData.filter(b => b.status === 'pending').length;
      
      setStats({ 
        totalEarnings: earnings || 0, 
        pendingBookings: pending,
        rating: guideData.rating || 5.0 
      });
      setPackages(guideData.packages || []);
    } catch (error) {
      console.error('Error fetching guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLive = async () => {
    if (guideStatus !== 'approved') {
      alert('Your profile must be approved by an admin before you can go live.');
      return;
    }
    try {
      const newStatus = !isLive;
      const { data } = await axios.put('/api/guides/live', { 
        isLive: newStatus 
      });
      setIsLive(data.isLive);
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
        <div className="w-16 h-16 border-4 border-primary-100 dark:border-slate-800 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 pb-20 bg-surface-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Welcome & Status Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden"
      >
        <div className="space-y-2 relative z-10">
           <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border mb-2 ${
             guideStatus === 'approved' 
             ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-900/30' 
             : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30'
           }`}>
              <Shield className={`w-3 h-3 ${guideStatus === 'approved' ? 'text-primary-500' : 'text-yellow-600'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${guideStatus === 'approved' ? 'text-primary-600' : 'text-yellow-700'}`}>
                {guideStatus === 'approved' ? 'Verified Local Expert' : `Verification ${guideStatus}`}
              </span>
           </div>
           <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic font-serif">Welcome, {user?.name.split(' ')[0]}</h1>
           <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Ready to showcase your city?</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10">
           <div className="text-right mr-4 hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Status</p>
              <p className={`text-xs font-black uppercase tracking-tighter ${isLive && guideStatus === 'approved' ? 'text-green-500' : 'text-slate-400 dark:text-slate-600'}`}>
                 {guideStatus !== 'approved' ? 'Locked' : isLive ? 'Broadcasting Location' : 'Standing By'}
              </p>
           </div>
           <button 
             onClick={toggleLive}
             className={`w-full sm:w-auto flex items-center justify-center space-x-3 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-500 group relative overflow-hidden ${
               isLive 
               ? 'bg-green-500 text-white shadow-2xl shadow-green-500/30' 
               : 'bg-slate-900 dark:bg-primary-600 text-white hover:bg-slate-800 dark:hover:bg-primary-700'
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
        <StatCard label="Net Earnings" value={`₹${stats.totalEarnings.toLocaleString()}`} icon={<DollarSign />} color="primary" trend="Overall earnings" />
        <StatCard label="Pending Requests" value={stats.pendingBookings} icon={<Clock />} color="secondary" trend={stats.pendingBookings > 0 ? "Needs attention" : "Everything caught up"} />
        <StatCard label="Expert Rating" value={stats.rating.toFixed(1)} icon={<Star />} color="primary" trend="Member since '24" />
      </div>

      {/* Dashboard Tabs */}
      <div className="flex items-center space-x-6 border-b border-slate-100 dark:border-slate-800 pb-2">
         <button 
           onClick={() => setActiveTab('bookings')}
           className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === 'bookings' ? 'text-primary-500' : 'text-slate-400'}`}
         >
           Booking Requests
           {activeTab === 'bookings' && <motion.div layoutId="tabPill" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-full" />}
         </button>
         <button 
           onClick={() => setActiveTab('packages')}
           className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === 'packages' ? 'text-primary-500' : 'text-slate-400'}`}
         >
           Tour Packages
           {activeTab === 'packages' && <motion.div layoutId="tabPill" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-full" />}
         </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'bookings' ? (
          <motion.div 
            key="bookings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-premium dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-800 dark:border-slate-700">
                     <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Tour Requests</h3>
               </div>
               <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-5 py-2 rounded-full border border-slate-100 dark:border-slate-800">
                  <Activity className="w-3 h-3 text-secondary-500" />
                  <span className="uppercase tracking-[0.2em]">{bookings.length} Total Logs</span>
               </div>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {bookings.length === 0 ? (
                <div className="p-32 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 dark:text-slate-700">
                     <User className="w-10 h-10" />
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] text-sm">Waiting for new travelers...</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                   {bookings.map((booking, idx) => (
                     <div 
                       key={booking._id} 
                       className="p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group"
                     >
                       {/* Booking content remains same */}
                       <div className="flex items-center space-x-8">
                         <div className="relative">
                            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-600 overflow-hidden shadow-inner group-hover:shadow-soft transition-shadow">
                               <User className="w-10 h-10 opacity-40" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                         </div>
                         <div className="space-y-2">
                           <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">{booking.userId?.name || 'Curious Traveler'}</h4>
                           <div className="flex flex-wrap items-center gap-4">
                              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center">
                                 <MapPin className="w-4 h-4 mr-1 text-primary-500" /> {booking.location}
                              </p>
                              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 flex items-center uppercase tracking-widest bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700 shadow-soft dark:shadow-none">
                                 <Calendar className="w-3 h-3 mr-1.5 text-secondary-500" /> {new Date(booking.bookingTime).toLocaleDateString()}
                              </p>
                              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 flex items-center uppercase tracking-widest bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700 shadow-soft dark:shadow-none">
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
                               className="flex-1 sm:flex-none px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                             >
                               <XCircle className="w-4 h-4 mr-2" /> Decline
                             </button>
                           </div>
                         ) : (
                           <div className="flex items-center space-x-3">
                              <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-soft dark:shadow-none ${
                                booking.status === 'confirmed' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30' : 
                                booking.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                              }`}>
                                {booking.status}
                              </span>
                              <button className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 rounded-xl hover:text-primary-500 transition-colors shadow-soft dark:shadow-none">
                                 <ChevronRight className="w-4 h-4" />
                              </button>
                           </div>
                         )}
                       </div>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="packages"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
             {packages.map((pkg, idx) => (
               <div 
                 key={idx}
                 className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-soft"
               >
                  <div className="flex justify-between items-start mb-6">
                     <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {pkg.duration}
                     </div>
                     <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic">₹{pkg.price}</h4>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3 tracking-tight">{pkg.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 italic">{pkg.description}</p>
                  <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                     Edit Package
                  </button>
               </div>
             ))}
             <button className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12 flex flex-col items-center justify-center space-y-4 group transition-all">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-premium">
                   <ChevronRight className="w-8 h-8 rotate-45" />
                </div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Create New Package</span>
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden group"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${
       color === 'primary' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400'
    }`}>
      {React.cloneElement(icon, { className: "w-6 h-6" })}
    </div>
    <div className="space-y-1">
       <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
       <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h3>
       <div className="flex items-center space-x-2 pt-2">
          <ArrowUpRight className="w-3 h-3 text-green-500" />
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">{trend}</span>
       </div>
    </div>
    
    {/* Subtle Glow */}
    <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-10 ${
       color === 'primary' ? 'bg-primary-500' : 'bg-secondary-500'
    }`}></div>
  </motion.div>
);

export default GuideDashboard;
