import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Compass, Headphones, Sparkles, 
  Calendar, Hotel, Building2, Utensils, Cloud, 
  Map, Star, User, Bell, ShieldCheck, Settings, 
  LogOut, MessageCircle, DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { motion } from 'framer-motion';
import logo from '../assets/GuideGo Logo.jpeg';

import { X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path));

  const touristLinks = [
    { section: 'MAIN', items: [
      { path: '/', label: 'Home', icon: Home },
      { path: '/guides', label: 'Browse Guides', icon: Compass },
    ]},
    { section: 'FEATURED', items: [
      { path: '/audio-guide', label: 'Audio Guide', icon: Headphones, isPrimary: true },
    ]},
    { section: 'SERVICES', items: [
      { path: '/ai-chat', label: 'AI Assistant', icon: Sparkles },
      { path: '/my-bookings', label: 'My Bookings', icon: Calendar },
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
    { section: 'MANAGEMENT', items: [
      { path: '/guide', label: 'Dashboard', icon: Home },
      { path: '/guide/bookings', label: 'Bookings', icon: Calendar },
      { path: '/guide/chat', label: 'Messages', icon: MessageCircle },
      { path: '/guide/earnings', label: 'Earnings', icon: DollarSign },
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
    ]},
    { section: 'ACCOUNT', items: [
      { path: '/profile', label: 'Admin Profile', icon: User },
      { path: '/settings', label: 'System Settings', icon: Settings },
    ]}
  ];

  const links = user?.role === 'admin' ? adminLinks : (user?.role === 'guide' ? guideLinks : touristLinks);

  return (
    <aside className={`fixed left-0 top-0 h-screen w-[260px] bg-[var(--bg-sidebar)] border-r border-[var(--border)] flex flex-col z-[1000] transition-transform duration-300 transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { navigate('/'); onClose?.(); }}>
          <img src={logo} alt="GuideGo" className="w-10 h-10 rounded-xl object-cover" />
          <span className="text-xl font-bold tracking-tighter text-[var(--text-primary)]">GuideGo</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-[var(--text-secondary)]">
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-8 no-scrollbar">
        {links.map((group) => (
          <div key={group.section} className="space-y-1">
            <h4 className="px-4 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2">{group.section}</h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                
                return (
                  <NavLink 
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose?.()}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                      active 
                      ? 'bg-blue-500/10 text-[var(--accent)] border-l-4 border-[var(--accent)]' 
                      : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] border-l-4 border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-[var(--accent)]' : 'text-current opacity-70 group-hover:opacity-100 transition-opacity'}`} />
                    <span className={`text-[13px] tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                    {active && <motion.div layoutId="active-pill" className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-[var(--border)] bg-black/20 space-y-6">
        {/* Currency Toggle */}
        <div className="flex bg-black/40 rounded-xl p-1 border border-[var(--border)] shadow-inner">
          {['INR', 'USD'].map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                currency === curr 
                ? 'bg-[var(--bg-card)] text-[var(--accent)] shadow-lg' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] font-bold text-lg overflow-hidden shadow-soft">
              {user?.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[var(--text-primary)] leading-none mb-1">{user?.name || 'Guest'}</span>
              <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{user?.role || 'Explorer'}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
