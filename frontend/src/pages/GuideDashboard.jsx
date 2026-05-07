import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
  const [activeBooking, setActiveBooking] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [tripTimer, setTripTimer] = useState(0);
  const [places, setPlaces] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Puri');
  const [showGoLiveConfig, setShowGoLiveConfig] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastEarnings, setLastEarnings] = useState(0);

  // Optimized Stats Calculation
  const stats = useMemo(() => {
    const completed = bookings.filter(b => b.status === 'completed');
    const earnings = completed.reduce((sum, b) => sum + (b.price || 0), 0);
    const pendingCount = bookings.filter(b => b.status === 'searching' || b.status === 'accepted').length;
    
    // Calculate Today's Earnings
    const today = new Date().setHours(0,0,0,0);
    const todayCompleted = completed.filter(b => new Date(b.createdAt).setHours(0,0,0,0) === today);
    const todayEarnings = todayCompleted.reduce((sum, b) => sum + (b.price || 0), 0);

    // Calculate Weekly Growth (Trips in last 7 days)
    const sevenDaysAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
    const weeklyTrips = completed.filter(b => new Date(b.createdAt).getTime() > sevenDaysAgo).length;

    return {
      totalEarnings: earnings,
      todayEarnings: todayEarnings,
      pendingBookings: pendingCount,
      rating: guideData?.rating ? Number(guideData.rating).toFixed(1) : 5.0,
      totalTrips: completed.length,
      weeklyTrips: weeklyTrips
    };
  }, [bookings, guideData]);

  useEffect(() => {
    if (user && user.role === 'guide') {
      fetchDashboardData();
      const socket = getSocket();
      if (socket && user._id) {
        socket.emit('join', { userId: user._id });
      }
    }
  }, [user]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewBooking = (data) => {
      // Always refresh data to update the 'Pending Requests' counter
      fetchDashboardData();
    };

    const handleTripStarted = () => {
      fetchDashboardData();
    };

    const handleBookingCancelled = (data) => {
      alert('The traveler has cancelled this booking request.');
      setActiveBooking(null);
      fetchDashboardData();
    };

    socket.on('new_booking_broadcast', handleNewBooking);
    socket.on('trip_started', handleTripStarted);
    socket.on('booking_cancelled', handleBookingCancelled);
    socket.on('booking_accepted_guide', () => {
      fetchDashboardData();
    });
    
    socket.on('trip_ended_guide', (data) => {
      setLastEarnings(data.price || 0);
      setShowSuccessModal(true);
      setActiveBooking(null);
      fetchDashboardData();
    });

    return () => {
      socket.off('new_booking_broadcast', handleNewBooking);
      socket.off('trip_started');
      socket.off('booking_cancelled');
      socket.off('booking_accepted_guide');
      socket.off('trip_ended_guide');
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

  const fetchPlaces = async () => {
    try {
      const { data } = await api.get('/places');
      setPlaces(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchDashboardData = async (force = false) => {
    if (!force) setLoading(true);

    try {
      console.log('Fetching guide dashboard data...');
      
      // Independent fetchers to avoid blocking
      const fetchBookings = async () => {
        try {
          const res = await api.get('/bookings/guide');
          // Handle both {data: []} and direct []
          const data = res.data?.data || res.data;
          setBookings(Array.isArray(data) ? data : []);
        } catch (err) { console.error('Bookings fetch failed'); }
      };

      const fetchProfile = async () => {
        try {
          const res = await api.get('/guides/profile');
          const data = res.data?.data || res.data;
          if (data) {
            setGuideData(data);
            setIsLive(data.isLive || false);
            setGuideStatus(data.status || 'pending');
            setPackages(data.packages || []);
          }
        } catch (err) { console.error('Profile fetch failed'); }
      };

      await Promise.allSettled([fetchBookings(), fetchProfile()]);

      // Check for active/searching bookings
      setBookings(prev => {
        const current = prev?.find(b => ['accepted', 'ongoing'].includes(b.status));
        setActiveBooking(current || null);
        return prev;
      });

    } catch (error) {
      console.error('Error fetching guide data:', error);
    } finally {
      setLoading(false);
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
        location: !isLive ? (selectedLocation || 'Odisha') : ''
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
      
      {/* 2. ACTIVE SESSION HEADER (OVERHAULED) */}
      <AnimatePresence>
        {activeBooking && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0f172a] rounded-[3rem] p-10 shadow-2xl border border-white/5 space-y-10 mb-12">
             <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 relative">
                      <User size={32} className="text-emerald-500" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#0f172a] animate-pulse" />
                   </div>
                   <div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                         Live Tour Request
                      </span>
                      <h2 className="text-3xl font-black text-white italic tracking-tighter mt-1">{activeBooking.userId?.name || 'Traveler'}</h2>
                      <div className="flex items-center gap-4 mt-2">
                         <a href={`tel:${activeBooking.userId?.mobile}`} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                            <Phone size={14} /> <span className="text-[10px] font-bold uppercase">{activeBooking.userId?.mobile || 'No Mobile'}</span>
                         </a>
                         <button 
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${activeBooking.userLat},${activeBooking.userLng}`, '_blank')}
                            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                         >
                            <Navigation size={14} /> <span className="text-[10px] font-bold uppercase">Location</span>
                         </button>
                         <button 
                            onClick={() => navigate(`/chat/${activeBooking._id}`)}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors ml-2"
                         >
                            <MessageSquare size={14} /> <span className="text-[10px] font-bold uppercase">Chat</span>
                         </button>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                   {activeBooking.status === 'accepted' ? (
                      <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 flex items-center gap-8 shadow-inner">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Enter OTP</p>
                            <input 
                               type="text" value={otpInput} onChange={(e) => setOtpInput(e.target.value)}
                               placeholder="0000" className="bg-transparent border-none text-4xl font-black text-white p-0 focus:ring-0 w-32 tracking-[0.3em] font-mono" 
                            />
                         </div>
                         <button onClick={handleVerifyOtp} className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">Start Trip</button>
                      </div>
                   ) : (
                      <div className="flex items-center gap-10">
                         <div className="text-center space-y-1">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Elapsed Time</p>
                            <p className="text-4xl font-black text-white font-mono tracking-widest">{Math.floor(tripTimer / 60)}:{Math.floor(tripTimer % 60).toString().padStart(2, '0')}</p>
                         </div>
                         <button onClick={handleEndTrip} className="px-12 py-5 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95">Complete Trip</button>
                      </div>
                   )}
                </div>
             </div>

             <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4">
                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-[8px] font-bold text-white/40 uppercase">Destination</p>
                   <p className="text-xs font-black text-white">{activeBooking.location}</p>
                </div>
                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-[8px] font-bold text-white/40 uppercase">Plan</p>
                   <p className="text-xs font-black text-white">{activeBooking.plan}</p>
                </div>
                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-[8px] font-bold text-white/40 uppercase">Language</p>
                   <p className="text-xs font-black text-white">{activeBooking.language}</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
            { label: 'Total Earnings', value: `₹${stats.totalEarnings}`, icon: <DollarSign />, color: 'emerald' },
            { label: "Today's Earnings", value: `₹${stats.todayEarnings}`, icon: <TrendingUp />, color: 'blue' },
            { label: 'Overall Rating', value: Number(stats.rating).toFixed(1), icon: <Star />, color: 'amber' },
            { label: 'Weekly Trips', value: stats.weeklyTrips, icon: <Award />, color: 'rose' }
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

                  <div className="space-y-6">
                     {!isLive && (
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Your Current Location</label>
                           <select 
                              value={selectedLocation}
                              onChange={(e) => setSelectedLocation(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs font-bold text-white focus:ring-2 focus:ring-white/20 transition-all outline-none"
                           >
                              {places.map(p => (
                                 <option key={p._id} value={p.name} className="bg-slate-900 text-white">{p.name}</option>
                              ))}
                              {places.length === 0 && <option disabled>No locations found</option>}
                           </select>
                        </div>
                     )}
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
      {/* 6. SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 text-center space-y-8 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
               <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={48} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter">Trip Completed!</h3>
                  <p className="text-sm font-medium text-slate-400">Great job! The traveler has finished the tour.</p>
               </div>
               
               <div className="bg-emerald-50 dark:bg-emerald-500/5 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-500/10">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Your Earnings</p>
                  <p className="text-5xl font-black text-emerald-500 italic tracking-tighter">₹{lastEarnings}</p>
               </div>

               <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
               >
                  Back to Dashboard
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuideDashboard;
