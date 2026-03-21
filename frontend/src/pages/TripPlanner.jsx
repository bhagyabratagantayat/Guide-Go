import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Map, Calendar, DollarSign, Sparkles, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockItinerary = [
  {
    day: 1,
    title: 'Arrival & Ancient Temples',
    activities: [
      { time: '10:00 AM', name: 'Check-in at luxury stay', duration: '1h', location: 'Hotel Sector' },
      { time: '12:00 PM', name: 'Visit Lingaraj Temple', duration: '2h', location: 'Old Town' },
      { time: '04:00 PM', name: 'Sunset at Udayagiri Caves', duration: '2.5h', location: 'Khandagiri' },
    ]
  },
  {
    day: 2,
    title: 'Nature & Wildlife Exploration',
    activities: [
      { time: '08:30 AM', name: 'Nandankanan Zoological Park', duration: '4h', location: 'Barang' },
      { time: '02:00 PM', name: 'Lunch at traditional Odia cuisine', duration: '1h', location: 'City Center' },
      { time: '04:30 PM', name: 'Boating at Kanjia Lake', duration: '1.5h', location: 'Nandankanan' },
    ]
  }
];

const TripPlanner = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState('moderate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if(!destination) return;
    
    setIsGenerating(true);
    setPlan(null);

    // Mock API Delay
    setTimeout(() => {
      setIsGenerating(false);
      setPlan(mockItinerary);
    }, 2500);
  };

  return (
    <div className="bg-slate-950 min-h-screen pb-32 pt-24 text-white font-sans overflow-x-hidden">
      
      {/* Header */}
      <div className="px-6 mb-10 max-w-7xl mx-auto flex items-center space-x-4">
         <button 
           onClick={() => navigate(-1)} 
           className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
         >
            <ChevronLeft className="w-6 h-6" />
         </button>
         <div>
           <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic font-serif uppercase leading-none">AI Trip Planner</h1>
           <p className="text-slate-400 font-medium mt-2 flex items-center"><Sparkles className="w-4 h-4 mr-1 text-primary-500" /> Powered by Gemini</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form Column */}
        <div className="lg:col-span-4 h-max sticky top-24">
          <form onSubmit={handleGenerate} className="bg-slate-900/50 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-6">
             
             <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Destination</label>
                <div className="relative">
                   <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                   <input 
                     type="text" required
                     placeholder="E.g., Bhubaneswar"
                     value={destination} onChange={(e) => setDestination(e.target.value)}
                     className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-primary-500/50 transition-all"
                   />
                </div>
             </div>

             <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block flex justify-between">
                   <span>Number of Days</span>
                   <span className="text-primary-400">{days} Days</span>
                </label>
                <input 
                   type="range" min="1" max="14" 
                   value={days} onChange={(e) => setDays(Number(e.target.value))}
                   className="w-full accent-primary-500"
                />
             </div>

             <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Budget Tier</label>
                <div className="grid grid-cols-3 gap-2">
                   {['budget', 'moderate', 'luxury'].map((tier) => (
                      <button 
                         key={tier} type="button"
                         onClick={() => setBudget(tier)}
                         className={`py-3 rounded-xl font-black uppercase text-xs tracking-wider transition-all border ${
                            budget === tier 
                            ? 'bg-primary-500 text-slate-950 border-primary-500 shadow-lg shadow-primary-500/20' 
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                         }`}
                      >
                         {tier}
                      </button>
                   ))}
                </div>
             </div>

             <button 
                type="submit" disabled={isGenerating || !destination}
                className="w-full mt-4 bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest flex justify-center items-center hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {isGenerating ? (
                   <span className="flex items-center"><Sparkles className="w-5 h-5 mr-2 animate-spin" /> Generating...</span>
                ) : (
                   <span className="flex items-center"><Sparkles className="w-5 h-5 mr-2" /> Build My Trip</span>
                )}
             </button>
          </form>
        </div>

        {/* Results / Empty State Column */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
             {!isGenerating && !plan && (
                <motion.div 
                   key="empty"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-[2.5rem]"
                >
                   <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                      <Map className="w-10 h-10 text-slate-500" />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-widest text-slate-300">No Itinerary Yet</h3>
                   <p className="text-slate-500 font-medium max-w-sm mt-3">Enter your details and let our AI craft the perfect sequence of experiences for your upcoming journey.</p>
                </motion.div>
             )}

             {isGenerating && (
                <motion.div 
                   key="loading"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="h-full flex flex-col items-center justify-center space-y-6"
                >
                   <div className="relative w-24 h-24">
                      <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary-500 animate-pulse" />
                   </div>
                   <p className="text-xl font-black text-slate-400 tracking-widest uppercase animate-pulse">Analyzing Top Attractions...</p>
                </motion.div>
             )}

             {plan && (
                <motion.div 
                   key="results"
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                   className="space-y-8"
                >
                   {/* Interactive Map Mock */}
                   <div className="w-full h-64 bg-slate-800 rounded-[2.5rem] border border-slate-700 overflow-hidden relative group">
                      <img src="https://static.mapzen.com/images/peel-and-stick/peel-and-stick-2x.png" className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-700" alt="Map route" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-700 flex items-center shadow-2xl">
                            <MapPin className="w-5 h-5 text-primary-500 mr-2" />
                            <span className="font-black tracking-widest uppercase text-sm">{destination} Itinerary Map</span>
                         </div>
                      </div>
                   </div>

                   {/* Timeline */}
                   <div className="space-y-6">
                      {plan.map((dayData, i) => (
                         <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 md:p-8 rounded-[2rem]">
                            <div className="flex items-center space-x-3 mb-6">
                               <div className="bg-primary-500 text-slate-950 font-black w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-primary-500/20">
                                  {dayData.day}
                               </div>
                               <h3 className="text-2xl font-black uppercase text-white tracking-widest">{dayData.title}</h3>
                            </div>
                            
                            <div className="space-y-4 pl-4 md:pl-12 border-l-2 border-slate-800 relative">
                               {dayData.activities.map((act, j) => (
                                  <div key={j} className="relative bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors group">
                                     <div className="absolute w-4 h-4 rounded-full bg-slate-600 group-hover:bg-primary-500 left-[-25px] top-6 transition-colors border-4 border-slate-950"></div>
                                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                           <div className="flex items-center space-x-2 text-primary-400 text-sm font-bold mb-1">
                                              <Clock className="w-4 h-4" />
                                              <span>{act.time}</span>
                                           </div>
                                           <p className="text-lg font-black text-white">{act.name}</p>
                                        </div>
                                        <div className="text-left md:text-right">
                                           <p className="text-sm font-bold text-slate-400 mb-1 flex items-center md:justify-end">
                                              <MapPin className="w-3 h-3 justify-center mr-1" /> {act.location}
                                           </p>
                                           <p className="text-xs font-black uppercase tracking-widest text-slate-500">{act.duration}</p>
                                        </div>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      ))}
                   </div>
                </motion.div>
             )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default TripPlanner;
