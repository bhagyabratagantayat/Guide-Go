const express = require('express');
const cors = require('cors');
const compression = require('compression');
const config = require('./config/env');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { xss } = require('express-xss-sanitizer');
const cookieParser = require('cookie-parser');
const requestLogger = require('./middleware/requestLogger');
const logger = require('./utils/logger');
const connectDB = require('./config/db');

const http = require('http');
const initSocket = require('./utils/socket');

const app = express();
app.set('trust proxy', 1); // Crucial for secure cookies on Render/Vercel
const server = http.createServer(app);
let io; // Will be initialized after DB connection

// ── CORS ──────────────────────────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'https://guide-go.vercel.app',
      'https://guidego.vercel.app',
    ].filter(Boolean);
    // Allow requests with no origin (curl, Postman)
    if (!origin || allowed.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compress responses
app.use(compression());

// Limit requests from same API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, 
  message: 'Too many requests from this IP'
});
app.use('/api', limiter);

// Strict rate limiting for Auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Limit to 50 requests per 15 mins
  message: 'Too many authentication attempts, please try again later'
});
app.use('/api/auth', authLimiter);

// Data sanitization against XSS
app.use(xss());

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Attach Socket.IO to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: "GuideGo API Running" });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/kyc', require('./routes/kyc'));
app.use('/api/guides', require('./routes/guideRoutes'));
app.use('/api/places', require('./routes/placeRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/sos', require('./routes/sosRoutes'));

app.get('/', (req, res) => {
  res.send('GuideGo API is running...');
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    io = initSocket(server);

    const PORT = config.port;
    server.listen(PORT, () => logger.info(`Server running in ${config.env} mode on port ${PORT}`));
  } catch (error) {
    logger.error(`Critical Failure: ${error.message}`);
    process.exit(1);
  }
};

startServer();
