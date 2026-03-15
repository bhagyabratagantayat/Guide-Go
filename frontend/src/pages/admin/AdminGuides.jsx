import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  X, 
  ShieldAlert, 
  Mail,
  Plus,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGuides = async () => {
    try {
      const { data } = await axios.get('/api/admin/guides');
      setGuides(data.data);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/api/admin/guides/${id}/status`, { status });
      setGuides(guides.map(g => g._id === id ? { ...g, status } : g));
    } catch (error) {
      alert('Failed to transmit authorization signal');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-[1.5rem] animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black tracking-tighter uppercase italic font-serif leading-none mb-4">Guide Verification Hub</h2>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Screening local experts for GuideGo certification</p>
        </div>
        <div className="flex bg-white p-2 rounded-[1.5rem] shadow-premium border border-surface-50">
           <div className="px-6 py-3 bg-primary-500 text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-primary-500/20">
             PENDING REVIEW ({guides.filter(g => g.status === 'pending').length})
           </div>
           <div className="px-6 py-3 text-slate-400 font-black text-[9px] uppercase tracking-widest hover:text-primary-500 transition-colors cursor-pointer">
             ALL CERTIFIED ({guides.filter(g => g.status === 'approved').length})
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {guides.length > 0 ? guides.map((guide) => (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={guide._id} 
            className="group bg-white rounded-[3rem] shadow-premium border border-surface-50 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
          >
            <div className="relative h-64 overflow-hidden">
               {guide.userId?.profilePicture ? (
                 <img src={guide.userId.profilePicture} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               ) : (
                 <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-serif text-5xl font-black">
                   {guide.userId?.name?.charAt(0) || 'G'}
                 </div>
               )}
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
               <div className="absolute bottom-6 left-8">
                 <span className={`text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] border shadow-2xl backdrop-blur-md ${
                   guide.status === 'pending' ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' :
                   guide.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' :
                   'bg-red-500/20 text-red-400 border-red-500/20'
                 }`}>
                   {guide.status}
                 </span>
               </div>
            </div>

            <div className="p-10 space-y-6">
               <div className="space-y-1">
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{guide.userId?.name || 'Anonymous Expert'}</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                   <Mail className="w-3 h-3 mr-2 text-primary-500" /> {guide.userId?.email || 'No Email Registered'}
                 </p>
               </div>

               <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-50">
                 <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Languages</p>
                    <p className="text-[10px] font-black text-slate-700 uppercase">{guide.languages?.join(', ') || 'Global'}</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Rate</p>
                    <p className="text-[10px] font-black text-slate-700 uppercase">₹{guide.pricePerHour}/HR</p>
                 </div>
               </div>

               <div className="space-y-3">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Digital Bio</p>
                 <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-medium italic">
                   "{guide.bio || 'This expert is yet to document their spiritual journey through Odisha.'}"
                 </p>
               </div>

               {guide.status === 'pending' && (
                 <div className="flex gap-4 pt-4">
                   <button 
                    onClick={() => handleStatusUpdate(guide._id, 'approved')}
                    className="flex-1 py-4 bg-primary-500 text-slate-950 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-400 transition-all flex items-center justify-center group"
                   >
                     <CheckCircle className="w-3.5 h-3.5 mr-2 group-hover:scale-125 transition-transform" /> Certify Profile
                   </button>
                   <button 
                    onClick={() => handleStatusUpdate(guide._id, 'rejected')}
                    className="px-6 py-4 bg-white border border-slate-100 text-red-500 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-red-50 hover:border-red-100 transition-all"
                   >
                     REJECT
                   </button>
                 </div>
               )}
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-40 text-center">
             <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-premium flex items-center justify-center mx-auto mb-8 text-slate-200">
                <ShieldAlert className="w-10 h-10" />
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs italic">No experts currently awaiting certification</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGuides;
