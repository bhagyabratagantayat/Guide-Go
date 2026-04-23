import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, CloudRain, Cloud, Wind, Droplets, MapPin, 
  Navigation, Sunrise, Sunset, CalendarDays, Search,
  CloudLightning, CloudSnow, Loader2, AlertCircle, Sparkles
} from 'lucide-react';
import api from '../utils/api';
import { Helmet } from 'react-helmet-async';

const Weather = () => {
  const [city, setCity] = useState('Bhubaneswar');
  const [searchQuery, setSearchQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async (targetCity) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/weather/${targetCity}`);
      if (data.success) {
        setWeather(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery);
      setCity(searchQuery);
      setSearchQuery('');
    }
  };

  const getWeatherIcon = (condition, size = 24) => {
    const c = condition?.toLowerCase() || '';
    if (c.includes('sun') || c.includes('clear')) return <Sun size={size} className="text-amber-400" />;
    if (c.includes('rain')) return <CloudRain size={size} className="text-blue-400" />;
    if (c.includes('thunder')) return <CloudLightning size={size} className="text-purple-400" />;
    if (c.includes('snow')) return <CloudSnow size={size} className="text-slate-100" />;
    if (c.includes('wind')) return <Wind size={size} className="text-emerald-400" />;
    return <Cloud size={size} className="text-slate-400" />;
  };

  if (loading && !weather) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Retrieving Satellite Data...</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 bg-slate-950 min-h-screen rounded-[3rem] border border-white/5 relative overflow-hidden shadow-2xl">
      <Helmet><title>Weather Dashboard | GuideGo</title></Helmet>
      
      {/* Dynamic Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] -z-10" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 relative z-10">
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-2">Atmospheric Intelligence</h1>
          <h2 className="text-5xl font-black italic font-serif text-white tracking-tight">Weather Dashboard</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-xl">
           <form onSubmit={handleSearch} className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search any city (e.g. Puri, London)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white font-bold placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-all backdrop-blur-xl"
              />
           </form>
           {weather && (
             <div className="bg-blue-600/10 px-8 py-5 rounded-2xl flex items-center gap-3 text-blue-400 border border-blue-500/20 backdrop-blur-xl">
                <MapPin size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-0.5 whitespace-nowrap">{weather.current.loc}</span>
             </div>
           )}
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500">
          <AlertCircle size={24} />
          <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
        </motion.div>
      )}

      {weather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
          {/* Main Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-12 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between min-h-[450px] shadow-2xl backdrop-blur-xl"
          >
             <div className="absolute -right-20 -top-20 opacity-10 rotate-12 scale-150">
                {getWeatherIcon(weather.current.condition, 300)}
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="space-y-6">
                   <div className="flex items-center gap-2 text-slate-400">
                      <Navigation size={14} className="text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Local Condition</span>
                   </div>
                   <div className="flex items-baseline gap-6">
                      <h3 className="text-[100px] font-black text-white leading-none -ml-1 tracking-tighter shadow-blue-500/20 drop-shadow-2xl">
                        {weather.current.temp}°
                      </h3>
                      <div className="space-y-1">
                        <span className="text-2xl font-black text-blue-500 uppercase tracking-tighter block">Celsius</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                           <Sparkles size={12} className="text-amber-400"/>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Feels Real</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        {getWeatherIcon(weather.current.condition, 40)}
                      </div>
                      <div>
                        <p className="text-2xl font-black text-white italic font-serif leading-none mb-2">{weather.current.condition}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{weather.current.description}</p>
                      </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                   <WeatherStat icon={Droplets} label="Humidity" value={`${weather.current.humidity}%`} color="text-blue-400" />
                   <WeatherStat icon={Wind} label="Wind Speed" value={`${weather.current.wind} km/h`} color="text-emerald-400" />
                </div>
             </div>

             <div className="border-t border-white/5 pt-10 mt-12 flex flex-wrap gap-12">
                <SunInfo icon={Sunrise} label="Sunrise" value={weather.current.sunrise} />
                <SunInfo icon={Sunset} label="Sunset" value={weather.current.sunset} />
             </div>
          </motion.div>

          {/* Forecast List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl flex flex-col"
          >
             <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                <CalendarDays className="text-blue-500" size={24} />
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mt-1">5-Day Outlook</h4>
             </div>
             <div className="space-y-4 flex-grow">
                {weather.forecast.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
                     <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest w-12">{f.day}</span>
                     <div className="flex flex-col items-center gap-1">
                        {getWeatherIcon(f.condition, 20)}
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{f.condition}</span>
                     </div>
                     <div className="text-right">
                        <span className="text-xl font-black text-white">{f.temp}°</span>
                     </div>
                  </div>
                ))}
             </div>
             <p className="mt-8 text-[8px] text-center font-black text-slate-700 uppercase tracking-[0.4em]">Updated Live via OpenWeather</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const WeatherStat = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center min-w-[140px] backdrop-blur-md">
     <Icon size={24} className={`${color} mb-3`} />
     <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
     <p className="text-xl font-black text-white">{value}</p>
  </div>
);

const SunInfo = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-5">
     <div className="p-4 bg-white/5 rounded-2xl text-blue-500 border border-white/5">
        <Icon size={24} />
     </div>
     <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">{label}</p>
        <p className="text-lg font-black text-white italic font-serif">{value}</p>
     </div>
  </div>
);

export default Weather;
