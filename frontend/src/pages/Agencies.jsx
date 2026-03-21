import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, ShieldCheck, MapPin, Building2, Ticket } from 'lucide-react';
import AgencyCard from '../components/AgencyCard';
import { mockAgencies } from '../data/mockAgencies';

const SkeletonCard = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden animate-pulse flex flex-col h-[480px]">
    <div className="h-56 bg-slate-800" />
    <div className="flex-grow p-8 pt-10 flex flex-col space-y-4">
      <div className="h-8 bg-slate-800 rounded-xl w-3/4" />
      <div className="h-4 bg-slate-800 rounded-md w-1/2" />
      <div className="h-16 bg-slate-800 rounded-xl w-full mt-4" />
      <div className="flex gap-2 mt-4">
        <div className="h-6 bg-slate-800 rounded-md w-16" />
        <div className="h-6 bg-slate-800 rounded-md w-24" />
      </div>
      <div className="mt-auto flex justify-between pt-6 border-t border-slate-800">
        <div className="h-8 bg-slate-800 rounded-lg w-24" />
        <div className="w-12 h-12 bg-slate-800 rounded-2xl" />
      </div>
    </div>
  </div>
);

const Agencies = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, verified, luxury, budget

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredAgencies = useMemo(() => {
    return mockAgencies.filter(agency => {
      // Search
      const textMatch = agency.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        agency.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter Logic
      let filterMatch = true;
      if (activeFilter === 'verified') filterMatch = agency.verified;
      if (activeFilter === 'budget') filterMatch = agency.priceStarting < 1500;
      if (activeFilter === 'luxury') filterMatch = agency.priceStarting >= 4000;

      return textMatch && filterMatch;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-slate-950 pb-32 transition-colors duration-300">
      
      {/* Hero Header Region */}
      <section className="bg-slate-900 pt-32 pb-16 px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
         
         <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-6">
               <div className="w-20 h-20 bg-primary-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-premium rotate-3">
                  <Building2 className="w-10 h-10" />
               </div>
               <div>
                  <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic font-serif leading-[0.9] mb-4">
                     Trusted Travel Agencies
                  </h1>
                  <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Verified partners for your ultimate journey</p>
               </div>
            </div>
            
            {/* Search & Utility Bar */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
               <div className="relative group w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                     <Search className="h-5 w-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                     type="text"
                     placeholder="Search agencies or cities..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="block w-full pl-12 pr-6 py-5 border-2 border-slate-800 rounded-[2rem] leading-5 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-black tracking-tight"
                  />
               </div>
               <button className="h-[64px] px-8 bg-slate-800 text-white rounded-[2rem] flex items-center justify-center hover:bg-slate-700 transition-all font-black text-[10px] uppercase tracking-widest border border-slate-700 shadow-xl">
                  <SlidersHorizontal className="w-5 h-5 mr-3 text-primary-400" />
                  Filters
               </button>
            </div>
         </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* Sidebar Navigation/Filters */}
         <div className="lg:col-span-3 space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-xl sticky top-24">
               <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Popular Categories</h3>
               <div className="space-y-3">
                  {[
                    { id: 'all', label: 'All Agencies', icon: Building2 },
                    { id: 'verified', label: 'Verified Partners', icon: ShieldCheck },
                    { id: 'luxury', label: 'Luxury VIP', icon: Star },
                    { id: 'budget', label: 'Budget Pick', icon: Ticket }
                  ].map(filter => (
                     <button
                       key={filter.id}
                       onClick={() => setActiveFilter(filter.id)}
                       className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                         activeFilter === filter.id 
                           ? 'bg-primary-500/10 border-primary-500/50 text-white' 
                           : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                       }`}
                     >
                       <div className="flex items-center space-x-3">
                          <filter.icon className={`w-5 h-5 ${activeFilter === filter.id ? 'text-primary-500' : 'text-slate-500'}`} />
                          <span className="font-bold text-sm">{filter.label}</span>
                       </div>
                       {activeFilter === filter.id && <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Agency Grid */}
         <div className="lg:col-span-9">
            {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
               </div>
            ) : filteredAgencies.length > 0 ? (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="grid grid-cols-1 md:grid-cols-2 gap-8"
               >
                  <AnimatePresence>
                     {filteredAgencies.map((agency, index) => (
                        <motion.div 
                           key={agency.id}
                           layout
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.9 }}
                           transition={{ delay: index * 0.05 }}
                        >
                           <AgencyCard agency={agency} />
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </motion.div>
            ) : (
               <div className="text-center py-32 bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-800 transition-colors">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                     <Search className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white italic font-serif mb-4 tracking-tight">No Agencies Found</h3>
                  <p className="max-w-xs mx-auto text-slate-500 font-medium">We couldn't find any agencies matching your specific filter criteria.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                    className="mt-8 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                  >
                     Clear All Filters
                  </button>
               </div>
            )}
         </div>

      </div>
    </div>
  );
};

export default Agencies;
