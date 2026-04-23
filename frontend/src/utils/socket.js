import { io } from 'socket.io-client';

let socket;

export const connectSocket = (userId, role, guideId) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket'],
      withCredentials: true, // Crucial for cookies
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
