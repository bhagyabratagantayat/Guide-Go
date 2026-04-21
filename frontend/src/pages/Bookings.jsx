import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, Clock, CheckCircle, Clock3, XCircle, 
  MapPin, Star, MessageSquare, ShieldAlert, ArrowUpRight, History as HistoryIcon 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewModal from '../components/ReviewModal';
import ReportModal from '../components/ReportModal';

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

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'upcoming') return ['searching', 'pending', 'confirmed', 'accepted', 'ongoing'].includes(b.status);
    if (activeFilter === 'completed') return b.status === 'completed';
    if (activeFilter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 lg:space-y-12 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-6">
        <div>
           <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] mb-2 italic">Transaction History</h1>
           <h2 className="text-3xl lg:text-4xl font-black italic font-serif text-[var(--text-primary)] leading-none">My Bookings</h2>
        </div>
        <div className="flex bg-[var(--bg-card)] p-1 rounded-2xl border border-[var(--border)] overflow-x-auto no-scrollbar">
          {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === f ? 'bg-[var(--accent)] text-white shadow-lg shadow-blue-500/20' : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <motion.div 
              key={booking._id} 
              className="glass-card p-6 lg:p-8 rounded-[2.5rem] flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 group hover:border-[var(--accent)]/30 transition-all border border-white/5 shadow-premium"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[var(--bg-base)] rounded-2xl lg:rounded-3xl flex items-center justify-center text-3xl lg:text-4xl font-black italic font-serif text-[var(--text-secondary)] border border-[var(--border)] group-hover:scale-105 transition-transform">
                   {user.role === 'guide' ? booking.userId?.name?.charAt(0) : booking.guideId?.name?.charAt(0)}
                </div>
                <div className="space-y-2">
                   <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-xl lg:text-2xl font-black text-white italic font-serif leading-none">{user.role === 'guide' ? booking.userId?.name : booking.guideId?.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        booking.status === 'confirmed' || booking.status === 'ongoing' ? 'bg-green-500 text-white' : 
                        booking.status === 'accepted' ? 'bg-violet-600 text-white' :
                        booking.status === 'searching' ? 'bg-amber-500 text-white' :
                        booking.status === 'pending' ? 'bg-[var(--accent)] text-white' : 'bg-red-500 text-white'
                      }`}>{booking.status}</span>
                   </div>
                   <div className="flex items-center gap-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[var(--accent)]" /> {new Date(booking.bookingTime).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[var(--accent)]" /> {booking.location}</span>
                   </div>
                </div>
              </div>
              <div className="flex items-center justify-between lg:justify-end gap-10 pt-6 lg:pt-0 border-t lg:border-t-0 border-white/5">
                 <div className="text-left lg:text-right">
                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Fee</p>
                    <p className="text-2xl lg:text-3xl font-black text-white tracking-tighter italic">₹{booking.price}</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <Link to={`/chat/${user.role === 'guide' ? booking.userId?._id : booking.guideId?._id}`} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-all text-white">
                       <MessageSquare size={20} />
                    </Link>
                    {(['searching', 'accepted', 'ongoing'].includes(booking.status)) && (
                      <Link to="/book-guide" className="px-6 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                        <ArrowUpRight size={14} /> Resume Trip
                      </Link>
                    )}
                    {booking.status === 'completed' && user.role === 'user' && (
                      <button className="px-6 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all text-white">Review</button>
                    )}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 glass-card rounded-[3rem] border-2 border-dashed border-[var(--border)]">
           <HistoryIcon size={48} className="mx-auto mb-6 text-[var(--border)]" />
           <h3 className="text-xl font-bold italic font-serif mb-2">No bookings yet.</h3>
           <p className="text-[var(--text-secondary)] text-sm mb-8">Adventure awaits! Explore our guides and start your journey.</p>
           <button onClick={() => navigate('/guides')} className="btn-primary">Browse Guides</button>
        </div>
      )}
    </div>
  );
};

export default Bookings;
