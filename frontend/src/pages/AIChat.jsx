import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Map, Calendar, Coffee, Bot, 
  Sparkles, Compass, Lightbulb, 
  ChevronRight, Activity, Share2, Download
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIChat = () => {
  const [question, setQuestion] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e, q) => {
    if (e) e.preventDefault();
    const query = q || question;
    if (!query) return;

    setLoading(true);
    setItinerary(''); // Clear previous for better effect
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.post('/api/ai/ask', {
        question: query
      }, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setItinerary(data.answer);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const msg = error.response?.status === 401 
        ? 'Authorization expired. Please login again.' 
        : 'The sacred knowledge is currently beyond reach. Please try again.';
      alert(msg);
    }
    setLoading(false);
  };

  const handleSuggestion = (suggestion) => {
    setQuestion(suggestion);
    handleSubmit(null, suggestion);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-full border border-primary-100 mb-6">
           <Sparkles className="w-4 h-4 text-primary-600 animate-pulse" />
           <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Oracle System Active</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-slate-800 tracking-tighter italic font-serif leading-tight">
          SACRED <span className="text-primary-600">VOICE</span>
        </h1>
        <p className="text-slate-500 font-bold text-lg max-w-2xl mx-auto italic mt-4">
          "Where shall your soul wander next?" Speak to our AI Oracle for a divine travel manuscript.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Input Terminal */}
        <div className="lg:col-span-4 space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 rounded-[3.5rem] shadow-premium relative overflow-hidden"
          >
            <div className="relative z-10 space-y-8">
              <div className="flex items-center space-x-3 border-b border-slate-50 pb-6">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                   <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Manuscript Query</h2>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Enter your destination</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. A 3-day spiritual quest in Puri & Konark..."
                    className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border-none focus:ring-4 focus:ring-primary-500/10 outline-none h-56 font-bold text-slate-700 placeholder:text-slate-300 italic resize-none shadow-inner"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all relative overflow-hidden active:scale-95 group ${
                    loading ? 'bg-slate-200 text-slate-500' : 'bg-slate-900 text-white shadow-2xl hover:bg-primary-600'
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                     {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                     ) : (
                        <Send className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     )}
                     <span>{loading ? 'Communing...' : 'Invoke Oracle'}</span>
                  </div>
                </button>
              </form>

              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                   <Lightbulb className="w-4 h-4 text-primary-500" />
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Common Invocations</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Plan a 1 day trip in Puri",
                    "Secret spiritual spots in Bhubaneswar",
                    "Best local street food tour"
                  ].map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSuggestion(s)}
                      className="text-left py-3 px-5 rounded-2xl bg-white border border-slate-50 hover:border-primary-500/20 hover:bg-primary-50 group transition-all"
                    >
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary-600 transition-colors uppercase tracking-tight truncate pr-4">{s}</span>
                         <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-primary-500" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-500/5 rounded-full blur-[60px]" />
          </motion.div>
        </div>

        {/* Response Manuscript */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
          <AnimatePresence mode="wait">
            {itinerary ? (
              <motion.div 
                key="response"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="glass-card rounded-[4rem] shadow-premium flex flex-col h-full border border-white/40 overflow-hidden"
              >
                <div className="p-12 lg:p-20 overflow-y-auto custom-scrollbar flex-1 prose prose-slate max-w-none">
                  <div className="flex items-center justify-between mb-16 pb-8 border-b border-primary-100">
                    <div className="space-y-2">
                       <h2 className="text-4xl font-black m-0 text-slate-900 tracking-tighter italic font-serif uppercase">The Oracle Spoke</h2>
                       <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em]">Manuscript Generated Successfully</p>
                    </div>
                    <div className="flex space-x-3">
                       <button className="p-4 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-white transition-all rounded-2xl shadow-soft"><Share2 className="w-5 h-5" /></button>
                       <button className="p-4 bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-white transition-all rounded-2xl shadow-soft"><Download className="w-5 h-5" /></button>
                    </div>
                  </div>
                  
                  <div className="text-slate-700 leading-loose font-medium text-lg italic whitespace-pre-wrap">
                    {itinerary}
                  </div>
                  
                  <div className="mt-20 pt-10 border-t border-slate-50 flex items-center space-x-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center text-white">
                        <Bot className="w-6 h-6" />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-xs">This manuscript was generated using the sacred neural knowledge of GuideGo Oracle.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-20 glass-card rounded-[4rem] border-2 border-dashed border-slate-100 relative group"
              >
                <div className="relative z-10 w-40 h-40 bg-slate-50 rounded-[3rem] shadow-inner flex items-center justify-center mb-10 group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0">
                  <Bot className="w-20 h-20 text-slate-200 group-hover:text-primary-500 transition-colors duration-700" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter italic font-serif">Awaken the Oracle</h3>
                <p className="text-slate-400 font-bold max-w-sm text-center italic text-lg">
                  "The spiritual path is not yet written. Enter your intent to begin the illumination."
                </p>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
