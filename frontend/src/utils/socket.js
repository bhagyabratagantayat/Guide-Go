import { io } from 'socket.io-client';

let socket;

export const connectSocket = (user) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'https://guide-go-backend.onrender.com', {
      auth: {
        token: localStorage.getItem('gg_token'),
        user
      }
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
    return connectSocket(user);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
