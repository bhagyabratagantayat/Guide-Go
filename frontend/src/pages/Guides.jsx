import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Languages, DollarSign, Calendar, 
  Star, MapPin, Compass, Search, 
  Activity, Navigation, ChevronRight, X,
  ShieldCheck, Award
} from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext.jsx';

// Premium Custom Icons for Leaflet
const GuideMarkerIcon = L.divIcon({
  html: `<div class="relative group cursor-pointer">
           <div class="absolute -inset-2 bg-secondary-500/20 rounded-full blur-sm group-hover:bg-secondary-500/40 transition-all duration-500 animate-pulse"></div>
           <div class="relative bg-secondary-500 p-2.5 rounded-full border-2 border-white shadow-xl transform group-hover:scale-110 transition-transform duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
           </div>
         </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const UserMarkerIcon = L.divIcon({
  html: `<div class="w-6 h-6 bg-primary-600 rounded-full border-4 border-white shadow-xl ring-4 ring-primary-500/20"></div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.2961, 85.8245]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const { darkMode } = useTheme();

  const fetchNearbyGuides = async (lat, lng) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/guides/nearby?lat=${lat}&lng=${lng}&distance=50000`);
      setGuides(data);
    } catch (error) {
      console.error('Error fetching nearby guides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setUserLocation([latitude, longitude]);
          fetchNearbyGuides(latitude, longitude);
        },
        (error) => {
          console.warn("Geolocation error. Fetching all available guides.");
          const fetchAllGuides = async () => {
            try {
              const { data } = await axios.get('/api/guides');
              setGuides(data);
            } catch (err) { console.error(err); }
            setLoading(false);
          };
          fetchAllGuides();
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen mt-[-64px] overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar Discovery List */}
      <div className="w-full lg:w-[480px] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar flex flex-col shadow-inner z-10 pt-16">
        <div className="p-10 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-10 border-b border-slate-100 dark:border-slate-800">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
             <div className="flex items-center space-x-3">
                < Award className="w-5 h-5 text-secondary-500" />
                <h2 className="text-[10px] font-black text-secondary-500 uppercase tracking-[0.3em]">Curated Experts Only</h2>
             </div>
             <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif">LOCAL GUIDES</h1>
            
            <div className="flex flex-wrap gap-4 pt-4">
              {userLocation ? (
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-[1.25rem] border border-green-100/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Scanning Nearby...</span>
                </div>
              ) : (
                 <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-[1.25rem] border border-slate-100">
                  <Compass className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Discovery</span>
                </div>
              )}
              <div className="flex items-center space-x-2 bg-secondary-50 px-4 py-2 rounded-[1.25rem] border border-secondary-100/50">
                 <ShieldCheck className="w-3 h-3 text-secondary-500" />
                 <span className="text-[10px] font-black text-secondary-700 uppercase tracking-widest">Verified Profiles</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 p-8 space-y-8">
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-slate-50 rounded-[3rem] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-8 pb-32">
               {guides.map((guide) => (
                <motion.div 
                  key={guide._id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="group bg-white dark:bg-slate-800/50 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 hover:border-secondary-500/20 dark:hover:border-secondary-500/30 transition-all duration-500 cursor-pointer shadow-premium dark:shadow-none relative overflow-hidden"
                >
                  <div className="flex items-start space-x-6 mb-8 relative z-10">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-[2rem] bg-secondary-50 dark:bg-slate-800/80 p-1.5 shadow-inner transition-colors">
                        <div className="w-full h-full rounded-[1.5rem] bg-white dark:bg-slate-900 flex items-center justify-center text-secondary-600 font-black text-3xl italic font-serif uppercase overflow-hidden border-2 border-white dark:border-slate-800 shadow-xl transition-colors">
                          {guide.userId?.profilePicture ? (
                            <img src={guide.userId.profilePicture} alt={guide.userId.name} className="w-full h-full object-cover" />
                          ) : (
                            guide.userId?.name?.charAt(0)
                          )}
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-slate-900 rounded-full p-1 shadow-2xl transition-colors">
                        <div className="w-full h-full bg-green-500 rounded-full animate-pulse ring-4 ring-green-500/20"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1 pt-2">
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter italic font-serif leading-none group-hover:text-secondary-600 transition-colors uppercase">
                        {guide.userId?.name || 'Local Expert'}
                      </h4>
                      <div className="flex flex-col mt-4 space-y-2">
                        <div className="flex items-center text-xs font-black text-yellow-500 uppercase tracking-[0.2em]">
                          <Star className="w-4 h-4 fill-yellow-500 mr-2" />
                          {guide.rating} <span className="text-slate-300 dark:text-slate-700 mx-2">/</span> <span className="text-slate-500 dark:text-slate-400">150+ Tours</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                           <Activity className="w-3.5 h-3.5 mr-2 text-secondary-500" /> Responds in 5 mins
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-[1.75rem] border border-slate-100 dark:border-slate-700 flex flex-col justify-center transition-colors">
                      <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center">
                         <Languages className="w-3 h-3 mr-2 text-secondary-500" /> Fluent In
                      </p>
                      <p className="text-xs font-black text-slate-700 dark:text-slate-300 truncate">{guide.languages.slice(0, 2).join(', ')}</p>
                    </div>
                    <div className="bg-slate-900 dark:bg-slate-950 p-4 rounded-[1.75rem] shadow-xl flex flex-col justify-center transition-colors">
                      <p className="text-[9px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest mb-1.5 flex items-center">
                         <DollarSign className="w-3 h-3 mr-2 text-secondary-500" /> Hourly rate
                      </p>
                      <p className="text-lg font-black text-white italic tracking-tighter leading-none">₹{guide.pricePerHour}</p>
                    </div>
                  </div>

                  <Link 
                    to={`/guides/${guide._id}`}
                    className="flex items-center justify-between w-full py-5 px-8 bg-secondary-500 text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-900 dark:hover:bg-primary-600 hover:text-white transition-all shadow-premium active:scale-95 group/link"
                  >
                    <span>Secure Booking</span>
                    <ChevronRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>

                  {/* Aesthetic Background Pulse */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary-500/5 rounded-full blur-[60px] group-hover:bg-secondary-500/10 transition-all duration-700" />
                </motion.div>
              ))}

              {guides.length === 0 && !loading && (
                <div className="text-center py-24 px-12 bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800 space-y-6 transition-colors">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 dark:text-slate-700">
                    <User className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter italic">No Experts Found</h3>
                    <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed">Try adjusting your exploration radius.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hero Map Layer */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={darkMode 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
          />
          {guides.map((guide) => (
            <Marker 
              key={guide._id} 
              position={[guide.location.coordinates[1], guide.location.coordinates[0]]}
              icon={GuideMarkerIcon}
            >
              <Popup className="premium-discovery-popup">
                <div className="p-8 min-w-[280px] bg-white dark:bg-slate-900 rounded-[3rem] shadow-premium transition-colors duration-300">
                  <div className="flex items-center space-x-4 mb-8 border-b border-slate-50 dark:border-slate-800 pb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-serif font-black text-3xl overflow-hidden border-2 border-white shadow-xl">
                       {guide.userId?.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : (guide.userId?.name?.charAt(0))}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 tracking-tighter text-xl italic font-serif leading-none uppercase">{guide.userId?.name || 'Local Guide'}</h4>
                      <div className="mt-2 flex items-center space-x-2">
                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                         <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Live Now</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400 italic">Expertise</span>
                        <span className="text-slate-800">{guide.languages.join(', ')}</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400 italic">Starting From</span>
                        <span className="text-secondary-600 text-lg tracking-tighter">₹{guide.pricePerHour}</span>
                     </div>
                  </div>
                  
                  <Link 
                    to={`/guides/${guide._id}`}
                    className="block w-full text-center bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary-500 transition-all shadow-xl active:scale-95"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
          {userLocation && <Marker position={userLocation} icon={UserMarkerIcon} />}
        </MapContainer>

        {/* Map Floating Controls */}
        <div className="absolute top-10 right-10 flex flex-col space-y-4">
           <button 
             onClick={() => userLocation && setMapCenter(userLocation)}
             className="w-16 h-16 bg-white dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-primary-600 hover:text-white text-slate-900 dark:text-slate-200 rounded-[1.75rem] flex items-center justify-center shadow-premium transition-all active:scale-95 group"
           >
              <Compass className="w-7 h-7 group-hover:rotate-45 transition-transform duration-500" />
           </button>
           <button 
             onClick={() => window.location.reload()}
             className="w-16 h-16 bg-white dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-primary-600 hover:text-white text-slate-900 dark:text-slate-200 rounded-[1.75rem] flex items-center justify-center shadow-premium transition-all active:scale-95"
           >
              <Activity className="w-7 h-7" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Guides;
