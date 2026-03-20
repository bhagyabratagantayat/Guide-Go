import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Send, Phone, Video, Info, User, 
  ChevronLeft, Image, Paperclip, Smile,
  MoreVertical, ShieldCheck, Compass, CheckCheck, Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/GuideGo Logo.jpeg';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [recipient, setRecipient] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { _id: '1', role: 'guide', text: 'Namaste! I am your local guide for Puri. How can I help you plan your spiritual journey today?', timestamp: new Date(Date.now() - 3600000) },
    { _id: '2', role: 'user', text: 'Hi! I want to visit the Jagannath Temple tomorrow morning. What is the best time?', timestamp: new Date(Date.now() - 1800000) },
    { _id: '3', role: 'guide', text: 'The morning Aarti is beautiful around 5:30 AM. I recommend reaching by 5:00 AM to avoid the crowd.', timestamp: new Date(Date.now() - 600000) },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        setRecipient({
          _id: id,
          name: 'Guide Rajesh',
          status: 'Online',
          profilePicture: null
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipient();
  }, [id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      _id: Date.now().toString(),
      role: user.role,
      text: message,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    
    if (messages.length === 3) {
      setTimeout(() => {
         setMessages(prev => [...prev, {
            _id: Date.now() + 1,
            role: user.role === 'guide' ? 'user' : 'guide',
            text: 'That sounds perfect! I will book the morning slot.',
            timestamp: new Date()
         }]);
      }, 1500);
    }
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
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#1ed760] rounded-full border-2 border-[#075e54]"></div>
                </div>
                <div>
                   <h3 className="text-sm font-bold text-white leading-tight">{recipient?.name || 'Guide'}</h3>
                   <span className="text-[10px] text-white/80">Online</span>
                </div>
             </div>
          </div>

          <div className="flex items-center space-x-4 text-white">
             {/* Icons removed per user request for AI Chat, keeping standard for Guide Chat? 
                 Actually user said "make the chat ui like the app and all page", 
                 and in previous AI chat I removed them. I'll keep them minimal or hide them if user wants parity.
                 I'll remove camera/more like AI chat to be consistent. */}
          </div>
       </div>

       {/* Chat Area with Background Texture and Logo Watermark */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
          {/* Background Watermark Logo */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-10">
            <img src={logo} alt="" className="w-80 h-80 object-cover rounded-full grayscale" />
          </div>

          <div className="relative z-20">
            <div className="flex justify-center mb-6">
               <div className="px-4 py-1.5 bg-[#d1e4f3] rounded-lg text-[10px] items-center text-[#54656f] font-medium shadow-sm uppercase tracking-wider">
                  Today
               </div>
            </div>

            <div className="flex justify-center mb-6">
               <div className="px-6 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-[10px] text-center max-w-[80%] text-[#54656f] font-medium border border-white/50 shadow-sm leading-relaxed">
                  🔒 Messages are end-to-end encrypted. GuideGo ensures your conversations remain private.
               </div>
            </div>

            {messages.map((msg, idx) => {
               const isMe = msg.role === user.role;
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
                        {/* Message Bubble Tail */}
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

       {/* WhatsApp Input Bar */}
       <div className="bg-[#f0f2f5] px-3 py-3 flex items-center space-x-2 bottom-0 w-full z-30 pb-8 sm:pb-3">
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
               className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
                 message.trim() ? 'bg-[#00a884] text-white' : 'bg-[#00a884] text-white'
               }`}
             >
                {message.trim() ? <Send className="w-5 h-5 ml-0.5" /> : <Mic className="w-5 h-5" />}
             </button>
          </form>
       </div>
    </div>
  );
};

export default Chat;
