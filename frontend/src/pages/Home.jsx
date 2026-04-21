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
    <div className="min-h-screen bg-bg-base text-text-primary pb-24 desktop:pb-12">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-auto min-h-[60vh] lg:h-[65vh] w-full flex items-center overflow-hidden rounded-[2rem] lg:rounded-[3rem] mt-4 lg:mt-6 mx-auto max-w-[98%]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80" 
            alt="Odisha Adventure" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-bg-base/60 lg:via-bg-base/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-6 lg:px-20 py-20 lg:py-0 max-w-4xl space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: -30 }} 
             animate={{ opacity: 1, x: 0 }}
             className="space-y-4"
           >
              <h4 className="text-[10px] font-black tracking-[0.5em] text-accent uppercase">Explore Like a Local</h4>
              <h1 className="text-4xl lg:text-8xl font-black italic font-serif leading-[0.9] lg:leading-[0.8] tracking-tighter">
                 Discover Your<br className="hidden lg:block"/> Next Adventure
              </h1>
              <p className="text-base lg:text-lg text-text-secondary font-bold max-w-xl italic">Book trusted local guides instantly and explore the hidden gems of our world.</p>
           </motion.div>

           <AnimatePresence>
             {activeBooking && (
               <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-accent/10 border border-accent/20 backdrop-blur-xl p-6 rounded-[2rem] flex items-center justify-between gap-6 max-w-xl"
               >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center animate-pulse">
                      <Navigation size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white italic">Active Trip Session</h4>
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest">
                        {activeBooking.status === 'searching' ? 'Finding experts...' : `With ${activeBooking.guideId?.name || 'Local Expert'}`}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/book-guide')}
                    className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-lg shadow-white/10"
                  >
                    Resume <ArrowRight size={14} className="inline ml-1" />
                  </button>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <button 
                onClick={() => navigate('/book-guide')}
                className="btn-primary flex items-center gap-3 px-10 py-5 text-base"
              >
                 Book Guide Now <ArrowRight size={20} />
              </button>
              <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-bg-base" alt="" />
                 ))}
                 <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-black text-xs border-4 border-bg-base">1K+</div>
              </div>
           </div>
        </div>
      </section>

      {/* --- QUICK BOOK CARD --- */}
      <section className="max-w-[90%] mx-auto -mt-12 relative z-30">
        <div className="glass-card p-10 rounded-[2.5rem] shadow-2xl">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-accent/20 text-accent rounded-xl">
                 <Navigation size={20} />
              </div>
              <div>
                 <h3 className="text-xl font-black">Quick Book Guide</h3>
                 <p className="text-[10px] font-black uppercase text-text-muted tracking-widest">Find your expert in 3 easy steps</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase text-text-muted ml-1">Select Location</label>
                 <select className="input-field appearance-none cursor-pointer">
                    <option>Puri, Odisha</option>
                    <option>Konark</option>
                    <option>Bhubaneswar</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase text-text-muted ml-1">Select Plan</label>
                 <select className="input-field appearance-none cursor-pointer">
                    <option>2 Hours (Basic)</option>
                    <option>4 Hours (Half Day)</option>
                    <option>Full Day (Expert)</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase text-text-muted ml-1">Language</label>
                 <div className="flex gap-2">
                    <button className="chip active flex-1 py-4 text-[10px]">Hindi</button>
                    <button className="chip flex-1 py-4 text-[10px]">English</button>
                    <button className="chip flex-1 py-4 text-[10px]">Odia</button>
                 </div>
              </div>
              <div className="md:pt-5 pt-2">
                 <button 
                  onClick={() => navigate('/book-guide')}
                  className="btn-primary w-full py-5"
                 >
                    Find Guide <Navigation2 size={16} className="inline ml-2 rotate-90" />
                 </button>
              </div>
           </div>
        </div>
      </section>

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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularLocations.map((loc) => (
              <motion.div 
                key={loc.name}
                whileHover={{ y: -10 }}
                className="bg-bg-card rounded-[2.5rem] overflow-hidden border border-border-color group cursor-pointer"
                onClick={() => navigate('/book-guide')}
              >
                <div className="relative h-64 overflow-hidden">
                   <img src={loc.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                   <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-success/20 text-success backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center">
                        <Zap size={10} className="mr-1 fill-current" /> {loc.guides} Online
                      </span>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
                </div>
                <div className="p-8">
                   <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">{loc.category}</p>
                   <h3 className="text-2xl font-black tracking-tight">{loc.name}</h3>
                   <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center text-amber-500 font-black text-xs">
                        <Star size={14} className="mr-1 fill-current" /> {loc.rating}
                      </div>
                      <span className="text-text-muted font-bold text-xs">({loc.reviews} reviews)</span>
                   </div>
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
                <p className="text-text-muted font-medium text-xs leading-relaxed">{f.desc}</p>
             </div>
           ))}
        </section>

        {/* --- STATS BAR --- */}
        <section className="bg-bg-input rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-12 border border-border-color grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center">
           <div>
              <p className="text-3xl lg:text-4xl font-black text-white italic font-serif">500+</p>
              <p className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Verified Guides</p>
           </div>
           <div>
              <p className="text-3xl lg:text-4xl font-black text-white italic font-serif">1K+</p>
              <p className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Happy Travelers</p>
           </div>
           <div>
              <p className="text-3xl lg:text-4xl font-black text-white italic font-serif">12k</p>
              <p className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Tours Completed</p>
           </div>
           <div>
              <p className="text-3xl lg:text-4xl font-black text-white italic font-serif">4.8</p>
              <p className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">Average Rating</p>
           </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
