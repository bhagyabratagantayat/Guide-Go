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
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] mb-2">Immersive Journeys</h1>
          <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">Audio Explorer</h2>
        </div>
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search a place for audio tour..." 
            className="input-field pl-16 py-4 bg-[var(--bg-card)] border-[var(--border)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tours.map((tour) => (
          <motion.div 
            key={tour.id}
            whileHover={{ y: -10 }}
            className="glass-card rounded-[2.5rem] overflow-hidden group cursor-pointer"
          >
            <div className="h-48 relative overflow-hidden">
              <img src={tour.image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className={`absolute inset-0 bg-gradient-to-t ${tour.color} to-transparent`} />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10">
                <Clock size={12} className="text-[var(--accent)]" />
                <span className="text-[10px] font-black uppercase tracking-widest">{tour.duration}</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
               <div className="flex items-start gap-2 min-h-[50px]">
                  <MapPin size={14} className="text-[var(--accent)] mt-1 shrink-0" />
                  <h3 className="text-xl font-black text-white leading-tight italic font-serif">{tour.name}</h3>
               </div>
               <button 
                onClick={() => setPlaying(tour)}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                  playing?.id === tour.id 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                  : 'bg-white/5 hover:bg-[var(--accent)] text-white'
                }`}
               >
                 {playing?.id === tour.id ? <Pause size={16} /> : <Play size={16} />}
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
            <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white/5">
                 <img src={playing.image} className="w-full h-full object-cover" />
               </div>
               <div className="flex-grow">
                  <p className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest leading-none mb-1">Now Narrating</p>
                  <h4 className="text-xl font-black text-white italic font-serif leading-tight">{playing.name}</h4>
                  <div className="mt-4 h-1.5 bg-white/10 rounded-full relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      className="absolute left-0 top-0 h-full bg-[var(--accent)] shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <span>04:12</span>
                    <span>{playing.duration}</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => setPlaying(null)} className="p-4 bg-white/5 rounded-2xl hover:text-red-500 transition-colors">
                    <Pause size={24} />
                  </button>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Volume2 size={18} />
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioGuidePage;
