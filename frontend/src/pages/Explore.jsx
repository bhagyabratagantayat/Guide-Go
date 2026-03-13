import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Info, Volume2, Square } from 'lucide-react';
import useAudioGuide from '../hooks/useAudioGuide';

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const { isPlaying, speak, stop, pause, resume, currentText } = useAudioGuide();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredPlaces = places.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="space-y-4">
          <h2 className="text-sm font-black text-primary-600 uppercase tracking-[0.3em]">Core Experience</h2>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">EXPLORE PLACES</h1>
          <p className="text-slate-500 font-bold max-w-md text-lg leading-relaxed">
            Discover the rich history and spiritual heritage of Odisha's most iconic destinations.
          </p>
        </div>
        
        <div className="relative group">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 pr-8 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-500 w-full md:w-96 shadow-xl shadow-slate-200/50 transition-all font-bold text-slate-700"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-primary-500 transition-colors" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[450px] bg-slate-100 animate-pulse rounded-[2.5rem]"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPlaces.length > 0 ? filteredPlaces.map((place) => {
            const isCurrentlyPlaying = isPlaying && currentText === place.audioGuideText;
            
            return (
              <div key={place._id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={place.image || place.images?.[0] || 'https://images.unsplash.com/photo-1524492459422-ad5193910f54'}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur shadow-xl border border-white px-4 py-1.5 rounded-full text-[10px] font-black text-primary-600 uppercase tracking-widest">
                    {place.category}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight group-hover:text-primary-600 transition-colors">{place.name}</h3>
                  <p className="text-slate-500 font-bold leading-relaxed line-clamp-2 mb-8 text-sm">{place.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center space-x-2">
                      {place.audioGuideText && (
                        <button 
                          onClick={() => isCurrentlyPlaying ? stop() : speak(place.audioGuideText)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-tighter transition-all ${
                            isCurrentlyPlaying 
                              ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                              : 'bg-primary-500 text-slate-900 hover:bg-primary-400 shadow-lg shadow-primary-200'
                          }`}
                        >
                          {isCurrentlyPlaying ? (
                            <>
                              <Square className="w-3 h-3 fill-current animate-pulse" />
                              <span>Stop Guide</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 fill-current" />
                              <span>Audio Guide</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setSelectedPlace(place)}
                      className="flex items-center text-xs font-black text-slate-800 uppercase tracking-widest hover:text-primary-600 transition-colors group/link"
                    >
                      Details 
                      <Info className="w-4 h-4 ml-1.5 transform group-hover/link:rotate-12 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4">
               <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                 <Search className="w-8 h-8 text-slate-400" />
               </div>
               <p className="text-slate-500 font-bold">No places matched your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setSelectedPlace(null)}
          ></div>
          
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 fade-in duration-300">
            <button 
              onClick={() => setSelectedPlace(null)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-full transition-all active:scale-95"
            >
              <Square className="w-5 h-5 fill-current" />
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* Left: Image */}
              <div className="lg:w-1/2 h-80 lg:h-auto relative">
                <img 
                  src={selectedPlace.image || selectedPlace.images?.[0] || 'https://images.unsplash.com/photo-1524492459422-ad5193910f54'} 
                  alt={selectedPlace.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10">
                  <span className="px-4 py-2 bg-primary-500 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    {selectedPlace.category}
                  </span>
                  <h2 className="text-4xl font-black text-white tracking-tighter mt-4">{selectedPlace.name}</h2>
                </div>
              </div>

              {/* Right: Info */}
              <div className="lg:w-1/2 p-10 lg:p-14">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-widest">History & Context</h4>
                    <p className="text-slate-600 font-bold leading-relaxed text-lg">
                      {selectedPlace.description}
                    </p>
                  </div>

                  {selectedPlace.audioGuideText && (
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                      <div className="flex items-center space-x-3">
                        <Volume2 className="w-6 h-6 text-primary-500 animate-pulse" />
                        <h4 className="text-sm font-black text-slate-900 uppercase">Interactive Audio Guide</h4>
                      </div>
                      
                      <p className="text-xs text-slate-500 font-bold leading-loose italic">
                        "{selectedPlace.audioGuideText.substring(0, 100)}..."
                      </p>

                      <div className="flex gap-4">
                        {(isPlaying && currentText === selectedPlace.audioGuideText) ? (
                          <>
                            <button 
                              onClick={pause}
                              className="flex-1 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-tighter hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-slate-200/50"
                            >
                              Pause
                            </button>
                            <button 
                              onClick={stop}
                              className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-tighter hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-200"
                            >
                              Stop
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => speak(selectedPlace.audioGuideText)}
                            className="flex-1 py-5 bg-primary-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-400 transition-all active:scale-95 shadow-2xl shadow-primary-500/30 flex items-center justify-center space-x-3"
                          >
                            <Volume2 className="w-5 h-5 fill-current" />
                            <span>Play Full Story</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {selectedPlace.latitude.toFixed(4)}, {selectedPlace.longitude.toFixed(4)}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedPlace(null)}
                      className="px-8 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
