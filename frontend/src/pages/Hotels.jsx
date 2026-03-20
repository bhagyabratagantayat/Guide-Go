import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotel, Star, MapPin, ChevronLeft, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Hotels = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get('/api/hotels');
        setHotels(res.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 pt-24 transition-colors duration-300">
      {/* Header */}
      <div className="px-6 mb-8 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button 
             onClick={() => navigate(-1)} 
             className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-premium dark:shadow-none border border-slate-100 dark:border-slate-800 active:scale-95 transition-all text-slate-400 dark:text-slate-500 hover:text-primary-500"
           >
              <ChevronLeft className="w-6 h-6" />
           </button>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none uppercase">Hotels</h1>
        </div>
        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-premium dark:shadow-none border border-slate-100 dark:border-slate-800 text-slate-400">
           <SlidersHorizontal className="w-5 h-5" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-10 max-w-7xl mx-auto">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search luxury stays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-6 pl-14 pr-6 shadow-premium dark:shadow-none font-bold text-lg outline-none focus:border-primary-500/30 transition-all text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Hotel Cards List */}
      <div className="px-4 space-y-10 max-w-7xl mx-auto">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
             <div key={i} className="w-full h-96 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[2.5rem]" />
          ))
        ) : filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <motion.div 
              key={hotel._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-premium dark:shadow-none border border-slate-100 dark:border-slate-800 group"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/6] md:aspect-[16/5] w-full overflow-hidden">
                 <img 
                   src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80'} 
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                   alt={hotel.name} 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                 
                 {/* Rating Badge */}
                 <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-xl px-4 py-2 rounded-full flex items-center space-x-2 border border-white/20">
                    <Star className="w-4 h-4 text-primary-500 fill-primary-500" />
                    <span className="text-sm font-black text-white">{hotel.rating || '4.5'}</span>
                 </div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-10">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div className="space-y-2">
                       <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight italic font-serif uppercase">
                         {hotel.name}
                       </h3>
                       <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          <span className="text-xs md:text-sm font-black uppercase tracking-widest">{hotel.city}, Odisha</span>
                       </div>
                    </div>
                    
                    <div className="text-left md:text-right">
                       <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em] mb-1">Nightly</p>
                       <p className="text-3xl md:text-4xl font-black text-primary-500 tracking-tighter italic font-serif">
                         ₹{hotel.pricePerNight.toLocaleString()}
                       </p>
                    </div>
                 </div>

                 <button 
                   onClick={() => navigate(`/user/explore-map?hotelId=${hotel._id}`)}
                   className="w-full py-6 md:py-8 bg-primary-500 text-slate-950 rounded-2xl md:rounded-[2rem] font-black text-sm md:text-base uppercase tracking-[0.25em] shadow-xl shadow-primary-500/20 hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98]"
                 >
                    Book Now
                 </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                <Hotel className="w-10 h-10 text-slate-300" />
             </div>
             <p className="text-slate-400 font-bold">No hotels found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
