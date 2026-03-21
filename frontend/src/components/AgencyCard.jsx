import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ShieldCheck, ChevronRight, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

const AgencyCard = ({ agency }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 flex flex-col"
    >
      {/* Banner */}
      <div className="relative h-56 rounded-t-[2.5rem] overflow-hidden">
        <img 
           src={agency.bannerUrl} 
           alt={agency.name} 
           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
        
        {/* Badges */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
           <div className="flex bg-slate-950/80 backdrop-blur-md items-center px-4 py-2 rounded-full border border-slate-700/50 text-white space-x-1.5 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-primary-500 text-primary-500" />
              <span className="font-black text-sm">{agency.rating}</span>
           </div>
           
           {agency.verified && (
             <div className="bg-primary-500 text-white p-2 rounded-full shadow-lg shadow-primary-500/30">
                <ShieldCheck className="w-5 h-5" />
             </div>
           )}
        </div>
      </div>
      
      {/* Logo overlay on image bottom (Moved outside overflow-hidden) */}
      <div className="relative w-full h-0 z-20">
         <div className="absolute -top-6 left-6 w-16 h-16 rounded-2xl border-4 border-slate-900 bg-white overflow-hidden shadow-xl">
            <img src={agency.logoUrl} className="w-full h-full object-cover" />
         </div>
      </div>

      {/* Content */}
      <div className="p-8 pt-10 flex-grow flex flex-col bg-slate-900">
         <h3 className="text-2xl font-black text-white italic font-serif leading-none tracking-tight mb-2 truncate group-hover:text-primary-400 transition-colors">
            {agency.name}
         </h3>
         <div className="flex items-center text-slate-500 text-[10px] uppercase font-black tracking-widest mb-5">
            <MapPin className="w-3.5 h-3.5 mr-1" /> {agency.location}
         </div>

         <p className="text-sm font-medium text-slate-400 line-clamp-2 leading-relaxed mb-6 flex-grow">
            {agency.description}
         </p>

         <div className="flex flex-wrap gap-2 mb-8">
            {agency.services.slice(0, 3).map((service, idx) => (
               <span key={idx} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-700/50">
                  {service}
               </span>
            ))}
            {agency.services.length > 3 && (
               <span className="bg-slate-800 text-primary-400 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary-500/20">
                  +{agency.services.length - 3} More
               </span>
            )}
         </div>

         <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <div>
               <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Starting From</p>
               <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-white">₹{agency.priceStarting}</span>
               </div>
            </div>
            
            <Link 
              to={`/agencies/${agency.id}`}
              className="w-12 h-12 bg-white text-slate-950 rounded-2xl flex items-center justify-center font-black uppercase text-[10px] tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-lg active:scale-95 group/btn"
            >
               <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
         </div>
      </div>
    </motion.div>
  );
};

export default AgencyCard;
