import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
  Calendar, Clock, CheckCircle, Clock3, XCircle, 
  MapPin, User, MessageSquare, Star, ChevronRight, 
  Filter, MoreHorizontal, History as HistoryIcon, 
  Wallet, Bookmark, Navigation
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
  const { t } = useTranslation();
  const { darkMode } = useTheme();

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
    if (activeFilter === 'upcoming') return ['pending', 'confirmed'].includes(b.status);
    if (activeFilter === 'completed') return b.status === 'completed';
    if (activeFilter === 'cancelled') return b.status === 'cancelled';
    return true; // all
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed': return { color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30', icon: CheckCircle };
      case 'pending': return { color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-900/30', icon: Clock3 };
      case 'completed': return { color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30', icon: CheckCircle };
      case 'cancelled': return { color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30', icon: XCircle };
      default: return { color: 'bg-surface-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-surface-200 dark:border-slate-700', icon: Clock3 };
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-slate-950 pb-32 transition-colors duration-300">
       {/* Header Section */}
       <section className="bg-white dark:bg-slate-900 pt-32 pb-16 px-8 border-b border-surface-100 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
             <div className="space-y-6">
                <div className="w-20 h-20 bg-slate-900 dark:bg-primary-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-premium rotate-3 transition-colors">
                   <Bookmark className="w-10 h-10" />
                </div>
                <div>
                   <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-[0.9] mb-4">
                     {t('common.bookings') || 'Travel Logs'}
                   </h1>
                   <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Your chronicle of Odisha's finest guided journeys</p>
                </div>
             </div>
             
             {/* Filter Controls */}
              <div className="flex bg-surface-50 dark:bg-slate-800 p-2 rounded-[3rem] border border-surface-100 dark:border-slate-700 shadow-inner overflow-x-auto no-scrollbar">
                 {[
                    { id: 'all', label: 'All', icon: HistoryIcon },
                    { id: 'upcoming', label: 'Upcoming', icon: Clock3 },
                    { id: 'completed', label: 'Completed', icon: CheckCircle },
                    { id: 'cancelled', label: 'Cancelled', icon: XCircle }
                 ].map(filter => (
                    <button 
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`flex items-center space-x-3 px-6 py-3 rounded-[2.2rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all shrink-0 ${activeFilter === filter.id ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-premium' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                       <filter.icon className="w-4 h-4" />
                       <span>{filter.label}</span>
                    </button>
                 ))}
              </div>
          </div>
       </section>

       <div className="max-w-7xl mx-auto px-6 mt-16">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-40 space-y-6">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-xl shadow-primary-500/20" />
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest tracking-[0.5em]">Synchronizing Records...</p>
             </div>
          ) : (
             <motion.div layout className="grid grid-cols-1 gap-8">
                <AnimatePresence mode="popLayout">
                   {filteredBookings.map((booking) => {
                      const { color, icon: StatusIcon } = getStatusConfig(booking.status);
                      const displayUser = user.role === 'guide' ? booking.touristId : booking.guideId;

                      return (
                         <motion.div 
                           key={booking._id}
                           layout
                           initial={{ opacity: 0, y: 30 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-surface-50 dark:border-slate-800 shadow-premium dark:shadow-none flex flex-col lg:flex-row lg:items-center justify-between gap-12 group hover:translate-y-[-4px] transition-all relative overflow-hidden"
                         >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-primary-500/10 transition-colors" />
                            
                            <div className="flex-grow flex items-center space-x-10 relative z-10">
                               <div className="relative">
                                  <div className="w-28 h-28 rounded-[2.5rem] bg-surface-50 dark:bg-slate-800 border-4 border-white dark:border-slate-800 overflow-hidden shadow-soft">
                                     {displayUser?.profilePicture ? (
                                        <img src={displayUser.profilePicture} className="w-full h-full object-cover" alt={displayUser.name} />
                                     ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-300 dark:text-slate-600 italic font-serif uppercase">
                                           {displayUser?.name?.charAt(0)}
                                        </div>
                                     )}
                                  </div>
                                  <div className={`absolute -bottom-1 -right-1 w-11 h-11 rounded-[1.3rem] border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg ${color}`}>
                                     <StatusIcon className="w-5 h-5" />
                                  </div>
                               </div>

                               <div className="space-y-5">
                                  <div className="flex items-center space-x-6">
                                     <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none truncate max-w-xs">{displayUser?.name}</h3>
                                     <div className={`px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.25em] shadow-sm border ${color} flex items-center`}>
                                        <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" /> {booking.status}
                                     </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                     <div className="flex items-center group/info">
                                        <Calendar className="w-4 h-4 mr-3 text-primary-500" />
                                        {new Date(booking.bookingTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                     </div>
                                     <div className="flex items-center group/info">
                                        <Clock className="w-4 h-4 mr-3 text-secondary-500" />
                                        {new Date(booking.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                     </div>
                                     <div className="flex items-center group/info">
                                        <MapPin className="w-4 h-4 mr-3 text-accent-500" />
                                        {booking.location}
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <div className="flex items-center justify-between lg:justify-end gap-16 pt-10 lg:pt-0 border-t lg:border-t-0 border-surface-50 dark:border-slate-800 relative z-10">
                               <div className="text-left lg:text-right">
                                  <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.4em] mb-2 leading-none">Net Reward</p>
                                  <div className="flex items-baseline lg:justify-end space-x-2">
                                     <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">₹{booking.price}</span>
                                  </div>
                               </div>

                               <div className="flex items-center gap-3">
                                  {user.role === 'guide' && booking.status === 'pending' && (
                                     <div className="flex gap-2">
                                        <button 
                                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                          className="h-16 px-10 bg-slate-900 dark:bg-primary-600 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-600 shadow-premium active:scale-95 transition-all"
                                        >
                                          Grant
                                        </button>
                                        <button 
                                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                          className="h-16 w-16 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-[1.8rem] flex items-center justify-center border-2 border-red-50 dark:border-red-900/30 shadow-soft active:scale-95 transition-all"
                                        >
                                          <XCircle className="w-7 h-7" />
                                        </button>
                                     </div>
                                  )}
                                  {user.role === 'guide' && booking.status === 'confirmed' && (
                                     <button 
                                       onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                       className="h-16 px-12 bg-emerald-600 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-700 shadow-premium active:scale-95 transition-all"
                                     >
                                       Finalize Log
                                     </button>
                                  )}
                                  {user.role === 'tourist' && booking.status === 'completed' && !booking.reviewed && (
                                     <button 
                                       onClick={() => {
                                          setSelectedBooking(booking);
                                          setShowReviewModal(true);
                                       }}
                                       className="h-16 px-10 bg-primary-500 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-900 dark:hover:bg-primary-600 shadow-premium active:scale-95 transition-all flex items-center"
                                     >
                                        <Star className="w-5 h-5 mr-3 fill-white/20" /> Write Journal
                                     </button>
                                  )}
                                   {['confirmed', 'completed'].includes(booking.status) ? (
                                      <Link to={`/chat/${displayUser._id}`} className="h-16 w-16 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-[1.8rem] flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-soft">
                                         <MessageSquare className="w-6 h-6" />
                                      </Link>
                                   ) : (
                                      <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-600 rounded-[1.8rem] flex items-center justify-center cursor-not-allowed opacity-50" title="Chat available after confirmation">
                                         <MessageSquare className="w-6 h-6" />
                                      </div>
                                   )}
                               </div>
                            </div>
                         </motion.div>
                      );
                   })}
                </AnimatePresence>

                {filteredBookings.length === 0 && (
                   <div className="text-center py-48 bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-dashed border-surface-100 dark:border-slate-800 group transition-colors">
                      <div className="w-24 h-24 bg-surface-50 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:rotate-12 transition-transform">
                         <HistoryIcon className="w-12 h-12 text-slate-200 dark:text-slate-700" />
                      </div>
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white italic font-serif mb-6 leading-none tracking-tight">Your Voyage Logs are Empty</h3>
                      <p className="subtitle max-w-sm mx-auto mb-12 dark:text-slate-400">Capture Odisha's soul through human-led storytelling. Your journey is waiting.</p>
                      <Link to="/home" className="btn-primary px-16 py-6 text-[11px] tracking-[0.4em]">
                         EXPLORE LOCALES
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
