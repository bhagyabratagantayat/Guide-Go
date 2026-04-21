import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  MapPin, 
  DollarSign,
  Info,
  ChevronRight,
  Clock,
  LogOut
} from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/admin/bookings');
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
    b.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.guideId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search booking ID, user, guide..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
           <button className="px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 hover:text-primary-500 font-bold text-xs flex items-center">
             <Filter className="w-4 h-4 mr-2" /> Filter By Status
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User / Guide</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 uppercase">#{booking._id.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-slate-400 flex items-center uppercase tracking-tighter">
                        <MapPin className="w-2.5 h-2.5 mr-1" /> {booking.location}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 flex items-center">
                        <Calendar className="w-2.5 h-2.5 mr-1" /> {new Date(booking.bookingTime).toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                       <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded bg-primary-100 flex items-center justify-center text-[10px] font-black text-primary-600">U</div>
                          <span className="text-xs font-bold text-slate-800">{booking.userId?.name}</span>
                       </div>
                       <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded bg-secondary-100 flex items-center justify-center text-[10px] font-black text-secondary-600">G</div>
                          <span className="text-xs font-bold text-slate-800">{booking.guideId?.name}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <p className="text-sm font-black text-slate-900">₹{booking.price}</p>
                       <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${booking.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                         {booking.paymentStatus.toUpperCase()} - {booking.paymentMethod?.toUpperCase() || 'CASH'}
                       </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border ${
                      booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                      booking.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      booking.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-yellow-50 text-yellow-600 border-yellow-100'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedBooking(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="bg-slate-900 p-10 text-white flex justify-between items-start">
               <div className="space-y-2">
                 <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">Booking Summary</h3>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">REF: #{selectedBooking._id.toUpperCase()}</p>
               </div>
               <button onClick={() => setSelectedBooking(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  <LogOut className="w-5 h-5 rotate-45 text-slate-400" />
               </button>
             </div>

             <div className="p-10 space-y-8">
               <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</h4>
                   <div className="space-y-1">
                     <p className="text-sm font-black text-slate-900">{selectedBooking.userId?.name}</p>
                     <p className="text-xs font-bold text-slate-500">{selectedBooking.userId?.email}</p>
                   </div>
                 </div>
                 <div className="space-y-4 shadow-inner p-4 bg-slate-50 rounded-2xl">
                   <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Guide Expertise</h4>
                   <div className="space-y-1">
                     <p className="text-sm font-black text-slate-900">{selectedBooking.guideId?.name}</p>
                     <p className="text-xs font-bold text-slate-500">{selectedBooking.guideId?.email}</p>
                   </div>
                 </div>
               </div>

               <div className="space-y-4 pt-8 border-t border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Journey Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl">
                      <MapPin className="w-5 h-5 text-primary-500" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Location</p>
                        <p className="text-xs font-black text-slate-900 uppercase">{selectedBooking.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl">
                      <Clock className="w-5 h-5 text-primary-500" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Schedule</p>
                        <p className="text-xs font-black text-slate-900 uppercase">{new Date(selectedBooking.bookingTime).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
               </div>

               <div className="p-6 bg-slate-900 text-white rounded-[2rem] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Transaction</p>
                    <p className="text-2xl font-black">₹{selectedBooking.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                    <span className="text-xs font-black text-primary-400 uppercase tracking-tighter">{selectedBooking.status}</span>
                  </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
