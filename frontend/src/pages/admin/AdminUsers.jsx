import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Shield, 
  Trash2, 
  Mail, 
  MapPin,
  Search,
  Filter,
  ChevronDown,
  ShieldAlert,
  Clock
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users');
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Strike user from registry? This action is irreversible.')) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        alert('Security protocol breach during deletion');
      }
    }
  };

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'tourist' : 'admin';
    try {
      await axios.put(`/api/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      alert('Failed to re-assign clearance level');
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post('/api/admin/users/admin', formData);
      if (data.success) {
        setUsers([data.data, ...users]);
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '', mobile: '' });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Handshake failed during registration');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-[1.5rem] animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Search & Filter Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search explorers by name, email or clearance..."
            className="w-full pl-16 pr-8 py-5 bg-white border border-surface-100 rounded-[2.5rem] shadow-premium focus:ring-4 focus:ring-primary-500/5 outline-none font-bold text-sm leading-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-12 pr-10 py-5 bg-white border border-surface-100 rounded-[2rem] shadow-premium text-slate-800 font-black text-[10px] uppercase tracking-[0.2em] outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-primary-500/5"
            >
              <option value="all">Access: All Regions</option>
              <option value="admin">Tier: Administrators</option>
              <option value="guide">Tier: Local Experts</option>
              <option value="tourist">Tier: Global Explorers</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-5 bg-slate-950 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-primary-500 hover:text-slate-950 transition-all flex items-center group"
          >
            <Plus className="w-4 h-4 mr-3 group-hover:rotate-90 transition-transform" /> Elevate Admin
          </button>
        </div>
      </div>

      {/* Main Registry Table */}
      <div className="bg-white rounded-[3.5rem] shadow-premium border border-surface-50 overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Identity</th>
                <th className="px-10 py-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Digital Footprint</th>
                <th className="px-10 py-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Clearance</th>
                <th className="px-10 py-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Onboarding</th>
                <th className="px-10 py-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] text-right">Registry Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {filteredUsers?.length > 0 ? filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-serif font-black text-lg overflow-hidden shrink-0 group-hover:rotate-6 transition-transform shadow-premium">
                        {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : (user.name ? user.name.charAt(0) : '?')}
                      </div>
                      <div>
                        <p className="font-black text-slate-950 uppercase text-[13px] tracking-tight leading-none mb-1">{user.name || 'Anonymous'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{user._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700 flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-2.5 text-primary-500" /> {user.email}
                      </p>
                      {user.mobile && (
                        <p className="text-[10px] font-black text-slate-400 flex items-center uppercase tracking-tighter italic opacity-60">
                           TEL: {user.mobile}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] border shadow-sm ${
                      user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' :
                      user.role === 'guide' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-2">
                       <Clock className="w-3.5 h-3.5 text-slate-300" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'UNKNOWN'}
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => handleToggleRole(user._id, user.role)}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${user.role === 'admin' ? 'text-red-500 bg-red-50 hover:bg-red-100 shadow-red-500/10' : 'text-slate-400 bg-surface-50 hover:text-primary-500 hover:bg-white shadow-soft'}`}
                        title={user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="w-11 h-11 rounded-2xl text-slate-400 bg-surface-50 hover:text-red-500 hover:bg-red-50 transition-all shadow-soft"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="5" className="py-24 text-center">
                     <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Users className="w-10 h-10" />
                     </div>
                     <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] italic">Registry is empty for current criteria</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Improved Add Admin Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[4rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="bg-slate-900 p-12 text-white relative">
                 <div className="w-16 h-16 bg-primary-500 rounded-[1.5rem] flex items-center justify-center text-slate-950 mb-8 rotate-3 shadow-2xl shadow-primary-500/20">
                    <Shield className="w-8 h-8" />
                 </div>
                 <h3 className="text-4xl font-black tracking-tighter uppercase italic font-serif leading-none">Security Elevation</h3>
                 <p className="text-slate-400 text-[10px] font-black mt-4 uppercase tracking-[0.3em] opacity-60">Provisioning New System Overseer</p>
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-12 right-12 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <form onSubmit={handleAddAdmin} className="p-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Overseer Name</label>
                    <input 
                      type="text" required
                      placeholder="Enter legal name"
                      className="w-full px-8 py-5 bg-surface-50 border-none rounded-[1.8rem] focus:ring-4 focus:ring-primary-500/10 outline-none font-bold text-sm leading-none transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Digital Address</label>
                    <input 
                      type="email" required
                      placeholder="admin@guidego.com"
                      className="w-full px-8 py-5 bg-surface-50 border-none rounded-[1.8rem] focus:ring-4 focus:ring-primary-500/10 outline-none font-bold text-sm leading-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Access Key</label>
                    <input 
                      type="password" required
                      placeholder="••••••••"
                      className="w-full px-8 py-5 bg-surface-50 border-none rounded-[1.8rem] focus:ring-4 focus:ring-primary-500/10 outline-none font-bold text-sm leading-none transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Comms Line</label>
                    <input 
                      type="text" required
                      placeholder="+91 XXXX XXXX"
                      className="w-full px-8 py-5 bg-surface-50 border-none rounded-[1.8rem] focus:ring-4 focus:ring-primary-500/10 outline-none font-bold text-sm leading-none transition-all"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-6">
                   <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-6 bg-primary-500 text-slate-950 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-primary-500/30 hover:bg-primary-400 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center group"
                   >
                    {submitting ? 'VALIDATING...' : (
                      <>
                        <ShieldAlert className="w-5 h-5 mr-3 group-hover:animate-bounce" /> FINALIZE PROVISIONING
                      </>
                    )}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
