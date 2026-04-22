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
  MessageCircle, Send
} from 'lucide-react';
import api from '../utils/api';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

const ScreenWrapper = ({ children, title, showBack, onBack, hideHeader }) => (
  <div className="max-w-md lg:mx-auto w-full min-h-screen flex flex-col bg-white overflow-hidden relative shadow-2xl lg:border-x border-[#dddddd]">
    {!hideHeader && (
      <div className="flex items-center justify-between p-6 bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-[#f7f7f7]">
        <div className="flex items-center gap-4">
          {showBack && <button onClick={onBack} className="p-2 hover:bg-[#f7f7f7] rounded-full text-[#222222]"><ChevronLeft size={20}/></button>}
          <h2 className="text-base font-bold text-[#222222] tracking-tight">{title || 'Book Guide'}</h2>
        </div>
        <button className="p-2 hover:bg-[#f7f7f7] rounded-full text-[#717171]"><MoreVertical size={20}/></button>
      </div>
    )}
    <div className="flex-1 p-6 flex flex-col">{children}</div>
  </div>
);

const BookGuidePage = () => {
  const { user } = useAuth();
  const { 
    tripStatus, setTripStatus, activeBooking, setActiveBooking, 
    matchedGuide, setMatchedGuide, tripTimer, resetBooking 
  } = useBooking();
  const navigate = useNavigate();
  const routeLocation = useLocation();

  // Local UI State
  const [localScreen, setLocalScreen] = useState('select-location'); 
  const [formData, setFormData] = useState({
    location: '',
    plan: '2 Hours',
    language: 'Hindi',
    price: 499
  });
  
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  // Sync with Global tripStatus
  useEffect(() => {
    if (tripStatus === 'SEARCHING') setLocalScreen('searching');
    else if (tripStatus === 'MATCHED') setLocalScreen('guide-found');
    else if (tripStatus === 'ONGOING') setLocalScreen('trip-live');
    else if (tripStatus === 'COMPLETED') setLocalScreen('payment');
  }, [tripStatus]);

  // Fetch Locations for Search
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await api.get('/places');
        setLocations(data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
      }
    };
    fetchLocations();
  }, []);

  // Handle incoming search from Home
  useEffect(() => {
    if (routeLocation.state?.searchParams && tripStatus === 'IDLE') {
      const { location: loc, plan, language: lang } = routeLocation.state.searchParams;
      const priceMap = { '2 Hours': 499, '4 Hours': 899, 'Full Day': 1499 };
      setFormData({
        location: loc,
        plan: plan,
        language: lang,
        price: priceMap[plan] || 499
      });
      setLocalScreen('booking-form');
    }
  }, [routeLocation.state, tripStatus]);

  const handleSelectLocation = (loc) => {
    setFormData({ ...formData, location: loc });
    setSearchQuery(loc);
    setShowSuggestions(false);
    setLocalScreen('booking-form');
  };

  const handleFindGuide = async () => {
    try {
      setTripStatus('SEARCHING');
      const { data } = await api.post('/bookings', formData);
      setActiveBooking(data);
    } catch (err) {
      console.error(err);
      setTripStatus('IDLE');
      setLocalScreen('booking-form');
    }
  };

  const handleCancelBooking = async () => {
    if (activeBooking?._id) {
      try {
        await api.put(`/bookings/${activeBooking._id}/status`, { status: 'cancelled' });
      } catch (err) { console.error(err); }
    }
    resetBooking();
    setLocalScreen('select-location');
  };

  const handleCompletePayment = () => {
    setLocalScreen('review');
  };

  const handleSubmitReview = async () => {
    if (!activeBooking?._id) return;
    try {
      await api.post(`/bookings/${activeBooking._id}/review`, {
        rating: userRating,
        comment: userComment
      });
      resetBooking();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Helmet>
        <title>Book Guide | GuideGo</title>
      </Helmet>

      <AnimatePresence mode="wait">
        
        {/* 1. LOCATION SCREEN */}
        {localScreen === 'select-location' && (
          <motion.div key="loc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper title="Where to?">
              <div className="relative mb-8">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#222222]" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  placeholder="Search destinations" 
                  className="w-full bg-white text-[#222222] border border-[#dddddd] rounded-full pl-16 py-4 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/20 shadow-sm" 
                />
                {showSuggestions && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#dddddd] overflow-hidden z-[100]">
                    {filteredLocations.map(l => (
                      <button 
                        key={l._id} 
                        onClick={() => handleSelectLocation(l.name)}
                        className="w-full px-6 py-4 text-left hover:bg-[#f7f7f7] border-b border-[#f7f7f7] last:border-0 flex items-center gap-3"
                      >
                        <MapPin size={16} className="text-[#717171]"/>
                        <span className="font-bold text-[#222222]">{l.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#717171] ml-1">Popular Areas</h3>
                {locations.slice(0, 3).map(loc => (
                  <div key={loc._id} onClick={() => handleSelectLocation(loc.name)} className="group cursor-pointer">
                    <div className="relative aspect-[16/9] rounded-[1.5rem] overflow-hidden mb-3">
                      <img src={loc.image || 'https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=600&q=80'} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt=""/>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold text-[#222222] flex items-center shadow-sm">
                          <Zap size={10} className="mr-1 text-[#ff385c] fill-current"/> Available Now
                        </span>
                      </div>
                    </div>
                    <div className="px-1 flex justify-between items-end">
                      <div>
                        <h4 className="font-bold text-[#222222] text-lg">{loc.name}</h4>
                        <p className="text-sm font-medium text-[#717171]">{loc.city}</p>
                      </div>
                      <ArrowRight className="text-[#dddddd] group-hover:text-[#222222] transition-colors" size={20}/>
                    </div>
                  </div>
                ))}
              </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {/* 2. PLAN SELECTION */}
        {localScreen === 'booking-form' && (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <ScreenWrapper title="Plan your trip" showBack onBack={() => setLocalScreen('select-location')}>
              <div className="space-y-8 flex-1 flex flex-col pb-24">
                <div className="bg-[#f7f7f7] p-6 rounded-2xl border border-[#dddddd] flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><MapPin size={20} className="text-[#ff385c]"/></div>
                  <div><p className="text-[10px] font-bold text-[#717171] uppercase tracking-widest">Destination</p><p className="font-bold text-[#222222]">{formData.location}</p></div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-bold uppercase text-[#717171] tracking-[0.1em]">Select duration</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[{l: '2 Hours', p: 499}, {l: '4 Hours', p: 899}, {l: 'Full Day', p: 1499}].map(p => (
                      <div key={p.l} onClick={() => setFormData({...formData, plan: p.l, price: p.p})} className={`p-6 rounded-2xl border-2 transition-all flex justify-between items-center cursor-pointer ${formData.plan === p.l ? 'border-[#222222] bg-[#f7f7f7] shadow-inner' : 'border-[#dddddd] bg-white hover:border-[#222222]/30'}`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-3 h-3 rounded-full border-2 ${formData.plan === p.l ? 'bg-[#222222] border-[#222222]' : 'border-[#dddddd]'}`}/>
                           <p className="font-bold text-[#222222]">{p.l}</p>
                        </div>
                        <p className="text-xl font-black text-[#222222]">₹{p.p}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-bold uppercase text-[#717171] tracking-[0.1em]">Preferred Language</label>
                  <div className="flex gap-2 p-1 bg-[#f7f7f7] rounded-xl border border-[#dddddd]">
                    {['English', 'Hindi', 'Odia'].map(l => (
                      <button key={l} onClick={() => setFormData({...formData, language: l})} className={`flex-1 py-3 rounded-lg font-bold transition-all text-xs ${formData.language === l ? 'bg-[#222222] text-white shadow-lg' : 'text-[#717171] hover:bg-white'}`}>{l}</button>
                    ))}
                  </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 lg:absolute lg:left-0 lg:right-0 bg-white p-6 border-t border-[#f7f7f7] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
                  <div className="max-w-md mx-auto flex items-center justify-between gap-6">
                    <div><p className="text-[10px] font-bold text-[#717171] uppercase">Total Price</p><p className="text-2xl font-black text-[#222222]">₹{formData.price}</p></div>
                    <button onClick={handleFindGuide} className="flex-1 py-4 bg-[#ff385c] text-white rounded-xl font-bold text-sm hover:bg-[#e00b41] transition-all shadow-xl shadow-rose-500/20">Confirm & Find Guide</button>
                  </div>
                </div>
              </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {/* 3. SEARCHING SCREEN */}
        {localScreen === 'searching' && (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper hideHeader>
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div className="relative mb-16">
                  <div className="w-40 h-40 border-2 border-[#ff385c]/20 rounded-full animate-[ping_2s_infinite]" />
                  <div className="absolute inset-0 w-40 h-40 border-2 border-[#ff385c]/10 rounded-full animate-[ping_3s_infinite]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-[#ff385c] rounded-3xl rotate-45 flex items-center justify-center shadow-2xl shadow-rose-500/40">
                      <Search size={32} className="text-white -rotate-45" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-[#222222] tracking-tighter">Finding your expert</h3>
                  <p className="text-[#717171] font-medium">Searching for guides in <span className="text-[#222222] font-bold">{formData.location}</span>...</p>
                  <div className="pt-8 flex justify-center gap-2">
                    {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-[#ff385c] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
                  </div>
                </div>
                <button onClick={handleCancelBooking} className="mt-auto py-4 text-[#717171] font-bold text-xs uppercase tracking-widest hover:text-[#222222]">Cancel Request</button>
              </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {/* 4. GUIDE FOUND + CALL CONNECT */}
        {localScreen === 'guide-found' && (
          <motion.div key="found" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ScreenWrapper hideHeader>
              <div className="space-y-8 flex-1 flex flex-col py-10">
                <div className="text-center">
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
                      <CheckCircle size={14}/> Expert Matched
                   </div>
                   <h3 className="text-4xl font-black text-[#222222] tracking-tighter">Guide Found!</h3>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-[#dddddd] shadow-xl">
                   <div className="flex items-center gap-6 mb-8">
                      <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-24 h-24 rounded-3xl object-cover shadow-lg" alt=""/>
                      <div className="flex-1">
                         <h4 className="font-black text-2xl text-[#222222] tracking-tight">{matchedGuide?.name}</h4>
                         <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-[10px] font-black">
                               <Star size={12} className="fill-current" /> 4.8
                            </div>
                            <span className="text-[10px] font-bold text-[#717171] uppercase tracking-widest">5+ Yrs Exp</span>
                         </div>
                         <p className="text-xs text-[#717171] mt-2 font-medium">Fluent in {matchedGuide?.languages?.join(', ') || 'Hindi, Odia, English'}</p>
                      </div>
                   </div>

                   <div className="bg-[#f7f7f7] p-6 rounded-3xl text-center border border-[#dddddd] mb-8">
                      <p className="text-[10px] font-black uppercase text-[#ff385c] mb-4 tracking-[0.3em]">Meeting Code (OTP)</p>
                      <div className="flex justify-center gap-3">
                         {(activeBooking?.otp || '0000').split('').map((num, i) => (
                           <div key={i} className="w-12 h-16 bg-white border border-[#dddddd] rounded-xl flex items-center justify-center text-3xl font-black text-[#222222] shadow-sm">{num}</div>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-3">
                      <a href={`tel:${matchedGuide?.phone || '9999999999'}`} className="flex flex-col items-center gap-2 p-4 bg-[#f7f7f7] rounded-2xl hover:bg-[#222222] hover:text-white transition-all group">
                         <Phone size={20} className="text-[#222222] group-hover:text-white" />
                         <span className="text-[10px] font-bold uppercase">Call</span>
                      </a>
                      <a href={`https://wa.me/91${matchedGuide?.phone || '9999999999'}`} className="flex flex-col items-center gap-2 p-4 bg-[#f7f7f7] rounded-2xl hover:bg-[#25D366] hover:text-white transition-all group">
                         <MessageCircle size={20} className="text-[#222222] group-hover:text-white" />
                         <span className="text-[10px] font-bold uppercase">WhatsApp</span>
                      </a>
                      <a href={`sms:${matchedGuide?.phone || '9999999999'}`} className="flex flex-col items-center gap-2 p-4 bg-[#f7f7f7] rounded-2xl hover:bg-[#222222] hover:text-white transition-all group">
                         <Send size={20} className="text-[#222222] group-hover:text-white" />
                         <span className="text-[10px] font-bold uppercase">Message</span>
                      </a>
                   </div>
                </div>

                <div className="bg-[#f7f7f7] p-6 rounded-3xl border border-[#dddddd] space-y-3">
                   <div className="flex justify-between text-xs"><span className="text-[#717171] font-bold uppercase tracking-widest">Plan</span><span className="text-[#222222] font-black uppercase tracking-widest">{formData.plan}</span></div>
                   <div className="flex justify-between text-xs"><span className="text-[#717171] font-bold uppercase tracking-widest">Language</span><span className="text-[#222222] font-black uppercase tracking-widest">{formData.language}</span></div>
                   <div className="flex justify-between text-xs pt-3 border-t border-[#dddddd]"><span className="text-[#717171] font-bold uppercase tracking-widest">Total Cost</span><span className="text-xl font-black text-[#222222]">₹{formData.price}</span></div>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-bold leading-relaxed border border-blue-100">
                    <ShieldCheck size={20} className="shrink-0"/> Wait for the guide to arrive and share the OTP only after you meet them.
                  </div>
                  <button onClick={() => alert('Guide is being notified that you are waiting!')} className="w-full py-5 bg-[#222222] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">I have called the guide</button>
                </div>
              </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {/* 5. TRIP LIVE SCREEN */}
        {localScreen === 'trip-live' && (
          <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper hideHeader>
              <div className="flex-1 flex flex-col pt-12 pb-10">
                <div className="text-center mb-12">
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live Trip
                   </div>
                   <h3 className="text-6xl font-black text-[#222222] tracking-tighter italic">{formatTime(tripTimer)}</h3>
                   <p className="text-[#717171] font-bold uppercase tracking-widest text-xs mt-4">Session Progress</p>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-[#dddddd] shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-center">
                   <div className="absolute top-0 right-0 p-8 text-[#f7f7f7]"><Zap size={120} className="fill-current"/></div>
                   
                   <div className="relative z-10 text-center">
                      <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-32 h-32 rounded-[2.5rem] mx-auto mb-8 border-4 border-white shadow-xl" alt=""/>
                      <h4 className="text-3xl font-black text-[#222222] tracking-tighter mb-2 italic">{matchedGuide?.name}</h4>
                      <p className="text-sm font-bold text-[#717171] uppercase tracking-widest mb-10">Exploring {formData.location}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <a href={`tel:${matchedGuide?.phone}`} className="flex items-center justify-center gap-3 py-4 bg-[#222222] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl">
                            <Phone size={16}/> Call
                         </a>
                         <button onClick={() => navigate('/emergency')} className="flex items-center justify-center gap-3 py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold text-xs uppercase tracking-widest">
                            <AlertCircle size={16}/> Support
                         </button>
                      </div>
                   </div>
                </div>

                <p className="text-center text-[10px] font-black text-[#717171] uppercase tracking-widest mt-12 opacity-60">Enjoy your tour with GuideGo</p>
              </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {/* 6. PAYMENT + SUMMARY */}
        {localScreen === 'payment' && (
          <motion.div key="pay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper hideHeader>
              <div className="space-y-12 flex-1 flex flex-col py-12">
                <div className="text-center">
                   <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner"><CheckCircle size={48}/></div>
                   <h3 className="text-4xl font-black text-[#222222] tracking-tighter">Trip Summary</h3>
                </div>

                <div className="bg-[#f7f7f7] p-8 rounded-[3rem] border border-[#dddddd] space-y-6">
                   <div className="flex justify-between items-end border-b border-[#dddddd] pb-6">
                      <div><p className="text-[10px] font-bold text-[#717171] uppercase">Duration</p><p className="text-2xl font-black text-[#222222]">{Math.floor(tripTimer / 60)} mins</p></div>
                      <div className="text-right"><p className="text-[10px] font-bold text-[#717171] uppercase">Location</p><p className="text-lg font-bold text-[#222222]">{formData.location}</p></div>
                   </div>
                   <div className="flex justify-between items-center pt-2">
                      <p className="text-base font-bold text-[#717171]">Total Fee</p>
                      <p className="text-5xl font-black text-[#222222] tracking-tighter italic">₹{formData.price}</p>
                   </div>
                </div>

                <div className="space-y-4 mt-auto">
                   <p className="text-center text-[10px] font-black text-[#717171] uppercase tracking-widest">Select Payment Method</p>
                   <div className="grid grid-cols-2 gap-4">
                      <button onClick={handleCompletePayment} className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-[#222222] rounded-[2rem] hover:bg-[#f7f7f7] transition-all">
                         <DollarSign size={24}/> <span className="text-xs font-bold uppercase">Cash</span>
                      </button>
                      <button onClick={handleCompletePayment} className="flex flex-col items-center gap-3 p-6 bg-white border border-[#dddddd] rounded-[2rem] hover:bg-[#f7f7f7] transition-all">
                         <Zap size={24}/> <span className="text-xs font-bold uppercase">UPI</span>
                      </button>
                   </div>
                </div>
              </div>
            </ScreenWrapper>
          </motion.div>
        )}

        {/* 7. REVIEW SCREEN */}
        {localScreen === 'review' && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenWrapper hideHeader>
              <div className="space-y-10 flex-1 flex flex-col py-12">
                <div className="text-center">
                  <img src={matchedGuide?.profilePicture} className="w-24 h-24 rounded-3xl mx-auto mb-6 shadow-xl object-cover" alt=""/>
                  <h3 className="text-4xl font-black text-[#222222] tracking-tighter italic">How was {matchedGuide?.name}?</h3>
                </div>

                <div className="flex justify-center gap-4 py-4">
                  {[1, 2, 3, 4, 5].map(star => ( 
                    <button 
                      key={star} 
                      onClick={() => setUserRating(star)}
                      className={`transition-all duration-300 transform ${userRating >= star ? 'scale-110' : 'scale-100 opacity-30 grayscale'}`}
                    >
                      <Star size={44} className={userRating >= star ? 'text-amber-400 fill-current' : 'text-[#dddddd]'} /> 
                    </button>
                  ))}
                </div>

                <div className="bg-[#f7f7f7] p-8 rounded-[2rem] border border-[#dddddd] flex-1">
                  <textarea 
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Describe your adventure with our expert..." 
                    className="w-full bg-transparent border-none text-[#222222] font-medium p-0 focus:ring-0 h-full min-h-[150px] resize-none text-sm placeholder:text-slate-400" 
                  />
                </div>

                <button onClick={handleSubmitReview} className="w-full py-5 bg-[#ff385c] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-rose-500/20">Submit & Finish</button>
              </div>
            </ScreenWrapper>
          </motion.div>
        )}
        
        </AnimatePresence>
    </div>
  );
};

export default BookGuidePage;
