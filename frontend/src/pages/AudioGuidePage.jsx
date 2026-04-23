import React, { useState, useMemo } from 'react';
import { 
  Play, Search, Clock, MapPin, Pause, Volume2, 
  ChevronRight, Filter, Headphones, Globe, History, Sparkles, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const TOURS_DATA = [
  { 
    id: 1, 
    name: 'Sun Temple, Konark', 
    location: 'Konark, Puri',
    category: 'Heritage',
    duration: '15:20', 
    description: 'Explore the 13th-century UNESCO site shaped as a giant stone chariot of the Sun God.',
    image: 'https://images.unsplash.com/photo-1600100395420-40aa0c46bc5e?auto=format&fit=crop&q=80&w=800', 
    accent: '#f59e0b'
  },
  { 
    id: 2, 
    name: 'Jagannath Temple, Puri', 
    location: 'Puri',
    category: 'Spiritual',
    duration: '22:45', 
    description: 'Dive into the history and legends of the spiritual heart of Odisha and its famous Rath Yatra.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800', 
    accent: '#3b82f6'
  },
  { 
    id: 3, 
    name: 'Lingaraj Temple', 
    location: 'Bhubaneswar',
    category: 'Heritage',
    duration: '12:10', 
    description: 'Learn about the magnificent Kalinga architecture of the oldest temple in Bhubaneswar.',
    image: 'https://images.unsplash.com/photo-1590740924976-50d4a973347f?auto=format&fit=crop&q=80&w=800', 
    accent: '#a855f7'
  },
  { 
    id: 4, 
    name: 'Chilika Lake', 
    location: 'Satapada',
    category: 'Nature',
    duration: '18:30', 
    description: 'A journey through Asia\'s largest lagoon, its Irrawaddy dolphins and migratory birds.',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=800', 
    accent: '#10b981'
  },
  { 
    id: 5, 
    name: 'Dhauli Stupa', 
    location: 'Bhubaneswar',
    category: 'Heritage',
    duration: '10:15', 
    description: 'The Peace Pagoda where Emperor Ashoka renounced war and embraced Buddhism.',
    image: 'https://images.unsplash.com/photo-1599661046289-e3188d84692e?auto=format&fit=crop&q=80&w=800', 
    accent: '#f43f5e'
  },
  { 
    id: 6, 
    name: 'Udayagiri Caves', 
    location: 'Bhubaneswar',
    category: 'Heritage',
    duration: '14:50', 
    description: 'Ancient rock-cut caves used by Jain monks dating back to the 2nd Century BCE.',
    image: 'https://images.unsplash.com/photo-1623326164287-2384a6021876?auto=format&fit=crop&q=80&w=800', 
    accent: '#84cc16'
  }
];

const CATEGORIES = ['All', 'Heritage', 'Spiritual', 'Nature'];
const LANGUAGES = ['English', 'Hindi', 'Odia'];

const AudioGuidePage = () => {
  const [playing, setPlaying] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLang, setActiveLang] = useState('English');

  const filteredTours = useMemo(() => {
    return TOURS_DATA.filter(tour => {
      const matchesSearch = tour.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tour.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || tour.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 bg-[#0f172a] min-h-screen rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
      <Helmet><title>Audio Explorer | GuideGo</title></Helmet>

      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] -z-10" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Headphones size={24}/></div>
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400">Premium Narration</span>
          </div>
          <h1 className="text-5xl font-black italic font-serif text-white tracking-tight">Audio Explorer</h1>
          <p className="text-slate-400 max-w-lg text-sm font-medium leading-relaxed">
            Immerse yourself in the stories of Odisha with our curated audio guides. Available in multiple languages.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-xl">
           <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search monuments..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white font-bold placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-all backdrop-blur-xl"
              />
           </div>
           <div className="flex items-center bg-slate-900/50 border border-white/5 rounded-2xl p-1.5 backdrop-blur-xl">
              {LANGUAGES.map(lang => (
                <button 
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeLang === lang ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  {lang.substring(0, 3)}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
         {CATEGORIES.map(cat => (
           <button 
             key={cat}
             onClick={() => setActiveCategory(cat)}
             className={`px-8 py-4 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${activeCategory === cat ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* TOURS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        <AnimatePresence mode='popLayout'>
          {filteredTours.map((tour) => (
            <motion.div 
              key={tour.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -10 }}
              className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/30 transition-all flex flex-col shadow-2xl relative"
            >
              <div className="h-[240px] relative overflow-hidden">
                <img src={tour.image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
                
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
                  <Clock size={14} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{tour.duration}</span>
                </div>

                <div className="absolute bottom-6 left-6">
                   <div className="flex items-center gap-2 text-blue-500 mb-1">
                      <MapPin size={14}/>
                      <span className="text-[10px] font-black uppercase tracking-widest">{tour.location}</span>
                   </div>
                   <h3 className="text-2xl font-black text-white italic font-serif">{tour.name}</h3>
                </div>
              </div>

              <div className="p-8 space-y-6 flex-grow flex flex-col">
                 <p className="text-slate-400 text-sm font-medium leading-relaxed flex-grow">
                   {tour.description}
                 </p>
                 
                 <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center"><User size={12} className="text-slate-500"/></div>)}
                       <div className="pl-10 text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center">4.8k Plays</div>
                    </div>
                    <button 
                      onClick={() => setPlaying(tour)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${playing?.id === tour.id ? 'bg-emerald-500 text-white rotate-90 scale-90' : 'bg-blue-600 text-white hover:scale-110 shadow-lg shadow-blue-600/20'}`}
                    >
                      {playing?.id === tour.id ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                 </div>
              </div>

              <div className="absolute top-6 left-6 px-4 py-1.5 bg-blue-600/20 backdrop-blur-xl border border-blue-500/20 rounded-full">
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-400">{tour.category}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* AUDIO PLAYER BAR */}
      <AnimatePresence>
        {playing && (
          <motion.div 
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-10 left-10 right-10 z-[2000] pointer-events-none"
          >
            <div className="max-w-5xl mx-auto pointer-events-auto">
               <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex items-center gap-8 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                     <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 10, repeat: Infinity }} className="h-full bg-gradient-to-r from-blue-600 to-emerald-500" />
                  </div>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-2xl relative">
                    <img src={playing.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Volume2 size={24} className="text-white animate-pulse"/></div>
                  </div>
                  <div className="flex-grow">
                     <div className="flex items-center gap-3 mb-1">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">Live Narration</span>
                        <span className="text-slate-500 text-[10px] font-bold">• Language: {activeLang}</span>
                     </div>
                     <h4 className="text-2xl font-black text-white italic font-serif leading-tight">{playing.name}</h4>
                     <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">09:42</span>
                        <div className="h-1.5 flex-grow bg-white/5 rounded-full relative overflow-hidden">
                           <div className="absolute left-0 top-0 h-full w-[65%] bg-blue-600 rounded-full" />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{playing.duration}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-6 pr-4">
                     <button className="text-slate-500 hover:text-white transition-colors"><Globe size={20}/></button>
                     <button onClick={() => setPlaying(null)} className="w-16 h-16 rounded-3xl bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/20">
                       <Pause size={28} />
                     </button>
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
