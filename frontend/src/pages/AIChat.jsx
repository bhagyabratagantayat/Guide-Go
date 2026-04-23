import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Compass, CheckCheck, Sparkles, Bot, Clock, 
  MapPin, Zap, Info, ShieldCheck, Star, 
  MessageSquare, User, Navigation, Calendar, Flag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// 🧠 LOCAL INTELLIGENCE (No API Needed)
const GUIDE_KNOWLEDGE = {
  greetings: {
    keywords: ['hi', 'hello', 'namaste', 'hey', 'namaskar'],
    response: "Namaste! I am your **GuideGo Smart Assistant**. I'm an expert on Odisha tourism and our platform. How can I help you today?"
  },
  booking: {
    keywords: ['book', 'booking', 'hire', 'find guide', 'how to'],
    response: "Booking is simple! \n1. Go to **'Book Guide'**.\n2. Select your destination (Puri, Konark, etc.).\n3. Choose duration & language.\n4. Click **'Find a Guide'** to connect with a verified expert nearby!"
  },
  safety: {
    keywords: ['safe', 'safety', 'sos', 'emergency', 'security'],
    response: "Safety is our priority! \n- All guides are **Govt. Verified**.\n- Use the **24/7 SOS** button in your dashboard during a trip.\n- Share your live location with family directly from the app."
  },
  puri: {
    keywords: ['puri', 'jagannath', 'temple', 'beach'],
    response: "Puri is a spiritual gem! \n- **Must Visit**: Jagannath Temple & Blue Flag Golden Beach.\n- **Best Food**: 'Mahaprasad' and 'Khaja'.\n- **Pro Tip**: Visit during the Rath Yatra for an unforgettable experience!"
  },
  konark: {
    keywords: ['konark', 'sun temple', 'architecture'],
    response: "Konark Sun Temple is a World Heritage site! \n- It's a 13th-century masterpiece shaped like a giant chariot.\n- Visit during the **Konark Dance Festival** in December."
  },
  bhubaneswar: {
    keywords: ['bhubaneswar', 'temple city', 'lingaraj', 'caves'],
    response: "The 'Temple City'! \n- **Visit**: Lingaraj Temple, Dhauli Stupa, and Khandagiri Caves.\n- **Crafts**: Check out Ekamra Haat for local handloom."
  },
  chilika: {
    keywords: ['chilika', 'lake', 'dolphin', 'birds'],
    response: "Chilika is Asia's largest lagoon! \n- Visit **Satapada** for Irrawaddy Dolphins.\n- Visit **Mangalajodi** for incredible bird watching."
  },
  food: {
    keywords: ['food', 'eat', 'dish', 'odishan', 'pakhala', 'chhena poda'],
    response: "Try the 'Soul of Odisha' food: \n- **Pakhala**: Fermented rice.\n- **Chhena Poda**: Odisha's own cheesecake.\n- **Dalma**: Nutritious lentil & veggie stew."
  }
};

const AIChat = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'oracle', text: "Namaste! Ask me anything about Odisha or how to use GuideGo. I'm here to help!", timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const findBestResponse = (query) => {
    const q = query.toLowerCase();
    for (const cat in GUIDE_KNOWLEDGE) {
      if (GUIDE_KNOWLEDGE[cat].keywords.some(k => q.includes(k))) return GUIDE_KNOWLEDGE[cat].response;
    }
    return "That's interesting! While I'm still learning, I recommend checking our **'Book Guide'** section to find a local expert who can tell you everything about it!";
  };

  const handleSubmit = (e, q) => {
    if (e) e.preventDefault();
    const query = q || question;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: query, timestamp: new Date() }]);
    setQuestion('');
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'oracle', text: findBestResponse(query), timestamp: new Date() }]);
      setLoading(false);
    }, 1000);
  };

  const suggestions = [
    { text: "Puri Beach", icon: <MapPin size={14}/> },
    { text: "How to book?", icon: <Zap size={14}/> },
    { text: "Best Food", icon: <Star size={14}/> },
    { text: "Konark Temple", icon: <Compass size={14}/> }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-slate-950 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
      <Helmet><title>AI Assistant | GuideGo</title></Helmet>
      
      {/* Glow Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 blur-[100px] -z-10" />

      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center gap-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
          <Bot size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-black italic text-white tracking-tight">GuideGo AI</h1>
          <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em]">Smart Local Engine • Active</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
         <div className="max-w-4xl mx-auto w-full">
            <AnimatePresence>
               {messages.map((msg, i) => (
                 <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`p-8 rounded-[2.5rem] max-w-[85%] shadow-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white font-bold rounded-tr-none' : 'bg-slate-900/80 border border-white/5 text-slate-200 rounded-tl-none'}`}>
                      <div className="flex items-center gap-2 mb-3 opacity-30 text-[9px] font-black uppercase tracking-widest">
                         {msg.role === 'user' ? <User size={12}/> : <Bot size={12}/>} {msg.role === 'user' ? 'Traveler' : 'Assistant'}
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      {msg.role === 'user' && <div className="mt-3 flex justify-end opacity-20"><CheckCheck size={14}/></div>}
                   </div>
                 </motion.div>
               ))}
            </AnimatePresence>
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-slate-900/50 px-8 py-6 rounded-[2.5rem] rounded-tl-none flex gap-2 border border-white/5">
                    {[0,1,2].map(d => <motion.div key={d} animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1, delay: d*0.2 }} className="w-2 h-2 bg-blue-500 rounded-full" />)}
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
         </div>
      </div>

      {/* Input */}
      <div className="p-8 bg-slate-900/40 border-t border-white/5">
         <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
               {suggestions.map((s, i) => (
                 <button key={i} onClick={() => handleSubmit(null, s.text)} className="px-5 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all whitespace-nowrap flex items-center gap-2">
                   {s.icon} {s.text}
                 </button>
               ))}
            </div>
            <form onSubmit={handleSubmit} className="relative flex items-center bg-slate-800 border border-white/10 rounded-[2.5rem] p-2 pr-4 focus-within:border-blue-500 transition-all">
               <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about Odisha tourism..." className="flex-grow bg-transparent border-none text-white px-6 py-4 font-bold placeholder:text-slate-600 outline-none" />
               <button type="submit" className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20"><Send size={24} /></button>
            </form>
            <p className="text-[8px] text-center font-black text-slate-700 uppercase tracking-[0.5em]">Powered by GuideGo Intelligence • No API Used</p>
         </div>
      </div>
    </div>
  );
};

export default AIChat;
