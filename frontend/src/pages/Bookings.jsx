import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, Clock, CheckCircle, Clock3, XCircle, 
  MapPin, Star, MessageSquare, ShieldAlert, ArrowUpRight, History as HistoryIcon 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const endpoint = user.role === 'guide' ? '/bookings/guide' : '/bookings/user';
      const { data } = await api.get(endpoint);
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

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;
    try {
      await api.put(`/bookings/${id}/status`, { status: 'cancelled' });
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'upcoming') return ['searching', 'pending', 'confirmed', 'accepted', 'ongoing'].includes(b.status);
    if (activeFilter === 'completed') return b.status === 'completed';
    if (activeFilter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'searching': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'ongoing': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-12 px-6 lg:px-0">
      <Helmet>
        <title>My Bookings | GuideGo</title>
        <meta name="description" content="View and manage your current and past tourism bookings. Keep track of your travel history with GuideGo." />
      </Helmet>
      <div className="max-w-4xl mx-auto pt-10 lg:pt-16 space-y-10">
        
        {/* HEADER */}
        <div className="space-y-2">
           <h1 className="text-4xl lg:text-5xl font-black text-[#222222] tracking-tighter">Bookings</h1>
           <p className="text-[#717171] font-medium text-sm">Manage your stays and experiences</p>
        </div>

        {/* PILL FILTERS */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                activeFilter === f 
                  ? 'bg-[#222222] text-white border-[#222222]' 
                  : 'bg-white text-[#222222] border-[#dddddd] hover:border-[#222222]'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* BOOKING LIST */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-[#ff385c] border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#717171]">Loading history</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid gap-6 pb-20">
            <AnimatePresence mode="popLayout">
              {filteredBookings.map((booking) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={booking._id} 
                  className="bg-white p-6 rounded-[2rem] border border-[#dddddd] hover:shadow-xl transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* PHOTO SECTION */}
                    <div className="relative w-full lg:w-28 h-48 lg:h-28 rounded-2xl overflow-hidden bg-[#f7f7f7] border border-[#dddddd]">
                       <img 
                        src={user.role === 'guide' ? booking.userId?.profilePicture : (booking.guideId?.profilePicture || 'https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=400&q=80')} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                        alt=""
                       />
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="flex-1 space-y-4">
                       <div className="flex justify-between items-start">
                          <div>
                             <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${getStatusStyle(booking.status)}`}>
                                {booking.status}
                             </span>
                             <h4 className="text-xl font-bold text-[#222222] mt-2">
                                {user.role === 'guide' ? (booking.userId?.name || 'Traveler') : (booking.guideId?.name || 'Local Guide')}
                             </h4>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-[#717171] uppercase tracking-widest">Total</p>
                             <p className="text-xl font-bold text-[#222222]">₹{booking.price}</p>
                          </div>
                       </div>
                       
                       <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#717171]">
                          <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#222222]"/> {new Date(booking.bookingTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#222222]"/> {booking.location}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#222222]"/> {booking.plan}</span>
                       </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex lg:flex-col gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#f7f7f7]">
                       <Link 
                        to={`/chat/${user.role === 'guide' ? booking.userId?._id : booking.guideId?._id}`} 
                        className="flex-1 lg:w-full px-6 py-3 bg-white border border-[#dddddd] text-[#222222] rounded-xl text-xs font-bold hover:bg-[#f7f7f7] transition-all text-center flex items-center justify-center gap-2"
                       >
                          <MessageSquare size={14} /> Message
                       </Link>
                       {['searching', 'accepted', 'ongoing'].includes(booking.status) && (
                         <Link 
                          to="/book-guide" 
                          className="flex-1 lg:w-full px-6 py-3 bg-[#ff385c] text-white rounded-xl text-xs font-bold hover:bg-[#e00b41] transition-all text-center shadow-lg shadow-rose-500/10"
                         >
                            Resume
                         </Link>
                       )}
                       {user.role === 'guide' && booking.status === 'accepted' && (
                         <button 
                          onClick={() => handleCancel(booking._id)}
                          className="flex-1 lg:w-full px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all text-center"
                         >
                            Cancel Trip
                         </button>
                       )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 rounded-[3rem] border border-[#dddddd] bg-[#f7f7f7]/50">
             <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <HistoryIcon size={32} className="text-[#dddddd]" />
             </div>
             <h3 className="text-xl font-bold text-[#222222] mb-2">No bookings yet</h3>
             <p className="text-[#717171] text-sm mb-8 px-10">When you book a guide or experience, it will appear here.</p>
             <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#222222] text-white rounded-xl font-bold text-sm shadow-xl">Explore Guides</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
