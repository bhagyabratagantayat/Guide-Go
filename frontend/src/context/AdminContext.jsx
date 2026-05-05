import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [data, setData] = useState({
    stats: null,
    bookings: [],
    users: [],
    guides: [],
    recentBookings: []
  });
  const [loadStates, setLoadStates] = useState({
    stats: true,
    bookings: true,
    users: true,
    guides: true
  });
  const [error, setError] = useState(null);

  const fetchAllAdminData = useCallback(async (silent = false) => {
    if (!silent) {
      setLoadStates({ stats: true, bookings: true, users: true, guides: true });
    }
    
    // Independent fetchers
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data?.data) {
          setData(prev => ({ 
            ...prev, 
            stats: res.data.data.stats, 
            recentBookings: res.data.data.recentBookings 
          }));
        }
      } catch (err) { 
        console.error('Stats fetch failed:', err); 
      }
      finally { setLoadStates(prev => ({ ...prev, stats: false })); }
    };

    const fetchBookings = async () => {
      try {
        console.log('Fetching Admin Bookings...');
        const res = await api.get('/admin/bookings');
        console.log('Bookings Received:', res.data?.data?.length);
        if (res.data?.data) {
          setData(prev => ({ ...prev, bookings: res.data.data }));
        }
      } catch (err) { console.error('Bookings fetch failed:', err); }
      finally { setLoadStates(prev => ({ ...prev, bookings: false })); }
    };

    const fetchUsers = async () => {
      try {
        console.log('Fetching Admin Users...');
        const res = await api.get('/admin/users');
        console.log('Users Received:', res.data?.data?.length);
        if (res.data?.data) {
          setData(prev => ({ ...prev, users: res.data.data }));
        }
      } catch (err) { console.error('Users fetch failed:', err); }
      finally { setLoadStates(prev => ({ ...prev, users: false })); }
    };

    const fetchGuides = async () => {
      try {
        console.log('Fetching Admin Guides...');
        const res = await api.get('/admin/guides');
        console.log('Guides Received:', res.data?.data?.length);
        if (res.data?.data) {
          setData(prev => ({ ...prev, guides: res.data.data }));
        }
      } catch (err) { console.error('Guides fetch failed:', err); }
      finally { setLoadStates(prev => ({ ...prev, guides: false })); }
    };

    // Fire and forget independently
    fetchStats();
    fetchBookings();
    fetchUsers();
    fetchGuides();
  }, []);

  useEffect(() => {
    fetchAllAdminData();
    // Auto-refresh every 2 minutes in background
    const interval = setInterval(() => fetchAllAdminData(true), 120000);
    return () => clearInterval(interval);
  }, [fetchAllAdminData]);

  const refreshData = () => fetchAllAdminData(true);

  return (
    <AdminContext.Provider value={{ ...data, loadStates, error, refreshData }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
