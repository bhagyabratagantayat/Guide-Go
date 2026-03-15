import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Compass, MapPin, Search, Star, MessageSquare, 
  Globe, Zap, ArrowRight, Play, Heart, Map, User, Navigation2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const quickActions = [
    { label: t('home.find_guide'), icon: User, path: '/guides', color: 'bg-primary-500' },
    { label: t('home.explore_map'), icon: Map, path: '/explore-map', color: 'bg-accent-500' },
    { label: t('home.audio_guide'), icon: Play, path: '/explore', color: 'bg-slate-900' },
    { label: t('home.trip_planner'), icon: Navigation2, path: '/ai-chat', color: 'bg-secondary-500' },
  ];

  return (
    <div className="mobile-container pt-8 pb-12 bg-surface-50">
      {/* Header & Greeting */}
      <section className="px-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">
              {new Date().getHours() < 12 ? 'Suprabhat' : (new Date().getHours() < 18 ? 'Subha Aparanha' : 'Subha Sandhya')}
            </p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic font-serif">
               {user?.name?.split(' ')[0] ? t('home.greeting', { name: user.name.split(' ')[0] }) : 'Namaskar'} 🙏
            </h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-surface-200 flex items-center justify-center text-slate-400 shadow-soft">
             <Search className="w-5 h-5" />
          </div>
        </motion.div>
      </section>

      {/* Hero Search Bar */}
      <section className="px-6 mb-10">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 transition-colors group-focus-within:text-primary-500" />
          <input 
            type="text" 
            placeholder={t('home.search_placeholder')}
            className="input-field pl-14 shadow-soft"
          />
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="px-6 mb-12">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">{t('home.quick_actions')}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, idx) => (
            <Link key={idx} to={action.path}>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className="bg-white p-6 rounded-[2.5rem] border border-surface-100 shadow-soft flex flex-col items-center justify-center space-y-3 group hover:border-primary-200 transition-all"
              >
                <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                   <action.icon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary-500 transition-colors text-center">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Destinations */}
      <section className="mb-12">
        <div className="flex justify-between items-end px-6 mb-6">
           <h2 className="text-2xl font-black italic font-serif tracking-tight text-slate-900">{t('home.nearby_destinations') || 'Explore Odisha'}</h2>
           <Link to="/explore-map" className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:text-primary-600 transition-colors">Map View</Link>
        </div>
        <div className="flex overflow-x-auto gap-6 px-6 pb-4 no-scrollbar">
           <DestinationCard 
             image="https://images.unsplash.com/photo-1590733403305-675c9298585e?auto=format&fit=crop&w=600&q=80"
             name="Konark Sun"
             location="Konark, Odisha"
             rating="4.9"
           />
           <DestinationCard 
             image="https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&w=600&q=80"
             name="Jagannath Temple"
             location="Puri, Odisha"
             rating="5.0"
           />
           <DestinationCard 
             image="https://images.unsplash.com/photo-1596402184320-417d7178a2cd?auto=format&fit=crop&w=600&q=80"
             name="Chilika Lake"
             location="Satapada, Odisha"
             rating="4.8"
           />
        </div>
      </section>

      {/* Nearby Guides */}
      <section className="px-6 pb-12">
        <div className="flex justify-between items-end mb-6">
           <h2 className="text-2xl font-black italic font-serif tracking-tight text-slate-900">{t('home.nearby_guides')}</h2>
           <Link to="/guides" className="text-[10px] font-black text-primary-500 uppercase tracking-widest">See All</Link>
        </div>
        <div className="space-y-4">
           {[1, 2, 3].map((i) => (
             <GuideRowCard 
               key={i}
               image={`https://i.pravatar.cc/150?u=${i + 10}`}
               name={['Rajesh Mishra', 'Deepika Patnaik', 'Arjun Biswal'][i-1]}
               role={['Cultural Heritage Expert', 'Temple History Expert', 'Wildlife Specialist'][i-1]}
               rating={(4.7 + i * 0.1).toFixed(1)}
               price={[600, 550, 700][i-1]}
             />
           ))}
        </div>
      </section>
    </div>
  );
};

const DestinationCard = ({ image, name, location, rating }) => (
  <Link to="/explore-map" className="flex-shrink-0 w-56 h-72 rounded-[2.5rem] relative overflow-hidden group shadow-premium transition-transform duration-500 active:scale-95">
    <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={name} />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
    <div className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
       <Heart className="w-5 h-5" />
    </div>
    <div className="absolute bottom-6 left-6 right-6">
      <div className="flex items-center space-x-1.5 text-primary-400 mb-2">
         <Star className="w-3.5 h-3.5 fill-primary-400" />
         <span className="text-xs font-black text-white">{rating}</span>
      </div>
      <h3 className="text-xl font-black text-white leading-tight tracking-tight italic font-serif">{name}</h3>
      <div className="flex items-center space-x-1 mt-1">
         <MapPin className="w-3 h-3 text-white/60" />
         <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">{location}</p>
      </div>
    </div>
  </Link>
);

const GuideRowCard = ({ image, name, role, rating, price }) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    className="bg-white p-5 rounded-[2.5rem] border border-surface-100 shadow-soft flex items-center space-x-4 group hover:border-primary-100 transition-all"
  >
    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary-50 ring-4 ring-primary-500/5">
       <img src={image} className="w-full h-full object-cover" alt={name} />
    </div>
    <div className="flex-grow">
       <h4 className="text-base font-black text-slate-900 leading-tight">{name}</h4>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{role}</p>
       <div className="flex items-center space-x-2 mt-2">
          <div className="flex items-center space-x-1 text-primary-500">
             <Star className="w-3 h-3 fill-primary-500" />
             <span className="text-xs font-black">{rating}</span>
          </div>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <p className="text-xs font-black text-slate-900">₹{price}<span className="text-slate-400 font-bold">/hr</span></p>
       </div>
    </div>
    <button className="w-10 h-10 rounded-2xl bg-secondary-50 text-secondary-500 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
       <ArrowRight className="w-5 h-5" />
    </button>
  </motion.div>
);

export default Home;
