import React from 'react';
import { motion } from 'framer-motion';
import { Hotel, Star, MapPin, ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hotels = () => {
  const navigate = useNavigate();
  
  const hotels = [
    {
      id: 1,
      name: "Mayfair Waves",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
      rating: 4.8,
      price: "₹8,500",
      city: "Puri"
    },
    {
      id: 2,
      name: "Trident Bhubaneswar",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
      rating: 4.9,
      price: "12,000",
      city: "Bhubaneswar"
    },
    {
      id: 3,
      name: "Lotus Resort",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",
      rating: 4.7,
      price: "₹6,000",
      city: "Konark"
    }
  ];

  return (
    <div className="bg-surface-50 min-h-screen pb-24 pt-6">
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-soft ring-1 ring-slate-100">
              <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
           </button>
           <h1 className="text-2xl font-bold text-slate-900">Hotels</h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {hotels.map((hotel) => (
          <motion.div 
            key={hotel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-soft ring-1 ring-slate-100 group"
          >
            <div className="h-56 relative w-full overflow-hidden">
               <img src={hotel.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={hotel.name} />
               <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1 border border-white/20 shadow-lg">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-white">{hotel.rating}</span>
               </div>
            </div>
            <div className="p-6">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{hotel.name}</h3>
                    <div className="flex items-center space-x-1 text-slate-400 text-xs">
                       <MapPin className="w-3.5 h-3.5 text-primary-500" />
                       <span className="font-medium">{hotel.city}, Odisha</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Nightly</p>
                    <p className="text-lg font-black text-primary-500">{hotel.price}</p>
                  </div>
               </div>
               <button className="w-full py-4 bg-primary-500 text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all">
                  Book Now
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
