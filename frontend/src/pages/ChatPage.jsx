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
  const { bookingData } = useBooking();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();
  const socketRef = useRef();

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/chat/${bookingId}`);
        setMessages(data.data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    fetchMessages();
  }, [bookingId]);

  // Socket setup
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.on('receiveMessage', (message) => {
      if (message.bookingId === bookingId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [bookingId]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const recipientId = user.role === 'user' ? bookingData?.guideId?._id : bookingData?.userId;
    
    const messageData = {
      bookingId,
      text: newMessage,
      recipientId: recipientId || (user.role === 'user' ? bookingData?.guideId : bookingData?.userId),
      senderId: user._id
    };

    // Emit via socket
    socketRef.current.emit('sendMessage', messageData);

    // Optimistically update UI
    setMessages((prev) => [...prev, {
      _id: Date.now(),
      senderId: user._id,
      text: newMessage,
      createdAt: new Date()
    }]);

    setNewMessage('');
  };

  const partnerName = user.role === 'user' ? (bookingData?.guideId?.name || 'Guide') : (bookingData?.userName || 'Traveler');

  return (
    <div className="flex flex-col h-screen bg-[#f7f7f7] text-[#222222]">
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#eeeeee] p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff385c]/10 flex items-center justify-center border border-[#ff385c]/20">
               <span className="text-[#ff385c] font-black text-xs uppercase tracking-tighter italic">
                 {partnerName.substring(0, 2)}
               </span>
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
           <button className="p-3 bg-slate-50 text-[#222222] rounded-2xl hover:bg-slate-100 transition-all">
              <Phone size={18} />
           </button>
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
              <p className="text-[9px] font-medium text-[#717171] mt-1 italic">Chat is encrypted and visible only to you and your guide.</p>
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
         <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
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
