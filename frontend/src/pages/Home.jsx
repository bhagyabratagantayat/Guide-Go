import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, MapPin, Search, Star, MessageSquare, 
  Globe, Zap, ArrowRight, Play, Heart, Map, User, Navigation2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const quickActions = [
    { label: 'Find Guide', icon: User, path: '/guides', color: 'bg-blue-500' },
    { label: 'Explore Map', icon: Map, path: '/explore-map', color: 'bg-orange-500' },
    { label: 'Audio Guide', icon: Play, path: '/explore', color: 'bg-purple-500' },
    { label: 'Trip Planner', icon: Navigation2, path: '/ai-chat', color: 'bg-green-500' },
  ];

  return (
    <div className="mobile-container pt-8">
      {/* Header & Greeting */}
      <section className="px-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Welcome back,</p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic font-serif">
               Hello {user?.name?.split(' ')[0] || 'Traveler'} 👋
            </h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-soft">
             <Search className="w-6 h-6" />
          </div>
        </motion.div>
      </section>

      {/* Hero Search Bar */}
      <section className="px-6 mb-10">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-primary-500" />
          <input 
            type="text" 
            placeholder="Where do you want to explore?"
            className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-14 pr-6 py-5 focus:outline-none focus:border-primary-500 transition-all shadow-soft font-medium text-slate-700"
          />
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="px-6 mb-12">
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, idx) => (
            <Link key={idx} to={action.path}>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-soft flex flex-col items-center justify-center space-y-3 group hover:border-primary-100 transition-all"
              >
                <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                   <action.icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary-500">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Destinations - Horizontal Scroll */}
      <section className="mb-12">
        <div className="flex justify-between items-end px-6 mb-6">
           <h2 className="text-2xl font-black italic font-serif tracking-tight">Top Destinations</h2>
           <Link to="/explore" className="text-[10px] font-black text-primary-500 uppercase tracking-widest">View All</Link>
        </div>
        <div className="flex overflow-x-auto gap-6 px-6 pb-4 no-scrollbar">
           <DestinationCard 
             image="https://images.unsplash.com/photo-1590733403305-675c9298585e?auto=format&fit=crop&w=400&q=80"
             name="Konark Sun"
             location="Konark, India"
             rating="4.9"
           />
           <DestinationCard 
             image="https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&w=400&q=80"
             name="Jagannath Temple"
             location="Puri, India"
             rating="5.0"
           />
           <DestinationCard 
             image="https://images.unsplash.com/photo-1596402184320-417d7178a2cd?auto=format&fit=crop&w=400&q=80"
             name="Chilika Lake"
             location="Ganjam, India"
             rating="4.8"
           />
        </div>
      </section>

      {/* Nearby Guides */}
      <section className="px-6 pb-12">
        <div className="flex justify-between items-end mb-6">
           <h2 className="text-2xl font-black italic font-serif tracking-tight">Local Experts</h2>
           <Link to="/guides" className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Find Direct</Link>
        </div>
        <div className="space-y-4">
           <GuideRowCard 
             image="https://i.pravatar.cc/150?u=1"
             name="Rajesh R."
             role="Cultural Expert"
             rating="4.9"
             price="600"
           />
           <GuideRowCard 
             image="https://i.pravatar.cc/150?u=2"
             name="Deepika S."
             role="Heritage Guide"
             rating="4.8"
             price="550"
           />
           <GuideRowCard 
             image="https://i.pravatar.cc/150?u=3"
             name="Anil Kumar"
             role="Wildlife Pro"
             rating="4.7"
             price="700"
           />
        </div>
      </section>
    </div>
  );
};

const DestinationCard = ({ image, name, location, rating }) => (
  <Link to="/explore" className="flex-shrink-0 w-48 h-64 rounded-[2.5rem] relative overflow-hidden group shadow-premium">
    <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={name} />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
    <div className="absolute bottom-6 left-5">
      <div className="flex items-center space-x-1 text-secondary-400 mb-1">
         <Star className="w-3 h-3 fill-secondary-400" />
         <span className="text-[10px] font-black text-white">{rating}</span>
      </div>
      <h3 className="text-lg font-black text-white leading-none tracking-tight">{name}</h3>
      <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest">{location}</p>
    </div>
  </Link>
);

const GuideRowCard = ({ image, name, role, rating, price }) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-soft flex items-center space-x-4 group"
  >
    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary-50">
       <img src={image} className="w-full h-full object-cover" alt={name} />
    </div>
    <div className="flex-grow">
       <h4 className="text-base font-black text-slate-900 leading-tight">{name}</h4>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role}</p>
    </div>
    <div className="text-right">
       <div className="flex items-center space-x-1 text-secondary-500 justify-end mb-1">
          <Star className="w-3 h-3 fill-secondary-500" />
          <span className="text-xs font-black">{rating}</span>
       </div>
       <p className="text-xs font-black text-primary-500">₹{price}<span className="text-slate-400 font-bold">/hr</span></p>
    </div>
  </motion.div>
);

export default Home;
