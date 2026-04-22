import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, WifiOff, MapPin, Calendar, CheckCircle, 
  XCircle, DollarSign, User, Clock, Star, 
  ArrowUpRight, ChevronRight, Activity, Shield,
  Navigation, Phone, MessageSquare, Timer, Zap,
  Settings, Languages, Bell, ChevronLeft, Send,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import api from '../utils/api';
import useGuideTracking from '../hooks/useGuideTracking';
import { getSocket } from '../utils/socket';

const GuideDashboard = () => {
  const { user } = useAuth();
  const { startTracking } = useGuideTracking(user);
  const { 
    tripStatus, setTripStatus, activeBooking, setActiveBooking, 
    matchedGuide, setMatchedGuide, tripTimer, resetBooking 
  } = useBooking();

  // Local UI State
  const [isLive, setIsLive] = useState(false);
  const [guideStatus, setGuideStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalEarnings: 0, rating: 5.0 });
  const [allBookings, setAllBookings] = useState([]);
  
  // New Booking Request State
  const [incomingBooking, setIncomingBooking] = useState(null);
  const [countdown, setCountdown] = useState(30);
  
  // OTP and Session
  const [otpInput, setOtpInput] = useState('');
  const [showLiveSetup, setShowLiveSetup] = useState(false);
  const [setupData, setSetupData] = useState({
    areas: [],
    languages: []
  });

  useEffect(() => {
    fetchDashboardData();
    const socket = getSocket();
    if (socket && user?._id) {
      socket.emit('join', { userId: user._id });
    }
  }, []);

  // Socket Listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('new_booking_broadcast', (data) => {
      if (isLive && !activeBooking) {
        setIncomingBooking(data.booking);
        setCountdown(30);
      }
    });

    return () => socket.off('new_booking_broadcast');
  }, [isLive, activeBooking]);

  // Request Timer
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
      setAllBookings(bData);
      setIsLive(gData.isLive);
      setGuideStatus(gData.status);
      setStats({
        totalEarnings: bData.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0),
        rating: gData.rating || 5.0
      });
      setSetupData({
        areas: gData.serviceAreas || [],
        languages: gData.languages || []
      });
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!incomingBooking) return;
    try {
      const { data } = await api.put(`/bookings/accept/${incomingBooking._id}`);
      setIncomingBooking(null);
      setActiveBooking(data.booking);
      setTripStatus('MATCHED');
      setMatchedGuide(data.booking.userId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept');
      setIncomingBooking(null);
    }
  };

  const handleVerifyOtp = async () => {
    if (!activeBooking || otpInput.length < 4) return;
    try {
      await api.post(`/bookings/verify-otp/${activeBooking._id}`, { otpEntered: otpInput });
      setOtpInput('');
      setTripStatus('ONGOING');
      fetchDashboardData();
    } catch (err) {
      alert('Invalid OTP code');
    }
  };

  const handleEndTrip = async () => {
    if (!activeBooking || !window.confirm('End trip now?')) return;
    try {
      await api.post(`/bookings/end/${activeBooking._id}`);
      setTripStatus('COMPLETED');
      resetBooking();
      fetchDashboardData();
    } catch (err) {
      alert('Failed to end trip');
    }
  };

  const toggleOnline = async () => {
    if (guideStatus !== 'approved') return alert('Verification pending');
    if (!isLive) return setShowLiveSetup(true);
    
    try {
      const { data } = await api.put('/guides/live', { isLive: false });
      setIsLive(false);
    } catch (err) { alert('Failed to go offline'); }
  };

  const saveLiveSetup = async () => {
    try {
      await api.put('/guides/profile', { 
        serviceAreas: setupData.areas, 
        languages: setupData.languages,
        isLive: true 
      });
      setIsLive(true);
      setShowLiveSetup(false);
    } catch (err) { alert('Failed to go live'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]"><Zap className="text-[#ff385c] animate-bounce" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#f7f7f7] pb-24">
      
      {/* 1. GO LIVE SETUP MODAL */}
      <AnimatePresence>
        {showLiveSetup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-end lg:items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-t-[3rem] lg:rounded-[3rem] p-10 space-y-8 shadow-2xl">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-[#222222] tracking-tighter italic">Go Live Settings</h3>
                  <button onClick={() => setShowLiveSetup(false)} className="p-2 bg-[#f7f7f7] rounded-full"><XCircle size={20}/></button>
               </div>
               <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717171]">Current Language</label>
                    <div className="flex gap-2">
                       {['Hindi', 'English', 'Odia'].map(l => (
                         <button key={l} onClick={() => setSetupData({...setupData, languages: [l]})} className={`px-4 py-2 rounded-xl font-bold text-xs ${setupData.languages.includes(l) ? 'bg-[#222222] text-white' : 'bg-[#f7f7f7] text-[#717171]'}`}>{l}</button>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#717171]">Primary Service Area</label>
                    <input type="text" placeholder="e.g. Puri, Konark" value={setupData.areas[0] || ''} onChange={(e) => setSetupData({...setupData, areas: [e.target.value]})} className="w-full p-4 bg-[#f7f7f7] border-none rounded-2xl font-bold text-sm" />
                  </div>
               </div>
               <button onClick={saveLiveSetup} className="w-full py-5 bg-[#ff385c] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/20">Confirm & Go Online</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. INCOMING REQUEST POPUP */}
      <AnimatePresence>
        {incomingBooking && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-x-6 bottom-32 z-[100] max-w-md mx-auto">
             <div className="bg-[#1e293b] text-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/5">
                <div className="flex items-center gap-6 mb-8">
                   <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center animate-pulse"><Zap size={32} className="text-[#ff385c] fill-current"/></div>
                   <div>
                      <h4 className="text-2xl font-black tracking-tighter italic">New Request!</h4>
                      <p className="text-xs font-bold text-[#717171] uppercase tracking-widest mt-1">Traveler: {incomingBooking.userId?.name || 'Explorer'}</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Plan</p>
                      <p className="font-bold">{incomingBooking.plan}</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Price</p>
                      <p className="font-black text-emerald-400">₹{incomingBooking.price}</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <button onClick={handleAccept} className="flex-1 py-4 bg-[#ff385c] text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl">Accept ({countdown}s)</button>
                   <button onClick={() => setIncomingBooking(null)} className="px-6 py-4 bg-white/5 text-white rounded-xl font-bold text-xs uppercase">Reject</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. ACTIVE SESSION OVERLAY (Sticky Top) */}
      <AnimatePresence>
        {activeBooking && (
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="sticky top-0 z-[150] bg-[#1e293b] p-6 lg:p-10 shadow-2xl border-b border-white/5">
             <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                   <img src={activeBooking.userId?.profilePicture || 'https://i.pravatar.cc/150'} className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover" alt=""/>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">{activeBooking.status === 'ongoing' ? 'Session Live' : 'Waiting for OTP'}</p>
                      <h4 className="text-2xl font-black text-white tracking-tighter italic">{activeBooking.userId?.name}</h4>
                      <p className="text-xs font-bold text-[#717171] uppercase tracking-widest">{activeBooking.location} • {activeBooking.plan}</p>
                   </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                   {activeBooking.status === 'accepted' ? (
                     <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
                        <input type="text" maxLength={4} value={otpInput} onChange={(e) => setOtpInput(e.target.value)} placeholder="User OTP" className="w-24 bg-transparent border-none text-white font-black text-center focus:ring-0 placeholder:opacity-20" />
                        <button onClick={handleVerifyOtp} className="px-6 py-3 bg-[#ff385c] text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Verify</button>
                     </div>
                   ) : (
                     <div className="flex items-center gap-8 px-6 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <div className="text-center">
                           <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Timer</p>
                           <p className="text-2xl font-black text-white font-mono tracking-tighter italic">{Math.floor(tripTimer / 60)}:{(tripTimer % 60).toString().padStart(2, '0')}</p>
                        </div>
                        <button onClick={handleEndTrip} className="px-8 py-3 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">End Trip</button>
                     </div>
                   )}
                   <a href={`tel:${activeBooking.userId?.phone}`} className="p-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all shadow-xl"><Phone size={20}/></a>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-10 rounded-[3rem] border border-[#dddddd] shadow-soft">
          <div className="space-y-2">
             <h1 className="text-4xl font-black text-[#222222] tracking-tighter italic">Ahoy, {user?.name.split(' ')[0]}!</h1>
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-[#717171]'}`}/>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#717171]">Status: {isLive ? 'Broadcasting Presence' : 'Disconnected'}</p>
             </div>
          </div>
          <button 
            onClick={toggleOnline}
            className={`px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-4 transition-all shadow-2xl ${isLive ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-[#222222] text-white shadow-black/20'}`}
          >
            {isLive ? <Wifi size={20} className="animate-pulse"/> : <WifiOff size={20}/>}
            {isLive ? 'Go Offline' : 'Go Online'}
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <StatCard label="Trip Earnings" value={`₹${stats.totalEarnings}`} icon={<DollarSign/>} trend="Life" />
           <StatCard label="Avg Rating" value={stats.rating.toFixed(1)} icon={<Star/>} trend="Expert" />
           <StatCard label="Total Trips" value={allBookings.length} icon={<Clock/>} trend="History" />
        </div>

        {/* RECENT HISTORY */}
        <div className="bg-white rounded-[3.5rem] border border-[#dddddd] p-10 shadow-soft overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-[#222222] tracking-tighter italic italic">Recent Activity</h3>
              <Activity className="text-[#dddddd]" size={24}/>
           </div>
           <div className="space-y-6">
              {allBookings.filter(b => b.status === 'completed').slice(0, 5).map(b => (
                <div key={b._id} className="p-6 bg-[#f7f7f7] rounded-3xl border border-[#dddddd] flex items-center justify-between group hover:border-[#222222] transition-colors">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#dddddd]"><User className="text-[#717171]"/></div>
                      <div>
                         <p className="font-black text-[#222222] text-lg">{b.userId?.name}</p>
                         <p className="text-[10px] text-[#717171] font-bold uppercase tracking-widest">{new Date(b.createdAt).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xl font-black text-emerald-600">+₹{b.price}</p>
                      <div className="flex gap-0.5 mt-1">
                         {[...Array(5)].map((_, i) => <Star key={i} size={8} className={`${i < (b.review?.rating || 0) ? 'text-amber-400 fill-current' : 'text-[#dddddd]'}`}/>)}
                      </div>
                   </div>
                </div>
              ))}
              {allBookings.length === 0 && <p className="text-center text-[#717171] py-10 font-bold italic">No completed trips yet</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, trend }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-[#dddddd] shadow-soft group hover:border-[#222222] transition-all">
    <div className="w-16 h-16 bg-[#f7f7f7] rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-[#222222] group-hover:text-white transition-all">{icon}</div>
    <p className="text-[10px] font-black text-[#717171] uppercase tracking-widest mb-2">{label}</p>
    <h3 className="text-5xl font-black text-[#222222] tracking-tighter italic">{value}</h3>
    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#f7f7f7] rounded-full text-[9px] font-black uppercase tracking-widest text-[#717171]">
       <Zap size={10}/> {trend}
    </div>
  </div>
);

export default GuideDashboard;
