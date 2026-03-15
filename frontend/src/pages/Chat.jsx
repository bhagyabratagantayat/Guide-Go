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
    // Scroll to bottom on load/new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        // Fetch recipient details (Guide or Tourist)
        // Since we don't have a direct "get user" endpoint yet, we'll mock it for the UI
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
    
    // Auto-respond for demo purposes if it's the first message
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
       <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between shadow-soft relative z-10">
          <div className="flex items-center space-x-4">
             <button 
               onClick={() => navigate(-1)}
               className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors active:scale-90"
             >
                <ChevronLeft className="w-5 h-5" />
             </button>
             
             <div className="flex items-center space-x-3">
                <div className="relative">
                   <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-serif font-black overflow-hidden border border-primary-100">
                      {recipient?.profilePicture ? (
                         <img src={recipient.profilePicture} alt={recipient.name} className="w-full h-full object-cover" />
                      ) : (
                         recipient?.name?.charAt(0)
                      )}
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">{recipient?.name}</h3>
                   <div className="flex items-center space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{recipient?.status}</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex items-center space-x-2">
             <button className="p-3 text-slate-400 hover:text-primary-600 transition-colors"><Phone className="w-5 h-5" /></button>
             <button className="p-3 text-slate-400 hover:text-primary-600 transition-colors"><Video className="w-5 h-5" /></button>
             <button className="p-3 text-slate-400 hover:text-slate-900 transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
       </div>

       {/* Security Banner */}
       <div className="bg-primary-50 px-6 py-2 border-b border-primary-100/50 flex items-center justify-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
          <p className="text-[9px] font-black text-primary-600 uppercase tracking-[0.2em]">End-to-End Encrypted via GuideGo Secure</p>
       </div>

       {/* Messages Area */}
       <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-95">
          <div className="flex justify-center my-8">
             <div className="px-4 py-1.5 bg-slate-200/50 backdrop-blur-md rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                Today
             </div>
          </div>

          {messages.map((msg, idx) => {
             const isMe = msg.role === user.role;
             return (
                <motion.div 
                  key={msg._id}
                  initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                >
                   <div className={`max-w-[80%] lg:max-w-[60%] space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!isMe && idx > 0 && messages[idx-1].role === msg.role ? null : (
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 px-2">
                            {isMe ? 'You' : recipient?.name}
                         </span>
                      )}
                      
                      <div className={`p-4 rounded-[2rem] shadow-premium relative ${
                         isMe 
                         ? 'bg-slate-900 text-white rounded-tr-none' 
                         : 'bg-white text-slate-800 rounded-tl-none border border-slate-50'
                      }`}>
                         <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                         <div className={`flex items-center mt-2 space-x-1 ${isMe ? 'justify-end' : 'justify-start opacity-50'}`}>
                            <span className="text-[9px] font-bold uppercase tracking-tighter">
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
       <div className="bg-white px-6 py-6 border-t border-slate-100 safe-bottom">
          <form 
            onSubmit={handleSendMessage}
            className="bg-slate-50 rounded-[2.5rem] p-2 flex items-center space-x-2 border border-slate-100 shadow-inner focus-within:border-primary-200 transition-colors"
          >
             <button type="button" className="p-4 text-slate-400 hover:text-primary-500 transition-colors"><Paperclip className="w-5 h-5" /></button>
             <input 
               type="text"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="Write your adventure message..."
               className="flex-1 bg-transparent py-4 px-2 text-sm font-bold text-slate-800 focus:outline-none placeholder:text-slate-300 italic"
             />
             <div className="flex items-center space-x-1 pr-2">
                <button type="button" className="p-3 text-slate-400 hover:text-yellow-500 transition-colors"><Smile className="w-5 h-5" /></button>
                <button type="button" className="p-3 text-slate-400 hover:text-primary-500 transition-colors"><Image className="w-5 h-5" /></button>
                <button 
                  type="submit" 
                  disabled={!message.trim()}
                  className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-primary-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xl active:scale-90"
                >
                   <Send className="w-5 h-5" />
                </button>
             </div>
          </form>
          
          <div className="flex justify-center mt-4">
             <div className="flex items-center space-x-1">
                <Compass className="w-3 h-3 text-primary-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by GuideGo Messenger</span>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Chat;
