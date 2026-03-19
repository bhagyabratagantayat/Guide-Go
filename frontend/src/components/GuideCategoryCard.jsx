import React from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Star, Clock } from 'lucide-react';

const GuideCategoryCard = ({ category, isSelected, onClick }) => {
  const { name, price, eta, icon: Icon, description, color } = category;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-[1.5rem] border-2 transition-all duration-300 ${
        isSelected 
        ? `${color.border} ${color.bg} shadow-lg shadow-${color.shadow}/10` 
        : 'border-slate-100 bg-white hover:border-slate-200'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-14 h-14 rounded-2xl ${isSelected ? color.iconBg : 'bg-slate-50'} flex items-center justify-center transition-colors`}>
           <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
        </div>
        <div className="text-left">
          <div className="flex items-center space-x-2">
            <h4 className={`font-black tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>{name}</h4>
            {isSelected && <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
            {eta} min • {description}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-lg font-black tracking-tighter ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>₹{price}</p>
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 italic">per hour</p>
      </div>
    </motion.button>
  );
};

export default GuideCategoryCard;
