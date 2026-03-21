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
    <div className="bg-slate-950 min-h-screen pb-32 transition-colors duration-300 font-sans text-white">
      
      {/* Hero Header Region */}
      <section className="bg-slate-900 pt-32 pb-16 px-6 lg:px-8 border-b border-slate-800 relative xl:px-12 overflow-hidden">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] opacity-70 pointer-events-none" />
         <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-6">
               <button 
                  onClick={() => navigate(-1)} 
                  className="w-12 h-12 bg-slate-800/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all shadow-xl hover:-translate-x-1"
               >
                  <ChevronLeft className="w-6 h-6" />
               </button>
               <div className="w-20 h-20 bg-orange-500 rounded-[2.5rem] flex items-center justify-center text-slate-950 shadow-[0_10px_30px_rgba(249,115,22,0.3)] rotate-3">
                  <Utensils className="w-10 h-10" />
               </div>
               <div>
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic font-serif leading-[0.9] mb-4">
                     Gastronomy Hub
                  </h1>
                  <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Premium Dining & Local Flavors</p>
               </div>
            </div>
            
            {/* Search Bar */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
               <div className="relative group w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                     <Search className="h-5 w-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                     type="text"
                     placeholder="Search dishes, names..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="block w-full pl-12 pr-6 py-5 border-2 border-slate-800 rounded-[2rem] leading-5 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-black tracking-tight"
                  />
               </div>
            </div>
         </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] h-[450px] animate-pulse">
                <div className="h-56 bg-slate-800 rounded-t-[2.5rem]" />
              </div>
            ))
         ) : filteredRestaurants.length > 0 ? (
            <AnimatePresence>
               {filteredRestaurants.map((res, i) => (
                  <motion.div 
                     layout
                     key={res.id}
                     initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.05 }}
                     className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col cursor-pointer cursor-default"
                  >
                     {/* Banner wrapper */}
                     <div className="relative h-60 w-full overflow-hidden rounded-t-[2.5rem] z-0">
                        <img src={res.bannerUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={res.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                        
                        <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                           <div className="flex bg-slate-950/80 backdrop-blur-md items-center px-4 py-2 rounded-full border border-slate-700/50 text-white space-x-1.5 shadow-lg">
                              <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                              <span className="font-black text-sm">{res.rating}</span>
                           </div>
                           
                           <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${res.isOpen ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'}`}>
                              {res.isOpen ? 'Open Now' : 'Closed'}
                           </div>
                        </div>
                        
                        <div className="absolute bottom-5 left-5">
                           <span className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none shadow-lg">
                              {res.priceLevel} Pricing
                           </span>
                        </div>
                     </div>
                     
                     <div className="p-8 flex flex-col flex-grow relative z-10 bg-slate-900">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-2xl font-black text-white italic font-serif leading-tight tracking-tight mb-2 truncate group-hover:text-orange-400 transition-colors">
                              {res.name}
                           </h3>
                           <div className="flex items-center text-slate-400 text-[10px] font-black tracking-widest uppercase ml-2 mt-1">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-orange-500" /> {res.distance}
                           </div>
                        </div>
                        
                        <p className="text-sm text-slate-400 font-medium mb-6 line-clamp-2 leading-relaxed flex-grow">
                           {res.description}
                        </p>
                        
                        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">
                           <Utensils className="w-3.5 h-3.5 text-slate-400" />
                           <span>{res.category}</span>
                        </div>
                        
                        <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                           <div className="flex items-center space-x-2 text-slate-400 text-[9px] uppercase font-black tracking-widest">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{res.hours.split(',')[0]}</span>
                           </div>
                           <button 
                              onClick={() => navigate(`/restaurants/${res.id}`)}
                              className="w-12 h-12 bg-white text-slate-950 rounded-2xl flex items-center justify-center shadow-lg hover:bg-orange-500 hover:text-white transition-all active:scale-95 group/btn"
                           >
                              <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
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
