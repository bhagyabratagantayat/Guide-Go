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
  const [countdown, setCountdown] = useState(30);
  const [selectedAreas, setSelectedAreas] = useState(['Puri', 'Bhubaneswar']);
  const [selectedLangs, setSelectedLangs] = useState(['Hindi', 'English']);
  const [showGoLiveConfig, setShowGoLiveConfig] = useState(false);

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
      const { data } = await api.put(`/bookings/accept/${incomingBooking._id}`);
      
      // Update local state immediately for instant feedback
      setIncomingBooking(null);
      setActiveBooking({
        ...incomingBooking,
        status: 'accepted',
        otp: data.otp // OTP comes from acceptance response
      });
      
      // Re-fetch in background to ensure all data (like User object) is populated
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept booking');
      setIncomingBooking(null);
    }
  };

  const handleVerifyOtp = async () => {
    if (!activeBooking || otpInput.length < 4) return;
    try {
      const { data } = await api.post(`/bookings/verify-otp/${activeBooking._id}`, { otpEntered: otpInput });
      
      // Immediate update
      setActiveBooking(prev => ({ ...prev, status: 'ongoing', startedAt: data.startedAt }));
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
      
      // Immediate update
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
      console.error('Toggle Live Error:', error.response?.data);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

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
             <div className="flex flex-col sm:flex-row items-center gap-8 text-white text-center sm:text-left">
                <div className="relative">
                  <img src={activeBooking.userId?.profilePicture || 'https://i.pravatar.cc/150'} className="w-24 h-24 rounded-[2rem] object-cover border-4 border-white/10" alt=""/>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-[#0f172a] rounded-full" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{activeBooking.status === 'accepted' ? 'Action Required' : 'Trip in Progress'}</p>
                   <h2 className="text-4xl font-black tracking-tighter italic">{activeBooking.userId?.name}</h2>
                   <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <MapPin size={12} className="text-[#ff385c]"/>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/60">{activeBooking.location} • {activeBooking.plan}</p>
                   </div>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row shadow-2xl items-center gap-4 bg-white/5 p-4 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                {activeBooking.status === 'accepted' ? (
                  <>
                     <a href={`tel:${activeBooking.userId?.phone || '+919876543210'}`} className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                        <Phone size={20} fill="currentColor"/>
                     </a>
                     <div className="flex items-center gap-3">
                        <input 
                          type="text" maxLength={4} placeholder="Enter OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)}
                          className="w-32 bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-center font-black text-white placeholder:text-white/20"
                        />
                        <button onClick={handleVerifyOtp} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20">Verify & Start</button>
                     </div>
                  </>
                ) : (
                  <div className="flex items-center gap-8 px-6 py-2">
                     <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Live Duration</p>
                        <p className="text-3xl font-black text-white font-mono tracking-tighter">{Math.floor(tripTimer / 60)}:{(tripTimer % 60).toString().padStart(2, '0')}</p>
                     </div>
                     <div className="h-10 w-px bg-white/10" />
                     <button onClick={handleEndTrip} className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-500/20">End Trip</button>
                  </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard UI */}
      <div className="bg-[#0f172a] p-10 rounded-[3rem] border border-white/5 space-y-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-1">
             <h1 className="text-4xl font-black text-white tracking-tighter italic">Welcome, {user?.name.split(' ')[0]}</h1>
          </div>
          <button 
            onClick={() => isLive ? toggleLive() : setShowGoLiveConfig(true)}
            className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-4 transition-all ${isLive ? 'bg-emerald-500 text-white shadow-2xl' : 'bg-white text-slate-900'}`}
          >
            {isLive ? <Wifi className="animate-pulse"/> : <WifiOff/>}
            {isLive ? 'You are Online' : 'Go Online'}
          </button>
        </div>

        {/* GO LIVE CONFIG (Area Selection) */}
        {showGoLiveConfig && !isLive && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-10 border-t border-white/5 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Select Service Areas</p>
                  <div className="flex flex-wrap gap-2">
                     {['Puri', 'Konark', 'Bhubaneswar', 'Cuttack'].map(area => (
                       <button 
                        key={area} onClick={() => setSelectedAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-bold border transition-all ${selectedAreas.includes(area) ? 'bg-[#ff385c] border-[#ff385c] text-white' : 'bg-transparent border-white/10 text-white/60'}`}
                       >
                          {area}
                       </button>
                     ))}
                  </div>
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Service Languages</p>
                  <div className="flex flex-wrap gap-2">
                     {['Hindi', 'English', 'Odia'].map(lang => (
                       <button 
                        key={lang} onClick={() => setSelectedLangs(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-bold border transition-all ${selectedLangs.includes(lang) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-transparent border-white/10 text-white/60'}`}
                       >
                          {lang}
                       </button>
                     ))}
                  </div>
               </div>
            </div>
            <button onClick={() => { toggleLive(); setShowGoLiveConfig(false); }} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs">Confirm & Start Earning</button>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard label="Total Earned" value={`₹${stats.totalEarnings}`} icon={<DollarSign />} color="primary" trend="Lifetime" />
        <StatCard label="Rating" value={stats.rating.toFixed(1)} icon={<Star />} color="primary" trend="Verified" />
        <StatCard label="Active Tab" value={activeTab.toUpperCase()} icon={<Activity />} color="secondary" trend="Dashboard" />
      </div>

      <div className="bg-[#0f172a] rounded-[3.5rem] border border-white/5 p-10">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-white tracking-tighter uppercase italic">Recent Trips</h3>
            <button className="text-[10px] font-black uppercase text-blue-500 tracking-widest">View All</button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.filter(b => b.status === 'completed').slice(0, 4).map(b => (
                <div key={b._id} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-[#1e293b] rounded-2xl flex items-center justify-center text-white/20"><User size={24}/></div>
                         <div>
                            <p className="font-black text-white italic">{b.userId?.name}</p>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{new Date(b.createdAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-black text-emerald-500">₹{b.price}</p>
                         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{b.plan}</p>
                      </div>
                   </div>
                   {b.review?.rating && (
                     <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} size={10} className={`${i < b.review.rating ? 'text-amber-500 fill-current' : 'text-white/10'}`} />
                           ))}
                        </div>
                        <p className="text-[10px] text-white/40 font-bold italic truncate ml-4">"{b.review.comment}"</p>
                     </div>
                   )}
                </div>
            ))}
            {bookings.length === 0 && <p className="text-center text-white/20 py-10 font-bold italic w-full">No completed trips yet</p>}
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, trend }) => (
  <div className="bg-[#0f172a] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
    <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center mb-6 ${color === 'primary' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>{icon}</div>
    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">{label}</p>
    <h3 className="text-4xl font-black text-white tracking-tighter italic">{value}</h3>
    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-4 flex items-center gap-2">
       <ArrowUpRight size={14} className="text-emerald-500"/> {trend}
    </p>
  </div>
);

export default GuideDashboard;
