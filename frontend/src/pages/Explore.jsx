import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Info, Volume2, Square } from 'lucide-react';
import useAudioGuide from '../hooks/useAudioGuide';

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isPlaying, speak, stop } = useAudioGuide();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const { data } = await axios.get('/api/places');
        setPlaces(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Explore Places</h1>
          <p className="text-slate-600">Discover incredible destinations around you</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search places..."
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 md:w-80"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.length > 0 ? places.map((place) => (
            <div key={place._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="relative h-64">
                <img
                  src={place.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop'}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary-600 uppercase">
                  {place.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{place.name}</h3>
                <p className="text-slate-600 line-clamp-2 mb-4">{place.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                    <span>View on Map</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {place.audioGuideText && (
                      <button 
                        onClick={() => isPlaying ? stop() : speak(place.audioGuideText)}
                        className={`p-2 rounded-full transition-colors ${isPlaying ? 'bg-red-100 text-red-600' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}`}
                        title="Smart Audio Guide"
                      >
                        {isPlaying ? <Square className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    )}
                    <button className="text-primary-600 font-semibold flex items-center hover:translate-x-1 transition-transform">
                      Details <Info className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <p className="text-slate-500">No places found yet. Admin can add them soon!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;
