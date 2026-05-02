import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Globe, Bell, Shield, Info, Volume2, Moon, Sun, 
  CreditCard, Lock, EyeOff, Trash2, ChevronRight,
  Smartphone, Mail, MessageSquare
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

const Settings = () => {
  const { i18n, t } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { currency, setCurrency } = useCurrency();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' }
  ];

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 md:p-10 max-w-5xl mx-auto space-y-12 bg-[#f7f7f7] dark:bg-[#0f172a] min-h-screen rounded-[2.5rem] border border-[#ebebeb] dark:border-white/10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff385c] mb-2">System Preferences</h1>
          <h2 className="text-4xl md:text-5xl font-black text-[#222222] dark:text-white tracking-tighter">Settings</h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 rounded-full border border-[#ebebeb] dark:border-white/10 shadow-sm">
          <Info size={14} className="text-[#ff385c]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#717171] dark:text-white/60">GuideGo Elite v1.2.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Language & Currency */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Language Selection */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ff385c]/10 flex items-center justify-center text-[#ff385c]">
                <Globe size={16} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#222222] dark:text-white">Language</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <button 
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-2 group ${
                    i18n.language === lang.code 
                      ? 'border-[#ff385c] bg-[#ff385c]/5 shadow-md' 
                      : 'border-[#ebebeb] dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#ff385c]/30'
                  }`}
                >
                  <span className={`text-2xl font-black ${i18n.language === lang.code ? 'text-[#ff385c]' : 'text-[#222222] dark:text-white'}`}>
                    {lang.native}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#717171] dark:text-white/40 group-hover:text-[#ff385c]">
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Currency Selection */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CreditCard size={16} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#222222] dark:text-white">Currency</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currencies.map((curr) => (
                <button 
                  key={curr.code}
                  onClick={() => setCurrency(curr.code)}
                  className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${
                    currency === curr.code 
                      ? 'border-emerald-500 bg-emerald-500/5 shadow-md' 
                      : 'border-[#ebebeb] dark:border-white/10 bg-white dark:bg-white/5 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-black w-10 h-10 rounded-full flex items-center justify-center ${
                      currency === curr.code ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-white/10 text-[#222222] dark:text-white'
                    }`}>
                      {curr.symbol}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-black text-[#222222] dark:text-white tracking-tight">{curr.code}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#717171] dark:text-white/40">{curr.name}</p>
                    </div>
                  </div>
                  {currency === curr.code && (
                    <motion.div layoutId="curr-check" className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <ChevronRight size={12} className="text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Account Security */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Lock size={16} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#222222] dark:text-white">Security</h3>
            </div>
            <div className="bg-white dark:bg-white/5 border border-[#ebebeb] dark:border-white/10 rounded-[2rem] overflow-hidden divide-y divide-[#ebebeb] dark:divide-white/10">
              <SettingsActionItem icon={Shield} title="Password & Authentication" subtitle="Manage your password and 2FA" />
              <SettingsActionItem icon={Smartphone} title="Login Activity" subtitle="Devices currently logged in" />
              <SettingsActionItem icon={EyeOff} title="Account Privacy" subtitle="Control who sees your profile" />
              <SettingsActionItem 
                icon={Trash2} 
                title="Delete Account" 
                subtitle="Permanently remove your data" 
                variant="danger" 
              />
            </div>
          </section>
        </div>

        {/* Right Column: Global Toggles & App Info */}
        <div className="space-y-12">
          {/* Global Toggles */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Bell size={16} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#222222] dark:text-white">Experience</h3>
            </div>
            <div className="bg-white dark:bg-white/5 border border-[#ebebeb] dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm">
              <ToggleItem 
                icon={darkMode ? Sun : Moon} 
                label={darkMode ? "Light Mode UI" : "Dark Mode UI"} 
                active={darkMode} 
                toggle={toggleDarkMode}
              />
              <div className="h-[1px] bg-[#ebebeb] dark:bg-white/10 mx-6" />
              <ToggleItem icon={Bell} label="Push Notifications" active={true} toggle={() => {}} />
              <div className="h-[1px] bg-[#ebebeb] dark:bg-white/10 mx-6" />
              <ToggleItem icon={Mail} label="Email Updates" active={true} toggle={() => {}} />
              <div className="h-[1px] bg-[#ebebeb] dark:bg-white/10 mx-6" />
              <ToggleItem icon={Volume2} label="Audio Narration" active={false} toggle={() => {}} />
            </div>
          </section>

          {/* Help & Support */}
          <section className="space-y-6">
            <div className="bg-[#222222] dark:bg-[#ff385c] p-8 rounded-[2rem] text-white space-y-4 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <MessageSquare size={120} />
              </div>
              <h3 className="text-xl font-black italic">Need Help?</h3>
              <p className="text-sm text-white/70 leading-relaxed">Our support team is available 24/7 to help you with your journey.</p>
              <button className="w-full py-4 bg-white text-[#222222] font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/90 transition-all">
                Contact Support
              </button>
            </div>
          </section>

          {/* Footer Info */}
          <div className="text-center space-y-2 opacity-40">
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#717171] dark:text-white">Designed in Odisha</p>
             <p className="text-[9px] font-bold text-[#717171] dark:text-white">© 2024 GuideGo Platform</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ToggleItem = ({ icon: Icon, label, active, toggle }) => (
  <div className="p-6 flex items-center justify-between group hover:bg-[#f7f7f7] dark:hover:bg-white/5 transition-all cursor-pointer" onClick={toggle}>
     <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
          active ? 'bg-[#ff385c]/10 text-[#ff385c]' : 'bg-gray-100 dark:bg-white/10 text-[#717171]'
        }`}>
           <Icon size={18} />
        </div>
        <span className="text-sm font-black text-[#222222] dark:text-white tracking-tight">{label}</span>
     </div>
     <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-[#ff385c]' : 'bg-[#dddddd] dark:bg-white/10'}`}>
        <motion.div 
          animate={{ x: active ? 24 : 4 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
        />
     </div>
  </div>
);

const SettingsActionItem = ({ icon: Icon, title, subtitle, variant = 'default' }) => (
  <div className="p-6 flex items-center justify-between group hover:bg-[#f7f7f7] dark:hover:bg-white/5 transition-all cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
        variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-gray-100 dark:bg-white/10 text-[#717171]'
      }`}>
        <Icon size={18} />
      </div>
      <div>
        <p className={`text-sm font-black tracking-tight ${variant === 'danger' ? 'text-red-500' : 'text-[#222222] dark:text-white'}`}>
          {title}
        </p>
        <p className="text-[10px] font-bold text-[#717171] dark:text-white/40 uppercase tracking-widest">
          {subtitle}
        </p>
      </div>
    </div>
    <ChevronRight size={16} className="text-[#717171] group-hover:translate-x-1 transition-transform" />
  </div>
);

export default Settings;
