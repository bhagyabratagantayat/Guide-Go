import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Compass, Hotel as HotelIcon, Coffee, 
  HeartPulse, Bike, ArrowRight, Star,
  LayoutDashboard, Calendar, User, Sparkles, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import DestinationCard from '../components/DestinationCard';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesRes, hotelsRes, restRes] = await Promise.all([
          axios.get('/api/places').catch(() => ({ data: [] })),
          axios.get('/api/hotels').catch(() => ({ data: [] })), // Assuming this exists or returns empty
          axios.get('/api/restaurants').catch(() => ({ data: [] }))
        ]);
        setPlaces(placesRes.data.slice(0, 6));
        setHotels(hotelsRes.data.slice(0, 4));
        setRestaurants(restRes.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickActions = [
    { icon: MapPin, label: 'Find Guide', path: '/user/explore-map?filter=guides', color: 'bg-primary-500' },
    { icon: Compass, label: 'Explore Map', path: '/user/explore-map', color: 'bg-indigo-500' },
    { icon: HotelIcon, label: 'Hotels', path: '/user/explore-map?filter=hotels', color: 'bg-pink-500' },
    { icon: Coffee, label: 'Restaurants', path: '/user/explore-map?filter=restaurants', color: 'bg-orange-500' },
    { icon: HeartPulse, label: 'Emergency', path: '/emergency', color: 'bg-red-500' },
    { icon: Bike, label: 'Transport', path: '/user/explore-map?filter=transport', color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 pt-28 transition-colors duration-300">
      {/* Header / Greeting */}
      <div className="px-6 mb-8 flex items-center justify-between max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            {user?.role === 'user' ? 'Namaste, Explorer' : 'Namaste, Local Expert'}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none uppercase">
            {user ? user.name.split(' ')[0] : 'Traveler'}
          </h1>
        </motion.div>
        
        {user?.role === 'user' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-2xl border border-primary-100 dark:border-primary-900/30"
          >
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">Active Search</span>
          </motion.div>
        )}
      </div>

      {/* Hero Search */}
      <div className="px-6 mb-12 max-w-7xl mx-auto">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 w-6 h-6 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text"
            placeholder={user?.role === 'guide' ? "Find fellow guides..." : "Where to next?"}
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] py-7 pl-16 pr-8 shadow-premium dark:shadow-none font-bold text-xl placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-primary-500/30 transition-all text-slate-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-6 mb-16 max-w-7xl mx-auto">
        <h3 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em] mb-8 italic border-b border-slate-100 dark:border-slate-800 pb-2 inline-block">
          {user?.role === 'guide' ? 'Guide Tools' : 'Fast Launch'}
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8">
          {(user?.role === 'guide' ? [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/guide', color: 'bg-primary-500' },
            { icon: Calendar, label: 'Bookings', path: '/guide/bookings', color: 'bg-indigo-500' },
            { icon: Sparkles, label: 'Guide AI', path: '/guide/ai-chat', color: 'bg-pink-500' },
            { icon: User, label: 'Profile', path: '/guide/profile', color: 'bg-orange-500' },
            { icon: MapPin, label: 'Locals', path: '/guides', color: 'bg-blue-500' },
            { icon: Compass, label: 'Explore', path: '/user/explore-map', color: 'bg-slate-900' },
          ] : quickActions).map((action, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center space-y-4 group"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 ${action.color} rounded-3xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg active:shadow-inner transition-all relative overflow-hidden`}>
                 <action.icon className="w-6 h-6 md:w-8 md:h-8 relative z-10" />
                 <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[8px] md:text-[9px] font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest text-center leading-tight">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {user?.role !== 'guide' && (
        <div className="max-w-7xl mx-auto">
          {/* Main Booking Hero */}
          <div className="px-4 md:px-6 mb-20">
             <div className="bg-slate-900 dark:bg-primary-900/20 rounded-[2rem] md:rounded-[4rem] p-8 md:p-16 relative overflow-hidden group shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
                   <div className="space-y-4 md:space-y-6 max-w-xl">
                      <div className="space-y-2 md:space-y-3">
                         <div className="flex items-center space-x-2">
                           <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary-500 rounded-full animate-pulse" />
                           <p className="text-[8px] md:text-[10px] font-black text-primary-400 dark:text-primary-400 uppercase tracking-[0.4em]">Live in Odisha Now</p>
                         </div>
                         <h4 className="text-3xl md:text-6xl font-black text-white italic font-serif uppercase leading-tight tracking-tighter">Your Storyteller <br/> is Just a Tap Away</h4>
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 text-xs md:text-lg leading-relaxed">Instantly book a verified local expert to uncover the hidden gems of the city.</p>
                      <button 
                        onClick={() => navigate('/user/explore-map?filter=guides')}
                        className="bg-primary-500 text-slate-950 px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-sm hover:scale-105 hover:bg-white transition-all active:scale-95 flex items-center space-x-3 md:space-x-4 shadow-xl shadow-primary-500/20"
                      >
                        <Zap className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        <span>Book a Local Guide</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                   </div>
                   
                   <div className="hidden md:block w-72 h-72 lg:w-96 lg:h-96 relative">
                      <div className="absolute inset-0 bg-primary-500/10 rounded-full animate-pulse blur-3xl" />
                      <MapPlaceholder className="w-full h-full opacity-40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000" />
                   </div>
                </div>
             </div>
          </div>

          {/* Destinations Grid */}
          <div className="mb-20">
             <div className="px-6 mb-10 flex justify-between items-end">
                <div>
                   <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em] italic mb-2 leading-none">Top Destinations</h3>
                   <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none uppercase">Explore Havens</h4>
                </div>
                <button 
                   onClick={() => navigate('/user/explore-map?filter=places')}
                   className="text-[10px] font-black uppercase tracking-widest text-primary-500 border-b-2 border-primary-500 pb-1"
                >View All</button>
             </div>
             <div className="px-6 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                {places.length > 0 ? (
                  places.map((place) => (
                    <DestinationCard 
                      key={place._id} 
                      item={place} 
                      type="place"
                      onClick={() => navigate('/user/explore-map', { state: { place } })}
                    />
                  ))
                ) : (
                  [1,2,3,4].map(i => (
                    <div key={i} className="h-96 bg-slate-100 dark:bg-slate-900 rounded-[3rem] animate-pulse" />
                  ))
                )}
             </div>
          </div>

          {/* Hotels Section */}
          <div className="mb-20">
             <div className="px-6 mb-10">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em] italic mb-2 leading-none">Stays & Suites</h3>
                <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none uppercase">Premium Hotels</h4>
             </div>
             <div className="px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {hotels.map((hotel) => (
                  <DestinationCard 
                     key={hotel._id} 
                     item={hotel} 
                     type="hotel"
                     onClick={() => navigate('/user/explore-map?filter=hotels')}
                  />
                ))}
                {hotels.length === 0 && (
                   <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-[3rem] text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No premium stays found nearby</p>
                   </div>
                )}
             </div>
          </div>

          {/* Restaurants Section */}
          <div className="mb-24">
             <div className="px-6 mb-10">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em] italic mb-2 leading-none">Local Flavors</h3>
                <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none uppercase">Dine like a Local</h4>
             </div>
             <div className="px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {restaurants.map((rest) => (
                  <DestinationCard 
                     key={rest._id} 
                     item={rest} 
                     type="restaurant"
                     onClick={() => navigate('/user/explore-map?filter=restaurants')}
                  />
                ))}
                {restaurants.length === 0 && (
                   <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-[3rem] text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Discovering local kitchens...</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}

      {user?.role === 'guide' && (
        <div className="px-6 pb-12 max-w-7xl mx-auto">
          <div className="bg-primary-500 rounded-[3.5rem] p-10 md:p-16 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40" />
             <div className="relative z-10 space-y-8 max-w-2xl">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Your expertise is needed</p>
                  <h4 className="text-4xl md:text-5xl font-black text-slate-900 italic font-serif uppercase leading-none tracking-tighter">Ready to showcase <br/> your city?</h4>
                </div>
                <p className="text-slate-800/80 text-lg font-medium">Go Live to start receiving booking requests from eager travelers nearby.</p>
                <button 
                  onClick={() => navigate('/guide')}
                  className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-black/20"
                >
                  Enter Dashboard
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MapPlaceholder = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
    <path d="M100 60V140M60 100H140" stroke="currentColor" strokeWidth="2" />
    <circle cx="100" cy="100" r="20" fill="currentColor" />
    <motion.circle 
      cx="100" cy="60" r="8" fill="#f59e0b"
      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
    />
  </svg>
);

export default Home;
