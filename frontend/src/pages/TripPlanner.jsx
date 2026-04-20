import React, { useState } from 'react';
import { Plane, MapPin, Calendar, Users, Wand2, ArrowRight, Compass, Landmark, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TripPlannerPage = () => {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState({
    dest: '',
    days: 3,
    people: 2,
    style: 'Heritage'
  });

  const styles = [
    { name: 'Heritage', icon: Landmark, desc: 'Temples & History' },
    { name: 'Nature', icon: Compass, desc: 'Lakes & Wildlife' },
    { name: 'Nightlife', icon: Music, desc: 'Pubs & Markets' },
    { name: 'Adventure', icon: Plane, desc: 'Trekking & Water Sports' }
  ];

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-500/20 mb-6">
           <Wand2 size={40} />
        </div>
        <h1 className="text-5xl font-black italic font-serif text-white tracking-tighter">AI Trip Architect</h1>
        <p className="text-[var(--text-secondary)] font-medium max-w-lg mx-auto">Tell us your vibes, and our AI will build a minute-by-minute itinerary tailored to your soul.</p>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-12 relative overflow-hidden group hover:border-[var(--border-hover)] transition-all">
        <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-12 -translate-y-12">
           <Plane size={240} className="text-[var(--accent)]" />
        </div>

        <div className="relative z-10 space-y-12">
           {/* Step Indicator */}
           <div className="flex justify-center gap-4">
              {[1, 2, 3].map(s => (
                <div key={s} className={`w-12 h-1.5 rounded-full transition-all ${step >= s ? 'bg-[var(--accent)]' : 'bg-white/10'}`} />
              ))}
           </div>

           <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] ml-2">Where to?</label>
                      <div className="relative group">
                         <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                         <input 
                            type="text" 
                            placeholder="e.g. Puri, Odisha"
                            className="input-field pl-16 py-6 text-xl"
                            value={prefs.dest}
                            onChange={(e) => setPrefs({...prefs, dest: e.target.value})}
                         />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">Duration (Days)</label>
                         <div className="relative">
                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                            <select 
                              className="input-field pl-16 py-6 appearance-none bg-[var(--bg-input)]"
                              value={prefs.days}
                              onChange={(e) => setPrefs({...prefs, days: e.target.value})}
                            >
                               {[1,2,3,4,5,6,7].map(d => <option key={d} value={d} className="bg-[var(--bg-card)]">{d} Days</option>)}
                            </select>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">Travelers</label>
                         <div className="relative">
                            <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                            <select 
                              className="input-field pl-16 py-6 appearance-none bg-[var(--bg-input)]"
                              value={prefs.people}
                              onChange={(e) => setPrefs({...prefs, people: e.target.value})}
                            >
                               {[1,2,3,4,5,6].map(p => <option key={p} value={p} className="bg-[var(--bg-card)]">{p} People</option>)}
                            </select>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                   key="step2"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="grid grid-cols-2 gap-6"
                >
                   {styles.map((s, i) => (
                     <button 
                        key={i}
                        onClick={() => setPrefs({...prefs, style: s.name})}
                        className={`p-8 rounded-[var(--radius-lg)] border-2 transition-all text-left flex flex-col gap-4 group ${
                          prefs.style === s.name ? 'border-[var(--accent)] bg-[var(--accent-bg)]' : 'border-[var(--border-color)] hover:border-white/20'
                        }`}
                     >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                           prefs.style === s.name ? 'bg-[var(--accent)] text-white' : 'bg-white/5 text-[var(--text-muted)] group-hover:text-white'
                        }`}>
                           <s.icon size={24} />
                        </div>
                        <div>
                           <h4 className="font-black italic font-serif text-xl text-[var(--text-primary)]">{s.name}</h4>
                           <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">{s.desc}</p>
                        </div>
                     </button>
                   ))}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                >
                   <div className="w-24 h-24 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-xl shadow-[var(--accent)]/10" />
                   <h3 className="text-2xl font-black italic font-serif text-[var(--text-primary)] uppercase tracking-tight">Consulting the Oracles...</h3>
                   <p className="text-[var(--text-muted)] font-medium max-w-sm mx-auto">We are analyzing weather data, guide availability, and cultural events for your {prefs.dest} trip.</p>
                </motion.div>
              )}
           </AnimatePresence>

           <div className="pt-6 flex justify-between gap-4">
              {step > 1 && step < 3 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="px-10 py-5 rounded-[var(--radius-md)] bg-white/5 text-[var(--text-primary)] font-black text-[12px] uppercase tracking-widest hover:bg-white/10"
                >
                  Back
                </button>
              )}
              {step < 3 && (
                <button 
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !prefs.dest}
                  className="btn-primary flex-grow py-5 flex items-center justify-center gap-3"
                >
                  {step === 2 ? 'GENERATE ITINERARY' : 'CONTINUE'} <ArrowRight size={18} />
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlannerPage;
