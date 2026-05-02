import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, MapPin, Camera, Star, 
  Settings as SettingsIcon, History, LogOut, ShieldCheck,
  Edit3, Save, X, Phone, Globe, Briefcase, IndianRupee,
  ChevronRight, CheckCircle2, Award
} from 'lucide-react';
import api from '../utils/api';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    location: '',
    bio: '',
    languages: '',
    pricePerHour: '',
    upiId: '',
    profilePicture: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        mobile: user.mobile || '',
        location: typeof user.location === 'object' ? user.location.address || '' : user.location || '',
        bio: user.bio || '',
        languages: Array.isArray(user.languages) ? user.languages.join(', ') : user.languages || '',
        pricePerHour: user.pricePerHour || '',
        upiId: user.upiId || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-[#ff385c]/10 rounded-full flex items-center justify-center mx-auto text-[#ff385c]">
          <User size={32} />
        </div>
        <h2 className="text-xl font-bold text-[#222222]">Please login to view profile</h2>
        <button onClick={() => navigate('/login')} className="px-8 py-3 bg-[#ff385c] text-white rounded-full font-bold shadow-lg">Login</button>
      </div>
    </div>
  );

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        languages: typeof formData.languages === 'string' 
          ? formData.languages.split(',').map(l => l.trim()).filter(Boolean)
          : []
      };
      const { data } = await api.put('/auth/profile', payload);
      updateUser(data.user);
      setIsEditing(false);
    } catch (err) {
      console.error('Update Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] pb-24">
      <Helmet><title>{user.name} | GuideGo Profile</title></Helmet>

      {/* Header / Cover Area */}
      <div className="h-64 bg-gradient-to-r from-[#ff385c] to-[#e31c5f] relative">
         <div className="absolute inset-0 bg-black/10" />
         <div className="max-w-5xl mx-auto h-full px-6 relative">
            <div className="absolute -bottom-16 left-6 flex flex-col md:flex-row items-end gap-6">
               <div className="relative group">
                  <div className="w-40 h-40 rounded-[2.5rem] bg-white p-1.5 shadow-2xl overflow-hidden border-4 border-white">
                     <div className="w-full h-full rounded-[2rem] overflow-hidden bg-[#f7f7f7] flex items-center justify-center">
                        {formData.profilePicture || user.profilePicture ? (
                           <img src={formData.profilePicture || user.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                           <span className="text-6xl font-black text-[#ff385c]">{user.name.charAt(0)}</span>
                        )}
                     </div>
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 p-3 bg-white rounded-2xl text-[#222222] shadow-xl hover:scale-110 transition-transform cursor-pointer border border-[#ebebeb]">
                       <Camera size={20} />
                       <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                    </label>
                  )}
               </div>
               
               <div className="pb-4 text-center md:text-left">
                  <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">{user.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                        {user.role}
                     </span>
                     <span className="flex items-center gap-1 text-[10px] font-bold text-white/80">
                        <CheckCircle2 size={12} className="text-green-400" /> Verified Member
                     </span>
                  </div>
               </div>
            </div>

            <div className="absolute bottom-4 right-6 flex gap-3">
               {!isEditing ? (
                 <button 
                   onClick={() => setIsEditing(true)}
                   className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-sm flex items-center gap-2 hover:bg-white/20 transition-all shadow-lg"
                 >
                   <Edit3 size={16} /> Edit Profile
                 </button>
               ) : (
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-sm flex items-center gap-2 hover:bg-white/20 transition-all"
                    >
                      <X size={16} /> Cancel
                    </button>
                    <button 
                      onClick={handleUpdate}
                      disabled={loading}
                      className="px-8 py-3 bg-white text-[#ff385c] rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                    >
                      {loading ? <div className="w-4 h-4 border-2 border-[#ff385c] border-t-transparent animate-spin rounded-full" /> : <Save size={16} />} 
                      Save Changes
                    </button>
                 </div>
               )}
            </div>
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Left Side: Details */}
         <div className="lg:col-span-8 space-y-10">
            {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 text-sm font-bold">{error}</div>}

            <section className="bg-white rounded-[2.5rem] p-10 border border-[#ebebeb] shadow-sm space-y-8">
               <h3 className="text-2xl font-black text-[#222222]">Personal Information</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">Full Name</label>
                     <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0b0b0]" size={18} />
                        <input 
                           type="text" 
                           readOnly={!isEditing}
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className={`w-full bg-[#f7f7f7] border-2 rounded-2xl pl-14 pr-6 py-4 font-bold text-[#222222] transition-all outline-none ${isEditing ? 'border-[#ff385c]/20 focus:border-[#ff385c]' : 'border-transparent cursor-default'}`}
                        />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0b0b0]" size={18} />
                        <input 
                           type="email" 
                           readOnly
                           value={user.email}
                           className="w-full bg-[#f7f7f7] border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 font-bold text-[#b0b0b0] cursor-not-allowed"
                        />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">Mobile Number</label>
                     <div className="relative">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0b0b0]" size={18} />
                        <input 
                           type="text" 
                           readOnly={!isEditing}
                           value={formData.mobile}
                           onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                           className={`w-full bg-[#f7f7f7] border-2 rounded-2xl pl-14 pr-6 py-4 font-bold text-[#222222] transition-all outline-none ${isEditing ? 'border-[#ff385c]/20 focus:border-[#ff385c]' : 'border-transparent cursor-default'}`}
                        />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">Location</label>
                     <div className="relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0b0b0]" size={18} />
                        <input 
                           type="text" 
                           readOnly={!isEditing}
                           value={formData.location}
                           onChange={(e) => setFormData({...formData, location: e.target.value})}
                           className={`w-full bg-[#f7f7f7] border-2 rounded-2xl pl-14 pr-6 py-4 font-bold text-[#222222] transition-all outline-none ${isEditing ? 'border-[#ff385c]/20 focus:border-[#ff385c]' : 'border-transparent cursor-default'}`}
                        />
                     </div>
                  </div>
               </div>
            </section>

            {user.role === 'guide' && (
              <section className="bg-white rounded-[2.5rem] p-10 border border-[#ebebeb] shadow-sm space-y-8">
                 <h3 className="text-2xl font-black text-[#222222]">Guide Expertise</h3>
                 <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">Professional Bio</label>
                       <textarea 
                          readOnly={!isEditing}
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          rows={4}
                          className={`w-full bg-[#f7f7f7] border-2 rounded-3xl p-6 font-bold text-[#222222] transition-all outline-none resize-none ${isEditing ? 'border-[#ff385c]/20 focus:border-[#ff385c]' : 'border-transparent cursor-default'}`}
                          placeholder="Tell us about your guiding experience..."
                       />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">Languages (Comma separated)</label>
                          <div className="relative">
                             <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0b0b0]" size={18} />
                             <input 
                                type="text" 
                                readOnly={!isEditing}
                                value={formData.languages}
                                onChange={(e) => setFormData({...formData, languages: e.target.value})}
                                className={`w-full bg-[#f7f7f7] border-2 rounded-2xl pl-14 pr-6 py-4 font-bold text-[#222222] transition-all outline-none ${isEditing ? 'border-[#ff385c]/20 focus:border-[#ff385c]' : 'border-transparent cursor-default'}`}
                             />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">Hourly Rate (₹)</label>
                          <div className="relative">
                             <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-[#b0b0b0]" size={18} />
                             <input 
                                type="number" 
                                readOnly={!isEditing}
                                value={formData.pricePerHour}
                                onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                                className={`w-full bg-[#f7f7f7] border-2 rounded-2xl pl-14 pr-6 py-4 font-bold text-[#222222] transition-all outline-none ${isEditing ? 'border-[#ff385c]/20 focus:border-[#ff385c]' : 'border-transparent cursor-default'}`}
                             />
                          </div>
                       </div>
                    </div>
                 </div>
              </section>
            )}
         </div>

         {/* Right Side: Stats & Security */}
         <div className="lg:col-span-4 space-y-10">
            <div className="bg-[#222222] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
               <Award className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff385c] mb-6">Account Trust</h4>
               <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium text-white/60">Profile Strength</span>
                     <span className="text-sm font-black">92%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                     <div className="w-[92%] h-full bg-[#ff385c]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p className="text-2xl font-black italic">12</p>
                        <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mt-1">Trips</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p className="text-2xl font-black italic">4.9</p>
                        <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mt-1">Rating</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-2 border border-[#ebebeb] shadow-sm divide-y divide-[#f7f7f7]">
               <button className="w-full p-6 flex items-center justify-between group hover:bg-[#f7f7f7] transition-all rounded-[2rem]">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#f7f7f7] text-[#222222] rounded-xl flex items-center justify-center">
                        <SettingsIcon size={18} />
                     </div>
                     <span className="text-sm font-bold text-[#222222]">Preferences</span>
                  </div>
                  <ChevronRight size={16} className="text-[#717171]" />
               </button>
               <button className="w-full p-6 flex items-center justify-between group hover:bg-[#f7f7f7] transition-all rounded-[2rem]">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#f7f7f7] text-[#222222] rounded-xl flex items-center justify-center">
                        <ShieldCheck size={18} />
                     </div>
                     <span className="text-sm font-bold text-[#222222]">Security</span>
                  </div>
                  <ChevronRight size={16} className="text-[#717171]" />
               </button>
               <button onClick={logout} className="w-full p-6 flex items-center justify-between group hover:bg-red-50 transition-all rounded-[2rem]">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                        <LogOut size={18} />
                     </div>
                     <span className="text-sm font-bold text-red-500">Sign Out</span>
                  </div>
                  <ChevronRight size={16} className="text-red-200" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
