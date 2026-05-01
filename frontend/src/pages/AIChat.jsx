import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Compass, CheckCheck, Sparkles, Bot, Clock, 
  MapPin, Zap, Info, ShieldCheck, Star, 
  MessageSquare, User, Navigation, Calendar, Flag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { INDIA_TOURISM_DATA } from '../data/indiaKnowledge';

// 🧠 LOCAL INTELLIGENCE (Merged Knowledge)
const GUIDE_KNOWLEDGE = {
  ...INDIA_TOURISM_DATA,
  greetings: {
    keywords: ['hi', 'hello', 'namaste', 'hey', 'namaskar'],
    response: "Namaste! I am your **GuideGo Smart Assistant**. I'm an expert on India's top tourist destinations and our platform. How can I help you today?"
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
    { text: "Puri Beach", icon: <MapPin size={14} className="text-[#ff385c]"/> },
    { text: "How to book?", icon: <Zap size={14} className="text-[#ff385c]"/> },
    { text: "Best Food", icon: <Star size={14} className="text-[#ff385c]"/> },
    { text: "Konark Temple", icon: <Compass size={14} className="text-[#ff385c]"/> }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-white rounded-[2.5rem] border border-[#dddddd] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] relative overflow-hidden">
      <Helmet><title>AI Assistant | GuideGo</title></Helmet>

      {/* Header */}
      <div className="p-8 border-b border-[#dddddd] bg-white/90 backdrop-blur-xl flex items-center gap-6">
        <div className="w-16 h-16 bg-[#ff385c] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
          <Bot size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-black italic text-[#222222] tracking-tight">GuideGo AI</h1>
          <p className="text-[10px] font-black uppercase text-[#717171] tracking-[0.3em]">Smart Local Engine • Active</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
         <div className="max-w-4xl mx-auto w-full">
            <AnimatePresence>
               {messages.map((msg, i) => (
                 <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`p-8 rounded-[2.5rem] max-w-[85%] shadow-lg ${msg.role === 'user' ? 'bg-[#ff385c] text-white font-bold rounded-tr-none shadow-rose-500/20' : 'bg-[#f7f7f7] border border-[#dddddd] text-[#222222] rounded-tl-none'}`}>
                      <div className={`flex items-center gap-2 mb-3 text-[9px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-white/70' : 'text-[#717171]'}`}>
                         {msg.role === 'user' ? <User size={12}/> : <Bot size={12}/>} {msg.role === 'user' ? 'Traveler' : 'Assistant'}
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      {msg.role === 'user' && <div className="mt-3 flex justify-end text-white/50"><CheckCheck size={14}/></div>}
                   </div>
                 </motion.div>
               ))}
            </AnimatePresence>
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-[#f7f7f7] px-8 py-6 rounded-[2.5rem] rounded-tl-none flex gap-2 border border-[#dddddd]">
                    {[0,1,2].map(d => <motion.div key={d} animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1, delay: d*0.2 }} className="w-2 h-2 bg-[#ff385c] rounded-full" />)}
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
         </div>
      </div>

      {/* Input */}
      <div className="p-8 bg-white border-t border-[#dddddd]">
         <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
               {suggestions.map((s, i) => (
                 <button key={i} onClick={() => handleSubmit(null, s.text)} className="px-5 py-3 rounded-xl bg-white border border-[#dddddd] shadow-sm text-[10px] font-bold text-[#222222] uppercase tracking-widest hover:border-[#222222] hover:bg-[#f7f7f7] transition-all whitespace-nowrap flex items-center gap-2">
                   {s.icon} {s.text}
                 </button>
               ))}
            </div>
            <form onSubmit={handleSubmit} className="relative flex items-center bg-white border-2 border-[#dddddd] rounded-[2.5rem] p-2 pr-4 focus-within:border-[#222222] transition-all shadow-sm">
               <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about Odisha tourism..." className="flex-grow bg-transparent border-none text-[#222222] px-6 py-4 font-bold placeholder:text-[#717171] outline-none" />
               <button type="submit" className="w-14 h-14 rounded-2xl bg-[#ff385c] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-rose-500/20"><Send size={24} /></button>
            </form>
            <p className="text-[8px] text-center font-black text-[#717171] uppercase tracking-[0.5em]">Powered by GuideGo Intelligence • design by pilu</p>
         </div>
      </div>
    </div>
  );
};

export default AIChat;
