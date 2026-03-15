import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Clock,
  X,
  CreditCard,
  User,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('/api/admin/bookings');
        setBookings(data.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => 
    b.touristId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.guideId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-[1.5rem] animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input 
            type="text"
            placeholder="Search transactions by tourist, guide or landmark..."
            className="w-full pl-16 pr-8 py-5 bg-white border border-surface-100 rounded-[2.5rem] shadow-premium focus:ring-4 focus:ring-primary-500/5 outline-none font-bold text-sm leading-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
           <button className="px-8 py-5 bg-white border border-surface-100 rounded-2xl shadow-premium text-slate-600 font-black text-[10px] uppercase tracking-widest flex items-center hover:text-primary-500 transition-all">
             <Filter className="w-4 h-4 mr-3" /> Analytical Filter
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-premium border border-surface-50 overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Transaction</th>
                <th className="px-10 py-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Involved Parties</th>
                <th className="px-10 py-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Financial Status</th>
                <th className="px-10 py-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Clearance</th>
                <th className="px-10 py-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-8">
                    <div className="space-y-1.5">
                      <p className="text-[13px] font-black text-slate-950 uppercase tracking-tight">#{booking._id.slice(-8).toUpperCase()}</p>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3 text-primary-500" />
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{booking.location}</p>
                      </div>
                      <p className="text-[10px] font-black text-slate-300 uppercase flex items-center">
                        <Calendar className="w-3 h-3 mr-1.5" /> {new Date(booking.bookingTime).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-3">
                       <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-500">T</div>
                          <span className="text-[11px] font-black text-slate-800 uppercase italic">{booking.touristId?.name}</span>
                       </div>
                       <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center text-[10px] font-black text-orange-500">G</div>
                          <span className="text-[11px] font-black text-slate-800 uppercase italic">{booking.guideId?.name}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-2">
                       <p className="text-lg font-black text-slate-950">₹{booking.price}</p>
                       <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                         booking.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                       }`}>
                         {booking.paymentStatus} / {booking.paymentMethod?.toUpperCase() || 'CASH'}
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border shadow-sm ${
                      booking.status === 'confirmed' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      booking.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 hover:text-primary-500 hover:shadow-premium transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
              onClick={() => setSelectedBooking(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="bg-slate-900 p-12 text-white relative">
                 <div className="w-16 h-16 bg-primary-500 rounded-[1.5rem] flex items-center justify-center text-slate-950 mb-10 rotate-3">
                    <Receipt className="w-8 h-8" />
                 </div>
                 <h3 className="text-4xl font-black tracking-tighter uppercase italic font-serif leading-none">Journal Entry</h3>
                 <p className="text-slate-400 text-[10px] font-black mt-4 uppercase tracking-[0.4em] opacity-60">REF-ID: {selectedBooking._id.toUpperCase()}</p>
                 <button onClick={() => setSelectedBooking(null)} className="absolute top-12 right-12 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="p-12 space-y-10">
                <div className="grid grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Tourist</p>
                      <div className="p-6 bg-surface-50 rounded-3xl">
                         <p className="text-sm font-black text-slate-950 uppercase">{selectedBooking.touristId?.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 mt-1">{selectedBooking.touristId?.email}</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Certified Guide</p>
                      <div className="p-6 bg-surface-50 rounded-3xl">
                         <p className="text-sm font-black text-slate-950 uppercase">{selectedBooking.guideId?.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 mt-1">{selectedBooking.guideId?.email}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4 p-6 bg-slate-50 rounded-3xl">
                         <MapPin className="w-6 h-6 text-primary-500" />
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                            <p className="text-[11px] font-black text-slate-950 uppercase">{selectedBooking.location}</p>
                         </div>
                      </div>
                      <div className="flex items-center space-x-4 p-6 bg-slate-50 rounded-3xl">
                         <Clock className="w-6 h-6 text-primary-500" />
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Scheduled On</p>
                            <p className="text-[11px] font-black text-slate-950 uppercase">{new Date(selectedBooking.bookingTime).toLocaleDateString()}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-10 bg-slate-950 text-white rounded-[3rem] flex items-center justify-between shadow-2xl shadow-slate-900/30">
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Total Consideration</p>
                      <p className="text-4xl font-black italic font-serif leading-none tracking-tighter">₹{selectedBooking.price}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Registry Status</p>
                      <span className="text-[11px] font-black text-primary-500 uppercase tracking-[0.2em]">{selectedBooking.status}</span>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBookings;
