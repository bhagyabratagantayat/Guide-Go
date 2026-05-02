import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Briefcase, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState('');

  const validate = () => {
    const e = {};
    if (!role) e.role = 'Please select your role';
    if (!phone || phone.replace(/\D/g, '').length < 10)
      e.phone = 'Enter a valid 10-digit phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerErr('');
    try {
      const res = await api.put('/auth/complete-profile', {
        phone, role, location
      });
      login(res.data.user, res.data.token);

      if (role === 'guide') navigate('/guide/verify-identity', { replace: true });
      else navigate('/', { replace: true });

    } catch (err) {
      setServerErr(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-6">
      <Helmet><title>Complete Setup | GuideGo</title></Helmet>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-8 md:p-12 w-full max-w-lg shadow-2xl border border-[#ebebeb] space-y-10"
      >
        <div className="text-center space-y-3">
          <div className="relative inline-block">
             <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#ff385c]/10 shadow-lg mx-auto">
                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=ff385c&color=fff`} className="w-full h-full object-cover" />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white shadow-md">
                <ShieldCheck size={16} />
             </div>
          </div>
          <h2 className="text-3xl font-black italic text-[#222222] tracking-tighter">Almost there!</h2>
          <p className="text-sm font-bold text-[#717171] uppercase tracking-widest">Hey {user?.name?.split(' ')[0]}, let's personalize your experience</p>
        </div>

        <div className="space-y-8">
           {/* Role Selection */}
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#717171] ml-4">I want to...</label>
              <div className="grid grid-cols-2 gap-4">
                 {[
                    { val: 'user', icon: User, label: 'Explore', sub: 'Traveler' },
                    { val: 'guide', icon: Briefcase, label: 'Guide', sub: 'Expert' }
                 ].map(r => {
                    const Icon = r.icon;
                    const isActive = role === r.val;
                    return (
                       <button 
                          key={r.val}
                          onClick={() => { setRole(r.val); setErrors(prev => ({...prev, role: ''})); }}
                          className={`p-6 rounded-[2rem] border transition-all text-center flex flex-col items-center gap-3 relative group ${
                             isActive ? 'bg-[#222222] border-[#222222] shadow-xl text-white' : 'bg-white border-[#dddddd] text-[#222222] hover:border-[#ff385c]/40'
                          }`}
                       >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                             isActive ? 'bg-white/20 text-white' : 'bg-[#f7f7f7] text-[#717171]'
                          }`}>
                             <Icon size={24} />
                          </div>
                          <div>
                             <p className="text-sm font-black italic">{r.label}</p>
                             <p className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-white/40' : 'text-[#717171]'}`}>{r.sub}</p>
                          </div>
                          {isActive && <div className="absolute top-4 right-4 w-2 h-2 bg-[#ff385c] rounded-full" />}
                       </button>
                    );
                 })}
              </div>
              {errors.role && <p className="text-xs font-bold text-[#ff385c] ml-4">{errors.role}</p>}
           </div>

           {/* Phone Input */}
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#717171] ml-4">Mobile Number</label>
              <div className="relative">
                 <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#717171]" size={20} />
                 <input 
                    type="tel" 
                    placeholder="10-digit phone number"
                    className="w-full bg-[#f7f7f7] border border-[#dddddd] rounded-full pl-16 pr-8 py-5 text-base font-bold text-[#222222] outline-none focus:bg-white focus:border-[#ff385c] transition-all"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setErrors(prev => ({...prev, phone: ''})); }}
                 />
              </div>
              {errors.phone && <p className="text-xs font-bold text-[#ff385c] ml-4">{errors.phone}</p>}
           </div>

           {/* Location Input */}
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#717171] ml-4">Current Location (Optional)</label>
              <div className="relative">
                 <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-[#717171]" size={20} />
                 <input 
                    type="text" 
                    placeholder="e.g. Bhubaneswar, Odisha"
                    className="w-full bg-[#f7f7f7] border border-[#dddddd] rounded-full pl-16 pr-8 py-5 text-base font-bold text-[#222222] outline-none focus:bg-white focus:border-[#ff385c] transition-all"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                 />
              </div>
           </div>

           {serverErr && (
             <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-xs font-bold">{serverErr}</div>
           )}

           <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full py-6 bg-[#ff385c] text-white rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 hover:bg-[#e31c5f] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
           >
              {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <>Finish Setup <ArrowRight size={20} /></>}
           </button>
        </div>
      </motion.div>
    </div>
  );
}
