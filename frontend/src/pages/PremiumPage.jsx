import React from 'react';
import { Star, CheckCircle2, Zap, Crown, Sparkles, Headphones, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumPage = () => {
  const tiers = [
    {
      name: 'Free Explorer',
      price: '0',
      desc: 'Start your journey with essential local tools.',
      features: ['Basic Guide Search', 'Audio Previews', 'Chat with 1 Guide/day', 'Standard Weather'],
      color: 'border-white/10 text-white/50',
      btn: 'CURRENT PLAN'
    },
    {
      name: 'GuideGo Elite',
      price: '499',
      desc: 'The ultimate toolkit for the seamless traveler.',
      features: ['Unlimited AI Assistant', 'Lossless Audio Guides', 'Priority Booking', 'Exclusive Secret Spots', '24/7 Premium Support'],
      color: 'border-blue-500/30 text-white',
      isPremium: true,
      btn: 'UPGRADE NOW'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent)]">Unlock the Full Experience</h1>
        <h2 className="text-5xl font-black italic font-serif text-[var(--text-primary)] tracking-tighter">Elevate Your Travel</h2>
        <p className="text-[var(--text-secondary)] font-medium leading-relaxed">Join thousands of premium members who unlock hidden stories and priority access across Odisha.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto pt-10">
        {tiers.map((tier, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ y: -6 }}
            className={`bg-[var(--bg-card)] p-10 rounded-[var(--radius-lg)] border-2 ${tier.isPremium ? 'border-[var(--accent)]/40 shadow-2xl shadow-[var(--accent)]/10' : 'border-[var(--border-color)]'} relative overflow-hidden flex flex-col transition-all`}
          >
            {tier.isPremium && (
              <div className="absolute top-0 right-0 p-4">
                 <div className="bg-[var(--accent)] text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <Crown size={12} /> RECOMMENDED
                 </div>
              </div>
            )}
            
            <div className="mb-10">
               <h3 className="text-2xl font-black italic font-serif text-[var(--text-primary)] mb-2">{tier.name}</h3>
               <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-[var(--text-primary)] tracking-tighter">₹{tier.price}</span>
                  <span className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]"> / Month</span>
               </div>
               <p className="text-sm font-medium text-[var(--text-muted)] mt-4">{tier.desc}</p>
            </div>

            <div className="space-y-4 flex-grow mb-12">
               {tier.features.map((f, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className={tier.isPremium ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'} />
                    <span className="text-[13px] font-bold text-[var(--text-primary)] opacity-80">{f}</span>
                 </div>
               ))}
            </div>

            <button className={`w-full py-5 rounded-[var(--radius-md)] font-black text-[12px] uppercase tracking-widest transition-all ${
              tier.isPremium 
              ? 'bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white shadow-xl shadow-[var(--accent)]/20' 
              : 'bg-white/5 text-[var(--text-primary)] hover:bg-white/10'
            }`}>
               {tier.btn}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Grid of icons for hype */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10">
         {[
          { icon: Sparkles, label: 'Early Access' },
          { icon: Headphones, label: 'HD Audio' },
          { icon: ShieldCheck, label: 'Safety Net' },
          { icon: Zap, label: 'Zero Fees' },
         ].map((item, i) => (
           <div key={i} className="flex flex-col items-center text-center space-y-3 opacity-30">
              <item.icon size={32} className="text-[var(--text-secondary)]" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">{item.label}</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default PremiumPage;
