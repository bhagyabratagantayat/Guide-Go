import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Mail, MessageCircle, Phone, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HelpPage = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    { q: "How do I book a verified guide?", a: "Simply navigate to the 'Guides' section from the sidebar, find an 'Approved' expert, and click 'Book Service'. You can choose between hourly or full-day tours." },
    { q: "Is GuideGo available throughout India?", a: "Currently, we focus primarily on Odisha's heritage and natural spots. We are expanding to other states soon. Stay tuned!" },
    { q: "Can I cancel my booking?", a: "Yes, you can cancel up to 24 hours before the scheduled tour for a full refund. Visit 'My Bookings' and select the cancel option." },
    { q: "What is the difference between a Guide and an Agency?", a: "A Guide is an individual local expert, while an Agency is a registered tour operator that manages group tours and logistics." },
    { q: "How does the AI Assistant work?", a: "Our AI Assistant uses real-time travel data to help you build itineraries, find hidden spots, and answer local cultural questions instantly." }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div className="flex items-center gap-6">
        <div className="p-5 bg-blue-500 rounded-3xl shadow-xl shadow-blue-500/20 text-white">
           <ShieldCheck size={32} />
        </div>
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] mb-2">Safety & Support</h1>
          <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">Help Center</h2>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] ml-2 mb-6">Frequently Asked Questions</h3>
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass-card rounded-[2rem] overflow-hidden border border-white/5">
            <button 
               onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
               className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-all"
            >
              <span className="font-bold text-[var(--text-primary)]">{faq.q}</span>
              {openIdx === idx ? <ChevronUp size={20} className="text-[var(--accent)]" /> : <ChevronDown size={20} className="text-[var(--text-secondary)]" />}
            </button>
            <AnimatePresence>
               {openIdx === idx && (
                 <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-sm font-medium text-[var(--text-secondary)] leading-relaxed"
                 >
                    {faq.a}
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
         <ContactCard icon={MessageCircle} label="Live Chat" value="Available 10am - 8pm" />
         <ContactCard icon={Mail} label="Email Support" value="help@guidego.in" />
         <ContactCard icon={Phone} label="Emergency Line" value="+91 1800-ODISHA" />
      </div>
    </div>
  );
};

const ContactCard = ({ icon: Icon, label, value }) => (
  <div className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 hover:border-[var(--accent)]/30 transition-all cursor-pointer">
     <div className="p-4 bg-white/5 rounded-2xl text-[var(--text-secondary)]">
        <Icon size={24} />
     </div>
     <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] leading-none mb-2">{label}</p>
        <p className="font-bold text-[var(--text-primary)]">{value}</p>
     </div>
  </div>
);

export default HelpPage;
