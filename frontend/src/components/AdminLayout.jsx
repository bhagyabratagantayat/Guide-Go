import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { 
  ChevronRight, Bell, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  // 🛡️ SECURITY HARDENING: Block Inspect and Right Click
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const menuItems = [
    { title: 'Dashboard', path: '/admin' },
    { title: 'KYC Verification', path: '/admin/kyc' },
    { title: 'User Management', path: '/admin/users' },
    { title: 'Guide Management', path: '/admin/guides' },
    { title: 'Bookings', path: '/admin/bookings' },
    { title: 'Places', path: '/admin/places' },
  ];

  const currentTitle = menuItems.find(item => item.path === location.pathname)?.title || 'Overview';

  return (
    <div className="flex flex-col min-h-full">
      {/* Admin Specific Header */}
      <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 rounded-3xl mt-4 mx-4 shadow-sm">
         <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <span>System</span>
               <ChevronRight className="w-3 h-3" />
               <span className="text-primary-500">
                  {currentTitle}
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
                 className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 text-xs font-bold w-64 focus:ring-2 focus:ring-primary-500/20 transition-all text-slate-900 dark:text-white"
               />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            </button>

            {/* Profile Summary */}
            <div className="flex items-center space-x-3 pl-6 border-l border-slate-200 dark:border-slate-800">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 dark:text-white leading-none uppercase">{user?.name}</p>
                  <p className="text-[10px] font-black text-primary-500 uppercase mt-0.5 tracking-widest leading-none">Admin</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-black text-sm shadow-premium italic">
                  {user?.name?.charAt(0)}
               </div>
            </div>
         </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8">
         <div className="max-w-[1600px] mx-auto">
            <Outlet />
         </div>
      </div>
    </div>
  );
};

export default AdminLayout;
