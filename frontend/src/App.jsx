import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { io } from 'socket.io-client';

// Components
import Sidebar from './components/Sidebar';
import BottomNavigation from './components/BottomNavigation';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationToast from './components/NotificationToast';
import { Menu } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import VerifyResetOTP from './pages/VerifyResetOTP';
import ResetPassword from './pages/ResetPassword';
import GuideDashboard from './pages/GuideDashboard';
import Explore from './pages/Explore';
import ExploreMap from './pages/ExploreMap';
import Guides from './pages/Guides';
import AIChat from './pages/AIChat';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import GuideProfile from './pages/GuideProfile';

import Chat from './pages/Chat';
import Hotels from './pages/Hotels';
import Restaurants from './pages/Restaurants';
import Emergency from './pages/Emergency';
import Support from './pages/Support';
// Admin
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminGuides from './pages/admin/AdminGuides';
import AdminPlaces from './pages/admin/AdminPlaces';
import AdminBookings from './pages/admin/AdminBookings';

function AppContent() {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const socketRef = useRef();
  const location = useLocation();

  useEffect(() => {
    // ... socket logic remains same ...
    if (user) {
      const socketUrl = axios.defaults.baseURL;
      socketRef.current = io(socketUrl);
      
      socketRef.current.on('connect', () => {
        socketRef.current.emit('join', { userId: user._id });
      });

      socketRef.current.on('notification', (data) => {
        setNotification(data);
      });

      return () => {
        if (socketRef.current) socketRef.current.disconnect();
      };
    }
  }, [user]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex-grow flex flex-col min-w-0 lg:ml-[280px]">
          {/* Mobile Header (Floating) */}
          <div className="lg:hidden fixed top-6 left-6 z-[1000]">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-premium dark:shadow-none border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white"
             >
                <Menu className="w-6 h-6" />
             </button>
          </div>

          <main className="flex-grow pb-32 lg:pb-12 px-4 md:px-8">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                <Route path="/verify-otp" element={<PageWrapper><VerifyOTP /></PageWrapper>} />
                <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
                <Route path="/verify-reset-otp" element={<PageWrapper><VerifyResetOTP /></PageWrapper>} />
                <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
                
                <Route path="/guides" element={<PageWrapper><Guides /></PageWrapper>} />
                <Route path="/guides/:id" element={<PageWrapper><GuideProfile /></PageWrapper>} />
                <Route path="/hotels" element={<PageWrapper><Hotels /></PageWrapper>} />
                <Route path="/restaurants" element={<PageWrapper><Restaurants /></PageWrapper>} />
                <Route path="/emergency" element={<PageWrapper><Emergency /></PageWrapper>} />
                <Route path="/support" element={<PageWrapper><Support /></PageWrapper>} />

                {/* User Routes */}
                <Route path="/user" element={<ProtectedRoute role="user"><PageWrapper><Home /></PageWrapper></ProtectedRoute>} />
                <Route path="/user/explore" element={<ProtectedRoute role="user"><PageWrapper><Explore /></PageWrapper></ProtectedRoute>} />
                <Route path="/user/explore-map" element={<ProtectedRoute role="user"><PageWrapper><ExploreMap /></PageWrapper></ProtectedRoute>} />
                <Route path="/user/bookings" element={<ProtectedRoute role="user"><PageWrapper><Bookings /></PageWrapper></ProtectedRoute>} />
                <Route path="/user/chat/:id" element={<ProtectedRoute role="user"><PageWrapper><Chat /></PageWrapper></ProtectedRoute>} />
                <Route path="/user/profile" element={<ProtectedRoute role="user"><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
                <Route path="/user/settings" element={<ProtectedRoute role="user"><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />
                <Route path="/user/ai-chat" element={<ProtectedRoute role="user"><PageWrapper><AIChat /></PageWrapper></ProtectedRoute>} />

                {/* Guide Routes */}
                <Route path="/guide" element={<ProtectedRoute role="guide"><PageWrapper><GuideDashboard /></PageWrapper></ProtectedRoute>} />
                <Route path="/guide/bookings" element={<ProtectedRoute role="guide"><PageWrapper><Bookings /></PageWrapper></ProtectedRoute>} />
                <Route path="/guide/chat/:id" element={<ProtectedRoute role="guide"><PageWrapper><Chat /></PageWrapper></ProtectedRoute>} />
                <Route path="/guide/profile" element={<ProtectedRoute role="guide"><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
                <Route path="/guide/ai-chat" element={<ProtectedRoute role="guide"><PageWrapper><AIChat /></PageWrapper></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                  <Route path="users" element={<PageWrapper><AdminUsers /></PageWrapper>} />
                  <Route path="guides" element={<PageWrapper><AdminGuides /></PageWrapper>} />
                  <Route path="places" element={<PageWrapper><AdminPlaces /></PageWrapper>} />
                  <Route path="bookings" element={<PageWrapper><AdminBookings /></PageWrapper>} />
                  <Route path="settings" element={<PageWrapper><Settings /></PageWrapper>} />
                </Route>

                <Route path="/explore" element={<Navigate to="/user/explore" replace />} />
                <Route path="/explore-map" element={<Navigate to="/user/explore-map" replace />} />
                <Route path="/bookings" element={<RoleRedirect path="bookings" />} />
                <Route path="/profile" element={<RoleRedirect path="profile" />} />
                <Route path="/settings" element={<RoleRedirect path="settings" />} />
                <Route path="/ai-chat" element={<RoleRedirect path="ai-chat" />} />
                <Route path="/chat/:id" element={<RoleRedirect path="chat" />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </main>
          <BottomNavigation />
        </div>
      </div>

      {notification && (
        <NotificationToast 
          notification={notification} 
          onClose={() => setNotification(null)} 
        />
      )}
    </>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const RoleRedirect = ({ path }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  
  const rolePath = user.role === 'admin' ? '/admin' : user.role === 'guide' ? '/guide' : '/user';
  
  // Special handling for chat since it has an ID
  if (path === 'chat') {
    return <Navigate to={`${rolePath}/chat`} replace />;
  }
  
  return <Navigate to={`${rolePath}/${path}`} replace />;
};

import { ThemeProvider } from './context/ThemeContext.jsx';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
