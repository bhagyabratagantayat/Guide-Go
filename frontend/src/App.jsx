import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { io } from 'socket.io-client';

// Components
import Sidebar from './components/Sidebar';
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
import Guides from './pages/Guides';
import AIChat from './pages/AIChat';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import GuideProfile from './pages/GuideProfile';
import NotificationsPage from './pages/NotificationsPage';

// Newly Created Pages
import AudioGuidePage from './pages/AudioGuidePage';
import HotelsPage from './pages/HotelsPage';
import RestaurantsPage from './pages/RestaurantsPage';
import PremiumPage from './pages/PremiumPage';
import HelpPage from './pages/HelpPage';

import Chat from './pages/Chat';
import Weather from './pages/Weather';
import TripPlanner from './pages/TripPlanner';
import Agencies from './pages/Agencies';
import AgencyDetail from './pages/AgencyDetail';

// Admin
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';
import AdminGuides from './pages/admin/AdminGuides';
import AdminPlaces from './pages/admin/AdminPlaces';
import AdminBookings from './pages/admin/AdminBookings';
import AdminKycPage from './pages/AdminKycPage';

// Guide Pages
import Earnings from './pages/guide/Earnings';
import ChatList from './pages/guide/ChatList';
import GuideVerifyPage from './pages/GuideVerifyPage';
import GuideSetupPage from './pages/GuideSetupPage';
import GuideGuard from './components/GuideGuard';

import { ThemeProvider } from './context/ThemeContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';

function AppContent() {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const socketRef = useRef();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const socketUrl = axios.defaults.baseURL || 'http://localhost:5000';
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

      <div className="flex min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
        {/* Sidebar - Fixed Left */}
        <Sidebar className="w-[260px] flex-shrink-0" />
        
        {/* Main Content Area */}
        <main className="flex-1 ml-[260px] min-h-screen overflow-y-auto">
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
              
              {/* Core Feature Routes */}
              <Route path="/guides" element={<PageWrapper><Guides /></PageWrapper>} />
              <Route path="/guides/:id" element={<PageWrapper><GuideProfile /></PageWrapper>} />
              
              {/* Protected Sidebar Routes */}
              <Route path="/audio-guide" element={<ProtectedRoute><PageWrapper><AudioGuidePage /></PageWrapper></ProtectedRoute>} />
              <Route path="/ai-chat" element={<ProtectedRoute><PageWrapper><AIChat /></PageWrapper></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><PageWrapper><Bookings /></PageWrapper></ProtectedRoute>} />
              <Route path="/hotels" element={<ProtectedRoute><PageWrapper><HotelsPage /></PageWrapper></ProtectedRoute>} />
              <Route path="/agencies" element={<ProtectedRoute><PageWrapper><Agencies /></PageWrapper></ProtectedRoute>} />
              <Route path="/restaurants" element={<ProtectedRoute><PageWrapper><RestaurantsPage /></PageWrapper></ProtectedRoute>} />
              <Route path="/weather" element={<ProtectedRoute><PageWrapper><Weather /></PageWrapper></ProtectedRoute>} />
              <Route path="/trip-planner" element={<ProtectedRoute><PageWrapper><TripPlanner /></PageWrapper></ProtectedRoute>} />
              
              <Route path="/premium" element={<ProtectedRoute><PageWrapper><PremiumPage /></PageWrapper></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><PageWrapper><NotificationsPage /></PageWrapper></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><PageWrapper><HelpPage /></PageWrapper></ProtectedRoute>} />

              {/* Guide Flow */}
              <Route path="/guide/verify" element={<ProtectedRoute role="guide"><PageWrapper><GuideVerifyPage /></PageWrapper></ProtectedRoute>} />
              <Route path="/guide/setup" element={<ProtectedRoute role="guide"><PageWrapper><GuideSetupPage /></PageWrapper></ProtectedRoute>} />
              <Route path="/guide" element={<ProtectedRoute role="guide"><GuideGuard><PageWrapper><GuideDashboard /></PageWrapper></GuideGuard></ProtectedRoute>} />
              <Route path="/guide/bookings" element={<ProtectedRoute role="guide"><GuideGuard><PageWrapper><Bookings /></PageWrapper></GuideGuard></ProtectedRoute>} />
              <Route path="/guide/chat" element={<ProtectedRoute role="guide"><GuideGuard><PageWrapper><ChatList /></PageWrapper></GuideGuard></ProtectedRoute>} />
              <Route path="/guide/earnings" element={<ProtectedRoute role="guide"><GuideGuard><PageWrapper><Earnings /></PageWrapper></GuideGuard></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="users" element={<PageWrapper><AdminUsers /></PageWrapper>} />
                <Route path="guides" element={<PageWrapper><AdminGuides /></PageWrapper>} />
                <Route path="places" element={<PageWrapper><AdminPlaces /></PageWrapper>} />
                <Route path="bookings" element={<PageWrapper><AdminBookings /></PageWrapper>} />
                <Route path="reports" element={<PageWrapper><AdminReports /></PageWrapper>} />
                <Route path="kyc" element={<PageWrapper><AdminKycPage /></PageWrapper>} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
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
    className="w-full h-full min-h-screen"
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
