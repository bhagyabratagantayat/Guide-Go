import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Compass, ChevronLeft, Plus, 
  MoreVertical, CheckCheck, Smile, 
  Paperclip, Camera, Mic, Sparkles,
  Bot, Clock
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
<<<<<<< HEAD
    { role: 'oracle', text: "Namaste! I am your Guide AI. I can help you discover Odisha's hidden gems, plan your itinerary, or explain the history of any sacred site. How can I assist you today?", timestamp: new Date() }
=======
    { role: 'oracle', text: '"Namaste! I am Guide AI, your personal travel companion. Where shall we explore next, traveler?"', timestamp: new Date() }
>>>>>>> a942ae1
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

    // Remove the clicked FAQ from the list
    if (q) {
      setFaqs(prev => prev.filter(item => item !== q));
    }

    const userMsg = { role: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    // Demo Itinerary Logic for Prototype
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
      }, 1000);
      return;
    }

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
<<<<<<< HEAD
      const oracleMsg = { role: 'oracle', text: "I'm sorry, I'm having trouble connecting to the ancient scrolls right now. Please try again in a moment.", timestamp: new Date() };
=======
      const oracleMsg = { role: 'oracle', text: "I'm checking my travel database for you. One moment, traveler.", timestamp: new Date() };
>>>>>>> a942ae1
      setMessages(prev => [...prev, oracleMsg]);
    }
    setLoading(false);
  };

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 bg-[#efe7de] flex flex-col z-[5000]">
      {/* WhatsApp Style Header */}
      <div className="bg-[#075e54] px-4 py-3 pb-4 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center space-x-2 text-white">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#075e54]"></div>
            </div>
            <div>
              <h3 className="text-base font-bold leading-none">{t('common.oracle') || 'Guide AI'}</h3>
              <p className="text-[10px] text-emerald-100/80 mt-1 font-medium">Online • AI Assistant</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-white">
          {/* Icons removed per user request */}
        </div>
      </div>

      {/* Chat Area with Background Texture and Logo Watermark */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#efe7de] relative"
      >
        {/* Background Watermark Logo */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
          <img src={logo} alt="" className="w-80 h-80 object-cover rounded-full grayscale" />
        </div>
=======
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
               <button className="w-14 h-14 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all flex items-center justify-center border border-white/5 shadow-inner"><History className="w-6 h-6" /></button>
               <button className="w-14 h-14 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all flex items-center justify-center border border-white/5 shadow-inner"><Zap className="w-6 h-6" /></button>
            </div>
         </motion.div>
      </div>
>>>>>>> a942ae1

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="px-4 py-1.5 bg-[#d1e4f3] rounded-lg text-[10px] items-center text-[#54656f] font-medium shadow-sm uppercase tracking-wider">
              Today
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="px-6 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-[10px] text-center max-w-[80%] text-[#54656f] font-medium border border-white/50 shadow-sm">
               🔒 Messages are end-to-end encrypted. Guide AI cannot read your private location data.
            </div>
          </div>

          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div 
                  className={`max-w-[85%] lg:max-w-[70%] px-3 py-2 rounded-xl relative shadow-sm ${
                    isUser 
                    ? 'bg-[#dcf8c6] text-[#303030] rounded-tr-none' 
                    : 'bg-white text-[#303030] rounded-tl-none'
                  }`}
                >
                  {/* Message Bubble Tail Component */}
                  <div className={`absolute top-0 w-2 h-2 ${isUser ? '-right-2 bg-[#dcf8c6]' : '-left-2 bg-white'}`} 
                       style={{ clipPath: isUser ? 'polygon(0 0, 0 100%, 100% 0)' : 'polygon(100% 0, 100% 100%, 0 0)' }}>
                  </div>

                  <div className="text-sm leading-relaxed pr-12">
                    {msg.role === 'oracle' ? (
                      <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:text-slate-900 prose-strong:text-slate-900">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                  
                  <div className="absolute bottom-1 right-2 flex items-center space-x-1">
                     <span className="text-[10px] text-[#8696a0] font-normal">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                     </span>
                     {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                  </div>
                </div>
              </motion.div>
<<<<<<< HEAD
            );
          })}
=======
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
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Guide AI Thinking...</span>
                  </div>
               </motion.div>
            )}
            <div ref={messagesEndRef} />
         </div>
>>>>>>> a942ae1

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-2 rounded-xl rounded-tl-none shadow-sm flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((d) => (
                    <motion.div
                      key={d}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                      className="w-1.5 h-1.5 bg-[#8696a0] rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

<<<<<<< HEAD
      {/* WhatsApp Input Bar */}
      <div className="bg-[#f0f2f5] border-t border-black/5 pb-8 sm:pb-3">
        {/* Suggestion Chips - Now integrated above input and visible on all screens */}
        <div className="px-4 py-3 overflow-x-auto no-scrollbar bg-[#f0f2f5]/50 backdrop-blur-sm">
           <div className="flex space-x-2">
              <AnimatePresence>
                {faqs.map((s, i) => (
                   <motion.button 
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5, width: 0, marginRight: 0 }}
                      onClick={() => handleSubmit(null, s)}
                      className="px-4 py-2 bg-white border border-[#e9edef] rounded-full text-xs text-[#54656f] hover:bg-[#f8f9fa] whitespace-nowrap shadow-sm font-medium transition-colors flex items-center space-x-2 shrink-0"
                   >
                      <Sparkles className="w-3.5 h-3.5 text-[#00a884]" />
                      <span>{s}</span>
                   </motion.button>
                ))}
              </AnimatePresence>
           </div>
        </div>

        <div className="px-3 py-2 flex items-center space-x-2">
          <div className="flex items-center space-x-1">
             {/* Icons removed per user request */}
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex items-center space-x-2">
             <div className="flex-1 bg-white rounded-xl px-4 py-2 flex items-center shadow-sm">
               <input 
                 type="text"
                 value={question}
                 onChange={(e) => setQuestion(e.target.value)}
                 placeholder="Type a message"
                 className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-[#3b4a54] placeholder:text-[#8696a0] py-1"
               />
             </div>
             
             <button 
               type="submit"
               disabled={loading || !question.trim()}
               className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
                 question.trim() ? 'bg-[#00a884] text-white' : 'bg-[#00a884] text-white'
               }`}
             >
               {question.trim() ? <Send className="w-5 h-5 ml-0.5" /> : <Mic className="w-5 h-5" />}
             </button>
          </form>
        </div>
=======
         {/* Input Terminal */}
         <div className="pb-32 lg:pb-12 px-4">
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
>>>>>>> a942ae1
      </div>
    </div>
  );
};

export default AIChat;
