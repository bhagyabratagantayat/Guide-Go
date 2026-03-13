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

// Set security HTTP headers
app.use(helmet());

// Compress responses
app.use(compression());

// Limit requests from same API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Data sanitization against XSS
app.use(xss());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', 
  'https://guide-go.vercel.app', // Example Vercel URL
  /\.vercel\.app$/ // Any vercel subdomain
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(regex => regex instanceof RegExp && regex.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

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
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
  res.send('GuideGo API is running...');
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = config.port;

server.listen(PORT, () => logger.info(`Server running in ${config.env} mode on port ${PORT}`));
