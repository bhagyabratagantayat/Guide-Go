import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Star, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Restaurants = () => {
  const navigate = useNavigate();
  
  const restaurants = [
    {
      id: 1,
      name: "Tripti Restaurant",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
      rating: 4.6,
      distance: "0.8 km",
      cuisine: "Traditional Odia"
    },
    {
      id: 2,
      name: "Wildgrass Restaurant",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80",
      rating: 4.7,
      distance: "1.2 km",
      cuisine: "Continental & Seafood"
    },
    {
      id: 3,
      name: "Dalma",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80",
      rating: 4.5,
      distance: "2.5 km",
      cuisine: "Odia Cuisine"
    }
  ];

  return (
    <div className="bg-surface-50 min-h-screen pb-24 pt-6">
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-soft ring-1 ring-slate-100">
              <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
           </button>
           <h1 className="text-2xl font-bold text-slate-900">Restaurants</h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {restaurants.map((res) => (
          <motion.div 
            key={res.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-soft ring-1 ring-slate-100 group"
          >
            <div className="h-48 relative w-full overflow-hidden">
               <img src={res.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={res.name} />
               <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 flex items-center space-x-1 shadow-sm uppercase tracking-widest">
                     <Utensils className="w-3 h-3 text-orange-500" />
                     <span>{res.cuisine}</span>
                  </div>
               </div>
            </div>
            <div className="p-6 flex justify-between items-center">
               <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{res.name}</h3>
                  <div className="flex items-center space-x-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                     <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span>{res.rating}</span>
                     </div>
                     <span className="text-slate-200">|</span>
                     <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-primary-500" />
                        <span>{res.distance}</span>
                     </div>
                  </div>
               </div>
               <button className="w-12 h-12 bg-surface-50 rounded-2xl flex items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-all shadow-soft group-hover:ring-2 group-hover:ring-primary-100">
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;
