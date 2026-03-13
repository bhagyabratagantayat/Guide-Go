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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full lg:w-1/3 p-6 overflow-y-auto bg-white border-r border-slate-200">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800">Nearby Guides</h2>
          {userLocation && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Location Active
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {guides.map((guide) => (
              <div 
                key={guide._id} 
                className="p-4 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl uppercase overflow-hidden">
                    {guide.userId.profilePicture ? (
                      <img src={guide.userId.profilePicture} alt={guide.userId.name} className="w-full h-full object-cover" />
                    ) : (
                      guide.userId.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">{guide.userId.name}</h4>
                    <div className="flex items-center text-sm text-slate-500">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span>{guide.rating} ({guide.numReviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center"><Languages className="w-4 h-4 mr-2 text-primary-500" /> {guide.languages.join(', ')}</div>
                  <div className="flex items-center font-bold text-slate-800 text-lg mt-2"><DollarSign className="w-5 h-5 mr-1 text-green-600" /> ₹{guide.pricePerHour}/hr</div>
                </div>
                <Link 
                  to={`/guides/${guide._id}`}
                  className="block w-full text-center mt-4 btn-primary py-2 rounded-xl text-sm font-semibold shadow-md active:scale-95 transition-transform"
                >
                  View Profile & Book
                </Link>
              </div>
            ))}
            {guides.length === 0 && !loading && (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500">No guides found nearby.</p>
                <button 
                  onClick={() => userLocation && fetchNearbyGuides(userLocation[0], userLocation[1])}
                  className="mt-4 text-primary-600 text-sm font-bold hover:underline"
                >
                  Refresh Search
                </button>
              </div>
            )}
          </div>
        )}
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
                       {guide.userId.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : guide.userId.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 leading-tight">{guide.userId.name}</h5>
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
