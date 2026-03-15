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
    { role: 'oracle', text: '"The winds of Bharat whispers secrets of ancient paths. Where shall your soul wander next, seeker?"', timestamp: new Date() }
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

    try {
      const { data } = await axios.post('/api/ai/ask', {
        question: query
      }, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}` }
      });
      
      const oracleMsg = { role: 'oracle', text: data.answer, timestamp: new Date() };
      setMessages(prev => [...prev, oracleMsg]);
    } catch (error) {
      const oracleMsg = { role: 'oracle', text: "The sacred knowledge is currently beyond reach. Please try again soon, traveler.", timestamp: new Date() };
      setMessages(prev => [...prev, oracleMsg]);
    }
    setLoading(false);
  };

  const handleSuggestion = (suggestion) => {
    handleSubmit(null, suggestion);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col pt-24 pb-32 lg:pb-0 font-sans">
      {/* Sacred Background Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden h-screen">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-600/10 rounded-full blur-[120px] -ml-48 -mb-48" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
      </div>

      {/* Oracle Header */}
      <div className="max-w-4xl mx-auto w-full px-6 mb-8 relative z-10">
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 flex items-center justify-between"
         >
            <div className="flex items-center space-x-5">
               <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl relative">
                  <Stars className="w-8 h-8 text-white animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-slate-900" />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-white italic font-serif tracking-tight leading-none uppercase">Sacred Oracle</h1>
                  <div className="flex items-center space-x-2 mt-2">
                     <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                     </span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Communing with Infinite Data</span>
                  </div>
               </div>
            </div>
            
            <div className="hidden md:flex space-x-3">
               <button className="p-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all"><History className="w-5 h-5" /></button>
               <button className="p-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all"><Zap className="w-5 h-5" /></button>
            </div>
         </motion.div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full px-6 flex-1 flex flex-col min-h-0 relative z-10">
         <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10 custom-scrollbar scroll-smooth">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                   <div className={`p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative ${
                      msg.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-none border border-primary-500 shadow-primary-500/10' 
                      : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/10 backdrop-blur-3xl'
                   }`}>
                      {msg.role === 'oracle' ? (
                        <div className="prose prose-invert prose-sm max-w-none text-slate-200 font-medium italic leading-loose text-base md:text-lg">
                           <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-base md:text-lg font-black italic tracking-wide">{msg.text}</p>
                      )}
                      <div className={`flex items-center mt-4 space-x-2 ${msg.role === 'user' ? 'justify-end italic opacity-50' : 'justify-start opacity-30 italic'}`}>
                        <span className="text-[8px] font-black uppercase tracking-widest">
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
                  <div className="bg-white/5 p-6 rounded-[2.5rem] rounded-tl-none border border-white/5 flex items-center space-x-4">
                     <div className="flex space-x-1.5">
                        {[0,1,2].map(d => (
                           <motion.div 
                             key={d}
                             animate={{ y: [0, -5, 0] }}
                             transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.1 }}
                             className="w-1.5 h-1.5 bg-primary-500 rounded-full"
                           />
                        ))}
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Oracle Thinking...</span>
                  </div>
               </motion.div>
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* Suggestion Bubbles */}
         <div className="py-6 px-4">
            <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
               {[
                  "Plan a 3-day spiritual quest in Puri",
                  "Hidden gems in Odisha",
                  "Top local food spots",
                  "Best time to visit Konark"
               ].map((s, i) => (
                  <motion.button 
                     key={i}
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => handleSuggestion(s)}
                     className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all backdrop-blur-xl whitespace-nowrap"
                  >
                     <Sparkles className="w-3 h-3 mr-2 inline text-primary-400" />
                     {s}
                  </motion.button>
               ))}
            </div>
         </div>

         {/* Input Terminal */}
         <div className="pb-10 px-4">
            <form 
              onSubmit={handleSubmit}
              className="bg-white/10 backdrop-blur-3xl border border-white/10 p-3 rounded-[3rem] shadow-2xl flex items-center space-x-3 focus-within:border-primary-500/50 transition-all group"
            >
               <div className="p-4 bg-white/5 rounded-full text-slate-400 group-focus-within:text-primary-400 transition-colors">
                  <Compass className="w-6 h-6" />
               </div>
               <input 
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Speak to the Oracle..."
                  className="flex-1 bg-transparent px-2 py-4 text-white font-black italic text-lg placeholder:text-slate-600 outline-none"
               />
               <button 
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="w-14 h-14 bg-primary-600 text-white rounded-[2rem] flex items-center justify-center hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 shadow-2xl shadow-primary-500/20 active:scale-90 transition-all group/btn"
               >
                  <Send className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
               </button>
            </form>
            <p className="text-center mt-6 text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">GuideGo Sacred Intelligence v4.0</p>
         </div>
      </div>
    </div>
  );
};

export default AIChat;
