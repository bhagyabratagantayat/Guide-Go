import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { getSocket } from '../utils/socket';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const TRIP_STATUS = {
  IDLE: 'IDLE',
  SEARCHING: 'SEARCHING',
  MATCHED: 'MATCHED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED'
};

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  const [tripStatus, setTripStatus] = useState(TRIP_STATUS.IDLE);
  const [bookingData, setBookingData] = useState(null);
  const [matchedGuide, setMatchedGuide] = useState(null);
  const [otp, setOtp] = useState('');
  const [tripTimer, setTripTimer] = useState(0);
  const [isRestoring, setIsRestoring] = useState(true);
  
  const timerRef = useRef(null);
  const socketRef = useRef(null);

  // --- Session Restoration Logic ---
  const restoreSession = React.useCallback(async (silent = false) => {
    if (!silent) setIsRestoring(true);
    try {
      // If no user, we can't restore a session
      if (!user) {
        setIsRestoring(false);
        return;
      }

      const endpoint = user.role === 'guide' ? '/bookings/guide' : '/bookings/user';
      
      // Add a 5-second timeout to the API call
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Restoration Timeout')), 5000)
      );

      const { data } = await Promise.race([
        api.get(endpoint),
        timeoutPromise
      ]);
      
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
    if (user) {
      const socket = getSocket();
      socketRef.current = socket;

      const joinRoom = () => {
        socket.emit('join', { userId: user._id });
        console.log('Socket join emitted for user:', user._id);
      };

      if (socket.connected) joinRoom();
      socket.on('connect', joinRoom);

      socket.on('booking_accepted', (data) => {
        console.log('Booking accepted received:', data);
        setBookingData(data.booking);
        setMatchedGuide(data.guide);
        setOtp(data.otp || data.booking?.otp);
        setTripStatus(TRIP_STATUS.MATCHED);
        localStorage.setItem('activeBookingId', data.booking?._id);
      });

      socket.on('trip_started', (data) => {
        console.log('TRIP_STARTED EVENT RECEIVED:', data);
        setTripStatus(TRIP_STATUS.ONGOING);
        if (data.bookingId) localStorage.setItem('activeBookingId', data.bookingId);
        startTimer(data.startedAt || new Date());
        // Proactive sync to ensure all details are latest
        restoreSession(true);
      });

      socket.on('trip_ended', () => {
        console.log('TRIP_ENDED EVENT RECEIVED');
        setTripStatus(TRIP_STATUS.COMPLETED);
        stopTimer();
        localStorage.removeItem('activeBookingId');
        restoreSession();
      });

      socket.on('booking_cancelled', () => {
        console.log('BOOKING_CANCELLED EVENT RECEIVED');
        localStorage.removeItem('activeBookingId');
        resetBooking();
      });

      return () => {
        socket.off('connect', joinRoom);
        socket.off('booking_accepted');
        socket.off('trip_started');
        socket.off('trip_ended');
        socket.off('booking_cancelled');
      };
    }
  }, [user]);

  // Initial Restore & Interval Sync
  useEffect(() => {
    restoreSession();
    const syncInterval = setInterval(() => restoreSession(true), 15000);
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
    // If we don't even have a booking ID yet (still creating), just reset the UI
    if (!bookingData?._id) {
      resetBooking();
      return;
    }

    try {
      // Optimistically reset UI
      const idToCancel = bookingData._id;
      resetBooking();
      
      // Notify backend
      await api.put(`/bookings/${idToCancel}/status`, { status: 'cancelled' });
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
