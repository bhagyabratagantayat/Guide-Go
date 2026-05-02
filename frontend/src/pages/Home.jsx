import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { 
  Search, MapPin, Zap, ShieldCheck, 
  Headphones, Users, Star, ArrowRight,
  TrendingUp, Bell, Globe, ChevronRight,
  Navigation, CheckCircle, Navigation2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('INR');
  const [activeBooking, setActiveBooking] = useState(null);
  const [showSticky, setShowSticky] = useState(false);
  
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  
  // Functional Search States
  const [locationQuery, setLocationQuery] = useState('');
  const [duration, setDuration] = useState('2 Hours');
  const [language, setLanguage] = useState('Hindi');

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 350) {
      setShowSticky(true);
    } else {
      setShowSticky(false);
    }
  });

  // --- Fetch Dynamic Places ---
  React.useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const { data } = await api.get('/places');
        setPlaces(data);
        if (data.length > 0) setLocationQuery(data[0].name);
      } catch (err) {
        console.error('Failed to fetch places:', err);
      } finally {
        setLoadingPlaces(false);
      }
    };
    fetchPlaces();
  }, []);

  React.useEffect(() => {
    if (user?.role === 'user') {
      const fetchActiveSession = async () => {
        try {
          const { data: bookings } = await api.get('/bookings/user');
          const active = bookings.find(b => ['searching', 'accepted', 'ongoing'].includes(b.status));
          if (active) setActiveBooking(active);
        } catch (err) {
          console.error(err);
        }
      };
      fetchActiveSession();
    }
  }, [user]);

  const features = [
    { title: 'Real-time Matching', icon: <Zap />, desc: 'Instant connection with nearest guides' },
    { title: 'Verified & Trusted', icon: <CheckCircle />, desc: 'All guides are background checked' },
    { title: 'Secure & Safe', icon: <ShieldCheck />, desc: 'OTP verification ensures safety' },
    { title: '24/7 Support', icon: <Headphones />, desc: 'We are always here to help you' }
  ];

  return (
    <div className="min-h-screen bg-white text-[#222222] pb-24 desktop:pb-12">
      <Helmet>
        <title>GuideGo | AI-Powered Smart Tourism</title>
        <meta name="description" content="Discover and book local guides instantly. Experience Odisha with smart AI-powered tourism." />
      </Helmet>

      {/* --- STICKY SEARCH BAR --- */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: -100, opacity: 0, x: '-50%', scale: 0.95 }}
            animate={{ y: 0, opacity: 1, x: '-50%', scale: 1 }}
            exit={{ y: -100, opacity: 0, x: '-50%', scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-4 lg:top-6 left-1/2 z-[1000] w-[calc(100%-32px)] lg:w-[calc(100%-48px)] max-w-4xl"
          >
             <div className="bg-[#f0f0f0]/95 backdrop-blur-2xl w-full rounded-[2.5rem] p-1.5 lg:p-2 border border-white/50 shadow-2xl flex items-center gap-1">
                {/* Location Segment (Always visible) */}
                <div className="flex-1 px-5 lg:px-6 py-2.5 lg:py-3 rounded-[2rem] hover:bg-white/80 transition-all group flex flex-col text-left">
                   <div className="flex items-center gap-2 mb-0.5 lg:mb-1">
                      <MapPin size={10} className="text-[#ff385c]" />
                      <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-[#222222]">Where?</span>
                   </div>
                   <select 
                     value={locationQuery}
                     onChange={(e) => setLocationQuery(e.target.value)}
                     className="bg-transparent border-none text-[12px] lg:text-sm font-bold text-[#222222] focus:ring-0 p-0 cursor-pointer w-full truncate"
                   >
                      {places.map(p => (
                        <option key={p._id} value={p.name}>{p.name}</option>
                      ))}
                   </select>
                </div>

                <div className="hidden md:block w-[1px] h-8 bg-[#dddddd]/80" />

                {/* Duration Segment (Hidden on mobile) */}
                <div className="hidden md:flex flex-1 px-6 py-3 rounded-[2rem] hover:bg-white/80 transition-all group flex-col text-left">
                   <div className="flex items-center gap-2 mb-1">
                      <Zap size={12} className="text-amber-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#222222]">The Plan</span>
                   </div>
                   <select 
                     value={duration}
                     onChange={(e) => setDuration(e.target.value)}
                     className="bg-transparent border-none text-sm font-bold text-[#222222] focus:ring-0 p-0 cursor-pointer w-full"
                   >
                      <option>1 Hour</option>
                      <option>2 Hours</option>
                      <option>4 Hours</option>
                      <option>Full Day</option>
                   </select>
                </div>

                <div className="hidden lg:block w-[1px] h-8 bg-[#dddddd]/80" />

                {/* Language Segment (Hidden on mobile) */}
                <div className="hidden lg:flex flex-1 px-6 py-3 rounded-[2rem] hover:bg-white/80 transition-all group flex-col text-left">
                   <div className="flex items-center gap-2 mb-1">
                      <Globe size={12} className="text-blue-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#222222]">Speak In</span>
                   </div>
                   <select 
                     value={language}
                     onChange={(e) => setLanguage(e.target.value)}
                     className="bg-transparent border-none text-sm font-bold text-[#222222] focus:ring-0 p-0 cursor-pointer w-full"
                   >
                      <option>Hindi</option>
                      <option>English</option>
                      <option>Odia</option>
                   </select>
                </div>

                {/* Search Trigger */}
                <button 
                  onClick={() => navigate('/book-guide', { 
                    state: { 
                      searchParams: { 
                        location: locationQuery, 
                        plan: duration, 
                        language: language 
                      } 
                    } 
                  })}
                  className="h-10 lg:h-14 px-4 lg:px-8 bg-[#222222] text-white rounded-[2rem] flex items-center justify-center gap-2 hover:bg-black active:scale-95 transition-all shadow-lg group ml-1"
                >
                   <span className="font-black text-[11px] lg:text-sm hidden md:block uppercase tracking-widest">Search</span>
                   <Search size={14} lg:size={16} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] lg:h-[75vh] w-full flex items-center justify-center overflow-hidden py-20 lg:py-0">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80" 
            alt="Odisha Adventure" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 lg:bg-black/20" />
        </div>
 
        <div className="relative z-10 w-full max-w-7xl px-6 lg:px-8 text-center space-y-8 lg:space-y-12">
           <motion.div 
             initial={{ opacity: 0, y: 20 }} 
             animate={{ opacity: 1, y: 0 }}
             className="space-y-4 lg:space-y-6"
           >
              <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] lg:leading-[0.9]">
                 Find local experts.<br className="hidden sm:block" />Explore Odisha.
              </h1>
              <p className="text-white/80 text-sm lg:text-lg font-medium max-w-2xl mx-auto px-4">
                Discover hidden gems and sacred temples with verified local guides.
              </p>
           </motion.div>
 
           {/* --- GUIDEGO PREMIUM SEARCH PANEL (RESPONSIVE) --- */}
           <div className="max-w-4xl mx-auto w-full">
              <div className="relative">
                 <div className="bg-white/90 backdrop-blur-2xl w-full rounded-[2rem] lg:rounded-[2.5rem] p-2 lg:p-3 border border-white/50 shadow-2xl flex flex-col lg:flex-row items-stretch lg:items-center gap-1 lg:gap-2">
                    
                    {/* Location Segment */}
                    <div className="flex-1 px-6 lg:px-8 py-3 lg:py-4 rounded-[1.5rem] lg:rounded-[1.8rem] hover:bg-white transition-all group flex flex-col text-left">
                       <div className="flex items-center gap-2 mb-1">
                          <MapPin size={12} className="text-[#ff385c]" />
                          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-[#222222]">Where to?</span>
                       </div>
                       <select 
                         value={locationQuery}
                         onChange={(e) => setLocationQuery(e.target.value)}
                         className="bg-transparent border-none text-sm lg:text-base font-bold text-[#222222] focus:ring-0 p-0 cursor-pointer w-full"
                       >
                          {places.map(p => (
                            <option key={p._id} value={p.name}>{p.name}</option>
                          ))}
                          {places.length === 0 && <option disabled>No locations available</option>}
                       </select>
                    </div>
 
                    <div className="hidden lg:block w-[1px] h-10 bg-[#dddddd]/50" />
 
                    {/* Duration Segment */}
                    <div className="flex-1 px-6 lg:px-8 py-3 lg:py-4 rounded-[1.5rem] lg:rounded-[1.8rem] hover:bg-white transition-all group flex flex-col text-left">
                       <div className="flex items-center gap-2 mb-1">
                          <Zap size={12} className="text-amber-500" />
                          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-[#222222]">The Plan</span>
                       </div>
                       <select 
                         value={duration}
                         onChange={(e) => setDuration(e.target.value)}
                         className="bg-transparent border-none text-sm lg:text-base font-bold text-[#222222] focus:ring-0 p-0 cursor-pointer w-full"
                       >
                          <option>1 Hour</option>
                          <option>2 Hours</option>
                          <option>4 Hours</option>
                          <option>Full Day</option>
                       </select>
                    </div>
 
                    <div className="hidden lg:block w-[1px] h-10 bg-[#dddddd]/50" />
 
                    {/* Language Segment */}
                    <div className="flex-1 px-6 lg:px-8 py-3 lg:py-4 rounded-[1.5rem] lg:rounded-[1.8rem] hover:bg-white transition-all group flex flex-col text-left">
                       <div className="flex items-center gap-2 mb-1">
                          <Globe size={12} className="text-blue-500" />
                          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-[#222222]">Speak In</span>
                       </div>
                       <select 
                         value={language}
                         onChange={(e) => setLanguage(e.target.value)}
                         className="bg-transparent border-none text-sm lg:text-base font-bold text-[#222222] focus:ring-0 p-0 cursor-pointer w-full"
                       >
                          <option>Hindi</option>
                          <option>English</option>
                          <option>Odia</option>
                       </select>
                    </div>
 
                    {/* Search Trigger */}
                    <button 
                      onClick={() => navigate('/book-guide', { 
                        state: { 
                          searchParams: { 
                            location: locationQuery, 
                            plan: duration, 
                            language: language 
                          } 
                        } 
                      })}
                      className="h-14 lg:h-20 px-8 lg:px-12 bg-[#222222] text-white rounded-[1.5rem] lg:rounded-[1.8rem] flex items-center justify-center gap-3 hover:bg-black active:scale-95 transition-all shadow-xl shadow-black/10 group mt-2 lg:mt-0"
                    >
                       <span className="font-black text-[12px] lg:text-sm uppercase tracking-widest">Find Expert</span>
                       <Search size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- POPULAR LOCATIONS (DYNAMIC) --- */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 lg:space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff385c]">Curated Destinations</span>
            <h2 className="text-3xl lg:text-5xl font-black italic tracking-tighter text-[#222222]">Popular Locations</h2>
          </div>
          <button className="flex items-center gap-2 text-sm font-black text-[#222222] hover:underline underline-offset-8 self-start md:self-auto">
            EXPLORE ALL <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {loadingPlaces ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-[#f7f7f7] rounded-[2rem] lg:rounded-[2.5rem] animate-pulse" />
            ))
          ) : (
            places.map((place) => (
              <motion.div 
                key={place._id}
                whileHover={{ y: -10 }}
                onClick={() => navigate('/book-guide', { 
                  state: { searchParams: { location: place.name, plan: '2 Hours', language: 'Hindi' } } 
                })}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden mb-5 lg:mb-6 shadow-xl shadow-black/5">
                  <img 
                    src={place.image || (place.images && place.images[0]) || `https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=600&q=80`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
                    alt={place.name} 
                  />
                  <div className="absolute top-4 lg:top-6 left-4 lg:left-6">
                    <div className="px-4 py-2 bg-white/95 backdrop-blur rounded-full text-[9px] lg:text-[10px] font-black text-[#222222] flex items-center gap-2 shadow-lg">
                      <Zap size={12} className="text-[#ff385c] fill-current" />
                      {place.availableGuides || 10}+ guides
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-6 lg:p-8 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all">
                    <p className="text-white text-[12px] lg:text-sm font-medium leading-relaxed">{place.description || 'Experience the heritage and culture of Odisha with local experts.'}</p>
                  </div>
                </div>
                <div className="px-2 flex justify-between items-start">
                   <div className="flex-1">
                      <h4 className="text-lg lg:text-xl font-black text-[#222222] italic leading-tight">{place.name}, Odisha</h4>
                      <p className="text-[10px] font-bold text-[#717171] uppercase tracking-widest mt-1">Heritage • Cultural Tour</p>
                   </div>
                   <div className="flex items-center gap-1 shrink-0 ml-4">
                      <Star size={14} className="text-amber-500 fill-current" />
                      <span className="text-sm font-black text-[#222222]">4.8</span>
                   </div>
                </div>
                <p className="px-2 mt-4 text-sm font-black text-[#222222]">₹499 <span className="text-[#717171] font-bold italic lowercase">session</span></p>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="bg-[#f7f7f7] py-16 lg:py-24 px-6 lg:px-8 border-y border-[#eeeeee]">
         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 lg:space-y-6 group">
                 <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-2xl lg:rounded-3xl flex items-center justify-center text-[#ff385c] shadow-lg group-hover:bg-[#ff385c] group-hover:text-white transition-all duration-300">
                    {React.cloneElement(f.icon, { size: 24 })}
                 </div>
                 <div className="space-y-2">
                    <h5 className="text-lg font-black italic text-[#222222]">{f.title}</h5>
                    <p className="text-sm font-medium text-[#717171] max-w-[200px]">{f.desc}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-16 lg:py-24 px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
         <div>
            <p className="text-3xl lg:text-4xl font-black text-[#222222]">500+</p>
            <p className="text-[9px] lg:text-[10px] font-black text-[#717171] uppercase tracking-[0.2em] mt-3">Verified Guides</p>
         </div>
         <div>
            <p className="text-3xl lg:text-4xl font-black text-[#222222]">10k+</p>
            <p className="text-[9px] lg:text-[10px] font-black text-[#717171] uppercase tracking-[0.2em] mt-3">Happy Travelers</p>
         </div>
         <div>
            <p className="text-3xl lg:text-4xl font-black text-[#222222]">12k+</p>
            <p className="text-[9px] lg:text-[10px] font-black text-[#717171] uppercase tracking-[0.2em] mt-3">Tours Completed</p>
         </div>
         <div>
            <p className="text-3xl lg:text-4xl font-black text-[#222222]">4.8</p>
            <p className="text-[9px] lg:text-[10px] font-black text-[#717171] uppercase tracking-[0.2em] mt-3">Avg. Rating</p>
         </div>
      </section>

      {/* --- ACTIVE BOOKING FLOATING PILL --- */}
      <AnimatePresence>
         {activeBooking && (
            <motion.div 
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="fixed bottom-24 lg:bottom-12 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-48px)] max-w-md"
            >
               <div 
                 onClick={() => navigate('/book-guide')}
                 className="bg-[#222222] text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 cursor-pointer group hover:bg-black transition-all"
               >
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#ff385c]">
                     <Navigation size={24} className="animate-pulse" />
                  </div>
                  <div className="flex-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Active Session</p>
                     <h4 className="text-lg font-black italic">Ongoing Trip in {activeBooking.location}</h4>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#ff385c] transition-all">
                     <ArrowRight size={18} />
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
