import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  X, 
  AlertTriangle,
  Send,
  CheckCircle2
} from 'lucide-react';

const ReportModal = ({ isOpen, onClose, guideId, guideName, bookingId }) => {
  const [reason, setReason] = useState('Misconduct');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/reports', {
        guideId,
        bookingId,
        reason,
        description
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setDescription('');
      }, 2000);
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting report');
    } finally {
      setSubmitting(false);
    }
  };

  const reasons = [
    'Misconduct', 
    'Safety Concern', 
    'Overcharging', 
    'No Show', 
    'Unprofessional Behavior', 
    'Other'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
         onClick={onClose}
       />
       
       <motion.div 
         initial={{ scale: 0.9, opacity: 0, y: 20 }}
         animate={{ scale: 1, opacity: 1, y: 0 }}
         className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden"
       >
         {submitted ? (
           <div className="p-20 text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto">
                 <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic">Report Filed</h2>
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Our safety team will review this shortly.</p>
              </div>
           </div>
         ) : (
           <>
            <div className="bg-red-600 p-10 text-white relative">
               <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md">
                     <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Security Report</h3>
                    <p className="text-red-100/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Guide: {guideName}</p>
                  </div>
               </div>
               <button onClick={onClose} className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-2 text-red-500" /> Primary Reason
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {reasons.map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReason(r)}
                        className={`px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-left transition-all border ${
                          reason === r 
                            ? 'bg-red-50 border-red-100 text-red-600' 
                            : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Incident Details</label>
                  <textarea 
                    required
                    rows="4"
                    placeholder="Describe what happened with as much detail as possible..."
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-red-100 outline-none font-medium text-sm text-slate-700 italic"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
               </div>

               <div className="flex items-center space-x-4">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-5 bg-red-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all flex items-center justify-center group"
                  >
                    {submitting ? 'Transmitting...' : (
                      <>
                        Submit Report <Send className="w-4 h-4 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
               </div>
            </form>
           </>
         )}
       </motion.div>
    </div>
  );
};

export default ReportModal;
