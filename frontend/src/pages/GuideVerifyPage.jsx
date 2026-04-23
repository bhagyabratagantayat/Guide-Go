import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Upload, FileCheck, AlertCircle, 
  Clock, Camera, CheckCircle, ChevronRight, RefreshCw,
  RotateCcw, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const SelfieCameraBox = ({ onCapture, capturedFile }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      setStream(mediaStream);
      
      // Use a small delay to ensure video element is mounted
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(e => console.error("Video play failed:", e));
          };
        }
      }, 100);
      
      setIsCameraOpen(true);
    } catch (err) {
      toast.error('Camera access denied or not available');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        onCapture(file);
        stopCamera();
      }, 'image/jpeg', 0.95);
    }
  };

  const retake = () => {
    onCapture(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  return (
    <div className="space-y-4">
      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block italic">Live Selfie with Aadhaar (Device Camera)</label>
      
      <div className="relative group">
        {!isCameraOpen && !capturedFile ? (
          <button 
            type="button"
            onClick={startCamera}
            className="w-full h-48 border-2 border-dashed border-indigo-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 hover:bg-indigo-50/50 dark:hover:bg-slate-900/50 transition-all group"
          >
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera size={32} />
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Open Camera</p>
              <p className="text-[10px] text-slate-400 font-medium">Capture a live photo for instant verification</p>
            </div>
          </button>
        ) : isCameraOpen ? (
          <div className="relative w-full aspect-video bg-black rounded-[2.5rem] overflow-hidden border-2 border-indigo-500 shadow-2xl">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-[20px] border-black/10 pointer-events-none" />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6">
               <button type="button" onClick={stopCamera} className="p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all"><RotateCcw size={20} /></button>
               <button type="button" onClick={capturePhoto} className="px-10 py-4 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/30 flex items-center gap-3 active:scale-95 transition-all">
                  <Zap size={16} fill="white" /> Capture Photo
               </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-48 rounded-[2.5rem] overflow-hidden border-2 border-emerald-500 group">
             <img src={URL.createObjectURL(capturedFile)} alt="Captured Selfie" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <button type="button" onClick={retake} className="px-8 py-3 bg-white text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Retake Photo</button>
             </div>
             <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                <CheckCircle size={10} /> Live Captured
             </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const GuideVerifyPage = () => {
  const [status, setStatus] = useState('loading'); 
  const [reason, setReason] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    selfie: null
  });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const fetchStatus = useCallback(async (showLoading = false) => {
    if (showLoading) setStatus('loading');
    try {
      const { data } = await api.get('/kyc/status');
      setStatus(data.kycStatus);
      setReason(data.rejectionReason);
      
      // Sync global state
      if (user.kycStatus !== data.kycStatus || user.profileComplete !== data.profileComplete) {
         updateUser({ kycStatus: data.kycStatus, profileComplete: data.profileComplete });
      }
      
      if (data.kycStatus === 'approved') {
        if (!data.profileComplete) {
          navigate('/guide/setup');
        } else {
          navigate('/guide');
        }
      }
    } catch (error) {
      toast.error('Failed to fetch KYC status');
    }
  }, [navigate]);

  useEffect(() => {
    fetchStatus(true);
  }, [fetchStatus]);

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
    let val = e.target.value.replace(/\D/g, ''); 
    if (val.length > 12) val = val.slice(0, 12);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setAadhaarNumber(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clean data
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');

    if (cleanAadhaar.length !== 12) {
      return toast.error('Aadhaar number must be 12 digits');
    }
    
    // Detailed validation feedback
    if (!files.aadhaarFront) return toast.error('Please upload Aadhaar FRONT side photo');
    if (!files.aadhaarBack) return toast.error('Please upload Aadhaar BACK side photo');
    if (!files.selfie) return toast.error('Please take a live selfie with your Aadhaar');

    setUploading(true);
    console.log('--- STARTING KYC SUBMISSION ---');
    console.log('Aadhaar:', cleanAadhaar);
    console.log('Files:', {
      front: files.aadhaarFront?.name,
      back: files.aadhaarBack?.name,
      selfie: files.selfie?.name
    });

    const fd = new FormData();
    fd.append('aadhaarNumber', cleanAadhaar);
    fd.append('aadhaarFront', files.aadhaarFront);
    fd.append('aadhaarBack', files.aadhaarBack);
    fd.append('selfie', files.selfie);

    try {
      console.log('Calling API /kyc/submit...');
      const { data } = await api.post('/kyc/submit', fd);
      console.log('Submission Success:', data);
      toast.success('Verification submitted! Redirecting...');
      setStatus('pending');
    } catch (error) {
      console.error('Submission Final Failure:', error);
      const msg = error.response?.data?.message || 'Submission failed. Please check your connection.';
      toast.error(msg);
    } finally {
      setUploading(false);
      console.log('--- SUBMISSION ATTEMPT FINISHED ---');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If already approved, don't render anything while redirecting
  if (status === 'approved') {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-slate-950 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
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

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="input-group">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block italic">Aadhaar Card Number</label>
                  <input 
                    type="text" 
                    value={aadhaarNumber} 
                    onChange={handleAadhaarChange}
                    className="input-field text-xl tracking-[0.2em] text-center font-bold"
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

                {/* NEW LIVE SELFIE CAMERA BOX */}
                <SelfieCameraBox 
                  capturedFile={files.selfie}
                  onCapture={(file) => setFiles(prev => ({ ...prev, selfie: file }))}
                />

                <button 
                  type="submit" 
                  disabled={uploading}
                  className="btn-primary w-full py-6 text-base tracking-[0.2em] shadow-2xl shadow-indigo-500/20"
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
    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block italic">{label}</label>
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
          <Upload className="mx-auto text-slate-300" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Image</p>
          {desc && <p className="text-[9px] text-slate-400 font-medium opacity-60 leading-tight">{desc}</p>}
        </div>
      )}
      <input type="file" className="hidden" accept="image/*" onChange={onChange} />
    </label>
  </div>
);

export default GuideVerifyPage;
