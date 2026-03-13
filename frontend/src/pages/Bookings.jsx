import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle, Clock3, XCircle, MapPin, DollarSign, User, MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
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
      fetchBookings(); // Refresh list
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 mr-1.5" />;
      case 'pending': return <Clock3 className="w-4 h-4 mr-1.5" />;
      case 'completed': return <CheckCircle className="w-4 h-4 mr-1.5" />;
      default: return <XCircle className="w-4 h-4 mr-1.5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">Your Bookings</h1>
          <p className="text-slate-500 font-bold mt-2">Manage and track your travel experiences</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button className="px-6 py-2.5 bg-white rounded-xl shadow-sm text-sm font-black text-slate-800">All</button>
          <button className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800">Pending</button>
          <button className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800">History</button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary-500/10 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8 group">
              <div className="flex items-center space-x-6 flex-1">
                <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                  <User className="w-10 h-10 group-hover:text-primary-600 transition-colors" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                     <h3 className="text-2xl font-black text-slate-800">
                        {user.role === 'guide' ? booking.touristId?.name : booking.guideId?.name}
                     </h3>
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)} flex items-center`}>
                       {getStatusIcon(booking.status)}
                       {booking.status}
                     </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold text-slate-500">
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary-500" /> {new Date(booking.bookingTime).toLocaleDateString()}</div>
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-primary-500" /> {new Date(booking.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-red-500" /> {booking.location}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-10 border-t lg:border-t-0 pt-6 lg:pt-0">
                 <div className="text-left lg:text-right space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Amount Paid</p>
                    <p className="text-3xl font-black text-slate-900 flex items-center lg:justify-end">
                      <DollarSign className="w-6 h-6 mr-1 text-green-600" />
                      {booking.price}
                    </p>
                 </div>
                  <div className="flex gap-3">
                    {user.role === 'guide' && booking.status === 'pending' && (
                       <>
                         <button 
                           onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                           className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-black text-xs hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all"
                         >
                           Confirm
                         </button>
                         <button 
                           onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                           className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all"
                         >
                           Reject
                         </button>
                       </>
                    )}
                    {user.role === 'guide' && booking.status === 'confirmed' && (
                      <button 
                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                        className="px-6 py-3 bg-green-600 text-white rounded-2xl font-black text-xs hover:bg-green-700 shadow-lg shadow-green-500/30 transition-all"
                      >
                        Complete Tour
                      </button>
                    )}
                    {user.role === 'tourist' && booking.status === 'completed' && (
                      <button 
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowReviewModal(true);
                        }}
                        className="px-6 py-3 bg-yellow-400 text-slate-900 rounded-2xl font-black text-xs hover:bg-yellow-500 shadow-lg shadow-yellow-500/30 transition-all flex items-center"
                      >
                        <Star className="w-4 h-4 mr-2" /> Write Review
                      </button>
                    )}
                    <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all">
                      View Details
                    </button>
                  </div>
              </div>
            </div>
          ))}
          
          {bookings.length === 0 && (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 mt-8">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-100">
                <Calendar className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">No Bookings Yet</h3>
              <p className="text-slate-500 font-bold max-w-xs mx-auto mb-8">Ready for an adventure? Find your perfect local guide and start exploring!</p>
              <Link to="/explore" className="btn-primary shadow-xl shadow-primary-500/40 px-8 py-3 rounded-2xl font-black inline-block">
                Start Discovering
              </Link>
            </div>
          )}
        </div>
      )}
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
