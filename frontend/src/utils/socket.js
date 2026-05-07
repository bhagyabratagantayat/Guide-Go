import { io } from 'socket.io-client';

let socket;

export const connectSocket = (userId, role, guideId) => {
  if (!socket) {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const defaultURL = 'https://guide-go-backend.onrender.com';
    
    socket = io(import.meta.env.VITE_SOCKET_URL || defaultURL, {
      transports: ['polling', 'websocket'], // Use polling first to ensure connection, then upgrade to websocket
      withCredentials: true,
      auth: {
        userId,
        role,
        guideId
      },
      reconnectionAttempts: 10,
      timeout: 20000
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    // Attempt rescue with fallback
    const userString = localStorage.getItem('gg_user');
    const user = userString ? JSON.parse(userString) : null;
    if (user) {
      return connectSocket(user._id, user.role, user.guideId);
    }
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
