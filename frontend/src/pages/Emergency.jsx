import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, HeartPulse, Pill, Siren, 
  ChevronRight, PhoneCall, ShieldAlert, 
  ShieldCheck, Info, AlertTriangle, LifeBuoy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Emergency = () => {
  const navigate = useNavigate();
  const [sosActive, setSosActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSosToggle = () => {
    if (sosActive) {
      setSosActive(false);
      return;
    }

    if (!navigator.geolocation) {
       toast.error('Geolocation is not supported by your browser');
       return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
       const { latitude, longitude } = position.coords;
       try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          await axios.post('/api/sos/alert', {
             latitude,
             longitude,
             userId: userInfo?._id
          });
          setSosActive(true);
          toast.success('SOS Alert Dispatched with your Location!', {
             icon: '🚨',
             style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' }
          });
       } catch (error) {
          toast.error('Failed to send SOS signal. Please call 100 directly.');
          console.error('SOS Error:', error);
       } finally {
          setLoading(false);
       }
    }, (error) => {
       setLoading(false);
       toast.error('Permission Denied. Please enable location to use SOS.');
    });
  };
  
  const services = [
    {
      title: "Local Authorities",
      icon: Siren,
      color: "bg-slate-900 dark:bg-primary-600",
      items: [
        { name: "Local Police (PCR)", phone: "100", distance: "Immediate Response" },
        { name: "Traffic Helpline", phone: "103", distance: "Road Assistance" },
        { name: "Women's Helpline", phone: "1091", distance: "Dedicated Support" }
      ]
    },
    {
      title: "Medical & Rescue",
      icon: HeartPulse,
      color: "bg-red-500",
      items: [
        { name: "Ambulance Services", phone: "108", distance: "Emergency Only" },
        { name: "Fire Department", phone: "101", distance: "Safety Teams" },
        { name: "Apollo Hospital", phone: "0674-6661016", distance: "2.4 km" }
      ]
    }
  ];

  const safetyTips = [
    { title: "Verified Links", desc: "Always communicate through the GuideGo encrypted chat.", icon: ShieldCheck },
    { title: "Keep it Public", desc: "Meet in public spaces and follow planned itineraries.", icon: Info },
    { title: "Share Status", desc: "Use the 'Go Live' feature to share your real-time position.", icon: ShieldAlert }
  ];

  return (
    <div className="bg-surface-50 dark:bg-slate-950 min-h-screen pb-32 pt-24 transition-colors duration-300">
      <Toaster position="top-center" />
      {/* Premium Header */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-slate-900 rounded-b-[4rem] overflow-hidden -z-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
      </div>

      <div className="px-8 mb-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
         <div className="space-y-4">
            <button 
              onClick={() => navigate(-1)} 
              className="w-12 h-12 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[1.3rem] flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95"
            >
               <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <div>
               <h1 className="text-5xl font-black text-white tracking-tighter italic font-serif leading-none mb-3 uppercase">Help & Safety</h1>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] flex items-center">
                  <LifeBuoy className="w-4 h-4 mr-2 text-primary-500" /> 24/7 Shield Protocol Active
               </p>
            </div>
         </div>
      </div>

      <div className="px-8 space-y-12 relative z-10">
         {/* SOS SECTION */}
         <section className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-premium text-center space-y-6">
            <div className="relative inline-block">
               <motion.div 
                 animate={{ scale: [1, 1.1, 1] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl"
               />
               <button 
                 onClick={handleSosToggle}
                 disabled={loading}
                 className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white font-black shadow-2xl transition-all active:scale-90 relative z-10 ${
                   sosActive ? 'bg-slate-900 border-4 border-red-500 animate-pulse' : 'bg-red-500 hover:bg-red-600'
                 } ${loading ? 'opacity-50 cursor-wait' : ''}`}
               >
                  {loading ? (
                     <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                     <><AlertTriangle className="w-8 h-8 mb-1" /><span className="text-lg tracking-tighter italic">SOS</span></>
                  )}
               </button>
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none mb-2">
                  {sosActive ? "Transmitting GPS Signal..." : "Panic Signal"}
               </h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
                  {sosActive ? "Local authorities and nearby guides have been alerted." : "Tap and hold for 3 seconds to alert local authorities and nearby guides."}
               </p>
            </div>
         </section>

         {/* SERVICE GROUPS */}
         {services.map((section, idx) => (
           <div key={idx} className="space-y-6">
              <div className="flex items-center space-x-4 pl-4">
                 <div className={`w-8 h-8 ${section.color} rounded-xl flex items-center justify-center text-white shadow-soft`}>
                    <section.icon className="w-4 h-4" />
                 </div>
                 <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest italic">{section.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {section.items.map((item, i) => (
                   <motion.div 
                     key={i}
                     whileTap={{ scale: 0.98 }}
                     className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group shadow-soft hover:shadow-premium transition-all"
                   >
                     <div className="flex-grow">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none mb-2">{item.name}</h3>
                        <div className="flex items-center space-x-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                           <span className="text-primary-500">{item.distance}</span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full" />
                           <span>{item.phone}</span>
                        </div>
                     </div>
                     <a 
                       href={`tel:${item.phone}`}
                       className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-inner active:scale-90"
                     >
                        <PhoneCall className="w-6 h-6" />
                     </a>
                   </motion.div>
                 ))}
              </div>
           </div>
         ))}

         {/* SAFETY PROTOCOLS */}
         <section className="space-y-6 pt-6">
            <div className="flex items-center space-x-4 pl-4">
               <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4" />
               </div>
               <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest italic tracking-wider">Safety Protocols</h2>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[3.5rem] p-4 border border-slate-100 dark:border-slate-800">
               {safetyTips.map((tip, i) => (
                  <div key={i} className={`flex items-start space-x-6 p-6 ${i !== safetyTips.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                     <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 shadow-soft">
                        <tip.icon className="w-5 h-5 text-primary-500" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">{tip.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{tip.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* FOOTER ACTION */}
         <div className="text-center pt-8">
            <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em] mb-4">GuideGo Global Shield v2.1</p>
         </div>
      </div>
    </div>
  );
};

export default Emergency;
