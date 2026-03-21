import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, ShieldCheck, MapPin, CheckCircle, PackageSearch, Users, CalendarDays, KeyRound, Globe, Send, Ticket } from 'lucide-react';
import { mockAgencies } from '../data/mockAgencies';
import { useCurrency } from '../context/CurrencyContext.jsx';
import toast, { Toaster } from 'react-hot-toast';

const AgencyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [agency, setAgency] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: 2,
    date: '',
    destination: '',
    requests: ''
  });
  const [bookingStatus, setBookingStatus] = useState('idle');

  useEffect(() => {
    // Simulate fetch delay to visually register transition
    const timer = setTimeout(() => {
       const found = mockAgencies.find(a => a.id === id);
       setAgency(found || mockAgencies[0]); // fallback if missing
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingStatus('submitting');
    
    // Simulate API logic
    setTimeout(() => {
       setBookingStatus('success');
       toast.success('Booking Request Sent to Agency!', {
          style: { background: '#10b981', color: '#fff', padding: '16px', borderRadius: '1rem', fontWeight: 'bold' },
          iconTheme: { primary: '#fff', secondary: '#10b981' }
       });
       
       // Reset form
       setTimeout(() => {
          setBookingStatus('idle');
          setFormData({ name: '', email: '', guests: 2, date: '', destination: '', requests: '' });
       }, 3000);
    }, 2000);
  };

  if (!agency) return (
     <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-xl shadow-primary-500/20 mb-6" />
        <h2 className="text-xl font-black text-white italic font-serif tracking-widest uppercase">Initializing Agency Profiles...</h2>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-32 text-white font-sans overflow-x-hidden transition-colors duration-300">
      <Toaster position="top-center" />
      
      {/* Immersive Hero Header */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        <img 
          src={agency.bannerUrl} 
          className="w-full h-full object-cover scale-105 transform origin-center" 
          alt={agency.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
        
        {/* Navigation Overlays */}
        <div className="absolute top-12 left-6 right-6 flex items-center justify-between z-10 max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all shadow-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Hero Branding Container */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:space-x-8">
           <div className="w-32 h-32 bg-white rounded-[2rem] border-8 border-slate-950 shadow-2xl overflow-hidden mb-6 md:mb-0 shrink-0">
              <img src={agency.logoUrl} className="w-full h-full object-cover" alt="Logo" />
           </div>
           
           <div className="flex-grow space-y-3">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                 <div className="bg-primary-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-lg shadow-primary-500/30 border border-primary-400">
                    <ShieldCheck className="w-4 h-4 mr-1.5" /> Trusted Partner
                 </div>
                 <div className="bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-white flex items-center text-[10px] font-black uppercase tracking-widest shadow-xl">
                    <Star className="w-4 h-4 fill-primary-400 text-primary-400 mr-2" />
                    {agency.rating} <span className="text-slate-400 ml-2">({agency.reviewsCount} Reviews)</span>
                 </div>
                 <div className="bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-slate-300 flex items-center text-[10px] font-black uppercase tracking-widest">
                    <MapPin className="w-4 h-4 text-primary-500 mr-2" />
                    {agency.location}
                 </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white italic font-serif tracking-tighter leading-none">{agency.name}</h1>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Core Detail Column */}
        <div className="lg:col-span-7 space-y-12">
           
           {/* Section: About */}
           <section className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all pointer-events-none" />
              <h3 className="text-2xl font-black text-white italic font-serif mb-6 flex items-center gap-3">
                 <Globe className="w-6 h-6 text-primary-400" /> About the Agency
              </h3>
              <p className="text-slate-400 leading-relaxed font-medium text-lg">{agency.description}</p>
              
              <div className="mt-8 flex flex-wrap gap-3">
                 {agency.services.map((service, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 shadow-inner">
                       <CheckCircle className="w-4 h-4 text-primary-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{service}</span>
                    </div>
                 ))}
              </div>
           </section>

           {/* Section: Signature Packages */}
           <section className="space-y-6">
              <h3 className="text-3xl font-black text-white italic font-serif tracking-tight flex items-center">
                 <PackageSearch className="w-8 h-8 text-primary-500 mr-4" /> Signature Packages
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {agency.packages.map(pkg => (
                    <div key={pkg.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:border-primary-500/50 hover:bg-slate-800 transition-all shadow-xl group">
                       <div className="w-12 h-12 bg-slate-950 text-primary-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-800 group-hover:scale-110 transition-transform">
                          <Ticket className="w-6 h-6" />
                       </div>
                       <h4 className="text-xl font-bold text-white mb-2 leading-tight">{pkg.name}</h4>
                       <p className="text-slate-500 font-bold mb-6 flex items-center text-sm"><CalendarDays className="w-4 h-4 mr-2" /> {pkg.duration}</p>
                       <div className="flex justify-between items-baseline pt-6 border-t border-slate-800">
                          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Fixed Rate</span>
                          <span className="text-3xl font-black tracking-tighter text-white">{formatPrice(pkg.price)}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           {/* Section: Reviews */}
           <section className="space-y-6 pt-4">
              <h3 className="text-3xl font-black text-white italic font-serif tracking-tight">Traveler Chronicles</h3>
              <div className="space-y-4">
                 {agency.reviews.map(rev => (
                    <div key={rev.id} className="bg-slate-900/50 p-6 border border-slate-800 rounded-3xl flex flex-col sm:flex-row gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-lg border border-indigo-500/30 shrink-0">
                          {rev.author.charAt(0)}
                       </div>
                       <div>
                          <p className="font-bold text-white mb-1">{rev.author}</p>
                          <div className="flex space-x-1 mb-3">
                             {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />)}
                          </div>
                          <p className="text-slate-400 italic text-sm">{rev.text}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

        </div>

        {/* Dynamic Booking Form Column */}
        <div className="lg:col-span-5 relative">
           <div className="sticky top-24 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[3rem] p-8 lg:p-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-[5px] bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-500" />
              
              <div className="mb-10 text-center">
                 <h2 className="text-3xl font-black italic font-serif text-white leading-none">Book Your Journey</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-4">Secure your slot with {agency.name}</p>
              </div>

              {bookingStatus === 'success' ? (
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-primary-500/20 text-primary-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary-500/10">
                       <CheckCircle className="w-12 h-12 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-white italic font-serif">Request Dispatched</h3>
                    <p className="text-slate-400 mt-3 font-medium">The agency has received your booking inquiry and will construct your manifest shortly.</p>
                 </motion.div>
              ) : (
                 <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Primary Guest Name</label>
                          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 flex px-6 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-700" placeholder="John Doe" />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Party Size</label>
                             <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input type="number" min="1" max="20" required value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-primary-500 transition-all font-bold" />
                             </div>
                          </div>
                          <div>
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Start Date</label>
                             <div className="relative">
                                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-primary-500 transition-all font-bold" />
                             </div>
                          </div>
                       </div>
                       
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Intended Package / Destination</label>
                          <select required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-primary-500 transition-all appearance-none">
                             <option value="" disabled className="text-slate-500">Select an experience...</option>
                             {agency.packages.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                             <option value="custom">Looking for custom itinerary</option>
                          </select>
                       </div>
                       
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 mb-2 block">Special Requests (Optional)</label>
                          <textarea rows="3" value={formData.requests} onChange={e => setFormData({...formData, requests: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-white outline-none focus:border-primary-500 transition-all placeholder-slate-700 resize-none custom-scrollbar" placeholder="Dietary restrictions, vehicle preferences..." />
                       </div>
                    </div>

                    <div className="pt-6">
                       <button 
                         type="submit" 
                         disabled={bookingStatus === 'submitting'}
                         className="w-full flex items-center justify-center p-5 bg-white text-slate-900 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
                       >
                          {bookingStatus === 'idle' ? (
                             <><Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" /> Confirm Booking Inquiry</>
                          ) : (
                             <span className="flex items-center"><div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-3" /> Processing Engine...</span>
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

export default AgencyDetail;
