import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Compass, Hotel as HotelIcon, Coffee, 
  HeartPulse, Bike, ArrowRight, Star, Building2,
  LayoutDashboard, Calendar, User, Sparkles, Navigation, ChevronRight, Zap, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { popularLocations, recommendedDestinations, trendingPlaces } from '../data/mockHomeData';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const quickActions = [
    { icon: Compass, title: 'Explore Map', desc: 'Find places interactively', path: '/user/explore-map', color: 'bg-indigo-500' },
    { icon: Building2, title: 'Agencies', desc: 'Verified tour operators', path: '/agencies', color: 'bg-blue-500' },
    { icon: HotelIcon, title: 'Hotels', desc: 'Book premium stays', path: '/hotels', color: 'bg-pink-500' },
    { icon: Coffee, title: 'Dining', desc: 'Local flavor highlights', path: '/restaurants', color: 'bg-orange-500' },
    { icon: HeartPulse, title: 'Emergency', desc: '24/7 Safety protocols', path: '/emergency', color: 'bg-red-500' },
    { icon: Bike, title: 'Transport', desc: 'Rides and logistics', path: '/user/explore-map?filter=transport', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-32 transition-colors duration-300 overflow-x-hidden text-white font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80" 
            alt="Odisha Tourism" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-sm font-black uppercase tracking-[0.5em] text-primary-400 mb-6 drop-shadow-lg">
              {user?.role === 'guide' ? 'Namaste, Local Expert' : 'Namaste, Explorer'}
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter italic font-serif leading-none mb-8 drop-shadow-2xl">
              Discover Your<br />Next Adventure
            </h1>
            
            {/* Massive Search Bar */}
            <div className="w-full max-w-3xl mx-auto relative group mb-10">
              <div className="absolute inset-x-0 -bottom-4 mx-auto w-[90%] h-8 bg-primary-500/20 blur-2xl rounded-full" />
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-3 flex shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                <div className="pl-6 pr-4 flex items-center justify-center">
                  <Search className="w-6 h-6 text-white/50 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Where do you want to go?" 
                  className="w-full bg-transparent border-none text-white placeholder-white/50 font-bold text-lg focus:outline-none focus:ring-0 py-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  onClick={() => navigate(`/user/explore-map?q=${searchQuery}`)}
                  className="bg-primary-500 hover:bg-white hover:text-primary-600 text-white px-8 py-4 rounded-[2.5rem] font-black uppercase text-[12px] tracking-widest transition-all shadow-lg active:scale-95 whitespace-nowrap"
                >
                  Explore Now
                </button>
              </div>
            </div>

            {/* Sub-CTA */}
            {user?.role !== 'guide' && (
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={() => navigate('/trip-planner')}
                  className="flex items-center text-white/70 hover:text-white group transition-colors font-bold tracking-widest uppercase text-[10px]"
                >
                  <MapPin className="w-4 h-4 mr-2 group-hover:text-primary-400 transition-colors" />
                  Or Let AI Plan Your Trip
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. POPULAR LOCATIONS (WhatsApp Status Style) */}
      <section className="relative -mt-20 z-20 max-w-7xl mx-auto pl-6 md:px-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Trending Stories</h3>
        <div className="flex overflow-x-auto pb-8 pt-2 custom-scrollbar gap-6 snap-x snap-mandatory pr-6">
          {popularLocations.map(loc => (
            <button 
              key={loc.id}
              onClick={() => navigate('/user/explore-map')}
              className="flex flex-col items-center gap-3 shrink-0 group snap-center"
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full p-1 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ${loc.isActive ? 'bg-gradient-to-tr from-primary-500 via-indigo-500 to-primary-300' : 'bg-slate-800'}`}>
                <div className="w-full h-full rounded-full border-[3px] border-slate-950 overflow-hidden">
                  <img src={loc.imageUrl} alt={loc.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">{loc.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. UPGRADED QUICK ACTIONS */}
      {user?.role !== 'guide' ? (
        <section className="max-w-7xl mx-auto px-6 mt-16">
          <h3 className="text-3xl font-black italic font-serif uppercase tracking-tight text-white mb-8 flex items-center gap-3">
             <Zap className="w-6 h-6 text-primary-500" /> Quick Discovery
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, idx) => (
              <button 
                key={idx}
                onClick={() => navigate(action.path)}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-[2.5rem] flex items-center gap-5 hover:bg-slate-800 hover:border-slate-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all group text-left"
              >
                <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-6 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white leading-tight">{action.title}</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        /* GUIDE DASHBOARD TOOLS */
        <section className="max-w-7xl mx-auto px-6 mt-16">
          <h3 className="text-3xl font-black italic font-serif uppercase tracking-tight text-white mb-8">Guide Command Center</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', path: '/guide', color: 'bg-primary-500' },
              { icon: Calendar, label: 'Bookings', path: '/guide/bookings', color: 'bg-indigo-500' },
              { icon: Sparkles, label: 'Guide AI Assistant', path: '/guide/ai-chat', color: 'bg-pink-500' },
              { icon: User, label: 'My Profile', path: '/guide/profile', color: 'bg-orange-500' },
            ].map((action, idx) => (
              <button 
                key={idx}
                onClick={() => navigate(action.path)}
                className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-all hover:-translate-y-2 group"
              >
                <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-white">{action.label}</h4>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 4. RECOMMENDED FOR YOU */}
      {user?.role !== 'guide' && (
      <section className="max-w-7xl mx-auto pl-6 md:px-6 mt-20">
        <div className="flex justify-between items-end mb-8 pr-6 md:pr-0">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Curated Experiences</h3>
            <h2 className="text-4xl font-black italic font-serif uppercase tracking-tighter text-white">Recommended For You</h2>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-400 hidden sm:block">View All</button>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-12 pt-4 custom-scrollbar snap-x snap-mandatory pr-6">
          {recommendedDestinations.map(dest => (
            <div key={dest.id} className="w-[300px] md:w-[350px] shrink-0 snap-center bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-slate-700 hover:shadow-2xl transition-all">
              <div className="h-48 relative overflow-hidden">
                <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 flex items-center">
                  <Star className="w-3.5 h-3.5 fill-primary-500 text-primary-500 mr-1.5" />
                  <span className="text-xs font-black text-white">{dest.rating}</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-black italic font-serif text-white mb-2">{dest.name}</h4>
                <p className="text-sm font-medium text-slate-400 line-clamp-2 mb-6 h-10">{dest.description}</p>
                <div className="flex justify-between items-center pt-5 border-t border-slate-800">
                  <span className="text-lg font-black text-white tracking-tighter">₹{dest.price} <span className="text-[10px] uppercase text-slate-500 ml-1">Starting</span></span>
                  <button 
                    onClick={() => navigate(`/agencies`)}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-primary-500 hover:text-white text-slate-900 transition-colors shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* 5. TRENDING / LIVE IN ODISHA */}
      {user?.role !== 'guide' && (
      <section className="max-w-7xl mx-auto pl-6 md:px-6 mt-10">
        <div className="mb-8">
          <h3 className="text-4xl font-black italic font-serif uppercase tracking-tighter text-white flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-indigo-500" /> Trending Now
          </h3>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-12 custom-scrollbar snap-x snap-mandatory pr-6">
          {trendingPlaces.map(place => (
            <div key={place.id} className="w-[280px] shrink-0 snap-center relative rounded-[2.5rem] overflow-hidden group h-[350px] cursor-pointer" onClick={() => navigate('/user/explore-map')}>
              <img src={place.imageUrl} alt={place.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center animate-pulse">
                 Trending
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase font-black tracking-widest text-primary-400 mb-2 block">{place.category}</span>
                <h4 className="text-2xl font-black italic font-serif text-white leading-tight">{place.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

    </div>
  );
};

export default Home;
