import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Star, MapPin, ChevronRight, Search, Clock, SlidersHorizontal, CheckCircle2, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockRestaurants } from '../data/mockRestaurants';

const Restaurants = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const filteredRestaurants = mockRestaurants.filter(res => 
     res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     res.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#f7f7f7] pb-32">
      
      {/* Hero Header Region */}
      <section className="bg-white pt-24 pb-12 px-6 lg:px-8 border-b border-[#dddddd] relative">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff385c]/5 rounded-full blur-[120px] pointer-events-none" />
         <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <button 
                     onClick={() => navigate(-1)} 
                     className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#222222] border border-[#dddddd] hover:text-[#ff385c] transition-all shadow-sm"
                  >
                     <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#ff385c]">Gastronomy Hub</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-extrabold text-[#222222] tracking-tighter leading-none">
                  Local Flavors
               </h1>
            </div>
            
            {/* Search Bar */}
            <div className="w-full md:w-auto">
               <div className="relative group w-full md:w-96 shadow-sm">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#717171]" size={18} />
                  <input
                     type="text"
                     placeholder="Search dishes or restaurants..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-14 pr-6 py-4 border border-[#dddddd] rounded-full bg-white text-[#222222] font-semibold focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c] outline-none transition-all"
                  />
               </div>
            </div>
         </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-[#dddddd] rounded-[2rem] h-[450px] animate-pulse" />
            ))
         ) : filteredRestaurants.length > 0 ? (
            <AnimatePresence>
               {filteredRestaurants.map((res, i) => (
                  <motion.div 
                     layout
                     key={res.id}
                     initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="bg-white border border-[#ebebeb] rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-500 flex flex-col cursor-default"
                  >
                     {/* Banner wrapper */}
                     <div className="relative h-56 w-full overflow-hidden">
                        <img src={res.bannerUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={res.name} />
                        
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                           <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span className="font-black text-xs text-[#222222]">{res.rating}</span>
                           </div>
                           
                           <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${res.isOpen ? 'bg-[#ff385c] text-white' : 'bg-[#717171] text-white'}`}>
                              {res.isOpen ? 'Open Now' : 'Closed'}
                           </div>
                        </div>
                     </div>
                     
                     <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-xl font-extrabold text-[#222222] tracking-tight truncate group-hover:text-[#ff385c] transition-colors">
                              {res.name}
                           </h3>
                        </div>
                        
                        <div className="flex items-center text-[#717171] text-[10px] font-bold tracking-widest uppercase mb-4">
                           <MapPin className="w-3 h-3 mr-1 text-[#ff385c]" /> {res.distance} away
                        </div>

                        <p className="text-xs text-[#717171] font-medium mb-6 line-clamp-2 leading-relaxed">
                           {res.description}
                        </p>
                        
                        <div className="mt-auto pt-6 border-t border-[#f7f7f7] flex justify-between items-center">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-[#b0b0b0] uppercase tracking-widest mb-1">{res.category}</span>
                              <div className="flex items-center gap-1.5 text-[#222222] text-xs font-bold">
                                 <Clock className="w-3.5 h-3.5 text-[#ff385c]" />
                                 <span>{res.hours.split(',')[0]}</span>
                              </div>
                           </div>
                           <button 
                              onClick={() => navigate(`/restaurants/${res.id}`)}
                              className="w-10 h-10 bg-[#f7f7f7] text-[#222222] rounded-xl flex items-center justify-center hover:bg-[#ff385c] hover:text-white transition-all active:scale-95 group/btn"
                           >
                              <ChevronRight size={18} />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         ) : (
            <div className="col-span-full text-center py-24 bg-white rounded-[2rem] border border-[#dddddd] shadow-sm">
               <h3 className="text-2xl font-black text-[#222222] mb-2">No Restaurants Found</h3>
               <p className="text-[#717171] font-medium">Try searching for something else.</p>
            </div>
         )}
      </div>
    </div>
         ) : (
            <div className="col-span-full text-center py-32 bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-800 transition-colors">
               <h3 className="text-3xl font-black text-white italic font-serif mb-4 tracking-tight">No Kitchens Found</h3>
               <p className="max-w-xs mx-auto text-slate-500 font-medium">Try broadening your search logic.</p>
            </div>
         )}
      </div>
    </div>
  );
};

const ChevronLeft = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);

export default Restaurants;
