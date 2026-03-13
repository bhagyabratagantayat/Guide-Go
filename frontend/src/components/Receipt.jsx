import React from 'react';
import { CheckCircle2, MapPin, Calendar, Clock, DollarSign, Download, Share2, X } from 'lucide-react';

const Receipt = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-500">
        {/* Success Header */}
        <div className="bg-green-500 p-8 text-center text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Payment Success!</h2>
          <p className="text-green-100 font-bold mt-1 text-sm">Your booking is confirmed</p>
        </div>

        {/* Receipt Content */}
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receipt ID</p>
              <p className="text-sm font-black text-slate-900 uppercase">{booking.paymentId?.substring(0, 12)}...</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
              <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                   <div className="p-2 bg-slate-50 rounded-xl text-primary-500">
                      <Calendar className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-black text-slate-500 uppercase">Tour Date</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{new Date(booking.bookingTime).toLocaleDateString()}</span>
             </div>
             
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                   <div className="p-2 bg-slate-50 rounded-xl text-primary-500">
                      <MapPin className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-black text-slate-500 uppercase">Location</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{booking.location}</span>
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                   <div className="p-2 bg-slate-50 rounded-xl text-primary-500">
                      <DollarSign className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-black text-slate-500 uppercase">Amount Paid</span>
                </div>
                <span className="text-lg font-black text-green-600">₹{booking.price}</span>
             </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Verified Transaction</p>
             <p className="text-[11px] text-slate-600 font-medium">Your payment has been processed securely via Razorpay. A confirmation email has been sent to your registered address.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
                <Download className="w-4 h-4 mr-2" /> Download
             </button>
             <button className="flex items-center justify-center py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Share2 className="w-4 h-4 mr-2" /> Share
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
