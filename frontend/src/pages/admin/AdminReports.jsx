import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  User, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  Clock,
  MoreHorizontal,
  ChevronRight,
  ShieldOff,
  Unlock,
  Filter,
  Search
} from 'lucide-react';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [moderating, setModerating] = useState(false);

  const fetchReports = async () => {
    try {
      const { data } = await axios.get('/api/reports');
      setReports(data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (reportId, guideId, action, durationDays = 7) => {
    setModerating(true);
    try {
      // 1. Update Guide Status
      await axios.put(`/api/admin/guides/${guideId}/moderate`, { action, durationDays });
      
      // 2. Update Report Status
      const adminAction = action === 'block' ? 'permanently_blocked' : 
                         action === 'temp_block' ? 'temporarily_blocked' : 'none';
      
      await axios.put(`/api/reports/${reportId}`, { 
        status: 'action_taken',
        adminAction 
      });

      // 3. Refresh list
      await fetchReports();
      setSelectedReport(null);
    } catch (error) {
      alert('Error taking action: ' + (error.response?.data?.message || error.message));
    } finally {
      setModerating(false);
    }
  };

  const resolveReport = async (reportId) => {
    try {
      await axios.put(`/api/reports/${reportId}`, { status: 'resolved' });
      await fetchReports();
    } catch (error) {
      alert('Error updating report');
    }
  };

  const filteredReports = reports.filter(r => filter === 'all' || r.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
         <div className="space-y-3">
            <h1 className="text-6xl font-black text-slate-950 tracking-tighter italic font-serif leading-[0.85]">Safety Hub</h1>
            <p className="text-slate-400 font-bold text-[11px] tracking-[0.4em] uppercase flex items-center">
               <ShieldAlert className="w-4 h-4 mr-3 text-red-500 animate-pulse" /> Resident Reporting & Moderation
            </p>
         </div>
         
         <div className="flex items-center space-x-3">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-primary-500 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="action_taken">Action Taken</option>
              <option value="resolved">Resolved</option>
            </select>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Reports List */}
        <div className="lg:col-span-2 space-y-6">
          {filteredReports.length > 0 ? filteredReports.map((report) => (
            <motion.div 
              key={report._id}
              layoutId={report._id}
              onClick={() => setSelectedReport(report)}
              className={`glass-card p-8 rounded-[2.5rem] cursor-pointer transition-all border ${
                selectedReport?._id === report._id ? 'border-primary-500 ring-4 ring-primary-500/10' : 'border-slate-50'
              } hover:shadow-xl group`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-5">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                     report.status === 'pending' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'
                   }`}>
                      <AlertCircle className="w-7 h-7" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tighter uppercase">{report.reason}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Reported by {report.reporter?.name} • {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                   </div>
                </div>
                <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border ${
                  report.status === 'pending' ? 'bg-red-50 text-red-600 border-red-100' :
                  report.status === 'action_taken' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                  'bg-green-50 text-green-600 border-green-100'
                }`}>
                  {report.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-slate-600 text-sm font-medium leading-relaxed italic line-clamp-2 mb-6">
                "{report.description}"
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                 <div className="flex items-center space-x-3">
                    <div className="flex -space-x-3">
                       <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black">
                          {report.guide?.userId?.name?.charAt(0)}
                       </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-900 uppercase">Target: {report.guide?.userId?.name}</span>
                 </div>
                 <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                   selectedReport?._id === report._id ? 'text-primary-500' : 'text-slate-300'
                 }`} />
              </div>
            </motion.div>
          )) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2.5rem] flex items-center justify-center mx-auto">
                 <CheckCircle className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">No security reports found</p>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="space-y-8">
           <AnimatePresence mode="wait">
             {selectedReport ? (
               <motion.div 
                 key="details"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 20 }}
                 className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-premium sticky top-10"
               >
                 <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                          <ShieldAlert className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Review Report</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: #{selectedReport._id.slice(-6)}</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="p-6 bg-slate-50 rounded-[1.5rem] space-y-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</p>
                          <p className="text-sm font-medium text-slate-700 italic leading-relaxed">"{selectedReport.description}"</p>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 border border-slate-100 rounded-2xl">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Guide Status</p>
                             <span className="text-xs font-black text-slate-900 uppercase">
                               {selectedReport.guide.status}
                             </span>
                          </div>
                          <div className="p-5 border border-slate-100 rounded-2xl">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Booking ID</p>
                             <span className="text-xs font-black text-slate-900 uppercase">
                               #{selectedReport.booking?._id?.slice(-6) || 'Direct'}
                             </span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">Moderate Executive</p>
                       
                       <div className="grid grid-cols-1 gap-3">
                          <button 
                            disabled={moderating}
                            onClick={() => handleAction(selectedReport._id, selectedReport.guide._id, 'temp_block', 7)}
                            className="w-full py-4 bg-orange-50 text-orange-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-100 transition-all flex items-center justify-center"
                          >
                             <Clock className="w-4 h-4 mr-2" /> Temporary Suspend (7 Days)
                          </button>
                          
                          <button 
                            disabled={moderating}
                            onClick={() => handleAction(selectedReport._id, selectedReport.guide._id, 'block')}
                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center shadow-lg shadow-red-600/20"
                          >
                             <ShieldOff className="w-4 h-4 mr-2" /> Permanently Block ID
                          </button>
                          
                          <button 
                            disabled={moderating}
                            onClick={() => handleAction(selectedReport._id, selectedReport.guide._id, 'unblock')}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center"
                          >
                             <Unlock className="w-4 h-4 mr-2" /> Restore Eligibility
                          </button>
                          
                          <button 
                            disabled={moderating}
                            onClick={() => resolveReport(selectedReport._id)}
                            className="w-full py-4 border border-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-slate-900 hover:border-slate-200 transition-all"
                          >
                             Mark as Resolved
                          </button>
                       </div>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <motion.div 
                 key="placeholder"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center space-y-6 h-[400px]"
               >
                 <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-soft">
                    <Filter className="w-8 h-8 text-slate-300" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">No Selection</h3>
                    <p className="text-xs text-slate-400 font-bold max-w-[180px]">Select a report to analyze details and take moderation action.</p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
