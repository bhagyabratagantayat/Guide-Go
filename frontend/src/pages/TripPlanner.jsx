import React, { useState, useEffect } from 'react';
import { 
  Plane, MapPin, Calendar, Users, Wand2, ArrowRight, 
  Compass, Landmark, Music, CheckCircle2, Clock, 
  Coffee, Utensils, Camera, Moon, Info, Sparkles, Map as MapIcon,
  ChevronRight, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { INDIA_TOURISM_DATA } from '../data/indiaKnowledge';

const TripPlannerPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState({
    dest: '',
    days: 3,
    people: 2,
    style: 'Heritage'
  });
  const [itinerary, setItinerary] = useState(null);

  const styles = [
    { name: 'Heritage', icon: Landmark, desc: 'Temples & History' },
    { name: 'Nature', icon: Compass, desc: 'Lakes & Wildlife' },
    { name: 'Nightlife', icon: Music, desc: 'Pubs & Markets' },
    { name: 'Adventure', icon: Plane, desc: 'Trekking & Water Sports' }
  ];

  const generateItinerary = () => {
    setLoading(true);
    setStep(3);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const cityData = findCityData(prefs.dest);
      const generated = {
        city: cityData ? cityData.name : prefs.dest,
        days: Array.from({ length: prefs.days }, (_, i) => ({
          day: i + 1,
          title: `Day ${i + 1}: Exploring ${prefs.style} Gems`,
          activities: [
            { time: '08:00 AM', title: 'Breakfast at Local Heritage Café', icon: Coffee },
            { time: '10:00 AM', title: `Major ${prefs.style} Visit`, icon: Landmark, desc: cityData?.desc || 'Historical sightseeing.' },
            { time: '01:00 PM', title: 'Authentic Local Lunch', icon: Utensils },
            { time: '03:00 PM', title: 'Guided Cultural Walk', icon: Camera },
            { time: '07:00 PM', title: 'Evening Light Show / Local Market', icon: Moon }
          ]
        }))
      };
      setItinerary(generated);
      setLoading(false);
      setStep(4);
    }, 3000);
  };

  const findCityData = (query) => {
    const q = query.toLowerCase();
    for (const key in INDIA_TOURISM_DATA) {
      if (INDIA_TOURISM_DATA[key].keywords.some(k => q.includes(k))) {
        return { name: key.charAt(0).toUpperCase() + key.slice(1), desc: INDIA_TOURISM_DATA[key].response };
      }
    }
    return null;
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 bg-slate-950 min-h-screen rounded-[3rem] border border-white/5 relative overflow-hidden shadow-2xl">
      <Helmet><title>AI Trip Architect | GuideGo</title></Helmet>

      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-600/5 blur-[120px] -z-10" />

      {/* HEADER SECTION */}
      <div className="text-center space-y-4 relative z-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-500/20 mb-6">
           <Wand2 size={40} />
        </motion.div>
        <h1 className="text-5xl font-black italic font-serif text-white tracking-tighter">AI Trip Architect</h1>
        <p className="text-slate-400 font-medium max-w-lg mx-auto text-sm leading-relaxed">
          Our intelligence engine will build a minute-by-minute itinerary tailored to your soul.
        </p>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {step <= 2 && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-12 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex justify-center gap-4 mb-12">
                {[1, 2].map(s => (
                  <div key={s} className={`w-20 h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-600' : 'bg-white/10'}`} />
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 ml-4">Destination</label>
                      <div className="relative group">
                         <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={24} />
                         <input 
                            type="text" 
                            placeholder="e.g. Puri, Odisha"
                            className="w-full bg-slate-950 border border-white/5 rounded-[2rem] pl-20 pr-8 py-8 text-2xl font-bold text-white placeholder:text-slate-700 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                            value={prefs.dest}
                            onChange={(e) => setPrefs({...prefs, dest: e.target.value})}
                         />
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-4">Duration</label>
                         <div className="relative">
                            <Calendar className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <select 
                              className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-20 pr-8 py-6 appearance-none text-white font-bold outline-none focus:border-blue-500/50"
                              value={prefs.days}
                              onChange={(e) => setPrefs({...prefs, days: parseInt(e.target.value)})}
                            >
                               {[1,2,3,4,5,6,7].map(d => <option key={d} value={d} className="bg-slate-900">{d} Days Journey</option>)}
                            </select>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-4">Travelers</label>
                         <div className="relative">
                            <Users className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <select 
                              className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-20 pr-8 py-6 appearance-none text-white font-bold outline-none focus:border-blue-500/50"
                              value={prefs.people}
                              onChange={(e) => setPrefs({...prefs, people: parseInt(e.target.value)})}
                            >
                               {[1,2,3,4,5,6].map(p => <option key={p} value={p} className="bg-slate-900">{p} People Traveling</option>)}
                            </select>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {styles.map((s, i) => (
                     <button 
                        key={i}
                        onClick={() => setPrefs({...prefs, style: s.name})}
                        className={`p-10 rounded-[2.5rem] border transition-all text-left flex flex-col gap-6 relative overflow-hidden group ${
                          prefs.style === s.name ? 'bg-blue-600 border-blue-600 shadow-2xl shadow-blue-600/20' : 'bg-slate-950 border-white/5 hover:border-white/10'
                        }`}
                     >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                           prefs.style === s.name ? 'bg-white text-blue-600' : 'bg-white/5 text-slate-500 group-hover:text-white'
                        }`}>
                           <s.icon size={28} />
                        </div>
                        <div>
                           <h4 className={`font-black italic font-serif text-2xl tracking-tight ${prefs.style === s.name ? 'text-white' : 'text-slate-300'}`}>{s.name}</h4>
                           <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-2 ${prefs.style === s.name ? 'text-blue-100' : 'text-slate-500'}`}>{s.desc}</p>
                        </div>
                        {prefs.style === s.name && <CheckCircle2 className="absolute top-8 right-8 text-white/50" size={24} />}
                     </button>
                   ))}
                </div>
              )}

              <div className="mt-12 flex justify-between gap-6">
                 {step === 2 && (
                    <button onClick={() => setStep(1)} className="px-10 py-6 rounded-2xl bg-white/5 text-slate-400 font-black text-[12px] uppercase tracking-widest hover:bg-white/10 transition-all">Back</button>
                 )}
                 <button 
                    onClick={() => step === 1 ? setStep(2) : generateItinerary()} 
                    disabled={!prefs.dest}
                    className="flex-grow bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-4 disabled:opacity-30"
                 >
                    {step === 1 ? 'Next: Vibe Check' : 'Consult the Architect'} <ArrowRight size={20} />
                 </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-slate-900/40 border border-white/5 rounded-[3rem] shadow-2xl backdrop-blur-xl flex flex-col items-center gap-10"
            >
               <div className="relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="w-32 h-32 border-4 border-blue-600 border-t-transparent rounded-full shadow-2xl shadow-blue-600/20" />
                  <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={40} />
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl font-black italic font-serif text-white uppercase tracking-tight">Constructing Your Journey</h3>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Analyzing {prefs.dest} • Style: {prefs.style}</p>
               </div>
            </motion.div>
          )}

          {step === 4 && itinerary && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 pb-20"
            >
               {/* Result Header */}
               <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="space-y-4 relative z-10">
                     <div className="flex items-center gap-2 text-white/60">
                        <MapPin size={16}/>
                        <span className="text-[10px] font-black uppercase tracking-widest">{itinerary.city}</span>
                     </div>
                     <h2 className="text-6xl font-black text-white italic font-serif tracking-tighter">Your Masterpiece</h2>
                     <div className="flex gap-4">
                        <span className="px-4 py-2 bg-white/10 rounded-full text-[9px] font-black uppercase text-white tracking-widest">{prefs.days} Days</span>
                        <span className="px-4 py-2 bg-white/10 rounded-full text-[9px] font-black uppercase text-white tracking-widest">{prefs.style} Style</span>
                     </div>
                  </div>
                  <button onClick={() => setStep(1)} className="p-6 bg-white rounded-3xl text-blue-600 shadow-2xl hover:scale-105 transition-all"><RefreshCcw size={32}/></button>
                  <MapIcon className="absolute -right-20 -bottom-20 w-80 h-80 text-white/5 -rotate-12" />
               </div>

               {/* Timeline View */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Left Column - Days Toggle */}
                  <div className="lg:col-span-3 space-y-4">
                     {itinerary.days.map((d, i) => (
                        <button key={i} className="w-full p-6 bg-slate-900/40 border border-white/5 rounded-2xl text-left hover:border-blue-500/50 transition-all group flex justify-between items-center">
                           <div>
                              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Day {d.day}</p>
                              <h5 className="text-white font-bold mt-1">Highlights</h5>
                           </div>
                           <ChevronRight className="text-slate-700 group-hover:text-blue-500" size={16}/>
                        </button>
                     ))}
                  </div>

                  {/* Right Column - Detailed Timeline */}
                  <div className="lg:col-span-9 space-y-10">
                     {itinerary.days.map((day, di) => (
                        <div key={di} className="space-y-8">
                           <div className="flex items-center gap-4">
                              <div className="h-px bg-white/5 flex-grow" />
                              <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 whitespace-nowrap">{day.title}</h4>
                              <div className="h-px bg-white/5 flex-grow" />
                           </div>

                           <div className="space-y-6">
                              {day.activities.map((act, ai) => (
                                 <motion.div 
                                    key={ai}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: ai * 0.1 }}
                                    className="flex gap-8 group"
                                 >
                                    <div className="flex flex-col items-center">
                                       <div className="w-14 h-14 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:border-blue-500/50 transition-all">
                                          <act.icon size={24} />
                                       </div>
                                       {ai !== day.activities.length - 1 && <div className="w-0.5 flex-grow bg-white/5 my-2" />}
                                    </div>
                                    <div className="pb-10 pt-2">
                                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{act.time}</p>
                                       <h5 className="text-xl font-bold text-white mb-2">{act.title}</h5>
                                       {act.desc && <p className="text-sm text-slate-400 leading-relaxed max-w-xl">{act.desc}</p>}
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TripPlannerPage;
