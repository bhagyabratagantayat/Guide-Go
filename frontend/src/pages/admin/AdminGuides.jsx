import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  UserCheck, UserX, MapPin, ExternalLink, 
  ShieldCheck, Languages, Clock, CheckCircle,
  Search, Trash2, Ban, UserMinus, Info,
  Briefcase, IndianRupee, Globe, Award,
  Mail, Phone, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchGuides = async () => {
    try {
      const { data } = await api.get('/admin/guides');
      setGuides(data.data);
    } catch (error) {
      toast.error('Failed to load guide dossiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/admin/guides/${id}/status`, { status });
      toast.success(`Guide ${status} successfully`);
      fetchGuides();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('CRITICAL: Are you sure you want to PERMANENTLY DELETE this guide? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/guides/${id}`);
      toast.success('Guide profile removed from system');
      fetchGuides();
    } catch (error) {
      toast.error('Failed to delete guide');
    }
  };

  const filteredGuides = guides.filter(g => {
    const matchesSearch = g.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         g.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || g.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Loading Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter italic font-serif leading-none uppercase">Guide Registry</h1>
          <p className="text-slate-400 font-bold text-[10px] tracking-[0.4em] uppercase flex items-center">
            <ShieldCheck className="w-3 h-3 mr-2 text-primary-500" /> Professional Credential Management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold w-full md:w-72 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
            {['all', 'pending', 'approved', 'rejected'].map(s => (
              <button 
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterStatus === s ? 'bg-primary-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredGuides.map((guide) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={guide._id} 
              className="glass-card bg-white dark:bg-slate-900 rounded-[3rem] p-1 border border-slate-100 dark:border-slate-800 hover:shadow-premium transition-all group overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left: Identity */}
                  <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-4xl font-black text-slate-200 dark:text-slate-700 overflow-hidden shadow-inner ring-8 ring-slate-50/50 dark:ring-slate-800/50">
                        {guide.userId?.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : guide.userId?.name?.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-2 -right-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter italic border-4 border-white dark:border-slate-900 shadow-xl ${
                        guide.status === 'approved' ? 'bg-green-500 text-white' : 
                        guide.status === 'pending' ? 'bg-yellow-400 text-black' : 'bg-red-500 text-white'
                      }`}>
                        {guide.status}
                      </div>
                    </div>
                  </div>

                  {/* Right: Info */}
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic font-serif leading-none uppercase mb-1">{guide.userId?.name}</h3>
                        <div className="flex items-center gap-3">
                           <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Mail size={10} /> {guide.userId?.email}</span>
                           <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Phone size={10} /> {guide.userId?.mobile}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <button 
                            onClick={() => handleDelete(guide._id)}
                            className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all group/trash"
                            title="Delete Guide"
                          >
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                       <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={10} /> Experience</p>
                          <p className="text-xs font-black text-slate-900 dark:text-white italic">{guide.experience || 0} Years</p>
                       </div>
                       <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><IndianRupee size={10} /> Fee/Hr</p>
                          <p className="text-xs font-black text-primary-600 dark:text-primary-400 italic">₹{guide.pricePerHour}</p>
                       </div>
                       <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={10} /> City</p>
                          <p className="text-xs font-black text-slate-900 dark:text-white italic truncate">{guide.primaryCity || 'N/A'}</p>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Specialties & Skills</p>
                       <div className="flex flex-wrap gap-2">
                          {guide.specialties?.length > 0 ? guide.specialties.map(s => (
                            <span key={s} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-tighter">{s}</span>
                          )) : <span className="text-[10px] text-slate-400 italic font-medium">No specialties listed</span>}
                       </div>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                       <div className="flex items-center gap-2 mb-2">
                          <Info size={12} className="text-primary-500" />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Professional Bio</span>
                       </div>
                       <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                          "{guide.bio || 'This guide hasn\'t provided a professional bio yet.'}"
                       </p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6">
                   <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                         <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${guide.isLive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`}></span>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">{guide.isLive ? 'ONLINE' : 'OFFLINE'}</span>
                         </div>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">KYC Status</span>
                         <span className={`text-[10px] font-black uppercase tracking-tighter ${guide.kycStatus === 'approved' ? 'text-green-500' : 'text-yellow-500'}`}>
                           {guide.kycStatus || 'NOT SUBMITTED'}
                         </span>
                      </div>
                   </div>

                   <div className="flex gap-3">
                      {guide.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatus(guide._id, 'approved')}
                            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button 
                            onClick={() => handleStatus(guide._id, 'rejected')}
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-red-500 border border-red-50 dark:border-red-900/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50"
                          >
                            <UserX size={14} /> Reject
                          </button>
                        </>
                      )}
                      {guide.status !== 'pending' && (
                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-500 hover:text-slate-900 transition-all">
                          <ExternalLink size={14} /> Full Dossier
                        </button>
                      )}
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredGuides.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
           <Filter size={48} className="text-slate-200 mb-4" />
           <p className="text-lg font-black text-slate-900 dark:text-white italic font-serif">No dossiers match your criteria</p>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};

export default AdminGuides;
