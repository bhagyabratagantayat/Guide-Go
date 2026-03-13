import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  MapPin, 
  BookOpen, 
  LogOut, 
  Menu, 
  X,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin' },
    { title: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
    { title: 'Guides', icon: <UserCheck className="w-5 h-5" />, path: '/admin/guides' },
    { title: 'Places', icon: <MapPin className="w-5 h-5" />, path: '/admin/places' },
    { title: 'Bookings', icon: <BookOpen className="w-5 h-5" />, path: '/admin/bookings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          {isSidebarOpen ? (
            <span className="text-xl font-black tracking-tighter text-primary-400">ADMIN HUB</span>
          ) : (
             <span className="text-xl font-black text-primary-400">GH</span>
          )}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-primary-500 text-slate-900 font-bold shadow-lg shadow-primary-500/20' 
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span className="text-sm">{item.title}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 w-full px-4 border-t border-slate-800 pt-8">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-4 px-4 py-3 text-slate-400 hover:text-red-400 w-full rounded-xl hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-bold uppercase tracking-widest">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-10">
          <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">
            {menuItems.find(item => item.path === location.pathname)?.title || 'Overview'}
          </h2>
          
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-400 hover:text-primary-500">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 pl-6 border-l">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 uppercase leading-none">{user?.name}</p>
                <p className="text-[10px] font-bold text-primary-600 uppercase">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-600 shadow-inner">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
