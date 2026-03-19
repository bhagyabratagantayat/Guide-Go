import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Star, Headset, 
  Sparkles, Heart, User,
  ArrowRight, Hotel, Utensils, HeartPulse, Navigation,
  Compass, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const destinations = [
    { 
      name: 'Jagannath Temple', 
      image: 'https://images.unsplash.com/photo-1548013146-72479768b70e?auto=format&fit=crop&q=80', 
      rating: 4.9, 
      location: 'Puri',
      description: 'The spiritual heart of Odisha, famous for its annual Rath Yatra.'
    },
    { 
      name: 'Konark Sun Temple', 
      image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&q=80', 
      rating: 4.8, 
      location: 'Konark',
      description: 'A 13th-century architectural marvel shaped like a giant chariot.'
    },
    { 
      name: 'Chilika Lake', 
      image: 'https://images.unsplash.com/photo-1589136142558-196020588661?auto=format&fit=crop&q=80', 
      rating: 4.7, 
      location: 'Chilika',
      description: 'Asia\'s largest salt water lagoon, home to Irrawaddy dolphins.'
    },
    { 
      name: 'Lingaraj Temple', 
      image: 'https://images.unsplash.com/photo-1590422444101-6c2e2e77b670?auto=format&fit=crop&q=80', 
      rating: 4.8, 
      location: 'Bhubaneswar',
      description: 'One of the oldest and largest temples in the Temple City.'
    },
  ];

  const cities = [
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=200&h=200&fit=crop' },
    { name: 'Delhi', image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe707?w=200&h=200&fit=crop' },
    { name: 'Bengaluru', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a593?w=200&h=200&fit=crop' },
    { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1603262110263-ce0158e9f338?w=200&h=200&fit=crop' },
    { name: 'Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657ece523?w=200&h=200&fit=crop' },
    { name: 'Varanasi', image: 'https://images.unsplash.com/photo-1561047029-3000c6812cbb?w=200&h=200&fit=crop' },
    { name: 'Bhubaneswar', image: 'https://images.unsplash.com/photo-1590733403305-675c9298585e?w=200&h=200&fit=crop' },
    { name: 'Puri', image: 'https://images.unsplash.com/photo-1524492459422-ad5193910f54?w=200&h=200&fit=crop' },
    { name: 'Konark', image: 'https://images.unsplash.com/photo-1590733403305-675c9298585e?w=200&h=200&fit=crop' },
  ];

  return (
    <div className="bg-[#f0f4f9] min-h-screen pb-32 pt-8">
      {/* Welcome Header */}
      <div className="px-6 mb-8 pt-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Hi {user ? user.name.split(' ')[0] : 'Traveler'} 👋
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Where would you like to explore today?
          </p>
        </motion.div>
      </div>

      {/* Modern Search Bar */}
      <div className="px-6 mb-10">
        <div className="relative flex items-center group">
          <Search className="absolute left-6 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search destinations, guides, places..." 
            className="w-full bg-white border-none rounded-[2rem] py-5 pl-16 pr-6 shadow-premium ring-1 ring-slate-100 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm font-medium placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* City Browse (WhatsApp Style) */}
      <section className="mb-12">
        <div className="flex justify-between items-center px-6 mb-4">
           <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Browse by City</h2>
        </div>
        <div className="flex overflow-x-auto gap-5 px-6 pb-2 no-scrollbar">
          {cities.map((city, idx) => (
            <Link key={idx} to={`/guides?city=${city.name}`} className="flex flex-col items-center space-y-2 group">
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 rounded-full p-1 border-2 border-primary-500 ring-2 ring-white shadow-soft group-hover:border-accent-500 transition-all"
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                </div>
              </motion.div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">{city.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="px-6 mb-12">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-800">Our Services</h2>
           <div className="w-8 h-1 bg-primary-500 rounded-full opacity-20" />
        </div>
        <div className="grid grid-cols-3 gap-y-8 gap-x-4">
          <ServiceItem icon={Compass} label="Guides" color="bg-blue-500" path="/guides" />
          <ServiceItem icon={MapPin} label="Map" color="bg-orange-500" path="/explore-map" />
          <ServiceItem icon={Headset} label="Audio Guide" color="bg-indigo-500" path="/explore" />
          
          <ServiceItem icon={Hotel} label="Hotels" color="bg-pink-500" path="/hotels" />
          <ServiceItem icon={Utensils} label="Food" color="bg-orange-600" path="/restaurants" />
          <ServiceItem icon={HeartPulse} label="Medical" color="bg-red-500" path="/emergency" />
          
          <ServiceItem icon={Sparkles} label="AI Plan" color="bg-teal-500" path="/ai-chat" />
          <ServiceItem icon={Navigation} label="Transport" color="bg-blue-600" path="/explore-map" />
          <ServiceItem icon={HelpCircle} label="Support" color="bg-slate-700" path="/support" />
        </div>
      </section>

      {/* Popular Odisha Section - Horizontal Scroll */}
      <div className="mb-12">
        <div className="px-6 flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Explore Odisha</h2>
          <button className="text-[11px] font-black text-primary-500 uppercase tracking-widest bg-primary-50 px-4 py-2 rounded-full">See All</button>
        </div>
        <div className="flex space-x-5 overflow-x-auto px-6 pb-6 no-scrollbar">
          {destinations.map((dest, idx) => (
            <motion.div 
              key={idx}
              whileTap={{ scale: 0.96 }}
              className="flex-shrink-0 w-72 bg-white rounded-[2.5rem] p-4 shadow-premium border border-white/50"
            >
              <div className="h-48 w-full rounded-[2rem] overflow-hidden mb-4 relative shadow-inner">
                <img src={dest.image} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" alt={dest.name} />
                <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md rounded-full p-2.5">
                   <Heart className="w-4 h-4 text-white" />
                </div>
                <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                   <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-bold text-white">{dest.rating}</span>
                   </div>
                </div>
              </div>
              <div className="px-1 space-y-1.5">
                <div className="flex items-center justify-between">
                   <h3 className="font-bold text-slate-900 text-lg leading-tight">{dest.name}</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                   {dest.description}
                </p>
                <div className="flex items-center space-x-1 text-primary-500 text-[10px] font-bold uppercase tracking-widest pt-2">
                   <MapPin className="w-3 h-3" />
                   <span>{dest.location}, Odisha</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceItem = ({ icon: Icon, label, color, path }) => (
  <Link to={path} className="group">
    <motion.div 
      whileTap={{ scale: 0.92 }}
      className="flex flex-col items-center space-y-3"
    >
      <div className={`w-16 h-16 ${color} rounded-[1.8rem] flex items-center justify-center text-white shadow-xl shadow-current/20 transition-all group-hover:rotate-6 group-hover:scale-105`}>
        <Icon className="w-7 h-7" />
      </div>
      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">{label}</span>
    </motion.div>
  </Link>
);

export default Home;
