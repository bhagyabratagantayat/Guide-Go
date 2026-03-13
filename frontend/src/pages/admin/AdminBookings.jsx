import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  MapPin, 
  DollarSign,
  Info,
  ChevronRight,
  Clock
} from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
            placeholder="Search booking ID, tourist, guide..."
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
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tourist / Guide</th>
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
                          <div className="w-6 h-6 rounded bg-primary-100 flex items-center justify-center text-[10px] font-black text-primary-600">T</div>
                          <span className="text-xs font-bold text-slate-800">{booking.touristId?.name}</span>
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
                    <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
