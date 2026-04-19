import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Upload, FileCheck, AlertCircle, 
  Clock, Camera, CheckCircle, ChevronRight, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const GuideVerifyPage = () => {
  const [status, setStatus] = useState('loading'); // loading, not_submitted, pending, rejected, approved
  const [reason, setReason] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    selfie: null
  });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const fetchStatus = useCallback(async (showLoading = false) => {
    if (showLoading) setStatus('loading');
    try {
      const { data } = await axios.get('/api/kyc/status');
      setStatus(data.kycStatus);
      setReason(data.rejectionReason);
      
      if (data.kycStatus === 'approved') {
        if (!data.profileComplete) {
          navigate('/guide/setup');
        } else {
          navigate('/guide/dashboard');
        }
      }
    } catch (error) {
      toast.error('Failed to fetch KYC status');
    }
  }, [navigate]);

  useEffect(() => {
    fetchStatus(true);
  }, [fetchStatus]);

  // Polling for pending status
  useEffect(() => {
    let interval;
    if (status === 'pending') {
      interval = setInterval(() => {
        fetchStatus();
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [status, fetchStatus]);

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const handleAadhaarChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // numbers only
    if (val.length > 12) val = val.slice(0, 12);
    // Format: XXXX XXXX XXXX
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setAadhaarNumber(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (aadhaarNumber.replace(/\s/g, '').length !== 12) {
      return toast.error('Aadhaar number must be 12 digits');
    }
    if (!files.aadhaarFront || !files.aadhaarBack || !files.selfie) {
      return toast.error('Please upload all 3 photos');
    }

    setUploading(true);
    const fd = new FormData();
    fd.append('aadhaarNumber', aadhaarNumber);
    fd.append('aadhaarFront', files.aadhaarFront);
    fd.append('aadhaarBack', files.aadhaarBack);
    fd.append('selfie', files.selfie);

    try {
      await axios.post('/api/kyc/submit', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('KYC submitted successfully!');
      setStatus('pending');
    } catch (error) {
      toast.error(error.response?.data?.message || 'KYC submission failed');
    } finally {
      setUploading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-slate-950 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* FORM STATE: NOT SUBMITTED OR REJECTED */}
          {(status === 'not_submitted' || status === 'rejected') && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-10 rounded-[2.5rem] shadow-premium"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black italic font-serif">Guide Verification</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Verify your identity to start hosting tours</p>
                </div>
              </div>

              {status === 'rejected' && (
                <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-3xl flex gap-4">
                  <AlertCircle className="text-red-500 shrink-0" size={24} />
                  <div>
                    <h4 className="font-black text-red-600 dark:text-red-400 uppercase tracking-widest text-[10px] mb-1">Rejection Reason</h4>
                    <p className="text-red-600 dark:text-red-300 font-medium">{reason || 'Insufficient documentation'}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="input-group">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Aadhaar Card Number</label>
                  <input 
                    type="text" 
                    value={aadhaarNumber} 
                    onChange={handleAadhaarChange}
                    className="input-field text-xl tracking-widest text-center"
                    placeholder="XXXX XXXX XXXX"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploadBox 
                    label="Front Side" 
                    file={files.aadhaarFront} 
                    onChange={(e) => handleFileChange(e, 'aadhaarFront')}
                  />
                  <FileUploadBox 
                    label="Back Side" 
                    file={files.aadhaarBack} 
                    onChange={(e) => handleFileChange(e, 'aadhaarBack')}
                  />
                </div>

                <FileUploadBox 
                  label="Live Selfie with Aadhaar" 
                  desc="Hold your Aadhaar card next to your face clearly"
                  file={files.selfie} 
                  onChange={(e) => handleFileChange(e, 'selfie')}
                />

                <button 
                  type="submit" 
                  disabled={uploading}
                  className="btn-primary w-full py-5 text-base tracking-[0.2em]"
                >
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>SUBMIT FOR REVIEW <ChevronRight size={20} className="ml-2" /></>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* PENDING STATE */}
          {status === 'pending' && (
            <motion.div 
              key="pending"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 rounded-[3rem] shadow-premium text-center space-y-8"
            >
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
                <div className="relative w-24 h-24 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/40">
                  <Clock size={48} />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black italic font-serif">Under Review</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg px-8 leading-relaxed">
                  Our team is currently verifying your documents. This usually takes less than 24 hours.
                </p>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-left">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Account Restricted</h4>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed px-2">
                  Your guide profile is currently hidden from travelers. Once approved, you'll be able to set up your services and go live.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 text-xs font-black uppercase tracking-widest">
                    <RefreshCw size={14} className="animate-spin" /> Auto-checking status...
                  </div>
                  <button onClick={() => fetchStatus(true)} className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest border-b border-transparent hover:border-slate-300 transition-all">Manual Refresh</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FileUploadBox = ({ label, desc, file, onChange }) => (
  <div className="space-y-2">
    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block">{label}</label>
    <label className={`relative block w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all flex flex-col items-center justify-center text-center p-4 ${file ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
      {file ? (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-500 rounded-xl">
            <CheckCircle size={20} />
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-slate-800 dark:text-white truncate max-w-[120px]">{file.name}</p>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Tap to change</p>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <Camera className="mx-auto text-slate-300" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Image</p>
          {desc && <p className="text-[9px] text-slate-400 font-medium opacity-60 leading-tight">{desc}</p>}
        </div>
      )}
      <input type="file" className="hidden" accept="image/*" onChange={onChange} />
    </label>
  </div>
);

export default GuideVerifyPage;
