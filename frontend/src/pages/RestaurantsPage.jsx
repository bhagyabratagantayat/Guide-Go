import React, { useState } from 'react';
import { Search, Star, MapPin, Utensils, Info, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RestaurantsPage = () => {
  const [activeCuisine, setActiveCuisine] = useState('All');
  
  const cuisines = ['All', 'Indian', 'Chinese', 'Seafood', 'Cafe', 'Fast Food'];

  const restaurants = [
    { id: 1, name: 'Trupti Veg', cuisine: 'Indian', price: '$$', rating: 4.4, dist: '0.8 km', image: 'https://images.unsplash.com/photo-1517248135467-4c7ed9d42177?auto=format&fit=crop&q=80' },
    { id: 2, name: 'Chilika Dhaba', cuisine: 'Seafood', price: '$$$', rating: 4.8, dist: '4.2 km', image: 'https://images.unsplash.com/photo-1544628159-fb4b4005aa97?auto=format&fit=crop&q=80' },
    { id: 3, name: 'Bocca Cafe', cuisine: 'Cafe', price: '$$', rating: 4.6, dist: '1.5 km', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80' },
    { id: 4, name: 'Mainland China', cuisine: 'Chinese', price: '$$$$', rating: 4.5, dist: '2.1 km', image: 'https://images.unsplash.com/photo-1525615921718-55c4d29a50b4?auto=format&fit=crop&q=80' },
    { id: 5, name: 'Dalma Restaurant', cuisine: 'Indian', price: '$$', rating: 4.7, dist: '1.2 km', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80' },
    { id: 6, name: 'KFC Puri', cuisine: 'Fast Food', price: '$$', rating: 4.1, dist: '0.5 km', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80' },
  ];

  const filtered = activeCuisine === 'All' ? restaurants : restaurants.filter(r => r.cuisine === activeCuisine);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] mb-2">Gastronomy Discovery</h1>
          <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">Local Flavour Highlights</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-orange-500" size={18} />
            <input 
               type="text" 
               placeholder="Search cuisines or restaurants..." 
               className="input-field pl-16 py-4 bg-[var(--bg-card)] border-[var(--border)] focus:border-orange-500"
            />
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-2">
            {cuisines.map(c => (
               <button 
                key={c}
                onClick={() => setActiveCuisine(c)}
                className={`chip py-4 whitespace-nowrap ${activeCuisine === c ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white/5 text-[var(--text-secondary)] border-[var(--border)]'}`}
               >
                 {c}
               </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(res => (
          <motion.div 
            key={res.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[3rem] overflow-hidden group shadow-soft hover:shadow-2xl transition-all"
          >
            <div className="h-56 relative overflow-hidden">
               <img src={res.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={res.name} />
               <div className="absolute top-6 left-6 flex gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest">{res.cuisine}</span>
                  <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest">{res.price}</span>
               </div>
               <div className="absolute bottom-6 right-6 bg-white text-black px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                  <Star size={12} className="fill-orange-500 text-orange-500" /> {res.rating}
               </div>
            </div>
            
            <div className="p-8">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black italic font-serif text-white leading-tight mb-2">{res.name}</h3>
                    <p className="flex items-center text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                       <MapPin size={10} className="text-orange-500 mr-1.5" /> {res.dist} from your location
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--bg-base)] rounded-2xl border border-[var(--border)] text-[var(--text-secondary)] group-hover:text-orange-500 transition-colors">
                     <Utensils size={18} />
                  </div>
               </div>
               
               <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-500 transition-all">
                  VIEW DIGITAL MENU <ArrowUpRight size={14} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* TODO: Connect to backend GET /api/restaurants */}
      <div className="text-center py-10 opacity-30 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">
         Mock gastronomic data - API endpoints currently in development
      </div>
    </div>
  );
};

export default RestaurantsPage;
