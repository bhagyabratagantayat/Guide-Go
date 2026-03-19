import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Compass, ChevronLeft, Plus, 
  MoreVertical, CheckCheck, Smile, 
  Paperclip, Camera, Mic, Sparkles,
  Bot, Clock, Stars, History, Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/GuideGo Logo.jpeg';

const AIChat = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'oracle', text: "Namaste! I am Guide AI, your personal travel companion. Where shall we explore next, traveler?", timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const [faqs, setFaqs] = useState([
    "Best places in Puri",
    "Konark Sun Temple facts",
    "Plan a 3-day trip to Odisha",
    "Local food recommendations",
    "History of Jagannath Temple",
    "Hidden beaches in Odisha"
  ]);

  const handleSubmit = async (e, q) => {
    if (e) e.preventDefault();
    const query = q || question;
    if (!query) return;

    if (q) {
      setFaqs(prev => prev.filter(item => item !== q));
    }

    const userMsg = { role: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('3-day trip') || lowerQuery.includes('3 day trip') || lowerQuery.includes('itinerary')) {
      const demoItinerary = `
### 🌅 Perfect 3-Day Odisha Odyssey

**Day 1: The Spiritual Hub (Puri)**
- **Morning**: Jagannath Temple Visit & Morning Aarti.
- **Afternoon**: Relax at Golden Beach (Blue Flag certified).
- **Evening**: Visit Raghurajpur Heritage Craft Village.

**Day 2: Architectural Marvels (Konark & Dhauli)**
- **Morning**: Drive to Konark Sun Temple (The Black Pagoda).
- **Afternoon**: Chandrabhaga Beach stroll.
- **Evening**: Light & Sound show at Dhauli Shanti Stupa.

**Day 3: The Temple City (Bhubaneswar)**
- **Morning**: Lingaraj Temple & Mukteshwar Temple.
- **Afternoon**: Explore Udayagiri & Khandagiri Caves.
- **Evening**: Shopping at Ekamra Haat for local handlooms.

*Would you like me to find a local guide for this route?*
`;
      setTimeout(() => {
        const oracleMsg = { role: 'oracle', text: demoItinerary, timestamp: new Date() };
        setMessages(prev => [...prev, oracleMsg]);
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.post('/api/ai/ask', {
        question: query
      }, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      
      const oracleMsg = { role: 'oracle', text: data.answer, timestamp: new Date() };
      setMessages(prev => [...prev, oracleMsg]);
    } catch (error) {
      const oracleMsg = { role: 'oracle', text: "I'm checking my travel database for you. One moment, traveler.", timestamp: new Date() };
      setMessages(prev => [...prev, oracleMsg]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-24 pb-32 lg:pb-0 font-sans">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] -mr-64 -mt-64 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-500/10 rounded-full blur-[150px] -ml-64 -mb-64" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 contrast-125" />
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto w-full px-6 mb-12 relative z-10">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 flex items-center justify-between shadow-2xl"
         >
            <div className="flex items-center space-x-6">
               <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative rotate-3 group-hover:rotate-0 transition-transform">
                  <Stars className="w-10 h-10 text-white animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-950" />
               </div>
               <div>
                  <h1 className="text-3xl font-black text-white italic font-serif tracking-tight leading-none uppercase">Guide AI</h1>
                  <div className="flex items-center space-x-3 mt-3">
                     <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                     </span>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Smart Travel Assistant • Local Expert</span>
                  </div>
               </div>
            </div>
            
            <div className="hidden md:flex space-x-3">
               <button className="w-14 h-14 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all flex items-center justify-center border border-white/5 shadow-inner" onClick={() => navigate(-1)}><ChevronLeft className="w-6 h-6" /></button>
               <button className="w-14 h-14 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all flex items-center justify-center border border-white/5 shadow-inner"><History className="w-6 h-6" /></button>
            </div>
         </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-8 relative z-10 custom-scrollbar max-w-4xl mx-auto w-full pb-10">
          <div className="relative z-10">
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user';
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: isUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-8`}
                >
                  <div 
                    className={`max-w-[85%] lg:max-w-[75%] p-8 rounded-[2.5rem] relative ${
                      isUser 
                      ? 'bg-primary-500 text-slate-950 rounded-tr-none font-bold shadow-2xl shadow-primary-500/20' 
                      : 'bg-white/5 backdrop-blur-2xl text-white rounded-tl-none border border-white/10'
                    }`}
                  >
                    <div className="text-sm leading-relaxed mb-4">
                      {msg.role === 'oracle' ? (
                        <div className={`prose prose-sm max-w-none ${isUser ? 'prose-slate' : 'prose-invert'} prose-headings:text-white prose-strong:text-white`}>
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-lg font-black italic tracking-tight uppercase leading-tight">{msg.text}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between opacity-40">
                       <span className="text-[9px] font-black uppercase tracking-widest">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                       </span>
                       {isUser && <CheckCheck className="w-4 h-4" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {loading && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }}
                 className="flex justify-start"
               >
                  <div className="bg-white/5 px-8 py-6 rounded-[2.5rem] rounded-tl-none border border-white/5 flex items-center space-x-5 backdrop-blur-xl">
                     <div className="flex space-x-2">
                        {[0,1,2].map(d => (
                           <motion.div 
                             key={d}
                             animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
                             transition={{ repeat: Infinity, duration: 1, delay: d * 0.15 }}
                             className="w-2 h-2 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                           />
                        ))}
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Guide AI Thinking...</span>
                  </div>
               </motion.div>
            )}
            <div ref={messagesEndRef} />
         </div>
      </div>

      {/* Input Terminal */}
      <div className="pb-32 lg:pb-12 px-6 max-w-4xl mx-auto w-full relative z-20">
         <div className="mb-6 flex overflow-x-auto gap-3 no-scrollbar pb-2">
            {faqs.map((s) => (
               <button 
                 key={s}
                 onClick={() => handleSubmit(null, s)}
                 className="flex-shrink-0 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all shadow-xl"
               >
                  {s}
               </button>
            ))}
         </div>

         <form 
           onSubmit={handleSubmit}
           className="bg-white/[0.08] backdrop-blur-3xl border border-white/10 p-2.5 rounded-[4rem] shadow-2xl flex items-center space-x-4 focus-within:border-primary-500/40 transition-all group"
         >
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-slate-500 group-focus-within:text-primary-400 transition-colors shadow-inner">
               <Compass className="w-7 h-7" />
            </div>
            <input 
               type="text"
               value={question}
               onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me anything about your trip..."
               className="flex-1 bg-transparent px-2 py-5 text-white font-black italic text-xl placeholder:text-slate-700 outline-none"
            />
            <button 
               type="submit"
               disabled={loading || !question.trim()}
               className="w-16 h-16 bg-primary-600 text-white rounded-[2.5rem] flex items-center justify-center hover:bg-primary-500 disabled:opacity-20 shadow-2xl shadow-primary-500/30 active:scale-90 transition-all group/btn"
            >
               <Send className="w-7 h-7 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
         </form>
         <p className="text-center mt-8 text-[9px] font-black text-slate-700 uppercase tracking-[0.6em]">Guide AI Smart Intelligence • v4.0</p>
      </div>
    </div>
  );
};

export default AIChat;
