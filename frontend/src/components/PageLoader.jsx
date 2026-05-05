import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="relative">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 border-4 border-[#ff385c]/20 border-t-[#ff385c] rounded-full"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-[#ff385c] rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};

export default PageLoader;
