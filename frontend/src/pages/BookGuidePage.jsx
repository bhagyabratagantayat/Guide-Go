import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, Clock, CheckCircle, Search, Phone, 
  MessageSquare, ShieldCheck, Star, Timer, 
  CreditCard, X, ArrowRight, Zap, AlertCircle,
  Navigation, Calendar, ChevronLeft, MoreVertical,
  ThumbsUp, DollarSign, Wallet, ArrowUpRight
} from 'lucide-react';
import api from '../utils/api';
import { getSocket } from '../utils/socket';

const ScreenWrapper = ({ children, title, showBack, prevScreen, hideHeader, setScreen }) => (
  <div 
    className="max-w-md lg:mx-auto w-full min-h-[calc(100vh-64px)] lg:min-h-screen flex flex-col bg-white overflow-hidden relative shadow-2xl lg:border-x border-[#dddddd]"
  >
    {!hideHeader && (
      <div className="flex items-center justify-between p-6 bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-[#f7f7f7]">
        <div className="flex items-center gap-4">
          {showBack && <button onClick={() => setScreen(prevScreen)} className="p-2 hover:bg-[#f7f7f7] rounded-full text-[#222222]"><ChevronLeft size={20}/></button>}
          <h2 className="text-base font-bold text-[#222222] tracking-tight">{title || 'Book Guide'}</h2>
        </div>
        <button className="p-2 hover:bg-[#f7f7f7] rounded-full text-[#717171]"><MoreVertical size={20}/></button>
      </div>
    )}
    <div className="flex-1 p-6 flex flex-col">{children}</div>
  </div>
);

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
        const isOld = (new Date() - new Date(latest.createdAt)) > 12 * 60 * 60 * 1000;
        if (isOld && (latest.status === 'searching' || latest.status === 'accepted')) return;

        setCurrentBooking(latest);
        
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
          setScreen('guide-found');
        } else if (latest.status === 'ongoing') {
          setMatchedGuide(latest.guideId);
          setScreen('trip-ongoing');
          
          const startTime = new Date(latest.startedAt).getTime();
          const elapsedSeconds = Math.floor((new Date().getTime() - startTime) / 1000);
          setTripTimer(elapsedSeconds > 0 ? elapsedSeconds : 0);

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

  // --- Handle Incoming Search from Home ---
  const location = useLocation();
  useEffect(() => {
    if (location.state?.searchParams) {
      const { location: loc, plan, language: lang } = location.state.searchParams;
      
      // Map plan to price
      const priceMap = {
        '2 Hours': 499,
        '4 Hours': 899,
        'Full Day': 1499
      };

      setFormData({
        location: loc + ', Odisha',
        plan: plan,
        language: lang,
        price: priceMap[plan] || 499
      });
      
      setScreen('booking-form');
    }
  }, [location.state]);

  // --- Actions ---
  const handleFindGuide = async () => {
    try {
      setScreen('searching');
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
      setUserRating(5);
      setUserComment('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-0 desktop:p-12 font-sans selection:bg-blue-500/30">
      <Helmet>
        <title>Book Guide | GuideGo</title>
        <meta name="description" content="Find and book trusted local guides in Odisha instantly. Personalized smart tours tailored for you." />
      </Helmet>
      {!isSessionRestored ? (
        <div className="min-h-screen lg:min-h-0 lg:h-[800px] flex flex-col items-center justify-center bg-white text-center p-10">
          <div className="w-12 h-12 border-4 border-[#ff385c] border-t-transparent rounded-full animate-spin mb-6" />
          <h3 className="text-xl font-bold text-[#222222]">Restoring Session...</h3>
          <p className="text-[#717171] text-[10px] mt-2 uppercase tracking-[0.2em] font-medium">Checking for active trips</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
        
        {screen === 'select-location' && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper setScreen={setScreen} title="Where to?">
              <div className="relative mb-8">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#222222]" size={18} />
                <input type="text" placeholder="Search destinations" className="w-full bg-white text-[#222222] border border-[#dddddd] rounded-full pl-16 py-4 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/20" />
              </div>
              <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
                 <button className="bg-[#222222] text-white px-6 py-2 rounded-full text-xs font-bold">All</button>
                 <button className="bg-white border border-[#dddddd] text-[#222222] px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap">Guest Favorites</button>
              </div>
              <div className="space-y-6">
                 {['Puri', 'Konark', 'Bhubaneswar'].map(loc => (
                   <div key={loc} onClick={() => { setFormData({...formData, location: loc}); setScreen('booking-form'); }} className="group cursor-pointer">
                      <div className="relative aspect-[4/3] rounded-[1.2rem] overflow-hidden mb-3">
                         <img src={`https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=600&q=80`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt=""/>
                         <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold text-[#222222] flex items-center shadow-sm">
                              <Zap size={10} className="mr-1 text-[#ff385c] fill-current"/> Available Now
                            </span>
                         </div>
                      </div>
                      <div className="px-1">
                         <h4 className="font-bold text-[#222222] text-lg">{loc}, Odisha</h4>
                         <p className="text-sm font-normal text-[#717171]">Heritage & Culture Tour</p>
                      </div>
                   </div>
                 ))}
              </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {screen === 'booking-form' && (
          <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper setScreen={setScreen} title="Plan your trip" showBack prevScreen="select-location">
               <div className="space-y-10 flex-1 flex flex-col">
                  <div className="space-y-4">
                     <label className="text-[11px] font-bold uppercase text-[#222222] ml-1 tracking-[0.1em]">Destination</label>
                     <div className="relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-[#ff385c]" size={18} />
                        <input readOnly value={formData.location} className="w-full bg-white text-[#222222] border border-[#dddddd] rounded-[1.2rem] pl-16 py-5 font-bold focus:outline-none" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[11px] font-bold uppercase text-[#222222] ml-1 tracking-[0.1em]">Select trip duration</label>
                     <div className="space-y-3">
                        {[{l: '2 Hours', p: 499}, {l: '4 Hours', p:899}, {l: 'Full Day', p: 1499}].map(p => (
                          <div key={p.l} onClick={() => setFormData({...formData, plan: p.l, price: p.p})} className={`p-6 rounded-[1.2rem] border-2 transition-all flex justify-between items-center cursor-pointer ${formData.plan === p.l ? 'border-[#222222] bg-[#f7f7f7]' : 'border-[#dddddd] bg-white'}`}>
                             <p className="font-bold text-[#222222]">{p.l}</p><p className="text-xl font-bold text-[#222222]">₹{p.p}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[11px] font-bold uppercase text-[#222222] ml-1 tracking-[0.1em]">Preferred Language</label>
                     <div className="flex gap-3">
                        {['English', 'Hindi', 'Odia'].map(l => (
                          <button key={l} onClick={() => setFormData({...formData, language: l})} className={`flex-1 py-4 border-2 rounded-[0.8rem] font-bold transition-all text-xs ${formData.language === l ? 'bg-[#222222] border-[#222222] text-white' : 'bg-white border-[#dddddd] text-[#222222]'}`}>{l}</button>
                        ))}
                     </div>
                  </div>
                  <div className="mt-auto pt-8 border-t border-[#f7f7f7] space-y-6">
                     <div className="flex items-center justify-between px-2"><p className="text-[11px] font-bold text-[#717171] uppercase tracking-[0.1em]">Total</p><p className="text-4xl font-bold text-[#222222]">₹{formData.price}</p></div>
                     <button onClick={handleFindGuide} className="w-full py-5 bg-[#ff385c] text-white rounded-xl font-bold text-base hover:bg-[#e00b41] transition-all">Confirm & Find Guide</button>
                  </div>
               </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {screen === 'searching' && (
          <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper setScreen={setScreen} hideHeader>
               <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                  <div className="relative mb-12">
                     <div className="w-32 h-32 border-4 border-[#ff385c]/10 rounded-full animate-ping" />
                     <div className="absolute inset-0 flex items-center justify-center"><Search size={32} className="text-[#ff385c]" /></div>
                  </div>
                  <div className="space-y-4 mb-20">
                     <h3 className="text-2xl font-bold text-[#222222]">Finding your expert</h3>
                     <p className="text-[#717171] text-sm">Searching for guides in {formData.location}...</p>
                  </div>
                  <button onClick={handleCancelBooking} className="mt-auto w-full py-4 text-[#222222] font-bold underline text-sm">Cancel Request</button>
               </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {screen === 'guide-found' && (
          <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper setScreen={setScreen} hideHeader>
               <div className="space-y-10 flex-1 flex flex-col py-10">
                  <div className="text-center py-12 bg-emerald-500/5 rounded-[4rem] border border-emerald-500/10">
                     <CheckCircle className="mx-auto text-emerald-500 mb-6" size={80} /><h3 className="text-3xl font-black text-white tracking-tighter">Guide Found!</h3>
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
          </motion.div>
        )}

        {screen === 'call-connect' && (
          <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper setScreen={setScreen} title="Connect" showBack prevScreen="guide-found">
               <div className="space-y-10 flex flex-col flex-1 pb-10">
                  <div className="text-center">
                     <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-40 h-40 rounded-[3rem] mx-auto border-8 border-[#1e293b]" alt=""/>
                     <h3 className="text-4xl font-black text-[#222222] mt-10 tracking-tighter">{matchedGuide?.name}</h3>
                  </div>
                  <div className="p-10 bg-[#f7f7f7] rounded-[3.5rem] text-center border border-[#dddddd]">
                     <p className="text-[10px] font-black uppercase text-[#ff385c] mb-6 tracking-[0.4em]">Meeting Code (OTP)</p>
                     <div className="flex justify-center gap-4">
                        {otp.split('').map((num, i) => (
                          <div key={i} className="w-16 h-20 bg-white border-2 border-[#ff385c]/30 rounded-2xl flex items-center justify-center text-4xl font-black text-[#222222]">{num}</div>
                        ))}
                     </div>
                  </div>
               </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {screen === 'trip-ongoing' && (
          <motion.div key="s7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper setScreen={setScreen} hideHeader>
               <div className="flex-1 space-y-12 flex flex-col py-10">
                  <div className="bg-[#f7f7f7] p-8 rounded-[2.5rem] text-center space-y-6 border border-[#dddddd]">
                     <h2 className="text-4xl font-black text-[#ff385c] tracking-tighter">{formatTime(tripTimer)}</h2>
                     <div className="flex items-center justify-center gap-4 bg-emerald-500/10 w-fit mx-auto px-6 py-2 rounded-full border border-emerald-500/20">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /><span className="text-[10px] font-black uppercase text-emerald-500">Exploring Now</span>
                     </div>
                  </div>
               </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {screen === 'end-trip' && (
          <motion.div key="s8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper setScreen={setScreen} hideHeader>
               <div className="space-y-12 flex-1 flex flex-col py-10">
                  <div className="bg-[#f7f7f7] p-12 rounded-[3rem] text-center space-y-6 border border-[#dddddd]">
                     <h3 className="text-4xl font-bold text-[#222222] tracking-tighter">Trip Ended</h3>
                  </div>
                  <button onClick={() => setScreen('payment')} className="w-full py-5 bg-[#ff385c] text-white rounded-xl font-bold text-base shadow-xl">Proceed to Payment</button>
               </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {screen === 'payment' && (
          <motion.div key="s9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper setScreen={setScreen} hideHeader>
               <div className="space-y-12 flex-1 flex flex-col py-10 text-center">
                  <h2 className="text-6xl font-bold tracking-tighter text-[#222222]">₹{formData.price}</h2>
                  <button onClick={() => setScreen('review')} className="w-full py-5 bg-[#ff385c] text-white rounded-xl font-bold text-base shadow-xl">Complete Payment</button>
               </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {screen === 'review' && (
          <motion.div key="s10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper setScreen={setScreen} hideHeader>
               <div className="space-y-10 flex-1 flex flex-col py-10">
                  <div className="text-center space-y-4">
                    <h3 className="text-4xl font-bold text-[#222222] tracking-tighter">Rate your trip</h3>
                  </div>
                  <div className="flex justify-center gap-3 py-6">
                    {[1, 2, 3, 4, 5].map(star => ( 
                      <Star 
                       key={star} 
                       size={40} 
                       onClick={() => setUserRating(star)}
                       className={`${userRating >= star ? 'text-[#ff385c] fill-current' : 'text-[#dddddd]'} cursor-pointer`} 
                      /> 
                    ))}
                  </div>
                  <div key="feedback-container" className="bg-[#f7f7f7] p-8 rounded-2xl border border-[#dddddd]">
                    <textarea 
                      key="feedback-textarea"
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="How was your experience?" 
                      className="w-full bg-transparent border-none text-[#222222] font-medium p-0 focus:ring-0 h-32" 
                    />
                  </div>
                  <button onClick={handleSubmitReview} className="w-full py-5 bg-[#222222] text-white rounded-xl font-bold text-base shadow-xl">Submit & Finish</button>
               </div>
            </ScreenWrapper>
          </motion.div>
        )}
        
        </AnimatePresence>
      )}
    </div>
  );
};

export default BookGuidePage;
