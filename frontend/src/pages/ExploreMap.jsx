import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { 
  MapPin, User, Star, Volume2, Info, Compass, 
  Languages, DollarSign, X, Activity, Play, 
  Pause, Square, Navigation, Camera
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import useAudioGuide from '../hooks/useAudioGuide';
import useGuideTracking from '../hooks/useGuideTracking';

// Leaflet Icon Fix - Premium Custom Icons
const PlaceIcon = L.divIcon({
  html: `<div class="relative group cursor-pointer">
           <div class="absolute -inset-2 bg-primary-500/20 rounded-full blur-sm group-hover:bg-primary-500/40 transition-all duration-500 animate-pulse"></div>
           <div class="relative bg-primary-600 p-2.5 rounded-full border-2 border-white shadow-xl transform group-hover:scale-110 transition-transform duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
           </div>
         </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const GuideIcon = L.divIcon({
  html: `<div class="relative group cursor-pointer">
           <div class="absolute -inset-2 bg-secondary-500/20 rounded-full blur-sm group-hover:bg-secondary-500/40 transition-all duration-500"></div>
           <div class="relative bg-secondary-500 p-2.5 rounded-full border-2 border-white shadow-xl transform group-hover:scale-110 transition-transform duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
           </div>
         </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const UserIcon = L.divIcon({
  html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-xl ring-4 ring-blue-500/20 animate-pulse"></div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const ExploreMap = () => {
  const [places, setPlaces] = useState([]);
  const [guides, setGuides] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.2961, 85.8245]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isPlaying, speak, stop, pause, resume } = useAudioGuide();
  const [nearestPlace, setNearestPlace] = useState(null);
  const [autoSuggested, setAutoSuggested] = useState(new Set());
  const { user } = useAuth();
  const { liveGuides } = useGuideTracking(user);

  const fetchData = async (lat, lng) => {
    try {
      const [placesRes, guidesRes] = await Promise.all([
        axios.get(`/api/places/nearby?lat=${lat}&lng=${lng}`),
        axios.get(`/api/guides/nearby?lat=${lat}&lng=${lng}&distance=10000`)
      ]);
      setPlaces(placesRes.data);
      setGuides(guidesRes.data);
    } catch (error) {
      console.error('Error fetching discovery data:', error);
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
          fetchData(latitude, longitude);
        },
        () => {
          console.warn('Location permission denied. Using default.');
          fetchData(20.2961, 85.8245);
        }
      );
    } else {
      fetchData(20.2961, 85.8245);
    }
    return () => stop();
  }, []);

  useEffect(() => {
    if (userLocation && places.length > 0) {
      const R = 6371000;
      const deg2rad = (deg) => deg * (Math.PI / 180);
      let closest = null;
      let minDistance = 101;

      places.forEach(place => {
        const dLat = deg2rad(place.latitude - userLocation[0]);
        const dLon = deg2rad(place.longitude - userLocation[1]);
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(userLocation[0])) * Math.cos(deg2rad(place.latitude)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        if (distance < minDistance) {
          minDistance = distance;
          closest = place;
        }
      });

      if (closest && !autoSuggested.has(closest._id)) {
        setNearestPlace(closest);
      } else {
        setNearestPlace(null);
      }
    }
  }, [userLocation, places, autoSuggested]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-100 mt-[-64px]">
      {/* Map Content */}
      <MapContainer 
        center={mapCenter} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {places.map((place) => (
          <Marker key={place._id} position={[place.latitude, place.longitude]} icon={PlaceIcon}>
            <Popup className="premium-discovery-popup">
              <div className="p-0 min-w-[280px] bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="h-40 relative group overflow-hidden">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                     <div className="flex items-center space-x-2 mb-1">
                        <Camera className="w-3 h-3 text-primary-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Heritage Site</span>
                     </div>
                     <h4 className="font-black text-white text-xl tracking-tighter italic font-serif">{place.name}</h4>
                  </div>
                  <button 
                    onClick={() => speak(place.audioGuideText || place.description)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary-500 transition-all shadow-xl"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                    {place.description}
                  </p>
                  <div className="flex items-center space-x-2">
                     <button 
                       onClick={() => speak(place.audioGuideText || place.description)}
                       className="flex-1 bg-primary-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-primary-700 shadow-lg shadow-primary-500/20 flex items-center justify-center"
                     >
                        <Play className="w-3.5 h-3.5 mr-2" /> Start Audio Guide
                     </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {guides.map((guide) => {
          const livePos = liveGuides[guide._id] || liveGuides[guide.userId?._id];
          const position = livePos || [guide.location.coordinates[1], guide.location.coordinates[0]];
          
          return (
            <Marker key={guide._id} position={position} icon={GuideIcon}>
              <Popup className="premium-discovery-popup">
                <div className="p-6 min-w-[240px] bg-white rounded-3xl shadow-2xl">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative">
                       <div className="w-16 h-16 rounded-2xl bg-secondary-100 flex items-center justify-center text-secondary-600 font-serif font-black text-3xl overflow-hidden shadow-inner border-2 border-white">
                         {guide.userId?.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : (guide.userId?.name?.charAt(0))}
                       </div>
                       {livePos && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 tracking-tighter text-lg">{guide.userId?.name || 'Local Guide'}</h4>
                      <div className="flex items-center text-[10px] font-black text-yellow-500 uppercase tracking-widest">
                        <Star className="w-3 h-3 fill-yellow-500 mr-1" /> {guide.rating} • 150+ Tours
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-xs">
                       <span className="text-slate-400 font-bold uppercase tracking-widest flex items-center">
                          <Languages className="w-3 h-3 mr-2 text-secondary-500" /> Languages
                       </span>
                       <span className="text-slate-800 font-black tracking-tight">{guide.languages.slice(0, 2).join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                       <span className="text-slate-400 font-bold uppercase tracking-widest flex items-center">
                          <DollarSign className="w-3 h-3 mr-2 text-secondary-500" /> Hourly Rate
                       </span>
                       <span className="text-secondary-600 font-black tracking-tighter">₹{guide.pricePerHour}</span>
                    </div>
                  </div>
                  
                  <Link to={`/guides/${guide._id}`} className="block w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase text-center hover:bg-secondary-500 transition-all shadow-xl shadow-slate-900/10">
                    Secure Booking
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {userLocation && <Marker position={userLocation} icon={UserIcon} />}
      </MapContainer>

      {/* Floating UI Layers */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-24 right-8 z-[1000] glass-card p-6 rounded-[2.5rem] shadow-2xl flex items-center space-x-6 border-2 border-primary-500/20"
          >
            <div className="relative">
               <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-600">
                  <Activity className="w-6 h-6 animate-pulse" />
               </div>
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.25em] mb-1">Now Narrating</p>
              <p className="text-sm font-black text-slate-800 tracking-tight italic">Exploring Heritage Site...</p>
            </div>
            <div className="flex items-center space-x-2 pl-4 border-l border-slate-100">
               <button onClick={pause} className="p-3 bg-slate-50 text-slate-800 rounded-xl hover:bg-slate-100 transition-colors">
                  <Pause className="w-4 h-4" />
               </button>
               <button onClick={stop} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                  <Square className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovery Overlay */}
      <div className="absolute bottom-10 left-10 z-[1000] max-w-sm space-y-6">
        <AnimatePresence>
          {nearestPlace && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="glass-card p-8 rounded-[3rem] shadow-2xl border-4 border-primary-500/30 overflow-hidden relative"
            >
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-[9px] font-black uppercase tracking-widest">Nearby Magic</div>
                    <button onClick={() => setNearestPlace(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                       <X className="w-4 h-4" />
                    </button>
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic font-serif leading-tight">{nearestPlace.name}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest flex items-center">
                       <Navigation className="w-3 h-3 mr-2 text-primary-500" /> Within 100 meters
                    </p>
                 </div>
                 <div className="flex space-x-3 pt-2">
                   <button 
                     onClick={() => {
                       speak(nearestPlace.audioGuideText || nearestPlace.description);
                       setAutoSuggested(prev => new Set(prev).add(nearestPlace._id));
                       setNearestPlace(null);
                     }}
                     className="flex-1 btn-primary py-4 text-[10px]"
                   >
                     Listen to Story
                   </button>
                   <button 
                     onClick={() => {
                        setAutoSuggested(prev => new Set(prev).add(nearestPlace._id));
                        setNearestPlace(null);
                     }}
                     className="px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors"
                   >
                     Later
                   </button>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-[60px]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend Layer */}
        <div className="glass-card px-8 py-5 rounded-[2rem] flex items-center space-x-8 shadow-xl border border-white/40">
           <div className="flex items-center space-x-3 group">
              <div className="w-3 h-3 bg-primary-600 rounded-full ring-4 ring-primary-500/20 shadow-lg group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">Infospots</span>
           </div>
           <div className="w-px h-4 bg-slate-200" />
           <div className="flex items-center space-x-3 group">
              <div className="w-3 h-3 bg-secondary-500 rounded-full ring-4 ring-secondary-500/20 shadow-lg group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">Expert Guides</span>
           </div>
        </div>
      </div>

      {/* Map Actions Overlay */}
      <div className="absolute bottom-10 right-10 z-[1000] flex flex-col items-end space-y-6">
        {loading && (
          <div className="glass-card px-6 py-4 rounded-2xl flex items-center space-x-4 animate-pulse border-none shadow-2xl">
            <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Scanning India...</span>
          </div>
        )}
        <div className="flex flex-col space-y-3">
           <button 
             onClick={() => userLocation && setMapCenter(userLocation)}
             className="w-16 h-16 bg-white hover:bg-primary-500 hover:text-white text-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all active:scale-95 group relative"
           >
             <Compass className="w-7 h-7 group-hover:rotate-45 transition-transform duration-500" />
             <div className="absolute right-20 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">Recenter</div>
           </button>
           <button 
             onClick={() => window.location.reload()}
             className="w-16 h-16 bg-white hover:bg-secondary-500 hover:text-white text-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all active:scale-95 group relative"
           >
             <Activity className="w-7 h-7" />
             <div className="absolute right-20 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">Sync Data</div>
           </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreMap;
