import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { getSocket } from '../utils/socket';

const BookingContext = createContext();

export const TRIP_STATUS = {
  IDLE: 'IDLE',
  SEARCHING: 'SEARCHING',
  MATCHED: 'MATCHED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED'
};

export const BookingProvider = ({ children }) => {
  const [tripStatus, setTripStatus] = useState(TRIP_STATUS.IDLE);
  const [bookingData, setBookingData] = useState(null);
  const [matchedGuide, setMatchedGuide] = useState(null);
  const [otp, setOtp] = useState('');
  const [tripTimer, setTripTimer] = useState(0);
  const [isRestoring, setIsRestoring] = useState(true);
  
  const timerRef = useRef(null);
  const socketRef = useRef(null);

  // --- Session Restoration Logic ---
  const restoreSession = React.useCallback(async () => {
    try {
      const userString = localStorage.getItem('gg_user');
      const user = userString ? JSON.parse(userString) : null;
      
      // If no user, we can't restore a session, so just stop the loading state
      if (!user) {
        setIsRestoring(false);
        return;
      }

      const endpoint = user.role === 'guide' ? '/bookings/guide' : '/bookings/user';
      const { data } = await api.get(endpoint);
      
      if (data && data.length > 0) {
        const latest = data[0];
        if (['searching', 'accepted', 'ongoing', 'completed'].includes(latest.status)) {
          setBookingData(latest);
          if (latest.status === 'searching') {
            setTripStatus(TRIP_STATUS.SEARCHING);
          } else if (latest.status === 'accepted') {
            setTripStatus(TRIP_STATUS.MATCHED);
            setMatchedGuide(latest.guideId);
            setOtp(latest.otp);
          } else if (latest.status === 'ongoing') {
            setTripStatus(TRIP_STATUS.ONGOING);
            setMatchedGuide(latest.guideId);
            startTimer(latest.startedAt);
          } else if (latest.status === 'completed') {
            if (!latest.review?.rating) {
              setTripStatus(TRIP_STATUS.COMPLETED);
              stopTimer();
            } else {
              setTripStatus(TRIP_STATUS.IDLE);
            }
          }
        }
      }
    } catch (error) {
      console.error('Session restoration failed:', error);
    } finally {
      setIsRestoring(false);
    }
  }, []);

  // --- Socket Initialization ---
  useEffect(() => {
    const userString = localStorage.getItem('gg_user');
    const user = userString ? JSON.parse(userString) : null;
    
    if (user && !socketRef.current) {
      const socket = getSocket();
      socketRef.current = socket;

      socket.on('booking_accepted', (data) => {
        setMatchedGuide(data.guide);
        setOtp(data.otp);
        setTripStatus(TRIP_STATUS.MATCHED);
      });

      socket.on('trip_started', (data) => {
        setTripStatus(TRIP_STATUS.ONGOING);
        startTimer(data.startedAt || new Date());
      });

      socket.on('trip_ended', () => {
        setTripStatus(TRIP_STATUS.COMPLETED);
        stopTimer();
        restoreSession();
      });

      socket.on('booking_cancelled', () => {
        resetBooking();
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('booking_accepted');
        socketRef.current.off('trip_started');
        socketRef.current.off('trip_ended');
        socketRef.current.off('booking_cancelled');
      }
    };
  }, [restoreSession]);

  // Initial Restore & Interval Sync
  useEffect(() => {
    restoreSession();
    const syncInterval = setInterval(restoreSession, 5000);
    return () => clearInterval(syncInterval);
  }, [restoreSession]);

  const startTimer = (startTime) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const calculateElapsed = () => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - start) / 1000);
      setTripTimer(elapsed > 0 ? elapsed : 0);
    };

    calculateElapsed();
    timerRef.current = setInterval(calculateElapsed, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startSearching = async (params) => {
    try {
      setTripStatus(TRIP_STATUS.SEARCHING);
      const { data } = await api.post('/bookings', params);
      setBookingData(data);
      return data;
    } catch (error) {
      setTripStatus(TRIP_STATUS.IDLE);
      throw error;
    }
  };

  const cancelBooking = async () => {
    if (!bookingData?._id) return;
    try {
      await api.put(`/bookings/${bookingData._id}/status`, { status: 'cancelled' });
      resetBooking();
    } catch (error) {
      console.error('Cancellation failed:', error);
    }
  };

  const resetBooking = () => {
    setTripStatus(TRIP_STATUS.IDLE);
    setBookingData(null);
    setMatchedGuide(null);
    setOtp('');
    setTripTimer(0);
    stopTimer();
  };


  return (
    <BookingContext.Provider value={{
      tripStatus,
      setTripStatus,
      bookingData,
      setBookingData,
      matchedGuide,
      otp,
      tripTimer,
      isRestoring,
      startSearching,
      cancelBooking,
      resetBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
