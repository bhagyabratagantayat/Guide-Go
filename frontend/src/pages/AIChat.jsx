import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Compass, CheckCheck, Sparkles, Bot, Clock, Stars, History, Zap 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

const AIChat = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'oracle', text: "Namaste! I am Guide AI, your personal travel companion. Where shall we explore next, traveler?", timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const [faqs] = useState([
    "Best places in Puri",
    "Konark Sun Temple facts",
    "Plan a 3-day trip to Odisha",
    "Local food recommendations"
  ]);

  const handleSubmit = async (e, q) => {
    if (e) e.preventDefault();
    const query = q || question;
    if (!query) return;

    const userMsg = { role: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.post('/api/ai/ask', { question: query }, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setMessages(prev => [...prev, { role: 'oracle', text: data.answer, timestamp: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'oracle', text: "I'm checking my travel database. One moment, traveler.", timestamp: new Date() }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-10 space-y-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-6 mb-12">
               <div className="w-20 h-20 bg-[var(--accent)] rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
                  <Bot size={40} />
               </div>
               <div>
                  <h1 className="text-4xl font-black italic font-serif text-white uppercase tracking-tight">Guide AI</h1>
                  <p className="text-[10px] font-black uppercase text-[var(--accent)] tracking-[0.4em] mt-1">Smart Intelligence • Online</p>
               </div>
            </div>

            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-8`}
              >
                <div className={`p-8 rounded-[2.5rem] max-w-[85%] ${
                  msg.role === 'user' 
                  ? 'bg-[var(--accent)] text-white font-bold rounded-tr-none' 
                  : 'glass-card text-white rounded-tl-none'
                }`}>
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  <div className="flex items-center justify-between mt-4 opacity-40 text-[9px] font-black uppercase tracking-widest">
                     <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                     {msg.role === 'user' && <CheckCheck size={12} />}
                  </div>
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex justify-start">
                 <div className="glass-card px-8 py-6 rounded-[2.5rem] rounded-tl-none flex items-center gap-4">
                    <div className="flex gap-1.5">
                       {[0,1,2].map(d => <div key={d} className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{animationDelay: `${d*0.2}s`}} />)}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Thinking...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
      </div>

      {/* Input Area */}
      <div className="p-10 border-t border-[var(--border)] bg-[var(--bg-base)]">
         <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
               {faqs.map((s, i) => (
                 <button 
                  key={i} 
                  onClick={() => handleSubmit(null, s)}
                  className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest hover:text-white transition-all whitespace-nowrap"
                 >
                   {s}
                 </button>
               ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center bg-[var(--bg-card)] border border-[var(--border)] rounded-[2.5rem] p-2 pr-4 focus-within:border-[var(--accent)] transition-all">
               <input 
                  type="text" 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask for an itinerary or facts..."
                  className="flex-grow bg-transparent border-none text-white px-8 py-4 font-bold placeholder:text-white/20 outline-none"
               />
               <button type="submit" className="w-14 h-14 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20">
                  <Send size={24} />
               </button>
            </form>
         </div>
      </div>
    </div>
  );
};

export default AIChat;
