import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, MapPin, Camera, Star, 
  Settings as SettingsIcon, History, LogOut, ShieldCheck
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div className="p-10 text-white">Please login to view profile.</div>;

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-[var(--bg-card)] border border-[var(--border-color)] p-12 rounded-[var(--radius-lg)] relative overflow-hidden group hover:border-[var(--border-hover)] transition-all">
        <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-12 -translate-y-12">
           <User size={240} className="text-[var(--accent)]" />
        </div>
        
        <div className="relative">
           <div className="w-40 h-40 rounded-[var(--radius-lg)] bg-[var(--bg-base)] border-4 border-[var(--accent)] p-1 overflow-hidden shadow-2xl">
              <div className="w-full h-full rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-card)] flex items-center justify-center">
                 {user.profilePicture ? (
                   <img src={user.profilePicture} className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-6xl font-black text-[var(--accent)] italic font-serif">{user.name.charAt(0)}</span>
                 )}
              </div>
           </div>
           <button className="absolute bottom-2 right-2 p-3 bg-[var(--accent)] rounded-2xl text-white border-4 border-[var(--bg-card)] shadow-xl hover:scale-110 transition-transform">
              <Camera size={20} />
           </button>
        </div>

        <div className="text-center md:text-left space-y-4 relative z-10">
           <div className="space-y-1">
              <h1 className="text-5xl font-black italic font-serif text-[var(--text-primary)] tracking-tighter leading-none">{user.name}</h1>
              <p className="text-[10px] font-black uppercase text-[var(--accent)] tracking-[0.4em]">{user.role} Account • Verified Member</p>
           </div>
           <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <InfoChip icon={Mail} label={user.email} />
              <InfoChip icon={MapPin} label={user.location || 'Bhubaneswar, Odisha'} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] ml-2">Member Statistics</h3>
           <div className="grid grid-cols-2 gap-4">
              <StatCard label="Trips Taken" value="12" icon={History} />
              <StatCard label="Places Saved" value="48" icon={Star} />
           </div>
        </section>

        <section className="space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] ml-2">Quick Actions</h3>
           <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-lg)] divide-y divide-[var(--border-color)] overflow-hidden">
              <ActionItem icon={SettingsIcon} label="Account Settings" onClick={() => navigate('/settings')} />
              <ActionItem icon={ShieldCheck} label="Security Privacy" onClick={() => {}} />
              <ActionItem icon={LogOut} label="Emergency Logout" red onClick={logout} />
           </div>
        </section>
      </div>
    </div>
  );
};

const InfoChip = ({ icon: Icon, label }) => (
  <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2 text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-widest">
     <Icon size={12} className="text-[var(--accent)]" /> {label}
  </div>
);

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-[var(--radius-lg)] flex flex-col items-center text-center space-y-4 hover:border-[var(--border-hover)] transition-all">
     <div className="w-12 h-12 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
        <Icon size={24} />
     </div>
     <div>
        <p className="text-3xl font-black text-[var(--text-primary)] italic font-serif leading-none">{value}</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-2">{label}</p>
     </div>
  </div>
);

const ActionItem = ({ icon: Icon, label, onClick, red }) => (
  <button 
    onClick={onClick}
    className="w-full p-6 flex items-center justify-between group hover:bg-white/5 transition-all"
  >
     <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${red ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-[var(--text-secondary)]'} transition-colors`}>
           <Icon size={18} />
        </div>
        <span className={`text-sm font-bold ${red ? 'text-red-500' : 'text-white'} tracking-tight`}>{label}</span>
     </div>
     <ArrowRight size={16} className="text-[var(--text-secondary)] group-hover:text-white transition-all group-hover:translate-x-1" />
  </button>
);

const ArrowRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default Profile;
