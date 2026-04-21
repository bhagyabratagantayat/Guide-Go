import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Zap, ShieldCheck, 
  Headphones, Users, Star, ArrowRight,
  TrendingUp, Bell, Globe, ChevronRight,
  Navigation, CheckCircle, Navigation2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('INR');
  const [activeBooking, setActiveBooking] = useState(null);

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

  const popularLocations = [
    { id: 1, name: 'Puri', guides: 12, rating: 4.8, reviews: 320, category: 'Beach', img: 'https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?w=600&q=80' },
    { id: 2, name: 'Konark', guides: 8, rating: 4.7, reviews: 210, category: 'Heritage', img: 'https://images.unsplash.com/photo-1606298246186-08868ab77562?w=600&q=80' },
    { id: 3, name: 'Bhubaneswar', guides: 15, rating: 4.8, reviews: 410, category: 'Temples', img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80' },
    { id: 4, name: 'Cuttack', guides: 6, rating: 4.6, reviews: 180, category: 'River Side', img: 'https://images.unsplash.com/photo-1589136142558-132d431057e9?w=600&q=80' }
  ];

  const features = [
    { title: 'Real-time Matching', icon: <Zap />, desc: 'Instant connection with nearest guides' },
    { title: 'Verified & Trusted', icon: <CheckCircle />, desc: 'All guides are background checked' },
    { title: 'Secure & Safe', icon: <ShieldCheck />, desc: 'OTP verification ensures safety' },
    { title: '24/7 Support', icon: <Headphones />, desc: 'We are always here to help you' }
  ];

  return (
    <div className="min-h-screen bg-white text-[#222222] pb-24 desktop:pb-12">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[70vh] lg:h-[75vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80" 
            alt="Odisha Adventure" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 w-full max-w-7xl px-8 text-center space-y-12">
           <motion.div 
             initial={{ opacity: 0, y: 20 }} 
             animate={{ opacity: 1, y: 0 }}
             className="space-y-6"
           >
              <h1 className="text-5xl lg:text-8xl font-bold text-white tracking-tighter leading-[0.9]">
                 Find local experts.<br />Explore Odisha.
              </h1>
           </motion.div>

           {/* --- FLOATING SEARCH BAR (AIRBNB STYLE) --- */}
           <div className="max-w-4xl mx-auto">
              <div className="search-pill bg-white w-full h-20 pl-10 pr-4 flex items-center justify-between group cursor-pointer border border-[#dddddd] shadow-xl hover:shadow-2xl transition-all">
                 <div className="flex-1 flex items-center gap-8 divide-x divide-[#dddddd]">
                    <div className="flex flex-col text-left">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[#222222] mb-1">Where</span>
                       <span className="text-sm font-medium text-[#717171]">Search destinations</span>
                    </div>
                    <div className="flex flex-col text-left pl-8">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[#222222] mb-1">Plan</span>
                       <span className="text-sm font-medium text-[#717171]">Select duration</span>
                    </div>
                    <div className="flex flex-col text-left pl-8">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[#222222] mb-1">Language</span>
                       <span className="text-sm font-medium text-[#717171]">Select preference</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => navigate('/book-guide')}
                  className="w-14 h-14 bg-[#ff385c] text-white rounded-full flex items-center justify-center hover:bg-[#e00b41] transition-all"
                 >
                    <Search size={22} strokeWidth={3} />
                 </button>
              </div>
           </div>

           <AnimatePresence>
             {activeBooking && (
               <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => navigate('/book-guide')}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full mx-auto w-fit flex items-center gap-4 cursor-pointer hover:bg-white/20 transition-all"
               >
                  <div className="w-8 h-8 bg-[#ff385c] rounded-full flex items-center justify-center animate-pulse">
                    <Navigation size={16} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-white mr-2">Ongoing Trip: Resume Session</span>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </section>

      {/* --- QUICK BOOK SECTION (REMOVED IN FAVOR OF SEARCH PILL) --- */}

      <div className="max-w-7xl mx-auto px-8 mt-24 space-y-32">
        
        {/* --- POPULAR LOCATIONS --- */}
        <section>
          <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-12">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-2">Curated Destinations</h4>
              <h2 className="text-3xl lg:text-4xl font-black font-serif italic tracking-tighter">Popular Locations</h2>
            </div>
            <button className="text-[10px] font-black uppercase text-accent tracking-widest flex items-center group w-fit">
               Explore All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {popularLocations.map((loc) => (
              <motion.div 
                key={loc.name}
                whileHover={{ opacity: 0.9 }}
                className="group cursor-pointer"
                onClick={() => navigate('/book-guide')}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem] mb-4">
                   <img src={loc.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                   <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-lg text-[10px] font-bold text-[#222222] flex items-center">
                        <Zap size={10} className="mr-1 text-[#ff385c] fill-current" /> {loc.guides} guides
                      </span>
                   </div>
                </div>
                <div className="space-y-1">
                   <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#222222]">{loc.name}, Odisha</h3>
                      <div className="flex items-center text-[#222222] font-medium text-xs">
                        <Star size={12} className="mr-1 fill-current" /> {loc.rating}
                      </div>
                   </div>
                   <p className="text-[#717171] text-sm font-normal">{loc.category} • Heritage Tour</p>
                   <p className="text-[#222222] text-sm font-bold mt-1">₹499 <span className="font-normal text-[#717171]">session</span></p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {features.map((f, i) => (
             <div key={i} className="p-10 glass-card rounded-[3rem] group hover:border-accent transition-all text-center">
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-white transition-all shadow-lg group-hover:shadow-accent/30">
                   {f.icon}
                </div>
                <h4 className="font-black text-xl mb-2">{f.title}</h4>
                <p className="text-muted font-medium text-xs leading-relaxed">{f.desc}</p>
             </div>
           ))}
        </section>

        {/* --- STATS BAR --- */}
        <section className="bg-[#f7f7f7] rounded-[3rem] p-12 lg:p-20 border border-[#dddddd] grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
           <div>
              <p className="text-4xl font-bold text-[#222222]">500+</p>
              <p className="text-[11px] font-medium text-[#717171] uppercase tracking-[0.2em] mt-3">Verified Guides</p>
           </div>
           <div>
              <p className="text-4xl font-bold text-[#222222]">1K+</p>
              <p className="text-[11px] font-medium text-[#717171] uppercase tracking-[0.2em] mt-3">Happy Travelers</p>
           </div>
           <div>
              <p className="text-4xl font-bold text-[#222222]">12k</p>
              <p className="text-[11px] font-medium text-[#717171] uppercase tracking-[0.2em] mt-3">Tours Completed</p>
           </div>
           <div>
              <p className="text-4xl font-bold text-[#222222]">4.8</p>
              <p className="text-[11px] font-medium text-[#717171] uppercase tracking-[0.2em] mt-3">Average Rating</p>
           </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
