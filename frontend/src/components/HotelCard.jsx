import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-premium dark:shadow-none border border-white/50 dark:border-slate-800/50 group flex flex-col hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Banner */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
         <img 
           src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80'} 
           className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
           alt={hotel.name} 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
         
         {/* Rating & Distance Badges */}
         <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center space-x-2 border border-white/20 shadow-lg">
               <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
               <span className="text-sm font-black text-slate-900 dark:text-white">{hotel.rating}</span>
               <span className="text-xs font-bold text-slate-400">({hotel.reviewsCount})</span>
            </div>
            
            {hotel.distanceFromUser && (
              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-white flex items-center shadow-lg">
                 <MapPin className="w-3 h-3 mr-1" />
                 {hotel.distanceFromUser} km
              </div>
            )}
         </div>

         {/* Title area over image bottom */}
         <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
              {hotel.name}
            </h3>
            <div className="flex items-center space-x-2 text-slate-200 mt-1">
               <MapPin className="w-4 h-4 text-white" />
               <span className="text-sm font-bold uppercase tracking-widest">{hotel.city}, Odisha</span>
            </div>
         </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
         
         <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed mb-6 line-clamp-2 flex-grow">
           {hotel.shortDescription}
         </p>

         <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
            <div className="w-full md:w-auto text-left">
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Price per night</p>
               <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                 ₹{hotel.pricePerNight.toLocaleString()}
               </p>
            </div>

            <button 
              onClick={() => navigate(`/hotels/${hotel._id}`)}
              className="w-full md:w-auto px-8 py-4 bg-primary-500 text-slate-950 rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-xl shadow-primary-500/20 hover:bg-slate-900 hover:text-white hover:shadow-slate-900/20 transition-all active:scale-[0.98]"
            >
               View Details
            </button>
         </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
