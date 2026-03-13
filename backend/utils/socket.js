const socketio = require('socket.io');

const initSocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Join room based on user role or ID
    socket.on('join', (data) => {
      socket.join(data.userId);
      console.log(`User ${data.userId} joined room`);
    });

    // Guide sends location update
    socket.on('updateLocation', (data) => {
      // data: { guideId, location: { lat, lng } }
      console.log(`Location update from guide ${data.guideId}:`, data.location);
      
      // Broadcast to all connected clients
      io.emit('guideLocationUpdate', {
        guideId: data.guideId,
        location: data.location
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;
