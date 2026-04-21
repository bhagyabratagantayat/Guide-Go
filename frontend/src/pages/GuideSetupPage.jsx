import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, IndianRupee, MapPin, CheckCircle, 
  ChevronRight, Globe, Award, Calendar, Info, 
  CreditCard 
} from 'lucide-react';
import { motion } from 'framer-motion';
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

  const languageOptions = ['English', 'Hindi', 'Odia', 'Bengali', 'Tamil', 'Telugu'];
  const specialtyOptions = ['Heritage tours', 'Food tours', 'Adventure', 'Nature', 'Religious', 'Photography'];
  const daysOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await api.get('/kyc/status');
        if (data.kycStatus !== 'approved') {
          navigate('/guide/verify');
          return;
        }
        if (data.profileComplete) {
          navigate('/guide/dashboard');
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

    setSubmitting(true);
    try {
      await api.post('/kyc/service', formData);
      toast.success("You're live! travelers can now find you.");
      navigate('/guide/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setSubmitting(false);
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
    <div className="min-h-screen bg-surface-50 dark:bg-slate-950 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 rounded-[3rem] shadow-premium"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl">
              <CheckCircle size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black italic font-serif leading-none">KYC Approved!</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Last step: Set up your guiding services</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2 ml-1">
                <Briefcase size={16} className="text-indigo-500" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Professional Identity</h3>
              </div>
              
              <div className="input-group">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Professional Bio</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="input-field min-h-[120px] py-4 resize-none"
                  placeholder="Tell travelers about your passion, local knowledge, and what makes your tours special..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="input-group">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Primary City</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                       type="text" 
                       name="primaryCity"
                       value={formData.primaryCity}
                       onChange={handleInputChange}
                       className="input-field pl-14"
                       placeholder="e.g. Puri, Odisha"
                       required
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">UPI ID (Optional)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                       type="text" 
                       name="upiId"
                       value={formData.upiId}
                       onChange={handleInputChange}
                       className="input-field pl-14 font-mono"
                       placeholder="username@upi"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleArrayItem('languages', lang)}
                        className={`chip py-3 border-2 transition-all ${
                          formData.languages.includes(lang) 
                          ? 'bg-indigo-500 text-white border-indigo-500' 
                          : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions.map(spec => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleArrayItem('specialties', spec)}
                        className={`chip py-3 border-2 transition-all ${
                          formData.specialties.includes(spec) 
                          ? 'bg-accent-500 text-white border-accent-500' 
                          : 'bg-white text-slate-500 border-slate-100 hover:border-accent-200'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* Pricing Section */}
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-6">
                <div className="flex items-center gap-2 ml-1">
                    <IndianRupee size={16} className="text-green-500" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Consultation Pricing</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="input-group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Price Per Hour (₹)</label>
                        <input 
                            type="number" 
                            name="pricePerHour"
                            value={formData.pricePerHour}
                            onChange={handleInputChange}
                            className="input-field bg-white dark:bg-slate-900"
                            placeholder="500"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Price Per Day (Full Experience) (₹)</label>
                        <input 
                            type="number" 
                            name="pricePerDay"
                            value={formData.pricePerDay}
                            onChange={handleInputChange}
                            className="input-field bg-white dark:bg-slate-900"
                            placeholder="3000"
                        />
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div className="space-y-4 px-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 block">Available Days</label>
                <div className="flex justify-between md:justify-start gap-2">
                    {daysOptions.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleArrayItem('availableDays', day)}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl font-black text-xs transition-all border-2 flex items-center justify-center ${
                             formData.availableDays.includes(day)
                             ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                             : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-100'
                          }`}
                        >
                            {day.slice(0, 3)}
                        </button>
                    ))}
                </div>
                <p className="text-[10px] text-slate-400 italic">Travelers can only book you on selected days.</p>
            </div>

            <button 
                type="submit" 
                disabled={submitting}
                className="btn-primary w-full py-5 text-base tracking-[0.2em]"
            >
              {submitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>GO LIVE ON PLATFORM <ChevronRight size={20} className="ml-2" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default GuideSetupPage;
