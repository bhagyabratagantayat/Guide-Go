import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { HelmetProvider } from 'react-helmet-async';
import { BookingProvider, useBooking, TRIP_STATUS } from './context/BookingContext';

// Components
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationToast from './components/NotificationToast';
import { connectSocket, disconnectSocket } from './utils/socket';
import { Menu } from 'lucide-react';

// Pages
import Home from './pages/Home';
import AuthPage             from './pages/AuthPage';
import AuthCallbackPage     from './pages/AuthCallbackPage';
import CompleteProfilePage  from './pages/CompleteProfilePage';
import GuideDashboard       from './pages/GuideDashboard';
import BookGuidePage from './pages/BookGuidePage';
import LocationDetailPage from './pages/LocationDetailPage';
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
import AdminAudioGuides from './pages/admin/AdminAudioGuides';


// Guide Pages
import Earnings from './pages/guide/Earnings';
import ChatList from './pages/guide/ChatList';
import GuideVerifyPage from './pages/GuideVerifyPage';
import GuideSetupPage from './pages/GuideSetupPage';
import GuideGuard from './components/GuideGuard';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import VerifyResetOTP from './pages/VerifyResetOTP';
import ResetPassword from './pages/ResetPassword';

import { ThemeProvider } from './context/ThemeContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';

function AppContent() {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const socketRef = useRef();
  const location = useLocation();
  const { tripStatus } = useBooking();

  const isTripLive = tripStatus === TRIP_STATUS.ONGOING && (location.pathname.includes('/book-guide') || location.pathname === '/guide');

  useEffect(() => {
    if (user) {
      // Connect to socket when user is logged in
      const guideId = (user.role === 'guide' && user.guideId) ? user.guideId : null;
      const socket = connectSocket(user._id, user.role, guideId);
      socketRef.current = socket;
      
      socket.on('notification', (data) => {
        setNotification(data);
      });

      return () => {
        disconnectSocket();
      };
    }
  }, [user]);

  return (
    <>

      <div className="flex min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
        {/* Mobile Header */}
        <header className={`${isTripLive ? 'hidden' : 'flex'} lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#f7f7f7] items-center justify-between px-6 z-[900]`}>
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-[#222222] hover:bg-[#f7f7f7] rounded-full transition-all">
                <Menu size={24} />
             </button>
             <span className="text-xl font-black italic tracking-tighter text-[#ff385c]">GuideGo</span>
          </div>
          {user && (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ff385c]/10 shadow-sm">
               <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=ff385c&color=fff`} className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        {/* Sidebar - Fixed Left */}
        {!isTripLive && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} className="w-[260px] flex-shrink-0" />}
        
        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[950]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 ${!isTripLive ? 'lg:ml-[260px]' : ''} ml-0 min-h-screen ${!isTripLive ? 'pt-16 lg:pt-0' : 'pt-0'} overflow-y-auto`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><AuthPage /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><AuthPage /></PageWrapper>} />
              <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
              <Route path="/verify-otp" element={<PageWrapper><VerifyOTP /></PageWrapper>} />
              <Route path="/verify-reset-otp" element={<PageWrapper><VerifyResetOTP /></PageWrapper>} />
              <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfilePage /></ProtectedRoute>} />
              
              {/* Core Feature Routes */}
              <Route path="/book-guide" element={<ProtectedRoute><PageWrapper><BookGuidePage /></PageWrapper></ProtectedRoute>} />
              <Route path="/location/:name" element={<PageWrapper><LocationDetailPage /></PageWrapper>} />
              <Route path="/guides/:id" element={<ProtectedRoute><PageWrapper><GuideProfile /></PageWrapper></ProtectedRoute>} />
              
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
              <Route path="/guide/verify-identity" element={<ProtectedRoute requiredRole="guide"><PageWrapper><GuideVerifyPage /></PageWrapper></ProtectedRoute>} />
              <Route path="/guide/setup" element={<ProtectedRoute requiredRole="guide"><PageWrapper><GuideSetupPage /></PageWrapper></ProtectedRoute>} />
              <Route path="/guide" element={<ProtectedRoute requiredRole="guide"><GuideGuard><PageWrapper><GuideDashboard /></PageWrapper></GuideGuard></ProtectedRoute>} />
              <Route path="/guide/bookings" element={<ProtectedRoute requiredRole="guide"><GuideGuard><PageWrapper><Bookings /></PageWrapper></GuideGuard></ProtectedRoute>} />
              <Route path="/guide/chat" element={<ProtectedRoute requiredRole="guide"><GuideGuard><PageWrapper><ChatList /></PageWrapper></GuideGuard></ProtectedRoute>} />
              <Route path="/guide/earnings" element={<ProtectedRoute requiredRole="guide"><GuideGuard><PageWrapper><Earnings /></PageWrapper></GuideGuard></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="users" element={<PageWrapper><AdminUsers /></PageWrapper>} />
                <Route path="guides" element={<PageWrapper><AdminGuides /></PageWrapper>} />
                <Route path="places" element={<PageWrapper><AdminPlaces /></PageWrapper>} />
                <Route path="bookings" element={<PageWrapper><AdminBookings /></PageWrapper>} />
                <Route path="reports" element={<PageWrapper><AdminReports /></PageWrapper>} />
                <Route path="kyc" element={<PageWrapper><AdminKycPage /></PageWrapper>} />
                <Route path="audio-guides" element={<PageWrapper><AdminAudioGuides /></PageWrapper>} />

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
          <HelmetProvider>
            <Router>
              <BookingProvider>
                <AppContent />
              </BookingProvider>
            </Router>
          </HelmetProvider>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
