import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, SlidersHorizontal, Hotel, ArrowDownUp, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { mockHotels } from '../data/mockHotels';
import HotelCard from '../components/HotelCard';

const Hotels = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
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
    <div className="bg-[#f7f7f7] min-h-screen pb-32 pt-24">
      
      {/* Header */}
      <div className="px-6 mb-10 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-5">
           <button 
             onClick={() => navigate(-1)} 
             className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#dddddd] active:scale-95 transition-all text-[#222222] hover:text-[#ff385c]"
           >
              <ChevronLeft className="w-6 h-6" />
           </button>
           <div>
              <h1 className="text-4xl font-extrabold text-[#222222] tracking-tight">Luxury Stays</h1>
              <p className="text-[11px] font-bold text-[#ff385c] uppercase tracking-[0.3em] mt-1">Odisha's Finest Hospitality</p>
           </div>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="px-6 mb-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow shadow-sm">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#717171] w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by hotel name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#dddddd] rounded-full py-5 pl-14 pr-6 font-semibold outline-none focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c] transition-all text-[#222222]"
          />
        </div>
        
        <div className="flex gap-4">
           <div className="relative bg-white rounded-full border border-[#dddddd] flex items-center px-6 shadow-sm">
              <ArrowDownUp className="w-4 h-4 text-[#ff385c] mr-3" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none text-[#222222] font-bold py-5 appearance-none cursor-pointer pr-4 text-sm"
              >
                 <option value="recommended">Recommended</option>
                 <option value="price_low">Price: Low to High</option>
                 <option value="price_high">Price: High to Low</option>
                 <option value="rating">Top Rated</option>
              </select>
           </div>
           
           <button 
             onClick={() => setShowFilters(!showFilters)}
             className={`px-6 h-[68px] rounded-full flex items-center justify-center gap-3 transition-all ${showFilters ? 'bg-[#222222] text-white' : 'bg-white border border-[#dddddd] text-[#222222] shadow-sm'}`}
           >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="text-sm font-bold">Filters</span>
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
            className="px-6 mb-12 max-w-7xl mx-auto overflow-hidden"
          >
            <div className="bg-white p-8 rounded-[2.5rem] border border-[#dddddd] shadow-xl grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <div className="flex justify-between items-center mb-6">
                     <span className="font-bold text-[#222222] text-sm">Max Price (per night)</span>
                     <span className="font-extrabold text-[#ff385c] text-lg">{formatPrice(maxPrice)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="2000" max="25000" step="500" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-[#dddddd] rounded-lg appearance-none cursor-pointer accent-[#ff385c]"
                  />
               </div>

               <div>
                  <div className="flex justify-between items-center mb-6">
                     <span className="font-bold text-[#222222] text-sm">Minimum Rating</span>
                     <span className="font-extrabold text-amber-500 text-lg">{minRating}+ Stars</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="5" step="0.5" 
                    value={minRating} 
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full h-2 bg-[#dddddd] rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotel Cards List */}
      <div className="px-6 max-w-7xl mx-auto">
        {filteredAndSortedHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {filteredAndSortedHotels.map((hotel) => (
               <HotelCard key={hotel._id} hotel={hotel} />
             ))}
          </div>
        ) : (
          <div className="py-24 text-center">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#dddddd]">
                <Hotel className="w-10 h-10 text-[#dddddd]" />
             </div>
             <h3 className="text-2xl font-black text-[#222222]">No Stays Found</h3>
             <p className="text-[#717171] font-medium mt-2">Try adjusting your filters to find more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
