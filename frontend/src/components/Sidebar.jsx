import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Map, Compass, Headphones, Sparkles, 
  Calendar, Hotel, Utensils, User, Settings,
  LayoutDashboard, Bell, MessageSquare, BarChart3,
  LogOut, X, Menu, ShieldCheck, MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/GuideGo Logo.jpeg';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = {
    user: [
      { path: '/', label: 'Home', icon: Home },
      { path: '/user/explore-map', label: 'Explore Map', icon: MapPin },
      { path: '/guides', label: 'Guides', icon: Compass },
      { path: '/user/explore', label: 'Audio Guide', icon: Headphones },
      { path: '/user/ai-chat', label: 'AI Assistant', icon: Sparkles },
      { path: '/user/bookings', label: 'My Bookings', icon: Calendar },
      { path: '/hotels', label: 'Hotels', icon: Hotel },
      { path: '/restaurants', label: 'Restaurants', icon: Utensils },
      { path: '/user/profile', label: 'Profile', icon: User },
      { path: '/user/settings', label: 'Settings', icon: Settings },
    ],
    guide: [
      { path: '/guide', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/guide/requests', label: 'Booking Requests', icon: Bell },
      { path: '/guide/bookings', label: 'My Bookings', icon: Calendar },
      { path: '/guide/chat', label: 'Chat', icon: MessageSquare },
      { path: '/guide/ai-chat', label: 'AI Assistant', icon: Sparkles },
      { path: '/guide/profile', label: 'Profile', icon: User },
      { path: '/guide/earnings', label: 'Earnings', icon: BarChart3 },
      { path: '/guide/settings', label: 'Settings', icon: Settings },
    ],
    admin: [
      { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/users', label: 'User Management', icon: User },
      { path: '/admin/guides', label: 'Guide Approvals', icon: ShieldCheck },
      { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
      { path: '/admin/places', label: 'Places', icon: Map },
      { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
      { path: '/admin/settings', label: 'Settings', icon: Settings },
    ]
  };

  const currentMenu = menuItems[user?.role] || menuItems.user;

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[1001] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={window.innerWidth >= 1024 ? "open" : "closed"}
        animate={isOpen || window.innerWidth >= 1024 ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-[1002] flex flex-col shadow-2xl lg:shadow-none"
      >
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="GuideGo" className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary-500/20" />
            <span className="text-xl font-black italic tracking-tighter text-slate-900 dark:text-white">GuideGo</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink 
                key={item.path} 
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={`flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-500'}`} />
                <span className={`text-sm font-black uppercase tracking-widest ${isActive ? 'italic' : ''}`}>{item.label}</span>
                {isActive && (
                  <motion.div layoutId="activePill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-glow" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Section / Bottom Actions */}
        <div className="p-6 mt-auto border-t border-slate-50 dark:border-slate-800">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-2">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center font-black text-white text-lg italic shadow-premium">
                  {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover rounded-xl" /> : user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none mb-1">
                    {user.role === 'user' ? 'Tourist' : user.role.toUpperCase()}
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <NavLink 
              to="/login"
              className="w-full flex items-center justify-center space-x-3 p-4 rounded-2xl bg-primary-500 text-white font-black text-xs uppercase tracking-widest shadow-premium"
            >
              <User className="w-4 h-4" />
              <span>Login / Register</span>
            </NavLink>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
