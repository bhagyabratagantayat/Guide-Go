import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Compass, Headphones, Sparkles, 
  Calendar, Hotel, Building2, Utensils, Cloud, 
  Map, Star, User, Bell, ShieldCheck, Settings, 
  LogOut, MessageCircle, DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import logo from '../assets/GuideGo Logo.jpeg';

import { X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path));

  const touristLinks = [
    { section: 'MAIN', items: [
      { path: '/', label: 'Home', icon: Home },
      { path: '/book-guide', label: 'Book Guide', icon: Compass },
      { path: '/ai-chat', label: 'AI Assistant', icon: Sparkles },
    ]},
    { section: 'FEATURED', items: [
      { path: '/audio-guide', label: 'Audio Guide', icon: Headphones, isPrimary: true },
      { path: '/my-bookings', label: 'My Bookings', icon: Calendar },
    ]},
    { section: 'TRAVEL TOOLS', items: [
      { path: '/hotels', label: 'Hotels', icon: Hotel },
      { path: '/agencies', label: 'Agencies', icon: Building2 },
      { path: '/restaurants', label: 'Restaurants', icon: Utensils },
      { path: '/weather', label: 'Weather', icon: Cloud },
      { path: '/trip-planner', label: 'Trip Planner', icon: Map },
    ]},
    { section: 'ACCOUNT', items: [
      { path: '/premium', label: 'Premium', icon: Star },
      { path: '/profile', label: 'Profile', icon: User },
      { path: '/notifications', label: 'Notifications', icon: Bell },
    ]},
    { section: 'SUPPORT', items: [
      { path: '/help', label: 'Help & Safety', icon: ShieldCheck },
      { path: '/settings', label: 'Settings', icon: Settings },
    ]}
  ];

  const guideLinks = [
    { section: 'MANAGEMENT', items: (user?.kycStatus === 'approved' && user?.profileComplete) ? [
      { path: '/guide', label: 'Dashboard', icon: Home },
      { path: '/guide/bookings', label: 'Bookings', icon: Calendar },
      { path: '/guide/chat', label: 'Messages', icon: MessageCircle },
      { path: '/guide/earnings', label: 'Earnings', icon: DollarSign },
    ] : [
      { path: '/guide/verify-identity', label: 'Verify Identity', icon: ShieldCheck, isPrimary: true },
    ]},
    { section: 'TRAVEL TOOLS', items: [
      { path: '/weather', label: 'Weather', icon: Cloud },
      { path: '/hotels', label: 'Hotels', icon: Hotel },
      { path: '/restaurants', label: 'Restaurants', icon: Utensils },
    ]},
    { section: 'ACCOUNT', items: [
      { path: '/profile', label: 'Profile', icon: User },
      { path: '/settings', label: 'Settings', icon: Settings },
      { path: '/help', label: 'Support', icon: ShieldCheck },
    ]}
  ];

  const adminLinks = [
    { section: 'ADMIN CONTROL', items: [
      { path: '/admin', label: 'Dashboard', icon: Home },
      { path: '/admin/users', label: 'Manage Users', icon: User },
      { path: '/admin/guides', label: 'Manage Guides', icon: Compass },
      { path: '/admin/kyc', label: 'KYC Dossiers', icon: ShieldCheck },
      { path: '/admin/bookings', label: 'All Bookings', icon: Calendar },
      { path: '/admin/audio-guides', label: 'Manage Audio Guides', icon: Headphones },
    ]},
    { section: 'ACCOUNT', items: [
      { path: '/profile', label: 'Admin Profile', icon: User },
      { path: '/settings', label: 'System Settings', icon: Settings },
    ]}
  ];

  const links = user?.role === 'admin' ? adminLinks : (user?.role === 'guide' ? guideLinks : touristLinks);

  return (
    <aside className={`fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-[#dddddd] flex flex-col z-[1000] transition-transform duration-300 transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Header */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { navigate('/'); onClose?.(); }}>
          <img src={logo} alt="GuideGo" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-xl font-bold tracking-tighter text-[#222222]">Guide Goo</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-[#6a6a6a]">
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-10 no-scrollbar">
        {links.map((group) => (
          <div key={group.section} className="space-y-4">
            <h4 className="px-2 text-[10px] font-bold text-[#6a6a6a] uppercase tracking-[0.3em]">{group.section}</h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                
                return (
                  <NavLink 
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose?.()}
                    className={`flex items-center space-x-4 px-2 py-3 rounded-lg transition-all duration-200 group relative ${
                      active 
                      ? 'text-[#ff385c]' 
                      : 'text-[#222222] hover:bg-[#f7f7f7]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-[#ff385c]' : 'text-[#222222] opacity-80'}`} />
                    <span className={`text-[15px] ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                    {active && <motion.div layoutId="active-dot" className="absolute -left-1 w-1 h-6 rounded-full bg-[#ff385c]" />}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-8 border-t border-[#f7f7f7] space-y-8">

        {/* User Card */}
        {/* User Card / Login Actions */}
        {user ? (
          <div className="flex items-center gap-3 bg-[#f7f7f7] p-4 rounded-2xl border border-[#eeeeee]">
            <div className="w-10 h-10 rounded-full bg-white border border-[#dddddd] flex items-center justify-center text-[#ff385c] font-bold text-sm overflow-hidden shrink-0">
              {user?.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-[#222222] truncate">{user?.name || 'Guest'}</span>
              <span className="text-[9px] text-[#6a6a6a] font-bold uppercase tracking-widest truncate">{user?.role || 'User'}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-[#6a6a6a] hover:text-[#ff385c] transition-all shrink-0"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-4 bg-[#ff385c] text-white rounded-xl text-[12px] font-black uppercase tracking-widest shadow-lg shadow-[#ff385c]/20 hover:bg-[#e31c5f] transition-all active:scale-95"
            >
              Join Now
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-4 bg-white border border-[#dddddd] text-[#222222] rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#f7f7f7] transition-all"
            >
              Login Access
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
