import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Star, Headset, 
  Sparkles, Heart, Menu, User,
  ArrowRight, Hotel, Utensils, HeartPulse, Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import logo from '../assets/GuideGo Logo.jpeg';

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const destinations = [
    { name: 'Jagannath Temple', image: 'https://images.unsplash.com/photo-1548013146-72479768b70e?auto=format&fit=crop&q=80', rating: 4.9, location: 'Puri' },
    { name: 'Konark Sun Temple', image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&q=80', rating: 4.8, location: 'Konark' },
    { name: 'Chilika Lake', image: 'https://images.unsplash.com/photo-1589136142558-196020588661?auto=format&fit=crop&q=80', rating: 4.7, location: 'Chilika' },
  ];

  const nearbyGuides = [
    { id: 1, name: 'Ananya Mishra', rating: 4.9, price: 500, trips: 124, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80' },
    { id: 2, name: 'Rahul Das', rating: 4.8, price: 400, trips: 89, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="bg-surface-50 min-h-screen pb-24 pt-10">
      {/* Top Header */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-soft ring-1 ring-slate-100">
             <Menu className="w-5 h-5 text-slate-400" />
          </div>
          <img src={logo} alt="GuideGo" className="h-10 w-10 object-cover rounded-full ring-2 ring-primary-500/20 shadow-lg" />
          <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-soft ring-1 ring-slate-100 overflow-hidden">
             {user?.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-slate-400" />}
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            Hi, {user ? user.name.split(' ')[0] : 'Explorer'} 👋
          </h1>
          <p className="text-sm text-slate-400 font-medium">Where would you like to go?</p>
        </motion.div>
      </div>

      {/* Modern Search Bar */}
      <div className="px-6 mb-8">
        <div className="relative flex items-center group">
          <Search className="absolute left-5 text-slate-300 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search destination, guides..." 
            className="w-full bg-white border-transparent rounded-[2rem] py-5 pl-14 pr-6 shadow-soft ring-1 ring-slate-100 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Super App Services Grid */}
      <div className="px-6 mb-10">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-900">Our Services</h2>
           <Sparkles className="w-5 h-5 text-primary-500 animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ServiceItem icon={Search} label="Guides" color="bg-primary-500" path="/guides" />
          <ServiceItem icon={MapPin} label="Map" color="bg-orange-500" path="/explore-map" />
          <ServiceItem icon={Headset} label="Audio" color="bg-indigo-500" path="/explore" />
          
          <ServiceItem icon={Hotel} label="Hotels" color="bg-pink-500" path="/hotels" />
          <ServiceItem icon={Utensils} label="Food" color="bg-orange-600" path="/restaurants" />
          <ServiceItem icon={HeartPulse} label="Medical" color="bg-red-500" path="/emergency" />
          
          <ServiceItem icon={Sparkles} label="AI Plan" color="bg-teal-500" path="/ai-chat" />
          <ServiceItem icon={Navigation} label="Transport" color="bg-blue-500" path="/explore-map" />
          <ServiceItem icon={Headset} label="Support" color="bg-slate-900" path="/support" />
        </div>
      </div>

      {/* Top Destinations Horizontal Scroller */}
      <div className="mb-10">
        <div className="px-6 flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Explore Odisha</h2>
          <button className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">See All</button>
        </div>
        <div className="flex space-x-4 overflow-x-auto px-6 pb-4 no-scrollbar">
          {destinations.map((dest, idx) => (
            <motion.div 
              key={idx}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 w-48 bg-white rounded-[2.5rem] p-3 shadow-soft ring-1 ring-slate-100"
            >
              <div className="h-44 w-full rounded-[2rem] overflow-hidden mb-3 relative">
                <img src={dest.image} className="w-full h-full object-cover" alt={dest.name} />
                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md rounded-full p-2">
                   <Heart className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="px-1">
                <h3 className="font-bold text-slate-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{dest.name}</h3>
                <div className="flex items-center space-x-1 text-slate-300 text-[10px] mt-0.5 font-bold uppercase tracking-wider">
                   <MapPin className="w-2.5 h-2.5 text-primary-500" />
                   <span>{dest.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Verified Nearby Guides List */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Featured Guides</h2>
          <button className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">View All</button>
        </div>
        <div className="space-y-4">
          {nearbyGuides.map((guide, idx) => (
            <Link key={idx} to={`/guide/${guide.id}`}>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-[2.5rem] p-4 flex items-center space-x-4 shadow-soft ring-1 ring-slate-100"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary-100">
                  <img src={guide.image} className="w-full h-full object-cover" alt={guide.name} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-slate-900 text-sm">{guide.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-yellow-50 rounded-full">
                       <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                       <span className="text-[10px] font-bold text-yellow-700">{guide.rating}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{guide.trips} Trips</span>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-0.5">Price</p>
                   <p className="text-sm font-black text-primary-500">₹{guide.price}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceItem = ({ icon: Icon, label, color, path }) => (
  <Link to={path}>
    <motion.div 
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center space-y-3"
    >
      <div className={`w-16 h-16 ${color} rounded-3xl flex items-center justify-center text-white shadow-lg shadow-current/10 transition-transform hover:scale-105 active:scale-95`}>
        <Icon className="w-7 h-7" />
      </div>
      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-center">{label}</span>
    </motion.div>
  </Link>
);

export default Home;
