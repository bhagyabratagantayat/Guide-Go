import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Search, Star, MessageSquare, ShieldCheck, Globe, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524492459422-ad5193910f54?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12 pt-12">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 backdrop-blur-md border border-primary-500/20 px-4 py-2 rounded-2xl">
              <Zap className="w-4 h-4 text-primary-400 fill-primary-400" />
              <span className="text-xs font-black text-primary-100 uppercase tracking-widest">Next-Gen Travel Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              EXPLORE BEYOND <br />
              <span className="text-primary-400">THE ORDINARY.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-xl font-medium leading-relaxed">
              Connect with expert local guides, discover hidden gems on our interactive map, and leverage Gemini AI to plan your dream itinerary in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
              <Link to="/explore-map" className="w-full sm:w-auto px-10 py-5 bg-primary-500 text-slate-900 rounded-[2rem] font-black text-lg hover:bg-primary-400 transition-all shadow-2xl shadow-primary-500/30 hover:-translate-y-1 active:scale-95 flex items-center justify-center">
                Start Exploring <Compass className="w-5 h-5 ml-3" />
              </Link>
              <Link to="/ai-chat" className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-[2rem] font-black text-lg hover:bg-white/20 transition-all flex items-center justify-center">
                Plan with AI <MessageSquare className="w-5 h-5 ml-3" />
              </Link>
            </div>

            <div className="flex items-center space-x-12 pt-8 border-t border-white/10">
              <div className="text-center sm:text-left">
                <p className="text-3xl font-black text-white">500+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expert Guides</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl font-black text-white">2k+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hidden Gems</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl font-black text-white">100%</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Assisted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center space-y-2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"></div>
          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Scroll to discover</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-primary-600 uppercase tracking-[0.3em]">Core Experience</h2>
              <p className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">WHY GUIDE GO?</p>
            </div>
            <p className="text-slate-500 font-bold max-w-md text-lg leading-relaxed">
              We've combined humanity with technology to create the ultimate companion for your travel adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/explore-map">
              <FeatureCard 
                icon={<Search className="w-8 h-8" />}
                title="Smart Discovery"
                desc="Real-time geo-location shows you exactly what's around you, from monuments to cafes."
                color="bg-blue-500"
              />
            </Link>
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Verified Experts"
              desc="Every guide on our platform is hand-vetted for local expertise and safety."
              color="bg-green-500"
            />
            <Link to="/ai-chat">
              <FeatureCard 
                icon={<MessageSquare className="w-8 h-8" />}
                title="AI Planning"
                desc="Tell our Gemini-powered assistant your interests and get a custom itinerary in seconds."
                color="bg-primary-500"
              />
            </Link>
            <Link to="/places">
              <FeatureCard 
                icon={<Globe className="w-8 h-8" />}
                title="Audio Guides"
                desc="No guide available? Our AI-generated audio stories bring locations to life instantly."
                color="bg-purple-500"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof CTA */}
      <section className="py-24 px-6 mb-20">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] overflow-hidden relative">
           <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-500 rounded-full blur-[100px]"></div>
           </div>
           <div className="relative z-10 p-12 lg:p-24 text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-widest">READY TO START?</h2>
              <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
                Join thousands of tourists who are already using GuideGo to transform their travel experiences.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                 <Link to="/register" className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-black hover:bg-primary-500 transition-all transform hover:-translate-y-1">
                   Create Free Account
                 </Link>
                 <Link to="/explore" className="px-12 py-5 border-2 border-white/20 text-white rounded-2xl font-black hover:bg-white/10 transition-all">
                   Explore Map First
                 </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color }) => (
  <div className="p-10 rounded-[2.5rem] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all group">
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl transform group-hover:-rotate-6 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-800 mb-4">{title}</h3>
    <p className="text-slate-500 font-bold leading-relaxed">{desc}</p>
  </div>
);

export default Home;
