import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Send, Phone, Video, Info, User, 
  ChevronLeft, Image, Paperclip, Smile,
  MoreVertical, ShieldCheck, Compass, CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipient, setRecipient] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { _id: '1', role: 'guide', text: 'Namaste! I am your local guide for Puri. How can I help you plan your spiritual journey today?', timestamp: new Date(Date.now() - 3600000) },
    { _id: '2', role: 'tourist', text: 'Hi! I want to visit the Jagannath Temple tomorrow morning. What is the best time?', timestamp: new Date(Date.now() - 1800000) },
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
            role: user.role === 'guide' ? 'tourist' : 'guide',
            text: 'That sounds perfect! I will book the morning slot.',
            timestamp: new Date()
         }]);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-surface-50 flex flex-col z-[5000]">
       {/* Chat Header */}
       <div className="bg-white px-6 py-6 flex items-center justify-between border-b border-surface-100 relative z-10 shadow-soft">
          <div className="flex items-center space-x-5">
             <button 
               onClick={() => navigate(-1)}
               className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all active:scale-90"
             >
                <ChevronLeft className="w-5 h-5" />
             </button>
             
             <div className="flex items-center space-x-4">
                <div className="relative">
                   <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 font-serif font-black overflow-hidden border-2 border-white shadow-soft">
                      {recipient?.profilePicture ? (
                         <img src={recipient.profilePicture} alt={recipient.name} className="w-full h-full object-cover" />
                      ) : (
                         recipient?.name?.charAt(0)
                      )}
                   </div>
                   <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                   <h3 className="text-base font-black text-slate-900 tracking-tight leading-none mb-1 italic font-serif uppercase">{recipient?.name}</h3>
                   <div className="flex items-center space-x-1.5 opacity-60">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('chat.online') || 'Present'}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex items-center space-x-2">
             <button className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all"><Phone className="w-4 h-4" /></button>
             <button className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all"><Video className="w-4 h-4" /></button>
          </div>
       </div>

       {/* Security Banner */}
       <div className="bg-primary-50 px-6 py-2.5 flex items-center justify-center space-x-3 border-b border-primary-100/30">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
          <p className="text-[9px] font-black text-primary-600 uppercase tracking-[0.3em]">End-to-End Encrypted via GuideGo Premium</p>
       </div>

       {/* Messages Area */}
       <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
          <div className="flex justify-center mb-4">
             <div className="px-5 py-2 bg-white/40 backdrop-blur-md rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border border-surface-100">
                Story Logs • Today
             </div>
          </div>

          {messages.map((msg, idx) => {
             const isMe = msg.role === user.role;
             return (
                <motion.div 
                  key={msg._id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                   <div className={`max-w-[85%] lg:max-w-[70%] space-y-1.5 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`p-5 rounded-[2.2rem] shadow-premium relative ${
                         isMe 
                         ? 'bg-slate-900 text-white rounded-tr-none' 
                         : 'bg-white text-slate-800 rounded-tl-none border border-surface-100'
                      }`}>
                         <p className="text-sm font-bold leading-relaxed tracking-tight">{msg.text}</p>
                         <div className={`flex items-center mt-3 space-x-2 opacity-40 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[8px] font-black uppercase tracking-widest">
                               {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-primary-400" />}
                         </div>
                      </div>
                   </div>
                </motion.div>
             );
          })}
          <div ref={messagesEndRef} />
       </div>

       {/* Input Area */}
       <div className="bg-white px-6 pt-6 pb-10 border-t border-surface-100 safe-bottom">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center space-x-3"
          >
             <button type="button" className="w-12 h-12 bg-surface-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-500 transition-all shadow-inner"><Paperclip className="w-5 h-5" /></button>
             <div className="flex-1 bg-surface-50 rounded-[2rem] p-1.5 flex items-center border border-surface-100 focus-within:border-primary-300 transition-all shadow-inner">
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1 bg-transparent py-3 px-4 text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-300 italic"
                />
                <div className="flex items-center space-x-1 pr-1">
                   <button type="button" className="w-10 h-10 text-slate-300 hover:text-yellow-500 transition-colors"><Smile className="w-5 h-5" /></button>
                   <button 
                     type="submit" 
                     disabled={!message.trim()}
                     className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-primary-500 disabled:opacity-20 transition-all shadow-xl"
                   >
                      <Send className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </form>
       </div>
    </div>
  );
};

export default Chat;
