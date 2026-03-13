import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser(userInfo);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return { data };
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const verifyOTP = async (email, otp) => {
    const { data } = await axios.post('/api/auth/verify-otp', { email, otp });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role, mobile, location) => {
    const normalizedEmail = email.trim().toLowerCase();
    const { data } = await axios.post('/api/auth/register', { name, email: normalizedEmail, password, role, mobile, location });
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, verifyOTP }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
