import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Map, Compass, BookOpen, MessageSquare, LogOut, User, ShieldCheck, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center space-x-2">
              <Compass className="w-8 h-8" />
              <span>GuideGo</span>
            </Link>
          </div>
          <div className="hidden md:ml-6 md:flex md:space-x-8">
            {/* Dashboard Link based on role */}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-secondary-600 hover:text-secondary-700 px-3 py-2 text-sm font-black flex items-center space-x-1 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> <span>Admin Hub</span>
              </Link>
            )}
            {user?.role === 'guide' && (
              <Link to="/guide-dashboard" className="text-primary-600 hover:text-primary-700 px-3 py-2 text-sm font-black flex items-center space-x-1 uppercase tracking-widest">
                <LayoutDashboard className="w-4 h-4" /> <span>Guide Hub</span>
              </Link>
            )}

            {/* Tourist Links */}
            {(!user || user.role === 'tourist') && (
              <>
                <Link to="/explore-map" className="text-slate-700 hover:text-primary-600 px-3 py-2 text-sm font-medium flex items-center space-x-1">
                  <Compass className="w-4 h-4" /> <span>Explore Map</span>
                </Link>
                <Link to="/guides" className="text-slate-700 hover:text-primary-600 px-3 py-2 text-sm font-medium flex items-center space-x-1">
                  <Map className="w-4 h-4" /> <span>Guides</span>
                </Link>
                {user && (
                  <Link to="/bookings" className="text-slate-700 hover:text-primary-600 px-3 py-2 text-sm font-medium flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" /> <span>My Bookings</span>
                  </Link>
                )}
                <Link to="/ai-chat" className="text-slate-700 hover:text-primary-600 px-3 py-2 text-sm font-medium flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" /> <span>AI Assistant</span>
                </Link>
              </>
            )}

            {/* Guide Links */}
            {user?.role === 'guide' && (
              <Link to="/bookings" className="text-slate-700 hover:text-primary-600 px-3 py-2 text-sm font-medium flex items-center space-x-1">
                <BookOpen className="w-4 h-4" /> <span>Bookings</span>
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/profile" className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold uppercase overflow-hidden group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-slate-700 hidden lg:block">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-700 hover:text-primary-600 text-sm font-medium">Login</Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 text-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
