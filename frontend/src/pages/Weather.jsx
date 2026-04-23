import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, CloudRain, Cloud, Wind, Droplets, MapPin, 
  Navigation, Sunrise, Sunset, CalendarDays, Loader2,
  CloudLightning, CloudSnow, CloudFog
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const API_KEY = '8738efe202ebcdb3b3c1a3af42d52c06';

const Weather = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      // Get user location from profile or default to Bhubaneswar
      const userData = JSON.parse(localStorage.getItem('gg_user'));
      const city = userData?.location?.split(',')[0] || 'Bhubaneswar';

      // 1. Fetch Current Weather
      const currentRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      
      // 2. Fetch 5 Day / 3 Hour Forecast (Free API usually provides this)
      const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);

      // Process current weather
      const current = currentRes.data;
      setWeatherData({
        temp: Math.round(current.main.temp),
        condition: current.weather[0].description,
        mainCondition: current.weather[0].main,
        humidity: current.main.humidity,
        wind: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
        loc: `${current.name}, ${current.sys.country}`,
        sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Process forecast (Group by day and get noon temperature)
      const dailyData = [];
      const seenDates = new Set();
      
      forecastRes.data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!seenDates.has(date) && dailyData.length < 5) {
          seenDates.add(date);
          dailyData.push({
            day: new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short' }),
            temp: Math.round(item.main.temp),
            main: item.weather[0].main
          });
        }
      });
      setForecastData(dailyData);
      
      setLoading(false);
    } catch (err) {
      console.error('Weather Fetch Error:', err);
      setError('Unable to load weather data. Please check your location settings.');
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition, size = 24) => {
    switch (condition?.toLowerCase()) {
      case 'clear': return <Sun size={size} className="text-amber-500" />;
      case 'clouds': return <Cloud size={size} className="text-blue-400" />;
      case 'rain': 
      case 'drizzle': return <CloudRain size={size} className="text-blue-500" />;
      case 'thunderstorm': return <CloudLightning size={size} className="text-purple-500" />;
      case 'snow': return <CloudSnow size={size} className="text-sky-200" />;
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'fog': return <CloudFog size={size} className="text-slate-400" />;
      default: return <Cloud size={size} className="text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
           <Loader2 size={48} className="text-blue-600 animate-spin mx-auto" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Syncing Climate Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 bg-slate-950 min-h-screen rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
      <Helmet><title>Weather | GuideGo</title></Helmet>
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Climate Insights</h1>
          <h2 className="text-5xl font-black italic font-serif text-white tracking-tight">Weather Forecast</h2>
        </div>
        <div className="bg-white/5 backdrop-blur-xl px-8 py-4 rounded-2xl flex items-center gap-4 text-blue-400 border border-white/10 shadow-2xl">
           <MapPin size={20} />
           <span className="text-[12px] font-black uppercase tracking-widest leading-none">{weatherData?.loc}</span>
        </div>
      </div>

      {error ? (
        <div className="p-20 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] text-center space-y-4">
           <h3 className="text-xl font-bold text-red-500">{error}</h3>
           <button onClick={fetchWeather} className="text-white bg-red-500 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Retry Connection</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
          {/* Main Current Weather Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-slate-900/40 border border-white/10 p-12 rounded-[3rem] relative overflow-hidden flex flex-col justify-between min-h-[450px] group backdrop-blur-3xl shadow-2xl"
          >
             {/* Large background icon */}
             <div className="absolute -right-20 -top-20 opacity-5 group-hover:rotate-12 transition-transform duration-[2s]">
                {getWeatherIcon(weatherData?.mainCondition, 400)}
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="space-y-8">
                   <div className="flex items-center gap-3 text-slate-400">
                      <Navigation size={16} className="text-blue-500" />
                      <span className="text-[11px] font-black uppercase tracking-widest leading-none">{weatherData?.loc}</span>
                   </div>
                   <div className="flex items-baseline gap-6">
                      <h3 className="text-8xl font-black text-white leading-none -ml-1 tracking-tighter drop-shadow-2xl">{weatherData?.temp}°</h3>
                      <span className="text-4xl font-bold text-slate-500 italic font-serif">Celsius</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-2xl">{getWeatherIcon(weatherData?.mainCondition, 32)}</div>
                      <p className="text-2xl font-black text-white uppercase tracking-[0.2em]">{weatherData?.condition}</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
                   <WeatherStat icon={Droplets} label="Humidity" value={`${weatherData?.humidity}%`} color="text-blue-500" />
                   <WeatherStat icon={Wind} label="Wind" value={`${weatherData?.wind} km/h`} color="text-emerald-500" />
                </div>
             </div>

             <div className="border-t border-white/5 pt-10 mt-12 flex flex-wrap gap-16 relative z-10">
                <SunInfo icon={Sunrise} label="Sunrise" value={weatherData?.sunrise} color="text-amber-500" />
                <SunInfo icon={Sunset} label="Sunset" value={weatherData?.sunset} color="text-orange-500" />
             </div>
          </motion.div>

          {/* Weekly Outlook Card */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-slate-900/60 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl flex flex-col"
          >
             <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><CalendarDays size={24}/></div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mt-1">Weekly Outlook</h4>
             </div>
             
             <div className="space-y-2 flex-grow">
                {forecastData.map((f, i) => (
                  <div key={i} className="flex items-center justify-between py-6 group/row hover:bg-white/5 transition-all px-6 rounded-3xl border border-transparent hover:border-white/5">
                     <span className="text-[13px] font-black text-white w-14 uppercase tracking-widest">{f.day}</span>
                     <div className="flex-grow flex justify-center">
                        {getWeatherIcon(f.main, 24)}
                     </div>
                     <div className="w-14 text-right">
                        <span className="text-xl font-black text-white">{f.temp}°</span>
                     </div>
                  </div>
                ))}
             </div>

             <div className="mt-10 p-6 bg-blue-600/10 rounded-3xl border border-blue-500/20 text-center">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-relaxed">
                   Live Data Powered by OpenWeather Engine
                </p>
             </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const WeatherStat = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center min-w-[140px] shadow-xl group/stat hover:bg-white/10 transition-all">
     <Icon size={28} className={`${color} mb-4 group-hover/stat:scale-110 transition-transform`} />
     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</p>
     <p className="text-2xl font-black text-white">{value}</p>
  </div>
);

const SunInfo = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-6 group/sun">
     <div className={`p-4 bg-white/5 rounded-2xl ${color} group-hover/sun:bg-white/10 transition-all`}>
        <Icon size={24} />
     </div>
     <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none mb-2">{label}</p>
        <p className="text-2xl font-black text-white italic font-serif leading-none">{value}</p>
     </div>
  </div>
);

export default Weather;
