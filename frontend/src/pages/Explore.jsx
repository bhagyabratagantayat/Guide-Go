import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Volume2, Square, 
  ChevronRight, Play, Pause, Activity, 
  X, Headset, BookOpen, Clock, 
  Waves, ListMusic, Sparkles, Share2
} from 'lucide-react';
import useAudioGuide from '../hooks/useAudioGuide';

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const { isPlaying, speak, stop, pause, resume, currentText } = useAudioGuide();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const { data } = await axios.get('/api/places');
        setPlaces(data);
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const categories = ['All', ...new Set(places.map(p => p.category))];

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        place.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || place.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-surface-50 pb-40">
      {/* Immersive Header */}
      <div className="bg-slate-900 pt-32 pb-24 px-8 relative overflow-hidden">
         <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500 rounded-full blur-[150px] -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[150px] -ml-48 -mb-48" />
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col lg:flex-row lg:items-end justify-between gap-12"
            >
               <div className="space-y-6 max-w-3xl">
                  <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
                     <Headset className="w-4 h-4 text-primary-400" />
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Sacred Narratives Active</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic font-serif leading-none">
                     SACRED <span className="text-primary-500">VOICE</span>
                  </h1>
                  <p className="text-slate-400 font-bold text-lg leading-relaxed italic max-w-xl">
                     "The stones speak. The temples breathe." Immerse yourself in the eternal legends of Bharat through high-fidelity narration.
                  </p>
               </div>

               <div className="relative group w-full lg:w-[450px]">
                  <div className="absolute inset-x-0 -bottom-2 h-2 bg-primary-500/20 blur-xl group-focus-within:bg-primary-500/40 transition-all" />
                  <input
                     type="text"
                     placeholder="Search sacred sites..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-16 pr-8 py-6 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] focus:outline-none focus:border-primary-500/50 transition-all font-bold text-white placeholder:text-slate-600 text-lg shadow-2xl"
                  />
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 w-6 h-6 group-focus-within:text-primary-500 transition-colors" />
               </div>
            </motion.div>

            {/* Category Pills */}
            <div className="flex items-center space-x-4 mt-12 overflow-x-auto pb-4 no-scrollbar">
               {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                       activeCategory === cat 
                       ? 'bg-primary-500 text-slate-900 shadow-xl shadow-primary-500/20' 
                       : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-12 relative z-20">
         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {[1, 2, 3].map(i => (
                  <div key={i} className="h-[600px] bg-white rounded-[4rem] animate-pulse shadow-premium border border-slate-50"></div>
               ))}
            </div>
         ) : (
            <motion.div 
               layout
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
               <AnimatePresence mode="popLayout">
                  {filteredPlaces.map((place) => {
                     const isCurrentlyPlaying = isPlaying && currentText === place.audioGuideText;
                     
                     return (
                        <motion.div 
                           key={place._id} 
                           layout
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           whileHover={{ y: -12 }}
                           className="group bg-white rounded-[4rem] overflow-hidden border border-slate-100 shadow-premium transition-all duration-700 relative flex flex-col h-[600px]"
                        >
                           <div className="relative h-2/3 overflow-hidden cursor-pointer" onClick={() => setSelectedPlace(place)}>
                              <img
                                 src={place.image}
                                 alt={place.name}
                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                              
                              <div className="absolute top-10 left-10 flex items-center space-x-3">
                                 <div className="px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-2xl transition-all group-hover:bg-primary-500 group-hover:text-slate-900 group-hover:border-transparent">
                                    {place.category}
                                 </div>
                              </div>
                              
                              <div className="absolute bottom-10 left-10 right-10">
                                 <h3 className="text-4xl font-black text-white tracking-tighter italic font-serif leading-none uppercase drop-shadow-2xl">
                                    {place.name}
                                 </h3>
                                 <div className="flex items-center mt-4 space-x-4 text-white/60 text-[10px] font-black uppercase tracking-widest">
                                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-primary-500" /> Odisha</span>
                                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> 12 Min Listen</span>
                                 </div>
                              </div>
                           </div>

                           <div className="p-10 flex flex-col justify-between flex-grow">
                              <p className="text-slate-500 font-bold leading-relaxed line-clamp-2 text-sm italic italic tracking-tight">
                                 "{place.description}"
                              </p>
                              
                              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                 <button 
                                    onClick={() => setSelectedPlace(place)}
                                    className="flex items-center text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] italic hover:text-primary-600 transition-colors group/btn"
                                 >
                                    EXPLORE HUB 
                                    <ChevronRight className="w-4 h-4 ml-1.5 transform group-hover/btn:translate-x-1.5 transition-transform" />
                                 </button>

                                 {place.audioGuideText && (
                                    <button 
                                       onClick={() => isCurrentlyPlaying ? stop() : speak(place.audioGuideText)}
                                       className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center transition-all duration-500 active:scale-90 shadow-2xl relative ${
                                          isCurrentlyPlaying 
                                          ? 'bg-red-500 text-white shadow-red-500/20' 
                                          : 'bg-slate-900 text-white hover:bg-primary-500 hover:text-slate-900 shadow-slate-900/10'
                                       }`}
                                    >
                                       {isCurrentlyPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                                       {isCurrentlyPlaying && (
                                          <div className="absolute -inset-1 rounded-[1.75rem] border-2 border-red-500 animate-ping opacity-30" />
                                       )}
                                    </button>
                                 )}
                              </div>
                           </div>
                           
                           {/* Decorative accent */}
                           <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none group-hover:bg-primary-500/10 transition-colors" />
                        </motion.div>
                     );
                  })}
               </AnimatePresence>

               {filteredPlaces.length === 0 && !loading && (
                  <div className="col-span-full py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-8 text-center shadow-inner">
                     <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                        <Waves className="w-12 h-12" />
                     </div>
                     <div className="space-y-3">
                        <h3 className="text-4xl font-black text-slate-800 tracking-tighter italic font-serif leading-none">THE SILENCE REMAINS</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">No sacred sites were found in this realm.</p>
                     </div>
                     <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="btn-primary px-12 py-5 shadow-premium text-[10px]">REAWAKEN ALL LEGENDS</button>
                  </div>
               )}
            </motion.div>
         )}
      </div>

      {/* Hero Narrative Hub (Modal) */}
      <AnimatePresence>
        {selectedPlace && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center md:p-10">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" 
               onClick={() => setSelectedPlace(null)}
            />
            
            <motion.div 
               layoutId={`card-${selectedPlace._id}`}
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 200, opacity: 0 }}
               className="relative bg-white w-full max-w-7xl md:h-[90vh] overflow-hidden md:rounded-[5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row"
            >
               {/* Close Hub */}
               <button 
                 onClick={() => setSelectedPlace(null)}
                 className="absolute top-10 right-10 z-[60] p-5 bg-black/20 hover:bg-black backdrop-blur-3xl text-white rounded-[2rem] transition-all active:scale-95 border border-white/10"
               >
                 <X className="w-7 h-7" />
               </button>

               {/* Left: Atmospheric Visuals */}
               <div className="lg:w-1/2 h-80 lg:h-auto relative overflow-hidden group">
                  <motion.img 
                     initial={{ scale: 1.3 }}
                     animate={{ scale: 1 }}
                     src={selectedPlace.image} 
                     alt={selectedPlace.name} 
                     className="w-full h-full object-cover transition-transform duration-[5000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />
                  
                  {/* Floating Metadata */}
                  <div className="absolute bottom-20 left-20 right-20 space-y-8">
                     <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-4"
                     >
                        <span className="px-6 py-2.5 bg-primary-500 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                           {selectedPlace.category}
                        </span>
                        <div className="flex items-center space-x-2 px-6 py-2.5 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                           <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                           <span>UNESCO World Heritage</span>
                        </div>
                     </motion.div>
                     
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                     >
                        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic font-serif leading-[0.9]">
                           {selectedPlace.name}
                        </h2>
                        <div className="flex items-center space-x-8 text-white/50 text-xs font-black uppercase tracking-[0.3em] pt-4">
                           <div className="flex items-center"><MapPin className="w-4 h-4 mr-2.5 text-red-500" /> Puri, Odisha</div>
                           <div className="flex items-center"><Activity className="w-4 h-4 mr-2.5 text-green-500" /> 108 Legends Found</div>
                        </div>
                     </motion.div>
                  </div>
               </div>

               {/* Right: The Narrative Experience */}
               <div className="lg:w-1/2 p-12 lg:p-24 overflow-y-auto custom-scrollbar flex flex-col bg-white h-full">
                  <div className="flex-grow space-y-16">
                     <div className="space-y-8">
                        <div className="flex items-center space-x-4">
                           <BookOpen className="w-6 h-6 text-primary-600" />
                           <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Written Chronicle</h4>
                        </div>
                        <p className="text-2xl md:text-3xl font-black text-slate-800 leading-[1.6] italic font-serif tracking-tight pr-4">
                           "{selectedPlace.description}"
                        </p>
                     </div>

                     {/* Audio Player Core */}
                     <div className="space-y-10 p-12 bg-slate-950 rounded-[4rem] relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] min-h-[400px] flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                        
                        <div className="relative z-10 text-center space-y-12">
                           <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] italic mb-6">SACRED FREQUENCY ACTIVE</h4>
                              <div className="flex justify-center items-end space-x-1.5 h-16">
                                 {isPlaying && currentText === selectedPlace.audioGuideText ? (
                                    [...Array(12)].map((_, i) => (
                                       <motion.div 
                                          key={i}
                                          animate={{ height: [12, Math.random() * 64 + 12, 12] }}
                                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                                          className="w-1.5 bg-primary-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                                       />
                                    ))
                                 ) : (
                                    [...Array(12)].map((_, i) => (
                                       <div key={i} className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                                    ))
                                 )}
                              </div>
                           </div>

                           <div className="flex flex-col items-center space-y-8">
                              <button 
                                 onClick={() => (isPlaying && currentText === selectedPlace.audioGuideText) ? stop() : speak(selectedPlace.audioGuideText)}
                                 className={`w-32 h-32 rounded-[3.5rem] flex items-center justify-center transition-all duration-700 active:scale-95 shadow-2xl group ${
                                    (isPlaying && currentText === selectedPlace.audioGuideText)
                                    ? 'bg-red-500 text-white animate-pulse' 
                                    : 'bg-primary-500 text-slate-950 hover:scale-105'
                                 }`}
                              >
                                 {(isPlaying && currentText === selectedPlace.audioGuideText) ? <Square className="w-10 h-10 fill-current" /> : <Play className="w-12 h-12 fill-current ml-2 transform group-hover:rotate-12 transition-transform" />}
                              </button>
                              
                              <div className="space-y-2">
                                 <p className="text-sm font-black text-white italic tracking-tighter uppercase whitespace-pre-wrap">
                                    {(isPlaying && currentText === selectedPlace.audioGuideText) ? 'THE ORACLE IS SPEAKING...' : 'COMMENCE SACRED NARRATIVE'}
                                 </p>
                                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Crystal Clear 128kbps Audio</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                        <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-primary-600 hover:scale-110 transition-all cursor-pointer"><Share2 className="w-5 h-5" /></div>
                        <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-primary-600 hover:scale-110 transition-all cursor-pointer"><ListMusic className="w-5 h-5" /></div>
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Powered by GuideGo Spatial Audio</p>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Explore;
;
