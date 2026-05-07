const socketio = require('socket.io');
const User = require('../models/User');

const initSocket = (server) => {
  const origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://guide-go.vercel.app", 
    "https://guidego.vercel.app",
    "https://guide-goo.web.app",
    "https://guide-goo.firebaseapp.com"
  ];

  const io = socketio(server, {
    cors: {
      origin: origins,
      methods: ["GET", "POST"],
      credentials: true
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
    const userId = socket.handshake.auth.userId;
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} automatically joined room`);
    }

    console.log(`New connection: ${socket.id}`);

    // Manual join fallback
    socket.on('join', (data) => {
      if (data.userId) {
        socket.join(data.userId);
        console.log(`User ${data.userId} manually joined room`);
      }
    });

    // Guide sends location update
    socket.on('updateLocation', (data) => {
      io.emit('guideLocationUpdate', {
        guideId: data.guideId,
        location: data.location
      });
    });

    // Real-time Chat with Persistence
    socket.on('sendMessage', async (data) => {
      const { bookingId, text, recipientId, senderId } = data;
      if (!bookingId || !text || !recipientId) return;

      try {
        const Booking = require('../models/Booking');
        const Message = require('../models/Message');
        const booking = await Booking.findById(bookingId);

        if (!booking) {
          return socket.emit('chatError', { message: 'Booking not found' });
        }

        // Access Control: Only allow chat if trip is active (Accepted or Ongoing)
        const allowedStatuses = ['accepted', 'ongoing'];
        if (!allowedStatuses.includes(booking.status)) {
          return socket.emit('chatError', { 
            message: 'Chat closed. Trip is already completed or cancelled.',
            status: booking.status
          });
        }

        // Save message to Database
        const newMessage = await Message.create({
          bookingId,
          senderId: senderId || userId,
          receiverId: recipientId,
          text
        });

        // Broadcast to recipient room
        io.to(recipientId).emit('receiveMessage', newMessage);
        // Also send back to sender for confirmation if needed (optional)

      } catch (err) {
        console.error('Chat Error:', err);
        socket.emit('chatError', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;
