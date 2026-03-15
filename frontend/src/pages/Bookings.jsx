import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, Clock, CheckCircle, Clock3, XCircle, 
  MapPin, User, MessageSquare, Star, ChevronRight, 
  Filter, MoreHorizontal, History as HistoryIcon, 
  Wallet, Bookmark
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewModal from '../components/ReviewModal';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      const endpoint = user.role === 'guide' ? '/api/bookings/guide' : '/api/bookings/user';
      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      fetchBookings();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return b.status === 'pending';
    if (activeFilter === 'history') return ['completed', 'cancelled'].includes(b.status);
    return true;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed': return { color: 'bg-green-50 text-green-600 border-green-100', icon: CheckCircle };
      case 'pending': return { color: 'bg-orange-50 text-orange-600 border-orange-100', icon: Clock3 };
      case 'completed': return { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: CheckCircle };
      case 'cancelled': return { color: 'bg-red-50 text-red-600 border-red-100', icon: XCircle };
      default: return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: Clock3 };
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 pb-32">
       {/* Header Section */}
       <div className="bg-white border-b border-slate-100 pt-32 pb-12 px-8">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                   <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic font-serif leading-tight mb-3">Reservations</h1>
                   <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Manage your travel itinerary & experiences</p>
                </div>
                
                {/* Filter Controls */}
                <div className="flex bg-slate-50 p-1.5 rounded-[2.5rem] border border-slate-200">
                   {[
                      { id: 'all', label: 'Overview', icon: Bookmark },
                      { id: 'pending', label: 'Active', icon: Clock3 },
                      { id: 'history', label: 'History', icon: HistoryIcon }
                   ].map(filter => (
                      <button 
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === filter.id ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                         <filter.icon className="w-3.5 h-3.5" />
                         <span>{filter.label}</span>
                      </button>
                   ))}
                </div>
             </div>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-6 mt-12">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retrieving Itinerary...</p>
             </div>
          ) : (
             <motion.div 
               layout
               className="grid grid-cols-1 gap-8"
             >
                <AnimatePresence mode="popLayout">
                   {filteredBookings.map((booking) => {
                      const { color, icon: StatusIcon } = getStatusConfig(booking.status);
                      const displayUser = user.role === 'guide' ? booking.touristId : booking.guideId;

                      return (
                         <motion.div 
                           key={booking._id}
                           layout
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-100 shadow-premium flex flex-col lg:flex-row lg:items-center justify-between gap-10 group relative overflow-hidden"
                         >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-primary-500/10 transition-colors" />
                            
                            <div className="flex-grow flex items-center space-x-8 relative z-10">
                               <div className="relative group">
                                  <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-inner group-hover:border-primary-200 transition-colors">
                                     {displayUser?.profilePicture ? (
                                        <img src={displayUser.profilePicture} className="w-full h-full object-cover" alt={displayUser.name} />
                                     ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-300 italic font-serif group-hover:text-primary-300">
                                           {displayUser?.name?.charAt(0)}
                                        </div>
                                     )}
                                  </div>
                                  <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg ${color}`}>
                                     <StatusIcon className="w-4 h-4" />
                                  </div>
                               </div>

                               <div className="space-y-3">
                                  <div className="flex items-center space-x-4">
                                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic font-serif leading-none">{displayUser?.name}</h3>
                                     <div className={`px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center`}>
                                        <StatusIcon className="w-3 h-3 mr-1.5" /> {booking.status}
                                     </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                     <div className="flex items-center group/info">
                                        <Calendar className="w-3.5 h-3.5 mr-2 text-primary-500 group-hover/info:scale-125 transition-transform" /> 
                                        {new Date(booking.bookingTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                     </div>
                                     <div className="flex items-center group/info">
                                        <Clock className="w-3.5 h-3.5 mr-2 text-orange-500 group-hover/info:scale-125 transition-transform" />
                                        {new Date(booking.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                     </div>
                                     <div className="flex items-center group/info">
                                        <MapPin className="w-3.5 h-3.5 mr-2 text-red-500 group-hover/info:scale-125 transition-transform" />
                                        {booking.location}
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <div className="flex items-center justify-between lg:justify-end gap-12 pt-8 lg:pt-0 border-t lg:border-t-0 border-slate-50 relative z-10">
                               <div className="text-left lg:text-right space-y-1">
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Payment Amount</p>
                                  <div className="flex items-baseline lg:justify-end space-x-1">
                                     <span className="text-sm font-black text-slate-400">₹</span>
                                     <span className="text-4xl font-black text-slate-900 tracking-tighter">{booking.price}</span>
                                  </div>
                               </div>

                               <div className="flex items-center gap-3">
                                  {user.role === 'guide' && booking.status === 'pending' && (
                                     <>
                                        <button 
                                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                          className="h-14 px-8 bg-primary-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
                                        >
                                          Confirm
                                        </button>
                                        <button 
                                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                          className="h-14 w-14 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center hover:bg-red-100 transition-all border border-red-100"
                                        >
                                          <XCircle className="w-6 h-6" />
                                        </button>
                                     </>
                                  )}
                                  {user.role === 'guide' && booking.status === 'confirmed' && (
                                     <button 
                                       onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                       className="h-14 px-8 bg-green-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-green-700 shadow-xl shadow-green-500/20 active:scale-95 transition-all"
                                     >
                                       Complete Tour
                                     </button>
                                  )}
                                  {user.role === 'tourist' && booking.status === 'completed' && !booking.reviewed && (
                                     <button 
                                       onClick={() => {
                                          setSelectedBooking(booking);
                                          setShowReviewModal(true);
                                       }}
                                       className="h-14 px-8 bg-yellow-400 text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 shadow-xl shadow-yellow-500/20 active:scale-95 transition-all flex items-center"
                                     >
                                        <Star className="w-4 h-4 mr-2" /> Write Review
                                     </button>
                                  )}
                                  <Link to={`/chat/${displayUser._id}`} className="h-14 w-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-black shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
                                     <MessageSquare className="w-5 h-5" />
                                  </Link>
                               </div>
                            </div>
                         </motion.div>
                      );
                   })}
                </AnimatePresence>

                {filteredBookings.length === 0 && (
                   <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 mt-4">
                      <div className="w-24 h-24 bg-primary-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-primary-100/50">
                         <Wallet className="w-10 h-10 text-primary-300" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-800 italic font-serif mb-4 leading-none">Your Itinerary is Empty</h3>
                      <p className="text-slate-400 font-bold max-w-sm mx-auto mb-10 text-sm leading-relaxed">It seems you haven't booked any experiences yet. <br /> The world is waiting for you to explore.</p>
                      <Link to="/home" className="btn-primary px-12 py-5 shadow-premium text-[11px]">
                         FIND YOUR FIRST GUIDE
                      </Link>
                   </div>
                )}
             </motion.div>
          )}
       </div>

       {showReviewModal && selectedBooking && (
          <ReviewModal 
            booking={selectedBooking} 
            onClose={() => setShowReviewModal(false)}
            onSuccess={() => {
               setShowReviewModal(false);
               fetchBookings();
            }}
          />
       )}
    </div>
  );
};

export default Bookings;
