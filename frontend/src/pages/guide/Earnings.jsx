import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, ArrowUpRight, 
  Calendar, Wallet, BarChart3, Clock,
  ArrowRight, Download, Filter, AreaChart as AreaIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Earnings = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayout: 0,
    bookingCount: 0,
    averageBookingValue: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data } = await axios.get('/api/bookings/guide', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        
        const completed = data.filter(b => b.status === 'completed');
        const earnings = completed.reduce((sum, b) => sum + b.price, 0);
        
        setStats({
          totalEarnings: earnings,
          pendingPayout: data.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.price, 0),
          bookingCount: completed.length,
          averageBookingValue: completed.length > 0 ? (earnings / completed.length).toFixed(0) : 0
        });

        setTransactions(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Error fetching earnings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchEarnings();
  }, [user]);

  const cards = [
    { label: 'Total Revenue', value: `₹${stats.totalEarnings.toLocaleString()}`, icon: <DollarSign />, color: 'primary', trend: '+12.5%' },
    { label: 'Pending Payout', value: `₹${stats.pendingPayout.toLocaleString()}`, icon: <Wallet />, color: 'secondary', trend: 'Escrow' },
    { label: 'Completed Tours', value: stats.bookingCount, icon: <Calendar />, color: 'primary', trend: 'Lifetime' },
    { label: 'Avg / Tour', value: `₹${stats.averageBookingValue}`, icon: <TrendingUp />, color: 'secondary', trend: 'Gross' },
  ];

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-[60vh]">
           <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-primary-500/20" />
        </div>
     );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
         <div className="space-y-3">
            <h1 className="text-6xl font-black text-slate-950 dark:text-white tracking-tighter italic font-serif leading-[0.85]">Revenue Hub</h1>
            <p className="text-slate-400 font-bold text-[11px] tracking-[0.4em] uppercase flex items-center">
               <AreaIcon className="w-4 h-4 mr-3 text-primary-500 animate-pulse" /> Live Earnings Analytics • FY 2024-25
            </p>
         </div>
         <div className="flex items-center space-x-3">
            <button className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-black text-xs uppercase tracking-widest hover:border-primary-500 transition-colors shadow-soft">
               <Download className="w-4 h-4 inline mr-2" /> Export Statement
            </button>
            <button className="h-10 px-5 bg-slate-950 dark:bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-500 shadow-premium transition-all">
               Withdraw Funds
            </button>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-premium border border-surface-50 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                stat.color === 'primary' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-950 text-white'
              }`}>
                {stat.icon}
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black px-2 py-1 rounded-full flex items-center mb-1 bg-green-50 dark:bg-green-900/20 text-green-500">
                    {stat.trend} <ArrowUpRight className="w-3 h-3 ml-1" />
                 </span>
              </div>
            </div>
            <div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif">Recent Transfers</h2>
              <button className="text-[10px] font-black text-primary-500 uppercase tracking-widest flex items-center group">
                 View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
           
           <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-8 border border-surface-50 dark:border-slate-800 shadow-premium overflow-hidden">
              <div className="space-y-2">
                 {transactions.slice(0, 5).map((tx) => (
                    <div key={tx._id} className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                       <div className="flex items-center space-x-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft ${
                             tx.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-500' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-500'
                          }`}>
                             {tx.status === 'completed' ? <BarChart3 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          <div>
                             <p className="font-black text-slate-900 dark:text-white text-sm">{tx.location}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {new Date(tx.bookingTime).toLocaleDateString()} • {tx.userId?.name}
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-black text-slate-900 dark:text-white">₹{tx.price}</p>
                          <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${
                             tx.status === 'completed' ? 'text-green-500' : 'text-orange-500'
                          }`}>{tx.status}</p>
                       </div>
                    </div>
                 ))}

                 {transactions.length === 0 && (
                    <div className="py-20 text-center text-slate-400">
                       <p className="font-black uppercase tracking-widest text-xs">No transactions logged yet</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Analytics Widget */}
        <div className="space-y-8">
           <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-6">
                 <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <div className="space-y-3">
                    <h3 className="text-3xl font-black tracking-tighter italic font-serif leading-none">Weekly Growth</h3>
                    <p className="text-slate-500 text-sm font-bold leading-relaxed italic">Your revenue is up <span className="text-white">14.2%</span> compared to last week.</p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <div className="flex justify-between items-end mb-4">
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Projected Payout</p>
                          <p className="text-2xl font-black">₹{(stats.totalEarnings * 0.2).toFixed(0)}</p>
                       </div>
                       <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center">
                          <ArrowUpRight className="w-6 h-6" />
                       </div>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary-500 w-[65%]" />
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-surface-50 dark:border-slate-800 shadow-premium">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center">
                 <Filter className="w-4 h-4 mr-3 text-primary-500" /> Revenue Stream
              </h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Fees (10%)</span>
                    <span className="text-xs font-black text-red-500">₹{(stats.totalEarnings * 0.1).toFixed(0)}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insurance Cover</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">₹0</span>
                 </div>
                 <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Net Payable</span>
                    <span className="text-lg font-black text-primary-500">₹{(stats.totalEarnings * 0.9).toFixed(0)}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
