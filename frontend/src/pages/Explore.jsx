import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Info, Volume2, Square, 
  ChevronRight, Calendar, Camera, Play, 
  Pause, Activity, X
} from 'lucide-react';
import useAudioGuide from '../hooks/useAudioGuide';

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
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

  const filteredPlaces = places.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10"
      >
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
             <Camera className="w-3 h-3 text-primary-500" />
             <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Heritage Discovery</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-slate-800 tracking-tighter italic font-serif">WORLD HERITAGE</h1>
          <p className="text-slate-500 font-bold text-lg leading-relaxed italic">
            "Every stone has a story. Every temple a heartbeat." Explore the spiritual soul of Odisha.
          </p>
        </div>
        
        <div className="relative group w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search sacred sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-16 pr-8 py-5 bg-white border-none rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary-500/10 w-full lg:w-[450px] shadow-premium transition-all font-bold text-slate-700 placeholder:text-slate-300"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6 group-focus-within:text-primary-500 transition-colors" />
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[500px] bg-slate-50 rounded-[3.5rem] animate-pulse"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {filteredPlaces.length > 0 ? filteredPlaces.map((place) => {
            const isCurrentlyPlaying = isPlaying && currentText === place.audioGuideText;
            
            return (
              <motion.div 
                key={place._id} 
                variants={item}
                whileHover={{ y: -10 }}
                className="group glass-card rounded-[3.5rem] overflow-hidden transition-all duration-700 relative"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                    {place.category}
                  </div>
                  
                  {/* Floating Action */}
                  {place.audioGuideText && (
                     <button 
                       onClick={() => isCurrentlyPlaying ? stop() : speak(place.audioGuideText)}
                       className={`absolute bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 active:scale-95 shadow-2xl ${
                         isCurrentlyPlaying ? 'bg-red-500 text-white' : 'bg-primary-500 text-slate-900 group-hover:bg-primary-400'
                       }`}
                     >
                       {isCurrentlyPlaying ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-6 h-6" />}
                     </button>
                  )}
                </div>

                <div className="p-10 pb-12 space-y-6">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic font-serif leading-none group-hover:text-primary-600 transition-colors uppercase">{place.name}</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-3 flex items-center">
                       <MapPin className="w-3.5 h-3.5 mr-2 text-primary-500" /> Odisha, Bharat
                    </p>
                  </div>
                  
                  <p className="text-slate-500 font-bold leading-relaxed line-clamp-2 text-sm italic">
                    "{place.description}"
                  </p>
                  
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black">JK</div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black">SP</div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black">RB</div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-500 flex items-center justify-center text-[10px] font-black text-white">+8</div>
                     </div>
                     
                     <button 
                       onClick={() => setSelectedPlace(place)}
                       className="group/btn flex items-center text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] italic hover:text-primary-600 transition-colors"
                     >
                       Full Story 
                       <ChevronRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </div>
                </div>
              </motion.div>
            );
          }) : (
            <div className="col-span-full py-32 glass-card rounded-[4rem] flex flex-col items-center justify-center space-y-6 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                 <Search className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter italic">No Legends Found</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Try adjusting your sacred quest markers.</p>
               </div>
               <button onClick={() => setSearchTerm('')} className="btn-primary px-8 py-3 text-xs">Reset Discovery</button>
            </div>
          )}
        </motion.div>
      )}

      {/* Place Details Modal - Completely Re-imagined */}
      <AnimatePresence>
        {selectedPlace && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-10 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl pointer-events-auto" 
              onClick={() => setSelectedPlace(null)}
            />
            
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              className="relative bg-white w-full max-w-6xl h-full max-h-[85vh] overflow-hidden rounded-[4rem] shadow-premium pointer-events-auto flex flex-col lg:flex-row border-4 border-white"
            >
              <button 
                onClick={() => setSelectedPlace(null)}
                className="absolute top-8 right-8 z-50 p-4 bg-slate-900/40 hover:bg-slate-900 backdrop-blur-xl text-white rounded-[1.5rem] transition-all active:scale-95 shadow-2xl"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left: Immersive Visuals */}
              <div className="lg:w-5/12 h-64 lg:h-auto relative overflow-hidden">
                <motion.img 
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  src={selectedPlace.image} 
                  alt={selectedPlace.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 right-12 space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2"
                  >
                     <span className="px-4 py-1.5 bg-primary-500 text-slate-900 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                       {selectedPlace.category}
                     </span>
                     <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
                       Heritage Rank #12
                     </span>
                  </motion.div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl font-black text-white tracking-tighter italic font-serif leading-none"
                  >
                    {selectedPlace.name}
                  </motion.h2>
                </div>
              </div>

              {/* Right: Narrative & Controls */}
              <div className="lg:w-7/12 p-8 lg:p-20 overflow-y-auto custom-scrollbar flex flex-col">
                <div className="flex-1 space-y-12">
                   <div className="space-y-6">
                      <div className="flex items-center space-x-3 text-primary-600">
                         <Info className="w-5 h-5" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] font-sans">The Legend Begins</h4>
                      </div>
                      <p className="text-slate-600 font-bold leading-loose text-xl italic font-serif bg-slate-50 p-8 rounded-[3rem] border-2 border-slate-50 shadow-inner">
                        "{selectedPlace.description}"
                      </p>
                   </div>

                   {selectedPlace.audioGuideText && (
                     <div className="space-y-8 p-10 bg-slate-900 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                           <div className="flex items-center space-x-4 mb-8">
                              <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center">
                                 <Activity className="w-6 h-6 animate-pulse" />
                              </div>
                              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">Sacred Audio Narrative</h4>
                           </div>
                           
                           <div className="flex flex-col sm:flex-row gap-6">
                             {(isPlaying && currentText === selectedPlace.audioGuideText) ? (
                               <div className="flex-1 flex gap-3">
                                 <button onClick={pause} className="flex-1 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-500 transition-all">Pause</button>
                                 <button onClick={stop} className="px-8 py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Stop</button>
                               </div>
                             ) : (
                               <button 
                                 onClick={() => speak(selectedPlace.audioGuideText)}
                                 className="flex-1 py-6 bg-primary-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-primary-400 transition-all shadow-2xl shadow-primary-500/30 flex items-center justify-center space-x-4 group"
                               >
                                 <Play className="w-5 h-5 fill-current transform group-hover:scale-125 transition-transform" />
                                 <span>Activate Storyteller</span>
                               </button>
                             )}
                           </div>
                        </div>
                        {/* Abstract glow */}
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary-500/10 rounded-full blur-[80px]" />
                     </div>
                   )}
                </div>

                <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Coordinates</span>
                         <span className="text-xs font-black text-slate-800 tracking-widest">
                            {selectedPlace.latitude.toFixed(6)} N • {selectedPlace.longitude.toFixed(6)} E
                         </span>
                      </div>
                   </div>
                   
                   <button 
                     onClick={() => setSelectedPlace(null)}
                     className="w-full sm:w-auto px-10 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-soft"
                   >
                     Exit Explorer
                   </button>
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
