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
    <div className="flex flex-col h-[100dvh] bg-[#f8f9fa] text-[#222222] overflow-hidden fixed inset-0 z-[5000]">
      {/* --- HEADER (Fixed at Top) --- */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-[#eeeeee] p-4 flex items-center justify-between z-50 lg:px-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 hover:bg-slate-100/50 rounded-2xl transition-all active:scale-90"
          >
            <ArrowLeft size={20} className="text-[#222222]" />
          </button>
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff385c] to-[#e00b41] flex items-center justify-center border-2 border-white shadow-lg overflow-hidden">
                 {user.role === 'user' && currentGuide?.profilePicture ? (
                   <img src={currentGuide.profilePicture} className="w-full h-full object-cover" alt="Guide" />
                 ) : (
                   <span className="text-white font-black text-xs uppercase tracking-tighter italic">
                     {partnerName.substring(0, 2)}
                   </span>
                 )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
               <h3 className="text-sm font-black italic tracking-tighter text-[#222222] leading-none mb-1">{partnerName}</h3>
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Session</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <a 
              href={`tel:${user.role === 'user' ? (booking?.guideId?.mobile || currentGuide?.mobile) : (booking?.userId?.mobile)}`} 
              className="p-3 bg-white text-[#222222] rounded-2xl hover:bg-slate-50 transition-all border border-[#eeeeee] shadow-sm active:scale-95"
            >
              <Phone size={18} />
           </a>
           <button className="p-3 bg-white text-[#222222] rounded-2xl hover:bg-slate-50 transition-all border border-[#eeeeee] shadow-sm">
              <MoreVertical size={18} />
           </button>
        </div>
      </header>

      {/* --- CHAT AREA (Scrollable Middle) --- */}
      <div className="flex-1 overflow-y-auto bg-[#f8f9fa] custom-scrollbar p-6 lg:p-12">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* Info Card */}
          <div className="bg-white/40 border border-white p-5 rounded-[2rem] flex items-center gap-4 mb-10 shadow-sm backdrop-blur-sm mx-auto max-w-sm">
             <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner">
                <ShieldCheck size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-[#222222] uppercase tracking-widest leading-none">End-to-End Secure</p>
                <p className="text-[9px] font-bold text-[#717171] mt-1 italic">Private session with GuideGo protection.</p>
             </div>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isMe = msg.senderId === user._id;
              const showDate = index === 0 || 
                new Date(messages[index-1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

              return (
                <React.Fragment key={msg._id || index}>
                  {showDate && (
                    <div className="flex justify-center my-8">
                       <span className="px-5 py-2 bg-slate-200/50 backdrop-blur-sm text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] rounded-full">
                          {new Date(msg.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                       </span>
                    </div>
                  )}
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} group mb-4`}
                  >
                    <div className={`relative max-w-[85%] lg:max-w-[70%] px-5 py-4 rounded-[2.2rem] shadow-sm text-sm font-medium leading-relaxed transition-all ${
                      isMe 
                      ? 'bg-[#222222] text-white rounded-br-none shadow-black/5' 
                      : 'bg-white text-[#222222] rounded-bl-none border border-[#eeeeee] shadow-slate-200/50'
                    }`}>
                      {msg.text}
                      <div className={`text-[8px] mt-2 font-black uppercase tracking-widest flex items-center gap-2 ${isMe ? 'text-white/40' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && <ShieldCheck size={8} className="text-emerald-500" />}
                      </div>
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </AnimatePresence>
          <div ref={scrollRef} className="h-4" />
        </div>
      </div>

      {/* --- INPUT AREA (Pinned at Bottom) --- */}
      <footer className="bg-white/70 backdrop-blur-xl border-t border-[#eeeeee] pb-safe">
        <div className="max-w-4xl mx-auto w-full p-4 lg:p-8">
           {/* Recommendations */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
              {recommendations.map((rec, i) => (
                <button 
                  key={i}
                  onClick={() => handleSendMessage(rec)}
                  className="whitespace-nowrap px-5 py-3 bg-white border border-[#eeeeee] text-[9px] font-black uppercase tracking-[0.15em] rounded-2xl hover:bg-[#ff385c] hover:text-white hover:border-[#ff385c] transition-all shadow-sm active:scale-95"
                >
                  {rec}
                </button>
              ))}
           </div>

           <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
              className="relative flex items-center gap-3"
           >
              <div className="flex-1 relative">
                <input 
                   type="text" 
                   placeholder="Message..."
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   className="w-full bg-[#f8f9fa] border border-[#eeeeee] p-5 lg:p-6 rounded-[2.5rem] text-sm font-semibold focus:ring-4 focus:ring-[#ff385c]/5 focus:border-[#ff385c]/30 focus:bg-white transition-all outline-none shadow-inner"
                />
              </div>
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="p-5 lg:p-6 bg-[#222222] text-white rounded-full hover:bg-black active:scale-90 transition-all shadow-2xl shadow-black/10 disabled:opacity-20 disabled:scale-95"
              >
                <Send size={24} />
              </button>
           </form>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eeeeee; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
};

export default ChatPage;
