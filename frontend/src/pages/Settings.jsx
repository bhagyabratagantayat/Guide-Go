import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Bell, Shield, Info, Volume2, Moon, Sun, 
  CreditCard, Lock, EyeOff, Trash2, ChevronRight,
  Smartphone, Mail, MessageSquare, X, ShieldAlert
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import NotificationToast from '../components/NotificationToast';

const Settings = () => {
  const { i18n, t } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { user, updateUser, logout } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Password State
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' }
  ];

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' }
  ];

  const handleToggle = async (key, currentVal) => {
    try {
      const newVal = !currentVal;
      const { data } = await api.put('/auth/settings', { [key]: newVal });
      updateUser({ settings: data.settings });
      showToast(`${key} updated successfully`);
    } catch (err) {
      showToast('Failed to update setting', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) return showToast('Passwords do not match', 'error');
    setLoading(true);
    try {
      await api.put('/auth/change-password', { 
        currentPassword: passData.current, 
        newPassword: passData.new 
      });
      showToast('Password changed successfully');
      setShowPassModal(false);
      setPassData({ current: '', new: '', confirm: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/auth/account');
      logout();
    } catch (err) {
      showToast('Failed to delete account', 'error');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const userSettings = user?.settings || {
    pushNotifications: true,
    emailUpdates: true,
    audioNarration: false
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 md:p-10 max-w-5xl mx-auto space-y-12 bg-[#f7f7f7] dark:bg-[#0f172a] min-h-screen rounded-[2.5rem] border border-[#ebebeb] dark:border-white/10"
    >
      {toast.show && (
        <NotificationToast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}

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

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Lock size={16} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#222222] dark:text-white">Security</h3>
            </div>
            <div className="bg-white dark:bg-white/5 border border-[#ebebeb] dark:border-white/10 rounded-[2rem] overflow-hidden divide-y divide-[#ebebeb] dark:divide-white/10 shadow-sm">
              <SettingsActionItem 
                icon={Shield} 
                title="Change Password" 
                subtitle="Manage your authentication security" 
                onClick={() => setShowPassModal(true)}
              />
              <SettingsActionItem icon={Smartphone} title="Login Activity" subtitle="Devices currently logged in" />
              <SettingsActionItem icon={EyeOff} title="Account Privacy" subtitle="Control who sees your profile" />
              <SettingsActionItem 
                icon={Trash2} 
                title="Delete Account" 
                subtitle="Permanently remove your data" 
                variant="danger" 
                onClick={() => setShowDeleteModal(true)}
              />
            </div>
          </section>
        </div>

        {/* Right Column: Global Toggles */}
        <div className="space-y-12">
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
              <ToggleItem 
                icon={Bell} 
                label="Push Notifications" 
                active={userSettings.pushNotifications} 
                toggle={() => handleToggle('pushNotifications', userSettings.pushNotifications)} 
              />
              <div className="h-[1px] bg-[#ebebeb] dark:bg-white/10 mx-6" />
              <ToggleItem 
                icon={Mail} 
                label="Email Updates" 
                active={userSettings.emailUpdates} 
                toggle={() => handleToggle('emailUpdates', userSettings.emailUpdates)} 
              />
              <div className="h-[1px] bg-[#ebebeb] dark:bg-white/10 mx-6" />
              <ToggleItem 
                icon={Volume2} 
                label="Audio Narration" 
                active={userSettings.audioNarration} 
                toggle={() => handleToggle('audioNarration', userSettings.audioNarration)} 
              />
            </div>
          </section>

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
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPassModal && (
          <Modal onClose={() => setShowPassModal(false)}>
            <div className="p-8 space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 mx-auto mb-4">
                  <Shield size={32} />
                </div>
                <h3 className="text-2xl font-black text-[#222222] dark:text-white tracking-tighter">Security Protocol</h3>
                <p className="text-xs text-[#717171] uppercase font-bold tracking-widest mt-1">Change Account Password</p>
              </div>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">Current Password</label>
                  <input 
                    type="password" 
                    required
                    value={passData.current}
                    onChange={e => setPassData({...passData, current: e.target.value})}
                    className="w-full p-4 bg-[#f7f7f7] dark:bg-white/5 border border-transparent focus:border-[#ff385c] rounded-2xl font-bold outline-none transition-all dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passData.new}
                    onChange={e => setPassData({...passData, new: e.target.value})}
                    className="w-full p-4 bg-[#f7f7f7] dark:bg-white/5 border border-transparent focus:border-[#ff385c] rounded-2xl font-bold outline-none transition-all dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#717171] ml-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passData.confirm}
                    onChange={e => setPassData({...passData, confirm: e.target.value})}
                    className="w-full p-4 bg-[#f7f7f7] dark:bg-white/5 border border-transparent focus:border-[#ff385c] rounded-2xl font-bold outline-none transition-all dark:text-white" 
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-[#222222] dark:bg-[#ff385c] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg mt-4 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Authorize Change'}
                </button>
              </form>
            </div>
          </Modal>
        )}

        {showDeleteModal && (
          <Modal onClose={() => setShowDeleteModal(false)}>
            <div className="p-10 space-y-8 text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto mb-6 ring-8 ring-red-500/5">
                <ShieldAlert size={40} />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-[#222222] dark:text-white tracking-tighter italic font-serif">Extreme Caution</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">You are about to permanently purge your GuideGo account. This action cannot be undone and all data will be lost forever.</p>
              </div>
              
              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="w-full py-5 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-red-700 transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Purging...' : 'Confirm Destruction'}
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-5 bg-[#f7f7f7] dark:bg-white/5 text-[#717171] font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Abort Protocol
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Modal = ({ children, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="w-full max-w-md bg-white dark:bg-[#1e293b] rounded-[3rem] shadow-2xl overflow-hidden relative"
      onClick={e => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-6 right-6 p-2 text-[#717171] hover:text-[#ff385c] transition-colors">
        <X size={20} />
      </button>
      {children}
    </motion.div>
  </motion.div>
);

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
          animate={{ x: active ? 28 : 4 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
        />
     </div>
  </div>
);

const SettingsActionItem = ({ icon: Icon, title, subtitle, variant = 'default', onClick }) => (
  <div 
    onClick={onClick}
    className="p-6 flex items-center justify-between group hover:bg-[#f7f7f7] dark:hover:bg-white/5 transition-all cursor-pointer"
  >
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
