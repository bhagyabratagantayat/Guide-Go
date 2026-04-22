import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { getSocket } from '../utils/socket';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  const [tripStatus, setTripStatus] = useState('IDLE'); // IDLE, SEARCHING, MATCHED, ONGOING, COMPLETED
  const [activeBooking, setActiveBooking] = useState(null);
  const [matchedGuide, setMatchedGuide] = useState(null);
  const [tripTimer, setTripTimer] = useState(0);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const endpoint = user.role === 'guide' ? '/bookings/guide' : '/bookings/user';
        const { data: bookings } = await api.get(endpoint);
        
        // Find latest active booking
        const active = bookings.find(b => ['searching', 'accepted', 'ongoing'].includes(b.status));
        
        if (active) {
          setActiveBooking(active);
          if (active.status === 'searching') setTripStatus('SEARCHING');
          if (active.status === 'accepted') {
            setTripStatus('MATCHED');
            setMatchedGuide(user.role === 'guide' ? active.userId : active.guideId);
          }
          if (active.status === 'ongoing') {
            setTripStatus('ONGOING');
            setMatchedGuide(user.role === 'guide' ? active.userId : active.guideId);
            
            // Calculate elapsed time
            const startTime = new Date(active.startedAt).getTime();
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            setTripTimer(elapsed > 0 ? elapsed : 0);
          }
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [user]);

  // Socket listeners for real-time sync
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user) return;

    socket.on('booking_accepted', (data) => {
      setMatchedGuide(data.guide);
      setTripStatus('MATCHED');
      setActiveBooking(prev => ({ ...prev, _id: data.bookingId, status: 'accepted', otp: data.otp }));
    });

    socket.on('trip_started', (data) => {
      setTripStatus('ONGOING');
      setTripTimer(0);
    });

    socket.on('trip_ended', () => {
      setTripStatus('COMPLETED');
    });

    socket.on('booking_cancelled', () => {
      resetBooking();
    });

    return () => {
      socket.off('booking_accepted');
      socket.off('trip_started');
      socket.off('trip_ended');
      socket.off('booking_cancelled');
    };
  }, [user]);

  // Timer logic for ongoing trips
  useEffect(() => {
    let interval;
    if (tripStatus === 'ONGOING') {
      interval = setInterval(() => {
        setTripTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tripStatus]);

  const resetBooking = () => {
    setTripStatus('IDLE');
    setActiveBooking(null);
    setMatchedGuide(null);
    setTripTimer(0);
  };

  return (
    <BookingContext.Provider value={{
      tripStatus, setTripStatus,
      activeBooking, setActiveBooking,
      matchedGuide, setMatchedGuide,
      tripTimer, resetBooking,
      loading
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
