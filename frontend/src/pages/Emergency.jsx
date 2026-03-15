import React from 'react';
import { motion } from 'framer-motion';
import { Phone, HeartPulse, Pill, Siren, ChevronRight, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Emergency = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      title: "Hospitals",
      icon: HeartPulse,
      color: "bg-red-500",
      items: [
        { name: "Apollo Hospital", phone: "0674-6661016", distance: "2.4 km" },
        { name: "Sum Ultimate", phone: "0674-3500300", distance: "4.1 km" }
      ]
    },
    {
      title: "Pharmacies",
      icon: Pill,
      color: "bg-orange-500",
      items: [
        { name: "MedPlus 24x7", phone: "1800-103-1414", distance: "0.5 km" },
        { name: "Apollo Pharmacy", phone: "1860-500-0101", distance: "1.2 km" }
      ]
    },
    {
      title: "Emergency Numbers",
      icon: Siren,
      color: "bg-slate-900",
      items: [
        { name: "Police", phone: "100", distance: "Immediate" },
        { name: "Ambulance", phone: "108", distance: "Immediate" },
        { name: "Fire", phone: "101", distance: "Immediate" }
      ]
    }
  ];

  return (
    <div className="bg-surface-50 min-h-screen pb-24 pt-6">
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-soft ring-1 ring-slate-100">
              <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
           </button>
           <h1 className="text-2xl font-bold text-slate-900">Emergency</h1>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {services.map((section, idx) => (
          <div key={idx} className="space-y-4">
             <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${section.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                   <section.icon className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">{section.title}</h2>
             </div>
             <div className="space-y-3">
                {section.items.map((item, i) => (
                  <motion.div 
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white p-5 rounded-[2rem] shadow-soft ring-1 ring-slate-100 flex items-center justify-between group"
                  >
                    <div className="flex-grow">
                       <h3 className="font-bold text-slate-900 text-sm mb-1">{item.name}</h3>
                       <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="text-primary-500">{item.distance}</span>
                          <span className="text-slate-200">|</span>
                          <span>{item.phone}</span>
                       </div>
                    </div>
                    <a 
                      href={`tel:${item.phone}`}
                      className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-soft active:scale-90"
                    >
                       <PhoneCall className="w-5 h-5" />
                    </a>
                  </motion.div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Emergency;
