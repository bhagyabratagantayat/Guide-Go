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
import Receipt from '../components/Receipt';

const GuideProfile = () => {
  const { id } = useParams();
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
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setBookedBooking(booking);
      setBookingSuccess(true);
      setShowReceipt(true);
    } catch (error) {
      alert('Booking failed: ' + (error.response?.data?.message || error.message));
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
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Expert Not Found</h2>
        <Link to="/home" className="btn-primary px-8">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-32">
      {/* Hero Header */}
      <div className="relative h-[45vh] lg:h-[55vh] w-full overflow-hidden">
        <img 
          src={guide.userId?.profilePicture || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80"} 
          className="w-full h-full object-cover" 
          alt={guide.userId?.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        
        {/* Header Actions */}
        <div className="absolute top-12 left-6 right-6 flex items-center justify-between z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex space-x-3">
             <button className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white">
                <Share2 className="w-5 h-5" />
             </button>
             <button className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white">
                <Heart className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Hero Info */}
        <div className="absolute bottom-10 left-8 right-8 text-white">
           <div className="flex items-center space-x-2 mb-3">
              <div className="px-3 py-1 bg-primary-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center">
                 <ShieldCheck className="w-3 h-3 mr-1" /> Licensed Expert
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center">
                 <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" /> {guide.rating}
              </div>
           </div>
           <h1 className="text-5xl font-black tracking-tighter italic font-serif leading-tight">
              {guide.userId?.name}
           </h1>
           <p className="text-white/70 font-bold uppercase tracking-[0.2em] text-xs mt-2 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-2 text-primary-400" /> Puri Heritage Specialist
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-10">
           {/* Navigation Tabs */}
           <div className="flex space-x-8 border-b border-slate-100 overflow-x-auto">
              {['about', 'availability', 'reviews'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary-600' : 'text-slate-400'}`}
                 >
                   {tab}
                   {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-full" />}
                 </button>
              ))}
           </div>

           <AnimatePresence mode="wait">
              {activeTab === 'about' && (
                 <motion.div 
                   key="about" 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-10"
                 >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                          <Clock className="w-6 h-6 text-primary-500 mb-3" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                          <p className="text-slate-900 font-black">{guide.experience || '5+ Years'}</p>
                       </div>
                       <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                          <Users className="w-6 h-6 text-orange-500 mb-3" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guided</p>
                          <p className="text-slate-900 font-black">2.5k+ Tourists</p>
                       </div>
                       <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                          <Languages className="w-6 h-6 text-green-500 mb-3" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speaking</p>
                          <p className="text-slate-900 font-black">{guide.languages.slice(0, 2).join(', ')}</p>
                       </div>
                       <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                          <Award className="w-6 h-6 text-blue-500 mb-3" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ranking</p>
                          <p className="text-slate-900 font-black">Top 10% Local</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-2xl font-black text-slate-900 italic font-serif">A Story Teller's Perspective</h3>
                       <p className="text-slate-600 font-bold leading-relaxed text-lg">
                          {guide.description || "I've spent my entire life exploring the mystical corners of Puri. From the sun-drenched beaches to the spiritual chants of the Jagannath Temple, I offer more than just a tour—I offer a journey through time and culture."}
                       </p>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Specialized Knowledge</h4>
                       <div className="flex flex-wrap gap-3">
                          {['History', 'Gastronomy', 'Local Art', 'Temple Rituals', 'Architecture'].map(tag => (
                             <span key={tag} className="px-5 py-3 bg-white rounded-2xl border border-slate-100 font-black text-xs text-slate-700 shadow-sm uppercase tracking-widest">
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
                   className="space-y-6"
                 >
                    {reviews.map((review) => (
                       <div key={review._id} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center font-black text-primary-600 overflow-hidden">
                                   {review.touristId.profilePicture ? <img src={review.touristId.profilePicture} className="w-full h-full object-cover" /> : review.touristId.name.charAt(0)}
                                </div>
                                <div>
                                   <p className="font-black text-slate-900">{review.touristId.name}</p>
                                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Visited March 2024</p>
                                </div>
                             </div>
                             <div className="flex items-center space-x-1.5 px-4 py-2 bg-slate-50 rounded-xl">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm font-black text-slate-900">{review.rating}</span>
                             </div>
                          </div>
                          <p className="text-slate-600 font-bold leading-relaxed">{review.comment}</p>
                       </div>
                    ))}
                    {reviews.length === 0 && (
                       <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                          <p className="text-slate-400 font-black uppercase tracking-[0.25em]">No Experiences Shared Yet</p>
                       </div>
                    )}
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-4">
           <div className="sticky top-12 bg-white rounded-[3rem] p-8 shadow-premium border border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
              
              {bookingSuccess ? (
                 <div className="text-center py-10 animate-in fade-in zoom-in duration-500 relative z-10">
                    <div className="w-24 h-24 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
                       <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 italic font-serif mb-4">You're All Set!</h3>
                    <p className="text-slate-500 font-bold">Your booking request has been sent to {guide.userId?.name}.</p>
                 </div>
              ) : showPaymentSelection ? (
                 <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500 relative z-10">
                    <div className="flex items-center justify-between">
                       <h3 className="text-3xl font-black text-slate-900 italic font-serif">Checkout</h3>
                       <button onClick={() => setShowPaymentSelection(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="space-y-4">
                        <button 
                          onClick={() => setPaymentMethod('cash')}
                          className={`w-full p-6 bg-slate-50 rounded-3xl border-3 flex items-center justify-between transition-all ${paymentMethod === 'cash' ? 'border-primary-500' : 'border-transparent'}`}
                        >
                          <div className="flex items-center space-x-4 text-left">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm"><Banknote className="w-6 h-6" /></div>
                             <div>
                                <p className="font-black text-slate-900">Pay on Spot</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reliable & Easy</p>
                             </div>
                          </div>
                          {paymentMethod === 'cash' && <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white"><CheckCircle2 className="w-4 h-4" /></div>}
                        </button>

                        <button 
                          onClick={() => setPaymentMethod('upi')}
                          className={`w-full p-6 bg-slate-50 rounded-3xl border-3 flex flex-col transition-all ${paymentMethod === 'upi' ? 'border-primary-500' : 'border-transparent'}`}
                        >
                          <div className="flex items-center justify-between w-full">
                             <div className="flex items-center space-x-4 text-left">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm"><QrCode className="w-6 h-6" /></div>
                                <div>
                                   <p className="font-black text-slate-900">Digital UPI</p>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by GuideGo Secure</p>
                                </div>
                             </div>
                             {paymentMethod === 'upi' && <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white"><CheckCircle2 className="w-4 h-4" /></div>}
                          </div>

                          {paymentMethod === 'upi' && (
                             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-8 pt-8 border-t border-slate-200 flex flex-col items-center">
                                <div className="bg-white p-3 rounded-3xl shadow-lg mb-6"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=guidego@upi&pn=GuideGo%20Platform&am=${guide.pricePerHour * duration}&cu=INR`} className="w-40 h-40" /></div>
                                <div className="px-6 py-3 bg-white rounded-full border border-slate-200 font-black text-sm text-slate-800 shadow-sm">ID: <span className="text-primary-600 tracking-wider">guidego@upi</span></div>
                             </motion.div>
                          )}
                        </button>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col space-y-6">
                       <div className="flex justify-between items-center text-3xl font-black text-slate-900">
                          <span className="italic font-serif">Total</span>
                          <span className="text-primary-600 group relative">
                             ₹{guide.pricePerHour * duration}
                             <div className="absolute -inset-2 bg-primary-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                       </div>
                       <button onClick={confirmBooking} disabled={bookingLoading} className="w-full btn-primary py-6 text-xs tracking-[0.3em]">{bookingLoading ? 'PROCESSING...' : 'COMPLETE RESERVATION'}</button>
                    </div>
                 </div>
              ) : (
                 <div className="space-y-8 relative z-10">
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Price per Hour</p>
                          <h4 className="text-3xl font-black text-slate-900 leading-none tracking-tight">₹{guide.pricePerHour}</h4>
                       </div>
                       <p className="text-xs font-black text-primary-500 uppercase tracking-widest">Inclusive Fee</p>
                    </div>

                    <div className="space-y-4">
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-3">
                             <Calendar className="w-3.5 h-3.5 mr-2 text-primary-500" /> Tour Date
                          </label>
                          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-transparent font-black text-slate-900 outline-none text-lg" />
                       </div>
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-3">
                             <Clock className="w-3.5 h-3.5 mr-2 text-orange-500" /> Duration (Hrs)
                          </label>
                          <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full bg-transparent font-black text-slate-900 outline-none text-lg">
                             {[2,3,4,5,6,8,12].map(h => <option key={h} value={h}>{h} Hours Passionate Tour</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                       <div className="flex justify-between items-center text-3xl font-black text-slate-900 mb-8">
                          <span className="italic font-serif">Estimated</span>
                          <span className="text-primary-600 group relative">
                             ₹{guide.pricePerHour * duration}
                             <div className="absolute -inset-2 bg-primary-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                       </div>
                       <button onClick={proceedToPaymentSelection} className="w-full btn-primary py-6 text-xs tracking-[0.3em] shadow-premium">PROCEED TO CHECKOUT</button>
                    </div>

                    <p className="text-[10px] text-center font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                       Secure 256-bit AES encrypted booking <br /> by GuideGo Travel Systems
                    </p>
                 </div>
              )}
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
