import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Shield, 
  Trash2, 
  Mail, 
  MapPin,
  Search,
  Filter
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
      setUsers(data.data);
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
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'tourist' : 'admin';
    try {
      await axios.put(`/api/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      alert('Error updating user role');
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
      alert(error.response?.data?.message || 'Error creating admin');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-primary-500 outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="guide">Guides</option>
            <option value="tourist">Tourists</option>
          </select>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-transform"
          >
            Add Admin
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-black text-lg overflow-hidden flex-shrink-0">
                        {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : (user.name ? user.name.charAt(0) : '?')}
                      </div>
                      <p className="font-black text-slate-900 uppercase text-sm tracking-tight truncate max-w-[150px]">{user.name || 'Unknown User'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-600 flex items-center">
                        <Mail className="w-3 h-3 mr-2 text-primary-500" /> {user.email}
                      </p>
                      {user.mobile && (
                        <p className="text-[10px] font-medium text-slate-400 flex items-center">
                           Verified Mob: {user.mobile}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                      user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' :
                      user.role === 'guide' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleToggleRole(user._id, user.role)}
                        className={`p-2 rounded-lg transition-colors ${user.role === 'admin' ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-primary-500 hover:bg-slate-100'}`}
                        title={user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="5" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                     No users found matching your criteria.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-8 text-white relative">
               <h3 className="text-2xl font-black tracking-tighter uppercase">Add Administrator</h3>
               <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Create a secondary admin account</p>
               <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">
                  <Trash2 className="w-5 h-5 rotate-45" />
               </button>
            </div>
            
            <form onSubmit={handleAddAdmin} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="rahul@guidego.com"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold text-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile</label>
                  <input 
                    type="text" 
                    required
                    placeholder="9988776655"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold text-sm"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-primary-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary-500/30 hover:bg-primary-400 transition-all disabled:opacity-50 active:scale-95"
              >
                {submitting ? 'Creating...' : 'Finalize Admin Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
