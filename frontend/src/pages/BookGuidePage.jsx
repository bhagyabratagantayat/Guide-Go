import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, CheckCircle, Search, Phone, 
  MessageSquare, ShieldCheck, Star, Timer, 
  CreditCard, X, ArrowRight, Zap, AlertCircle,
  Navigation, Calendar, ChevronLeft, MoreVertical,
  ThumbsUp, DollarSign, Wallet, ArrowUpRight
} from 'lucide-react';
import api from '../utils/api';
import { getSocket } from '../utils/socket';

const BookGuidePage = () => {
  // Screens: select-location | booking-form | searching | experts-unavailable | guide-found | call-connect | trip-started | trip-ongoing | end-trip | payment | review
  const [screen, setScreen] = useState('select-location'); 
  const [formData, setFormData] = useState({
    location: 'Puri, Odisha',
    plan: '2 Hours',
    language: 'Hindi',
    price: 499
  });

  const [currentBooking, setCurrentBooking] = useState(null);
  const [matchedGuide, setMatchedGuide] = useState(null);
  const [otp, setOtp] = useState('');
  const [tripTimer, setTripTimer] = useState(0);
  const [searchingProgress, setSearchingProgress] = useState(1);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [isSessionRestored, setIsSessionRestored] = useState(false);
  const timerRef = useRef(null);

  // Formatting Timer
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  // Socket setup
  useEffect(() => {
    const socket = getSocket();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (socket && userInfo?._id) {
      socket.emit('join', { userId: userInfo._id });

      socket.on('booking_accepted', (data) => {
        setMatchedGuide(data.guide);
        setOtp(data.otp);
        setScreen('guide-found');
      });

      socket.on('trip_started', () => {
        setScreen('trip-started');
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTripTimer(prev => prev + 1);
        }, 1000);
        setTimeout(() => setScreen('trip-ongoing'), 2000);
      });

      socket.on('trip_ended', () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setScreen('end-trip');
      });
    }

    return () => {
      if (socket) {
        socket.off('booking_accepted');
        socket.off('trip_started');
        socket.off('trip_ended');
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // --- Session Recovery ---
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const { data: bookings } = await api.get('/bookings/user');
        if (bookings.length === 0) return;

        const latest = bookings[0];
        // If the booking is very old (> 12 hours) and still 'searching' or 'accepted', ignore
        const isOld = (new Date() - new Date(latest.createdAt)) > 12 * 60 * 60 * 1000;
        if (isOld && (latest.status === 'searching' || latest.status === 'accepted')) return;

        setCurrentBooking(latest);
        
        // Restore formData from the active booking
        setFormData({
          location: latest.location,
          plan: latest.plan,
          language: latest.language,
          price: latest.price
        });

        if (latest.status === 'searching') {
          setScreen('searching');
        } else if (latest.status === 'accepted') {
          setMatchedGuide(latest.guideId);
          setOtp(latest.otp);
          setScreen('call-connect');
        } else if (latest.status === 'ongoing') {
          setMatchedGuide(latest.guideId);
          setScreen('trip-ongoing');
          
          // Calculate elapsed time
          const startTime = new Date(latest.startedAt).getTime();
          const elapsedSeconds = Math.floor((new Date().getTime() - startTime) / 1000);
          setTripTimer(elapsedSeconds > 0 ? elapsedSeconds : 0);

          // Resume timer
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = setInterval(() => {
            setTripTimer(prev => prev + 1);
          }, 1000);
        } else if (latest.status === 'completed' && !latest.review?.rating) {
          setScreen('end-trip');
          setMatchedGuide(latest.guideId);
        }
      } catch (err) {
        console.error('Session recovery failed:', err);
      } finally {
        setIsSessionRestored(true);
      }
    };

    checkActiveSession();
  }, []);

  // --- Actions ---
  const handleFindGuide = async () => {
    try {
      setScreen('searching');
      // Simulated progress for UI feel
      setSearchingProgress(1);
      setTimeout(() => setSearchingProgress(2), 2000);
      setTimeout(() => setSearchingProgress(3), 4000);

      const res = await api.post('/bookings', {
        location: formData.location,
        plan: formData.plan,
        language: formData.language,
        price: formData.price
      });
      setCurrentBooking(res.data);

      // --- TIMEOUT LOGIC ---
      // If no one accepts in 7 seconds, show fallback
      setTimeout(() => {
        setScreen(currentScreen => {
            if (currentScreen === 'searching') return 'experts-unavailable';
            return currentScreen;
        });
      }, 7000);
    } catch (err) {
      console.error(err);
      setScreen('booking-form');
    }
  };

  const handleCancelBooking = async () => {
    if (currentBooking?._id) {
      try {
        await api.put(`/bookings/${currentBooking._id}/status`, { status: 'cancelled' });
      } catch (err) { console.error(err); }
    }
    setScreen('select-location');
    setMatchedGuide(null);
    setOtp('');
  };
  
  const handleSubmitReview = async () => {
    if (!currentBooking?._id) return;
    try {
      await api.post(`/bookings/${currentBooking._id}/review`, {
        rating: userRating,
        comment: userComment
      });
      setScreen('select-location');
      // Reset after submission
      setUserRating(5);
      setUserComment('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  };

  const ScreenWrapper = ({ children, title, showBack, prevScreen, hideHeader }) => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-md lg:mx-auto w-full min-h-[calc(100vh-64px)] lg:min-h-screen flex flex-col bg-[#0f172a] overflow-hidden relative shadow-2xl lg:border-x border-white/5"
    >
      {!hideHeader && (
        <div className="flex items-center justify-between p-5 lg:p-6 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            {showBack && <button onClick={() => setScreen(prevScreen)} className="p-2 hover:bg-white/5 rounded-xl text-white"><ChevronLeft size={20}/></button>}
            <h2 className="text-base lg:text-lg font-black text-white tracking-tight">{title || 'Book Guide'}</h2>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-xl text-slate-400"><MoreVertical size={20}/></button>
        </div>
      )}
      <div className="flex-1 p-5 lg:p-6 flex flex-col">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#020617] p-0 desktop:p-12 font-sans selection:bg-blue-500/30">
      {/* SESSION LOADING SPLASH */}
      {!isSessionRestored ? (
        <div className="min-h-screen lg:min-h-0 lg:h-[800px] flex flex-col items-center justify-center bg-[#0f172a] text-center p-10">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
          <h3 className="text-xl font-black text-white italic">Restoring Session...</h3>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Checking for active trips</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
        
        {/* 1. SELECT LOCATION */}
        {screen === 'select-location' && (
          <ScreenWrapper title="Explore Amazing Places" key="s1">
            <div className="relative mb-8">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="text" placeholder="Search location" className="w-full bg-[#1e293b] text-white border-none rounded-2xl pl-14 py-4 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-4 mb-8">
               <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">All</button>
               <button className="bg-[#1e293b] text-slate-400 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Popular</button>
               <button className="bg-[#1e293b] text-slate-400 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Near You</button>
            </div>
            <div className="space-y-4">
               {['Puri', 'Konark', 'Bhubaneswar'].map(loc => (
                 <div key={loc} onClick={() => { setFormData({...formData, location: loc}); setScreen('booking-form'); }} className="bg-[#1e293b] flex items-center gap-5 p-4 rounded-[1.5rem] cursor-pointer hover:bg-[#334155] transition-all group border border-white/5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0"><img src={`https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=400&q=80`} className="w-full h-full object-cover" alt=""/></div>
                    <div className="flex-1">
                       <h4 className="font-black text-white text-lg">{loc}</h4>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Odisha</p>
                       <p className="text-[10px] text-emerald-400 font-black mt-2 flex items-center bg-emerald-400/10 w-fit px-2 py-1 rounded-md"><Zap size={10} className="mr-1 fill-current"/> Available Now</p>
                    </div>
                 </div>
               ))}
            </div>
          </ScreenWrapper>
        )}

        {/* 2. BOOKING FORM */}
        {screen === 'booking-form' && (
           <ScreenWrapper title="Book Guide" showBack prevScreen="select-location" key="s2">
              <div className="space-y-10 flex-1 flex flex-col">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-[0.2em]">Location</label>
                    <div className="relative">
                       <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                       <input readOnly value={formData.location} className="w-full bg-[#1e293b] text-white border-none rounded-[1.5rem] pl-16 py-5 font-bold" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-[0.2em]">Select Plan</label>
                    <div className="space-y-3">
                       {[{l: '2 Hours', p: 499}, {l: '4 Hours', p:899}, {l: 'Full Day', p: 1499}].map(p => (
                         <div key={p.l} onClick={() => setFormData({...formData, plan: p.l, price: p.p})} className={`p-6 rounded-[1.8rem] border-2 transition-all flex justify-between items-center cursor-pointer ${formData.plan === p.l ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-[#1e293b]'}`}>
                            <p className="font-black text-white">{p.l}</p><p className="text-xl font-black text-white">₹{p.p}</p>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-[0.2em]">Language</label>
                    <div className="flex gap-3">
                       {['English', 'Hindi', 'Odia'].map(l => (
                         <button key={l} onClick={() => setFormData({...formData, language: l})} className={`flex-1 py-4 rounded-[1.2rem] font-black transition-all uppercase text-[10px] tracking-widest ${formData.language === l ? 'bg-blue-600 text-white' : 'bg-[#1e293b] text-slate-400'}`}>{l}</button>
                       ))}
                    </div>
                 </div>
                 <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                    <div className="flex items-center justify-between px-2"><p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Total</p><p className="text-4xl font-black text-white italic">₹{formData.price}</p></div>
                    <button onClick={handleFindGuide} className="w-full py-6 bg-blue-600 text-white rounded-[1.8rem] font-black uppercase tracking-[0.2em]">Find Guide</button>
                 </div>
              </div>
           </ScreenWrapper>
        )}

        {/* 3. SEARCHING */}
        {screen === 'searching' && (
           <ScreenWrapper hideHeader key="s3">
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                 <div className="relative mb-12 lg:mb-20">
                    <div className="w-40 h-40 lg:w-56 lg:h-56 border-[8px] lg:border-[12px] border-blue-500/10 rounded-full animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center"><Search size={32} className="lg:hidden text-blue-500" /><Search size={48} className="hidden lg:block text-blue-500" /></div>
                 </div>
                 <div className="space-y-4 lg:space-y-6"><h3 className="text-2xl lg:text-4xl font-black text-white italic">Finding Guide</h3><p className="text-slate-400 text-xs lg:text-sm italic">Searching for experts in {formData.location}...</p></div>
                 <div className="w-full mt-20 space-y-8">
                    {[1, 2, 3].map(i => (
                       <div key={i} className="flex items-center gap-5">
                          <div className={`w-3 h-3 rounded-full ${searchingProgress >= i ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${searchingProgress >= i ? 'text-emerald-500' : 'text-slate-600'}`}>{i === 1 ? 'Broadcasting request' : i === 2 ? 'Waiting for response...' : 'Finalizing guide'}</p>
                       </div>
                    ))}
                 </div>

                 <div className="w-full mt-12 grid grid-cols-3 gap-3">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                       <p className="text-[8px] font-black uppercase text-slate-500 mb-1 tracking-widest text-[8px]">Plan</p>
                       <p className="text-[10px] font-black text-white italic">{currentBooking?.plan || formData.plan}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                       <p className="text-[8px] font-black uppercase text-slate-500 mb-1 tracking-widest text-[8px]">Fee</p>
                       <p className="text-[10px] font-black text-white italic">₹{currentBooking?.price || formData.price}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                       <p className="text-[8px] font-black uppercase text-slate-500 mb-1 tracking-widest text-[8px]">Loc</p>
                       <p className="text-[10px] font-black text-white italic truncate">{currentBooking?.location?.split(',')[0] || formData.location?.split(',')[0]}</p>
                    </div>
                 </div>

                 <button onClick={handleCancelBooking} className="mt-20 w-fit px-12 py-4 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
              </div>
           </ScreenWrapper>
        )}

        {/* 3.1 EXPERTS UNAVAILABLE (TIMEOUT FALLBACK) */}
        {screen === 'experts-unavailable' && (
           <ScreenWrapper hideHeader key="s3.1">
               <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-10">
                   <div className="w-32 h-32 bg-amber-500/10 text-amber-500 rounded-[2.5rem] flex items-center justify-center"><AlertCircle size={64}/></div>
                   <div className="space-y-4">
                       <h3 className="text-4xl font-black text-white italic tracking-tighter">No Response</h3>
                       <p className="text-slate-400 text-sm italic font-medium">Our local experts are currently busy or offline. Please try again in 1-2 minutes.</p>
                   </div>
                   <div className="flex flex-col gap-4 w-full h-full justify-end mt-auto">
                       <button onClick={() => setScreen('booking-form')} className="w-full py-6 bg-blue-600 text-white rounded-[1.8rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20">Try Again</button>
                       <button onClick={handleCancelBooking} className="w-full py-4 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">Go Back</button>
                   </div>
               </div>
           </ScreenWrapper>
        )}

        {/* 4. GUIDE FOUND */}
        {screen === 'guide-found' && (
           <ScreenWrapper hideHeader key="s4">
              <div className="space-y-10 flex-1 flex flex-col py-10">
                 <div className="text-center py-12 bg-emerald-500/5 rounded-[4rem] border border-emerald-500/10">
                    <CheckCircle className="mx-auto text-emerald-500 mb-6" size={80} /><h3 className="text-3xl font-black text-white italic tracking-tighter">Guide Found!</h3>
                 </div>
                 <div className="bg-[#1e293b] p-8 rounded-[2.5rem] flex items-center gap-6 border border-white/5">
                    <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-24 h-24 rounded-3xl object-cover" alt=""/>
                    <div className="flex-1 text-white">
                       <h4 className="font-black text-xl">{matchedGuide?.name || 'Local Guide'}</h4>
                       <div className="flex items-center gap-2 mt-2"><Star size={16} className="text-amber-500 fill-current" /><span className="text-xs font-black">4.8 (Verified)</span></div>
                    </div>
                 </div>
                 <button onClick={() => setScreen('call-connect')} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] mt-auto">Connect Now</button>
              </div>
           </ScreenWrapper>
        )}

        {/* 5. CALL + OTP (MERGED) */}
        {screen === 'call-connect' && (
           <ScreenWrapper title="Connect with Guide" showBack prevScreen="guide-found" key="s5">
              <div className="space-y-10 flex flex-col flex-1 pb-10">
                 <div className="text-center">
                    <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-40 h-40 rounded-[3rem] mx-auto border-8 border-[#1e293b]" alt=""/>
                    <h3 className="text-4xl font-black text-white mt-10 italic tracking-tighter">{matchedGuide?.name}</h3>
                    <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mt-3">Ready to start</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => window.location.href=`tel:${matchedGuide?.phone}`} className="flex items-center justify-center gap-3 bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest"><Phone size={20} /> Call</button>
                    <button onClick={() => window.open(`https://wa.me/${matchedGuide?.phone}`)} className="flex items-center justify-center gap-3 bg-[#2563eb] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest"><MessageSquare size={20} /> WhatsApp</button>
                 </div>
                 <div className="p-10 bg-[#1e293b] rounded-[3.5rem] text-center border border-white/5">
                    <p className="text-[10px] font-black uppercase text-blue-500 mb-6 tracking-[0.4em]">Meeting Code (OTP)</p>
                    <div className="flex justify-center gap-4">
                       {otp.split('').map((num, i) => (
                         <div key={i} className="w-16 h-20 bg-[#0f172a] border-2 border-blue-500/30 rounded-2xl flex items-center justify-center text-4xl font-black text-white italic italic">{num}</div>
                       ))}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-8 uppercase tracking-widest italic">Share this with {matchedGuide?.name} to start trip</p>
                  </div>
                  
                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-3 gap-3">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black uppercase text-slate-500 mb-1 tracking-widest">Plan</p>
                        <p className="text-[10px] font-black text-white italic">{formData.plan}</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black uppercase text-slate-500 mb-1 tracking-widest">Fee</p>
                        <p className="text-[10px] font-black text-white italic">₹{formData.price}</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black uppercase text-slate-500 mb-1 tracking-widest">Lang</p>
                        <p className="text-[10px] font-black text-white italic truncate">{formData.language}</p>
                     </div>
                  </div>
                 <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-auto italic">Waiting for guide to verify OTP and start trip...</p>
                 <button onClick={handleCancelBooking} className="w-full py-4 text-red-500 font-black uppercase text-[10px] tracking-widest italic opacity-50">Cancel Trip</button>
              </div>
           </ScreenWrapper>
        )}

        {/* 6. TRIP STARTED (TRANSITION) */}
        {screen === 'trip-started' && (
           <ScreenWrapper hideHeader key="s6">
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-10">
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20"><CheckCircle size={64} /></motion.div>
                 <div className="space-y-4"><h2 className="text-6xl font-black text-white italic tracking-tighter">Trip Live!</h2><p className="text-slate-400 text-xl italic font-medium">Enjoy your adventure</p></div>
              </div>
           </ScreenWrapper>
        )}

        {/* 7. TRIP ONGOING (TIMER) */}
        {screen === 'trip-ongoing' && (
           <ScreenWrapper hideHeader key="s7">
              <div className="flex-1 space-y-12 flex flex-col py-10">
                 <div className="bg-[#1e293b] p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[4rem] text-center space-y-6 lg:space-y-10 border border-white/5">
                    <label className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-[0.5em] block">Duration</label>
                    <h2 className="text-4xl lg:text-6xl font-black text-blue-500 italic font-mono tracking-tighter">{formatTime(tripTimer)}</h2>
                    <div className="flex items-center justify-center gap-4 bg-emerald-500/10 w-fit mx-auto px-6 py-2 rounded-full border border-emerald-500/20">
                       <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /><span className="text-[10px] font-black uppercase text-emerald-500 italic">Exploring Now</span>
                    </div>
                 </div>
                 <div className="bg-[#1e293b] p-10 rounded-[3rem] flex items-center gap-8 border border-white/5">
                     <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-20 h-20 rounded-[1.8rem] object-cover" alt=""/>
                     <div><h4 className="font-black text-2xl text-white italic">{matchedGuide?.name}</h4><p className="text-[11px] font-bold text-slate-500 flex items-center gap-2 mt-2 uppercase tracking-widest"><Navigation size={14} className="text-blue-500" /> Active Trip</p></div>
                  </div>

                  {/* Ongoing Session Details */}
                  <div className="grid grid-cols-3 gap-4">
                     <div className="p-6 bg-[#1e293b] rounded-[2rem] border border-white/5 text-center">
                        <p className="text-[9px] font-black uppercase text-slate-500 mb-1 tracking-widest">Plan</p>
                        <p className="text-sm font-black text-white italic">{currentBooking?.plan || formData.plan}</p>
                     </div>
                     <div className="p-6 bg-[#1e293b] rounded-[2rem] border border-white/5 text-center">
                        <p className="text-[9px] font-black uppercase text-slate-500 mb-1 tracking-widest">Fee</p>
                        <p className="text-sm font-black text-white italic">₹{currentBooking?.price || formData.price}</p>
                     </div>
                     <div className="p-6 bg-[#1e293b] rounded-[2rem] border border-white/5 text-center">
                        <p className="text-[9px] font-black uppercase text-slate-500 mb-1 tracking-widest">Loc</p>
                        <p className="text-sm font-black text-white italic truncate">{currentBooking?.location?.split(',')[0] || formData.location?.split(',')[0]}</p>
                     </div>
                  </div>
                 <div className="grid grid-cols-2 gap-5 mt-auto">
                    <button onClick={() => window.location.href=`tel:${matchedGuide?.phone}`} className="flex items-center justify-center gap-4 bg-white/5 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-widest border border-white/10 text-white"><Phone size={18} /> Support</button>
                    <button className="flex items-center justify-center gap-4 bg-white/5 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-widest border border-white/10 text-white italic opacity-50 cursor-not-allowed">Live Map</button>
                 </div>
              </div>
           </ScreenWrapper>
        )}

        {/* 8. END TRIP (CONFIRMATION) */}
        {screen === 'end-trip' && (
           <ScreenWrapper hideHeader key="s8">
              <div className="space-y-12 flex-1 flex flex-col py-10">
                 <div className="bg-[#1e293b] p-12 rounded-[4rem] text-center space-y-10 border border-white/5">
                    <div className="w-24 h-24 bg-blue-500/20 text-blue-500 rounded-[2.5rem] flex items-center justify-center mx-auto"><Timer size={48} /></div>
                    <h3 className="text-5xl font-black text-white italic tracking-tighter">Trip Ended</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Guide marked trip as completed</p>
                 </div>
                 <div className="p-10 bg-[#1e293b] rounded-[3.5rem] space-y-8 border border-white/5">
                    <div className="flex justify-between items-center text-sm"><span className="font-black text-slate-500 uppercase tracking-widest">Duration</span><span className="font-black text-white text-lg">{formatTime(tripTimer)}</span></div>
                    <div className="pt-8 border-t border-dashed border-slate-800 flex justify-between items-center"><span className="text-2xl font-black italic text-white uppercase italic">Payable</span><span className="text-4xl font-black text-emerald-500">₹{formData.price}</span></div>
                 </div>
                 <button onClick={() => setScreen('payment')} className="w-full py-7 bg-blue-600 text-white rounded-[2rem] font-black text-base uppercase tracking-[0.2em] shadow-2xl mt-auto shadow-blue-500/20">Proceed to Payment</button>
              </div>
           </ScreenWrapper>
        )}

        {/* 9. PAYMENT (DEMO) */}
        {screen === 'payment' && (
           <ScreenWrapper hideHeader key="s9">
              <div className="space-y-12 flex-1 flex flex-col py-10">
                 <div className="text-center space-y-4"><h2 className="text-7xl font-black italic tracking-tighter text-white">₹{formData.price}</h2><p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.5em] italic">Total Due</p></div>
                 <div className="space-y-5">
                    <div className="p-8 bg-blue-600 rounded-[3rem] shadow-2xl flex items-center justify-between">
                       <div className="flex items-center gap-6"><div className="w-16 h-16 bg-white text-blue-600 rounded-[1.8rem] flex items-center justify-center"><DollarSign size={32}/></div><p className="font-black text-xl text-white">Direct Cash</p></div>
                       <div className="w-8 h-8 border-[6px] border-white/20 rounded-full flex items-center justify-center"><div className="w-2.5 h-2.5 bg-white rounded-full" /></div>
                    </div>
                    <div className="p-8 bg-[#1e293b] rounded-[3rem] flex items-center justify-between opacity-50 grayscale">
                       <div className="flex items-center gap-6"><div className="w-16 h-16 bg-white/10 text-slate-500 rounded-[1.8rem] flex items-center justify-center"><Wallet size={32}/></div><p className="font-black text-xl text-slate-500">UPI (Soon)</p></div>
                    </div>
                 </div>
                 <button onClick={() => setScreen('review')} className="w-full py-7 bg-blue-600 text-white rounded-[2rem] font-black text-base uppercase tracking-[0.2em] mt-auto">Complete Demo Payment</button>
              </div>
           </ScreenWrapper>
        )}

        {/* 10. REVIEW */}
        {screen === 'review' && (
           <ScreenWrapper hideHeader key="s10">
              <div className="space-y-12 flex-1 flex flex-col py-10">
                 <div className="text-center space-y-6">
                   <div className="w-32 h-32 bg-emerald-500/20 text-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto"><ThumbsUp size={56}/></div>
                   <h3 className="text-5xl font-black text-white italic tracking-tighter">Awesome!</h3>
                 </div>
                 <div className="flex justify-center gap-4 py-6">
                    {[1, 2, 3, 4, 5].map(star => ( 
                      <Star 
                       key={star} 
                       size={48} 
                       onClick={() => setUserRating(star)}
                       className={`${userRating >= star ? 'text-blue-500 fill-current' : 'text-slate-700'} cursor-pointer transition-all hover:scale-110`} 
                      /> 
                    ))}
                 </div>
                 <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5">
                   <textarea 
                     value={userComment}
                     onChange={(e) => setUserComment(e.target.value)}
                     placeholder={`Any feedback for ${matchedGuide?.name || 'Local Guide'}?`} 
                     className="w-full bg-transparent border-none text-white font-bold p-0 focus:ring-0 placeholder:text-slate-600 italic h-24" 
                   />
                 </div>
                 <button 
                   onClick={handleSubmitReview} 
                   className="w-full py-7 bg-blue-600 text-white rounded-[2rem] font-black text-base uppercase tracking-[0.2em] mt-auto shadow-xl shadow-blue-500/20"
                 >
                   Submit & Finish
                 </button>
              </div>
           </ScreenWrapper>
        )}
      </AnimatePresence>
      )}
    </div>
  );
};

export default BookGuidePage;
