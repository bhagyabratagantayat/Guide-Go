import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, Sparkles, Compass, Lightbulb, 
  ChevronRight, Activity, Share2, Download,
  History, Stars, Ghost, Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIChat = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'oracle', text: '"The whispers of Odisha are eternal. Where shall your spirit wander next, seeker of truth?"', timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e, q) => {
    if (e) e.preventDefault();
    const query = q || question;
    if (!query) return;

    const userMsg = { role: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    // Limited Demo Model Logic
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
      const { data } = await axios.post('/api/ai/ask', {
        question: query
      }, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}` }
      });
      
      const oracleMsg = { role: 'oracle', text: data.answer, timestamp: new Date() };
      setMessages(prev => [...prev, oracleMsg]);
    } catch (error) {
      const oracleMsg = { role: 'oracle', text: "The ancient scrolls are being transcribed. Please wait a moment, traveler.", timestamp: new Date() };
      setMessages(prev => [...prev, oracleMsg]);
    }
    setLoading(false);
  };

  const handleSuggestion = (suggestion) => {
    handleSubmit(null, suggestion);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-24 pb-32 lg:pb-0 font-sans">
      {/* Sacred Background Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px] -mr-64 -mt-64 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-500/10 rounded-full blur-[150px] -ml-64 -mb-64" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 contrast-125" />
      </div>

      {/* Oracle Header */}
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
                  <h1 className="text-3xl font-black text-white italic font-serif tracking-tight leading-none uppercase">Sacred Oracle</h1>
                  <div className="flex items-center space-x-3 mt-3">
                     <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                     </span>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Ancient Soul • Digital Mind</span>
                  </div>
               </div>
            </div>
            
            <div className="hidden md:flex space-x-3">
               <button className="w-14 h-14 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all flex items-center justify-center border border-white/5 shadow-inner"><History className="w-6 h-6" /></button>
               <button className="w-14 h-14 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all flex items-center justify-center border border-white/5 shadow-inner"><Zap className="w-6 h-6" /></button>
            </div>
         </motion.div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full px-6 flex-1 flex flex-col min-h-0 relative z-10">
         <div className="flex-1 overflow-y-auto px-4 py-8 space-y-12 custom-scrollbar scroll-smooth">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                   <div className={`p-8 md:p-10 rounded-[3rem] shadow-premium relative ${
                      msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none border border-slate-800' 
                      : 'bg-white/[0.04] text-slate-200 rounded-tl-none border border-white/10 backdrop-blur-3xl'
                   }`}>
                      {msg.role === 'oracle' ? (
                        <div className="prose prose-invert prose-sm max-w-none text-slate-100 font-bold italic leading-relaxed text-lg md:text-xl font-serif">
                           <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-lg md:text-xl font-black italic tracking-tight">{msg.text}</p>
                      )}
                      <div className={`flex items-center mt-5 space-x-3 ${msg.role === 'user' ? 'justify-end opacity-40' : 'justify-start opacity-20'}`}>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                           {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
            
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
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Oracle Conjuring...</span>
                  </div>
               </motion.div>
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* Suggestion Bubbles */}
         <div className="py-8 px-4">
            <div className="flex flex-wrap gap-4 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
               {[
                  "Sacred gems of Puri",
                  "Odisha's spiritual heritage",
                  "Secrets of Jagannath Temple",
                  "A seeker's path in Odisha"
               ].map((s, i) => (
                  <motion.button 
                     key={i}
                     whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => handleSuggestion(s)}
                     className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] transition-all backdrop-blur-2xl whitespace-nowrap shadow-xl"
                  >
                     <Sparkles className="w-3.5 h-3.5 mr-3 inline text-primary-400" />
                     {s}
                  </motion.button>
               ))}
            </div>
         </div>

         {/* Input Terminal */}
         <div className="pb-12 px-4">
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
                  placeholder="Ask the Infinite..."
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
            <p className="text-center mt-8 text-[9px] font-black text-slate-700 uppercase tracking-[0.6em]">GuideGo Sacred Intelligence • v4.0</p>
         </div>
      </div>
    </div>
  );
};

export default AIChat;
