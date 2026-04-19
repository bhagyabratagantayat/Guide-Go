import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe, Bell, Shield, Info, Volume2, Moon } from 'lucide-react';

const Settings = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' }
  ];

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] mb-2">Preferences</h1>
        <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">Settings</h2>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Language Selection */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <Globe size={20} className="text-[var(--accent)]" />
             <h3 className="text-[10px] font-black uppercase tracking-widest text-white">System Language</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {languages.map((lang) => (
              <button 
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center gap-2 ${
                  i18n.language === lang.code ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] hover:border-white/20'
                }`}
              >
                <span className="text-xl font-bold">{lang.native}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{lang.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Global Toggles */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <Shield size={20} className="text-emerald-500" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Global Settings</h3>
           </div>
           <div className="glass-card rounded-[2.5rem] p-4 divide-y divide-white/5 overflow-hidden">
              <ToggleItem icon={Moon} label="Dark Mode Energy Saving" active />
              <ToggleItem icon={Bell} label="Push Notifications" active />
              <ToggleItem icon={Volume2} label="Audio Guide Narration" active />
           </div>
        </section>

        {/* About App */}
        <div className="text-center py-10 border-t border-[var(--border)] space-y-4">
           <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)]">
              <Info size={14} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">GuideGo Elite • v1.0.8</p>
           </div>
           <p className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.4em]">Designed & Developed with Passion for Odisha</p>
        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ icon: Icon, label, active }) => (
  <div className="p-6 flex items-center justify-between group">
     <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[var(--text-secondary)]">
           <Icon size={18} />
        </div>
        <span className="text-sm font-bold text-white tracking-tight">{label}</span>
     </div>
     <div className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-[var(--accent)]' : 'bg-white/10'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${active ? 'right-1' : 'left-1'}`} />
     </div>
  </div>
);

export default Settings;
