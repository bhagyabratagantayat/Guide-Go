import React, { useState } from 'react';
import { Search, Star, MapPin, Filter, Plane, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';

const HotelsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const { formatPrice } = useCurrency();

  const filters = ['All', 'Budget', 'Mid-range', 'Luxury'];

  const hotels = [
    { id: 1, name: 'Swaraj Residency', city: 'Puri', type: 'Budget', price: 1200, rating: 4.2, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80' },
    { id: 2, name: 'Mayfair Heritage', city: 'Puri', type: 'Luxury', price: 15000, rating: 4.9, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80' },
    { id: 3, name: 'The Hans Coco Palms', city: 'Puri', type: 'Mid-range', price: 5500, rating: 4.5, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80' },
    { id: 4, name: 'Trident Bhubaneswar', city: 'Bhubaneswar', type: 'Luxury', price: 9000, rating: 4.8, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80' },
    { id: 5, name: 'Ginger Bhubaneswar', city: 'Bhubaneswar', type: 'Budget', price: 3200, rating: 3.9, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80' },
    { id: 6, name: 'Blue Lily Beach Resort', city: 'Puri', type: 'Mid-range', price: 6200, rating: 4.3, image: 'https://images.unsplash.com/photo-1551882547-ff43c33f7835?auto=format&fit=crop&q=80' },
  ];

  const filteredHotels = activeFilter === 'All' ? hotels : hotels.filter(h => h.type === activeFilter);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] mb-2">Premium Stays</h1>
          <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">Find Your Sanctuary</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)]" size={18} />
            <input 
               type="text" 
               placeholder="Search hotels in Puri, Bhubaneswar..." 
               className="input-field pl-16 py-4 bg-[var(--bg-card)] border-[var(--border)]"
            />
          </div>
          <div className="flex gap-2">
            {filters.map(f => (
               <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`chip py-4 ${activeFilter === f ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-white/5 text-[var(--text-secondary)] border-[var(--border)]'}`}
               >
                 {f}
               </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHotels.map(hotel => (
          <motion.div 
            key={hotel.id}
            whileHover={{ y: -6 }}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-lg)] overflow-hidden group hover:border-[var(--border-hover)] transition-all flex flex-col"
          >
            <div className="h-64 relative overflow-hidden">
               <img src={hotel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={hotel.name} />
               <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-[var(--radius-sm)] flex items-center border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-2" />
                  <span className="text-xs font-black text-white">{hotel.rating}</span>
               </div>
               <div className="absolute top-6 left-6 flex gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-[var(--success)] text-white text-[9px] font-black uppercase tracking-wider">Verified Check</span>
               </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-black italic font-serif text-[var(--text-primary)] mb-2 leading-tight">{hotel.name}</h3>
                <div className="flex items-center text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest">
                   <MapPin size={12} className="text-[var(--accent)] mr-2" /> {hotel.city}, Odisha
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
                <div>
                   <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1">Starting from</p>
                   <p className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">{formatPrice(hotel.price)} <span className="text-[10px] font-medium text-[var(--text-secondary)] ml-1">/ Night</span></p>
                </div>
                <button className="w-12 h-12 bg-[var(--accent-bg)] rounded-xl flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-xl active:scale-95 group/btn">
                   <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* TODO: Connect to a real hotels API (Booking.com via RapidAPI) */}
      <div className="text-center py-10 opacity-30 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">
         Mock data enabled - Live API connection pending integration
      </div>
    </div>
  );
};

export default HotelsPage;
