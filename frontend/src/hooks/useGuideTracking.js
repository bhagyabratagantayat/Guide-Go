import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const useGuideTracking = (user) => {
  const [liveGuides, setLiveGuides] = useState({});
  const socketRef = useRef();

  useEffect(() => {
    if (!user) return;

    const socketUrl = axios.defaults.baseURL || 'http://localhost:5000';
    socketRef.current = io(socketUrl);

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join', { userId: user._id });
    });

    socketRef.current.on('guideLocationUpdate', (data) => {
      // data: { guideId, location: { lat, lng } }
      setLiveGuides((prev) => ({
        ...prev,
        [data.guideId]: [data.location.lat, data.location.lng]
      }));
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user]);

  const startTracking = () => {
    if (user?.role !== 'guide') return;

    const intervalId = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          socketRef.current.emit('updateLocation', {
            guideId: user._id,
            location: { lat: latitude, lng: longitude }
          });
        });
      }
    }, 5000);

    return () => clearInterval(intervalId);
  };

  return { liveGuides, startTracking };
};

export default useGuideTracking;
