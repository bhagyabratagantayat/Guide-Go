import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserCheck, 
  UserX, 
  MapPin, 
  ExternalLink,
  ShieldCheck,
  Languages,
  Clock
} from 'lucide-react';

const AdminGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGuides = async () => {
    try {
      const { data } = await axios.get('/api/admin/guides');
      setGuides(data.data);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/guides/${id}/status`, { status });
      fetchGuides(); // Refresh list
    } catch (error) {
      alert('Error updating guide status');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Guide Approvals</h3>
            <p className="text-xs font-bold text-slate-400">Review and verify local guide expertise</p>
          </div>
          <span className="px-4 py-2 bg-primary-100 text-primary-600 rounded-2xl text-xs font-black">
            {guides.filter(g => g.status === 'pending').length} PENDING SESSIONS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-8">
          {guides.map((guide) => (
            <div key={guide._id} className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 hover:border-primary-200 transition-all hover:shadow-xl group">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-inner flex items-center justify-center text-2xl font-black text-slate-300 overflow-hidden">
                  {guide.userId?.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : guide.userId?.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase">{guide.userId?.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{guide.userId?.email}</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-xs font-bold text-slate-600">
                   <ShieldCheck className="w-4 h-4 mr-2 text-primary-500" />
                   {guide.experience} Exp.
                </div>
                <div className="flex items-center text-xs font-bold text-slate-600">
                   <Languages className="w-4 h-4 mr-2 text-primary-500" />
                   {guide.languages.join(', ')}
                </div>
                <div className="flex items-center text-xs font-black text-green-600">
                   <Clock className="w-4 h-4 mr-2" />
                   ₹{guide.pricePerHour}/hr
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl mb-6 border border-slate-100">
                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Description</p>
                 <p className="text-[11px] text-slate-600 line-clamp-3 italic">"{guide.description}"</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                 <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                   guide.status === 'approved' ? 'bg-green-100 text-green-600' : 
                   guide.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                 }`}>
                   {guide.status}
                 </span>
                 
                 <div className="flex space-x-2">
                   {guide.status === 'pending' && (
                     <>
                        <button 
                          onClick={() => handleStatus(guide._id, 'approved')}
                          className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/20"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatus(guide._id, 'rejected')}
                          className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                     </>
                   )}
                   <button className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800">
                      <ExternalLink className="w-4 h-4" />
                   </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminGuides;
