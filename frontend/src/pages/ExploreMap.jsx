import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { 
  MapPin, User, Star, Volume2, Info, Compass, 
  Languages, DollarSign, X, Activity, Play, 
  Pause, Square, Navigation, Layers, Clock, Gauge,
  ChevronUp, ChevronDown, CheckCircle2, ArrowRight, Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [places, setPlaces] = useState([]);
  const [guides, setGuides] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.2961, 85.8245]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isPlaying, speak, stop, pause, resume } = useAudioGuide();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sheetState, setSheetState] = useState('hidden'); // hidden, peek, expanded
  const { user } = useAuth();
  const { liveGuides } = useGuideTracking(user);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const mockServices = [
    { _id: 'h1', name: 'Hotel Mayfair', type: 'hotel', latitude: 20.301, longitude: 85.826, rating: 4.8 },
    { _id: 'r1', name: 'Dalma Restaurant', type: 'restaurant', latitude: 20.298, longitude: 85.821, rating: 4.7 },
    { _id: 'm1', name: 'Apollo Hospital', type: 'medical', latitude: 20.305, longitude: 85.830, rating: 4.9 },
    { _id: 't1', name: 'Puri Station', type: 'transport', latitude: 19.814, longitude: 85.827, rating: 4.5 }
  ];

  const fetchData = async (lat, lng) => {
    try {
      const [placesRes, guidesRes] = await Promise.all([
        axios.get(`/api/places/nearby?lat=${lat}&lng=${lng}`).catch(() => ({ data: [] })),
        axios.get(`/api/guides/nearby?lat=${lat}&lng=${lng}&distance=10000`).catch(() => ({ data: [] }))
      ]);
      
      // Fallback to local places if API fails for demo
      const localPlaces = [
        { _id: 'p1', name: 'Konark Sun Temple', type: 'place', latitude: 19.8876, longitude: 86.0945, city: 'Konark', description: 'Ancient sun temple marvel.' },
        { _id: 'p2', name: 'Jagannath Temple', type: 'place', latitude: 19.8135, longitude: 85.8179, city: 'Puri', description: 'Sacred heritage of Odisha.' }
      ];
      
      setPlaces(placesRes.data.length > 0 ? placesRes.data : localPlaces);
      setGuides(guidesRes.data);
    } catch (error) {
      console.error('Error fetching discovery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markers = [
    ...places.map(p => ({ ...p, type: 'place' })),
    ...guides.map(g => ({ ...g, type: 'guide', name: g.userId?.name })),
    ...mockServices
  ];

  const filteredMarkers = markers.filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'All') return matchesSearch;
    return m.type?.toLowerCase() === activeFilter.toLowerCase().replace(/s$/, '') && matchesSearch;
  });

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (filteredMarkers.length > 0) {
      const first = filteredMarkers[0];
      setMapCenter([first.latitude || first.location?.coordinates[1], first.longitude || first.location?.coordinates[0]]);
      setSelectedPlace(first);
      setSheetState('peek');
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

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setSheetState('peek');
    setMapCenter([place.latitude, place.longitude]);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-surface-50 mt-[-96px]">
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
        
        {filteredMarkers.map((marker) => (
          <Marker 
            key={marker._id} 
            position={[marker.latitude || marker.location?.coordinates[1], marker.longitude || marker.location?.coordinates[0]]} 
            icon={marker.type === 'guide' ? GuideIcon : PlaceIcon}
            eventHandlers={{
              click: () => {
                setSelectedPlace(marker);
                setSheetState('peek');
                setMapCenter([marker.latitude || marker.location?.coordinates[1], marker.longitude || marker.location?.coordinates[0]]);
              }
            }}
          />
        ))}

        {userLocation && <Marker position={userLocation} icon={UserIcon} />}
      </MapContainer>

      {/* Floating Controls */}
      <div className="absolute top-12 left-0 right-0 z-[1000] px-6">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center group mb-4">
          <Search className="absolute left-5 text-slate-300 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search guides, hotels, spots..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-transparent rounded-[2rem] py-5 pl-14 pr-12 shadow-premium font-medium text-sm focus:ring-primary-500/20 transition-all outline-none"
          />
          <button type="submit" className="absolute right-4 w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg">
             <Navigation className="w-4 h-4" />
          </button>
        </form>

        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
          {['All', 'Guides', 'Places', 'Hotels'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === filter 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-white/80 backdrop-blur-md text-slate-400 border border-white/20'
              }`}
            >
              {t(`common.${filter.toLowerCase()}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute top-44 left-6 z-[1000] space-y-3">
         <motion.button 
           whileTap={{ scale: 0.9 }}
           onClick={() => setMapCenter(userLocation || [20.2961, 85.8245])}
           className="w-14 h-14 bg-white border border-surface-200 rounded-3xl flex items-center justify-center text-primary-500 shadow-premium hover:bg-primary-50 transition-colors"
         >
           <Navigation className="w-6 h-6" />
         </motion.button>
      </div>

      {/* Uber-Style Sliding Bottom Sheet */}
      <AnimatePresence>
        {sheetState !== 'hidden' && selectedPlace && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: sheetState === 'peek' ? '60%' : '5%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-[3rem] shadow-premium flex flex-col max-h-[95vh]"
          >
            {/* Handle Bar */}
            <div 
              className="py-4 flex justify-center cursor-pointer"
              onClick={() => setSheetState(sheetState === 'peek' ? 'expanded' : 'peek')}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="px-6 pb-8 flex-grow overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-[8px] font-black uppercase tracking-widest inline-block mb-2">
                    Heritage Site
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight italic font-serif leading-none">
                    {selectedPlace.name}
                  </h3>
                  <div className="flex items-center space-x-1 mt-1 text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{selectedPlace.city}, Odisha</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSheetState('hidden')} 
                  className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-surface-50 p-4 rounded-2xl flex items-center space-x-3 border border-surface-100">
                    <div className="w-10 h-10 bg-white shadow-soft rounded-xl flex items-center justify-center text-primary-500">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Est. Trip</p>
                      <p className="text-xs font-black text-slate-900">2.5 Hours</p>
                    </div>
                 </div>
                 <div className="bg-surface-50 p-4 rounded-2xl flex items-center space-x-3 border border-surface-100">
                    <div className="w-10 h-10 bg-white shadow-soft rounded-xl flex items-center justify-center text-secondary-500">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Wait Time</p>
                      <p className="text-xs font-black text-slate-900">~10 Mins</p>
                    </div>
                 </div>
              </div>

              {/* Audio Guide Quick Action */}
              <button 
                onClick={() => speak(selectedPlace.audioGuideText || selectedPlace.description)}
                className="w-full bg-slate-900 text-white rounded-[2rem] p-5 flex items-center justify-between group hover:bg-primary-500 transition-all mb-8"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-0.5">Narrator Ready</p>
                    <p className="text-base font-black tracking-tight italic font-serif">Play Audio Guide</p>
                  </div>
                </div>
                <Play className="w-5 h-5 opacity-40 group-hover:opacity-100" />
              </button>

              {/* Guide Selection Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('guide.nearby')}</h4>
                  <span className="text-[10px] font-black text-primary-500">{guides.length} Online</span>
                </div>

                <div className="space-y-3">
                  {guides.map((guide) => (
                    <motion.div 
                      key={guide._id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/guide/${guide.userId?._id || guide._id}`)}
                      className="p-4 border border-surface-100 rounded-[2rem] flex items-center justify-between hover:border-primary-500/30 hover:bg-primary-50/10 cursor-pointer transition-all bg-white shadow-soft"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-primary-50">
                          {guide.userId?.profilePicture ? 
                            <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : 
                            <div className="w-full h-full bg-primary-50 flex items-center justify-center text-primary-500 font-bold text-lg">{guide.userId?.name.charAt(0)}</div>
                          }
                        </div>
                        <div>
                          <h5 className="font-black text-slate-900 text-base tracking-tight">{guide.userId?.name}</h5>
                          <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            <span className="flex items-center text-primary-500"><Star className="w-3 h-3 fill-primary-500 mr-1" /> {guide.rating}</span>
                            <span>•</span>
                            <span className="text-slate-900">₹{guide.pricePerHr}/hr</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-10 h-10 rounded-xl bg-surface-50 text-slate-300 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
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
            className="absolute top-28 right-6 z-[1000] bg-white px-5 py-3 rounded-[2rem] shadow-premium flex items-center space-x-4 border border-primary-500/10"
          >
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white relative">
               <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div className="pr-4 border-r border-slate-100">
               <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest block leading-none mb-1">Narrating</span>
               <span className="text-xs font-black text-slate-900 block leading-none">{selectedPlace?.name || 'Local Guide'}</span>
            </div>
            <div className="flex space-x-2">
               <button onClick={pause} className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-800"><Pause className="w-3 h-3" /></button>
               <button onClick={stop} className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500"><Square className="w-3 h-3" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreMap;
