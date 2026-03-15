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
    { title: 'Explorers', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
    { title: 'Local Guides', icon: <UserCheck className="w-5 h-5" />, path: '/admin/guides' },
    { title: 'Heritage', icon: <MapPin className="w-5 h-5" />, path: '/admin/places' },
    { title: 'Journeys', icon: <BookOpen className="w-5 h-5" />, path: '/admin/bookings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-50 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 300 : 100 }}
        className="bg-slate-950 border-r border-slate-900 flex-shrink-0 relative z-50 flex flex-col transition-all duration-500 ease-[0.22,1,0.36,1]"
      >
        {/* Brand Logo */}
        <div className="h-24 flex items-center px-8 mb-10 mt-6 overflow-hidden">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-[1.5rem] flex items-center justify-center text-slate-900 shrink-0 shadow-2xl shadow-primary-500/30 rotate-3">
             <MapPin className="w-7 h-7" />
          </div>
          <AnimatePresence mode="wait">
             {isSidebarOpen && (
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="ml-5"
               >
                 <span className="text-2xl font-black text-white tracking-tight uppercase italic font-serif leading-none block">GuideGo</span>
                 <p className="text-[9px] font-black text-primary-500 tracking-[0.4em] uppercase opacity-80 mt-1">Premium Admin</p>
               </motion.div>
             )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.title}
                to={item.path}
                className={`group flex items-center h-14 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'bg-primary-500 text-slate-950 shadow-xl shadow-primary-500/20 px-6' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5 px-6'
                }`}
              >
                <div className="flex items-center z-10">
                   <div className={`w-5 h-5 flex items-center justify-center shrink-0 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                   </div>
                   {isSidebarOpen && (
                     <span className="ml-5 text-[11px] font-black uppercase tracking-[0.2em]">{item.title}</span>
                   )}
                </div>
                
                {isActive && (
                  <motion.div 
                     layoutId="sidebarActiveGlow"
                     className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-6 space-y-3 border-t border-white/5">
           <button className={`flex items-center w-full h-14 rounded-2xl text-slate-600 hover:text-white transition-all ${!isSidebarOpen ? 'justify-center' : 'px-6'}`}>
              <Settings className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="ml-5 text-[10px] font-black uppercase tracking-[0.2em]">Settings</span>}
           </button>
           
           <button 
             onClick={handleLogout}
             className={`flex items-center w-full h-14 rounded-2xl text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all ${!isSidebarOpen ? 'justify-center' : 'px-6'}`}
           >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="ml-5 text-[10px] font-black uppercase tracking-[0.2em]">Exit Hub</span>}
           </button>
        </div>

        {/* Sidebar Toggle */}
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute -right-5 top-28 w-10 h-10 bg-slate-900 border-4 border-surface-50 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all z-50 group hover:bg-primary-500 hover:text-slate-950"
        >
           <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-surface-50 relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/[0.03] rounded-full blur-[150px] -mr-96 -mt-96 pointer-events-none" />
        
        {/* Header */}
        <header className="h-24 bg-white/40 backdrop-blur-xl border-b border-surface-100 flex items-center justify-between px-10 sticky top-0 z-40">
           <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center space-x-3 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                 <span className="hover:text-primary-500 cursor-pointer transition-colors">Odisha Base</span>
                 <ChevronRight className="w-3 h-3 text-slate-200" />
                 <span className="text-slate-900">
                    {menuItems.find(item => item.path === location.pathname)?.title || 'Overview'}
                 </span>
              </div>
           </div>

           <div className="flex items-center space-x-8">
              {/* Search Bar */}
              <div className="hidden md:flex relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search logs & entities..."
                   className="bg-surface-50 border border-surface-100 rounded-[1.2rem] pl-12 pr-6 py-3 text-[11px] font-bold w-72 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500/30 transition-all outline-none"
                 />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 border-r border-surface-100 pr-8">
                 <button className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-slate-400 hover:bg-white hover:text-primary-500 transition-all shadow-soft border border-transparent hover:border-surface-100 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
                 </button>
                 <button className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all shadow-soft border border-transparent hover:border-surface-100">
                    <HelpCircle className="w-5 h-5" />
                 </button>
              </div>

              {/* Profile */}
              <div className="flex items-center space-x-4">
                 <div className="text-right hidden sm:block">
                    <p className="text-[11px] font-black text-slate-950 uppercase leading-none tracking-tight">{user?.name}</p>
                    <p className="text-[9px] font-bold text-primary-500 uppercase mt-1 tracking-[0.2em] opacity-80 italic font-serif">System Architect</p>
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-serif font-black text-sm shadow-premium rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                    {user?.name?.charAt(0)}
                 </div>
              </div>
           </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative z-10">
           <div className="max-w-[1600px] mx-auto">
              <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
