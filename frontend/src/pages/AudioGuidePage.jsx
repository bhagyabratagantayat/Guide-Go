import React, { useState, useMemo } from 'react';
import { 
  Play, Search, Clock, MapPin, Pause, Volume2, 
  ChevronRight, Filter, Headphones, Globe, History, Sparkles, User,
  X, Info, FastForward, Rewind, Navigation
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
    accent: '#f59e0b',
    fullDetails: {
      history: "Built by King Narasimhadeva I of the Eastern Ganga Dynasty in 1250 CE, this temple is a masterpiece of Kalinga architecture. It's designed as a chariot for the Sun God, Surya, with 24 carved stone wheels.",
      highlights: ["Giant Stone Chariot Design", "24 Intricately Carved Wheels", "Celestial Musicians Statues"],
      bestTime: "October to March (6:00 AM - 8:00 PM)",
      stops: [
        { title: "Main Entrance", time: "0:00", description: "Start at the Gaja-Simha gate." },
        { title: "The Nata Mandir", time: "4:30", description: "The Hall of Dance with intricate carvings." },
        { title: "The Main Chariot", time: "9:15", description: "Viewing the 12 pairs of wheels." },
        { title: "Sanctum Sanctorum", time: "12:45", description: "The remains of the main temple structure." }
      ]
    }
  },
  { 
    id: 2, 
    name: 'Jagannath Temple, Puri', 
    location: 'Puri',
    category: 'Spiritual',
    duration: '22:45', 
    description: 'Dive into the history and legends of the spiritual heart of Odisha and its famous Rath Yatra.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800', 
    accent: '#3b82f6',
    fullDetails: {
      history: "One of the Char Dham pilgrimage sites, built by King Anantavarman Chodaganga Deva in the 12th century. The temple is famous for its annual Rath Yatra and several unexplained mysteries.",
      highlights: ["The Nilachakra (Blue Wheel)", "The Mahaprasad Kitchen", "The Patitapabana Image"],
      bestTime: "Year-round (5:00 AM - 11:00 PM)",
      stops: [
        { title: "Singhadwara", time: "0:00", description: "The Lion's Gate entrance." },
        { title: "Ananda Bazar", time: "6:20", description: "The world's largest food market." },
        { title: "The Main Temple", time: "15:10", description: "Understanding the deities' idols." }
      ]
    }
  },
  { 
    id: 3, 
    name: 'Lingaraj Temple', 
    location: 'Bhubaneswar',
    category: 'Heritage',
    duration: '12:10', 
    description: 'Learn about the magnificent Kalinga architecture of the oldest temple in Bhubaneswar.',
    image: 'https://images.unsplash.com/photo-1590740924976-50d4a973347f?auto=format&fit=crop&q=80&w=800', 
    accent: '#a855f7',
    fullDetails: {
      history: "Dating back to the 11th century, it is the largest temple in Bhubaneswar. It represents the pinnacle of Kalinga style architecture and is dedicated to Harihara (Shiva and Vishnu).",
      highlights: ["Bindusagar Tank", "Swayambhu Linga", "54-meter high Vimana"],
      bestTime: "Winter months (6:00 AM - 9:00 PM)",
      stops: [
        { title: "Bindusagar Lake", time: "0:00", description: "The sacred water body nearby." },
        { title: "Main Temple Tower", time: "5:30", description: "Observing the Kalinga spire." },
        { title: "Secondary Shrines", time: "9:45", description: "Exploring the smaller temples around." }
      ]
    }
  },
  { 
    id: 4, 
    name: 'Chilika Lake', 
    location: 'Satapada',
    category: 'Nature',
    duration: '18:30', 
    description: 'A journey through Asia\'s largest lagoon, its Irrawaddy dolphins and migratory birds.',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=800', 
    accent: '#10b981',
    fullDetails: {
      history: "A brackish water lagoon, spread over the Puri, Khurda and Ganjam districts. It's the largest wintering ground for migratory birds on the Indian sub-continent.",
      highlights: ["Irrawaddy Dolphins", "Nalabana Bird Sanctuary", "Kalijai Temple Island"],
      bestTime: "November to February",
      stops: [
        { title: "Satapada Jetty", time: "0:00", description: "Starting the boat journey." },
        { title: "Dolphin Point", time: "7:00", description: "Spotting the Irrawaddy dolphins." },
        { title: "Nalabana Island", time: "14:20", description: "Bird watching session." }
      ]
    }
  },
  { 
    id: 5, 
    name: 'Dhauli Stupa', 
    location: 'Bhubaneswar',
    category: 'Heritage',
    duration: '10:15', 
    description: 'The Peace Pagoda where Emperor Ashoka renounced war and embraced Buddhism.',
    image: 'https://images.unsplash.com/photo-1599661046289-e3188d84692e?auto=format&fit=crop&q=80&w=800', 
    accent: '#f43f5e',
    fullDetails: {
      history: "Built in 1972 as a collaborative effort between Japan Buddha Sangha and the Kalinga Nippon Buddha Sangha. It marks the location where the Kalinga War was fought.",
      highlights: ["White Shanti Stupa", "Ashokan Rock Edicts", "Dhabaleswar Temple"],
      bestTime: "October to March (6:00 AM - 6:00 PM)",
      stops: [
        { title: "Kalinga War Field View", time: "0:00", description: "Looking over the Daya River." },
        { title: "Rock Edicts", time: "4:15", description: "Reading Ashoka's peace messages." },
        { title: "Shanti Stupa", time: "7:50", description: "At the main peace pagoda." }
      ]
    }
  },
  { 
    id: 6, 
    name: 'Udayagiri Caves', 
    location: 'Bhubaneswar',
    category: 'Heritage',
    duration: '14:50', 
    description: 'Ancient rock-cut caves used by Jain monks dating back to the 2nd Century BCE.',
    image: 'https://images.unsplash.com/photo-1623326164287-2384a6021876?auto=format&fit=crop&q=80&w=800', 
    accent: '#84cc16',
    fullDetails: {
      history: "Partly natural and partly artificial caves of archaeological, historical and religious importance. Built during the reign of King Kharavela.",
      highlights: ["Rani Gumpha (Queen's Cave)", "Hathi Gumpha (Elephant Cave)", "Ganesha Gumpha"],
      bestTime: "Winter months (8:00 AM - 5:00 PM)",
      stops: [
        { title: "Rani Gumpha", time: "0:00", description: "The largest and most ornate cave." },
        { title: "Hathi Gumpha", time: "6:40", description: "Viewing the Brahmi inscriptions." },
        { title: "Cave 14", time: "11:20", description: "Exploring the monk cells." }
      ]
    }
  }
];

const CATEGORIES = ['All', 'Heritage', 'Spiritual', 'Nature'];
const LANGUAGES = ['English', 'Hindi', 'Odia'];

const AudioGuidePage = () => {
  const [playing, setPlaying] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLang, setActiveLang] = useState('English');
  const [selectedTour, setSelectedTour] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(65); // Dummy progress for now


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
      <div className="flex flex-wrap gap-4 items-center justify-between">
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
        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          <Sparkles size={14} className="text-blue-500" />
          <span>{filteredTours.length} Guides Available</span>
        </div>
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
                    <button 
                      onClick={() => setSelectedTour(tour)}
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      <Info size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">4.8k Plays</div>
                      <button 
                        onClick={() => setPlaying(tour)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${playing?.id === tour.id ? 'bg-emerald-500 text-white rotate-90 scale-90' : 'bg-blue-600 text-white hover:scale-110 shadow-lg shadow-blue-600/20'}`}
                      >
                        {playing?.id === tour.id ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                    </div>
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
            className="fixed bottom-10 left-10 right-10 z-[2000]"
          >
            <div className="max-w-5xl mx-auto">
               <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center gap-6 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                     <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${progress}%` }} 
                        className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 relative"
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                      </motion.div>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-2xl relative">
                      <img src={playing.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Volume2 size={20} className="text-white animate-pulse"/></div>
                    </div>
                    <div className="flex-grow md:max-w-[200px]">
                       <h4 className="text-lg font-black text-white italic font-serif leading-tight truncate">{playing.name}</h4>
                       <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{activeLang} • Premium</span>
                    </div>
                  </div>

                  <div className="flex flex-grow items-center justify-center gap-8">
                    <button className="text-slate-500 hover:text-white transition-colors"><Rewind size={20}/></button>
                    <button onClick={() => setPlaying(null)} className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/20">
                       <Pause size={24} />
                    </button>
                    <button className="text-slate-500 hover:text-white transition-colors"><FastForward size={20}/></button>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-blue-500 tabular-nums">09:42</span>
                        <span className="text-slate-700 text-[10px]">/</span>
                        <span className="text-[10px] font-black text-slate-500 tabular-nums">{playing.duration}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <select 
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                          className="bg-white/5 text-white text-[10px] font-black border border-white/10 rounded-lg px-2 py-1 outline-none"
                        >
                          <option value="0.5">0.5x</option>
                          <option value="1">1.0x</option>
                          <option value="1.5">1.5x</option>
                          <option value="2">2.0x</option>
                        </select>
                        <button onClick={() => setPlaying(null)} className="text-slate-500 hover:text-red-500 transition-colors"><X size={20}/></button>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOCATION DETAIL MODAL */}
      <AnimatePresence>
        {selectedTour && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTour(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedTour(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-black/50 backdrop-blur-xl rounded-2xl text-white hover:bg-red-500 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-slate-800">
                <img src={selectedTour.image} className="w-full h-full object-cover" alt={selectedTour.name} />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {selectedTour.category}
                  </span>
                </div>
              </div>

              <div className="flex-grow p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-2 text-blue-500 mb-2">
                      <MapPin size={16} />
                      <span className="text-xs font-black uppercase tracking-widest">{selectedTour.location}</span>
                    </div>
                    <h2 className="text-4xl font-black text-white italic font-serif">{selectedTour.name}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Clock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                      </div>
                      <p className="text-white font-bold">{selectedTour.duration}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Sparkles size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Best Time</span>
                      </div>
                      <p className="text-white font-bold">{selectedTour.fullDetails.bestTime}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <History size={20} className="text-blue-500" />
                      Historical Background
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {selectedTour.fullDetails.history}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Navigation size={20} className="text-blue-500" />
                      Guided Stops
                    </h3>
                    <div className="space-y-3">
                      {selectedTour.fullDetails.stops.map((stop, i) => (
                        <div key={i} className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-all cursor-pointer">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center text-xs font-black">
                            {stop.time}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{stop.title}</p>
                            <p className="text-slate-500 text-xs">{stop.description}</p>
                          </div>
                          <ChevronRight size={16} className="ml-auto text-slate-700 group-hover:text-blue-500 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setPlaying(selectedTour);
                      setSelectedTour(null);
                    }}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Play size={20} fill="currentColor" />
                    Start Audio Guide
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

export default AudioGuidePage;
