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
import { useBooking, TRIP_STATUS } from '../context/BookingContext';

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
  const { 
    tripStatus, setTripStatus, bookingData, matchedGuide, otp, 
    tripTimer, isRestoring, startSearching, cancelBooking, resetBooking 
  } = useBooking();

  const [screen, setScreen] = useState('select-location'); 
  const [formData, setFormData] = useState({
    location: 'Puri, Odisha',
    plan: '2 Hours',
    language: 'Hindi',
    price: 499
  });

  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const timeoutRef = useRef(null);

  // Formatting Timer
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  // --- Fetch Real Places ---
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const { data } = await api.get('/places');
        setPlaces(data);
      } catch (err) {
        console.error('Failed to fetch places:', err);
      } finally {
        setLoadingPlaces(false);
      }
    };
    fetchPlaces();
  }, []);

  // --- Sync Screen with Global tripStatus ---
  useEffect(() => {
    if (tripStatus === TRIP_STATUS.SEARCHING) setScreen('searching');
    else if (tripStatus === TRIP_STATUS.MATCHED) {
      setScreen('call-connect');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
    else if (tripStatus === TRIP_STATUS.ONGOING) setScreen('trip-ongoing');
    else if (tripStatus === TRIP_STATUS.COMPLETED) setScreen('end-trip');
    else if (tripStatus === TRIP_STATUS.IDLE && screen !== 'booking-form') {
      setScreen('select-location');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [tripStatus]);

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
      await startSearching({
        location: formData.location,
        plan: formData.plan,
        language: formData.language,
        price: formData.price
      });

      // Timeout for experts unavailable
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setTripStatus(currentStatus => {
          if (currentStatus === TRIP_STATUS.SEARCHING) {
            setScreen('experts-unavailable');
            return currentStatus;
          }
          return currentStatus;
        });
      }, 30000); // 30s timeout

    } catch (err) {
      alert('Search failed. Please try again.');
    }
  };

  const handleCancelBooking = async () => {
    await cancelBooking();
    setScreen('select-location');
  };
  
  const handleSubmitReview = async () => {
    if (!bookingData?._id) return;
    try {
      await api.post(`/bookings/${bookingData._id}/review`, {
        rating: userRating,
        comment: userComment
      });
      resetBooking();
      setScreen('select-location');
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
      {isRestoring ? (
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
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#717171]" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations" 
                  className="w-full bg-[#f7f7f7] text-[#222222] border-none rounded-full pl-16 py-4 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/20" 
                />
              </div>
              <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
                 <button className="bg-[#222222] text-white px-6 py-2 rounded-full text-xs font-bold">All</button>
                 <button className="bg-white border border-[#dddddd] text-[#222222] px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap">Service Areas</button>
              </div>
              <div className="grid gap-6">
                 {places.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(place => (
                   <div key={place._id} onClick={() => { setFormData({...formData, location: place.name}); setScreen('booking-form'); }} className="group cursor-pointer">
                      <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-3 shadow-md">
                         <img src={place.image || `https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=600&q=80`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt=""/>
                         <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-white/95 backdrop-blur rounded-full text-[10px] font-black text-[#222222] flex items-center shadow-lg">
                              <Zap size={10} className="mr-1.5 text-[#ff385c] fill-current"/> ONLINE NOW
                            </span>
                         </div>
                      </div>
                      <div className="px-2">
                         <h4 className="font-bold text-[#222222] text-lg tracking-tight">{place.name}, Odisha</h4>
                         <p className="text-sm font-medium text-[#717171]">{place.description || 'Heritage & Culture Tour'}</p>
                      </div>
                   </div>
                 ))}
                 {!loadingPlaces && places.length === 0 && <p className="text-center py-10 text-[#717171]">No locations found</p>}
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
               <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#0f172a]">
                  <div className="relative mb-16">
                     <div className="w-48 h-48 border border-white/5 rounded-full animate-ping" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-[#ff385c]/20 rounded-full flex items-center justify-center animate-pulse">
                          <Search size={40} className="text-[#ff385c]" />
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4 mb-20">
                     <h3 className="text-3xl font-black text-white tracking-tighter">Finding Experts</h3>
                     <p className="text-white/40 text-sm font-medium">Connecting you with active guides in {formData.location}...</p>
                  </div>
                  <button onClick={handleCancelBooking} className="mt-auto w-full py-5 bg-white/5 text-white/60 rounded-2xl font-bold text-sm border border-white/10 hover:bg-white/10 transition-all">Cancel Request</button>
               </div>
            </ScreenWrapper>
          </motion.div>
        )}


        {screen === 'call-connect' && (
          <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
            <ScreenWrapper setScreen={setScreen} hideHeader>
               <div className="flex-1 flex flex-col bg-[#0f172a] p-10 space-y-8 min-h-full">
                  <div className="text-center space-y-6">
                     <div className="relative w-32 h-32 mx-auto">
                        <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-full h-full rounded-full object-cover border-4 border-[#3b82f6]" alt=""/>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-[#0f172a] rounded-full" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter">{matchedGuide?.name || 'Your Guide'}</h3>
                        <div className="flex items-center justify-center gap-2 mt-1 text-white/60">
                           <Star size={14} className="text-amber-500 fill-current" />
                           <span className="text-xs font-black">4.8 (312 Reviews)</span>
                        </div>
                     </div>
                  </div>

                  {/* COMMUNICATION BUTTONS */}
                  <div className="grid grid-cols-3 gap-4 px-4">
                     <a href={`tel:${matchedGuide?.phone || '+919876543210'}`} className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"><Phone size={24} fill="currentColor"/></div>
                        <span className="text-[10px] font-black text-white/60 uppercase">Call</span>
                     </a>
                     <a href={`https://wa.me/${matchedGuide?.phone?.replace(/\D/g, '') || '919876543210'}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20"><MessageSquare size={24} fill="currentColor"/></div>
                        <span className="text-[10px] font-black text-white/60 uppercase">WhatsApp</span>
                     </a>
                     <a href={`sms:${matchedGuide?.phone || '+919876543210'}`} className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-[#3b82f6] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/20"><Zap size={24} fill="currentColor"/></div>
                        <span className="text-[10px] font-black text-white/60 uppercase">SMS</span>
                     </a>
                  </div>
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-center space-y-4">
                     <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Your Verification OTP</p>
                     <div className="flex justify-center gap-3">
                        {String(otp || '----').split('').map((digit, i) => (
                          <div key={i} className="w-12 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl font-black text-white border border-white/5">{digit}</div>
                        ))}
                     </div>
                     <p className="text-[10px] font-bold text-[#ff385c] mt-4 uppercase tracking-widest italic">Share this code with your guide to start</p>
                  </div>

                  <button onClick={handleCancelBooking} className="w-full py-5 text-rose-500/80 font-black uppercase tracking-widest text-[10px] border border-rose-500/20 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 transition-all mt-auto">Cancel Booking</button>
               </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {screen === 'trip-ongoing' && (
          <motion.div key="s7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper setScreen={setScreen} hideHeader>
               <div className="flex-1 space-y-10 flex flex-col py-10 bg-[#0f172a] -m-6 p-6">
                  <div className="bg-white/5 p-10 rounded-[3rem] text-center space-y-6 border border-white/10 shadow-2xl">
                     <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.4em]">Live Trip Session</p>
                     <h2 className="text-5xl font-black text-[#ff385c] tracking-tighter italic font-mono">{formatTime(tripTimer)}</h2>
                     <div className="flex items-center justify-center gap-4 bg-emerald-500/10 w-fit mx-auto px-6 py-2 rounded-full border border-emerald-500/20">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Exploring Now</span>
                     </div>
                  </div>

                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex items-center gap-6">
                     <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-16 h-16 rounded-[1rem] object-cover border border-white/10" alt=""/>
                     <div className="flex-1">
                        <h4 className="font-black text-lg text-white italic">{matchedGuide?.name}</h4>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Assigned Expert</p>
                     </div>
                     <a href={`tel:${matchedGuide?.phone || '+919876543210'}`} className="w-12 h-12 bg-[#3b82f6] rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Phone size={20} fill="currentColor" />
                     </a>
                  </div>

                  <div className="mt-auto space-y-4">
                     <button className="w-full py-5 bg-white/5 text-white/60 rounded-2xl font-bold text-xs uppercase tracking-widest border border-white/10 flex items-center justify-center gap-3">
                        <ShieldCheck size={18} /> Emergency Support
                     </button>
                  </div>
               </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {screen === 'end-trip' && (
          <motion.div key="s9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
            <ScreenWrapper setScreen={setScreen} hideHeader>
               <div className="flex-1 flex flex-col bg-[#0f172a] -m-6 p-10 space-y-10 min-h-full">
                  <div className="text-center space-y-4">
                     <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-6 border border-emerald-500/20">
                        <CheckCircle size={48} />
                     </div>
                     <h3 className="text-4xl font-black text-white italic tracking-tighter">Trip Completed!</h3>
                     <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Thank you for your journey</p>
                  </div>

                  <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 space-y-6">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-8">Summary</p>
                     <div className="flex justify-between items-center"><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Location</span><span className="text-sm font-bold text-white italic">{formData.location}</span></div>
                     <div className="flex justify-between items-center"><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Duration</span><span className="text-sm font-bold text-white font-mono">{formatTime(tripTimer)}</span></div>
                     <div className="flex justify-between items-center"><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Plan</span><span className="text-sm font-bold text-white italic">{formData.plan}</span></div>
                     <div className="flex justify-between items-center pt-8 border-t border-white/5"><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Price Paid</span><span className="text-3xl font-black text-white">₹{formData.price}</span></div>
                  </div>

                  <button onClick={() => setScreen('review')} className="w-full py-5 bg-[#ff385c] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-[#ff385c]/40 mt-auto">Rate Experience</button>
               </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {screen === 'review' && (
          <motion.div key="s10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
            <ScreenWrapper setScreen={setScreen} hideHeader>
               <div className="flex-1 flex flex-col bg-[#0f172a] -m-6 p-10 space-y-10 min-h-full">
                  <div className="text-center space-y-4">
                     <h3 className="text-4xl font-black text-white italic tracking-tighter">Rate Your Guide</h3>
                     <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">How was your experience with {matchedGuide?.name || 'Arjun'}?</p>
                  </div>

                  <div className="flex justify-center gap-3 py-6">
                     {[1, 2, 3, 4, 5].map(star => ( 
                       <Star 
                        key={star} 
                        size={44} 
                        onClick={() => setUserRating(star)}
                        className={`${userRating >= star ? 'text-amber-500 fill-current' : 'text-white/10'} cursor-pointer transition-all hover:scale-110`} 
                       /> 
                     ))}
                  </div>

                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                     <textarea 
                       value={userComment}
                       onChange={(e) => setUserComment(e.target.value)}
                       placeholder="Amazing experience!..." 
                       className="w-full bg-transparent border-none text-white font-medium p-0 focus:ring-0 h-32 placeholder:text-white/10" 
                     />
                  </div>

                  <button onClick={handleSubmitReview} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-white/10 mt-auto">Submit Review & Finish</button>
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
