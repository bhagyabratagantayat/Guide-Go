const socketio = require('socket.io');
const User = require('../models/User');

const initSocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Demo Guide Simulator
  const startSimulator = async () => {
    const guides = await User.find({ role: 'guide' }).limit(3);
    if (guides.length === 0) return;

    // Base positions near landmarks
    const bases = [
      { lat: 20.2741, lng: 85.8080 }, // Tribal Museum
      { lat: 20.2631, lng: 85.7863 }, // Udayagiri
      { lat: 20.2382, lng: 85.8338 }  // Lingaraj
    ];

    setInterval(() => {
      guides.forEach((guide, index) => {
        const base = bases[index % bases.length];
        // Add random jitter (approx 100-200 meters)
        const lat = base.lat + (Math.random() - 0.5) * 0.005;
        const lng = base.lng + (Math.random() - 0.5) * 0.005;

        io.emit('guideLocationUpdate', {
          guideId: guide._id,
          location: { lat, lng }
        });
      });
    }, 5000);
  };

  startSimulator();

  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Join room based on user role or ID
    socket.on('join', (data) => {
      socket.join(data.userId);
      console.log(`User ${data.userId} joined room`);
    });

    // Guide sends location update
    socket.on('updateLocation', (data) => {
      console.log(`Location update from guide ${data.guideId}:`, data.location);
      
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
