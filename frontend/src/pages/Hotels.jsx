import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, SlidersHorizontal, Hotel, ArrowDownUp, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockHotels } from '../data/mockHotels';
import HotelCard from '../components/HotelCard';

const Hotels = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended'); // recommended, price_low, price_high, rating
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [minRating, setMinRating] = useState(0);

  // Process sorting and filtering
  const filteredAndSortedHotels = useMemo(() => {
    let result = [...mockHotels];

    // Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(h => 
        h.name.toLowerCase().includes(q) || 
        h.city.toLowerCase().includes(q)
      );
    }

    // Filter Price & Rating
    result = result.filter(h => h.pricePerNight <= maxPrice && h.rating >= minRating);

    // Sort
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price_high':
        result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // recommended (no specific sort, just natural mock order)
        break;
    }

    return result;
  }, [searchQuery, sortBy, maxPrice, minRating]);

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
           <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none uppercase">Luxury Stays</h1>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="px-6 mb-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 w-5 h-5" />
          <input 
            type="text"
            placeholder="Where do you want to stay?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-5 pl-14 pr-6 shadow-premium dark:shadow-none font-bold outline-none focus:border-primary-500/30 transition-all text-slate-900 dark:text-white"
          />
        </div>
        
        <div className="flex gap-4">
           {/* Sort Dropdown */}
           <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center px-4 shadow-premium dark:shadow-none">
              <ArrowDownUp className="w-5 h-5 text-slate-400 mr-2" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-700 dark:text-slate-300 font-bold py-5 appearance-none cursor-pointer pr-4"
              >
                 <option value="recommended">Recommended</option>
                 <option value="price_low">Price: Low to High</option>
                 <option value="price_high">Price: High to Low</option>
                 <option value="rating">Top Rated</option>
              </select>
           </div>
           
           {/* Filter Button */}
           <button 
             onClick={() => setShowFilters(!showFilters)}
             className={`w-[68px] h-[68px] rounded-2xl flex items-center justify-center transition-all ${showFilters ? 'bg-primary-500 text-slate-900 shadow-xl shadow-primary-500/20' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 shadow-premium dark:shadow-none'}`}
           >
              <SlidersHorizontal className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 mb-10 max-w-7xl mx-auto overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-premium dark:shadow-none grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* Price Filter */}
               <div>
                  <div className="flex justify-between items-center mb-4">
                     <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Max Price (per night)</span>
                     <span className="font-bold text-primary-500">₹{maxPrice.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="2000" max="25000" step="500" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary-500"
                  />
               </div>

               {/* Rating Filter */}
               <div>
                  <div className="flex justify-between items-center mb-4">
                     <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Minimum Rating</span>
                     <span className="font-bold text-orange-500">{minRating}+ Stars</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="5" step="0.5" 
                    value={minRating} 
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotel Cards List */}
      <div className="px-6 max-w-7xl mx-auto">
        {filteredAndSortedHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {filteredAndSortedHotels.map((hotel) => (
               <HotelCard key={hotel._id} hotel={hotel} />
             ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4">
             <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Hotel className="w-12 h-12 text-slate-300" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase">No Stays Found</h3>
             <p className="text-slate-400 font-bold max-w-md mx-auto">Try adjusting your filters or search criteria to find the perfect luxury experience.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
