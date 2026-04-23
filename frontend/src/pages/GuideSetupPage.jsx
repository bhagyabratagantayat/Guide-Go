import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, IndianRupee, MapPin, CheckCircle, 
  ChevronRight, Globe, Award, Calendar, Info, 
  CreditCard, Languages, Compass, Sparkles,
  MousePointer2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const GuideSetupPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bio: '',
    languages: [],
    specialties: [],
    primaryCity: '',
    pricePerHour: '',
    pricePerDay: '',
    upiId: '',
    availableDays: []
  });

  const languageOptions = ['English', 'Hindi', 'Odia', 'Bengali', 'Tamil', 'Telugu', 'French', 'Spanish', 'German'];
  const specialtyOptions = ['Heritage tours', 'Food tours', 'Adventure', 'Nature', 'Religious', 'Photography', 'Nightlife', 'Shopping'];
  const daysOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await api.get('/kyc/status');
        if (data.kycStatus !== 'approved') {
          navigate('/guide/verify-identity');
          return;
        }
        if (data.profileComplete) {
          navigate('/guide');
          return;
        }
        setLoading(false);
      } catch (error) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      }
    };
    fetchStatus();
  }, [navigate]);

  const toggleArrayItem = (field, item) => {
    setFormData(prev => {
      const items = prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item];
      return { ...prev, [field]: items };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bio || !formData.primaryCity || !formData.pricePerHour) {
      return toast.error('Please fill all required fields');
    }
    if (formData.languages.length === 0) {
      return toast.error('Select at least one language');
    }

    setSubmitting(true);
    try {
      await api.post('/kyc/service', formData);
      toast.success("Profile Activated! You are now live.");
      navigate('/guide');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initializing Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card bg-white dark:bg-slate-900 p-8 md:p-16 rounded-[4rem] shadow-premium border border-white dark:border-slate-800"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16 text-center md:text-left">
            <div className="p-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-[2rem] shadow-xl shadow-green-500/10">
              <CheckCircle size={48} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-950 dark:text-white tracking-tighter italic font-serif leading-[0.9]">KYC APPROVED!</h1>
              <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Complete your pro profile to go live
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-16">
            {/* Section 1: Identity */}
            <div className="space-y-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-500">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Guiding Persona</h3>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 block">Professional Bio <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all min-h-[160px] resize-none"
                    placeholder="Describe your expertise, local stories, and what travelers should expect from your unique tours..."
                    required
                  />
                  <div className="absolute top-8 right-8 text-slate-300 dark:text-slate-700">
                    <Zap size={20} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 block">Primary Operation City <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                       type="text" 
                       name="primaryCity"
                       value={formData.primaryCity}
                       onChange={handleInputChange}
                       className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                       placeholder="e.g. Varanasi, UP"
                       required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 block">UPI ID for Payments</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                       type="text" 
                       name="upiId"
                       value={formData.upiId}
                       onChange={handleInputChange}
                       className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-sm font-mono font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                       placeholder="name@upi"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Expertise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-500">
                      <Languages size={20} />
                    </div>
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Languages <span className="text-red-500">*</span></label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleArrayItem('languages', lang)}
                        className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                          formData.languages.includes(lang) 
                          ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' 
                          : 'bg-white dark:bg-slate-950 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-indigo-200'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-500">
                      <Compass size={20} />
                    </div>
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Specializations</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions.map(spec => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleArrayItem('specialties', spec)}
                        className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                          formData.specialties.includes(spec) 
                          ? 'bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/20' 
                          : 'bg-white dark:bg-slate-950 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-purple-200'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* Section 3: Pricing */}
            <div className="p-10 md:p-14 bg-slate-950 rounded-[3rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                
                <div className="flex items-center gap-3 mb-10 relative z-10">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary-500">
                      <IndianRupee size={20} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Service Fees</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2 block italic">Price Per Hour <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-primary-500">₹</span>
                          <input 
                              type="number" 
                              name="pricePerHour"
                              value={formData.pricePerHour}
                              onChange={handleInputChange}
                              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-6 py-5 text-lg font-serif italic font-black focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                              placeholder="500"
                              required
                          />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2 block italic">Full Day Experience (8 Hours)</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-primary-500">₹</span>
                          <input 
                              type="number" 
                              name="pricePerDay"
                              value={formData.pricePerDay}
                              onChange={handleInputChange}
                              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-6 py-5 text-lg font-serif italic font-black focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                              placeholder="3000"
                          />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 4: Availability */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Weekly Schedule</h3>
                </div>

                <div className="flex flex-wrap gap-3">
                    {daysOptions.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleArrayItem('availableDays', day)}
                          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl font-black text-xs transition-all border-2 flex items-center justify-center ${
                             formData.availableDays.includes(day)
                             ? 'bg-blue-500 text-white border-blue-500 shadow-xl shadow-blue-500/20'
                             : 'bg-white dark:bg-slate-950 text-slate-400 border-slate-100 dark:border-slate-800 hover:border-blue-100'
                          }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 px-2 text-[10px] text-slate-400 italic">
                   <MousePointer2 size={12} />
                   <span>Select the days you are available for bookings</span>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={submitting}
                className="group relative w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-[2rem] py-6 text-sm font-black tracking-[0.3em] transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative flex items-center justify-center gap-3 uppercase">
                {submitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>LAUNCH PROFILE <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </div>
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default GuideSetupPage;
