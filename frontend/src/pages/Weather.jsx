import React from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudRain, Cloud, Wind, Droplets, MapPin, Navigation, Sunrise, Sunset, CalendarDays } from 'lucide-react';

const Weather = () => {
  const current = {
    temp: 28, 
    condition: 'Partly Cloudy', 
    humidity: 65, 
    wind: 12, 
    loc: 'Bhubaneswar, Odisha',
    sunrise: '05:42 AM', 
    sunset: '18:15 PM'
  };

  const forecast = [
    { day: 'Mon', temp: 30, icon: Sun },
    { day: 'Tue', temp: 29, icon: Cloud },
    { day: 'Wed', temp: 26, icon: CloudRain },
    { day: 'Thu', temp: 27, icon: Wind },
    { day: 'Fri', temp: 31, icon: Sun },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 bg-[var(--bg-base)] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] mb-2">Climate Insights</h1>
          <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">Weather Forecast</h2>
        </div>
        <div className="bg-[var(--accent-bg)] px-6 py-3 rounded-[var(--radius-md)] flex items-center gap-3 text-[var(--accent)] border border-[var(--border-color)]">
           <MapPin size={16} />
           <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">{current.loc}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Card */}
        <motion.div 
          className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-12 rounded-[var(--radius-lg)] relative overflow-hidden flex flex-col justify-between min-h-[400px] group hover:border-[var(--border-hover)] transition-all"
        >
           <Sun className="absolute -right-12 -top-12 w-64 h-64 text-[var(--accent)] opacity-5 rotate-12" />
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start">
              <div className="space-y-6">
                 <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Navigation size={14} className="text-[var(--accent)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{current.loc}</span>
                 </div>
                 <div className="flex items-baseline gap-4">
                    <h3 className="text-[72px] font-bold text-[var(--text-primary)] leading-none -ml-1 tracking-tighter">{current.temp}°</h3>
                    <span className="text-3xl font-bold text-[var(--text-secondary)]">Celsius</span>
                 </div>
                 <p className="text-[16px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.2em]">{current.condition}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto mt-8 md:mt-0">
                 <WeatherStat icon={Droplets} label="Humidity" value={`${current.humidity}%`} />
                 <WeatherStat icon={Wind} label="Wind" value={`${current.wind} km/h`} />
              </div>
           </div>

           <div className="border-t border-[var(--border-color)] pt-8 mt-12 flex flex-wrap gap-12">
              <SunInfo icon={Sunrise} label="Sunrise" value={current.sunrise} />
              <SunInfo icon={Sunset} label="Sunset" value={current.sunset} />
           </div>
        </motion.div>

        {/* Forecast List */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-10 rounded-[var(--radius-lg)] group hover:border-[var(--border-hover)] transition-all space-y-8">
           <div className="flex items-center gap-3">
              <CalendarDays className="text-[var(--accent)]" size={20} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mt-1">Weekly Outlook</h4>
           </div>
           <div className="divide-y divide-[var(--border-color)]">
              {forecast.map((f, i) => (
                <div key={i} className="flex items-center justify-between py-5 group/row hover:bg-white/[0.02] transition-all px-2 rounded-xl">
                   <span className="text-sm font-bold text-[var(--text-primary)] w-12">{f.day}</span>
                   <f.icon size={20} className="text-[var(--accent)]" />
                   <span className="text-sm font-medium text-[var(--text-primary)] w-12 text-right">{f.temp}°</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const WeatherStat = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center min-w-[120px]">
       <Icon size={24} className={`${color} mb-3`} />
       <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">{label}</p>
       <p className="text-xl font-black text-white">{value}</p>
    </div>
  );
};

const SunInfo = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-4">
       <div className="p-3 bg-white/5 rounded-2xl text-[var(--text-secondary)]">
          <Icon size={20} />
       </div>
       <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] leading-none mb-1">{label}</p>
          <p className="text-lg font-black text-white italic font-serif">{value}</p>
       </div>
    </div>
  );
};

export default Weather;
