import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  User, MapPin, CreditCard, Clock, Layers, Image as ImageIcon, 
  CheckCircle, ChevronRight, ChevronLeft, Plus, X, 
  Camera, FileText, Video, Languages, Award, Globe,
  IndianRupee, Briefcase, Calendar, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const GuideOnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    name: user?.name || '',
    bio: '',
    languages: [],
    specialties: [],
    experience: '',
    
    // Step 2
    primaryCity: '',
    serviceAreas: [''],
    maxTravelRadius: '25',
    
    // Step 3
    pricePerHour: '',
    pricePerDay: '',
    packages: [{ name: '', price: '', duration: '', description: '' }],
    
    // Step 4
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: '09:00',
      endTime: '18:00',
      maxBookingsPerDay: 1,
      advanceNoticeHours: 24
    },
    
    // Step 5
    preferredPaymentMethod: 'Both',
    upiId: '',
    bankAccount: '',
    ifscCode: '',
    
    // Step 6 (Files handled separately)
    portfolio: {
      photos: [],
      certificates: [],
      videoIntro: ''
    }
  });

  const [files, setFiles] = useState({
    upiQrCode: null,
    profileImage: null,
    tourPhotos: [],
    certificates: [],
    videoIntro: null
  });

  const [previews, setPreviews] = useState({
    profileImage: null,
    upiQrCode: null,
    tourPhotos: [],
    videoIntro: null
  });

  const specialtyOptions = [
    'Heritage tours', 'Food tours', 'Adventure', 'Night tours', 
    'Photography', 'Shopping', 'Religious', 'Nature'
  ];

  const languageOptions = [
    'English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 
    'Tamil', 'Gujarati', 'Kannada', 'Odia', 'Malayalam'
  ];

  const daysOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    // Fetch current onboarding status if any
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get('/api/guides/onboarding/status');
        if (data.profileComplete) {
          navigate('/guide');
          return;
        }
        if (data.onboardingStep > 0 && data.onboardingStep < 7) {
            // We could optionally fetch partial data here, but for now we start from step 1
            // or we could use data.onboardingStep to set currentStep
            // setCurrentStep(data.onboardingStep);
        }
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };
    fetchStatus();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedInputChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => {
      const items = prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item];
      return { ...prev, [field]: items };
    });
  };

  const handleServiceAreaChange = (index, value) => {
    const newAreas = [...formData.serviceAreas];
    newAreas[index] = value;
    setFormData(prev => ({ ...prev, serviceAreas: newAreas }));
  };

  const addServiceArea = () => {
    if (formData.serviceAreas.length < 5) {
      setFormData(prev => ({ ...prev, serviceAreas: [...prev.serviceAreas, ''] }));
    }
  };

  const removeServiceArea = (index) => {
    const newAreas = formData.serviceAreas.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, serviceAreas: newAreas }));
  };

  const handlePackageChange = (index, field, value) => {
    const newPackages = [...formData.packages];
    newPackages[index][field] = value;
    setFormData(prev => ({ ...prev, packages: newPackages }));
  };

  const addPackage = () => {
    setFormData(prev => ({ 
      ...prev, 
      packages: [...prev.packages, { name: '', price: '', duration: '', description: '' }] 
    }));
  };

  const removePackage = (index) => {
    const newPackages = formData.packages.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, packages: newPackages }));
  };

  const handleFileChange = (e, field, isMultiple = false) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    if (isMultiple) {
      const newFiles = Array.from(selectedFiles);
      setFiles(prev => ({ ...prev, [field]: [...prev[field], ...newFiles].slice(0, 8) }));
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => ({ ...prev, [field]: [...prev[field], ...newPreviews].slice(0, 8) }));
    } else {
      const file = selectedFiles[0];
      setFiles(prev => ({ ...prev, [field]: file }));
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const removeFile = (field, index = -1) => {
      if (index === -1) {
          setFiles(prev => ({ ...prev, [field]: null }));
          setPreviews(prev => ({ ...prev, [field]: null }));
      } else {
          setFiles(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
          setPreviews(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
      }
  };

  const nextStep = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      
      // Filter current step data to send
      let stepData = {};
      if (currentStep === 1) {
          stepData = {
              description: formData.bio,
              languages: formData.languages,
              specialties: formData.specialties,
              experience: formData.experience
          };
      } else if (currentStep === 2) {
          stepData = {
              primaryCity: formData.primaryCity,
              serviceAreas: formData.serviceAreas,
              maxTravelRadius: formData.maxTravelRadius
          };
      } else if (currentStep === 3) {
          stepData = {
              pricePerHour: formData.pricePerHour,
              pricePerDay: formData.pricePerDay,
              packages: formData.packages
          };
      } else if (currentStep === 4) {
          stepData = {
              availability: formData.availability
          };
      } else if (currentStep === 5) {
          stepData = {
              preferredPaymentMethod: formData.preferredPaymentMethod,
              upiId: formData.upiId,
              bankAccount: formData.bankAccount,
              ifscCode: formData.ifscCode
          };
          if (files.upiQrCode) form.append('upiQrCode', files.upiQrCode);
      } else if (currentStep === 6) {
          // All portfolio files
          if (files.profileImage) form.append('profileImage', files.profileImage);
          files.tourPhotos.forEach(file => form.append('tourPhotos', file));
          files.certificates.forEach(file => form.append('certificates', file));
          if (files.videoIntro) form.append('videoIntro', files.videoIntro);
      }

      // Append data to FormData
      Object.keys(stepData).forEach(key => {
          if (typeof stepData[key] === 'object') {
              form.append(key, JSON.stringify(stepData[key]));
          } else {
              form.append(key, stepData[key]);
          }
      });

      await axios.put(`/api/guides/onboarding/step/${currentStep}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (currentStep < 6) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        setIsSubmitted(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save progress');
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderStepIcon = (step) => {
    const icons = [<User />, <MapPin />, <IndianRupee />, <Clock />, <CreditCard />, <ImageIcon />];
    const labels = ["Basic", "Areas", "Pricing", "Timing", "Bank", "Portfolio"];
    
    return (
      <div key={step} className="flex flex-col items-center gap-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          currentStep === step ? 'bg-primary-500 text-white scale-110 shadow-lg' : 
          currentStep > step ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
        }`}>
          {currentStep > step ? <CheckCircle size={20} /> : React.cloneElement(icons[step-1], { size: 20 })}
        </div>
        <span className={`text-[10px] font-bold tracking-tighter uppercase ${
            currentStep === step ? 'text-primary-600' : 'text-slate-400'
        }`}>{labels[step-1]}</span>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-premium"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} />
          </div>
          <h1 className="section-title text-green-600">Profile submitted!</h1>
          <p className="text-slate-600 font-medium">
            Your application is being reviewed. You'll appear in search once verified by our team (usually within 24 hours).
          </p>
          <button 
            onClick={() => navigate('/guide')}
            className="btn-primary w-full"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="section-title text-4xl mb-2">Guide Onboarding</h1>
            <p className="text-slate-500 font-medium italic">Complete your profile to start receiving bookings</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-soft flex items-center gap-4">
            <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Completion</span>
                <span className="text-xl font-bold italic text-primary-500">{Math.round((currentStep / 6) * 100)}%</span>
            </div>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 6) * 100}%` }}
                    className="h-full bg-primary-500" 
                />
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="glass-card p-6 rounded-3xl flex justify-between items-center overflow-x-auto gap-4 custom-scrollbar">
          {[1, 2, 3, 4, 5, 6].map(step => renderStepIcon(step))}
        </div>

        {/* Form Content */}
        <div className="glass-card p-8 rounded-[2.5rem] shadow-premium relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* STEP 1: BASIC INFO */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="input-group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        className="input-field" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="input-group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Years of Experience</label>
                      <input 
                        type="number" 
                        name="experience" 
                        value={formData.experience} 
                        onChange={handleInputChange} 
                        className="input-field" 
                        placeholder="e.g. 5"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Bio (Tell travelers about yourself)</label>
                    <textarea 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleInputChange} 
                      className="input-field min-h-[120px] resize-none py-4" 
                      placeholder="Share your passion for guiding..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block">Languages Spoken</label>
                    <div className="flex flex-wrap gap-2">
                      {languageOptions.map(lang => (
                        <button
                          key={lang}
                          onClick={() => toggleArrayItem('languages', lang)}
                          className={`chip flex items-center gap-2 border-2 ${
                            formData.languages.includes(lang) 
                            ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20' 
                            : 'bg-white text-slate-500 border-slate-100 hover:border-primary-200'
                          }`}
                        >
                          {formData.languages.includes(lang) && <CheckCircle size={12} />}
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
                          onClick={() => toggleArrayItem('specialties', spec)}
                          className={`chip flex items-center gap-2 border-2 ${
                            formData.specialties.includes(spec) 
                            ? 'bg-accent-500 text-white border-accent-500 shadow-lg shadow-accent-500/20' 
                            : 'bg-white text-slate-500 border-slate-100 hover:border-accent-200'
                          }`}
                        >
                          {formData.specialties.includes(spec) && <CheckCircle size={12} />}
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SERVICE AREAS */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="input-group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Primary City</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500" size={20} />
                      <input 
                        type="text" 
                        name="primaryCity" 
                        value={formData.primaryCity} 
                        onChange={handleInputChange} 
                        className="input-field pl-14" 
                        placeholder="e.g. Jaipur, Rajasthan"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block">Additional Service Areas (Up to 5)</label>
                    <div className="space-y-3">
                      {formData.serviceAreas.map((area, index) => (
                        <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
                           <input 
                              type="text" 
                              value={area} 
                              onChange={(e) => handleServiceAreaChange(index, e.target.value)} 
                              className="input-field" 
                              placeholder={`Area ${index + 1}`}
                            />
                            {formData.serviceAreas.length > 1 && (
                              <button onClick={() => removeServiceArea(index)} className="p-4 rounded-3xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                <X size={20} />
                              </button>
                            )}
                        </div>
                      ))}
                      {formData.serviceAreas.length < 5 && (
                        <button onClick={addServiceArea} className="btn-secondary w-full py-3 text-xs border-dashed border-slate-200">
                          <Plus size={16} /> Add Area
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Travel Radius (from primary city)</label>
                    <div className="grid grid-cols-4 gap-2">
                        {['5', '10', '25', '50', '100'].map(radius => (
                            <button
                                key={radius}
                                onClick={() => setFormData(prev => ({ ...prev, maxTravelRadius: radius }))}
                                className={`chip border-2 py-4 ${
                                    formData.maxTravelRadius === radius 
                                    ? 'bg-primary-500 text-white border-primary-500' 
                                    : 'bg-white text-slate-500 border-slate-100'
                                }`}
                            >
                                {radius}km{radius === '100' ? '+' : ''}
                            </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PRICING */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="input-group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Price Per Hour (₹)</label>
                      <input 
                        type="number" 
                        name="pricePerHour" 
                        value={formData.pricePerHour} 
                        onChange={handleInputChange} 
                        className="input-field" 
                        placeholder="500"
                      />
                    </div>
                    <div className="input-group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Price Per Day (₹)</label>
                      <input 
                        type="number" 
                        name="pricePerDay" 
                        value={formData.pricePerDay} 
                        onChange={handleInputChange} 
                        className="input-field" 
                        placeholder="3000"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 block">Tour Packages</label>
                        <button onClick={addPackage} className="text-primary-500 text-xs font-black flex items-center gap-1 hover:underline">
                            <Plus size={14} /> ADD PACKAGE
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.packages.map((pkg, index) => (
                        <div key={index} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative">
                          <button onClick={() => removePackage(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                             <X size={18} />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="Package Name" 
                                className="input-field bg-white"
                                value={pkg.name}
                                onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Price (₹)" 
                                    className="input-field bg-white"
                                    value={pkg.price}
                                    onChange={(e) => handlePackageChange(index, 'price', e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Duration" 
                                    className="input-field bg-white"
                                    value={pkg.duration}
                                    onChange={(e) => handlePackageChange(index, 'duration', e.target.value)}
                                />
                            </div>
                          </div>
                          <textarea 
                             placeholder="Description what's included..." 
                             className="input-field bg-white min-h-[80px] py-4"
                             value={pkg.description}
                             onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: AVAILABILITY */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block">Working Days</label>
                    <div className="flex flex-wrap gap-2">
                      {daysOptions.map(day => (
                        <button
                          key={day}
                          onClick={() => {
                            const days = formData.availability.days.includes(day)
                              ? formData.availability.days.filter(d => d !== day)
                              : [...formData.availability.days, day];
                            handleNestedInputChange('availability', 'days', days);
                          }}
                          className={`chip border-2 py-4 flex-1 min-w-[60px] ${
                            formData.availability.days.includes(day) 
                            ? 'bg-primary-500 text-white border-primary-500' 
                            : 'bg-white text-slate-500 border-slate-100'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="input-group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Start Time</label>
                      <input 
                        type="time" 
                        value={formData.availability.startTime} 
                        onChange={(e) => handleNestedInputChange('availability', 'startTime', e.target.value)} 
                        className="input-field" 
                      />
                    </div>
                    <div className="input-group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">End Time</label>
                      <input 
                        type="time" 
                        value={formData.availability.endTime} 
                        onChange={(e) => handleNestedInputChange('availability', 'endTime', e.target.value)} 
                        className="input-field" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="input-group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Max Bookings Per Day</label>
                      <select 
                        value={formData.availability.maxBookingsPerDay} 
                        onChange={(e) => handleNestedInputChange('availability', 'maxBookingsPerDay', e.target.value)} 
                        className="input-field appearance-none cursor-pointer"
                      >
                          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Booking' : 'Bookings'}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Advance Notice (Hours)</label>
                      <select 
                        value={formData.availability.advanceNoticeHours} 
                        onChange={(e) => handleNestedInputChange('availability', 'advanceNoticeHours', e.target.value)} 
                        className="input-field appearance-none cursor-pointer"
                      >
                          {[6, 12, 24, 48, 72].map(h => <option key={h} value={h}>{h} Hours</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PAYMENT DETAILS */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="input-group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">Preferred Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Cash', 'UPI', 'Both'].map(method => (
                            <button
                                key={method}
                                onClick={() => setFormData(prev => ({ ...prev, preferredPaymentMethod: method }))}
                                className={`chip border-2 py-4 ${
                                    formData.preferredPaymentMethod === method 
                                    ? 'bg-primary-500 text-white border-primary-500' 
                                    : 'bg-white text-slate-500 border-slate-100'
                                }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                  </div>

                  {formData.preferredPaymentMethod !== 'Cash' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="input-group">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">UPI ID</label>
                            <input 
                                type="text" 
                                name="upiId" 
                                value={formData.upiId} 
                                onChange={handleInputChange} 
                                className="input-field" 
                                placeholder="username@upi"
                            />
                        </div>

                        <div className="input-group">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 mb-2 block">UPI QR Code</label>
                            <div className="relative group">
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 transition-all">
                                    {previews.upiQrCode ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={previews.upiQrCode} alt="QR Preview" className="w-full h-full object-contain" />
                                            <button onClick={(e) => { e.preventDefault(); removeFile('upiQrCode'); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <ImageIcon className="mx-auto text-slate-300" size={32} />
                                            <p className="text-xs font-bold text-slate-400">UPLOAD QR CODE</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'upiQrCode')} />
                                </label>
                            </div>
                        </div>
                    </motion.div>
                  )}

                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-2">
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                          <Info size={16} />
                          <span className="text-xs font-bold uppercase tracking-widest">Bank Details (Optional)</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            name="bankAccount" 
                            value={formData.bankAccount} 
                            onChange={handleInputChange} 
                            className="input-field bg-white" 
                            placeholder="Bank Account Number"
                        />
                        <input 
                            type="text" 
                            name="ifscCode" 
                            value={formData.ifscCode} 
                            onChange={handleInputChange} 
                            className="input-field bg-white" 
                            placeholder="IFSC Code"
                        />
                      </div>
                  </div>
                </div>
              )}

              {/* STEP 6: PORTFOLIO */}
              {currentStep === 6 && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-8">
                     {/* Profile Image */}
                     <div className="w-full md:w-1/3 space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block">Profile Photo</label>
                        <label className="relative group block w-48 h-48 mx-auto">
                            <div className="w-full h-full rounded-full border-4 border-white shadow-premium overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer">
                                {previews.profileImage ? (
                                    <img src={previews.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={40} className="text-slate-300" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Update</span>
                                </div>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profileImage')} />
                        </label>
                     </div>

                     {/* Video Intro */}
                     <div className="w-full md:w-2/3 space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block">Video Intro (Max 60s)</label>
                        <label className={`block w-full h-48 border-2 border-dashed rounded-3xl cursor-pointer hover:bg-slate-50 transition-all flex flex-col items-center justify-center text-center ${previews.videoIntro ? 'border-green-200' : 'border-slate-200'}`}>
                            {previews.videoIntro ? (
                                <div className="p-4 flex items-center gap-4">
                                     <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                         <Video size={24} />
                                     </div>
                                     <div className="text-left">
                                         <p className="text-sm font-bold text-slate-800">Video Uploaded</p>
                                         <button onClick={(e) => { e.preventDefault(); removeFile('videoIntro'); }} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Change Video</button>
                                     </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Video className="mx-auto text-slate-300" size={32} />
                                    <p className="text-xs font-bold text-slate-400">TAP TO CHOOSE VIDEO</p>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'videoIntro')} />
                        </label>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block">Tour Photos (Best shots of your tours - Up to 8)</label>
                     <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                        {previews.tourPhotos.map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-soft group">
                                <img src={url} alt={`Tour ${idx}`} className="w-full h-full object-cover" />
                                <button onClick={() => removeFile('tourPhotos', idx)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        {files.tourPhotos.length < 8 && (
                           <label className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all bg-white">
                               <ImageIcon className="text-slate-300" size={24} />
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Add</span>
                               <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleFileChange(e, 'tourPhotos', true)} />
                           </label>
                        )}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2 block">Certifications / ID Proof</label>
                     <div className="flex gap-4">
                         {files.certificates.map((file, idx) => (
                             <div key={idx} className="bg-slate-50 px-4 py-3 rounded-2xl flex items-center gap-3 border border-slate-100">
                                 <FileText size={18} className="text-primary-500" />
                                 <span className="text-xs font-bold text-slate-600 max-w-[100px] truncate">{file.name}</span>
                                 <button onClick={() => removeFile('certificates', idx)} className="text-slate-400 hover:text-red-500">
                                     <X size={16} />
                                 </button>
                             </div>
                         ))}
                         <label className="cursor-pointer bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:border-primary-200 hover:text-primary-500 transition-all flex items-center gap-2">
                            <Plus size={16} /> Add Proof
                            <input type="file" className="hidden" multiple onChange={(e) => handleFileChange(e, 'certificates', true)} />
                         </label>
                     </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4">
          <button 
            onClick={prevStep} 
            disabled={currentStep === 1 || loading}
            className={`btn-secondary flex items-center gap-2 ${currentStep === 1 ? 'opacity-0 invisible' : ''}`}
          >
            <ChevronLeft size={18} /> BACK
          </button>
          
          <button 
            onClick={nextStep} 
            disabled={loading}
            className="btn-primary min-w-[200px]"
          >
            {loading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <>
                    {currentStep === 6 ? 'SUBMIT PROFILE' : 'CONTINUE'} 
                    {currentStep !== 6 && <ChevronRight size={18} />}
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideOnboardingPage;
