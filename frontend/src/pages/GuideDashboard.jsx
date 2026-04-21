import React, { useState, useEffect } from 'react';
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
  Navigation, Phone, MessageSquare, Timer, Zap
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
  const [activeTab, setActiveTab] = useState('bookings');

  // Real-time Booking States
  const [incomingBooking, setIncomingBooking] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [tripTimer, setTripTimer] = useState(0);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    fetchDashboardData();
    const socket = getSocket();
    if (socket && user?._id) {
      socket.emit('join', { userId: user._id });
    }
  }, []);

  // Sync socket listeners with isLive state
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewBooking = (data) => {
      if (isLive) {
        setIncomingBooking(data.booking);
        setCountdown(5);
      }
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
    if (activeBooking?.status === 'ongoing') {
      interval = setInterval(() => {
        setTripTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeBooking]);

  // Countdown for incoming booking
  useEffect(() => {
    let timer;
    if (incomingBooking && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIncomingBooking(null);
    }
    return () => clearInterval(timer);
  }, [incomingBooking, countdown]);

  const fetchDashboardData = async () => {
    try {
      const [{ data: bookingData }, { data: guideData }] = await Promise.all([
        api.get('/bookings/guide'),
        api.get('/guides/profile')
      ]);
      setBookings(bookingData);
      setIsLive(guideData.isLive);
      setGuideStatus(guideData.status);
      
      // Check for active (accepted or ongoing) booking
      const current = bookingData.find(b => ['accepted', 'ongoing'].includes(b.status));
      setActiveBooking(current || null);

      const earnings = bookingData
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.price || 500), 0);
      const pending = bookingData.filter(b => b.status === 'searching').length;
      
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

  const handleAcceptBooking = async () => {
    if (!incomingBooking) return;
    try {
      const res = await api.put(`/bookings/accept/${incomingBooking._id}`);
      setIncomingBooking(null);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept booking');
      setIncomingBooking(null);
    }
  };

  const handleVerifyOtp = async () => {
    if (!activeBooking || otpInput.length < 4) return;
    try {
      await api.post(`/bookings/verify-otp/${activeBooking._id}`, { otpEntered: otpInput });
      setOtpInput('');
      fetchDashboardData();
    } catch (error) {
      alert('Incorrect OTP code');
    }
  };

  const handleEndTrip = async () => {
    if (!activeBooking) return;
    try {
      await api.post(`/bookings/end/${activeBooking._id}`);
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
      const { data } = await api.put('/guides/live', { isLive: !isLive });
      setIsLive(data.isLive);
    } catch (error) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 pb-20 dark:bg-slate-950 min-h-screen">
      
      {/* 1. BROADCAST MODAL */}
      <AnimatePresence>
        {incomingBooking && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm"
          >
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-10 text-center space-y-8 shadow-2xl border border-primary-500/20">
               <div className="w-24 h-24 bg-primary-500/10 text-primary-500 rounded-[2rem] flex items-center justify-center mx-auto animate-bounce"><Zap size={48} className="fill-current"/></div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">New Quest!</h3>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">{incomingBooking.location} • {incomingBooking.plan}</p>
                   <div className="mt-4 bg-primary-100 dark:bg-primary-500/10 text-primary-600 px-4 py-2 rounded-full inline-block">
                      <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                         <Timer size={14}/> Expiring in {countdown}s
                      </p>
                   </div>
                </div>
               <div className="flex flex-col gap-3">
                  <button onClick={handleAcceptBooking} className="w-full py-5 bg-primary-500 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-500/20">Accept Request</button>
                  <button onClick={() => setIncomingBooking(null)} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest">Decline</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ACTIVE SESSION HEADER (If accepted or ongoing) */}
      <AnimatePresence>
        {activeBooking && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-primary-500 rounded-[3rem] p-8 lg:p-12 shadow-2xl shadow-primary-500/20 flex flex-col lg:flex-row items-center justify-between gap-10 mb-12">
             <div className="flex flex-col sm:flex-row items-center gap-8 text-slate-900 text-center sm:text-left">
                <div className="w-24 h-24 bg-white/20 p-2 rounded-[2.5rem]"><img src={activeBooking.userId?.profilePicture || 'https://i.pravatar.cc/150'} className="w-full h-full object-cover rounded-[2rem]" alt=""/></div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{activeBooking.status === 'accepted' ? 'Action Required' : 'Trip in Progress'}</p>
                   <h2 className="text-4xl font-black tracking-tighter italic">{activeBooking.userId?.name}</h2>
                   <p className="text-xs font-bold uppercase tracking-widest">{activeBooking.location} • {activeBooking.plan}</p>
                </div>
             </div>

             <div className="flex shadow-2xl items-center gap-4 bg-white/10 p-4 rounded-[2.5rem] backdrop-blur-md">
                {activeBooking.status === 'accepted' ? (
                  <div className="flex items-center gap-3">
                     <input 
                       type="text" maxLength={4} placeholder="Enter OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)}
                       className="w-32 bg-white/20 border-none rounded-2xl py-3 px-5 text-center font-black text-slate-900 placeholder:text-slate-900/40"
                     />
                     <button onClick={handleVerifyOtp} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest">Verify & Start</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-8 px-6 py-2">
                     <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 opacity-60">Session</p>
                        <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter">{Math.floor(tripTimer / 60)}:{(tripTimer % 60).toString().padStart(2, '0')}</p>
                     </div>
                     <div className="h-10 w-px bg-slate-900/10" />
                     <button onClick={handleEndTrip} className="bg-red-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/20">End Trip</button>
                  </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard UI */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800">
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic">Welcome, {user?.name.split(' ')[0]}</h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Expert Status: {guideStatus}</p>
        </div>
        <button 
          onClick={toggleLive}
          className={`px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-4 transition-all ${isLive ? 'bg-green-500 text-white shadow-2xl' : 'bg-slate-900 dark:bg-primary-600 text-white'}`}
        >
          {isLive ? <Wifi className="animate-pulse"/> : <WifiOff/>}
          {isLive ? 'Online & Searching' : 'Go Online'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard label="Total Earned" value={`₹${stats.totalEarnings}`} icon={<DollarSign />} color="primary" trend="Lifetime" />
        <StatCard label="Rating" value={stats.rating.toFixed(1)} icon={<Star />} color="primary" trend="Verified" />
        <StatCard label="Active Tab" value={activeTab.toUpperCase()} icon={<Activity />} color="secondary" trend="Dashboard" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-10">
         <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-8">Recent Activity</h3>
         <div className="space-y-6">
            {bookings.filter(b => b.status === 'completed').slice(0, 5).map(b => (
                <div key={b._id} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center"><User className="text-slate-400"/></div>
                         <div><p className="font-black text-slate-900 dark:text-white">{b.userId?.name}</p><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{b.location}</p></div>
                      </div>
                      <p className="text-xl font-black text-emerald-500">+₹{b.price}</p>
                   </div>
                   {b.review?.rating && (
                     <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} size={12} className={`${i < b.review.rating ? 'text-amber-500 fill-current' : 'text-slate-600'}`} />
                           ))}
                           <span className="text-[10px] font-black text-slate-400 uppercase ml-2">Traveler Review</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium italic">"{b.review.comment}"</p>
                     </div>
                   )}
                </div>
            ))}
            {bookings.length === 0 && <p className="text-center text-slate-400 py-10 font-bold italic">No completed trips yet</p>}
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, trend }) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-soft">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${color === 'primary' ? 'bg-primary-100 text-primary-600' : 'bg-secondary-100 text-secondary-600'}`}>{icon}</div>
    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h3>
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">↑ {trend}</p>
  </div>
);

export default GuideDashboard;
