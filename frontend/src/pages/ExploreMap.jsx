import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { 
  MapPin, User, Star, Volume2, Info, Compass, 
<<<<<<< HEAD
  Languages, DollarSign, X, Play, 
  Pause, Square, Navigation, Layers, Clock,
  CheckCircle2, ArrowRight, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
=======
  Languages, DollarSign, X, Activity, Play, 
  Pause, Square, Navigation, Layers, Clock, Gauge,
  ChevronUp, ChevronDown, CheckCircle2, ArrowRight, Search,
  Shield, Zap, Award, Phone, MessageCircle, AlertCircle
} from 'lucide-react';
import GuideCategoryCard from '../components/GuideCategoryCard';
import { Link, useNavigate } from 'react-router-dom';
>>>>>>> a942ae1
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
           <div class="absolute -inset-3 bg-blue-500/20 rounded-full blur animate-ping"></div>
           <div class="relative w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-xl"></div>
         </div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const createColoredIcon = (color, iconSvg) => L.divIcon({
  html: `<div class="relative group cursor-pointer">
           <div class="absolute -inset-2 bg-${color}-500/20 rounded-full blur group-hover:bg-${color}-500/40 transition-all duration-700"></div>
           <div class="relative bg-${color}-500 w-10 h-10 rounded-2xl border-2 border-white shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-all">
             ${iconSvg}
           </div>
         </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const HotelIcon = createColoredIcon('pink', '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="7" height="5" x="7" y="7" rx="1"/><rect width="7" height="5" x="10" y="12" rx="1"/></svg>');
const FoodIcon = createColoredIcon('orange', '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>');
const MedicalIcon = createColoredIcon('red', '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>');
const TransportIcon = createColoredIcon('blue', '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15h.01"/><path d="M17 15h.01"/><path d="M16 8V5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v3"/><rect width="16" height="10" x="4" y="8" rx="2"/></svg>');

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
  const [markers, setMarkers] = useState([]); // Array of { ...data, type: 'guide'|'place'|'hotel'|'food'|'medical'|'transport' }
  const [mapCenter, setMapCenter] = useState([20.2961, 85.8245]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); 
  const { isPlaying, speak, stop, pause, resume } = useAudioGuide();
  const [selectedPlace, setSelectedPlace] = useState(null);
<<<<<<< HEAD
  const [sheetState, setSheetState] = useState('hidden'); 
=======
  const [sheetState, setSheetState] = useState('hidden'); // hidden, peek, expanded
  const [bookingStage, setBookingStage] = useState('idle'); // idle, selecting_guide, requesting, active_booking
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState(null);
>>>>>>> a942ae1
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
      
<<<<<<< HEAD
      const allMarkers = [
        ...placesRes.data.map(p => ({ ...p, type: 'place' })),
        ...guidesRes.data.map(g => ({ ...g, type: 'guide' }))
      ];

      // Simulate/Mock other services for now if backend is pending, 
      // or fetch from separate endpoints if they exist.
      // Based on previous work, we have frontend pages, but let's add some visual markers.
      const mockServices = [
        { _id: 'h1', name: 'Mayfair Heritage', type: 'hotel', latitude: lat + 0.005, longitude: lng + 0.005, rating: 4.8, city: 'Puri' },
        { _id: 'r1', name: 'Dalma Restaurant', type: 'food', latitude: lat - 0.005, longitude: lng + 0.006, rating: 4.7, city: 'Bhubaneswar' },
        { _id: 'm1', name: 'Apollo Hospital', type: 'medical', latitude: lat + 0.008, longitude: lng - 0.004, rating: 4.9, city: 'Bhubaneswar' },
        { _id: 't1', name: 'Master Canteen', type: 'transport', latitude: lat - 0.003, longitude: lng - 0.008, rating: 4.5, city: 'Bhubaneswar' }
      ];

      setMarkers([...allMarkers, ...mockServices]);
=======
      // Fallback to local places if API fails for demo
      const localPlaces = [
        { _id: 'p1', name: 'Konark Sun Temple', type: 'place', latitude: 19.8876, longitude: 86.0945, city: 'Konark', description: 'Ancient sun temple marvel.' },
        { _id: 'p2', name: 'Jagannath Temple', type: 'place', latitude: 19.8135, longitude: 85.8179, city: 'Puri', description: 'Sacred heritage of Odisha.' }
      ];
      
      setPlaces(placesRes.data.length > 0 ? placesRes.data : localPlaces);
      setGuides(guidesRes.data);
>>>>>>> a942ae1
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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return '...';
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d < 1 ? `${(d * 1000).toFixed(0)}m` : `${d.toFixed(1)}km`;
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setSheetState('peek');
    setBookingStage('idle');
    setMapCenter([place.latitude, place.longitude]);
  };

<<<<<<< HEAD
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

  const filteredMarkers = markers.filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'Guides') return m.type === 'guide' && matchesSearch;
    if (activeFilter === 'Places') return m.type === 'place' && matchesSearch;
    if (activeFilter === 'Hotels') return m.type === 'hotel' && matchesSearch;
    if (activeFilter === 'Food') return m.type === 'food' && matchesSearch;
    if (activeFilter === 'Medical') return m.type === 'medical' && matchesSearch;
    if (activeFilter === 'Transport') return m.type === 'transport' && matchesSearch;
    return false;
  });

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
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
           <FilterChip label={t('common.all') || 'All'} active={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
           <FilterChip label={t('common.guides') || 'Guides'} active={activeFilter === 'Guides'} onClick={() => setActiveFilter('Guides')} />
           <FilterChip label={t('common.places') || 'Places'} active={activeFilter === 'Places'} onClick={() => setActiveFilter('Places')} />
           <FilterChip label="Hotels" active={activeFilter === 'Hotels'} onClick={() => setActiveFilter('Hotels')} />
           <FilterChip label="Food" active={activeFilter === 'Food'} onClick={() => setActiveFilter('Food')} />
           <FilterChip label="Medical" active={activeFilter === 'Medical'} onClick={() => setActiveFilter('Medical')} />
           <FilterChip label="Transport" active={activeFilter === 'Transport'} onClick={() => setActiveFilter('Transport')} />
        </div>
      </div>

=======
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
    <div className="relative h-screen w-full overflow-hidden bg-surface-50">
>>>>>>> a942ae1
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
        
<<<<<<< HEAD
        {filteredMarkers.map((m) => {
          let position = [m.latitude, m.longitude];
          let icon = PlaceIcon;

          if (m.type === 'guide') {
            const livePos = liveGuides[m._id] || liveGuides[m.userId?._id];
            position = livePos || [m.location.coordinates[1], m.location.coordinates[0]];
            icon = GuideIcon;
          } else if (m.type === 'hotel') icon = HotelIcon;
          else if (m.type === 'food') icon = FoodIcon;
          else if (m.type === 'medical') icon = MedicalIcon;
          else if (m.type === 'transport') icon = TransportIcon;

          return (
            <Marker 
              key={m._id} 
              position={position} 
              icon={icon}
              eventHandlers={{
                click: () => {
                  setSelectedPlace(m);
                  setSheetState('peek');
                  setMapCenter(position);
                }
              }}
            >
              {m.type === 'guide' && (
                <Popup>
                  <div className="p-2 min-w-[120px]">
                    <p className="font-bold text-slate-900 text-sm">{m.userId?.name}</p>
                    <button onClick={() => navigate(`/guide/${m.userId?._id || m._id}`)} className="w-full mt-2 py-2 bg-primary-500 text-white rounded-lg text-[10px] uppercase font-bold tracking-widest">
                      Book Now
                    </button>
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}

=======
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

>>>>>>> a942ae1
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

<<<<<<< HEAD
      {/* Floating Action Button */}
      <div className="absolute right-6 bottom-32 z-[1000]">
         <motion.button 
           whileTap={{ scale: 0.9 }}
           onClick={() => setMapCenter(userLocation || [20.2961, 85.8245])}
           className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-500 shadow-premium border border-slate-100"
=======
      {/* Floating Controls */}
      <div className="absolute top-28 left-0 right-0 z-[1000] px-6 max-w-2xl mx-auto">
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

        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2 justify-center">
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

      <div className="absolute bottom-32 right-6 z-[1000] space-y-3">
         <motion.button 
           whileTap={{ scale: 0.9 }}
           onClick={() => setMapCenter(userLocation || [20.2961, 85.8245])}
           className="w-14 h-14 bg-white border border-surface-200 rounded-full flex items-center justify-center text-primary-500 shadow-premium hover:bg-primary-50 transition-colors"
>>>>>>> a942ae1
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

<<<<<<< HEAD
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
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{calculateDistance(userLocation?.[0], userLocation?.[1], selectedPlace.latitude || selectedPlace.location?.coordinates?.[1], selectedPlace.longitude || selectedPlace.location?.coordinates?.[0])}</span>
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

            <div className="grid grid-cols-3 gap-2 mb-8">
               <motion.button 
                 whileTap={{ scale: 0.95 }}
                 onClick={() => speak(selectedPlace.audioGuideText || selectedPlace.description || `This is ${selectedPlace.name || selectedPlace.userId?.name}`)}
                 className="bg-primary-50 text-primary-600 rounded-2xl p-4 flex flex-col items-center justify-center space-y-1 border border-primary-100"
               >
                  <Volume2 className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-center">Play Audio</span>
               </motion.button>

               <motion.button 
                 whileTap={{ scale: 0.95 }}
                 onClick={() => selectedPlace.type === 'guide' 
                   ? navigate(`/guide/${selectedPlace.userId?._id || selectedPlace._id}`) 
                   : handleBestGuide()
                 }
                 className="bg-primary-500 text-white rounded-2xl p-4 flex flex-col items-center justify-center space-y-1 shadow-lg shadow-primary-500/20"
               >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-center">
                    {selectedPlace.type === 'guide' ? 'Book Guide' : 'Find Guide'}
                  </span>
               </motion.button>

               <motion.button 
                 whileTap={{ scale: 0.95 }}
                 onClick={() => navigate('/support')}
                 className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col items-center justify-center space-y-1"
               >
                  <Layers className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-center">Nearby</span>
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
=======
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
>>>>>>> a942ae1
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playback Control Bar */}
      <AnimatePresence>
        {(isPlaying || notification) && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-28 right-6 z-[1000] bg-white px-5 py-3 rounded-2xl shadow-premium border border-primary-500/10 flex items-center space-x-4"
          >
<<<<<<< HEAD
             <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white">
                <Volume2 className="w-4 h-4 animate-pulse" />
             </div>
             <div className="flex space-x-2">
                <button onClick={pause} className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-800"><Pause className="w-3 h-3" /></button>
                <button onClick={stop} className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500"><Square className="w-3 h-3" /></button>
             </div>
=======
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
>>>>>>> a942ae1
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
