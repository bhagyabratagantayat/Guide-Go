import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { 
  MapPin, User, Star, Volume2, Info, Compass, 
  Languages, DollarSign, X, Activity, Play, 
  Pause, Square, Navigation, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import useAudioGuide from '../hooks/useAudioGuide';
import useGuideTracking from '../hooks/useGuideTracking';

// Leaflet Icon Fix - High Fidelity Custom Icons
const PlaceIcon = L.divIcon({
  html: `<div class="relative group cursor-pointer">
           <div class="absolute -inset-3 bg-primary-500/20 rounded-full blur-md group-hover:bg-primary-500/40 transition-all duration-700 animate-pulse"></div>
           <div class="relative bg-primary-600 w-11 h-11 rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-1 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
           </div>
         </div>`,
  className: '',
  iconSize: [44, 44],
  iconAnchor: [22, 44]
});

const GuideIcon = L.divIcon({
  html: `<div class="relative group cursor-pointer">
           <div class="absolute -inset-3 bg-orange-500/20 rounded-full blur-md group-hover:bg-orange-500/40 transition-all duration-700"></div>
           <div class="relative bg-orange-500 w-11 h-11 rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-1 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
           </div>
         </div>`,
  className: '',
  iconSize: [44, 44],
  iconAnchor: [22, 44]
});

const UserIcon = L.divIcon({
  html: `<div class="relative">
           <div class="absolute -inset-4 bg-primary-500/20 rounded-full blur-lg animate-ping"></div>
           <div class="relative w-8 h-8 bg-primary-500 rounded-full border-4 border-white shadow-2xl"></div>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const ReCenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

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
        () => fetchData(20.2961, 85.8245)
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
      let minDistance = 150; // Increased threshold for better discovery

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
    <div className="relative h-screen w-full overflow-hidden bg-slate-100 mt-[-96px]">
      <MapContainer 
        center={mapCenter} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <ReCenterMap center={mapCenter} />
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {places.map((place) => (
          <Marker key={place._id} position={[place.latitude, place.longitude]} icon={PlaceIcon}>
            <Popup className="premium-discovery-popup">
              <div className="p-0 min-w-[280px] bg-white rounded-3xl overflow-hidden">
                <div className="h-40 relative group overflow-hidden">
                   <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                   <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1">Local Heritage</p>
                      <h4 className="font-black text-xl italic font-serif leading-none tracking-tight">{place.name}</h4>
                   </div>
                </div>
                <div className="p-5">
                   <p className="text-xs font-bold text-slate-500 leading-relaxed line-clamp-2 mb-4">{place.description}</p>
                   <button 
                     onClick={() => speak(place.audioGuideText || place.description)}
                     className="w-full btn-primary py-3.5 text-[10px] uppercase tracking-widest flex items-center justify-center"
                   >
                     <Play className="w-4 h-4 mr-2" /> Start Audio Guide
                   </button>
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
                <div className="p-6 min-w-[240px] bg-white rounded-3xl">
                  <div className="flex items-center space-x-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 border-2 border-white overflow-hidden shadow-inner">
                       {guide.userId?.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-orange-500" />}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 tracking-tight leading-tight">{guide.userId?.name || 'Local Guide'}</h4>
                      <div className="flex items-center text-[10px] font-black text-yellow-500 uppercase tracking-widest">
                        <Star className="w-3 h-3 fill-yellow-500 mr-1" /> {guide.rating} Rating
                      </div>
                    </div>
                  </div>
                  <Link to={`/guide/${guide.userId?._id || guide._id}`} className="block w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase text-center hover:bg-orange-500 transition-all">
                    View & Book
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {userLocation && <Marker position={userLocation} icon={UserIcon} />}
      </MapContainer>

      {/* Persistent Controls Overlay */}
      <div className="absolute top-28 left-6 z-[1000] space-y-3">
         <motion.button 
           whileTap={{ scale: 0.9 }}
           onClick={() => setMapCenter(userLocation || [20.2961, 85.8245])}
           className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-2xl hover:bg-primary-50 transition-colors"
         >
           <Navigation className="w-7 h-7" />
         </motion.button>
         <motion.button 
           whileTap={{ scale: 0.9 }}
           className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-2xl"
         >
           <Layers className="w-7 h-7" />
         </motion.button>
      </div>

      {/* Discovery Bottom Sheet / Pop-up */}
      <AnimatePresence>
        {nearestPlace && (
          <motion.div 
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-24 left-6 right-6 z-[1000] glass-card p-6 rounded-[3rem] shadow-premium border-4 border-primary-500/20"
          >
            <div className="flex items-start justify-between mb-4">
               <div>
                  <div className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-[9px] font-black uppercase tracking-widest inline-block mb-3">Discovery nearby</div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight italic font-serif leading-none">{nearestPlace.name}</h3>
               </div>
               <button onClick={() => setNearestPlace(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <div className="flex items-center space-x-1 text-[10px] font-black text-slate-400 tracking-widest uppercase mb-6">
               <Navigation className="w-3 h-3 text-primary-500" /> Less than 100m away
            </div>
            <div className="flex space-x-3">
               <button 
                 onClick={() => {
                   speak(nearestPlace.audioGuideText || nearestPlace.description);
                   setAutoSuggested(prev => new Set(prev).add(nearestPlace._id));
                   setNearestPlace(null);
                 }}
                 className="flex-grow btn-primary py-4 text-[10px]"
               >
                 LISTEN TO STORY
               </button>
               <button 
                 onClick={() => {
                   setAutoSuggested(prev => new Set(prev).add(nearestPlace._id));
                   setNearestPlace(null);
                 }}
                 className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest"
               >
                 DISMISS
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Narrator Widget */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-28 right-6 z-[1000] glass-card px-6 py-4 rounded-[2.5rem] shadow-premium flex items-center space-x-4 border-2 border-primary-500/20"
          >
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white relative">
               <Volume2 className="w-6 h-6 animate-pulse" />
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </div>
            <div className="pr-4 border-r border-slate-100">
               <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest block leading-none mb-1">Narrating</span>
               <span className="text-xs font-black text-slate-900 tracking-tight block leading-none">Heritage Site</span>
            </div>
            <div className="flex space-x-2">
               <button onClick={pause} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800"><Pause className="w-4 h-4" /></button>
               <button onClick={stop} className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500"><Square className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning status */}
      {loading && (
        <div className="absolute inset-0 z-[2000] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6 shadow-xl shadow-primary-500/20" />
           <p className="text-sm font-black text-slate-900 tracking-[0.3em] uppercase">Establishing GPS Link...</p>
        </div>
      )}
    </div>
  );
};

export default ExploreMap;
