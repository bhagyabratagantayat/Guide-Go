import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { HelmetProvider } from 'react-helmet-async';
import { BookingProvider, useBooking, TRIP_STATUS } from './context/BookingContext';

import { AdminProvider } from './context/AdminContext';
// Components
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationToast from './components/NotificationToast';
import PageLoader from './components/PageLoader';
import { connectSocket, disconnectSocket } from './utils/socket';
import { Menu } from 'lucide-react';
import api from './utils/api';
import Footer from './components/Footer';

// Lazy Loaded Pages
const Home               = lazy(() => import('./pages/Home'));
const AuthPage           = lazy(() => import('./pages/AuthPage'));
const AuthCallbackPage   = lazy(() => import('./pages/AuthCallbackPage'));
const CompleteProfilePage = lazy(() => import('./pages/CompleteProfilePage'));
const GuideDashboard     = lazy(() => import('./pages/GuideDashboard'));
const BookGuidePage      = lazy(() => import('./pages/BookGuidePage'));
const LocationDetailPage = lazy(() => import('./pages/LocationDetailPage'));
const AIChat             = lazy(() => import('./pages/AIChat'));
const Bookings           = lazy(() => import('./pages/Bookings'));
const Profile            = lazy(() => import('./pages/Profile'));
const Settings           = lazy(() => import('./pages/Settings'));
const GuideProfile       = lazy(() => import('./pages/GuideProfile'));
const NotificationsPage  = lazy(() => import('./pages/NotificationsPage'));

const AudioGuidePage     = lazy(() => import('./pages/AudioGuidePage'));
const HotelsPage         = lazy(() => import('./pages/HotelsPage'));
const RestaurantsPage    = lazy(() => import('./pages/RestaurantsPage'));
const PremiumPage        = lazy(() => import('./pages/PremiumPage'));
const HelpPage           = lazy(() => import('./pages/HelpPage'));

const Chat               = lazy(() => import('./pages/Chat'));
const ChatPage           = lazy(() => import('./pages/ChatPage'));
const Weather            = lazy(() => import('./pages/Weather'));
const TripPlanner        = lazy(() => import('./pages/TripPlanner'));
const Agencies           = lazy(() => import('./pages/Agencies'));
const AgencyDetail       = lazy(() => import('./pages/AgencyDetail'));
const OngoingTrip        = lazy(() => import('./pages/OngoingTrip'));

// Admin
const AdminLayout        = lazy(() => import('./components/AdminLayout'));
const AdminDashboard     = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminReports       = lazy(() => import('./pages/admin/AdminReports'));
const AdminUsers         = lazy(() => import('./pages/admin/AdminUsers'));
const AdminGuides        = lazy(() => import('./pages/admin/AdminGuides'));
const AdminPlaces        = lazy(() => import('./pages/admin/AdminPlaces'));
const AdminBookings      = lazy(() => import('./pages/admin/AdminBookings'));
const AdminKycPage       = lazy(() => import('./pages/AdminKycPage'));
const AdminAudioGuides   = lazy(() => import('./pages/admin/AdminAudioGuides'));

// Guide
const Earnings           = lazy(() => import('./pages/guide/Earnings'));
const ChatList           = lazy(() => import('./pages/guide/ChatList'));
const GuideVerifyPage    = lazy(() => import('./pages/GuideVerifyPage'));
const GuideSetupPage     = lazy(() => import('./pages/GuideSetupPage'));
const ForgotPassword     = lazy(() => import('./pages/ForgotPassword'));
const VerifyOTP          = lazy(() => import('./pages/VerifyOTP'));
const VerifyResetOTP     = lazy(() => import('./pages/VerifyResetOTP'));
const ResetPassword      = lazy(() => import('./pages/ResetPassword'));

import GuideGuard from './components/GuideGuard';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';

function AppContent() {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const socketRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const { tripStatus, bookingData } = useBooking();
  const [incomingBooking, setIncomingBooking] = useState(null);
  const [countdown, setCountdown] = useState(30);

  // Redirect Guide from Home to Dashboard
  useEffect(() => {
    if (user?.role === 'guide' && location.pathname === '/') {
      navigate('/guide', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  const isTripLive = (tripStatus === TRIP_STATUS.MATCHED || tripStatus === TRIP_STATUS.ONGOING) && (location.pathname.includes('/book-guide') || location.pathname.includes('/ongoing-trip') || location.pathname === '/guide');

  // GLOBAL REDIRECT: If trip is ongoing, force user to the trip page
  useEffect(() => {
    if (user?.role === 'user' && tripStatus === TRIP_STATUS.ONGOING && bookingData?._id) {
      const restrictedPaths = ['/', '/book-guide', '/my-bookings'];
      if (restrictedPaths.includes(location.pathname)) {
         navigate(`/ongoing-trip/${bookingData._id}`, { replace: true });
      }
    }
  }, [tripStatus, bookingData, location.pathname, user, navigate]);

  useEffect(() => {
    if (user) {
      const guideId = (user.role === 'guide' && user.guideId) ? user.guideId : null;
      const socket = connectSocket(user._id, user.role, guideId);
      socketRef.current = socket;
      
      socket.on('notification', (data) => {
        setNotification(data);
      });

      if (user.role === 'guide') {
        socket.on('new_booking_broadcast', (data) => {
          setIncomingBooking(data.booking);
          setCountdown(60);
        });

        socket.on('booking_cancelled', () => {
          setIncomingBooking(null);
        });
      }

      return () => {
        if (socket) {
          socket.off('notification');
          socket.off('new_booking_broadcast');
          socket.off('booking_cancelled');
        }
        disconnectSocket();
      };
    }
  }, [user]);

  // Countdown timer for global booking popup
  useEffect(() => {
    let timer;
    if (incomingBooking && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      setIncomingBooking(null);
    }
    return () => clearInterval(timer);
  }, [incomingBooking, countdown]);

  const handleAcceptBooking = async () => {
    if (!incomingBooking) return;
    try {
      // Get guide's current location first
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        await api.put(`/bookings/accept/${incomingBooking._id}`, {
          lat: latitude,
          lng: longitude
        });
        setIncomingBooking(null);
        navigate('/guide');
      }, async (err) => {
        // Fallback if location fails
        console.warn('Location failed, accepting anyway:', err);
        await api.put(`/bookings/accept/${incomingBooking._id}`);
        setIncomingBooking(null);
        navigate('/guide');
      });
    } catch (error) {
      console.error('Failed to accept booking:', error);
      setIncomingBooking(null);
    }
  };

  return (
    <>

      <div className="flex min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
        {/* Mobile Header */}
        <header className={`${isTripLive ? 'hidden' : 'flex'} lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#f7f7f7] items-center justify-between px-6 z-[900]`}>
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-[#222222] hover:bg-[#f7f7f7] rounded-full transition-all">
                <Menu size={24} />
             </button>
             <span className="text-xl font-black italic tracking-tighter text-[#ff385c]">Guide Goo</span>
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
            <Suspense fallback={<PageLoader />}>
              <Routes location={location}>
                {/* Public Routes - with redirects for authenticated roles */}
                <Route path="/" element={
                  user?.role === 'guide' ? <Navigate to="/guide" replace /> :
                  user?.role === 'admin' ? <Navigate to="/admin" replace /> :
                  <PageWrapper><Home /></PageWrapper>
                } />
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
                <Route path="/ongoing-trip/:id" element={<ProtectedRoute><PageWrapper><OngoingTrip /></PageWrapper></ProtectedRoute>} />
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
                <Route path="/chat/:bookingId" element={<ProtectedRoute><PageWrapper><ChatPage /></PageWrapper></ProtectedRoute>} />

                {/* Guide Flow */}
                <Route path="/guide/verify-identity" element={<ProtectedRoute requiredRole="guide"><PageWrapper><GuideVerifyPage /></PageWrapper></ProtectedRoute>} />
                <Route path="/guide/setup" element={<ProtectedRoute requiredRole="guide"><PageWrapper><GuideSetupPage /></PageWrapper></ProtectedRoute>} />
                <Route path="/guide" element={<ProtectedRoute requiredRole="guide"><GuideGuard><PageWrapper><GuideDashboard /></PageWrapper></GuideGuard></ProtectedRoute>} />
                <Route path="/guide/bookings" element={<ProtectedRoute requiredRole="guide"><GuideGuard><PageWrapper><Bookings /></PageWrapper></GuideGuard></ProtectedRoute>} />
                <Route path="/guide/chat" element={<ProtectedRoute requiredRole="guide"><GuideGuard><PageWrapper><ChatList /></PageWrapper></GuideGuard></ProtectedRoute>} />
                <Route path="/guide/chat/:id" element={<ProtectedRoute requiredRole="guide"><GuideGuard><PageWrapper><Chat /></PageWrapper></GuideGuard></ProtectedRoute>} />
                <Route path="/guide/earnings" element={<ProtectedRoute requiredRole="guide"><GuideGuard><PageWrapper><Earnings /></PageWrapper></GuideGuard></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminProvider>
                      <AdminLayout />
                    </AdminProvider>
                  </ProtectedRoute>
                }>
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
            </Suspense>
          </AnimatePresence>
          {!isTripLive && <Footer />}
        </main>
      </div>

      <AnimatePresence>
        {incomingBooking && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-6 right-6 z-[2000] lg:left-auto lg:right-10 lg:w-[400px]"
          >
            <div className="bg-[#0f172a] rounded-[2.5rem] p-8 border border-white/10 shadow-2xl space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter">New Request!</h3>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Incoming tour request nearby</p>
                  </div>
                  <div className="w-12 h-12 bg-[#ff385c]/10 rounded-full flex items-center justify-center text-[#ff385c]">
                    <span className="font-black text-xs">{countdown}s</span>
                  </div>
               </div>

               <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Plan</span><span className="text-xs font-bold text-white">{incomingBooking.plan}</span></div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5"><span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Price</span><span className="text-lg font-black text-emerald-500">₹{incomingBooking.price}</span></div>
               </div>

               <div className="flex gap-3">
                  <button onClick={() => setIncomingBooking(null)} className="flex-1 py-4 bg-white/5 text-white/60 rounded-2xl font-bold text-xs uppercase tracking-widest border border-white/10">Reject</button>
                  <button onClick={handleAcceptBooking} className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20">Accept</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
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
