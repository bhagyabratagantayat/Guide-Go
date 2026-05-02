import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext.jsx';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-[#ebebeb] group flex flex-col hover:shadow-xl transition-all duration-500"
    >
      {/* Image Banner */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
         <img 
           src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80'} 
           className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
           alt={hotel.name} 
         />
         
         {/* Top Actions */}
         <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg border border-white/20">
               <Star className="w-3.5 h-3.5 text-[#ff385c] fill-[#ff385c]" />
               <span className="text-sm font-black text-[#222222]">{hotel.rating}</span>
               <span className="text-[10px] font-bold text-[#717171]">({hotel.reviewsCount})</span>
            </div>
            
            <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#222222] shadow-lg border border-white/20 hover:scale-110 transition-all">
               <Star className="w-5 h-5 opacity-40" />
            </button>
         </div>

         {/* Bottom Overlay Info */}
         <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
            {hotel.distanceFromUser && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#222222]/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-3">
                 <MapPin size={10} className="text-[#ff385c]" />
                 {hotel.distanceFromUser} km away
              </div>
            )}
         </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
         <div className="flex justify-between items-start mb-4">
            <div>
               <h3 className="text-2xl font-extrabold text-[#222222] tracking-tight mb-1">
                 {hotel.name}
               </h3>
               <div className="flex items-center gap-2 text-[#717171]">
                  <MapPin size={14} className="text-[#ff385c]" />
                  <span className="text-xs font-bold uppercase tracking-widest">{hotel.city}</span>
               </div>
            </div>
         </div>
         
         <p className="text-[#717171] text-sm font-medium leading-relaxed mb-8 line-clamp-2">
           {hotel.shortDescription}
         </p>

         <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-[#b0b0b0] uppercase tracking-[0.2em] mb-1">From</span>
               <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#222222]">{formatPrice(hotel.pricePerNight)}</span>
                  <span className="text-xs font-bold text-[#717171] italic">/night</span>
               </div>
            </div>

            <button 
              onClick={() => navigate(`/hotels/${hotel._id}`)}
              className="px-6 py-3.5 bg-[#ff385c] text-white rounded-xl font-bold text-[13px] shadow-lg shadow-[#ff385c]/20 hover:bg-[#e31c5f] transition-all active:scale-95"
            >
               Reserve
            </button>
         </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
