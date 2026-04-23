import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userData = JSON.parse(localStorage.getItem('gg_user'));
      if (userData) {
        try {
          const { data } = await api.get('/auth/profile');
          setUser({ ...userData, ...data });
        } catch (error) {
          localStorage.removeItem('gg_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    // Interceptors in api.js handle the token automatically
  }, [user]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('gg_user', JSON.stringify(data));
    setUser(data);
    return { data };
  };

  const updateUser = (data) => {
    const newUser = { ...user, ...data };
    localStorage.setItem('gg_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('gg_user');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const verifyOTP = async (email, otp) => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('gg_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role, mobile, location) => {
    const normalizedEmail = email.trim().toLowerCase();
    const { data } = await api.post('/auth/register', { name, email: normalizedEmail, password, role, mobile, location });
    return data;
  };

  const resendOTP = async (email) => {
    const { data } = await api.post('/auth/resend-otp', { email });
    return data;
  };

  const forgotPassword = async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  };

  const verifyResetOTP = async (email, otp) => {
    const { data } = await api.post('/auth/verify-reset-otp', { email, otp });
    return data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
    return data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, login, logout, register, verifyOTP, resendOTP,
      forgotPassword, verifyResetOTP, resetPassword, updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
