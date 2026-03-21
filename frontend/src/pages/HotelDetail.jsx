import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, MapPin, CheckCircle2, Wifi, Coffee, Car, Waves, Utensils } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { mockHotels } from '../data/mockHotels';

// Helper to render icons based on text
const getAmenityIcon = (text) => {
  const t = text.toLowerCase();
  if(t.includes('wifi')) return <Wifi className="w-5 h-5" />;
  if(t.includes('pool')) return <Waves className="w-5 h-5" />;
  if(t.includes('parking') || t.includes('valet')) return <Car className="w-5 h-5" />;
  if(t.includes('dining') || t.includes('restaurant') || t.includes('breakfast')) return <Utensils className="w-5 h-5" />;
  return <Coffee className="w-5 h-5" />;
};

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    // Replace with real API later. Using mock data for now.
    const found = mockHotels.find(h => h._id === id);
    if(found) setHotel(found);
  }, [id]);

  if (!hotel) {
     return (
       <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
       </div>
     );
  }

  const handleBookNow = () => {
    toast.success('Successfully booked! Redirecting...', {
       style: { borderRadius: '1rem', background: '#333', color: '#fff' }
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
      <Toaster position="top-center" />
      
      {/* Hero Image Gallery */}
      <div className="relative h-[50vh] min-h-[400px] md:h-[65vh] w-full overflow-hidden">
         <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-50 dark:to-slate-950" />
         
         <button 
           onClick={() => navigate(-1)} 
           className="absolute top-6 left-6 md:top-10 md:left-10 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all z-10"
         >
            <ChevronLeft className="w-6 h-6" />
         </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 -mt-20 md:-mt-32 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column (Info) */}
         <div className="lg:col-span-2 space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
               className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-premium dark:shadow-none border border-white/50 dark:border-slate-800"
            >
               <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="bg-orange-100 dark:bg-orange-500/20 px-4 py-1.5 rounded-full flex items-center space-x-2">
                     <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                     <span className="text-sm font-black text-orange-700 dark:text-orange-400">{hotel.rating}</span>
                     <span className="text-xs text-orange-600/70 dark:text-orange-400/70">({hotel.reviewsCount} reviews)</span>
                  </div>
                  <div className="bg-primary-100 dark:bg-primary-500/20 px-4 py-1.5 rounded-full flex items-center space-x-2 text-primary-700 dark:text-primary-400 text-sm font-bold">
                     <MapPin className="w-4 h-4" />
                     <span>{hotel.city}</span>
                  </div>
               </div>
               
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-6">
                 {hotel.name}
               </h1>
               
               <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
                  {hotel.longDescription}
               </p>
            </motion.div>

            {/* Amenities Section */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
               className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 dark:border-slate-800"
            >
               <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wide">Premium Amenities</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {hotel.amenities.map((amenity, i) => (
                     <div key={i} className="flex items-center space-x-4 text-slate-700 dark:text-slate-300">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-500">
                           {getAmenityIcon(amenity)}
                        </div>
                        <span className="font-bold">{amenity}</span>
                     </div>
                  ))}
               </div>
            </motion.div>

            {/* Room Packages */}
            <div className="space-y-6">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wide px-2">Select Your Room</h3>
               {hotel.roomTypes.map((room, i) => (
                  <motion.div 
                     key={room.id}
                     initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                     className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-md border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                     <div className="space-y-4 flex-grow">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase">{room.name}</h4>
                        <div className="flex flex-wrap gap-3">
                           {room.features.map((f, j) => (
                              <div key={j} className="flex items-center space-x-1.5 text-sm font-bold text-slate-500">
                                 <CheckCircle2 className="w-4 h-4 text-green-500" />
                                 <span>{f}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="text-left md:text-right shrink-0 w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-6 md:pt-0">
                        <div className="mb-0 md:mb-4">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Per Night</p>
                           <p className="text-2xl font-black text-primary-500">₹{room.price.toLocaleString()}</p>
                        </div>
                        <button onClick={handleBookNow} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-wide hover:bg-primary-500 hover:text-slate-900 transition-colors">
                           Select
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Right Column (Sticky Booking Widget & Map preview) */}
         <div className="lg:col-span-1 space-y-8">
            <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
               className="bg-primary-500 p-8 rounded-[2.5rem] text-slate-900 shadow-xl shadow-primary-500/20 sticky top-24"
            >
               <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-2 opacity-80">Starting at</h3>
               <p className="text-5xl font-black tracking-tighter mb-8">₹{hotel.pricePerNight.toLocaleString()}</p>
               
               <div className="space-y-4 mb-8">
                  <div className="bg-white/20 p-4 rounded-2xl flex justify-between items-center backdrop-blur-sm">
                     <span className="font-bold">Check-in</span>
                     <span className="font-black">Select Date</span>
                  </div>
                  <div className="bg-white/20 p-4 rounded-2xl flex justify-between items-center backdrop-blur-sm">
                     <span className="font-bold">Check-out</span>
                     <span className="font-black">Select Date</span>
                  </div>
               </div>

               <button onClick={handleBookNow} className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black uppercase tracking-widest text-sm hover:bg-slate-800 active:scale-95 transition-all">
                  Book Now
               </button>
               <p className="text-center text-xs font-bold mt-4 opacity-70">You won't be charged yet</p>
            </motion.div>

            {/* Map Preview Mock */}
            <div className="bg-slate-200 dark:bg-slate-800 h-64 rounded-[2.5rem] overflow-hidden relative group cursor-pointer border border-slate-300 dark:border-slate-700">
               <img src="https://static.mapzen.com/images/peel-and-stick/peel-and-stick-2x.png" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Map Preview" />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 text-center">
                     <MapPin className="w-6 h-6 text-primary-500 mx-auto mb-1" />
                     <p className="text-xs font-black uppercase">{hotel.city}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HotelDetail;
