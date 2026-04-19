import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const OnboardingGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkStatus = async () => {
      if (user && user.role === 'guide') {
        try {
          const { data } = await axios.get('/api/guides/onboarding/status');
          setStatus(data);
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        }
      }
      setChecking(false);
    };

    if (!loading) {
      if (user && user.role === 'guide') {
        checkStatus();
      } else {
        setChecking(false);
      }
    }
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 border-none">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role === 'guide' && status && !status.profileComplete) {
    if (location.pathname !== '/guide/onboarding') {
      return <Navigate to="/guide/onboarding" replace />;
    }
  }

  return children;
};

export default OnboardingGuard;
