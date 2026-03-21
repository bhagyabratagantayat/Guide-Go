import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  MessageSquare, User, Search, 
  ChevronRight, MoreVertical, ShieldCheck,
  CheckCheck, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Fetch bookings to find unique travelers the guide is interacting with
        const { data } = await axios.get('/api/bookings/guide', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        
        // Group by user and find the latest booking for each
        const uniqueTravelers = Array.from(new Set(data.map(b => b.userId?._id)))
          .map(id => {
            const bookings = data.filter(b => b.userId?._id === id);
            return {
               user: bookings[0].userId,
               lastBooking: bookings[0],
               lastMessage: "Tap to view conversation",
               time: bookings[0].createdAt || bookings[0].bookingTime || new Date(),
               unread: 0
            };
          });

        setConversations(uniqueTravelers);
      } catch (error) {
        console.error('Error fetching chat list:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchConversations();
  }, [user]);

  const filtered = conversations.filter(c => 
    c.user?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-[60vh]">
           <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
             <h1 className="text-6xl font-black text-slate-950 dark:text-white tracking-tighter italic font-serif leading-[0.85]">Traveler Hub</h1>
             <p className="text-slate-400 font-bold text-[11px] tracking-[0.4em] uppercase flex items-center">
                <MessageSquare className="w-4 h-4 mr-3 text-primary-500 animate-pulse" /> Active Conversations • Guide Portal
             </p>
          </div>
       </div>

       {/* Search Bar */}
       <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
             <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input 
            type="text"
            placeholder="Search traveler by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-20 pl-16 pr-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-surface-100 dark:border-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest transition-all outline-none shadow-premium dark:shadow-none"
          />
       </div>

       {/* Conversations List */}
       <div className="space-y-4">
          {filtered.map((chat, idx) => (
             <motion.div 
               key={chat.user?._id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.05 }}
               onClick={() => navigate(`/guide/chat/${chat.user._id}`)}
               className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-surface-50 dark:border-slate-800 shadow-premium dark:shadow-none cursor-pointer hover:translate-y-[-4px] transition-all group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-primary-500/10 transition-colors" />
                
                <div className="flex items-center space-x-8 relative z-10">
                   <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-[1.8rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-300 dark:text-slate-600 text-2xl italic font-serif overflow-hidden">
                         {chat.user?.profilePicture ? (
                            <img src={chat.user.profilePicture} className="w-full h-full object-cover" />
                         ) : chat.user?.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-lg border-4 border-white dark:border-slate-900 shadow-sm" />
                   </div>

                   <div className="flex-grow min-w-0 py-1">
                      <div className="flex items-center justify-between mb-2">
                         <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none truncate max-w-[200px]">
                            {chat.user?.name}
                         </h3>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center shrink-0">
                            <Clock className="w-3 h-3 mr-1" /> {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                      <p className="text-slate-500 text-sm font-medium truncate max-w-[300px] flex items-center">
                         <CheckCheck className="w-4 h-4 mr-2 text-primary-500" /> {chat.lastMessage}
                      </p>
                   </div>

                   <div className="flex flex-col items-end space-y-4">
                      {chat.unread > 0 && (
                         <span className="w-6 h-6 bg-primary-500 text-white rounded-lg flex items-center justify-center text-[9px] font-black shadow-glow animate-bounce">
                           {chat.unread}
                         </span>
                      )}
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-soft group-hover:shadow-lg group-hover:shadow-primary-500/30">
                         <ChevronRight className="w-6 h-6" />
                      </div>
                   </div>
                </div>
             </motion.div>
          ))}

          {filtered.length === 0 && (
             <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <MessageSquare className="w-10 h-10 text-slate-200 dark:text-slate-700" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white italic font-serif mb-4 leading-none tracking-tight">Quiet on the Communication Front</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conversations materialize as soon as travelers book your expertise.</p>
             </div>
          )}
       </div>
    </div>
  );
};

export default ChatList;
