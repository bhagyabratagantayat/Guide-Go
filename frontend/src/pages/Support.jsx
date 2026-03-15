import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, MessageSquare, Phone, ChevronRight, ChevronDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  
  const faqs = [
    {
      q: "How do I book a guide?",
      a: "Simply go to the Guides page, select your preferred guide, and click the 'Book Now' button. You'll be asked to provide your details and choose a payment method."
    },
    {
      q: "Is the payment secure?",
      a: "Yes, GuideGo uses industry-standard encryption and premium payment gateways to ensure all your transactions are 100% secure."
    },
    {
      q: "Can I cancel my booking?",
      a: "Yes, you can cancel your booking up to 24 hours before the scheduled time for a full refund. Visit your Bookings page for more details."
    },
    {
      q: "What if my guide doesn't show up?",
      a: "In the rare event of a no-show, please contact our emergency support immediately via the app, and we will arrange an alternative or issue a full refund."
    }
  ];

  return (
    <div className="bg-surface-50 min-h-screen pb-24 pt-6">
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-soft ring-1 ring-slate-100">
              <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
           </button>
           <h1 className="text-2xl font-bold text-slate-900">Support</h1>
        </div>
      </div>

      <div className="px-6 mb-10">
         <div className="bg-slate-900 rounded-[3rem] p-8 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-3xl rounded-full"></div>
            <div className="relative z-10">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-primary-400 mx-auto mb-6">
                  <Sparkles className="w-8 h-8" />
               </div>
               <h2 className="text-xl font-bold text-white mb-2">How can we help you?</h2>
               <p className="text-sm text-slate-400">Our team is available 24/7 to assist you.</p>
            </div>
         </div>
      </div>

      <div className="px-6 mb-10 grid grid-cols-2 gap-4">
         <motion.button 
           whileTap={{ scale: 0.95 }}
           onClick={() => navigate('/ai-chat')}
           className="bg-white p-6 rounded-[2.5rem] shadow-soft ring-1 ring-slate-100 flex flex-col items-center space-y-3"
         >
            <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center">
               <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Chat Support</span>
         </motion.button>
         <motion.button 
           whileTap={{ scale: 0.95 }}
           className="bg-white p-6 rounded-[2.5rem] shadow-soft ring-1 ring-slate-100 flex flex-col items-center space-y-3"
         >
            <div className="w-12 h-12 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center">
               <Phone className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Call Center</span>
         </motion.button>
      </div>

      <div className="px-6 space-y-4">
         <div className="flex items-center space-x-3 mb-6">
            <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest italic font-serif">Frequently Asked Questions</h2>
         </div>
         
         <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] overflow-hidden shadow-soft ring-1 ring-slate-100">
                 <button 
                   onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                   className="w-full p-5 flex items-center justify-between text-left"
                 >
                    <span className="text-sm font-bold text-slate-900 pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                 </button>
                 <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5"
                      >
                         <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                            {faq.a}
                         </p>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Support;
