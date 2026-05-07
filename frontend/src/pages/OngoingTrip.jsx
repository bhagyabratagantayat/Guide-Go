import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Phone, MessageSquare, Star, Timer, 
  ShieldAlert, Share2, ArrowRight, CheckCircle
} from 'lucide-react';
import { useBooking, TRIP_STATUS } from '../context/BookingContext';
import api from '../utils/api';
import PageLoader from '../components/PageLoader';

const OngoingTrip = () => {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const { 
    tripStatus, setTripStatus, bookingData, matchedGuide, 
    tripTimer, isRestoring, resetBooking, forceSyncBooking 
  } = useBooking();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [internalLoading, setInternalLoading] = useState(!bookingData);

  // 1. Explicit Fetch on Refresh/Direct Link
  useEffect(() => {
    const fetchSpecificBooking = async () => {
      // If we already have the right data, stop loading
      if (bookingData && bookingData._id === bookingId) {
        setInternalLoading(false);
        return;
      }
      
      try {
        setInternalLoading(true);
        const { data } = await api.get(`/bookings/${bookingId}`);
        if (data) {
          forceSyncBooking(data);
        }
      } catch (err) {
        console.error('Failed to restore specific booking:', err);
        navigate('/');
      } finally {
        setInternalLoading(false);
      }
    };

    fetchSpecificBooking();
  }, [bookingId, bookingData, navigate, forceSyncBooking]);

  // 2. Safety Redirect: Only if we are sure there's no trip
  useEffect(() => {
    if (!isRestoring && !internalLoading && tripStatus === TRIP_STATUS.IDLE) {
      navigate('/');
    }
  }, [tripStatus, isRestoring, internalLoading, navigate]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateLiveCost = (seconds, totalAmount, planLabel) => {
    if (!totalAmount) return 0;
    const planHours = planLabel === 'Full Day' ? 8 : parseInt(planLabel) || 2;
    const totalSeconds = planHours * 3600;
    const cost = (totalAmount / totalSeconds) * seconds;
    return Math.max(0, Math.min(totalAmount, Math.round(cost)));
  };

  const handleEndTrip = async () => {
    if (!window.confirm('Are you sure you want to end the trip now?')) return;
    try {
      await api.post(`/bookings/end/${bookingId}`);
      setTripStatus(TRIP_STATUS.COMPLETED);
    } catch (err) {
      alert('Failed to end trip. Please try again.');
    }
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      await api.post(`/bookings/${bookingId}/review`, {
        rating: userRating,
        comment: userComment
      });
      setIsSuccess(true);
      setTimeout(() => {
        resetBooking();
        navigate('/');
      }, 3000);
    } catch (err) {
      alert('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareTrip = () => {
    const text = `I'm on a trip with GuideGo! Track my location and session.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (isRestoring || internalLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#f7f7f7] lg:p-10 flex items-center justify-center">
      <Helmet>
        <title>Active Trip | GuideGo</title>
      </Helmet>

      <AnimatePresence mode="wait">
        {tripStatus === TRIP_STATUS.ONGOING ? (
          <motion.div key="ongoing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl p-6">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- LEFT COL: GUIDE INFO --- */}
                <div className="bg-[#222222] p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col justify-between space-y-8">
                   <div className="flex flex-col items-center text-center space-y-5">
                      <div className="relative">
                         <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/10 p-1">
                            <img 
                               src={matchedGuide?.profilePicture || 'https://ui-avatars.com/api/?name=' + matchedGuide?.name} 
                               className="w-full h-full object-cover rounded-full" 
                               alt="Guide"
                            />
                         </div>
                         <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#222222]" />
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-3xl font-black italic tracking-tighter leading-none">{matchedGuide?.name || 'Your Guide'}</h3>
                         <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest">
                               <Star size={14} fill="currentColor" /> {matchedGuide?.rating || '5.0'} • Superguide
                            </div>
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-2">
                               {matchedGuide?.languages?.join(', ') || 'English, Hindi, Odia'}
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      <a href={`tel:${matchedGuide?.mobile}`} className="flex items-center justify-center gap-3 p-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                         <Phone size={18} />
                         <span className="text-[9px] font-black uppercase">Call</span>
                      </a>
                      <button onClick={() => navigate(`/chat/${bookingId}`)} className="flex items-center justify-center gap-3 p-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                         <MessageSquare size={18} />
                         <span className="text-[9px] font-black uppercase">Chat</span>
                      </button>
                   </div>
                </div>

                {/* --- MIDDLE COL: LIVE TIMER & COST --- */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-[#eeeeee] flex flex-col items-center text-center space-y-10 justify-center shadow-xl">
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
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <Timer size={24} className="text-[#ff385c] mb-2" />
                         <span className="text-4xl font-black text-[#222222] font-mono tracking-tighter leading-none">{formatTime(tripTimer)}</span>
                         <span className="text-[9px] font-black text-[#717171] uppercase tracking-[0.2em] mt-2">Live Session</span>
                      </div>
                   </div>

                   <div className="w-full bg-[#f7f7f7] p-8 rounded-[2rem] space-y-1 border border-[#eeeeee]">
                      <p className="text-[10px] font-black text-[#717171] uppercase tracking-widest mb-1">Estimated Cost</p>
                      <p className="text-5xl font-black text-emerald-500 italic">₹{calculateLiveCost(tripTimer, bookingData?.price, bookingData?.plan)}</p>
                   </div>

                   <button 
                      onClick={handleEndTrip}
                      className="w-full py-6 bg-[#222222] text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-95 transition-all"
                   >
                      End Trip & Pay
                   </button>
                </div>

                {/* --- RIGHT COL: STATS & SOS --- */}
                <div className="bg-[#f7f7f7] p-8 rounded-[2.5rem] border border-[#eeeeee] flex flex-col justify-between space-y-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <h4 className="text-[10px] font-black text-[#ff385c] uppercase tracking-widest">Ongoing Trip</h4>
                         </div>
                         <h2 className="text-3xl font-black text-[#222222] italic leading-tight">{bookingData?.location}</h2>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-[#eeeeee] space-y-4 shadow-sm">
                         <div className="flex justify-between items-center text-[10px] font-bold text-[#717171] uppercase tracking-widest">
                            <span>Plan</span>
                            <span className="text-[#222222] font-black">{bookingData?.plan}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold text-[#717171] uppercase tracking-widest">
                            <span>Language</span>
                            <span className="text-[#222222] font-black">{bookingData?.language}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold text-[#717171] uppercase tracking-widest">
                            <span>Total Limit</span>
                            <span className="text-rose-500 font-black">₹{bookingData?.price}</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <button onClick={handleShareTrip} className="w-full py-4 bg-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#222222] border border-[#dddddd] flex items-center justify-center gap-3">
                         <Share2 size={16} /> Share Trip
                      </button>
                      <button onClick={() => setShowReportModal(true)} className="w-full py-5 bg-rose-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-500/20 flex items-center justify-center gap-3 hover:bg-rose-600 transition-all">
                         <ShieldAlert size={16} /> EMERGENCY SOS
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        ) : tripStatus === TRIP_STATUS.COMPLETED ? (
          <motion.div key="end" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl p-6">
             {isSuccess ? (
                <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center justify-center space-y-10 shadow-2xl">
                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-40 h-40 bg-emerald-500 text-white rounded-full flex items-center justify-center border-8 border-emerald-100 shadow-2xl">
                      <CheckCircle size={80} />
                   </motion.div>
                   <div className="text-center">
                      <h2 className="text-4xl font-black italic">Trip Completed!</h2>
                      <p className="text-slate-400 mt-2">Redirecting to home...</p>
                   </div>
                </div>
             ) : (
                <div className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-2xl">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div className="space-y-8">
                         <h2 className="text-5xl font-black italic leading-tight">How was your adventure?</h2>
                         <div className="bg-[#f7f7f7] p-8 rounded-[2.5rem] flex items-center gap-6">
                            <img src={matchedGuide?.profilePicture} className="w-16 h-16 rounded-full" alt="" />
                            <div>
                               <p className="text-[10px] font-black uppercase text-[#717171]">Your Guide</p>
                               <p className="text-xl font-bold">{matchedGuide?.name}</p>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="flex gap-4 justify-center">
                            {[1, 2, 3, 4, 5].map(star => (
                               <button key={star} onClick={() => setUserRating(star)}>
                                  <Star size={48} className={star <= userRating ? 'text-amber-500 fill-current' : 'text-slate-200'} />
                               </button>
                            ))}
                         </div>
                         <textarea 
                            className="w-full p-8 bg-[#f7f7f7] rounded-[2rem] border-none focus:ring-2 focus:ring-[#ff385c]"
                            placeholder="Share your experience..."
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                         />
                         <button 
                            onClick={handleSubmitReview}
                            disabled={isSubmitting}
                            className="w-full py-6 bg-[#222222] text-white rounded-full font-black uppercase tracking-widest shadow-xl disabled:opacity-50"
                         >
                            {isSubmitting ? 'Submitting...' : 'Complete & Pay'}
                         </button>
                      </div>
                   </div>
                </div>
             )}
          </motion.div>
        ) : (
          <div className="text-center space-y-4">
             <PageLoader />
             <p className="text-sm font-bold text-[#717171]">Synchronizing trip data...</p>
          </div>
        )}
      </AnimatePresence>

      {/* SOS MODAL */}
      <AnimatePresence>
         {showReportModal && (
            <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
               <div className="bg-white rounded-[3rem] p-10 max-w-md w-full space-y-8 shadow-2xl">
                  <h3 className="text-2xl font-black italic text-center">Emergency SOS</h3>
                  <div className="space-y-3">
                     {['Misbehavior', 'Route Deviation', 'Safety Issue'].map(r => (
                        <button key={r} onClick={() => setShowReportModal(false)} className="w-full py-4 bg-rose-50 text-rose-500 rounded-2xl font-black uppercase tracking-widest border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">{r}</button>
                     ))}
                  </div>
                  <button onClick={() => setShowReportModal(false)} className="w-full py-2 text-[#717171] font-bold uppercase tracking-widest">Dismiss</button>
               </div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default OngoingTrip;
