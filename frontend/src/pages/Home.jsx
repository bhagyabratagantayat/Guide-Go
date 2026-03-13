import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, MapPin, Search, Star, MessageSquare, 
  ShieldCheck, Globe, Zap, ArrowRight, Play, Heart
} from 'lucide-react';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-surface-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] lg:h-screen flex items-center pt-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-500/5 rounded-l-[10rem] -z-10 hidden lg:block"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100/50 rounded-full blur-[120px] -z-10"
        ></motion.div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-soft">
                <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-ping"></span>
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Next-Gen Travel Platform</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
                Discover <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">The Soul</span> <br />
                Of Travel.
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 max-w-xl font-medium leading-relaxed">
                Unlock local secrets with expert guides, interactive smart maps, and AI-powered itineraries tailored just for you.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <Link to="/explore-map" className="w-full sm:w-auto btn-primary flex items-center justify-center group overflow-hidden relative">
                  <span className="relative z-10 flex items-center">
                    Explore Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link to="/ai-chat" className="w-full sm:w-auto btn-secondary flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary-500" /> Plan with AI
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center space-x-8 pt-6">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-soft">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-500 flex items-center justify-center text-[10px] font-black text-white shadow-soft">
                    +2k
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-400">
                  <span className="text-slate-900 font-black">2,400+</span> Happy Explorers
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl skew-x-1 rotating-glow">
                 <img 
                   src="https://images.unsplash.com/photo-1544735049-71789c9730f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                   alt="Explore" 
                   className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                 <div className="absolute bottom-10 left-10 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                       <MapPin className="w-4 h-4 text-secondary-400" />
                       <span className="text-xs font-black uppercase tracking-widest">Puri, Odisha</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter italic font-serif">Island Dreams</h3>
                 </div>
              </div>

              {/* Float Cards */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 glass-card p-6 rounded-[2rem] shadow-premium z-20 flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-secondary-500 rounded-2xl flex items-center justify-center text-white">
                   <Star className="w-6 h-6 fill-white" />
                </div>
                <div>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Rating</p>
                   <p className="text-lg font-black text-slate-800 tracking-tighter">4.9/5.0</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="section-subtitle">Premium Experience</span>
            <h2 className="section-title">Revolutionizing The Way You Discover The World.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Search className="w-7 h-7" />}
              title="Smart Discovery"
              desc="Real-time proximity alerts for hidden gems nearby."
              color="text-blue-500"
              bg="bg-blue-50"
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-7 h-7" />}
              title="Vetted Guides"
              desc="Hand-picked local experts for authentic stories."
              color="text-green-500"
              bg="bg-green-50"
            />
            <FeatureCard 
              icon={<MessageSquare className="w-7 h-7" />}
              title="Gemini AI Planner"
              desc="Bespoke itineraries crafted by next-gen AI."
              color="text-primary-500"
              bg="bg-primary-50"
            />
            <FeatureCard 
              icon={<Play className="w-7 h-7 fill-purple-500" />}
              title="Audio Journeys"
              desc="Immersive audio guides for instant storytelling."
              color="text-purple-500"
              bg="bg-purple-50"
            />
          </div>
        </div>
      </section>

      {/* Highlights / Destinations */}
      <section className="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <span className="section-subtitle">Local Treasures</span>
            <h2 className="section-title uppercase tracking-tighter">Must-Visit Spots.</h2>
          </div>
          <Link to="/explore-list" className="group flex items-center space-x-2 text-primary-500 font-black uppercase text-sm tracking-widest hover:text-primary-600 transition-colors">
            <span>View all spots</span> <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <DestinationCard 
             image="https://images.unsplash.com/photo-1590733403305-675c9298585e?auto=format&fit=crop&w=800&q=80"
             name="Konark Sun Temple"
             tag="History"
             rating="4.9"
          />
          <DestinationCard 
             image="https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&w=800&q=80"
             name="Jagannath Puri"
             tag="Spiritual"
             rating="5.0"
          />
          <DestinationCard 
             image="https://images.unsplash.com/photo-1596402184320-417d7178a2cd?auto=format&fit=crop&w=800&q=80"
             name="Chilika Lake"
             tag="Nature"
             rating="4.8"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto rounded-[3.5rem] bg-slate-900 overflow-hidden relative p-12 lg:p-24 text-center">
            <div className="absolute inset-0 bg-primary-900/40 mix-blend-multiply"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 space-y-12">
               <motion.h2 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="text-4xl md:text-7xl font-black text-white tracking-widest leading-[1.1]"
               >
                 READY TO WRITE <br /> YOUR NEXT STORY?
               </motion.h2>
               <p className="max-w-xl mx-auto text-slate-300 text-lg font-medium opacity-80">
                  Join a community of 500+ local expert guides and 2,000+ happy travelers using the world's most advanced travel mapping system.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Link to="/register" className="px-10 py-5 bg-primary-500 text-white rounded-3xl font-black text-lg hover:bg-primary-600 shadow-xl shadow-primary-500/20 transform hover:-translate-y-1 transition-all">
                     Start For Free
                  </Link>
                  <Link to="/guides" className="px-10 py-5 border-2 border-white/20 text-white rounded-3xl font-black text-lg hover:bg-white/5 backdrop-blur-md transition-all">
                     View Local Guides
                  </Link>
               </div>
            </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color, bg }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-soft hover:shadow-premium transition-all group"
  >
    <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm font-bold leading-relaxed">{desc}</p>
  </motion.div>
);

const DestinationCard = ({ image, name, tag, rating }) => (
  <motion.div 
    whileHover={{ y: -15 }}
    className="group relative h-[420px] rounded-[3rem] overflow-hidden shadow-premium"
  >
    <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
    <div className="absolute top-6 left-6 flex space-x-2">
       <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
          {tag}
       </span>
    </div>
    <button className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-secondary-500 transition-colors">
       <Heart className="w-5 h-5" />
    </button>
    <div className="absolute bottom-10 left-8 right-8 flex justify-between items-end">
       <div className="space-y-1">
          <div className="flex items-center space-x-1 text-secondary-400 mb-2">
             <Star className="w-4 h-4 fill-secondary-400" />
             <span className="text-xs font-black text-white">{rating}</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tighter leading-none">{name}</h3>
          <p className="text-slate-300 text-xs font-bold uppercase tracking-widest opacity-60">Odisha, India</p>
       </div>
       <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white transform rotate-45 group-hover:rotate-0 transition-transform shadow-xl">
          <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform" />
       </div>
    </div>
  </motion.div>
);

export default Home;
