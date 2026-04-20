import React from 'react';
import { Bell, Calendar, ShieldCheck, Heart, User, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationsPage = () => {
  const notifications = [
    { id: 1, type: 'booking', message: 'Your booking with Guide Santosh is confirmed!', time: '2 hours ago', icon: Calendar, color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 2, type: 'kyc', message: 'Your identity verification was successful. Welcome aboard!', time: '5 hours ago', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 3, type: 'alert', message: 'Someone viewed your travel profile recently.', time: '1 day ago', icon: User, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 4, type: 'system', message: 'New Premium features are now available for your account.', time: '2 days ago', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] mb-2">Account Activity</h1>
        <h2 className="text-4xl font-black italic font-serif text-[var(--text-primary)]">Notifications</h2>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((note, idx) => (
            <motion.div 
               key={note.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-[var(--radius-lg)] flex items-center gap-6 group hover:border-[var(--border-hover)] cursor-pointer transition-all"
            >
              <div className={`w-14 h-14 ${note.bg} ${note.color} rounded-[var(--radius-md)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                 <note.icon size={24} />
              </div>
              <div className="flex-grow">
                 <p className="text-[13px] font-bold text-[var(--text-primary)] leading-tight mb-1">{note.message}</p>
                 <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-muted)]">{note.time}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0 shadow-lg shadow-[var(--accent)]/40" />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-24 opacity-30">
             <Bell size={48} className="mx-auto mb-4" />
             <h3 className="text-xl font-bold italic font-serif">No notifications yet.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
