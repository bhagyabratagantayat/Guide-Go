import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, Globe, Check, 
  Languages, Bell, Shield, 
  Eye, Monitor, Smartphone
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="bg-surface-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-6 sticky top-0 z-10 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 mr-4 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">
        {/* Language Section */}
        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Choose Language</h2>
              <p className="text-xs text-slate-400 font-medium">Select your preferred language for the app</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-3 shadow-soft ring-1 ring-slate-100 space-y-2">
            {languages.map((lang) => {
              const isActive = i18n.language?.startsWith(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-[1.8rem] transition-all duration-300 ${
                    isActive 
                    ? 'bg-primary-50 ring-1 ring-primary-100' 
                    : 'hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left">
                      <p className={`font-bold text-sm ${isActive ? 'text-primary-700' : 'text-slate-700'}`}>
                        {lang.native}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                        {lang.name}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Placeholder Sections */}
        <div className="space-y-4 opacity-50">
          <SettingItem icon={Bell} label="Notifications" />
          <SettingItem icon={Shield} label="Privacy & Security" />
          <SettingItem icon={Eye} label="Display" />
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ icon: Icon, label }) => (
  <div className="w-full flex items-center justify-between p-5 bg-white rounded-[2rem] shadow-sm ring-1 ring-slate-100">
    <div className="flex items-center space-x-4">
      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-bold text-slate-600">{label}</span>
    </div>
    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Coming Soon</div>
  </div>
);

export default Settings;
