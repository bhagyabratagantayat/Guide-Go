import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { 
  MapPin, User, Star, Volume2, Info, Compass, 
  Languages, DollarSign, X, Activity, Play, 
  Pause, Square, Navigation, Layers, Clock, Gauge,
  ChevronUp, ChevronDown, CheckCircle2, ArrowRight, Search,
  Shield, Zap, Award, Phone, MessageCircle, AlertCircle
} from 'lucide-react';
import GuideCategoryCard from '../components/GuideCategoryCard';
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
  const [bookingStage, setBookingStage] = useState('idle'); // idle, selecting_guide, requesting, active_booking
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState(null);
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

  const guideCategories = [
    { 
      id: 'lite', 
      name: 'GuideLite', 
      price: 350, 
      eta: '3-5', 
      icon: User, 
      description: 'Quick & affordable tours',
      color: { border: 'border-primary-500', bg: 'bg-primary-50/50', shadow: 'primary-500', iconBg: 'bg-primary-500' }
    },
    { 
      id: 'pro', 
      name: 'GuidePro', 
      price: 600, 
      eta: '2-4', 
      icon: Shield, 
      description: 'Certified experts with deep history',
      color: { border: 'border-accent-500', bg: 'bg-accent-50/50', shadow: 'accent-500', iconBg: 'bg-accent-500' }
    },
    { 
      id: 'expert', 
      name: 'HeritageMax', 
      price: 950, 
      eta: '5-8', 
      icon: Award, 
      description: 'UNESCO specialists & storytellers',
      color: { border: 'border-slate-900', bg: 'bg-slate-50', shadow: 'slate-900', iconBg: 'bg-slate-900' }
    }
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
    setBookingStage('idle');
    setMapCenter([place.latitude, place.longitude]);
  };

  const handleConfirmBooking = () => {
    setBookingStage('requesting');
    // Simulate finding a guide
    setTimeout(() => {
      setBookingStage('active_booking');
      setNotification('Guide assigned! Rajesh is on his way.');
      setTimeout(() => setNotification(null), 3000);
    }, 4000);
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

        {bookingStage === 'requesting' && (
          <div className="absolute inset-0 z-[500] pointer-events-none flex items-center justify-center">
            <motion.div 
               animate={{ scale: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
               transition={{ repeat: Infinity, duration: 3 }}
               className="w-[300px] h-[300px] bg-primary-500 rounded-full blur-3xl"
            />
          </div>
        )}
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

            <div className="px-6 pb-32 flex-grow overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait">
                {bookingStage === 'idle' && (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
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
                          <span className="text-[10px] font-bold uppercase tracking-widest">{selectedPlace.city || 'Odisha'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setSheetState('hidden'); setBookingStage('idle'); }} 
                        className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

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

                    <button 
                      onClick={() => speak(selectedPlace.audioGuideText || selectedPlace.description)}
                      className="w-full bg-slate-900 text-white rounded-[2rem] p-5 flex items-center justify-between group hover:bg-primary-500 transition-all mb-4"
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

                    <button 
                      onClick={() => { setBookingStage('selecting_guide'); setSheetState('expanded'); }}
                      className="w-full bg-primary-500 text-slate-950 rounded-[2rem] p-6 shadow-premium flex items-center justify-center space-x-3 group active:scale-95 transition-all"
                    >
                       <Zap className="w-5 h-5 fill-current" />
                       <span className="text-sm font-black uppercase tracking-widest italic font-serif">Book a Guide Now</span>
                       <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {bookingStage === 'selecting_guide' && (
                  <motion.div 
                    key="selecting"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black text-slate-900 tracking-tight italic font-serif">Choose Guide Type</h3>
                       <button onClick={() => setBookingStage('idle')} className="text-[10px] font-black uppercase tracking-widest text-slate-400">Back</button>
                    </div>

                    <div className="space-y-3">
                      {guideCategories.map(cat => (
                        <GuideCategoryCard 
                          key={cat.id}
                          category={cat}
                          isSelected={selectedCategory?.id === cat.id}
                          onClick={() => setSelectedCategory(cat)}
                        />
                      ))}
                    </div>

                    <div className="pt-4">
                       <button 
                         disabled={!selectedCategory}
                         onClick={handleConfirmBooking}
                         className={`w-full py-6 rounded-[2.5rem] flex items-center justify-center space-x-3 shadow-premium transition-all active:scale-95 ${
                           selectedCategory ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300 pointer-events-none'
                         }`}
                       >
                         <span className="text-base font-black uppercase tracking-widest italic font-serif">Confirm {selectedCategory?.name || 'Selection'}</span>
                       </button>
                    </div>
                  </motion.div>
                )}

                {bookingStage === 'requesting' && (
                   <motion.div 
                    key="requesting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-center justify-center space-y-8"
                  >
                    <div className="relative">
                       <motion.div 
                         animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                         transition={{ repeat: Infinity, duration: 2 }}
                         className="absolute inset-0 bg-primary-500 rounded-full blur-xl"
                       />
                       <div className="relative w-24 h-24 bg-white rounded-full shadow-premium flex items-center justify-center">
                          <Activity className="w-10 h-10 text-primary-500 animate-pulse" />
                       </div>
                    </div>
                    <div className="text-center space-y-2">
                       <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic font-serif">Searching for Guides</h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Connecting to sacred storytellers...</p>
                    </div>
                    <button 
                      onClick={() => setBookingStage('selecting_guide')}
                      className="px-8 py-3 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100"
                    >
                      Cancel Request
                    </button>
                  </motion.div>
                )}

                {bookingStage === 'active_booking' && (
                  <motion.div 
                    key="active"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-primary-500 p-6 rounded-[3rem] text-slate-950 flex items-center justify-between">
                       <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-white p-0.5 border-2 border-white shadow-xl">
                             <img src="https://i.pravatar.cc/150?u=rajesh" className="w-full h-full object-cover rounded-[1.25rem]" />
                          </div>
                          <div>
                             <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-60">Heading to your location</p>
                             <h4 className="text-2xl font-black tracking-tight italic font-serif">Rajesh Mishra</h4>
                             <div className="flex items-center space-x-1 text-[10px] font-black mt-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span>4.9 • Certified Expert</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                             <Phone className="w-6 h-6" />
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <button className="flex items-center justify-center space-x-3 p-5 bg-surface-50 border border-surface-200 rounded-[2rem] text-slate-600 font-black uppercase tracking-widest text-[10px]">
                          <MessageCircle className="w-4 h-4" />
                          <span>Message</span>
                       </button>
                       <button className="flex items-center justify-center space-x-3 p-5 bg-red-50 border border-red-100 rounded-[2rem] text-red-500 font-black uppercase tracking-widest text-[10px]">
                          <AlertCircle className="w-4 h-4" />
                          <span>Cancel Trip</span>
                       </button>
                    </div>

                    <div className="p-6 bg-slate-900 rounded-[4rem] flex items-center justify-between relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
                       <div className="relative z-10 flex flex-col justify-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Tracking</p>
                          <p className="text-white text-lg font-black tracking-tight italic font-serif leading-none">ARRIVING IN 3 MINS</p>
                       </div>
                       <div className="relative z-10 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400">
                          <Navigation className="w-5 h-5 animate-bounce" />
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Narrator Widget */}
      <AnimatePresence>
        {(isPlaying || notification) && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-28 right-6 z-[1000] bg-white px-5 py-3 rounded-[2rem] shadow-premium flex items-center space-x-4 border border-primary-500/10"
          >
            {notification ? (
              <div className="flex items-center space-x-3 pr-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-900">{notification}</span>
              </div>
            ) : (
              <>
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreMap;
