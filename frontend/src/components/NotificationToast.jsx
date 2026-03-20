import React, { useEffect, useState } from 'react';
import { Bell, X, CheckCircle, Info, Calendar } from 'lucide-react';

const NotificationToast = ({ notification, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // Wait for fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'booking_received': return <Calendar className="w-6 h-6 text-secondary-500" />;
      case 'booking_status_update': return <CheckCircle className="w-6 h-6 text-green-500" />;
      default: return <Info className="w-6 h-6 text-primary-500" />;
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform transition-all duration-500 ease-out ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
      <div className="p-5 flex items-start space-x-4">
        <div className="flex-shrink-0 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-slate-900 dark:text-white leading-tight mb-1 uppercase tracking-tight">
            {notification.title}
          </p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
            {notification.message}
          </p>
          
          {notification.type === 'booking_received' && (
            <div className="flex items-center space-x-3 mt-4">
              <button 
                onClick={() => {
                  notification.onAccept?.(notification.bookingId);
                  setVisible(false);
                  setTimeout(onClose, 500);
                }}
                className="flex-1 py-2 bg-primary-500 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
              >
                Accept
              </button>
              <button 
                onClick={() => {
                  notification.onDecline?.(notification.bookingId);
                  setVisible(false);
                  setTimeout(onClose, 500);
                }}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
              >
                Decline
              </button>
            </div>
          )}
        </div>
        <button 
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 500);
          }}
          className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="h-1 bg-slate-100 dark:bg-slate-800 w-full overflow-hidden">
        <div className="h-full bg-primary-500 animate-progress"></div>
      </div>
      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation: progress 5s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
