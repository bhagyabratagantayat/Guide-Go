import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, Clock, CheckCircle, Search, Phone, 
  MessageSquare, ShieldCheck, Star, Timer, 
  CreditCard, X, ArrowRight, Zap, AlertCircle,
  Navigation, Calendar, ChevronLeft, MoreVertical,
  ThumbsUp, DollarSign, Wallet, ArrowUpRight,
  Clock3, Globe, Zap as ZapIcon, Share2, Info,
  Flag, Heart, ShieldAlert
} from 'lucide-react';
import api from '../utils/api';
import { useBooking, TRIP_STATUS } from '../context/BookingContext';

const ScreenWrapper = ({ children, title, showBack, prevScreen, hideHeader, setScreen, maxWidth = "max-w-md" }) => (
  <div className={`${maxWidth} mx-auto w-full min-h-[calc(100vh-40px)] my-5 flex flex-col bg-white overflow-hidden relative shadow-2xl lg:rounded-[2.5rem] border border-[#dddddd]`}>
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
  const navigate = useNavigate();
  const { 
    tripStatus, setTripStatus, bookingData, matchedGuide, otp, 
    tripTimer, isRestoring, startSearching, cancelBooking, resetBooking 
  } = useBooking();

  const [screen, setScreen] = useState('select-location'); 
  const [formData, setFormData] = useState({
    location: 'Puri, Odisha',
    plan: '2 Hours',
    language: 'Hindi',
    price: 349
  });

  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateLiveCost = (seconds, totalAmount, planLabel) => {
    const planHours = planLabel === 'Full Day' ? 8 : parseInt(planLabel);
    const totalSeconds = planHours * 3600;
    const cost = (totalAmount / totalSeconds) * seconds;
    return Math.max(0, Math.min(totalAmount, Math.round(cost)));
  };

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

  useEffect(() => {
    if (tripStatus === TRIP_STATUS.SEARCHING) setScreen('searching');
    else if (tripStatus === TRIP_STATUS.MATCHED) setScreen('call-connect');
    else if (tripStatus === TRIP_STATUS.ONGOING) setScreen('trip-ongoing');
    else if (tripStatus === TRIP_STATUS.COMPLETED) {
       if (bookingData?.review?.rating) {
          setIsSuccess(true);
       }
       setScreen('end-trip');
    }
    else if (tripStatus === TRIP_STATUS.IDLE && screen !== 'booking-form') setScreen('select-location');
  }, [tripStatus, screen]);

  const location = useLocation();
  useEffect(() => {
    if (location.state?.searchParams) {
      const { location: loc, plan, language: lang } = location.state.searchParams;
      const priceMap = { '1 Hour': 199, '2 Hours': 349, '4 Hours': 649, 'Full Day': 999 };
      setFormData({
        location: loc || 'Puri, Odisha',
        plan: plan || '2 Hours',
        language: lang || 'Hindi',
        price: priceMap[plan] || 349
      });
      setScreen('booking-form');
    }
  }, [location.state]);

  const handleFindGuide = async () => {
    try {
      await startSearching(formData);
      setScreen('searching');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error occurred';
      alert(`Failed to start search: ${errorMsg}`);
      console.error('Search Start Error:', err);
    }
  };

  const handleEndTrip = async () => {
    if (!window.confirm('Are you sure you want to end the trip now?')) return;
    try {
      await api.post(`/bookings/end/${bookingData._id}`);
      setTripStatus(TRIP_STATUS.COMPLETED);
    } catch (err) {
      alert('Failed to end trip. Please try again.');
    }
  };

  const handleSubmitReview = async () => {
    if (!bookingData?._id) return;
    setIsSubmitting(true);
    try {
      await api.post(`/bookings/${bookingData._id}/review`, {
        rating: userRating,
        comment: userComment
      });
      setIsSuccess(true);
      setTimeout(() => {
        resetBooking();
        navigate('/');
      }, 2500);
    } catch (err) {
      alert('Failed to submit review. Your session is still active.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPlaces = places.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShareTrip = () => {
     const text = `I'm on a trip with GuideGo! Track my location and session in ${formData.location}.`;
     window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] lg:p-10 flex items-center justify-center">
      <Helmet>
        <title>Book a Guide | GuideGo</title>
      </Helmet>

      {isRestoring ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-xl space-y-4">
          <div className="w-12 h-12 border-4 border-[#ff385c] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#222222]">Restoring session...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* 1. SELECT LOCATION */}
          {screen === 'select-location' && (
            <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-6xl">
               <ScreenWrapper title="Where to?" hideHeader maxWidth="max-w-none">
                  <div className="space-y-8">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                           <h1 className="text-3xl font-black text-[#222222] italic">Where to?</h1>
                           <p className="text-xs font-bold text-[#717171] uppercase tracking-widest">Select your destination in Odisha</p>
                        </div>
                        <div className="relative flex-1 max-w-md">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717171]" size={18} />
                           <input 
                              type="text" 
                              placeholder="Search destinations..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-12 pr-6 py-4 bg-[#f7f7f7] border border-[#eeeeee] rounded-2xl focus:ring-2 focus:ring-[#ff385c] focus:bg-white transition-all text-sm font-medium"
                           />
                        </div>
                     </div>

                     {loadingPlaces ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                           {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-3xl animate-pulse" />)}
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                           {filteredPlaces.map((place) => (
                              <motion.div 
                                 key={place._id}
                                 whileHover={{ y: -8 }}
                                 onClick={() => {
                                    setFormData({ ...formData, location: place.name });
                                    setScreen('booking-form');
                                 }}
                                 className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden border border-[#eeeeee] hover:shadow-2xl hover:border-[#ff385c]/30 transition-all duration-500"
                              >
                                 <div className="relative h-56 overflow-hidden">
                                    <img src={place.image || 'https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=600&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
                                    <div className="absolute top-4 left-4">
                                       <span className="px-3 py-1.5 bg-white/95 backdrop-blur rounded-full text-[10px] font-black text-[#222222] flex items-center gap-1.5 shadow-lg">
                                          <ZapIcon size={12} className="text-[#ff385c] fill-current" /> ONLINE NOW
                                       </span>
                                    </div>
                                 </div>
                                 <div className="p-6 space-y-2">
                                    <h4 className="text-xl font-black text-[#222222] italic">{place.name}, Odisha</h4>
                                    <p className="text-xs font-medium text-[#717171] leading-relaxed line-clamp-2">{place.description}</p>
                                 </div>
                              </motion.div>
                           ))}
                        </div>
                     )}
                  </div>
               </ScreenWrapper>
            </motion.div>
          )}

          {/* 2. BOOKING FORM */}
          {screen === 'booking-form' && (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-5xl">
               <ScreenWrapper title="Customize Trip" showBack prevScreen="select-location" setScreen={setScreen} maxWidth="max-w-none">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#eeeeee]">
                           <img 
                              src={places.find(p => p.name === formData.location)?.image || 'https://images.unsplash.com/photo-1606298246186-08868ab77562?w=800&q=80'} 
                              className="w-full h-full object-cover" 
                              alt="" 
                           />
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-3xl font-black text-[#222222] italic leading-tight">Your Adventure in {formData.location}</h3>
                           <div className="flex flex-wrap gap-3">
                              <span className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-rose-100">
                                 <ShieldCheck size={14} /> Safety First
                              </span>
                              <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-amber-100">
                                 <Star size={14} /> 4.8+ Rated Guides
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="bg-[#f7f7f7] p-8 lg:p-10 rounded-[2.5rem] border border-[#eeeeee] space-y-10">
                        <div className="space-y-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">Select Duration</label>
                              <div className="grid grid-cols-2 gap-4">
                                 {[
                                    { label: '1 Hour', price: 199, tag: 'entry' },
                                    { label: '2 Hours', price: 349, tag: 'most popular' },
                                    { label: '4 Hours', price: 649 },
                                    { label: 'Full Day', price: 999, tag: 'best value' }
                                 ].map(p => (
                                    <button 
                                       key={p.label}
                                       onClick={() => setFormData({...formData, plan: p.label, price: p.price})}
                                       className={`relative p-6 rounded-[2rem] text-left transition-all border group ${formData.plan === p.label ? 'bg-[#222222] text-white border-[#222222] shadow-2xl scale-[1.02]' : 'bg-white text-[#222222] border-[#dddddd] hover:border-[#222222]'}`}
                                    >
                                       {p.tag && (
                                          <span className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${p.tag === 'best value' ? 'bg-amber-500 text-white' : 'bg-[#ff385c] text-white'}`}>
                                             {p.tag}
                                          </span>
                                       )}
                                       <div className="space-y-1">
                                          <p className={`text-[10px] font-black uppercase tracking-widest ${formData.plan === p.label ? 'text-white/40' : 'text-[#717171]'}`}>{p.label}</p>
                                          <p className="text-2xl font-black italic">₹{p.price}</p>
                                       </div>
                                       <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all ${formData.plan === p.label ? 'bg-white/20' : 'bg-[#f7f7f7] group-hover:bg-[#222222] group-hover:text-white'}`}>
                                          <ArrowUpRight size={14} />
                                       </div>
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">Preferred Language</label>
                              <div className="grid grid-cols-3 gap-3">
                                 {['Hindi', 'English', 'Odia'].map(l => (
                                    <button 
                                       key={l}
                                       onClick={() => setFormData({...formData, language: l})}
                                       className={`py-4 rounded-2xl text-[11px] font-black transition-all border ${formData.language === l ? 'bg-[#ff385c] text-white border-[#ff385c] shadow-lg shadow-rose-500/20' : 'bg-white text-[#222222] border-[#dddddd] hover:border-[#222222]'}`}
                                    >
                                       {l}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-[#dddddd] space-y-6">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <span className="text-xs font-bold text-[#717171]">Total Amount</span>
                                 <p className="text-3xl font-black text-[#222222]">₹{formData.price}</p>
                              </div>
                              <div className="text-right">
                                 <span className="text-[10px] font-black uppercase text-emerald-500">Pay After Trip</span>
                                 <div className="flex items-center gap-2 text-xs font-bold text-[#222222] mt-1">
                                    <Wallet size={14} /> Cash/UPI Accepted
                                 </div>
                              </div>
                           </div>
                           <button 
                              onClick={handleFindGuide}
                              className="w-full py-6 bg-[#222222] text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-black active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
                           >
                              Find a Guide <ArrowRight size={18} strokeWidth={3} />
                           </button>
                        </div>
                     </div>
                  </div>
               </ScreenWrapper>
            </motion.div>
          )}

          {/* 3. SEARCHING SCREEN */}
          {screen === 'searching' && (
            <motion.div 
               key="searching" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="w-full max-w-6xl"
            >
               <ScreenWrapper hideHeader maxWidth="max-w-none">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-10">
                     {/* Left: Animation & Primary Status */}
                     <div className="flex flex-col items-center text-center space-y-10">
                        <div className="relative">
                           {/* Pulsing rings */}
                           <motion.div 
                              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="absolute inset-0 bg-[#ff385c] rounded-full"
                           />
                           <motion.div 
                              animate={{ scale: [1, 2, 1], opacity: [0.05, 0, 0.05] }}
                              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                              className="absolute inset-0 bg-[#ff385c] rounded-full"
                           />
                           
                           <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center border-8 border-[#f7f7f7] shadow-2xl">
                              <div className="absolute inset-0 border-[6px] border-[#ff385c] border-t-transparent rounded-full animate-spin" />
                              <Search size={48} className="text-[#ff385c]" />
                           </div>
                        </div>
                        
                        <div className="space-y-4">
                           <h2 className="text-4xl font-black text-[#222222] italic leading-tight">Finding Experts...</h2>
                           <p className="text-sm font-bold text-[#717171] uppercase tracking-[0.3em]">Scanning {formData.location}</p>
                        </div>

                        <button 
                           onClick={cancelBooking}
                           className="px-12 py-5 bg-white border-2 border-rose-100 text-rose-500 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-200 transition-all shadow-lg shadow-rose-500/5"
                        >
                           Cancel Search
                        </button>
                     </div>

                     {/* Right: Live Stats Simulation */}
                     <div className="bg-[#f7f7f7] p-10 rounded-[3rem] border border-[#eeeeee] space-y-10">
                        <div className="space-y-2">
                           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff385c]">Live Scan Stats</h3>
                           <p className="text-sm font-medium text-[#717171]">We are notifying all top-rated guides in your area.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                           {/* Total Active */}
                           <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-6 rounded-3xl border border-[#eeeeee] flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                                    <ZapIcon size={20} />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-[#717171] uppercase tracking-widest">Total Active Guides</p>
                                    <p className="text-sm font-bold text-[#222222]">Guides Nearby</p>
                                 </div>
                              </div>
                              <p className="text-2xl font-black text-emerald-500">12</p>
                           </motion.div>

                           {/* Rejected */}
                           <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-[#eeeeee] flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                                    <X size={20} />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-[#717171] uppercase tracking-widest">Rejected</p>
                                    <p className="text-sm font-bold text-[#222222]">Busy with trips</p>
                                 </div>
                              </div>
                              <SearchStatsCounter type="rejected" />
                           </motion.div>

                           {/* No Response */}
                           <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-[#eeeeee] flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                                    <AlertCircle size={20} />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-[#717171] uppercase tracking-widest">No Response</p>
                                    <p className="text-sm font-bold text-[#222222]">Inactive or Timeout</p>
                                 </div>
                              </div>
                              <SearchStatsCounter type="timeout" />
                           </motion.div>
                        </div>

                        <div className="pt-6 border-t border-[#dddddd] flex items-center gap-4">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                           <p className="text-[10px] font-black text-[#717171] uppercase tracking-widest">Awaiting acceptance...</p>
                        </div>
                     </div>
                  </div>
               </ScreenWrapper>
            </motion.div>
          )}

          {/* 4. MATCHED SCREEN (CALL CONNECT) */}
          {screen === 'call-connect' && matchedGuide && (
            <motion.div key="matched" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md">
               <ScreenWrapper title="Guide Found!" hideHeader>
                  <div className="flex flex-col items-center text-center space-y-8">
                     <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#ff385c] shadow-2xl">
                           <img src={matchedGuide.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full border-4 border-white">
                           <ShieldCheck size={20} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <h2 className="text-2xl font-black text-[#222222] italic">{matchedGuide.name}</h2>
                        <div className="flex items-center justify-center gap-1.5 text-amber-500">
                           <Star size={16} fill="currentColor" />
                           <span className="text-sm font-black text-[#222222]">4.9 (120 reviews)</span>
                        </div>
                     </div>
                     <div className="w-full bg-[#f7f7f7] p-6 rounded-[2rem] border border-[#eeeeee] flex flex-col items-center space-y-2">
                        <span className="text-[10px] font-black text-[#717171] uppercase tracking-widest">Share this OTP with guide</span>
                        <p className="text-5xl font-black tracking-[0.4em] text-[#222222] py-2">{otp}</p>
                     </div>
                     <a 
                        href={`tel:${matchedGuide.mobile}`}
                        className="w-full py-6 bg-emerald-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                     >
                        <Phone size={20} /> Call Guide
                     </a>
                  </div>
               </ScreenWrapper>
            </motion.div>
          )}

          {/* 5. TRIP ONGOING (ADVANCED PRODUCT-LEVEL DASHBOARD) */}
          {screen === 'trip-ongoing' && (
            <motion.div key="ongoing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl">
               <ScreenWrapper title="Active Adventure" hideHeader maxWidth="max-w-none">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
                     
                     {/* --- LEFT COL: GUIDE INFO & ACTIONS --- */}
                     <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#222222] p-8 rounded-[2.5rem] text-white shadow-2xl space-y-8 h-full">
                           <div className="flex flex-col items-center text-center space-y-4">
                              <div className="relative">
                                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 p-1">
                                    <img 
                                       src={matchedGuide?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'} 
                                       className="w-full h-full object-cover rounded-full" 
                                       alt="" 
                                    />
                                 </div>
                                 <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#222222]" />
                              </div>
                              <div className="space-y-1">
                                 <h3 className="text-2xl font-black italic">{matchedGuide?.name || 'Arjun Das'}</h3>
                                 <div className="flex items-center justify-center gap-1.5 text-amber-500">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-xs font-black text-white/60">4.9 • Superguide</span>
                                 </div>
                              </div>
                           </div>

                           <div className="grid grid-cols-3 gap-3">
                              <a href={`tel:${matchedGuide?.mobile}`} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                                 <Phone size={20} />
                                 <span className="text-[8px] font-black uppercase">Call</span>
                              </a>
                              <button 
                                 onClick={() => navigate(`/chat/${bookingData?._id}`)}
                                 className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"
                              >
                                 <MessageSquare size={20} />
                                 <span className="text-[8px] font-black uppercase">Chat</span>
                              </button>
                              <button onClick={handleShareTrip} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                                 <Share2 size={20} />
                                 <span className="text-[8px] font-black uppercase">Share</span>
                              </button>
                           </div>

                           <div className="pt-6 border-t border-white/5 space-y-4">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                                 <span>Languages</span>
                                 <span className="text-white">{matchedGuide?.languages?.join(', ') || 'English, Hindi, Odia'}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                                 <span>Experience</span>
                                 <span className="text-white">5+ Years</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* --- MIDDLE COL: LIVE TIMER & BILLING --- */}
                     <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-[#eeeeee] flex flex-col items-center text-center space-y-10 justify-center h-full">
                           <div className="relative">
                              <svg className="w-48 h-48 -rotate-90">
                                 <circle cx="96" cy="96" r="88" className="stroke-[#f7f7f7] stroke-[8]" fill="transparent" />
                                 <motion.circle 
                                    cx="96" cy="96" r="88" 
                                    className="stroke-[#ff385c] stroke-[8]" 
                                    fill="transparent" 
                                    strokeDasharray="553"
                                    initial={{ strokeDashoffset: 553 }}
                                    animate={{ strokeDashoffset: 553 - (553 * (tripTimer % 60) / 60) }}
                                    transition={{ duration: 1 }}
                                 />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                                 <Timer size={24} className="text-[#ff385c]" />
                                 <span className="text-4xl font-black text-[#222222] font-mono tracking-tighter">{formatTime(tripTimer)}</span>
                                 <span className="text-[10px] font-black text-[#717171] uppercase tracking-widest">Live Trip Time</span>
                              </div>
                           </div>

                           <div className="w-full bg-[#f7f7f7] p-8 rounded-[2rem] space-y-1 border border-[#eeeeee]">
                              <p className="text-[10px] font-black text-[#717171] uppercase tracking-widest">Estimated Cost (Live)</p>
                              <p className="text-5xl font-black text-emerald-500 italic">₹{calculateLiveCost(tripTimer, formData.price, formData.plan)}</p>
                              <p className="text-[10px] font-bold text-[#717171] mt-2 italic">Based on {formData.plan} plan</p>
                           </div>

                           <button 
                              onClick={handleEndTrip}
                              className="w-full py-6 bg-[#222222] text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-95 transition-all"
                           >
                              End Trip & Pay
                           </button>
                        </div>
                     </div>

                     {/* --- RIGHT COL: TRIP INFO & SAFETY --- */}
                     <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#f7f7f7] p-8 rounded-[2.5rem] border border-[#eeeeee] flex flex-col justify-between h-full">
                           <div className="space-y-8">
                              <div className="space-y-4">
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <h4 className="text-[10px] font-black text-[#ff385c] uppercase tracking-widest">Now Exploring</h4>
                                 </div>
                                 <h2 className="text-3xl font-black text-[#222222] italic leading-tight">{formData.location}</h2>
                                 <div className="bg-white p-6 rounded-2xl border border-[#eeeeee] space-y-4">
                                    <div className="flex justify-between items-center">
                                       <span className="text-[10px] font-bold text-[#717171] uppercase">Package</span>
                                       <span className="text-[10px] font-black text-[#222222]">{formData.plan} Adventure</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                       <span className="text-[10px] font-bold text-[#717171] uppercase">Language</span>
                                       <span className="text-[10px] font-black text-[#222222]">{formData.language}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                       <span className="text-[10px] font-bold text-[#717171] uppercase">Total Limit</span>
                                       <span className="text-[10px] font-black text-rose-500 font-mono">₹{formData.price}</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                 <button 
                                    onClick={() => setShowReportModal(true)}
                                    className="flex items-center justify-center gap-3 p-5 bg-white rounded-2xl text-rose-500 font-black text-[10px] uppercase tracking-widest border border-rose-50 hover:bg-rose-50 transition-all"
                                 >
                                    <Flag size={14} /> Report
                                 </button>
                                 <button className="flex items-center justify-center gap-3 p-5 bg-white rounded-2xl text-[#222222] font-black text-[10px] uppercase tracking-widest border border-[#dddddd] hover:bg-[#f7f7f7] transition-all">
                                    <Info size={14} /> Details
                                 </button>
                              </div>
                           </div>

                           <button className="w-full py-5 bg-rose-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-500/20 flex items-center justify-center gap-3 hover:bg-rose-600 transition-all mt-10">
                              <ShieldAlert size={16} /> EMERGENCY SOS (24/7)
                           </button>
                        </div>
                     </div>
                  </div>
               </ScreenWrapper>
            </motion.div>
          )}

          {/* 6. END TRIP / REVIEW (OVERHAULED UI) */}
          {screen === 'end-trip' && (
            <motion.div key="end" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl">
               <ScreenWrapper title="Trip Summary" hideHeader maxWidth="max-w-none">
                  {isSuccess ? (
                     <div className="flex flex-col items-center justify-center py-32 space-y-8">
                        <motion.div 
                           initial={{ scale: 0, rotate: -180 }} 
                           animate={{ scale: 1, rotate: 0 }} 
                           className="w-32 h-32 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
                        >
                           <CheckCircle size={64} strokeWidth={3} />
                        </motion.div>
                        <div className="text-center space-y-3">
                           <h2 className="text-4xl font-black text-[#222222] italic">Review Already Saved!</h2>
                           <p className="text-sm font-bold text-[#717171] uppercase tracking-[0.2em]">Thank you for traveling with GuideGo.</p>
                        </div>
                        <button 
                           onClick={() => { resetBooking(); navigate('/'); }}
                           className="px-10 py-4 bg-[#222222] text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                        >
                           Back to Home
                        </button>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-10">
                        {/* Left: Summary & Guide */}
                        <div className="space-y-10">
                           <div className="space-y-4 text-center lg:text-left">
                              <h2 className="text-5xl font-black text-[#222222] italic leading-tight">How was your trip?</h2>
                              <p className="text-xs font-bold text-[#717171] uppercase tracking-[0.3em]">Your feedback helps Arjun grow</p>
                           </div>

                           <div className="bg-[#f7f7f7] p-10 rounded-[3rem] border border-[#eeeeee] space-y-8">
                              <div className="flex items-center gap-6">
                                 <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img src={matchedGuide?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'} className="w-full h-full object-cover" alt="" />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-[#717171] uppercase tracking-widest">Guide</p>
                                    <h4 className="text-2xl font-black italic text-[#222222]">{matchedGuide?.name || 'Arjun Das'}</h4>
                                 </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="bg-white p-6 rounded-3xl border border-[#eeeeee] text-center">
                                    <span className="text-[10px] font-black text-[#717171] uppercase tracking-widest">Duration</span>
                                    <p className="text-xl font-black text-[#222222]">{formData.plan}</p>
                                 </div>
                                 <div className="bg-white p-6 rounded-3xl border border-[#eeeeee] text-center">
                                    <span className="text-[10px] font-black text-[#717171] uppercase tracking-widest">Amount</span>
                                    <p className="text-xl font-black text-emerald-600">₹{formData.price}</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Right: Rating Form */}
                        <div className="space-y-10 bg-white p-2 rounded-[3rem]">
                           <div className="flex flex-col items-center gap-6">
                              <div className="flex gap-3">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                       key={star} 
                                       onClick={() => setUserRating(star)}
                                       className="p-1 transition-all hover:scale-125 active:scale-95"
                                    >
                                       <Star 
                                          size={48} 
                                          className={`${star <= userRating ? 'text-amber-500 fill-current drop-shadow-lg' : 'text-[#dddddd]'}`} 
                                       />
                                    </button>
                                 ))}
                              </div>
                              <span className="px-6 py-2 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-amber-100">
                                 {userRating === 5 ? '🔥 Exceptional!' : userRating === 4 ? '✨ Very Good' : userRating === 3 ? '👍 Good' : '⭐ Average'}
                              </span>
                           </div>

                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-6">Share your story</label>
                              <textarea 
                                 placeholder="Tell us about the secret spots, the stories, and the service..." 
                                 value={userComment}
                                 onChange={(e) => setUserComment(e.target.value)}
                                 className="w-full p-8 bg-[#f7f7f7] border border-[#eeeeee] rounded-[2.5rem] h-40 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all text-sm font-medium resize-none shadow-inner"
                              />
                           </div>

                           <button 
                              onClick={handleSubmitReview}
                              disabled={isSubmitting}
                              className="w-full py-7 bg-[#222222] text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                           >
                              {isSubmitting ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <>Finalize & Pay ₹{formData.price} <ArrowRight size={20} /></>}
                           </button>
                        </div>
                     </div>
                  )}
               </ScreenWrapper>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* --- REPORT MODAL --- */}
      <AnimatePresence>
         {showReportModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
               <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-10 max-w-md w-full space-y-8 shadow-2xl">
                  <div className="text-center space-y-2">
                     <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert size={32} />
                     </div>
                     <h3 className="text-2xl font-black text-[#222222] italic">Report Issue</h3>
                     <p className="text-sm font-medium text-[#717171]">Your safety is our priority. Tell us what's wrong.</p>
                  </div>
                  <div className="space-y-3">
                     {['Guide Misbehavior', 'Route Deviation', 'Safety Concern', 'Pricing Issue', 'Other'].map(r => (
                        <button key={r} onClick={() => setShowReportModal(false)} className="w-full py-4 bg-[#f7f7f7] rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#222222] hover:bg-rose-500 hover:text-white transition-all border border-[#eeeeee]">{r}</button>
                     ))}
                  </div>
                  <button onClick={() => setShowReportModal(false)} className="w-full py-4 text-[#717171] text-[10px] font-black uppercase tracking-widest">Dismiss</button>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

const SearchStatsCounter = ({ type }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 5) return prev; // Limit for simulation
        const chance = Math.random();
        if (type === 'rejected' && chance > 0.8) return prev + 1;
        if (type === 'timeout' && chance > 0.7) return prev + 1;
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [type]);

  return <p className={`text-2xl font-black ${type === 'rejected' ? 'text-rose-500' : 'text-amber-500'}`}>{count}</p>;
};

export default BookGuidePage;
