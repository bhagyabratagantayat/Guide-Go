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
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 md:space-y-12 bg-[#f7f7f7] min-h-screen md:rounded-[2rem] border border-[#ebebeb] relative overflow-hidden">
      <Helmet><title>AI Trip Architect | GuideGo</title></Helmet>

      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff385c]/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] -z-10" />

      {/* HEADER SECTION */}
      <div className="text-center space-y-4 relative z-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-[#ff385c] rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-[#ff385c]/20 mb-6">
           <Wand2 size={32} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#222222] tracking-tight">AI Trip Architect</h1>
        <p className="text-[#717171] font-semibold max-w-lg mx-auto text-sm leading-relaxed">
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
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-[#ebebeb] rounded-[2.5rem] p-8 md:p-12 shadow-sm"
            >
              <div className="flex justify-center gap-4 mb-12">
                {[1, 2].map(s => (
                  <div key={s} className={`w-20 h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#ff385c]' : 'bg-[#ebebeb]'}`} />
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff385c] ml-4">Where are you going?</label>
                      <div className="relative group">
                         <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-[#717171]" size={20} />
                         <input 
                            type="text" 
                            placeholder="e.g. Puri, Odisha"
                            className="w-full bg-white border border-[#dddddd] rounded-full pl-16 pr-8 py-6 text-xl font-bold text-[#222222] placeholder:text-[#b0b0b0] outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c] transition-all"
                            value={prefs.dest}
                            onChange={(e) => setPrefs({...prefs, dest: e.target.value})}
                         />
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#717171] ml-4">How many days?</label>
                         <div className="relative">
                            <Calendar className="absolute left-8 top-1/2 -translate-y-1/2 text-[#717171]" size={18} />
                            <select 
                              className="w-full bg-white border border-[#dddddd] rounded-full pl-16 pr-10 py-5 appearance-none text-[#222222] font-bold outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c] text-sm"
                              value={prefs.days}
                              onChange={(e) => setPrefs({...prefs, days: parseInt(e.target.value)})}
                            >
                               {[1,2,3,4,5,6,7].map(d => <option key={d} value={d}>{d} Days Journey</option>)}
                            </select>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#717171] ml-4">How many travelers?</label>
                         <div className="relative">
                            <Users className="absolute left-8 top-1/2 -translate-y-1/2 text-[#717171]" size={18} />
                            <select 
                              className="w-full bg-white border border-[#dddddd] rounded-full pl-16 pr-10 py-5 appearance-none text-[#222222] font-bold outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c] text-sm"
                              value={prefs.people}
                              onChange={(e) => setPrefs({...prefs, people: parseInt(e.target.value)})}
                            >
                               {[1,2,3,4,5,6].map(p => <option key={p} value={p}>{p} People Traveling</option>)}
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
                        className={`p-8 rounded-[2rem] border transition-all text-left flex items-center gap-6 relative group ${
                          prefs.style === s.name ? 'bg-white border-[#ff385c] shadow-lg ring-1 ring-[#ff385c]' : 'bg-white border-[#dddddd] hover:border-[#ff385c]/40'
                        }`}
                     >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                           prefs.style === s.name ? 'bg-[#ff385c] text-white' : 'bg-[#f7f7f7] text-[#717171]'
                        }`}>
                           <s.icon size={28} />
                        </div>
                        <div>
                           <h4 className={`font-bold text-xl tracking-tight ${prefs.style === s.name ? 'text-[#ff385c]' : 'text-[#222222]'}`}>{s.name}</h4>
                           <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-[#717171]">{s.desc}</p>
                        </div>
                        {prefs.style === s.name && <CheckCircle2 className="absolute top-4 right-4 text-[#ff385c]" size={20} />}
                     </button>
                   ))}
                </div>
              )}

              <div className="mt-12 flex justify-between gap-6">
                 {step === 2 && (
                    <button onClick={() => setStep(1)} className="px-8 py-5 rounded-full bg-[#f7f7f7] text-[#717171] font-bold text-[12px] uppercase tracking-widest hover:bg-[#ebebeb] transition-all border border-[#dddddd]">Back</button>
                 )}
                 <button 
                    onClick={() => step === 1 ? setStep(2) : generateItinerary()} 
                    disabled={!prefs.dest}
                    className="flex-grow bg-[#ff385c] hover:bg-[#e31c5f] text-white py-5 rounded-full font-bold text-[13px] uppercase tracking-widest transition-all shadow-lg shadow-[#ff385c]/20 flex items-center justify-center gap-4 disabled:opacity-30"
                  >
                    {step === 1 ? 'Next Step' : 'Build Itinerary'} <ArrowRight size={18} />
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
              className="text-center py-24 bg-white border border-[#dddddd] rounded-[2.5rem] shadow-sm flex flex-col items-center gap-8"
            >
               <div className="relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="w-24 h-24 border-4 border-[#ff385c] border-t-transparent rounded-full" />
                  <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ff385c] animate-pulse" size={32} />
               </div>
               <div className="space-y-3">
                  <h3 className="text-2xl font-extrabold text-[#222222]">Constructing Your Journey</h3>
                  <p className="text-[#717171] font-bold text-[10px] uppercase tracking-widest">Analyzing {prefs.dest} • Style: {prefs.style}</p>
               </div>
            </motion.div>
          )}

          {step === 4 && itinerary && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 pb-20"
            >
               {/* Result Header */}
               <div className="bg-[#222222] p-10 md:p-14 rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10 text-white">
                  <div className="space-y-5 relative z-10 text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-2 text-white/60">
                        <MapPin size={14} className="text-[#ff385c]"/>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{itinerary.city}</span>
                     </div>
                     <h2 className="text-5xl font-extrabold tracking-tight">Your Masterpiece</h2>
                     <div className="flex justify-center md:justify-start gap-4">
                        <span className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">{prefs.days} Days</span>
                        <span className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">{prefs.style} Style</span>
                     </div>
                  </div>
                  <button onClick={() => setStep(1)} className="p-6 bg-white rounded-3xl text-[#ff385c] shadow-xl hover:scale-105 transition-all z-10"><RefreshCcw size={28}/></button>
                  <Sparkles className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
               </div>

               {/* Timeline View */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Left Column - Days Toggle */}
                  <div className="lg:col-span-4 space-y-3">
                     {itinerary.days.map((d, i) => (
                        <div key={i} className="w-full p-6 bg-white border border-[#ebebeb] rounded-2xl text-left flex justify-between items-center shadow-sm">
                           <div>
                              <p className="text-[10px] font-bold text-[#ff385c] uppercase tracking-widest">Day {d.day}</p>
                              <h5 className="text-[#222222] font-extrabold mt-1">Daily Highlights</h5>
                           </div>
                           <CheckCircle2 className="text-[#ff385c]" size={16}/>
                        </div>
                     ))}
                  </div>

                  {/* Right Column - Detailed Timeline */}
                  <div className="lg:col-span-8 space-y-10">
                     {itinerary.days.map((day, di) => (
                        <div key={di} className="space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#ebebeb] shadow-sm">
                           <div className="flex items-center gap-4">
                              <div className="h-[1px] bg-[#ebebeb] flex-grow" />
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#b0b0b0] whitespace-nowrap">{day.title}</h4>
                              <div className="h-[1px] bg-[#ebebeb] flex-grow" />
                           </div>

                           <div className="space-y-8">
                              {day.activities.map((act, ai) => (
                                 <motion.div 
                                    key={ai}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: ai * 0.1 }}
                                    className="flex gap-6 group"
                                 >
                                    <div className="flex flex-col items-center">
                                       <div className="w-12 h-12 bg-[#f7f7f7] border border-[#dddddd] rounded-2xl flex items-center justify-center text-[#ff385c] group-hover:border-[#ff385c] transition-all">
                                          <act.icon size={20} />
                                       </div>
                                       {ai !== day.activities.length - 1 && <div className="w-[1px] flex-grow bg-[#ebebeb] my-3" />}
                                    </div>
                                    <div className="pb-8 pt-1">
                                       <p className="text-[10px] font-bold text-[#717171] uppercase tracking-widest mb-1">{act.time}</p>
                                       <h5 className="text-lg font-extrabold text-[#222222] mb-2">{act.title}</h5>
                                       {act.desc && <p className="text-xs text-[#717171] leading-relaxed max-w-lg font-medium">{act.desc}</p>}
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
