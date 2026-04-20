import React, { useState } from 'react';
import { Play, Search, Clock, MapPin, Pause, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioGuidePage = () => {
  const [playing, setPlaying] = useState(null); // { id, name }

  const tours = [
    { id: 1, name: 'Sun Temple, Konark', duration: '15 min', image: 'https://images.unsplash.com/photo-1600100395420-40aa0c46bc5e?auto=format&fit=crop&q=80', color: 'from-amber-500/20' },
    { id: 2, name: 'Jagannath Temple, Puri', duration: '22 min', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80', color: 'from-blue-500/20' },
    { id: 3, name: 'Lingaraj, Bhubaneswar', duration: '12 min', image: 'https://images.unsplash.com/photo-1590740924976-50d4a973347f?auto=format&fit=crop&q=80', color: 'from-purple-500/20' },
    { id: 4, name: 'Chilika Lake', duration: '18 min', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80', color: 'from-emerald-500/20' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 bg-[var(--bg-base)] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] mb-2">Immersive Journeys</h1>
          <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">Audio Explorer</h2>
        </div>
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search a place for audio tour..." 
            className="input-field pl-16 py-4"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tours.map((tour) => (
          <motion.div 
            key={tour.id}
            whileHover={{ y: -6 }}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-lg)] overflow-hidden group cursor-pointer hover:border-[var(--border-hover)] transition-all flex flex-col"
          >
            <div className="h-[180px] relative overflow-hidden">
              <img src={tour.image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-[var(--radius-sm)] flex items-center gap-2 border border-white/10">
                <Clock size={12} className="text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">{tour.duration}</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow bg-[var(--bg-card)]">
               <div className="flex items-start gap-2 mb-6">
                  <MapPin size={14} className="text-[var(--accent)] mt-0.5 shrink-0" />
                  <h3 className="text-[15px] font-medium text-[var(--text-primary)] leading-tight">{tour.name}</h3>
               </div>
               <button 
                onClick={() => setPlaying(tour)}
                className={`w-full py-3.5 rounded-[var(--radius-md)] flex items-center justify-center gap-2 font-bold text-[11px] uppercase tracking-wider transition-all ${
                  playing?.id === tour.id 
                  ? 'bg-[var(--success)] text-white' 
                  : 'bg-[var(--accent-bg)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white'
                }`}
               >
                 {playing?.id === tour.id ? <Pause size={14} /> : <Play size={14} />}
                 {playing?.id === tour.id ? 'PAUSE TOUR' : 'PLAY GUIDED TOUR'}
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Audio Player Bar */}
      <AnimatePresence>
        {playing && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl z-[2000] px-6"
          >
            <div className="bg-[var(--bg-card)] border border-[var(--border-hover)] rounded-[var(--radius-lg)] p-6 shadow-2xl flex items-center gap-6 backdrop-blur-xl">
               <div className="w-16 h-16 rounded-[var(--radius-md)] overflow-hidden shrink-0 border border-[var(--border-color)]">
                 <img src={playing.image} className="w-full h-full object-cover" />
               </div>
               <div className="flex-grow">
                  <p className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest leading-none mb-1">Now Narrating</p>
                  <h4 className="text-xl font-black text-[var(--text-primary)] italic font-serif leading-tight">{playing.name}</h4>
                  <div className="mt-4 h-1.5 bg-white/5 rounded-full relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      className="absolute left-0 top-0 h-full bg-[var(--accent)]"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                    <span>04:12</span>
                    <span>{playing.duration}</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => setPlaying(null)} className="btn-secondary p-4 rounded-xl text-[var(--danger)] hover:bg-[var(--danger-bg)]">
                    <Pause size={20} />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioGuidePage;
