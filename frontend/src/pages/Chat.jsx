import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Send, Phone, Video, Info, User, 
  ChevronLeft, Image, Paperclip, Smile,
  MoreVertical, ShieldCheck, Compass, CheckCheck, Mic,
  Lock, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '../utils/socket';
import logo from '../assets/GuideGo Logo.jpeg';

const Chat = () => {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data } = await api.get(`/bookings/${bookingId}`);
        setBooking(data);
        
        // Access Control Logic
        const allowedStatuses = ['accepted', 'ongoing'];
        setIsReadOnly(!allowedStatuses.includes(data.status));

        // Set recipient (if user is traveler, recipient is guide, and vice versa)
        const otherParty = user.role === 'user' ? data.guideId : data.userId;
        setRecipient(otherParty);

        // Initial messages (mock or fetch if backend supports)
        setMessages([
          { _id: 'sys-1', role: 'system', text: `Trip to ${data.location} has started.`, timestamp: data.createdAt }
        ]);
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      }
    };

    fetchBookingDetails();
  }, [bookingId, user.role]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      if (msg.bookingId === bookingId) {
        setMessages(prev => [...prev, msg]);
      }
    };

    const handleChatError = (err) => {
      alert(err.message);
      if (err.status) setIsReadOnly(true);
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('chatError', handleChatError);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('chatError', handleChatError);
    };
  }, [bookingId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || isReadOnly) return;

    const socket = getSocket();
    const recipientId = user.role === 'user' ? booking?.guideId?._id : booking?.userId?._id;

    const newMessage = {
      bookingId,
      recipientId,
      senderRole: user.role,
      text: message,
    };

    // Optimistic UI update
    const localMsg = {
      ...newMessage,
      _id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, localMsg]);
    setMessage('');

    // Send via socket
    socket.emit('sendMessage', newMessage);
  };

  return (
    <div className="fixed inset-0 bg-[#efe7de] flex flex-col z-[5000]">
       {/* WhatsApp Header */}
       <div className="bg-[#075e54] px-4 py-3 pb-4 flex items-center justify-between shadow-md relative z-20">
          <div className="flex items-center space-x-2">
             <button 
               onClick={() => navigate(-1)}
               className="p-1 text-white hover:bg-white/10 rounded-full transition-colors"
             >
                <ChevronLeft className="w-6 h-6" />
             </button>
             
             <div className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                   <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-white/20">
                      {recipient?.profilePicture ? (
                         <img src={recipient.profilePicture} alt={recipient.name} className="w-full h-full object-cover" />
                      ) : (
                         <User className="w-6 h-6" />
                      )}
                   </div>
                   {!isReadOnly && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#1ed760] rounded-full border-2 border-[#075e54]"></div>}
                </div>
                <div>
                   <h3 className="text-sm font-bold text-white leading-tight">{recipient?.name || 'Loading...'}</h3>
                   <span className="text-[10px] text-white/80">{isReadOnly ? 'Trip Completed' : 'Online'}</span>
                </div>
             </div>
          </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-10">
            <img src={logo} alt="" className="w-80 h-80 object-cover rounded-full grayscale" />
          </div>

          <div className="relative z-20">
            <div className="flex justify-center mb-6">
               <div className="px-6 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-[10px] text-center max-w-[80%] text-[#54656f] font-medium border border-white/50 shadow-sm leading-relaxed flex items-center gap-2">
                  <Lock size={12} /> Messages are secured. {isReadOnly ? 'This chat is now read-only.' : 'End-to-end encrypted.'}
               </div>
            </div>

            {messages.map((msg, idx) => {
               const isMe = msg.senderRole === user.role;
               if (msg.role === 'system') return (
                 <div key={idx} className="flex justify-center my-4">
                    <span className="bg-[#d1e4f3] px-4 py-1 rounded-full text-[10px] font-bold text-[#54656f] uppercase">{msg.text}</span>
                 </div>
               );

               return (
                  <motion.div 
                    key={msg._id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                     <div 
                        className={`max-w-[85%] lg:max-w-[70%] px-3 py-2 rounded-xl relative shadow-sm ${
                           isMe 
                           ? 'bg-[#dcf8c6] text-[#303030] rounded-tr-none' 
                           : 'bg-white text-[#303030] rounded-tl-none'
                        }`}
                     >
                        <div className={`absolute top-0 w-2 h-2 ${isMe ? '-right-2 bg-[#dcf8c6]' : '-left-2 bg-white'}`} 
                             style={{ clipPath: isMe ? 'polygon(0 0, 0 100%, 100% 0)' : 'polygon(100% 0, 100% 100%, 0 0)' }}>
                        </div>
                        <div className="text-sm leading-relaxed pr-12">
                           <p>{msg.text}</p>
                        </div>
                        <div className="absolute bottom-1 right-2 flex items-center space-x-1">
                           <span className="text-[10px] text-[#8696a0] font-normal">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                           </span>
                           {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                        </div>
                     </div>
                  </motion.div>
               );
            })}
            <div ref={messagesEndRef} />
          </div>
       </div>

       {/* WhatsApp Input Bar / Read-only Message */}
       <div className="bg-[#f0f2f5] px-3 py-3 flex items-center space-x-2 bottom-0 w-full z-30 pb-8 sm:pb-3">
          {isReadOnly ? (
            <div className="w-full py-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center gap-3 text-amber-700">
               <AlertCircle size={18} />
               <span className="text-xs font-black uppercase tracking-widest">Chat Closed. Trip has ended.</span>
            </div>
          ) : (
            <form 
              onSubmit={handleSendMessage}
              className="flex-1 flex items-center space-x-2"
            >
               <div className="flex-1 bg-white rounded-xl px-4 py-2 flex items-center shadow-sm">
                  <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-[#3b4a54] placeholder:text-[#8696a0] py-1"
                  />
               </div>
               
               <button 
                 type="submit" 
                 disabled={!message.trim()}
                 className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 bg-[#00a884] text-white`}
               >
                  {message.trim() ? <Send className="w-5 h-5 ml-0.5" /> : <Mic className="w-5 h-5" />}
               </button>
            </form>
          )}
       </div>
    </div>
  );
};

export default Chat;
