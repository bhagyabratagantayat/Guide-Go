import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserCheck, 
  UserX, 
  MapPin, 
  ExternalLink,
  ShieldCheck,
  Languages,
  Clock,
  CheckCircle
} from 'lucide-react';

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

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/guides/${id}/status`, { status });
      fetchGuides(); // Refresh list
    } catch (error) {
      alert('Error updating guide status');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
         <div className="space-y-3">
            <h1 className="text-6xl font-black text-slate-950 dark:text-white tracking-tighter italic font-serif leading-[0.85] uppercase">Guide Approvals</h1>
            <p className="text-slate-400 font-bold text-[11px] tracking-[0.4em] uppercase flex items-center">
               <ShieldCheck className="w-4 h-4 mr-3 text-primary-500" /> Professional Verification Hub
            </p>
         </div>
         <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Verification</span>
            <span className="w-8 h-8 bg-primary-500 text-slate-900 rounded-full flex items-center justify-center font-black text-xs">
              {guides.filter(g => g.status === 'pending').length}
            </span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide) => (
          <div key={guide._id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 hover:shadow-premium transition-all group relative overflow-hidden">
            <div className="flex items-center space-x-6 mb-8 relative z-10">
              <div className="relative">
                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-3xl font-black text-slate-200 dark:text-slate-700 overflow-hidden shadow-inner group-hover:shadow-soft transition-all">
                  {guide.userId?.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : guide.userId?.name?.charAt(0)}
                </div>
                {guide.status === 'approved' && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-500 border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-slate-900">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic group-hover:text-primary-500 transition-colors">{guide.userId?.name}</h4>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{guide.userId?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                 <p className="text-xs font-black text-slate-900 dark:text-slate-200 italic">{guide.experience}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee</p>
                 <p className="text-xs font-black text-primary-600 dark:text-primary-400 italic">₹{guide.pricePerHour}/hr</p>
              </div>
            </div>

            <div className="p-6 bg-slate-950 rounded-[2rem] mb-10 relative z-10 overflow-hidden">
               <div className="flex items-center space-x-2 mb-3">
                  <Languages className="w-3 h-3 text-primary-500" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fluent in</span>
               </div>
               <p className="text-[10px] font-bold text-white uppercase tracking-tighter line-clamp-2 leading-relaxed">
                  {guide.languages.join(' • ')}
               </p>
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
               <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${
                    guide.status === 'approved' ? 'bg-green-500 animate-pulse' : 
                    guide.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-serif italic">
                    {guide.status}
                  </span>
               </div>
               
               <div className="flex space-x-3">
                  {guide.status === 'pending' && (
                    <>
                       <button 
                         onClick={() => handleStatus(guide._id, 'approved')}
                         className="px-6 py-3 bg-primary-500 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20 active:scale-95"
                       >
                         Approve
                       </button>
                       <button 
                         onClick={() => handleStatus(guide._id, 'rejected')}
                         className="px-6 py-3 bg-white dark:bg-slate-800 text-red-500 border border-red-50 dark:border-red-900/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-95"
                       >
                         Decline
                       </button>
                    </>
                  )}
                  {guide.status !== 'pending' && (
                    <button className="p-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:bg-primary-500 transition-all shadow-premium">
                       <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGuides;
