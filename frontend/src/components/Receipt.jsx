import React from 'react';
import { 
  CheckCircle2, MapPin, Calendar, Clock, 
  DollarSign, Download, Share2, X, Compass,
  Ticket, ShieldCheck, QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Receipt = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
       <motion.div 
         initial={{ opacity: 0, scale: 0.9, y: 30 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.9, y: 30 }}
         className="w-full max-w-md relative"
       >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute -top-14 right-0 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all active:scale-90"
          >
             <X className="w-5 h-5" />
          </button>

          <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden relative border border-white/20">
             {/* Ticket "Cut-out" effect circles - Matching pure background color */}
             <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-slate-950 rounded-full z-[20] shadow-inner" />
             <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 bg-slate-950 rounded-full z-[20] shadow-inner" />

             {/* Header Section with Premium Gradient */}
             <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-12 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl" />
                
                <motion.div 
                   initial={{ scale: 0, rotate: -45 }}
                   animate={{ scale: 1, rotate: 0 }}
                   transition={{ type: "spring", damping: 15, delay: 0.2 }}
                   className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/30"
                >
                   <CheckCircle2 className="w-12 h-12 text-white drop-shadow-md" />
                </motion.div>
                
                <h2 className="text-4xl font-black italic font-serif leading-none tracking-tighter mb-3">Booking Success!</h2>
                <div className="flex items-center justify-center space-x-2 text-primary-100/80 text-[10px] font-black uppercase tracking-[0.3em]">
                   <ShieldCheck className="w-3.5 h-3.5" />
                   <span>Transaction Secured</span>
                </div>
             </div>

             {/* Ticket Body */}
             <div className="p-10 space-y-12 relative">
                {/* ID and Date Row */}
                <div className="flex justify-between items-start">
                   <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passport ID</p>
                      <p className="text-sm font-black text-slate-900 tracking-wider font-mono bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                         #{booking._id?.substring(0, 10).toUpperCase() || "BPS-77291"}
                      </p>
                   </div>
                   <div className="text-right space-y-1.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Issued</p>
                      <p className="text-sm font-black text-slate-900 uppercase">
                         {new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                   </div>
                </div>

                {/* Main Details (Horizontal Divider) */}
                <div className="relative">
                   <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-slate-200 -mx-10" />
                   <div className="pt-12 grid grid-cols-2 gap-x-8 gap-y-10">
                      <div className="space-y-1.5">
                         <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            <MapPin className="w-3 h-3 mr-2 text-primary-500" /> Destination
                         </div>
                         <p className="text-lg font-black text-slate-900 italic font-serif leading-none truncate">{booking.location}</p>
                      </div>
                      <div className="space-y-1.5 text-right">
                         <div className="flex items-center justify-end text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            <Ticket className="w-3 h-3 mr-2 text-orange-500" /> Experience
                         </div>
                         <p className="text-lg font-black text-slate-900 italic font-serif leading-none">Guided Tour</p>
                      </div>
                      <div className="space-y-1.5">
                         <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            <Calendar className="w-3 h-3 mr-2 text-blue-500" /> Departure
                         </div>
                         <p className="text-lg font-black text-slate-900 italic font-serif leading-none">{new Date(booking.bookingTime).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1.5 text-right">
                         <div className="flex items-center justify-end text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            <Clock className="w-3 h-3 mr-2 text-green-500" /> Arrival Time
                         </div>
                         <p className="text-lg font-black text-slate-900 italic font-serif leading-none">{new Date(booking.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                   </div>
                </div>

                {/* Total Price Section - Premium Glass Card */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 flex items-center justify-between text-white shadow-xl shadow-slate-900/20 active:scale-95 transition-transform group overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl group-hover:bg-primary-500/30 transition-colors" />
                   <div className="space-y-1 relative z-10">
                      <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Vault Payment</p>
                      <p className="text-xs font-bold text-white/50 italic font-serif">Includes security tax</p>
                   </div>
                   <div className="text-right relative z-10">
                      <span className="text-[10px] font-black text-primary-500 mr-2 italic">INR</span>
                      <span className="text-4xl font-black text-white tracking-tighter">₹{booking.price}</span>
                   </div>
                </div>

                {/* Verified QR Code Area */}
                <div className="flex flex-col items-center justify-center space-y-5 pt-4">
                   <motion.div 
                     whileHover={{ scale: 1.05, rotate: 2 }}
                     className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-premium relative group cursor-pointer"
                   >
                      <QrCode className="w-24 h-24 text-slate-900 group-hover:text-primary-600 transition-colors" />
                      <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-2 rounded-full shadow-lg">
                         <ShieldCheck className="w-4 h-4" />
                      </div>
                   </motion.div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Digital Proof of Entry</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                   <button className="flex-1 flex items-center justify-center py-6 bg-slate-100 text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 border border-slate-200 shadow-sm">
                      <Download className="w-4 h-4 mr-2 text-primary-600" /> Save Pass
                   </button>
                   <button className="flex-1 flex items-center justify-center py-6 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-900/10">
                      <Share2 className="w-4 h-4 mr-2 text-primary-400" /> Share
                   </button>
                </div>
             </div>
          </div>

          <p className="text-center mt-10 text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">Pass Issued by GuideGo Global Operations</p>
       </motion.div>
    </div>
  );
};

export default Receipt;
