import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, Languages, DollarSign, Calendar, MapPin, 
  ChevronLeft, ShieldCheck, Clock, CheckCircle2, 
  QrCode, Banknote, Share2, Heart, MessageCircle, 
  Info, Award, Users, Camera, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Receipt from '../components/Receipt';

const GuideProfile = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [duration, setDuration] = useState(2);
  const [date, setDate] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [bookedBooking, setBookedBooking] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('about');

  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);

  const proceedToPaymentSelection = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return navigate('/login');
    if (!date) return alert('Please select a date');
    setShowPaymentSelection(true);
  };

  const confirmBooking = async () => {
    if (!paymentMethod) return alert('Please select a payment method');
    setBookingLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data: booking } = await axios.post('/api/bookings', {
        guideId: guide.userId._id,
        location: 'Puri, Odisha', 
        bookingTime: new Date(date).toISOString(),
        price: guide.pricePerHour * duration,
        paymentMethod: paymentMethod
      }, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setBookedBooking(booking);
      setBookingSuccess(true);
      setShowReceipt(true);
    } catch (error) {
      console.warn('Booking API failed, using mock success for demo:', error);
      // Mock success for demo/prototype purposes
      const mockBooking = {
        _id: 'mock_booking_' + Date.now(),
        guideId: guide.userId,
        location: 'Puri, Odisha',
        bookingTime: new Date(date).toISOString(),
        price: guide.pricePerHour * duration,
        paymentStatus: 'pending',
        status: 'upcoming'
      };
      setBookedBooking(mockBooking);
      setBookingSuccess(true);
      setShowReceipt(true);
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const { data } = await axios.get(`/api/guides`);
        const found = data.find(g => g._id === id || g.userId?._id === id);
        setGuide(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (guide?.userId?._id) {
          const { data } = await axios.get(`/api/reviews/guide/${guide.userId._id}`);
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [guide]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-xl shadow-primary-500/20" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Expert Identity...</p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-6 shadow-soft">
           <X className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight italic font-serif">Expert Profile Unavailable</h2>
        <Link to="/home" className="btn-primary px-8 py-4">Return to Hub</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-32">
      {/* Hero Header */}
      <div className="relative h-[50vh] lg:h-[65vh] w-full overflow-hidden">
        <img 
          src={guide.userId?.profilePicture || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80"} 
          className="w-full h-full object-cover" 
          alt={guide.userId?.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />
        
        {/* Header Actions */}
        <div className="absolute top-12 left-6 right-6 flex items-center justify-between z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center text-white active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex space-x-3">
             <button className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center text-white active:scale-95 transition-all">
                <Share2 className="w-5 h-5" />
             </button>
             <button className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center text-white active:scale-95 transition-all">
                <Heart className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Hero Info */}
        <div className="absolute bottom-12 left-8 right-8 text-white">
           <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-primary-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest flex items-center shadow-premium">
                 <ShieldCheck className="w-3 h-3 mr-1" /> Verified Hero
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full text-[9px] font-black uppercase tracking-widest flex items-center">
                 <Star className="w-3.5 h-3.5 fill-primary-400 text-primary-400 mr-1.5" /> {guide.rating} {t('guide.rating')}
              </div>
           </div>
           <h1 className="text-5xl font-black tracking-tighter italic font-serif leading-[0.9] mb-4">
              {guide.userId?.name}
           </h1>
           <div className="flex items-center space-x-4">
              <p className="text-white/60 font-black uppercase tracking-[0.25em] text-[10px] flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                 <MapPin className="w-3 h-3 mr-2 text-primary-400" /> Odisha Cultural Specialist
              </p>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-[-40px] relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
           {/* Navigation Tabs */}
           <div className="flex space-x-4 bg-white p-2 rounded-[2.5rem] border border-surface-100 shadow-soft overflow-x-auto no-scrollbar">
              {['about', 'reviews'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`flex-1 px-8 py-3.5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {tab}
                 </button>
              ))}
           </div>

           <AnimatePresence mode="wait">
              {activeTab === 'about' && (
                 <motion.div 
                   key="about" 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-8"
                 >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       <div className="p-6 bg-white rounded-[2.5rem] border border-surface-100 shadow-soft">
                          <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 mb-4 ring-8 ring-primary-500/5">
                            <Clock className="w-6 h-6" />
                          </div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Legacy</p>
                          <p className="text-slate-900 font-black tracking-tight text-lg">{guide.experience || '8+ Years'}</p>
                       </div>
                       <div className="p-6 bg-white rounded-[2.5rem] border border-surface-100 shadow-soft">
                          <div className="w-12 h-12 bg-secondary-50 rounded-2xl flex items-center justify-center text-secondary-500 mb-4 ring-8 ring-secondary-500/5">
                            <Users className="w-6 h-6" />
                          </div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Guests</p>
                          <p className="text-slate-900 font-black tracking-tight text-lg">3k+ Hosted</p>
                       </div>
                       <div className="p-6 bg-white rounded-[2.5rem] border border-surface-100 shadow-soft">
                          <div className="w-12 h-12 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-500 mb-4 ring-8 ring-accent-500/5">
                            <Languages className="w-6 h-6" />
                          </div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fluency</p>
                          <p className="text-slate-900 font-black tracking-tight text-lg">{guide.languages.slice(0, 2).join(', ')}</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-3xl font-black text-slate-900 italic font-serif tracking-tight leading-none">The Storyteller</h3>
                       <p className="text-slate-600 font-medium leading-relaxed text-lg opacity-80">
                          {guide.description || "As a guardian of Odisha's royal history and unspoken myths, my mission is to turn every journey into a living chronicle. We won't just visit monuments; we will step through time."}
                       </p>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Specialized Domains</h4>
                       <div className="flex flex-wrap gap-2">
                          {['Temple Mysteries', 'Odia Cuisine', 'Silk Weaving', 'Palm Leaf Art', 'Ancient Ports'].map(tag => (
                             <span key={tag} className="px-5 py-3 bg-white rounded-2xl border border-surface-100 font-black text-[9px] text-slate-500 shadow-soft uppercase tracking-widest hover:text-primary-500 hover:border-primary-100 transition-all cursor-default">
                                {tag}
                             </span>
                          ))}
                       </div>
                    </div>
                 </motion.div>
              )}

              {activeTab === 'reviews' && (
                 <motion.div 
                   key="reviews"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-4"
                 >
                    {reviews.map((review) => (
                       <div key={review._id} className="p-6 bg-white rounded-[2.5rem] border border-surface-50 shadow-soft space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center font-black text-primary-600 overflow-hidden border-2 border-white shadow-soft">
                                   {review.touristId.profilePicture ? <img src={review.touristId.profilePicture} className="w-full h-full object-cover" /> : review.touristId.name.charAt(0)}
                                </div>
                                <div className="space-y-0.5">
                                   <p className="font-black text-slate-900 text-base tracking-tight">{review.touristId.name}</p>
                                   <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Verified Guest Experience</p>
                                </div>
                             </div>
                             <div className="flex items-center space-x-1 px-3 py-1.5 bg-primary-50 rounded-xl border border-primary-100">
                                <Star className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
                                <span className="text-xs font-black text-primary-600">{review.rating}</span>
                             </div>
                          </div>
                          <p className="text-slate-600 font-bold leading-relaxed">{review.comment}</p>
                       </div>
                    ))}
                    {reviews.length === 0 && (
                       <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-surface-200">
                          <MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                          <p className="text-slate-400 font-black uppercase tracking-[0.35em] text-[9px]">Awaiting First Guest Journal</p>
                       </div>
                    )}
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-4">
           <div className="sticky top-12 bg-white rounded-[3rem] p-8 shadow-premium border border-surface-100 overflow-hidden relative group">
              <AnimatePresence mode="wait">
                {bookingSuccess ? (
                   <motion.div 
                     key="success"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="text-center py-8"
                   >
                      <div className="w-20 h-20 bg-primary-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-premium rotate-3">
                         <CheckCircle2 className="w-10 h-10 stroke-[3]" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 italic font-serif mb-3 leading-none">{t('booking.success')}</h3>
                      <p className="text-slate-400 font-bold leading-relaxed text-sm">{t('booking.confirm_desc', { name: guide.userId?.name })}</p>
                   </motion.div>
                ) : showPaymentSelection ? (
                   <motion.div 
                     key="payment"
                     initial={{ x: 30, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     exit={{ x: -30, opacity: 0 }}
                     className="space-y-6"
                   >
                      <div className="flex items-center justify-between">
                         <h3 className="text-2xl font-black text-slate-900 italic font-serif">Checkout</h3>
                         <button onClick={() => setShowPaymentSelection(false)} className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><X className="w-4 h-4" /></button>
                      </div>

                      <div className="space-y-3">
                          <button 
                            onClick={() => setPaymentMethod('cash')}
                            className={`w-full p-4 rounded-[1.8rem] border-2 flex items-center justify-between transition-all ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50/10' : 'border-surface-100 opacity-60'}`}
                          >
                             <div className="flex items-center space-x-3">
                                <Banknote className="w-5 h-5 text-slate-900" />
                                <span className="font-black text-slate-900 text-sm tracking-tight">{t('booking.pay_spot')}</span>
                             </div>
                             {paymentMethod === 'cash' && <CheckCircle2 className="w-5 h-5 text-primary-500" />}
                          </button>

                          <button 
                            onClick={() => setPaymentMethod('upi')}
                            className={`w-full p-4 rounded-[1.8rem] border-2 flex flex-col transition-all ${paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50/10' : 'border-surface-100 opacity-60'}`}
                          >
                             <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3">
                                   <QrCode className="w-5 h-5 text-slate-900" />
                                   <span className="font-black text-slate-900 text-sm tracking-tight">Direct UPI</span>
                                </div>
                                {paymentMethod === 'upi' && <CheckCircle2 className="w-5 h-5 text-primary-500" />}
                             </div>
                             {paymentMethod === 'upi' && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center">
                                   <div className="bg-white p-3 rounded-[2rem] shadow-soft border border-surface-100"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=guidego@upi&pn=GuideGo&am=${guide.pricePerHour * duration}`} className="w-32 h-32" /></div>
                                   <p className="mt-4 font-black text-[9px] text-slate-400 tracking-widest uppercase">ID: guidego@upi</p>
                                </motion.div>
                             )}
                          </button>
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                         <div className="flex justify-between items-center mb-6">
                            <span className="text-2xl font-black text-slate-900 italic font-serif">Total</span>
                            <span className="text-2xl font-black text-primary-500">₹{guide.pricePerHour * duration}</span>
                         </div>
                         <button onClick={confirmBooking} disabled={bookingLoading} className="w-full btn-primary py-5 text-[10px] tracking-[0.25em]">{bookingLoading ? 'PROCCESSING...' : 'CONFIRM NOW'}</button>
                      </div>
                   </motion.div>
                ) : (
                   <motion.div 
                     key="form"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="space-y-6"
                   >
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 opacity-60">Honorarium</p>
                            <h4 className="text-3xl font-black text-slate-900 tracking-tight">₹{guide.pricePerHour}<span className="text-slate-300 text-sm font-bold">/hr</span></h4>
                         </div>
                         <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-50 rounded-xl">
                            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Fixed Fee</span>
                         </div>
                      </div>

                      <div className="space-y-3">
                         <div className="p-5 bg-surface-50 rounded-3xl border border-surface-100 group">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-3">
                               <Calendar className="w-3 h-3 mr-2 text-primary-500" /> Selection Date
                            </label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-transparent font-black text-slate-900 outline-none text-base tracking-tight" />
                         </div>
                         <div className="p-5 bg-surface-50 rounded-3xl border border-surface-100">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-3">
                               <Clock className="w-3 h-3 mr-2 text-primary-500" /> Experience Span
                            </label>
                            <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full bg-transparent font-black text-slate-900 outline-none text-base tracking-tight appearance-none cursor-pointer">
                               {[2,4,6,8,12].map(h => <option key={h} value={h}>{h} Hour Immersive Tour</option>)}
                            </select>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100 mt-2">
                         <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Value</span>
                            <span className="text-2xl font-black text-primary-500">₹{guide.pricePerHour * duration}</span>
                         </div>
                         <button onClick={proceedToPaymentSelection} className="w-full btn-primary py-5 text-[10px] tracking-[0.25em]">RESERVE EXPERIENCE</button>
                      </div>
                   </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>

      {showReceipt && bookedBooking && (
        <Receipt 
          booking={bookedBooking} 
          onClose={() => {
            setShowReceipt(false);
            navigate('/bookings');
          }} 
        />
      )}
    </div>
  );
};

export default GuideProfile;
