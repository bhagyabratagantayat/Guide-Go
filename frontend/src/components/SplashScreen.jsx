import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-surface-50 flex flex-col items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-8">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 bg-primary-500/10 rounded-full blur-3xl scale-150"
           />
           <div className="w-24 h-24 bg-primary-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary-500/30 relative z-10 animate-float">
             <Compass className="w-12 h-12 stroke-[2.5]" />
           </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic font-serif mb-2">GuideGo</h1>
          <p className="text-sm font-black text-primary-500 uppercase tracking-[0.3em]">Smart Travel Companion</p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "120px" }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="h-1 bg-primary-100 rounded-full mt-12 overflow-hidden"
      >
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-1/2 bg-primary-500"
        />
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
