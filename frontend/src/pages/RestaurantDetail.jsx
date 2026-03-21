import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, MapPin, CheckCircle, Clock, CheckCircle2, Utensils, Send, Share2 } from 'lucide-react';
import { mockRestaurants } from '../data/mockRestaurants';
import toast, { Toaster } from 'react-hot-toast';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    guests: 2,
    date: '',
    time: ''
  });
  const [bookingStatus, setBookingStatus] = useState('idle');

  useEffect(() => {
    const timer = setTimeout(() => {
       const found = mockRestaurants.find(r => r.id === id);
       setRestaurant(found || mockRestaurants[0]);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  const handleReservation = (e) => {
    e.preventDefault();
    setBookingStatus('submitting');
    
    setTimeout(() => {
       setBookingStatus('success');
       toast.success('Table Reserved Successfully!', {
          style: { background: '#f97316', color: '#fff', padding: '16px', borderRadius: '1rem', fontWeight: 'bold' },
          iconTheme: { primary: '#fff', secondary: '#f97316' }
       });
       
       setTimeout(() => {
          setBookingStatus('idle');
          setFormData({ name: '', guests: 2, date: '', time: '' });
       }, 3000);
    }, 2000);
  };

  if (!restaurant) return (
     <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-xl shadow-orange-500/20 mb-6" />
        <h2 className="text-xl font-black text-white italic font-serif tracking-widest uppercase">Opening Kitchen...</h2>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-32 text-white font-sans overflow-x-hidden transition-colors duration-300">
      <Toaster position="top-center" />
      
      {/* Immersive Hero Header */}
      <div className="relative h-[55vh] lg:h-[70vh] w-full overflow-hidden">
        <img 
          src={restaurant.bannerUrl} 
          className="w-full h-full object-cover scale-105 transform origin-center" 
          alt={restaurant.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        {/* Navigation Overlays */}
        <div className="absolute top-12 left-6 right-6 flex items-center justify-between z-10 max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all shadow-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all shadow-xl">
             <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Branding Container */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 z-10 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
               <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-xl ${restaurant.isOpen ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}>
                  {restaurant.isOpen ? 'Open Now' : 'Closed'}
               </div>
               <div className="bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-white flex items-center text-[10px] font-black uppercase tracking-widest shadow-xl">
                  <Star className="w-4 h-4 fill-orange-500 text-orange-500 mr-2" />
                  {restaurant.rating} <span className="text-slate-400 ml-2">({restaurant.reviewsCount} Reviews)</span>
               </div>
               <div className="bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-slate-300 flex items-center text-[10px] font-black uppercase tracking-widest">
                  <MapPin className="w-4 h-4 text-orange-500 mr-2" />
                  {restaurant.address.split(',')[0]}
               </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic font-serif tracking-tighter leading-[0.9]">{restaurant.name}</h1>
            <p className="mt-4 text-lg font-black text-orange-400 uppercase tracking-widest">{restaurant.category} • {restaurant.priceLevel}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Core Detail Column */}
        <div className="lg:col-span-8 space-y-12">
           
           {/* Section: About */}
           <section className="space-y-6">
              <h3 className="text-2xl font-black text-white italic font-serif flex items-center gap-3">
                 <Utensils className="w-6 h-6 text-orange-500" /> The Culinary Vision
              </h3>
              <p className="text-slate-400 leading-relaxed font-medium text-lg">{restaurant.description}</p>
              
              <div className="mt-8 flex flex-wrap gap-3">
                 {restaurant.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl shadow-inner">
                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{feature}</span>
                    </div>
                 ))}
              </div>
           </section>

           {/* Section: Menu Highlights */}
           <section className="space-y-8 bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-800 shadow-xl overflow-hidden relative group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-[50px] group-hover:bg-orange-500/20 transition-all pointer-events-none" />
              
              <h3 className="text-3xl font-black text-white italic font-serif tracking-tight">
                 Chef's Highlights
              </h3>
              
              <div className="space-y-4 relative z-10">
                 {restaurant.menuHighlights.map((item, idx) => (
                    <div key={idx} className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl hover:border-orange-500/50 transition-all group flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm">
                       <div>
                          <h4 className="text-xl font-bold text-white mb-2 leading-tight flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> {item.name}
                          </h4>
                          <p className="text-slate-500 text-sm font-medium">{item.description}</p>
                       </div>
                       <div className="text-3xl font-black tracking-tighter text-white shrink-0">
                          ₹{item.price}
                       </div>
                    </div>
                 ))}
              </div>
           </section>
           
           {/* Section: Operational Timeline */}
           <section className="flex flex-col sm:flex-row gap-6">
              <div className="bg-slate-900 p-8 border border-slate-800 rounded-[2.5rem] flex-1 flex items-start gap-5">
                 <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-orange-400" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Operating Hours</p>
                    <p className="font-bold text-white whitespace-pre-line">{restaurant.hours.replace(', ', '\n')}</p>
                 </div>
              </div>
              
              <div className="bg-slate-900 p-8 border border-slate-800 rounded-[2.5rem] flex-1 flex items-start gap-5">
                 <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-orange-400" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Navigation Profile</p>
                    <p className="font-bold text-white">{restaurant.address}</p>
                 </div>
              </div>
           </section>

        </div>

        {/* Dynamic Reservation Form Column */}
        <div className="lg:col-span-4 relative h-fit">
           <div className="sticky top-28 bg-orange-600 border border-orange-500 shadow-[0_20px_50px_rgba(249,115,22,0.4)] rounded-[3rem] p-8 overflow-hidden z-20">
              
              <div className="mb-8 text-center text-slate-950">
                 <h2 className="text-3xl font-black italic font-serif leading-none">Reserve A Table</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mt-3">Priority Seating Access</p>
              </div>

              {bookingStatus === 'success' ? (
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center flex flex-col items-center text-white">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-xl">
                       <CheckCircle className="w-10 h-10 text-orange-500 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black italic font-serif text-slate-950">Table Reserved</h3>
                    <p className="text-slate-900 mt-2 text-sm font-bold">Your gastronomical experience is secured. See you soon!</p>
                 </motion.div>
              ) : (
                 <form onSubmit={handleReservation} className="space-y-4">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-950/70 ml-4 mb-2 block">Name</label>
                       <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950/20 placeholder-slate-900/40 border-none rounded-2xl py-4 px-6 text-slate-950 outline-none focus:bg-slate-950/30 transition-all font-bold" placeholder="Guest Name" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-950/70 ml-4 mb-2 block">Date</label>
                          <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-950/20 border-none rounded-2xl py-4 px-4 text-slate-950 outline-none focus:bg-slate-950/30 transition-all font-bold text-sm" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-950/70 ml-4 mb-2 block">Time</label>
                          <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-slate-950/20 border-none rounded-2xl py-4 px-4 text-slate-950 outline-none focus:bg-slate-950/30 transition-all font-bold text-sm" />
                       </div>
                    </div>

                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-950/70 ml-4 mb-2 block">Party Size</label>
                       <select required value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} className="w-full bg-slate-950/20 border-none rounded-2xl py-4 px-6 text-slate-950 outline-none focus:bg-slate-950/30 transition-all font-bold appearance-none hover:cursor-pointer">
                          {[1,2,3,4,5,6,7,8,9,10, "10+"].map(n => <option key={n} value={n} className="text-slate-900">{n} Guests</option>)}
                       </select>
                    </div>

                    <div className="pt-6">
                       <button 
                         type="submit" 
                         disabled={bookingStatus === 'submitting'}
                         className="w-full flex items-center justify-center p-5 bg-slate-950 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 group"
                       >
                          {bookingStatus === 'idle' ? (
                             <>Confirm Desk</>
                          ) : (
                             <span className="flex items-center"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" /> Registering...</span>
                          )}
                       </button>
                    </div>
                 </form>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
