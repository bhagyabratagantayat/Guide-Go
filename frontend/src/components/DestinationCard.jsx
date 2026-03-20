import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, Home, Coffee, Utensils } from 'lucide-react';

const DestinationCard = ({ item, type = 'place', onClick }) => {
  const getIcon = () => {
    switch (type) {
      case 'hotel': return Home;
      case 'restaurant': return Utensils;
      default: return MapPin;
    }
  };

  const Icon = getIcon();

  // Normalize image
  const image = item.image || (item.images && item.images[0]) || `https://source.unsplash.com/featured/?${item.name},${type}`;
  
  // Normalize location
  const locationName = item.city || item.address || 'Odisha, IN';

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-premium dark:shadow-none border border-slate-50 dark:border-slate-800 group cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] md:h-56 overflow-hidden">
        <img 
          src={image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/20 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-full flex items-center space-x-1 border border-white/20">
          <Star className="w-2 h-2 md:w-3 md:h-3 fill-primary-500 text-primary-500" />
          <span className="text-[8px] md:text-[10px] font-black text-white">{item.rating || '4.5'}</span>
        </div>
        {item.category && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-primary-500 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-primary-400">
            <span className="text-[6px] md:text-[8px] font-black text-slate-950 uppercase tracking-widest">{item.category}</span>
          </div>
        )}
      </div>

      <div className="p-3 md:p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-1 text-primary-500 mb-1 md:mb-2">
            <Icon className="w-2 h-2 md:w-3 md:h-3" />
            <span className="text-[6px] md:text-[8px] font-black uppercase tracking-widest leading-none truncate max-w-[80px] md:max-w-none">{locationName}</span>
          </div>
          <h4 className="text-sm md:text-xl font-black text-slate-900 dark:text-white tracking-tight italic font-serif leading-tight mb-1 md:mb-2 uppercase truncate">
            {item.name}
          </h4>
          <p className="text-slate-400 dark:text-slate-500 text-[8px] md:text-[11px] font-medium line-clamp-2 leading-relaxed mb-2 md:mb-4">
            {item.description || 'Experience the magic of this unique location with a local guide.'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 md:pt-4 border-t border-slate-50 dark:border-slate-800">
          <div>
            {item.pricePerNight ? (
              <div className="flex flex-col">
                <p className="text-[6px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">From</p>
                <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white tracking-tighter italic font-serif">₹{item.pricePerNight}<span className="text-[8px] md:text-[10px] opacity-60">/n</span></p>
              </div>
            ) : (
              <p className="text-[6px] md:text-[8px] font-black text-primary-500 uppercase tracking-widest truncate">Recommended</p>
            )}
          </div>
          <button className="w-6 h-6 md:w-10 md:h-10 bg-slate-900 dark:bg-primary-500 rounded-lg md:rounded-full flex items-center justify-center text-white group-hover:bg-primary-500 dark:group-hover:bg-primary-400 transition-colors shadow-lg">
            <ArrowRight className="w-3 h-3 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
