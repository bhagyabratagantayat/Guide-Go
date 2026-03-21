import React from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudRain, Cloud, Wind, Droplets, MapPin, ChevronLeft, Navigation, Sunrise, Sunset, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockCurrentWeather = {
  temp: 28,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  location: 'Bhubaneswar, Odisha',
  time: '14:30 PM',
  sunrise: '05:42 AM',
  sunset: '18:15 PM'
};

const mockForecast = [
  { day: 'Mon', temp: 30, icon: Sun },
  { day: 'Tue', temp: 29, icon: Cloud },
  { day: 'Wed', temp: 26, icon: CloudRain },
  { day: 'Thu', temp: 27, icon: Wind },
  { day: 'Fri', temp: 31, icon: Sun },
];

const Weather = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-950 min-h-screen pb-32 pt-24 text-white font-sans overflow-x-hidden">
      
      {/* Header */}
      <div className="px-6 mb-10 max-w-7xl mx-auto flex items-center justify-between">
         <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)} 
              className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
            >
               <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-black tracking-tighter italic font-serif uppercase">Weather</h1>
         </div>
         <div className="bg-primary-500/20 px-4 py-2 rounded-xl flex items-center space-x-2 text-primary-400 border border-primary-500/30">
            <MapPin className="w-4 h-4" />
            <span className="font-bold text-sm">Live Location</span>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Current Weather Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 relative bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-12 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden"
        >
           {/* Decorative Background Icon */}
           <Sun className="absolute -right-16 -top-16 w-80 h-80 text-yellow-500/10 rotate-45" />

           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="space-y-4">
                 <div className="flex items-center space-x-2 text-slate-400 font-bold uppercase tracking-widest text-sm">
                    <Navigation className="w-4 h-4" />
                    <span>{mockCurrentWeather.location}</span>
                 </div>
                 
                 <div className="flex items-baseline space-x-4">
                    <h2 className="text-8xl font-black tracking-tighter">{mockCurrentWeather.temp}°</h2>
                    <span className="text-3xl font-medium text-slate-400">C</span>
                 </div>
                 
                 <p className="text-2xl font-bold text-slate-300">{mockCurrentWeather.condition}</p>
                 <p className="text-slate-500 font-medium">Updated today at {mockCurrentWeather.time}</p>
              </div>

              <div className="mt-8 md:mt-0 grid grid-cols-2 gap-4 w-full md:w-auto">
                 <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center min-w-[120px]">
                    <Droplets className="w-6 h-6 text-blue-400 mb-2" />
                    <span className="text-sm font-bold text-slate-400">Humidity</span>
                    <span className="text-lg font-black text-white">{mockCurrentWeather.humidity}%</span>
                 </div>
                 <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center min-w-[120px]">
                    <Wind className="w-6 h-6 text-teal-400 mb-2" />
                    <span className="text-sm font-bold text-slate-400">Wind</span>
                    <span className="text-lg font-black text-white">{mockCurrentWeather.windSpeed} km/h</span>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Sunrise/Sunset & Info */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
           className="bg-slate-900/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-between"
        >
           <h3 className="text-lg font-black uppercase tracking-widest text-slate-500 mb-6">Daylight</h3>
           <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                 <div className="flex items-center space-x-4">
                    <div className="bg-orange-500/20 p-3 rounded-xl">
                       <Sunrise className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-400">Sunrise</p>
                       <p className="text-xl font-black text-white">{mockCurrentWeather.sunrise}</p>
                    </div>
                 </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                 <div className="flex items-center space-x-4">
                    <div className="bg-indigo-500/20 p-3 rounded-xl">
                       <Sunset className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-400">Sunset</p>
                       <p className="text-xl font-black text-white">{mockCurrentWeather.sunset}</p>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* 5-Day Forecast */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
           className="lg:col-span-3 mt-4"
        >
           <div className="flex items-center space-x-2 mb-6 ml-2">
              <CalendarDays className="w-5 h-5 text-primary-500" />
              <h3 className="text-xl font-black uppercase tracking-widest">5-Day Forecast</h3>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {mockForecast.map((day, ix) => (
                 <div key={ix} className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer group">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">{day.day}</span>
                    <day.icon className="w-10 h-10 text-white mb-4 group-hover:scale-110 transition-transform text-slate-300" />
                    <span className="text-2xl font-black">{day.temp}°</span>
                 </div>
              ))}
           </div>
        </motion.div>

        {/* Travel Suggestions */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
           className="lg:col-span-3 bg-gradient-to-r from-primary-900/40 to-slate-900 p-8 rounded-[2.5rem] border border-primary-500/20 mt-4 flex flex-col md:flex-row items-center justify-between"
        >
           <div className="space-y-2 mb-6 md:mb-0">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white italic font-serif">Perfect weather for exploration</h3>
              <p className="text-slate-400 font-medium">The partly cloudy conditions are ideal for outdoor walking tours and visiting ancient heritage temples.</p>
           </div>
           <button 
             onClick={() => navigate('/user/explore-map')}
             className="w-full md:w-auto px-8 py-4 bg-primary-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-400 transition-colors shadow-xl shadow-primary-500/20 whitespace-nowrap"
           >
              Explore Map
           </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Weather;
