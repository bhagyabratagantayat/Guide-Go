import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  ShieldCheck, Check, X, Eye, User, 
  Mail, Phone, Calendar, AlertCircle, ExternalLink, Award 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminKycPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(null); // guideId

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/kyc/list');
      setGuides(data);
    } catch (error) {
      toast.error('Failed to fetch pending verifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (guideId) => {
    try {
      await api.put(`/admin/kyc/${guideId}/approve`);
      toast.success('KYC Approved');
      setGuides(prev => prev.filter(g => g._id !== guideId));
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (guideId) => {
    if (!rejectionReason) return toast.error('Please provide a reason');
    try {
      await api.put(`/admin/kyc/${guideId}/reject`, { reason: rejectionReason });
      toast.success('KYC Rejected');
      setGuides(prev => prev.filter(g => g._id !== guideId));
      setShowRejectInput(null);
      setRejectionReason('');
    } catch (error) {
      toast.error('Rejection failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-[var(--accent)] text-white rounded-3xl shadow-2xl shadow-[var(--accent)]/20">
              <ShieldCheck size={32} />
            </div>
            <div>
               <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] mb-2">Internal Security</h1>
               <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">KYC Verifications</h2>
               <p className="text-[var(--text-secondary)] font-medium mt-1">{guides.length} dossiers pending review</p>
            </div>
          </div>
          <button 
             onClick={fetchPending}
             className="px-8 py-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] uppercase tracking-[.3em] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all shadow-xl"
          >
             Synchronize Data
          </button>
        </div>

        {guides.length === 0 ? (
          <div className="text-center py-32 bg-[var(--bg-card)] rounded-[3rem] border-2 border-dashed border-[var(--border-color)]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--text-muted)]">
              <Check size={40} />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-muted)] uppercase tracking-widest">Awaiting Applications</h2>
            <p className="text-[var(--text-muted)] mt-2 font-medium">All guide dossiers have been processed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {guides.map((guide) => (
              <motion.div 
                key={guide._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden rounded-[3rem] shadow-2xl flex flex-col group hover:border-[var(--border-hover)] transition-all"
              >
                {/* Header */}
                <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-500 shadow-soft border border-slate-100 dark:border-slate-800 overflow-hidden font-black text-xl italic">
                       {guide.userId?.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : guide.userId?.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-lg font-black italic font-serif leading-none mb-1">{guide.userId?.name}</h3>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span className="flex items-center gap-1"><Mail size={12} /> {guide.userId?.email}</span>
                           <span className="flex items-center gap-1"><Phone size={12} /> {guide.userId?.mobile}</span>
                        </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Submitted</p>
                    <p className="text-[10px] font-bold text-slate-500">{new Date(guide.kycData.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Document Previews */}
                <div className="p-8 grid grid-cols-3 gap-6">
                   <DocPreview label="Aadhaar Front" src={guide.kycData.aadhaarFront} onClick={() => setSelectedGuide({ img: guide.kycData.aadhaarFront, label: 'Aadhaar Front' })} />
                   <DocPreview label="Aadhaar Back" src={guide.kycData.aadhaarBack} onClick={() => setSelectedGuide({ img: guide.kycData.aadhaarBack, label: 'Aadhaar Back' })} />
                   <DocPreview label="Selfie ID" src={guide.kycData.selfie} onClick={() => setSelectedGuide({ img: guide.kycData.selfie, label: 'Selfie with Aadhaar' })} />
                </div>

                <div className="px-8 pb-8 space-y-4">
                   <div className="flex items-center gap-4 p-5 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-color)]">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[var(--accent)]">
                        <Award size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1">Aadhaar Identity</p>
                        <p className="text-sm font-black tracking-[.2em] text-[var(--text-primary)]">{guide.kycData.aadhaarNumber}</p>
                      </div>
                   </div>

                   {showRejectInput === guide._id ? (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-4 pt-2">
                         <textarea 
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="input-field min-h-[80px] bg-red-50/10 border-red-100 text-sm py-4"
                            placeholder="State reason for rejection (e.g. Blurry photo)"
                         />
                         <div className="flex gap-2">
                           <button onClick={() => handleReject(guide._id)} className="flex-1 btn-primary bg-red-500 hover:bg-red-600 shadow-red-500/20 py-3 text-[10px] tracking-widest">CONFIRM REJECTION</button>
                           <button onClick={() => setShowRejectInput(null)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest">CANCEL</button>
                         </div>
                      </motion.div>
                   ) : (
                      <div className="flex gap-4">
                        <button 
                            onClick={() => handleApprove(guide._id)}
                            className="flex-1 bg-green-500 text-white rounded-2xl py-4 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-2"
                        >
                           <Check size={18} /> Approve Verification
                        </button>
                        <button 
                            onClick={() => setShowRejectInput(guide._id)}
                            className="px-6 bg-red-50 text-red-500 rounded-2xl py-4 font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                           <X size={18} />
                        </button>
                      </div>
                   )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal Preview */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-8"
            onClick={() => setSelectedGuide(null)}
          >
             <div className="flex items-center justify-between w-full max-w-5xl mb-6">
                <h4 className="text-xl font-black text-white italic font-serif">{selectedGuide.label}</h4>
                <button className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"><X /></button>
             </div>
             <img 
                src={selectedGuide.img} 
                className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl border-4 border-white/10" 
                alt="Verification detail"
                onClick={(e) => e.stopPropagation()} 
             />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DocPreview = ({ label, src, onClick }) => (
  <div className="space-y-2 group cursor-pointer" onClick={onClick}>
     <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={label} />
        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-all flex items-center justify-center">
           <Eye className="text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all" size={24} />
        </div>
     </div>
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">{label}</p>
  </div>
);

export default AdminKycPage;
