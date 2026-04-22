import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  ShieldCheck, CheckCircle, XCircle, Eye, 
  MapPin, User, FileText, Camera, RefreshCw,
  Search, Filter, Clock, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminKycPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/kyc/pending');
      setGuides(data);
    } catch (error) {
      toast.error('Failed to fetch pending dossiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this guide for platform operation?')) return;
    try {
      await api.put(`/admin/kyc/${id}/approve`);
      toast.success('Guide approved successfully');
      fetchPending();
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason) return toast.error('Please provide a reason');
    try {
      await api.put(`/admin/kyc/${id}/reject`, { reason: rejectionReason });
      toast.success('Dossier rejected');
      setShowRejectModal(null);
      setRejectionReason('');
      fetchPending();
    } catch (error) {
      toast.error('Rejection failed');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifying Dossiers...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
         <div className="space-y-3">
            <h1 className="text-6xl font-black text-slate-950 dark:text-white tracking-tighter italic font-serif leading-[0.85] uppercase">KYC Verifications</h1>
            <p className="text-slate-400 font-bold text-[11px] tracking-[0.4em] uppercase flex items-center">
               <ShieldCheck className="w-4 h-4 mr-3 text-primary-500" /> Internal Security Dossier Review
            </p>
         </div>
         <button 
           onClick={fetchPending}
           className="flex items-center gap-2 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
         >
           <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Synchronize Data
         </button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <AnimatePresence mode="popLayout">
          {guides.map((guide) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={guide._id} 
              className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-premium group relative overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-primary-500/10" />

              <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                {/* 1. Guide Identity Block */}
                <div className="lg:w-1/3 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-4xl font-black text-slate-200 dark:text-slate-700 overflow-hidden shadow-inner border-4 border-white dark:border-slate-800">
                      {guide.userId?.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : guide.userId?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic font-serif leading-none">{guide.userId?.name}</h4>
                      <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <CheckCircle size={12} /> Pending Verification
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                       <span className="text-[10px] font-bold text-slate-900 dark:text-white">{guide.userId?.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile</span>
                       <span className="text-[10px] font-bold text-slate-900 dark:text-white">{guide.userId?.mobile}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aadhaar No.</span>
                       <span className="text-[10px] font-black font-mono tracking-widest text-primary-600">{guide.kycData?.aadhaarNumber}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                       onClick={() => handleApprove(guide._id)}
                       className="flex-1 py-4 bg-primary-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95"
                    >
                      Verify & Approve
                    </button>
                    <button 
                       onClick={() => setShowRejectModal(guide._id)}
                       className="px-6 py-4 bg-white dark:bg-slate-800 text-red-500 border border-red-100 dark:border-red-900/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 transition-all active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* 2. Document Evidence Block */}
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-6">
                      <FileText size={16} className="text-primary-500" />
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Verification Evidence</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Aadhaar Front', key: 'aadhaarFront', icon: <FileText size={14} /> },
                        { label: 'Aadhaar Back', key: 'aadhaarBack', icon: <FileText size={14} /> },
                        { label: 'Live Selfie', key: 'selfie', icon: <Camera size={14} />, isSelfie: true }
                      ].map((doc) => (
                        <div key={doc.key} className="space-y-3">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                             {doc.icon} {doc.label}
                           </p>
                           <div 
                              onClick={() => setSelectedImage(guide.kycData?.[doc.key])}
                              className={`aspect-[4/3] rounded-[2rem] bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer group/img relative border-4 border-white dark:border-slate-800 shadow-premium transition-all hover:scale-[1.02] ${doc.isSelfie ? 'ring-4 ring-primary-500/20' : ''}`}
                           >
                              {guide.kycData?.[doc.key] ? (
                                <>
                                  <img src={guide.kycData[doc.key]} className="w-full h-full object-cover transition-all group-hover/img:scale-110" alt={doc.label} />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                     <Eye className="text-white w-8 h-8" />
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                   <AlertTriangle size={24} className="mb-2" />
                                   <span className="text-[8px] font-black uppercase tracking-widest">No Image Found</span>
                                </div>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {guides.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
             <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={32} className="text-slate-200" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 dark:text-white italic font-serif">All Clear!</h3>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">All guide dossiers have been processed.</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-xl p-6 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="max-w-5xl w-full max-h-full overflow-hidden rounded-[3rem] shadow-2xl relative"
            >
               <img src={selectedImage} className="w-full h-auto max-h-[85vh] object-contain" alt="Evidence Preview" />
               <button className="absolute top-8 right-8 w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <XCircle size={24} />
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-950/60 backdrop-blur-md p-6 flex items-center justify-center"
          >
            <motion.div 
               initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
               className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-white dark:border-slate-800"
            >
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500">
                    <XCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic font-serif leading-none">Reject Dossier</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Provide a critical reason for rejection</p>
                  </div>
               </div>

               <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-6 text-sm font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all min-h-[120px] mb-8"
                  placeholder="e.g. Identity document blurred, or Selfie does not match Aadhaar..."
               />

               <div className="flex gap-4">
                  <button onClick={() => setShowRejectModal(null)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                  <button onClick={() => handleReject(showRejectModal)} className="flex-[2] py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/20">Confirm Rejection</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminKycPage;
