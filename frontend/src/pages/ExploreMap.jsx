import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { 
  MapPin, User, Star, Volume2, Compass, 
  X, Activity, Play, Pause, Square, Navigation, 
  Shield, Zap, Award, Phone, MessageCircle, AlertCircle,
  Search, ArrowRight, Clock
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext.jsx';
import useAudioGuide from '../hooks/useAudioGuide';
import useGuideTracking from '../hooks/useGuideTracking';
import GuideCategoryCard from '../components/GuideCategoryCard';
import { io } from 'socket.io-client';

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
  const location = useLocation();
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [guides, setGuides] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.2961, 85.8245]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); 
  const { speak, stop, pause, resume, isPlaying } = useAudioGuide();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sheetState, setSheetState] = useState('hidden');
  const [bookingStage, setBookingStage] = useState('idle');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState(null);
  const [assignedGuide, setAssignedGuide] = useState(null);
  const { liveGuides } = useGuideTracking(user);
  const socketRef = useRef();

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
      const [placesRes, guidesRes, hotelsRes, restRes] = await Promise.all([
        axios.get(`/api/places/nearby?lat=${lat}&lng=${lng}`).catch(() => ({ data: [] })),
        axios.get(`/api/guides/nearby?lat=${lat}&lng=${lng}&distance=10000`).catch(() => ({ data: [] })),
        axios.get(`/api/hotels/nearby?lat=${lat}&lng=${lng}&distance=10000`).catch(() => ({ data: [] })),
        axios.get(`/api/restaurants`).catch(() => ({ data: [] }))
      ]);
      
      setPlaces(placesRes.data);
      setGuides(guidesRes.data);
      setHotels(hotelsRes.data);
      setRestaurants(restRes.data);
    } catch (error) {
      console.error('Error fetching discovery data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial location and data fetch
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

    // Socket setup for matching
    const socketUrl = axios.defaults.baseURL || 'http://localhost:5000';
    socketRef.current = io(socketUrl);
    
    if (user) {
      socketRef.current.emit('join', { userId: user._id });
    }

    socketRef.current.on('notification', (data) => {
      if (data.type === 'booking_status_update' && data.status === 'confirmed') {
        setBookingStage('active_booking');
        setNotification('Guide assigned! Your storyteller is on the way.');
        // Assume data includes guide details or we fetch them
        setTimeout(() => setNotification(null), 3000);
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      stop();
    };
  }, [user]);

  // Handle cross-page navigation from Home
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (filter) setActiveFilter(filter.charAt(0).toUpperCase() + filter.slice(1));
  }, [location.search]);

  const markers = [
    ...places.map(p => ({ ...p, type: 'place' })),
    ...guides.map(g => ({ ...g, type: 'guide', name: g.userId?.name })),
    ...hotels.map(h => ({ ...h, type: 'hotel' })),
    ...restaurants.map(r => ({ ...r, type: 'food', latitude: r.location.coordinates[1], longitude: r.location.coordinates[0] }))
  ];

  const filteredMarkers = markers.filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'All') return matchesSearch;
    const filterType = activeFilter.toLowerCase().replace(/s$/, '');
    return (m.type?.toLowerCase() === filterType || (filterType === 'hotel' && m.type === 'hotel') || (filterType === 'place' && m.type === 'place')) && matchesSearch;
  });

  const handleConfirmBooking = async () => {
    if (!user) return navigate('/login');
    setBookingStage('requesting');
    
    try {
      // Find a nearby guide who is live and matches category (stubbed logic for now)
      const targetGuide = guides[0]; // Pick first available guide for demo
      
      if (!targetGuide) {
        setNotification('No guides available in this area right now.');
        setBookingStage('selecting_guide');
        return;
      }

      await axios.post('/api/bookings', {
        guideId: targetGuide._id,
        location: selectedPlace?.name || 'Current Location',
        bookingTime: new Date().toISOString(),
        price: selectedCategory.price,
        paymentMethod: 'cash',
        onDemand: true
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

    } catch (error) {
      console.error('Booking failed:', error);
      setBookingStage('selecting_guide');
      setNotification('Failed to send request. Try again.');
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-surface-50">
      <MapContainer 
        center={mapCenter} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <ReCenterMap center={mapCenter} />
        <TileLayer
          attribution='&copy; CARTO'
          url={darkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
        />
        
        {filteredMarkers.map((marker) => (
          <Marker 
            key={marker._id} 
            position={[marker.latitude || marker.location?.coordinates[1], marker.longitude || marker.location?.coordinates[0]]} 
            icon={marker.type === 'guide' ? GuideIcon : (marker.type === 'hotel' ? HotelIcon : (marker.type === 'food' ? FoodIcon : PlaceIcon))}
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

      {/* Floating Header Actions */}
      <div className="absolute top-12 left-6 right-6 z-[1000] flex items-center justify-between">
         <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg"><User className="w-5 h-5" /></button>
         <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-lg flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Exploration Live</span>
         </div>
         <button className="w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg"><X className="w-5 h-5" /></button>
      </div>

      {/* Search & Filters */}
      <div className="absolute top-28 left-0 right-0 z-[1000] px-6 max-w-2xl mx-auto">
        <div className="relative flex items-center group mb-4">
          <Search className="absolute left-5 text-slate-300 dark:text-slate-600 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search guides, hotels, spots..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border-transparent rounded-[2rem] py-5 pl-14 pr-12 shadow-premium dark:shadow-none font-medium text-sm focus:ring-primary-500/20 transition-all outline-none text-slate-900 dark:text-white"
          />
          <button className="absolute right-4 w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg">
             <Navigation className="w-4 h-4" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2 justify-center">
          {['All', 'Guides', 'Places', 'Hotels'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === filter 
                ? 'bg-slate-900 dark:bg-primary-600 text-white shadow-lg' 
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-400 dark:text-slate-500 border border-white/20 dark:border-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-32 right-6 z-[1000] space-y-3">
         <motion.button 
           whileTap={{ scale: 0.9 }}
           onClick={() => setMapCenter(userLocation || [20.2961, 85.8245])}
           className="w-14 h-14 bg-white dark:bg-slate-800 border border-surface-200 dark:border-slate-700 rounded-full flex items-center justify-center text-primary-500 shadow-premium dark:shadow-none"
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
            className="absolute bottom-0 left-0 right-0 z-[1000] bg-white dark:bg-slate-900 rounded-t-[3.5rem] shadow-premium dark:shadow-none flex flex-col p-8"
          >
            <div className="flex justify-center mb-6 cursor-pointer" onClick={() => setSheetState(sheetState === 'peek' ? 'expanded' : 'peek')}>
               <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full" />
            </div>

            <div className="px-6 pb-32 flex-grow overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait">
                {bookingStage === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-[8px] font-black uppercase tracking-widest inline-block mb-2">
                           {selectedPlace.type?.toUpperCase() || 'Destination'}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight italic font-serif leading-none">
                          {selectedPlace.name}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1 text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{selectedPlace.city || selectedPlace.address || 'Odisha'}</span>
                        </div>
                      </div>
                      <button onClick={() => setSheetState('hidden')} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400"><X className="w-5 h-5" /></button>
                    </div>

                    {selectedPlace.type === 'guide' ? (
                      <div className="space-y-6">
                         <div className="flex items-center space-x-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem]">
                            <img src={selectedPlace.userId?.profilePicture || "https://i.pravatar.cc/150"} className="w-20 h-20 rounded-2xl object-cover" />
                            <div>
                               <h4 className="text-xl font-black text-slate-900 dark:text-white italic font-serif">Verified Expert</h4>
                               <div className="flex items-center space-x-2 text-primary-500 mt-1">
                                  <Star className="w-4 h-4 fill-current" />
                                  <span className="font-black text-sm">4.9 (120 Reviews)</span>
                               </div>
                            </div>
                         </div>
                         <button onClick={() => navigate(`/guides/${selectedPlace._id}`)} className="w-full btn-primary py-5 text-[10px] tracking-[0.25em]">VIEW FULL PROFILE</button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-3">
                            <div className="bg-surface-50 dark:bg-slate-800 p-4 rounded-2xl border border-surface-100 dark:border-slate-700">
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
                               <p className="text-xs font-black text-slate-900 dark:text-white flex items-center"><Star className="w-3 h-3 mr-1 fill-primary-500 text-primary-500" /> {selectedPlace.rating || '4.5'}</p>
                            </div>
                            <div className="bg-surface-50 dark:bg-slate-800 p-4 rounded-2xl border border-surface-100 dark:border-slate-700">
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Price Point</p>
                               <p className="text-xs font-black text-slate-900 dark:text-white">₹{selectedPlace.pricePerNight || 'VARIES'}</p>
                            </div>
                         </div>
                         
                         <button 
                            onClick={() => speak(selectedPlace.description)}
                            className="w-full bg-slate-900 text-white rounded-[2rem] p-5 flex items-center justify-between group hover:bg-primary-500 transition-all"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Volume2 className="w-5 h-5" /></div>
                              <p className="text-base font-black tracking-tight italic font-serif">Play Audio Guide</p>
                            </div>
                            <Play className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                          </button>

                         <button 
                            onClick={() => { setBookingStage('selecting_guide'); setSheetState('expanded'); }}
                            className="w-full bg-primary-500 text-slate-950 rounded-[2rem] p-6 shadow-premium flex items-center justify-center space-x-3 group"
                          >
                             <Zap className="w-5 h-5 fill-current" />
                             <span className="text-sm font-black uppercase tracking-widest italic font-serif">Book a Guide Now</span>
                             <ArrowRight className="w-5 h-5" />
                          </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {bookingStage === 'selecting_guide' && (
                  <motion.div key="selecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight italic font-serif">Choose Guide Type</h3>
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
                    <button 
                      disabled={!selectedCategory}
                      onClick={handleConfirmBooking}
                      className={`w-full py-6 rounded-[2.5rem] flex items-center justify-center space-x-3 shadow-premium transition-all ${
                        selectedCategory ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300 pointer-events-none'
                      }`}
                    >
                      <span className="text-base font-black uppercase tracking-widest italic font-serif">Confirm {selectedCategory?.name || 'Selection'}</span>
                    </button>
                  </motion.div>
                )}

                {bookingStage === 'requesting' && (
                   <motion.div key="requesting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 flex flex-col items-center justify-center space-y-8">
                    <div className="relative">
                       <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-primary-500 rounded-full blur-xl" />
                       <div className="relative w-24 h-24 bg-white rounded-full shadow-premium flex items-center justify-center">
                          <Activity className="w-10 h-10 text-primary-500 animate-pulse" />
                       </div>
                    </div>
                    <div className="text-center space-y-2">
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif">Searching for Guides</h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Connecting to sacred storytellers...</p>
                    </div>
                    <button onClick={() => setBookingStage('selecting_guide')} className="px-8 py-3 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">Cancel Request</button>
                  </motion.div>
                )}

                {bookingStage === 'active_booking' && (
                  <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-primary-500 p-6 rounded-[3rem] text-slate-950 flex items-center justify-between">
                       <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-white p-0.5 border-2 border-white shadow-xl">
                             <img src="https://i.pravatar.cc/150?u=guide" className="w-full h-full object-cover rounded-[1.25rem]" />
                          </div>
                          <div>
                             <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-60">Heading to your location</p>
                             <h4 className="text-2xl font-black tracking-tight italic font-serif">Assigned Guide</h4>
                             <div className="flex items-center space-x-1 text-[10px] font-black mt-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span>4.9 • Certified Expert</span>
                             </div>
                          </div>
                       </div>
                       <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md cursor-pointer"><Phone className="w-6 h-6" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button className="flex items-center justify-center space-x-3 p-5 bg-surface-50 dark:bg-slate-800 border dark:border-slate-700 rounded-[2rem] text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest text-[10px]">
                          <MessageCircle className="w-4 h-4" /> <span>Message</span>
                       </button>
                       <button onClick={() => setBookingStage('idle')} className="flex items-center justify-center space-x-3 p-5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-[2rem] text-red-500 font-black uppercase tracking-widest text-[10px]">
                          <AlertCircle className="w-4 h-4" /> <span>Cancel Trip</span>
                       </button>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-[4rem] flex items-center justify-between">
                       <div className="flex flex-col justify-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Tracking</p>
                          <p className="text-white text-lg font-black tracking-tight italic font-serif leading-none uppercase">Arriving In 3 Mins</p>
                       </div>
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400"><Navigation className="w-5 h-5 animate-bounce" /></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Notifications Overlay */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -100 }} animate={{ y: 20 }} exit={{ y: -100 }} className="absolute top-24 left-1/2 -translate-x-1/2 z-[2000] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-4">
             <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-slate-950" /></div>
             <p className="text-[10px] font-black uppercase tracking-widest">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreMap;
