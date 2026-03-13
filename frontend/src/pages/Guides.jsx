import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { User, Languages, DollarSign, Calendar } from 'lucide-react';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.2961, 85.8245]); // Default center
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

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
    // Detect user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setUserLocation([latitude, longitude]);
          fetchNearbyGuides(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to default fetch if location denied
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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      {/* Sidebar List */}
      <div className="w-full lg:w-[400px] bg-white/80 backdrop-blur-xl border-r border-slate-200 overflow-y-auto flex flex-col shadow-2xl z-10">
        <div className="p-8 sticky top-0 bg-white/40 backdrop-blur-md z-10 border-b border-slate-100">
          <div className="space-y-2">
            <h2 className="text-sm font-black text-secondary-500 uppercase tracking-widest">Available Experts</h2>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">LOCAL GUIDES</h1>
          </div>
          {userLocation ? (
            <div className="mt-6 flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100 w-fit">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Discovery Active</span>
            </div>
          ) : (
             <div className="mt-6 flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 w-fit">
              <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Global Search</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 space-y-6">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-3xl"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 pb-10">
              {guides.map((guide) => (
                <div 
                  key={guide._id} 
                  className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-secondary-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-5 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-secondary-100 p-1">
                        <div className="w-full h-full rounded-xl bg-white flex items-center justify-center text-secondary-600 font-black text-2xl uppercase overflow-hidden shadow-inner">
                          {guide.userId?.profilePicture ? (
                            <img src={guide.userId.profilePicture} alt={guide.userId.name} className="w-full h-full object-cover" />
                          ) : (
                            guide.userId?.name?.charAt(0) || 'G'
                          )}
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full p-1 shadow-lg">
                        <div className="w-full h-full bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none group-hover:text-secondary-600 transition-colors">
                        {guide.userId?.name || 'Local Guide'}
                      </h4>
                      <div className="flex items-center mt-2 space-x-3">
                        <div className="flex items-center text-xs font-black text-amber-500 uppercase tracking-tighter">
                          <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                          {guide.rating}
                        </div>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {guide.numReviews} Reviews
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Languages</p>
                      <p className="text-[10px] font-black text-slate-700 truncate">{guide.languages.join(', ')}</p>
                    </div>
                    <div className="bg-secondary-50 p-3 rounded-2xl border border-secondary-100">
                      <p className="text-[8px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">Pricing</p>
                      <p className="text-xs font-black text-secondary-700">₹{guide.pricePerHour}/hr</p>
                    </div>
                  </div>

                  <Link 
                    to={`/guides/${guide._id}`}
                    className="flex items-center justify-center w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                  >
                    View Profile
                  </Link>
                </div>
              ))}

              {guides.length === 0 && !loading && (
                <div className="text-center py-20 px-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 space-y-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-800 font-black uppercase text-xs tracking-widest">Distance Limit Reached</p>
                    <p className="text-slate-400 font-bold text-xs leading-relaxed">No expert guides were found in this specific area.</p>
                  </div>
                  <button 
                    onClick={() => userLocation && fetchNearbyGuides(userLocation[0], userLocation[1])}
                    className="pt-4 text-secondary-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-secondary-700 transition-colors"
                  >
                    Expand Search Range
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map Implementation */}
      <div className="flex-1 relative z-0">
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {guides.map((guide) => (
            <Marker key={guide._id} position={[guide.location.coordinates[1], guide.location.coordinates[0]]}>
              <Popup className="guide-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center space-x-3 mb-3 border-b pb-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold uppercase overflow-hidden">
                       {guide.userId?.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : (guide.userId?.name?.charAt(0) || 'G')}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 leading-tight">{guide.userId?.name || 'Local Guide'}</h5>
                      <span className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">Local Guide</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600 mb-3">
                    <p>⭐ {guide.rating} Rating</p>
                    <p>🗣️ {guide.languages.join(', ')}</p>
                    <p className="text-primary-700 font-bold mt-2">₹{guide.pricePerHour} per hour</p>
                  </div>
                  <Link 
                    to={`/guides/${guide._id}`}
                    className="block w-full text-center bg-primary-600 text-white py-1.5 rounded-lg text-[10px] font-bold hover:bg-primary-700 transition-colors"
                  >
                    View Full Profile
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
          {/* Re-center marker */}
          {userLocation && <Marker position={userLocation} icon={DefaultIcon} />}
        </MapContainer>
      </div>
    </div>
  );
};

const Star = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

export default Guides;
