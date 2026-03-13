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

  useEffect(() => {
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
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
           <button className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 hover:text-primary-500">
             <Filter className="w-5 h-5" />
           </button>
           <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20">
             Add Admin
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
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
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-black text-lg overflow-hidden">
                        {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                      </div>
                      <p className="font-black text-slate-900 uppercase text-sm tracking-tight">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-600 flex items-center">
                        <Mail className="w-3 h-3 mr-2" /> {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-[10px] font-medium text-slate-400 flex items-center">
                          <Shield className="w-2.5 h-2.5 mr-2" /> Verified: {user.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                      user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' :
                      user.role === 'guide' ? 'bg-secondary-50 text-secondary-600 border-secondary-100' :
                      'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-500 leading-none">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
