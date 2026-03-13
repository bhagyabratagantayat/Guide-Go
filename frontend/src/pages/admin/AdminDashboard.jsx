import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  UserCheck, 
  MapPin, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats');
        if (data.success && data.data) {
          setData(data.data);
          setError(null);
        } else {
          setError('Failed to load statistics');
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setError(error.response?.data?.message || 'Error connecting to server');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100">
        {error}
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-primary-500 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-400"
      >
        Retry Fetch
      </button>
    </div>
  );

  if (!data || !data.stats) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-slate-500 font-bold uppercase tracking-widest">No dashboard data available.</p>
    </div>
  );

  const stats = [
    { label: 'Total Revenue', value: `₹${data.stats.totalRevenue}`, icon: <DollarSign className="w-6 h-6" />, color: 'bg-green-500', trend: '+12.5%' },
    { label: 'Total Users', value: data.stats.totalUsers, icon: <Users className="w-6 h-6" />, color: 'bg-blue-500', trend: '+5.2%' },
    { label: 'Total Guides', value: data.stats.totalGuides, icon: <UserCheck className="w-6 h-6" />, color: 'bg-primary-500', trend: '+2.1%' },
    { label: 'Total Bookings', value: data.stats.totalBookings, icon: <BookOpen className="w-6 h-6" />, color: 'bg-purple-500', trend: '+8.4%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center">
                {stat.trend} <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Recent Bookings</h3>
            <button className="text-xs font-bold text-primary-600 hover:underline px-4 py-2 bg-primary-50 rounded-xl">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tourist</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guide</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <p className="text-sm font-bold text-slate-800">{booking.touristId?.name}</p>
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-600">
                      {booking.guideId?.name}
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-600">
                      {booking.location}
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm font-black text-slate-900">₹{booking.price}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <TrendingUp className="w-10 h-10 text-primary-400 mb-6" />
              <h3 className="text-xl font-black mb-2">GROWTH HUD</h3>
              <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">System activity is up 12% today. You have 3 pending guide approvals to review.</p>
              <button className="w-full py-4 bg-primary-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-400 transition-all">
                Check Approvals
              </button>
            </div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center">
               <Clock className="w-4 h-4 mr-2 text-primary-500" /> Platform Logs
             </h3>
             <div className="space-y-6">
               <ActivityItem time="2m ago" text="New guide registered" user="Karan Singh" />
               <ActivityItem time="15m ago" text="Booking confirmed" user="Riya Patel" />
               <ActivityItem time="1h ago" text="System backup successful" user="System" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ time, text, user }) => (
  <div className="flex items-start space-x-3">
    <div className="w-2 h-2 rounded-full bg-slate-200 mt-1.5 flex-shrink-0"></div>
    <div>
      <p className="text-xs font-bold text-slate-800 leading-tight">{text}</p>
      <div className="flex items-center space-x-2 mt-1">
        <span className="text-[10px] font-bold text-primary-600 underline cursor-pointer">{user}</span>
        <span className="text-[10px] text-slate-400 font-medium tracking-tighter">{time}</span>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
