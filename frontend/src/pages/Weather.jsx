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
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 bg-[#f7f7f7] min-h-screen rounded-[2rem] border border-[#ebebeb] relative overflow-hidden">
      <Helmet><title>Weather Dashboard | GuideGo</title></Helmet>
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff385c]/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] -z-10" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
        <div>
          <h1 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ff385c] mb-1">Atmospheric Intelligence</h1>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#222222] tracking-tight">Weather Dashboard</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-xl">
           <form onSubmit={handleSearch} className="relative flex-grow shadow-sm">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#717171]" size={18} />
              <input 
                type="text" 
                placeholder="Search any city (e.g. Puri, London)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#dddddd] rounded-full pl-14 pr-6 py-4 text-[#222222] font-semibold placeholder:text-[#717171] outline-none focus:ring-2 focus:ring-[#ff385c]/20 focus:border-[#ff385c] transition-all"
              />
           </form>
           {weather && (
             <div className="bg-white px-6 py-4 rounded-full flex items-center gap-3 text-[#222222] border border-[#dddddd] shadow-sm">
                <MapPin size={16} className="text-[#ff385c]" />
                <span className="text-[11px] font-bold uppercase tracking-widest">{weather.current.loc}</span>
             </div>
           )}
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-[#ff385c]">
          <AlertCircle size={20} />
          <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
        </motion.div>
      )}

      {weather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Main Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white border border-[#ebebeb] p-8 md:p-12 rounded-[2rem] relative overflow-hidden flex flex-col justify-between min-h-[480px] shadow-sm"
          >
             <div className="absolute -right-16 -top-16 opacity-5 rotate-12 scale-125">
                {getWeatherIcon(weather.current.condition, 350)}
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="space-y-8">
                   <div className="flex items-center gap-2 text-[#717171]">
                      <Navigation size={14} className="text-[#ff385c]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Current Condition</span>
                   </div>
                   <div className="flex items-baseline gap-6">
                      <h3 className="text-[100px] md:text-[120px] font-extrabold text-[#222222] leading-none tracking-tighter">
                        {weather.current.temp}°
                      </h3>
                      <div className="space-y-1">
                        <span className="text-2xl font-black text-[#ff385c] uppercase tracking-tighter block">Celsius</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#f7f7f7] rounded-full border border-[#dddddd]">
                           <Sparkles size={12} className="text-amber-500"/>
                           <span className="text-[9px] font-bold text-[#717171] uppercase tracking-widest">Feels Real</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-5">
                      <div className="p-5 bg-[#f7f7f7] rounded-2xl border border-[#dddddd]">
                        {getWeatherIcon(weather.current.condition, 44)}
                      </div>
                      <div>
                        <p className="text-3xl font-extrabold text-[#222222] leading-none mb-2">{weather.current.condition}</p>
                        <p className="text-[11px] font-bold text-[#717171] uppercase tracking-widest">{weather.current.description}</p>
                      </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                   <WeatherStat icon={Droplets} label="Humidity" value={`${weather.current.humidity}%`} color="text-[#008489]" />
                   <WeatherStat icon={Wind} label="Wind Speed" value={`${weather.current.wind} km/h`} color="text-[#484848]" />
                </div>
             </div>

             <div className="border-t border-[#ebebeb] pt-10 mt-12 flex flex-wrap gap-12">
                <SunInfo icon={Sunrise} label="Sunrise" value={weather.current.sunrise} />
                <SunInfo icon={Sunset} label="Sunset" value={weather.current.sunset} />
             </div>
          </motion.div>

          {/* Forecast List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-[#ebebeb] p-8 rounded-[2rem] shadow-sm flex flex-col"
          >
             <div className="flex items-center gap-4 mb-8 pb-5 border-b border-[#ebebeb]">
                <CalendarDays className="text-[#ff385c]" size={20} />
                <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#222222]">5-Day Forecast</h4>
             </div>
             <div className="space-y-3 flex-grow">
                {weather.forecast.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#f7f7f7] rounded-2xl border border-[#dddddd] hover:border-[#ff385c]/30 transition-all cursor-default">
                     <span className="text-[11px] font-bold text-[#484848] uppercase tracking-widest w-12">{f.day}</span>
                     <div className="flex items-center gap-3">
                        {getWeatherIcon(f.condition, 20)}
                        <span className="text-[9px] font-bold text-[#717171] uppercase tracking-widest hidden sm:block">{f.condition}</span>
                     </div>
                     <div className="text-right">
                        <span className="text-lg font-extrabold text-[#222222]">{f.temp}°</span>
                     </div>
                  </div>
                ))}
             </div>
             <p className="mt-8 text-[9px] text-center font-bold text-[#b0b0b0] uppercase tracking-widest">Powered by OpenWeather API</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const WeatherStat = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-[#dddddd] flex flex-col items-center justify-center min-w-[140px] shadow-sm">
     <Icon size={24} className={`${color} mb-3`} />
     <p className="text-[10px] font-bold uppercase tracking-widest text-[#717171] mb-1">{label}</p>
     <p className="text-xl font-extrabold text-[#222222]">{value}</p>
  </div>
);

const SunInfo = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4">
     <div className="p-3 bg-[#f7f7f7] rounded-xl text-[#ff385c] border border-[#dddddd]">
        <Icon size={20} />
     </div>
     <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#717171] leading-none mb-1">{label}</p>
        <p className="text-lg font-extrabold text-[#222222]">{value}</p>
     </div>
  </div>
);

export default Weather;
