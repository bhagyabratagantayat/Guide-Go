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
  Clock3, Globe, Zap as ZapIcon
} from 'lucide-react';
import api from '../utils/api';
import { useBooking, TRIP_STATUS } from '../context/BookingContext';

const ScreenWrapper = ({ children, title, showBack, prevScreen, hideHeader, setScreen }) => (
  <div className="max-w-md lg:mx-auto w-full min-h-screen flex flex-col bg-white overflow-hidden relative shadow-2xl lg:border-x border-[#dddddd]">
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
    price: 499
  });

  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
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
    else if (tripStatus === TRIP_STATUS.COMPLETED) setScreen('end-trip');
    else if (tripStatus === TRIP_STATUS.IDLE && screen !== 'booking-form') setScreen('select-location');
  }, [tripStatus]);

  const location = useLocation();
  useEffect(() => {
    if (location.state?.searchParams) {
      const { location: loc, plan, language: lang } = location.state.searchParams;
      const priceMap = { '2 Hours': 499, '4 Hours': 899, 'Full Day': 1499 };
      setFormData({
        location: loc || 'Puri, Odisha',
        plan: plan || '2 Hours',
        language: lang || 'Hindi',
        price: priceMap[plan] || 499
      });
      setScreen('booking-form');
    }
  }, [location.state]);

  const handleFindGuide = async () => {
    try {
      await startSearching(formData);
    } catch (err) {
      alert('Failed to start search. Please try again.');
    }
  };

  const handleCancelBooking = async () => {
    await cancelBooking();
    setScreen('select-location');
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
      resetBooking();
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review';
      alert(`Submission Failed: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Book Guide | GuideGo</title>
      </Helmet>

      {isRestoring ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-10">
          <div className="w-12 h-12 border-4 border-[#ff385c] border-t-transparent rounded-full animate-spin mb-6" />
          <h3 className="text-xl font-bold text-[#222222]">Restoring Session...</h3>
          <p className="text-[10px] mt-2 uppercase tracking-[0.2em] font-medium text-[#717171]">Checking for active trips</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {isSuccess && (
            <motion.div 
              key="success-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="fixed inset-0 z-[2000] bg-white flex flex-col items-center justify-center p-8 text-center"
            >
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-500/20">
                  <CheckCircle size={48} />
               </motion.div>
               <h2 className="text-4xl font-black text-[#222222] tracking-tighter italic mb-4">Trip Completed Successfully 🎉</h2>
               <p className="text-[#717171] font-bold uppercase tracking-widest text-[10px]">Your feedback makes us better</p>
            </motion.div>
          )}

          {screen === 'select-location' && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ScreenWrapper setScreen={setScreen} title="Where to?">
                <div className="relative mb-8">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#717171]" size={18} />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search destinations" className="w-full bg-[#f7f7f7] text-[#222222] border-none rounded-full pl-16 py-4 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/20" />
                </div>
                <div className="grid gap-6">
                   {places.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(place => (
                     <div key={place._id} onClick={() => { setFormData({...formData, location: place.name}); setScreen('booking-form'); }} className="group cursor-pointer">
                        <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-3 shadow-md">
                           <img src={place.image || `https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=600&q=80`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt=""/>
                           <div className="absolute top-4 left-4">
                              <span className="px-3 py-1.5 bg-white/95 backdrop-blur rounded-full text-[10px] font-black text-[#222222] flex items-center shadow-lg">
                                <ZapIcon size={10} className="mr-1.5 text-[#ff385c] fill-current"/> ONLINE NOW
                              </span>
                           </div>
                        </div>
                        <div className="px-2">
                           <h4 className="font-bold text-[#222222] text-lg tracking-tight">{place.name}, Odisha</h4>
                           <p className="text-sm font-medium text-[#717171]">{place.description || 'Heritage & Culture Tour'}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </ScreenWrapper>
            </motion.div>
          )}

          {screen === 'booking-form' && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
                       <label className="text-[11px] font-bold uppercase text-[#222222] ml-1 tracking-[0.1em]">Select duration</label>
                       <div className="space-y-3">
                          {[{l: '2 Hours', p: 499}, {l: '4 Hours', p:899}, {l: 'Full Day', p: 1499}].map(p => (
                            <div key={p.l} onClick={() => setFormData({...formData, plan: p.l, price: p.p})} className={`p-6 rounded-[1.2rem] border-2 transition-all flex justify-between items-center cursor-pointer ${formData.plan === p.l ? 'border-[#222222] bg-[#f7f7f7]' : 'border-[#dddddd] bg-white'}`}>
                               <p className="font-bold text-[#222222]">{p.l}</p><p className="text-xl font-bold text-[#222222]">₹{p.p}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                    <button onClick={handleFindGuide} className="w-full py-5 bg-[#ff385c] text-white rounded-xl font-bold text-base hover:bg-[#e00b41] transition-all mt-auto">Confirm & Find Guide</button>
                 </div>
              </ScreenWrapper>
            </motion.div>
          )}

          {screen === 'searching' && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ScreenWrapper setScreen={setScreen} hideHeader>
                 <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#0f172a] -m-6 min-h-screen">
                    <div className="relative mb-16">
                       <div className="w-48 h-48 border border-white/5 rounded-full animate-ping" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 bg-[#ff385c]/20 rounded-full flex items-center justify-center animate-pulse">
                            <Search size={40} className="text-[#ff385c]" />
                          </div>
                       </div>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter">Finding Experts</h3>
                    <p className="text-white/40 text-sm font-medium mt-4">Connecting you with active guides in {formData.location}...</p>
                    <button onClick={handleCancelBooking} className="mt-auto w-full py-5 bg-white/5 text-white/60 rounded-2xl font-bold text-sm border border-white/10">Cancel Request</button>
                 </div>
              </ScreenWrapper>
            </motion.div>
          )}

          {screen === 'call-connect' && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <ScreenWrapper setScreen={setScreen} hideHeader>
                 <div className="flex-1 flex flex-col bg-[#0f172a] p-10 space-y-8 -m-6 min-h-screen">
                    <div className="text-center space-y-6 pt-10">
                       <div className="relative w-32 h-32 mx-auto">
                          <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-full h-full rounded-full object-cover border-4 border-[#3b82f6]" alt=""/>
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white italic tracking-tighter">{matchedGuide?.name || 'Your Guide'}</h3>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <a href={`tel:${matchedGuide?.phone}`} className="p-6 bg-emerald-500 text-white rounded-3xl flex flex-col items-center gap-2"><Phone size={24}/><span className="text-[10px] font-black uppercase">Call</span></a>
                       <a href={`https://wa.me/${matchedGuide?.phone}`} className="p-6 bg-[#25D366] text-white rounded-3xl flex flex-col items-center gap-2"><MessageSquare size={24}/><span className="text-[10px] font-black uppercase">WhatsApp</span></a>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-center space-y-4 mt-auto">
                       <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Verification OTP</p>
                       <div className="flex justify-center gap-3">
                          {String(otp || '----').split('').map((digit, i) => (
                            <div key={i} className="w-12 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl font-black text-white border border-white/5">{digit}</div>
                          ))}
                       </div>
                    </div>
                 </div>
              </ScreenWrapper>
            </motion.div>
          )}

          {screen === 'trip-ongoing' && (
            <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ScreenWrapper setScreen={setScreen} hideHeader>
                 <div className="flex-1 space-y-10 flex flex-col py-10 bg-[#0f172a] -m-6 p-10 min-h-screen">
                    <div className="bg-white/5 p-10 rounded-[3rem] text-center space-y-6 border border-white/10">
                       <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.4em]">Live Session</p>
                       <h2 className="text-5xl font-black text-[#ff385c] tracking-tighter italic font-mono">{formatTime(tripTimer)}</h2>
                       <div className="flex items-center justify-center gap-2 text-emerald-500"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> <span className="text-[10px] font-black uppercase">Exploring Now</span></div>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex items-center gap-6">
                       <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-16 h-16 rounded-2xl object-cover" alt=""/>
                       <div><h4 className="font-black text-lg text-white italic">{matchedGuide?.name}</h4><p className="text-[10px] font-bold text-white/40 uppercase">Assigned Expert</p></div>
                    </div>
                 </div>
              </ScreenWrapper>
            </motion.div>
          )}

          {screen === 'end-trip' && (
            <motion.div key="s6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ScreenWrapper setScreen={setScreen} hideHeader>
                 <div className="space-y-10 flex-1 flex flex-col py-6 max-w-md mx-auto w-full">
                    <div className="text-center space-y-3">
                       <div className="inline-flex px-4 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2">Booking Settled</div>
                       <h3 className="text-4xl font-black text-[#222222] tracking-tighter leading-none italic">Trip Summary</h3>
                       <p className="text-[#717171] text-[11px] font-medium">Verified trip completion successfully 🎉</p>
                    </div>
                    <div className="bg-[#f7f7f7] rounded-[3rem] p-10 border border-[#eeeeee]">
                       <div className="flex items-center gap-5 mb-10">
                          <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt=""/>
                          <div><p className="text-[10px] font-black text-[#717171] uppercase tracking-widest mb-1">Your Expert</p><h4 className="text-2xl font-black text-[#222222] italic">{matchedGuide?.name}</h4></div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-6 rounded-[2rem] border border-[#eeeeee] space-y-2"><Clock3 size={16} className="text-blue-500" /><div><p className="text-[9px] font-black text-[#717171] uppercase tracking-widest">Duration</p><p className="text-lg font-black text-[#222222] italic">{formatTime(tripTimer)}</p></div></div>
                          <div className="bg-white p-6 rounded-[2rem] border border-[#eeeeee] space-y-2"><CreditCard size={16} className="text-emerald-500" /><div><p className="text-[9px] font-black text-[#717171] uppercase tracking-widest">Total Cost</p><p className="text-lg font-black text-[#222222] italic">₹{bookingData?.price || formData.price}</p></div></div>
                          <div className="bg-white p-6 rounded-[2rem] border border-[#eeeeee] space-y-2"><ZapIcon size={16} className="text-amber-500" /><div><p className="text-[9px] font-black text-[#717171] uppercase tracking-widest">Plan</p><p className="text-base font-black text-[#222222] italic leading-tight">{bookingData?.plan || formData.plan}</p></div></div>
                          <div className="bg-white p-6 rounded-[2rem] border border-[#eeeeee] space-y-2"><Globe size={16} className="text-rose-500" /><div><p className="text-[9px] font-black text-[#717171] uppercase tracking-widest">Language</p><p className="text-base font-black text-[#222222] italic leading-tight">{bookingData?.language || formData.language}</p></div></div>
                       </div>
                    </div>
                    <div className="space-y-8 px-2">
                       <div className="text-center space-y-4">
                          <p className="text-[10px] font-black text-[#222222] uppercase tracking-[0.3em]">Rate your experience</p>
                          <div className="flex justify-center gap-3">
                             {[1, 2, 3, 4, 5].map((star) => (
                               <motion.div key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                 <Star size={36} className={`cursor-pointer transition-all ${star <= userRating ? 'text-amber-500 fill-current' : 'text-[#dddddd] hover:text-amber-200'}`} onClick={() => setUserRating(star)}/>
                               </motion.div>
                             ))}
                          </div>
                       </div>
                       <textarea value={userComment} onChange={(e) => setUserComment(e.target.value)} placeholder="Tell us about your trip..." className="w-full bg-[#f7f7f7] border-2 border-[#eeeeee] rounded-[2rem] p-8 text-sm font-medium focus:border-[#222222] focus:bg-white transition-all outline-none min-h-[140px] resize-none" />
                       <button onClick={handleSubmitReview} disabled={isSubmitting} className="w-full h-20 bg-[#222222] text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 disabled:opacity-70">
                          {isSubmitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Submitting...</span></> : 'Submit & Finish'}
                       </button>
                    </div>
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
