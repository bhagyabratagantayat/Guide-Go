import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Compass, Hotel as HotelIcon, Utensils, 
  ArrowRight, Star, Building2, LayoutDashboard, Calendar, 
  User, Sparkles, ChevronRight, Zap, TrendingUp, Headphones,
  Camera, Landmark, Mountain, Ship
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { popularLocations, recommendedDestinations, trendingPlaces } from '../data/mockHomeData';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Heritage', icon: Landmark, color: 'bg-amber-500' },
    { name: 'Food', icon: Utensils, color: 'bg-orange-500' },
    { name: 'Adventure', icon: Mountain, color: 'bg-emerald-500' },
    { name: 'Nature', icon: Ship, color: 'bg-blue-500' },
    { name: 'Photography', icon: Camera, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-[var(--bg-base)] min-h-screen">
      
      {/* 1. HERO SECTION (70vh) */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80" 
            alt="Odisha Tourism" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/60 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent)] mb-4">
              {user?.role === 'guide' ? 'WELCOME, LOCAL EXPERT' : 'EXPLORE THE UNEXPLORED'}
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter italic font-serif leading-none mb-8">
              Discover Your<br />Next Adventure
            </h1>
            
            <div className="w-full max-w-2xl mx-auto relative group">
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex shadow-2xl">
                <input 
                  type="text" 
                  placeholder="Where do you want to go?" 
                  className="w-full bg-transparent border-none text-white placeholder-white/30 font-bold text-lg focus:outline-none focus:ring-0 px-6 py-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  onClick={() => navigate(`/guides?q=${searchQuery}`)}
                  className="btn-primary rounded-2xl whitespace-nowrap"
                >
                  Find Guides
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. TRENDING LOCATIONS (WhatsApp Status Style) */}
      <section className="max-w-7xl mx-auto px-8 -mt-16 relative z-20 overflow-x-auto no-scrollbar flex gap-6 pb-12">
        {popularLocations.map(loc => (
          <button 
            key={loc.id}
            onClick={() => navigate('/guides')}
            className="flex flex-col items-center gap-3 shrink-0 group"
          >
            <div className={`w-20 h-20 rounded-full p-1 transition-transform group-hover:scale-110 border-2 ${loc.isActive ? 'border-[var(--accent)]' : 'border-white/10'}`}>
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={loc.imageUrl} alt={loc.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{loc.name}</span>
          </button>
        ))}
      </section>

      <div className="max-w-7xl mx-auto px-8 space-y-24 pb-32">
        
        {/* 3. BROWSE GUIDES NEAR YOU */}
        <section className="glass-card rounded-[3rem] p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-12 -translate-y-12 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform">
            <Compass size={240} className="text-[var(--accent)]" />
          </div>
          <div className="relative z-10 max-w-xl">
             <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)] mb-4">Experts waiting near you.</h2>
             <p className="text-[var(--text-secondary)] font-medium mb-8">Book a certified local guide who knows the hidden stories and unspoken myths of your destination.</p>
             <button 
              onClick={() => navigate('/guides')}
              className="btn-primary flex items-center gap-2"
             >
                Explore Guides <ArrowRight size={18} />
             </button>
          </div>
        </section>

        {/* 4. POPULAR CATEGORIES */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-2">Curated Journeys</h4>
              <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">Popular Categories</h2>
            </div>
            <button onClick={() => navigate('/guides')} className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest hover:underline transition-all">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => navigate(`/guides?category=${cat.name}`)}
                className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center hover:scale-[1.02] transition-all group"
              >
                <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>
                   <cat.icon className="w-8 h-8 text-white" />
                </div>
                <h5 className="font-black italic font-serif text-lg">{cat.name}</h5>
              </button>
            ))}
          </div>
        </section>

        {/* 5. TRENDING SECTION */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <TrendingUp className="text-[var(--accent)]" size={32} />
            <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingPlaces.slice(0, 3).map(place => (
              <div 
                key={place.id}
                onClick={() => navigate('/guides')}
                className="relative h-[400px] rounded-[3rem] overflow-hidden cursor-pointer group"
              >
                <img src={place.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={place.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/20 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-2 block">{place.category}</span>
                  <h3 className="text-2xl font-black italic font-serif text-white leading-tight">{place.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
