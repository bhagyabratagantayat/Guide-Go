import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { MapPin, User, Star, Volume2, Info, Compass, Languages, DollarSign, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import useAudioGuide from '../hooks/useAudioGuide';
import useGuideTracking from '../hooks/useGuideTracking';

// Leaflet Icon Fix
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const PlaceIcon = L.divIcon({
  html: `<div class="bg-primary-600 p-2 rounded-full border-2 border-white shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const GuideIcon = L.divIcon({
  html: `<div class="bg-secondary-500 p-2 rounded-full border-2 border-white shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const ExploreMap = () => {
  const [places, setPlaces] = useState([]);
  const [guides, setGuides] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.2961, 85.8245]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isPlaying, speak, stop } = useAudioGuide();
  const { user } = useAuth();
  const { liveGuides } = useGuideTracking(user);

  const fetchData = async (lat, lng) => {
    try {
      const [placesRes, guidesRes] = await Promise.all([
        axios.get('/api/places'),
        axios.get(`/api/guides/nearby?lat=${lat}&lng=${lng}&distance=50000`)
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
          fetchData(20.2961, 85.8245);
        }
      );
    } else {
      fetchData(20.2961, 85.8245);
    }
    return () => stop();
  }, []);

  // Socket logic moved to useGuideTracking hook

  return (
    <div className="h-[calc(100vh-64px)] relative w-full overflow-hidden">
      {/* Map Content */}
      <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Tourist Places Markers */}
        {places.map((place) => (
          <Marker key={place._id} position={[place.latitude, place.longitude]} icon={PlaceIcon}>
            <Popup 
              className="premium-popup"
              onOpen={() => {
                if (guides.length === 0) {
                  speak(place.audioGuideText || place.description);
                }
              }}
            >
              <div className="p-3 min-w-[240px]">
                <div className="h-24 rounded-xl overflow-hidden mb-3 relative group/img">
                  <img src={place.images?.[0] || 'https://images.unsplash.com/photo-1524492459422-ad5193910f54'} alt={place.name} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => speak(place.audioGuideText || place.description)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Volume2 className="w-8 h-8 animate-pulse" />
                  </button>
                </div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-slate-900 text-lg leading-tight">{place.name}</h4>
                  <button 
                    onClick={() => speak(place.audioGuideText || place.description)}
                    className="p-1.5 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
                    title="Play Audio Guide"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{place.description}</p>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {place.category}
                  </span>
                  <Link to={`/explore-list`} className="text-xs font-bold text-slate-800 flex items-center hover:text-primary-600 transition-colors">
                    More Spots <Info className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Nearby Guides Markers */}
        {guides.map((guide) => {
          const livePos = liveGuides[guide._id] || liveGuides[guide.userId?._id];
          const position = livePos || [guide.location.coordinates[1], guide.location.coordinates[0]];
          
          return (
            <Marker key={guide._id} position={position} icon={GuideIcon}>
              <Popup className="premium-popup">
                <div className="p-3 min-w-[220px]">
                  <div className="flex items-center space-x-3 mb-3 pb-2 border-b">
                    <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center text-secondary-600 font-bold text-xl uppercase overflow-hidden shadow-inner">
                      {guide.userId.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : guide.userId.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">{guide.userId.name}</h4>
                      <div className="flex items-center text-[10px] text-yellow-500 font-bold">
                        <Star className="w-3 h-3 fill-yellow-500 mr-1" /> {guide.rating}
                      </div>
                      {livePos && (
                        <span className="text-[10px] text-green-600 font-black animate-pulse uppercase tracking-tighter">● Live Now</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    <p className="flex items-center"><Languages className="w-3 h-3 mr-2 text-secondary-500" /> {guide.languages.join(', ')}</p>
                    <p className="flex items-center font-bold text-green-700">₹{guide.pricePerHour}/hr</p>
                  </div>
                  <Link to={`/guides/${guide._id}`} className="block w-full py-2 bg-secondary-500 text-white rounded-lg text-[10px] font-bold text-center hover:bg-secondary-600 transition-colors shadow-lg shadow-secondary-200">
                    Book Guide
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* User Current Location */}
        {userLocation && <Marker position={userLocation} icon={DefaultIcon} />}
      </MapContainer>

      {/* Audio Playback Status Toast */}
      {isPlaying && (
        <div className="absolute top-20 right-6 z-[1000] bg-white border-2 border-primary-500 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-4 animate-in slide-in-from-right duration-300">
          <div className="flex space-x-1">
            <div className="w-1.5 h-4 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-6 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-1.5 h-4 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 uppercase">Audio Guide Playing</p>
            <p className="text-[10px] text-slate-500 font-bold">Listen to the story of this place...</p>
          </div>
          <button onClick={stop} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Controls Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-white/50 space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Places</span>
        </div>
        <div className="w-px h-4 bg-slate-300"></div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-secondary-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Guides</span>
        </div>
      </div>

      {/* Legend / Status Overlay */}
      <div className="absolute bottom-6 left-6 z-[1000]">
        {!loading && guides.length === 0 && (
          <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-4 border border-slate-100 animate-in fade-in slide-in-from-bottom duration-500">
            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">No guides available nearby.</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 right-6 z-[1000] space-y-3">
        {loading && (
          <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-4 flex items-center space-x-3 border border-slate-100 animate-pulse">
            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-slate-600">Discovering nearby...</span>
          </div>
        )}
        <button 
          onClick={() => userLocation && setMapCenter(userLocation)}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 text-slate-700 hover:text-primary-600 hover:-translate-y-1 transition-all"
          title="Recenter Map"
        >
          <Compass className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ExploreMap;
