import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Globe, Bell, Shield, 
  HelpCircle, Info, ChevronRight, Languages
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language === 'or' ? 'Odia' : 'English';

  return (
    <div className="min-h-screen bg-surface-50 pb-20">
      {/* Premium Header */}
      <div className="bg-slate-900 pt-32 pb-48 px-8 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500 rounded-full blur-[120px] -mr-48 -mt-48" />
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10 flex items-center space-x-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-14 h-14 bg-white/10 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
            >
               <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-5xl font-black text-white tracking-tighter italic font-serif leading-none uppercase">
               {t('common.settings')}
            </h1>
         </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 -mt-24 relative z-20">
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[4rem] shadow-premium overflow-hidden border border-slate-100"
         >
            <div className="p-10 space-y-12">
               {/* Language Section */}
               <section className="space-y-6">
                  <div className="flex items-center space-x-3 mb-2">
                     <Globe className="w-5 h-5 text-primary-500" />
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t('settings.language_realm')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                     <button 
                       onClick={() => changeLanguage('en')}
                       className={`w-full p-6 rounded-3xl border flex items-center justify-between transition-all ${
                         i18n.language === 'en' 
                         ? 'bg-slate-900 border-transparent text-white shadow-xl' 
                         : 'bg-slate-50 border-slate-100 text-slate-800 hover:bg-white hover:shadow-soft'
                       }`}
                     >
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                              <span className="font-bold text-xs">EN</span>
                           </div>
                           <span className="text-sm font-black tracking-tight">English (International)</span>
                        </div>
                        {i18n.language === 'en' && <div className="w-2 h-2 bg-primary-500 rounded-full shadow-lg" />}
                     </button>

                     <button 
                       onClick={() => changeLanguage('or')}
                       className={`w-full p-6 rounded-3xl border flex items-center justify-between transition-all ${
                         i18n.language === 'or' 
                         ? 'bg-slate-900 border-transparent text-white shadow-xl' 
                         : 'bg-slate-50 border-slate-100 text-slate-800 hover:bg-white hover:shadow-soft'
                       }`}
                     >
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                              <span className="font-bold text-xs">OR</span>
                           </div>
                           <span className="text-sm font-black tracking-tight">ଓଡ଼ିଆ (Heritage)</span>
                        </div>
                        {i18n.language === 'or' && <div className="w-2 h-2 bg-primary-500 rounded-full shadow-lg" />}
                     </button>
                  </div>
               </section>

               {/* Notifications */}
               <section className="space-y-6 opacity-40 grayscale pointer-events-none">
                  <div className="flex items-center space-x-3 mb-2">
                     <Bell className="w-5 h-5 text-indigo-500" />
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t('settings.communication')}</h3>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                     <span className="text-sm font-black tracking-tight text-slate-800">{t('settings.push_notifications')}</span>
                     <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                     </div>
                  </div>
               </section>

               {/* Footer Info */}
               <div className="pt-12 border-t border-slate-50 text-center space-y-2">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">GuideGo Global Version 1.0.4</p>
                  <p className="text-[8px] font-bold text-slate-200 uppercase tracking-[0.4em] mb-4">Crafted for Modern Travelers</p>
               </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
};

export default Settings;
