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
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] mb-2">Verified Partners</h1>
          <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">Travel Agencies</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)]" size={18} />
            <input 
               type="text" 
               placeholder="Search agency by name or city..." 
               className="input-field pl-16 py-4"
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
                <div key={i} className="glass-card h-[400px] rounded-[3rem] animate-pulse bg-white/5" />
             ))
          ) : filteredAgencies.map((agency) => (
            <motion.div 
               key={agency.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="glass-card rounded-[3rem] overflow-hidden group hover:border-[var(--accent)]/30 transition-all p-8 flex flex-col items-center text-center space-y-6"
            >
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-[var(--bg-base)] shadow-2xl relative">
                 <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-cover" />
                 {agency.verified && (
                   <div className="absolute -bottom-1 -right-1 bg-[var(--accent)] p-1.5 rounded-lg border-2 border-[var(--bg-card)]">
                      <ShieldCheck size={12} className="text-white" />
                   </div>
                 )}
              </div>
              
              <div>
                <h3 className="text-2xl font-black italic font-serif text-white mb-2">{agency.name}</h3>
                <div className="flex items-center justify-center text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest gap-2">
                   <MapPin size={12} className="text-[var(--accent)]" /> {agency.location}
                </div>
              </div>

              <div className="flex items-center gap-4 py-2 border-y border-[var(--border)] w-full justify-center">
                 <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star size={14} className="fill-current" /> {agency.rating}
                 </div>
                 <div className="w-[1px] h-4 bg-[var(--border)]" />
                 <div className="text-[var(--text-secondary)] font-bold text-[10px] uppercase tracking-widest">
                    Started 2018
                 </div>
              </div>

              <button className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[var(--accent)] transition-all">
                CONTACT AGENCY <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Agencies;
