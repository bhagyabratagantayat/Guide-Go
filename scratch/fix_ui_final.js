const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../frontend/src/pages/BookGuidePage.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Update OTP section
const otpTarget = `<p className="text-[10px] text-slate-500 font-bold mt-8 uppercase tracking-widest italic">Share this with {matchedGuide?.name} to start trip</p>\n                  </div>`;
const otpReplacement = `<p className="text-[10px] text-slate-500 font-bold mt-8 uppercase tracking-widest italic">Share this with {matchedGuide?.name} to start trip</p>
                  </div>
                  
                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-3 gap-3">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black uppercase text-slate-500 mb-1 tracking-widest">Plan</p>
                        <p className="text-[10px] font-black text-white italic">{formData.plan}</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black uppercase text-slate-500 mb-1 tracking-widest">Fee</p>
                        <p className="text-[10px] font-black text-white italic">₹{formData.price}</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] font-black uppercase text-slate-500 mb-1 tracking-widest">Lang</p>
                        <p className="text-[10px] font-black text-white italic truncate">{formData.language}</p>
                     </div>
                  </div>`;

if (content.includes(otpTarget)) {
    content = content.replace(otpTarget, otpReplacement);
    console.log('OTP section updated');
}

// 2. Update Ongoing section
const ongoingTarget = `<div className="bg-[#1e293b] p-10 rounded-[3rem] flex items-center gap-8 border border-white/5">\n                     <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className=\"w-20 h-20 rounded-[1.8rem] object-cover\" alt=\"\"/>\n                     <div><h4 className=\"font-black text-2xl text-white italic\">{matchedGuide?.name}</h4><p className=\"text-[11px] font-bold text-slate-500 flex items-center gap-2 mt-2 uppercase tracking-widest\"><Navigation size={14} className=\"text-blue-500\" /> Active Trip</p></div>\n                  </div>`;
const ongoingReplacement = `<div className="bg-[#1e293b] p-10 rounded-[3rem] flex items-center gap-8 border border-white/5">
                     <img src={matchedGuide?.profilePicture || 'https://i.pravatar.cc/150'} className="w-20 h-20 rounded-[1.8rem] object-cover" alt=""/>
                     <div><h4 className="font-black text-2xl text-white italic">{matchedGuide?.name}</h4><p className="text-[11px] font-bold text-slate-500 flex items-center gap-2 mt-2 uppercase tracking-widest"><Navigation size={14} className="text-blue-500" /> Active Trip</p></div>
                  </div>

                  {/* Ongoing Session Info */}
                  <div className="grid grid-cols-3 gap-4">
                     <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/5 text-center">
                        <p className="text-[8px] font-black uppercase text-white/40 mb-1 tracking-widest">Plan</p>
                        <p className="text-xs font-black text-white italic">{currentBooking?.plan || formData.plan}</p>
                     </div>
                     <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/5 text-center">
                        <p className="text-[8px] font-black uppercase text-white/40 mb-1 tracking-widest">Fee</p>
                        <p className="text-xs font-black text-white italic">₹{currentBooking?.price || formData.price}</p>
                     </div>
                     <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/5 text-center">
                        <p className="text-[8px] font-black uppercase text-white/40 mb-1 tracking-widest">Location</p>
                        <p className="text-xs font-black text-white italic truncate">{currentBooking?.location?.split(',')[0] || formData.location?.split(',')[0]}</p>
                     </div>
                  </div>`;

if (content.includes(ongoingTarget)) {
    content = content.replace(ongoingTarget, ongoingReplacement);
    console.log('Ongoing section updated');
}

fs.writeFileSync(file, content);
console.log('File written successfully');
