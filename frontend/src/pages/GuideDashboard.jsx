import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import useGuideTracking from '../hooks/useGuideTracking';
import { useTheme } from '../context/ThemeContext.jsx';
import { getSocket } from '../utils/socket';
import { 
  Wifi, WifiOff, MapPin, Calendar, CheckCircle, 
  XCircle, DollarSign, User, Clock, Star, 
  ArrowUpRight, ChevronRight, Activity, Shield,
  Navigation, Phone, MessageSquare, Timer, Zap,
  TrendingUp, Users, Award, Briefcase
} from 'lucide-react';

const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 pb-20 animate-pulse">
    <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-[3rem]" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-[2rem]" />)}
    </div>
    <div className="h-[500px] bg-slate-100 dark:bg-slate-800 rounded-[3rem]" />
  </div>
);

const GuideDashboard = () => {
  const { user } = useAuth();
  const { startTracking } = useGuideTracking(user);
  const { darkMode } = useTheme();
  const [isLive, setIsLive] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [guideStatus, setGuideStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [guideData, setGuideData] = useState(null);

  // Real-time Booking States
  const [incomingBooking, setIncomingBooking] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [tripTimer, setTripTimer] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [selectedAreas, setSelectedAreas] = useState(['Puri', 'Bhubaneswar']);
  const [selectedLangs, setSelectedLangs] = useState(['Hindi', 'English']);
  const [showGoLiveConfig, setShowGoLiveConfig] = useState(false);

  // Optimized Stats Calculation
  const stats = useMemo(() => {
    const completed = bookings.filter(b => b.status === 'completed');
    const earnings = completed.reduce((sum, b) => sum + (b.price || 0), 0);
    const pendingCount = bookings.filter(b => b.status === 'searching').length;
    return {
      totalEarnings: earnings,
      pendingBookings: pendingCount,
      rating: guideData?.rating || 5.0,
      totalTrips: completed.length
    };
  }, [bookings, guideData]);

  useEffect(() => {
    fetchDashboardData();
    const socket = getSocket();
    if (socket && user?._id) {
      socket.emit('join', { userId: user._id });
    }
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewBooking = (data) => {
      // Show popup ONLY if live
      if (isLive) {
        setIncomingBooking(data.booking);
        setCountdown(60); // 60 seconds to respond
      }
      // Always refresh data to update the 'Pending Requests' counter
      fetchDashboardData();
    };

    const handleTripStarted = () => {
      setIncomingBooking(null);
      fetchDashboardData();
    };

    socket.on('new_booking_broadcast', handleNewBooking);
    socket.on('trip_started', handleTripStarted);

    return () => {
      socket.off('new_booking_broadcast', handleNewBooking);
      socket.off('trip_started', handleTripStarted);
    };
  }, [isLive]);

  useEffect(() => {
    if (isLive && guideStatus === 'approved') {
      const stopTracking = startTracking();
      return () => stopTracking && stopTracking();
    } else {
      setIsLive(false);
    }
  }, [isLive, guideStatus]);

  useEffect(() => {
    let interval;
    if (activeBooking?.status === 'ongoing' && activeBooking.startedAt) {
      const calculateElapsed = () => {
        const start = new Date(activeBooking.startedAt).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - start) / 1000);
        setTripTimer(elapsed > 0 ? elapsed : 0);
      };
      
      calculateElapsed();
      interval = setInterval(calculateElapsed, 1000);
    }
    return () => clearInterval(interval);
  }, [activeBooking]);

  useEffect(() => {
    let timer;
    if (incomingBooking && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      setIncomingBooking(null);
    }
    return () => clearInterval(timer);
  }, [incomingBooking, countdown]);

  const fetchDashboardData = async () => {
    try {
      const [{ data: bData }, { data: gData }] = await Promise.all([
        api.get('/bookings/guide'),
        api.get('/guides/profile')
      ]);
      setBookings(bData);
      setGuideData(gData);
      setIsLive(gData.isLive);
      setGuideStatus(gData.status);
      setPackages(gData.packages || []);
      
      const current = bData.find(b => ['accepted', 'ongoing'].includes(b.status));
      setActiveBooking(current || null);
    } catch (error) {
      console.error('Error fetching guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async () => {
    if (!incomingBooking) return;
    try {
      const { data } = await api.put(`/bookings/accept/${incomingBooking._id}`);
      setIncomingBooking(null);
      setActiveBooking({
        ...incomingBooking,
        status: 'accepted',
        otp: data.otp
      });
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept booking');
      setIncomingBooking(null);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await api.post(`/bookings/verify-otp/${activeBooking._id}`, { otpEntered: otpInput });
      fetchDashboardData();
      setOtpInput('');
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid OTP';
      alert(msg);
    }
  };

  const handleEndTrip = async () => {
    if (!window.confirm('Are you sure you want to end this trip?')) return;
    try {
      await api.post(`/bookings/end/${activeBooking._id}`);
      setActiveBooking(null);
      fetchDashboardData();
    } catch (error) {
      alert('Failed to end trip');
    }
  };

  const toggleLive = async () => {
    if (guideStatus !== 'approved') {
      alert('Verification pending by admin.');
      return;
    }
    try {
      const { data } = await api.put('/guides/live', { 
        isLive: !isLive,
        location: !isLive ? (selectedAreas?.[0] || 'Odisha') : ''
      });
      setIsLive(data.isLive);
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Update failed';
      const code = error.response?.status || '500';
      alert(`Status Update Failed (${code}): ${msg}`);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 pb-20 dark:bg-slate-950 min-h-screen">
      
      {/* 1. NEW BOOKING REQUEST POPUP */}
      <AnimatePresence>
        {incomingBooking && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-6 right-6 z-[100] lg:left-auto lg:right-10 lg:w-[400px]"
          >
            <div className="bg-[#0f172a] rounded-[2.5rem] p-8 border border-white/10 shadow-2xl space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter">New Request!</h3>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Incoming tour request nearby</p>
                  </div>
                  <div className="w-12 h-12 bg-[#ff385c]/10 rounded-full flex items-center justify-center text-[#ff385c]">
                    <span className="font-black text-xs">{countdown}s</span>
                  </div>
               </div>

               <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">User</span><span className="text-xs font-bold text-white">Traveler</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Location</span><span className="text-xs font-bold text-white">{incomingBooking.location}</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Plan</span><span className="text-xs font-bold text-white">{incomingBooking.plan}</span></div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5"><span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Price</span><span className="text-lg font-black text-emerald-500">₹{incomingBooking.price}</span></div>
               </div>

               <div className="flex gap-3">
                  <button onClick={() => setIncomingBooking(null)} className="flex-1 py-4 bg-white/5 text-white/60 rounded-2xl font-bold text-xs uppercase tracking-widest border border-white/10">Reject</button>
                  <button onClick={handleAcceptBooking} className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20">Accept</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ACTIVE SESSION HEADER */}
      <AnimatePresence>
        {activeBooking && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0f172a] rounded-[3rem] p-8 lg:p-12 shadow-2xl border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-10 mb-12">
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                   <Activity size={32} className="text-emerald-500 animate-pulse" />
                </div>
                <div>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Live Session
                   </span>
                   <h2 className="text-3xl font-black text-white italic tracking-tighter mt-1">Tour in {activeBooking.location}</h2>
                </div>
             </div>

             <div className="flex flex-col md:flex-row items-center gap-6">
                {activeBooking.status === 'accepted' ? (
                   <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-center gap-6">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Enter Trip OTP</p>
                         <input 
                            type="text" value={otpInput} onChange={(e) => setOtpInput(e.target.value)}
                            placeholder="0000" className="bg-transparent border-none text-2xl font-black text-white p-0 focus:ring-0 w-24 tracking-[0.2em]" 
                         />
                      </div>
                      <button onClick={handleVerifyOtp} className="px-8 py-3 bg-white text-[#0f172a] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Start Trip</button>
                   </div>
                ) : (
                   <div className="flex items-center gap-10">
                      <div className="text-center space-y-1">
                         <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Elapsed Time</p>
                         <p className="text-3xl font-black text-white font-mono">{Math.floor(tripTimer / 60)}:{Math.floor(tripTimer % 60).toString().padStart(2, '0')}</p>
                      </div>
                      <button onClick={handleEndTrip} className="px-10 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all">Complete Trip</button>
                   </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
            { label: 'Total Earnings', value: `₹${stats.totalEarnings}`, icon: <DollarSign />, color: 'emerald' },
            { label: 'Pending Requests', value: stats.pendingBookings, icon: <Activity />, color: 'amber' },
            { label: 'Overall Rating', value: stats.rating, icon: <Star />, color: 'blue' },
            { label: 'Total Trips', value: stats.totalTrips, icon: <Award />, color: 'rose' }
         ].map((s, i) => (
            <motion.div 
               key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
               className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4"
            >
               <div className={`w-12 h-12 bg-${s.color}-50 dark:bg-${s.color}-500/10 text-${s.color}-500 rounded-2xl flex items-center justify-center`}>
                  {s.icon}
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 italic">{s.value}</p>
               </div>
            </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* 4. MAIN ACTION: LIVE TOGGLE */}
         <div className="lg:col-span-1">
            <div className={`p-10 rounded-[3rem] transition-all duration-500 shadow-2xl relative overflow-hidden ${isLive ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white/40'}`}>
               {isLive && <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute inset-0 bg-white rounded-full scale-150" />}
               
               <div className="relative z-10 space-y-10">
                  <div className="flex justify-between items-start">
                     <div>
                        <h3 className="text-3xl font-black italic tracking-tighter text-white">Go Live</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isLive ? 'text-white/60' : 'text-white/20'}`}>
                           {isLive ? 'You are visible to travelers' : 'Appear offline to others'}
                        </p>
                     </div>
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${isLive ? 'bg-white/20 border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/20'}`}>
                        {isLive ? <Wifi size={24} /> : <WifiOff size={24} />}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <button 
                        onClick={toggleLive}
                        className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl ${isLive ? 'bg-white text-emerald-500' : 'bg-emerald-500 text-white'}`}
                     >
                        {isLive ? 'Stop Session' : 'Start Session'}
                     </button>
                     <p className="text-[9px] text-center font-bold uppercase tracking-widest opacity-40">Verification Status: {guideStatus}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* 5. RECENT BOOKINGS TABLE */}
         <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden h-full">
               <div className="p-8 lg:p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">Recent Activities</h3>
                  <div className="flex gap-2">
                     {['bookings', 'reviews'].map(tab => (
                        <button 
                           key={tab} onClick={() => setActiveTab(tab)}
                           className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                        >
                           {tab}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="p-4 lg:p-8">
                  {activeTab === 'bookings' ? (
                     <div className="space-y-4">
                        {bookings.slice(0, 5).map((b, i) => (
                           <motion.div 
                              key={b._id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                              className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-xl"
                           >
                              <div className="flex items-center gap-6">
                                 <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                    <Calendar size={20} />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{b.location}</h4>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-sm font-black text-slate-900 dark:text-white italic">₹{b.price}</p>
                                 <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${b.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{b.status}</span>
                              </div>
                           </motion.div>
                        ))}
                        {bookings.length === 0 && <p className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">No activities yet</p>}
                     </div>
                  ) : (
                     <div className="space-y-4">
                        {bookings.filter(b => b.review).slice(0, 5).map((b, i) => (
                           <motion.div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl space-y-3">
                              <div className="flex justify-between items-center">
                                 <div className="flex text-amber-500"><Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /></div>
                                 <span className="text-[10px] font-bold text-slate-400">{new Date(b.review.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic">"{b.review.comment}"</p>
                           </motion.div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
