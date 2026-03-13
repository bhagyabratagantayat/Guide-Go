import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import GuideDashboard from './pages/GuideDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Explore from './pages/Explore';
import ExploreMap from './pages/ExploreMap';
import Guides from './pages/Guides';
import AIChat from './pages/AIChat';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import GuideProfile from './pages/GuideProfile';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminGuides from './pages/admin/AdminGuides';
import AdminPlaces from './pages/admin/AdminPlaces';
import AdminBookings from './pages/admin/AdminBookings';
import { io } from 'socket.io-client';
import { useAuth } from './context/AuthContext';
import NotificationToast from './components/NotificationToast';
import { useState, useEffect, useRef } from 'react';

function AppContent() {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const socketRef = useRef();

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
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="guides" element={<AdminGuides />} />
            <Route path="places" element={<AdminPlaces />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>

          {/* Guide Routes */}
          <Route path="/guide-dashboard" element={
            <ProtectedRoute role="guide">
              <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="pt-16">
                  <GuideDashboard />
                </div>
              </div>
            </ProtectedRoute>
          } />

          {/* User Routes */}
          <Route path="*" element={
            <>
              <Navbar />
              <div className="pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/explore" element={<ExploreMap />} />
                  <Route path="/explore-list" element={<Explore />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/guides/:id" element={<GuideProfile />} />
                  <Route path="/ai-chat" element={<AIChat />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
        {notification && (
          <NotificationToast 
            notification={notification} 
            onClose={() => setNotification(null)} 
          />
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
