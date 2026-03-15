import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { 
  MapPin, User, Star, Volume2, Info, Compass, 
  Languages, DollarSign, X, Play, 
  Pause, Square, Navigation, Layers, Clock,
  CheckCircle2, ArrowRight, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import useAudioGuide from '../hooks/useAudioGuide';
import useGuideTracking from '../hooks/useGuideTracking';

// Custom Map Icons
const PlaceIcon = L.divIcon({
  html: `<div class="relative group cursor-pointer">
           <div class="absolute -inset-2 bg-primary-500/20 rounded-full blur group-hover:bg-primary-500/40 transition-all duration-700 animate-pulse"></div>
           <div class="relative bg-primary-500 w-10 h-10 rounded-2xl border-2 border-white shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
           </div>
         </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const GuideIcon = L.divIcon({
  html: `<div class="relative group cursor-pointer">
           <div class="absolute -inset-2 bg-orange-500/20 rounded-full blur group-hover:bg-orange-500/40 transition-all duration-700"></div>
           <div class="relative bg-orange-500 w-10 h-10 rounded-2xl border-2 border-white shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
           </div>
         </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const UserIcon = L.divIcon({
  html: `<div class="relative">
           <div class="absolute -inset-3 bg-primary-500/20 rounded-full blur animate-ping"></div>
           <div class="relative w-6 h-6 bg-primary-500 rounded-full border-2 border-white shadow-xl"></div>
         </div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Guides', 'Places'
  const { isPlaying, speak, stop, pause, resume } = useAudioGuide();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sheetState, setSheetState] = useState('hidden'); 
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

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setSheetState('peek');
    setMapCenter([place.latitude, place.longitude]);
  };

  const handleBestGuide = () => {
    if (guides.length > 0) {
      const bestGuide = [...guides].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
      const livePos = liveGuides[bestGuide._id] || liveGuides[bestGuide.userId?._id];
      const position = livePos || [bestGuide.location.coordinates[1], bestGuide.location.coordinates[0]];
      
      setSelectedPlace({ ...bestGuide, isGuide: true });
      setSheetState('expanded');
      setMapCenter(position);
    } else {
      navigate('/guides');
    }
  };

  const filteredPlaces = places.filter(place => 
    (activeFilter === 'All' || activeFilter === 'Places') &&
    place.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = guides.filter(guide => 
    (activeFilter === 'All' || activeFilter === 'Guides') &&
    (guide.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     guide.specialization?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="relative h-screen w-full overflow-hidden bg-surface-50">
      {/* Search Overlay */}
      <div className="absolute top-12 left-0 right-0 z-[1000] px-6">
        <div className="relative flex items-center group mb-4">
          <Search className="absolute left-5 text-slate-300 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Explore destinations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-transparent rounded-[2rem] py-5 pl-14 pr-12 shadow-premium font-medium text-sm focus:ring-primary-500/20 transition-all outline-none"
          />
          <button className="absolute right-4 w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg">
             <Layers className="w-4 h-4" />
          </button>
        </div>
        <div className="flex space-x-2">
           <FilterChip label={t('common.all') || 'All'} active={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
           <FilterChip label={t('common.guides') || 'Guides'} active={activeFilter === 'Guides'} onClick={() => setActiveFilter('Guides')} />
           <FilterChip label={t('common.places') || 'Places'} active={activeFilter === 'Places'} onClick={() => setActiveFilter('Places')} />
        </div>
      </div>

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
        
        {filteredPlaces.map((place) => (
          <Marker 
            key={place._id} 
            position={[place.latitude, place.longitude]} 
            icon={PlaceIcon}
            eventHandlers={{
              click: () => handlePlaceSelect(place)
            }}
          />
        ))}

        {filteredGuides.map((guide) => {
          const livePos = liveGuides[guide._id] || liveGuides[guide.userId?._id];
          const position = livePos || [guide.location.coordinates[1], guide.location.coordinates[0]];
          
          return (
            <Marker 
              key={guide._id} 
              position={position} 
              icon={GuideIcon}
              eventHandlers={{
                click: () => {
                  setSelectedPlace({ ...guide, isGuide: true });
                  setSheetState('peek');
                  setMapCenter(position);
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-[120px]">
                  <p className="font-bold text-slate-900 text-sm">{guide.userId?.name}</p>
                  <button onClick={() => navigate(`/guide/${guide.userId?._id || guide._id}`)} className="w-full mt-2 py-2 bg-primary-500 text-white rounded-lg text-[10px] uppercase font-bold tracking-widest">
                    Book Now
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {userLocation && <Marker position={userLocation} icon={UserIcon} />}
      </MapContainer>

      {/* Floating Action Button */}
      <div className="absolute right-6 bottom-32 z-[1000]">
         <motion.button 
           whileTap={{ scale: 0.9 }}
           onClick={() => setMapCenter(userLocation || [20.2961, 85.8245])}
           className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-500 shadow-premium border border-slate-100"
         >
           <Navigation className="w-6 h-6" />
         </motion.button>
      </div>

      {/* Sliding Bottom Sheet */}
      <AnimatePresence>
        {sheetState !== 'hidden' && selectedPlace && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: sheetState === 'peek' ? '65%' : '15%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-[3.5rem] shadow-premium flex flex-col p-8"
          >
            <div className="flex justify-center mb-6 cursor-pointer" onClick={() => setSheetState(sheetState === 'peek' ? 'expanded' : 'peek')}>
               <div className="w-12 h-1.5 bg-slate-100 rounded-full" />
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                {selectedPlace.isGuide && (
                  <div className="w-16 h-16 bg-primary-50 rounded-2xl overflow-hidden border-2 border-primary-100">
                    {selectedPlace.userId?.profilePicture ? (
                      <img src={selectedPlace.userId.profilePicture} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-3 text-primary-300" />
                    )}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {selectedPlace.isGuide ? selectedPlace.userId?.name : selectedPlace.name}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1 text-slate-400">
                    <div className="flex items-center text-primary-500 font-bold text-xs space-x-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{selectedPlace.rating || '4.9'}</span>
                    </div>
                    <span className="text-slate-200">|</span>
                    <div className="flex items-center space-x-1 text-xs font-medium uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{selectedPlace.city || selectedPlace.locationName || 'Odisha'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSheetState('hidden')} 
                className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
               {selectedPlace.isGuide ? (
                 <motion.button 
                   whileTap={{ scale: 0.95 }}
                   onClick={() => navigate(`/chat/${selectedPlace.userId?._id || selectedPlace._id}`)}
                   className="bg-primary-50 text-primary-600 rounded-3xl p-5 flex flex-col items-center justify-center space-y-2 border border-primary-100"
                 >
                    <Compass className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Message</span>
                 </motion.button>
               ) : (
                 <motion.button 
                   whileTap={{ scale: 0.95 }}
                   onClick={() => speak(selectedPlace.audioGuideText || selectedPlace.description)}
                   className="bg-primary-50 text-primary-600 rounded-3xl p-5 flex flex-col items-center justify-center space-y-2 border border-primary-100"
                 >
                    <Volume2 className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Speak Mode</span>
                 </motion.button>
               )}
               <motion.button 
                 whileTap={{ scale: 0.95 }}
                 onClick={() => selectedPlace.isGuide 
                   ? navigate(`/guide/${selectedPlace.userId?._id || selectedPlace._id}`) 
                   : handleBestGuide()
                 }
                 className="bg-primary-500 text-white rounded-3xl p-5 flex flex-col items-center justify-center space-y-2 shadow-lg shadow-primary-500/20"
               >
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {selectedPlace.isGuide ? 'Confirm Booking' : 'Find Best Guide'}
                  </span>
               </motion.button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[30vh] custom-scrollbar pb-6">
               <div className="space-y-2">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">About</h4>
                 <p className="text-sm text-slate-600 leading-relaxed">
                   {selectedPlace.isGuide 
                    ? `${selectedPlace.userId?.name} is a certified expert in ${selectedPlace.specialization?.join(', ') || 'Odisha Heritage'} with ${selectedPlace.experience || '5+'} years of experience.` 
                    : (selectedPlace.description || 'Discover the rich history and cultural significance of this sacred destination in the heart of Odisha.')}
                 </p>
               </div>

               {selectedPlace.isGuide && (
                 <div className="flex items-center justify-between p-5 bg-surface-50 rounded-3xl border border-surface-100">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consultation Fee</p>
                     <p className="text-xl font-black text-slate-900">₹{selectedPlace.pricePerHr}<span className="text-xs font-medium text-slate-400">/hr</span></p>
                   </div>
                   <div className="px-5 py-2.5 bg-green-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-green-500/20">
                     Available Now
                   </div>
                 </div>
               )}

               {!selectedPlace.isGuide && (
                 <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Nearby Professionals</h4>
                    <div className="space-y-3">
                       {guides.slice(0, 2).map((guide) => (
                         <div 
                           key={guide._id} 
                           onClick={() => navigate(`/guide/${guide.userId?._id || guide._id}`)}
                           className="bg-surface-50 p-4 rounded-3xl flex items-center justify-between border border-surface-100 active:scale-[0.98] transition-all"
                         >
                           <div className="flex items-center space-x-3">
                             <div className="w-12 h-12 bg-white rounded-2xl overflow-hidden border border-slate-100">
                                {guide.userId?.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-slate-300" />}
                             </div>
                             <div>
                               <p className="font-bold text-slate-900 text-sm">{guide.userId?.name}</p>
                               <p className="text-[10px] font-bold text-primary-500">₹{guide.pricePerHr}/hr</p>
                             </div>
                           </div>
                           <ArrowRight className="w-5 h-5 text-slate-200" />
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playback Control Bar */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-28 right-6 z-[1000] bg-white px-5 py-3 rounded-2xl shadow-premium border border-primary-500/10 flex items-center space-x-4"
          >
             <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white">
                <Volume2 className="w-4 h-4 animate-pulse" />
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

const FilterChip = ({ label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all
    ${active ? 'bg-primary-500 text-white shadow-lg' : 'bg-white text-slate-400 hover:text-slate-600 shadow-soft'}
  `}>
    {label}
  </button>
);

export default ExploreMap;
