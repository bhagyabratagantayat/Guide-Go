import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import useGuideTracking from '../hooks/useGuideTracking';
import { 
  Wifi, 
  WifiOff, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  User,
  Clock
} from 'lucide-react';

const GuideDashboard = () => {
  const { user } = useAuth();
  const { startTracking } = useGuideTracking(user);
  const [isLive, setIsLive] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalEarnings: 0, pendingBookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (isLive) {
      const stopTracking = startTracking();
      return () => stopTracking && stopTracking();
    }
  }, [isLive]);

  const fetchDashboardData = async () => {
    try {
      const [{ data: bookingData }, { data: guideData }] = await Promise.all([
        axios.get('/api/bookings/guide'),
        axios.get('/api/guides/profile')
      ]);
      setBookings(bookingData);
      setIsLive(guideData.isLive);
      
      const earnings = bookingData
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.price, 0);
      const pending = bookingData.filter(b => b.status === 'pending').length;
      
      setStats({ totalEarnings: earnings, pendingBookings: pending });
    } catch (error) {
      console.error('Error fetching guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLive = async () => {
    try {
      // For real location, we'd use navigator.geolocation
      // Here we simulate for the production requirement
      const newStatus = !isLive;
      const { data } = await axios.put('/api/guides/live', { 
        isLive: newStatus 
      });
      setIsLive(data.isLive);
      alert(`You are now ${newStatus ? 'LIVE' : 'OFFLINE'}`);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleBooking = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}`, { status });
      fetchDashboardData();
    } catch (error) {
      alert('Failed to update booking status');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Guide Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, {user?.name}</p>
        </div>
        <button 
          onClick={toggleLive}
          className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
            isLive 
            ? 'bg-green-500 text-white shadow-lg shadow-green-200 ring-4 ring-green-100' 
            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
          }`}
        >
          {isLive ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          <span>{isLive ? 'You are Live' : 'Go Live'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Total Earnings" value={`₹${stats.totalEarnings}`} icon={<DollarSign />} color="text-green-600 bg-green-50" />
        <StatCard label="Pending Requests" value={stats.pendingBookings} icon={<Clock />} color="text-blue-600 bg-blue-50" />
        <StatCard label="Avg Rating" value="4.8" icon={<CheckCircle />} color="text-yellow-600 bg-yellow-50" />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Booking Requests</h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">{bookings.length} Total</span>
        </div>
        <div className="divide-y divide-slate-100">
          {bookings.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest">No bookings yet</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{booking.touristId?.name || 'Tourist'}</h4>
                    <p className="text-sm text-slate-500 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" /> {booking.location}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" /> {new Date(booking.bookingTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {booking.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleBooking(booking._id, 'confirmed')}
                        className="flex-1 lg:flex-none px-6 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-all flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" /> <span>Accept</span>
                      </button>
                      <button 
                        onClick={() => handleBooking(booking._id, 'rejected')}
                        className="flex-1 lg:flex-none px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" /> <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                      booking.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {booking.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
      {React.cloneElement(icon, { className: "w-6 h-6" })}
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-3xl font-black text-slate-900">{value}</h3>
  </div>
);

export default GuideDashboard;
