import React, { useState, useMemo, useRef, useEffect } from 'react';
import api from '../utils/api';
import { 
  Play, Search, Clock, MapPin, Pause, Volume2, 
  ChevronRight, Filter, Headphones, Globe, History, Sparkles, User,
  X, Info, FastForward, Rewind, Navigation, VolumeX, SkipBack, SkipForward
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const CATEGORIES = ['All', 'Heritage', 'Spiritual', 'Nature'];
const LANGUAGES = ['English', 'Hindi', 'Odia'];

const AudioGuidePage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLang, setActiveLang] = useState('English');
  const [selectedTour, setSelectedTour] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);
  const [isTTS, setIsTTS] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const { data } = await api.get('/audio-guides');
        setGuides(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching audio guides:', error);
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  // Cleanup TTS on unmount or guide change
  useEffect(() => {
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [playing]);

  useEffect(() => {
    if (playing) {
      if (playing.audioUrl) {
        setIsTTS(false);
        if (audioRef.current) {
          audioRef.current.src = playing.audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        setIsTTS(true);
        playTTS(playing.description);
      }
    }
  }, [playing]);

  const playTTS = (text) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    }
  };

  const togglePlay = () => {
    if (isTTS) {
      if (isPlaying) {
        synthRef.current.pause();
        setIsPlaying(false);
      } else {
        if (synthRef.current.paused) {
          synthRef.current.resume();
        } else {
          playTTS(playing.description);
        }
        setIsPlaying(true);
      }
    } else {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const filteredTours = useMemo(() => {
    return (guides || []).filter(tour => {
      if (!tour) return false;
      const name = tour.name || tour.title || '';
      const location = tour.location || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || tour.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, guides]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 bg-slate-50 min-h-screen relative overflow-hidden">
      <Helmet><title>Audio Explorer | GuideGo</title></Helmet>
      
      <audio 
        ref={audioRef} 
        onTimeUpdate={onTimeUpdate} 
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-[#ff385c]/10 rounded-lg text-[#ff385c]"><Headphones size={20}/></div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff385c]">Premium Narrations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Experience Odisha</h1>
          <p className="text-slate-500 max-w-lg text-sm font-medium">
            Discover the hidden stories of ancient monuments with our curated audio guides.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-md">
           <div className="relative flex-grow group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff385c] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Where to go?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-full pl-12 pr-6 py-4 text-slate-900 font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#ff385c]/20 focus:border-[#ff385c] transition-all shadow-sm"
              />
           </div>
        </div>
      </div>

      {/* FILTERS & STATS */}
      <div className="flex flex-wrap gap-4 items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full border text-[12px] font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <Sparkles size={14} className="text-[#ff385c]" />
          <span>{filteredTours.length} Experiences</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
        </div>
      ) : (
        /* TOURS GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode='popLayout'>
          {filteredTours.map((tour) => (
            <motion.div 
              key={tour._id || tour.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col relative"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={tour.image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                    <Clock size={12} className="text-[#ff385c]" />
                    <span className="text-[10px] font-bold text-slate-900">{tour.duration}</span>
                  </div>
                  {tour.audioUrl ? (
                    <div className="bg-emerald-500 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">
                      Special Audio
                    </div>
                  ) : (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">
                      AI Narrated
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setPlaying(tour)}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <div className="w-12 h-12 bg-[#ff385c] rounded-full flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                    {playing?._id === tour._id && isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                  </div>
                </button>
              </div>

              <div className="p-5 space-y-3 flex-grow flex flex-col">
                 <div className="flex items-center gap-1.5 text-[#ff385c]">
                    <MapPin size={12}/>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{tour.location}</span>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 leading-tight">{tour.name || tour.title}</h3>
                 <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                   {tour.description}
                 </p>
                 
                 <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-auto">
                    <button 
                      onClick={() => setSelectedTour(tour)}
                      className="text-[12px] font-bold text-slate-900 underline underline-offset-4 hover:text-[#ff385c] transition-colors"
                    >
                      Show Details
                    </button>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                       <User size={12}/>
                       <span>4.8k listened</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      )}

      {/* AUDIO PLAYER BAR */}
      <AnimatePresence>
        {playing && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 z-[2000] md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl"
          >
             <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                    <img src={playing.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                     <h4 className="text-sm font-bold text-slate-900 truncate">{playing.name || playing.title}</h4>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                       {activeLang} • {isTTS ? 'AI Narration' : 'Premium Guide'}
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => {
                       if (audioRef.current) audioRef.current.currentTime -= 10;
                    }} className="text-slate-400 hover:text-slate-900 transition-colors"><Rewind size={20}/></button>
                    <button 
                      onClick={togglePlay} 
                      className="w-10 h-10 rounded-full bg-[#ff385c] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#ff385c]/20"
                    >
                       {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </button>
                    <button onClick={() => {
                       if (audioRef.current) audioRef.current.currentTime += 10;
                    }} className="text-slate-400 hover:text-slate-900 transition-colors"><FastForward size={20}/></button>
                    <button onClick={() => setPlaying(null)} className="ml-2 text-slate-300 hover:text-slate-500"><X size={18}/></button>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1">
                   <span className="text-[10px] font-bold text-slate-400 tabular-nums w-8">{formatTime(currentTime)}</span>
                   <div className="flex-grow h-1 bg-slate-100 rounded-full relative group cursor-pointer overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-[#ff385c] rounded-full" 
                        style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                      />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 tabular-nums w-8">{formatTime(duration)}</span>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOCATION DETAIL MODAL */}
      <AnimatePresence>
        {selectedTour && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTour(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedTour(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-full md:w-5/12 h-64 md:h-auto relative bg-slate-100">
                <img src={selectedTour.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="px-3 py-1 bg-[#ff385c] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {selectedTour.category}
                  </span>
                </div>
              </div>

              <div className="flex-grow p-8 md:p-10 overflow-y-auto custom-scrollbar bg-white">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#ff385c] mb-1">
                      <MapPin size={14} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">{selectedTour.location}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">{selectedTour.name}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Length</p>
                      <p className="text-slate-900 font-bold">{selectedTour.duration}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Best Visit</p>
                      <p className="text-slate-900 font-bold text-xs">{selectedTour.fullDetails.bestTime}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <History size={18} className="text-[#ff385c]" />
                      History & Significance
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      {selectedTour.fullDetails.history}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Navigation size={18} className="text-[#ff385c]" />
                      What you'll hear
                    </h3>
                    <div className="space-y-2">
                      {selectedTour.fullDetails.stops.map((stop, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-default">
                          <div className="text-[10px] font-bold text-[#ff385c] tabular-nums">
                            {stop.time}
                          </div>
                          <div>
                            <p className="text-slate-900 font-bold text-sm">{stop.title}</p>
                            <p className="text-slate-400 text-[11px]">{stop.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setPlaying(selectedTour);
                      setSelectedTour(null);
                    }}
                    className="w-full py-4 bg-[#ff385c] hover:bg-[#e00b41] text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-[#ff385c]/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <Play size={18} fill="currentColor" />
                    Start Listening Now
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
;
