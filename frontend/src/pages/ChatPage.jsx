import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, MoreVertical, Phone, ShieldCheck, MapPin } from 'lucide-react';
import api from '../utils/api';
import { getSocket } from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

const ChatPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookingData: contextBooking } = useBooking();
  const [booking, setBooking] = useState(contextBooking);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();
  const socketRef = useRef();

  // Quick Recommendations
  const recommendations = [
    "Where are you?",
    "I have reached the location",
    "I am waiting near the entrance",
    "Call me when you're here",
    "On my way!",
    "Okay, sounds good"
  ];

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [msgRes, bookingRes] = await Promise.all([
          api.get(`/chat/${bookingId}`),
          api.get(`/bookings/${bookingId}`)
        ]);
        setMessages(msgRes.data.data);
        setBooking(bookingRes.data);
      } catch (err) {
        console.error('Failed to fetch chat data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  // Socket setup
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    if (socket && user?._id) {
       socket.emit('join', { userId: user._id });
    }

    socket.on('receiveMessage', (message) => {
      if (message.bookingId === bookingId) {
        // Prevent duplicates from optimistic updates
        setMessages((prev) => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [bookingId, user?._id]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text) => {
    const messageText = typeof text === 'string' ? text : newMessage;
    if (!messageText.trim()) return;

    // Correct recipient determination
    const recipientId = user.role === 'user' 
      ? (booking?.guideId?._id || booking?.guideId) 
      : (booking?.userId?._id || booking?.userId);
    
    if (!recipientId) {
      alert("Error: Recipient not found. Please try again.");
      return;
    }

    const messageData = {
      bookingId,
      text: messageText,
      recipientId: recipientId,
      senderId: user._id
    };

    // Emit via socket
    socketRef.current.emit('sendMessage', messageData);

    // Optimistically update UI with a temporary ID
    const tempId = Date.now();
    setMessages((prev) => [...prev, {
      _id: tempId,
      senderId: user._id,
      text: messageText,
      createdAt: new Date()
    }]);

    setNewMessage('');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f7f7f7]">
      <div className="w-10 h-10 border-4 border-[#ff385c] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const partnerName = user.role === 'user' 
    ? (booking?.guideId?.name || 'Guide') 
    : (booking?.userId?.name || 'Traveler');

  return (
    <div className="flex flex-col h-screen bg-[#f7f7f7] text-[#222222]">
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#eeeeee] p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff385c]/10 flex items-center justify-center border border-[#ff385c]/20 overflow-hidden">
               {user.role === 'user' && booking?.guideId?.profilePicture ? (
                 <img src={booking.guideId.profilePicture} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-[#ff385c] font-black text-xs uppercase tracking-tighter italic">
                   {partnerName.substring(0, 2)}
                 </span>
               )}
            </div>
            <div>
               <h3 className="text-sm font-black italic tracking-tighter text-[#222222]">{partnerName}</h3>
               <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Chat</span>
               </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <a href={`tel:${user.role === 'user' ? booking?.guideId?.mobile : booking?.userId?.mobile}`} className="p-3 bg-slate-50 text-[#222222] rounded-2xl hover:bg-slate-100 transition-all">
              <Phone size={18} />
           </a>
           <button className="p-3 bg-slate-50 text-[#222222] rounded-2xl hover:bg-slate-100 transition-all">
              <MoreVertical size={18} />
           </button>
        </div>
      </header>

      {/* --- CHAT AREA --- */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Info Card */}
        <div className="bg-white/50 border border-white p-4 rounded-3xl flex items-center gap-4 mb-8 shadow-sm backdrop-blur-sm">
           <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black text-[#222222] uppercase tracking-widest leading-none">Secure Session</p>
              <p className="text-[9px] font-medium text-[#717171] mt-1 italic">Chat is visible only to you and your guide.</p>
           </div>
        </div>

        {messages.map((msg, index) => {
          const isMe = msg.senderId === user._id;
          return (
            <motion.div 
              key={msg._id || index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-[2rem] shadow-sm text-sm font-medium leading-relaxed ${
                isMe 
                ? 'bg-[#222222] text-white rounded-br-none' 
                : 'bg-white text-[#222222] rounded-bl-none border border-[#eeeeee]'
              }`}>
                {msg.text}
                <div className={`text-[8px] mt-2 font-bold uppercase tracking-widest ${isMe ? 'text-white/40' : 'text-slate-400'}`}>
                  {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <footer className="p-6 bg-white border-t border-[#eeeeee]">
         {/* Recommendations */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-2">
            {recommendations.map((rec, i) => (
              <button 
                key={i}
                onClick={() => handleSendMessage(rec)}
                className="whitespace-nowrap px-4 py-2 bg-[#f7f7f7] border border-[#eeeeee] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#ff385c] hover:text-white hover:border-[#ff385c] transition-all"
              >
                {rec}
              </button>
            ))}
         </div>

         <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative flex items-center gap-3">
            <input 
               type="text" 
               placeholder="Write a message..."
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
               className="flex-1 bg-[#f7f7f7] border border-[#eeeeee] p-5 rounded-[2rem] text-sm font-medium focus:ring-4 focus:ring-[#ff385c]/5 focus:border-[#ff385c] focus:bg-white transition-all outline-none"
            />
            <button 
              type="submit"
              className="p-5 bg-[#222222] text-white rounded-full hover:bg-black active:scale-90 transition-all shadow-xl shadow-black/10"
            >
              <Send size={20} />
            </button>
         </form>
      </footer>
    </div>
  );
};

export default ChatPage;
