import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, UserCheck, MapPin, 
  BookOpen, LogOut, Menu, X, Bell, Search,
  ChevronRight, Settings, HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin' },
    { title: 'User Management', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
    { title: 'Guide Management', icon: <UserCheck className="w-5 h-5" />, path: '/admin/guides' },
    { title: 'Bookings', icon: <BookOpen className="w-5 h-5" />, path: '/admin/bookings' },
    { title: 'Reports', icon: <HelpCircle className="w-5 h-5" />, path: '/admin' }, // Mapping to dashboard for now
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-50 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="bg-slate-900 border-r border-slate-800 flex-shrink-0 relative z-50 flex flex-col transition-all duration-300 ease-in-out"
      >
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-6 mb-8 mt-4">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-slate-900 shrink-0 shadow-lg shadow-primary-500/20">
             <MapPin className="w-6 h-6" />
          </div>
          <AnimatePresence mode="wait">
             {isSidebarOpen && (
               <motion.div
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -10 }}
                 className="ml-4 overflow-hidden whitespace-nowrap"
               >
                 <span className="text-xl font-black text-white tracking-tighter uppercase italic font-serif">GuideGo</span>
                 <p className="text-[10px] font-black text-primary-500 tracking-[0.3em] uppercase opacity-80">Admin Hub</p>
               </motion.div>
             )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`group flex items-center h-12 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                location.pathname === item.path 
                  ? 'bg-primary-500 text-slate-900 shadow-xl shadow-primary-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center px-4 z-10">
                 <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {item.icon}
                 </div>
                 {isSidebarOpen && (
                   <span className="ml-4 text-sm font-black uppercase tracking-widest">{item.title}</span>
                 )}
              </div>
              
              {/* Active Indicator Glow */}
              {location.pathname === item.path && (
                <motion.div 
                   layoutId="activeGlow"
                   className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-none"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 space-y-2 border-t border-slate-800/50">
           <button className={`flex items-center w-full h-12 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all ${!isSidebarOpen && 'justify-center'}`}>
              <Settings className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="ml-4 text-sm font-black uppercase tracking-widest">Settings</span>}
           </button>
           
           <button 
             onClick={handleLogout}
             className={`flex items-center w-full h-12 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${!isSidebarOpen && 'justify-center'}`}
           >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="ml-4 text-sm font-black uppercase tracking-widest">Logout</span>}
           </button>
        </div>

        {/* Sidebar Toggle */}
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-24 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-transform shadow-primary-500/40 z-50 group"
        >
           {isSidebarOpen ? <ChevronRight className="w-4 h-4 rotate-180 transition-transform" /> : <ChevronRight className="w-4 h-4 transition-transform" />}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-surface-50">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span>System</span>
                 <ChevronRight className="w-3 h-3" />
                 <span className="text-secondary-500">
                    {menuItems.find(item => item.path === location.pathname)?.title || 'Overview'}
                 </span>
              </div>
           </div>

           <div className="flex items-center space-x-6">
              {/* Search Bar */}
              <div className="hidden md:flex relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search activities..."
                   className="bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-xs font-bold w-64 focus:ring-2 focus:ring-primary-500/20 transition-all"
                 />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-secondary-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-slate-900 leading-none uppercase">{user?.name}</p>
                    <p className="text-[10px] font-bold text-primary-600 uppercase mt-0.5 tracking-tighter">Chief Admin</p>
                 </div>
                 <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-slate-900 font-black text-sm shadow-premium">
                    {user?.name?.charAt(0)}
                 </div>
              </div>
           </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
           <div className="max-w-[1600px] mx-auto">
              <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
