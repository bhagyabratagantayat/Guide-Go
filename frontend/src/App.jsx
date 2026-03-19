import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { io } from 'socket.io-client';

// Components
import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationToast from './components/NotificationToast';

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
  const socketRef = useRef();
  const location = useLocation();

  useEffect(() => {
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

      <div className="flex flex-col min-h-screen bg-surface-50">
        <Navbar />
        <main className="flex-grow pt-24 pb-24 md:pb-0">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Landing/Home */}
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              
              {/* Auth */}
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
              <Route path="/verify-otp" element={<PageWrapper><VerifyOTP /></PageWrapper>} />
              <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
              <Route path="/verify-reset-otp" element={<PageWrapper><VerifyResetOTP /></PageWrapper>} />
              <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />

              {/* Core Features */}
              <Route path="/explore" element={<PageWrapper><Explore /></PageWrapper>} />
              <Route path="/explore-map" element={<PageWrapper><ExploreMap /></PageWrapper>} />
              <Route path="/guides" element={<PageWrapper><Guides /></PageWrapper>} />
              <Route path="/guides/:id" element={<PageWrapper><GuideProfile /></PageWrapper>} />
              <Route path="/guide/:id" element={<PageWrapper><GuideProfile /></PageWrapper>} />
              <Route path="/ai-chat" element={<PageWrapper><AIChat /></PageWrapper>} />
              <Route path="/bookings" element={<PageWrapper><Bookings /></PageWrapper>} />
              <Route path="/chat/:id" element={<ProtectedRoute><PageWrapper><Chat /></PageWrapper></ProtectedRoute>} />
              <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />

              {/* Protected Roles */}
              <Route path="/guide-dashboard" element={<ProtectedRoute role="guide"><PageWrapper><GuideDashboard /></PageWrapper></ProtectedRoute>} />
              
              {/* Admin Layout */}
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="users" element={<PageWrapper><AdminUsers /></PageWrapper>} />
                <Route path="guides" element={<PageWrapper><AdminGuides /></PageWrapper>} />
                <Route path="places" element={<PageWrapper><AdminPlaces /></PageWrapper>} />
                <Route path="bookings" element={<PageWrapper><AdminBookings /></PageWrapper>} />
              </Route>
            </Routes>
          </AnimatePresence>
        </main>
        <BottomNavigation />
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
