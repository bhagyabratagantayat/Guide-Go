import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    duration: 'Forever',
    description: 'Essential access for casual travelers.',
    features: ['Access to basic maps', 'View hotel listings', 'Standard customer support', 'Community forums'],
    icon: Zap,
    color: 'slate',
    popular: false
  },
  {
    name: 'Premium',
    price: '₹599',
    duration: 'per month',
    description: 'Unlock the ultimate smart tourism experience.',
    features: ['AI Trip Planner (Unlimited)', 'Immersive Audio Guides', 'Offline Map Access', 'Priority Guide Booking', 'Ad-free Experience'],
    icon: Sparkles,
    color: 'primary',
    popular: true
  },
  {
    name: 'Pro',
    price: '₹999',
    duration: 'per month',
    description: 'For business travelers and verified guides.',
    features: ['Everything in Premium', 'Exclusive Lounge Access', 'Featured Guide Ranking', 'Dedicated 24/7 Agent'],
    icon: ShieldCheck,
    color: 'purple',
    popular: false
  }
];

const Subscription = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-950 min-h-screen pb-32 pt-24 text-white font-sans overflow-x-hidden">
      
      {/* Header */}
      <div className="px-6 mb-12 max-w-7xl mx-auto flex items-center space-x-4">
         <button 
           onClick={() => navigate(-1)} 
           className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
         >
            <ChevronLeft className="w-6 h-6" />
         </button>
         <div>
           <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic font-serif uppercase leading-none">Choose Your Plan</h1>
           <p className="text-slate-400 font-medium mt-2">Elevate your travel experience with premium features.</p>
         </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const isPremium = plan.popular;
          
          return (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-[2.5rem] p-8 border backdrop-blur-xl flex flex-col h-full transform transition-all duration-300 ${
                isPremium 
                ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-primary-500/50 shadow-2xl shadow-primary-500/10 scale-100 md:scale-105 z-10' 
                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900 scale-100'
              }`}
            >
               {isPremium && (
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-400 to-primary-600 text-slate-950 font-black tracking-widest uppercase text-xs px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                 </div>
               )}

               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  isPremium ? 'bg-primary-500/20 text-primary-400' : 
                  plan.color === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'
               }`}>
                  <Icon className="w-7 h-7" />
               </div>

               <h2 className="text-2xl font-black tracking-widest text-white uppercase mb-2">{plan.name}</h2>
               <p className="text-slate-400 text-sm font-medium mb-8 h-10">{plan.description}</p>

               <div className="flex items-baseline space-x-1 mb-8">
                  <span className={`text-5xl font-black tracking-tighter ${isPremium ? 'text-white' : 'text-slate-200'}`}>{plan.price}</span>
                  <span className="text-slate-500 font-bold">/{plan.duration}</span>
               </div>

               <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm font-medium text-slate-300">
                       <Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-primary-400' : 'text-slate-500'}`} />
                       <span>{feature}</span>
                    </li>
                  ))}
               </ul>

               <button 
                 className={`w-full py-4 rounded-xl font-black tracking-widest uppercase text-sm transition-all shadow-xl active:scale-[0.98] ${
                   isPremium 
                   ? 'bg-primary-500 text-slate-950 hover:bg-primary-400 shadow-primary-500/20' 
                   : 'bg-slate-800 text-white hover:bg-slate-700 shadow-transparent'
                 }`}
               >
                 {plan.price === '₹0' ? 'Get Started' : 'Subscribe Now'}
               </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscription;
