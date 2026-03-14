const express = require('express');
const cors = require('cors');
const compression = require('compression');
const config = require('./config/env');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { xss } = require('express-xss-sanitizer');
const requestLogger = require('./middleware/requestLogger');
const logger = require('./utils/logger');
const connectDB = require('./config/db');

const http = require('http');
const initSocket = require('./utils/socket');

connectDB();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

// CORS configuration - MUST BE FIRST to ensure all responses have CORS headers
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  'https://guidego.vercel.app',
  /\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      // For development, allow localhost/127.0.0.1 even if not explicitly matched above
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
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

// Data sanitization against XSS
app.use(xss());

app.use(express.json());
app.use(requestLogger);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: "GuideGo API Running" });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/guides', require('./routes/guideRoutes'));
app.use('/api/places', require('./routes/placeRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

app.get('/', (req, res) => {
  res.send('GuideGo API is running...');
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = config.port;

server.listen(PORT, () => logger.info(`Server running in ${config.env} mode on port ${PORT}`));
