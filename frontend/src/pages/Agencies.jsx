import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, ShieldCheck, MapPin, Building2, Ticket, ArrowRight } from 'lucide-react';
import AgencyCard from '../components/AgencyCard';
import { mockAgencies } from '../data/mockAgencies';

const Agencies = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); 

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredAgencies = useMemo(() => {
    return mockAgencies.filter(agency => {
      const textMatch = agency.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        agency.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      let filterMatch = true;
      if (activeFilter === 'verified') filterMatch = agency.verified;
      if (activeFilter === 'budget') filterMatch = agency.priceStarting < 1500;
      if (activeFilter === 'luxury') filterMatch = agency.priceStarting >= 4000;

      return textMatch && filterMatch;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-12 bg-[#f7f7f7] min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div>
          <h1 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#ff385c] mb-1">Verified Partners</h1>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#222222] tracking-tight">Travel Agencies</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1 shadow-sm">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#717171]" size={18} />
            <input 
               type="text" 
               placeholder="Search agency by name or city..." 
               className="w-full pl-14 pr-6 py-4 border border-[#dddddd] rounded-full bg-white text-[#222222] font-semibold focus:ring-2 focus:ring-[#ff385c]/10 focus:border-[#ff385c] outline-none transition-all"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="wait">
          {loading ? (
             [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-[#dddddd] h-[400px] rounded-[2rem] animate-pulse" />
             ))
          ) : filteredAgencies.map((agency) => (
            <motion.div 
               key={agency.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white border border-[#ebebeb] rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-500 p-8 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-[#f7f7f7] shadow-xl relative mb-6">
                 <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-cover" />
                 {agency.verified && (
                   <div className="absolute -bottom-1 -right-1 bg-[#ff385c] p-1.5 rounded-lg border-2 border-white">
                      <ShieldCheck size={12} className="text-white" />
                   </div>
                 )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-[#222222] tracking-tight mb-2">{agency.name}</h3>
                <div className="flex items-center justify-center text-[10px] font-bold text-[#717171] uppercase tracking-[0.2em] gap-2">
                   <MapPin size={12} className="text-[#ff385c]" /> {agency.location}
                </div>
              </div>

              <div className="flex items-center gap-4 py-3 border-y border-[#f7f7f7] w-full justify-center mb-8">
                 <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                    <Star size={16} className="fill-current" /> {agency.rating}
                 </div>
                 <div className="w-[1px] h-4 bg-[#dddddd]" />
                 <div className="text-[#717171] font-bold text-[10px] uppercase tracking-widest">
                    Est. 2018
                 </div>
              </div>

              <button className="w-full py-4 bg-[#f7f7f7] border border-[#dddddd] rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#222222] hover:bg-[#ff385c] hover:text-white hover:border-[#ff385c] transition-all active:scale-95">
                Contact Agency <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Agencies;
