const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
// Load backend-specific environment variables from backend/.env explicitly
// and FORCE them to override any system-wide environment variables so the
// project-local values always take precedence when running from the repo.
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '.env');
// Only load and override with the project-local `.env` in non-production
// environments. In production we expect the host (Render/Vercel) to provide
// environment variables and we DON'T want a committed .env to override them.
if (process.env.NODE_ENV !== 'production') {
  if (fs.existsSync(envPath)) {
    try {
      const parsed = dotenv.parse(fs.readFileSync(envPath));
      // Override process.env values with those from backend/.env for dev
      Object.keys(parsed).forEach((k) => {
        process.env[k] = parsed[k];
      });
      dotenv.config({ path: envPath });
    } catch (err) {
      console.warn('⚠️ Failed to parse backend/.env — falling back to default dotenv behavior', err.message);
      dotenv.config({ path: envPath });
    }
  } else {
    dotenv.config({ path: envPath });
  }
} else {
  // Production: do not read or override process.env from local files.
  // Providers (Render, Vercel) should inject environment variables.
}

const app = express();

// Initialize Passport
require('./config/passport.config')(passport);
app.use(passport.initialize());

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Security Headers
app.use(helmet());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS Configuration
// Support a comma-separated list of allowed frontend origins via FRONTEND_URLS.
// Example: FRONTEND_URLS="https://adboard-red.vercel.app,https://www.listynest.com"
// For development, allow any localhost port so Vite can pick a different port (5173 may be in use)
const rawFrontend = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173';
let allowedOrigins = [];
if (process.env.NODE_ENV === 'development') {
  // allow http://localhost and any port on localhost during development
  allowedOrigins = [/http:\/\/localhost(:\d+)?/];
} else {
  // split comma separated list into exact origins
  allowedOrigins = rawFrontend.split(',').map(s => s.trim()).filter(Boolean);
}

const corsOptions = {
  origin: function(origin, callback) {
    // Allow non-browser tools (no Origin header)
    if (!origin) return callback(null, true);

    const allowed = allowedOrigins.some((o) => {
      if (o instanceof RegExp) return o.test(origin);
      return o === origin;
    });

    if (allowed) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Log allowed origins for debugging (helpful in production deployment logs)
console.log('✅ CORS allowed origins:', allowedOrigins);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

// In development, allow localhost/loopback traffic to bypass the rate limiter to avoid
// interfering with local debugging and hot-reload behavior. In production the limiter
// will still apply.
app.use((req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || '';
  const isLocalhost = ip === '127.0.0.1' || ip === '::1' || req.hostname === 'localhost';
  if (process.env.NODE_ENV === 'development' && isLocalhost) {
    return next();
  }
  return limiter(req, res, next);
});

// ============================================
// ROUTES
// ============================================

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'AdBoard API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});
// Serve dynamic form config
app.get('/api/form-config', (req, res) => {
  const configPath = path.join(__dirname, 'config', 'form-config.json');
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not load form config.' });
    }
    try {
      const config = JSON.parse(data);
      res.json(config);
    } catch (parseErr) {
      res.status(500).json({ success: false, message: 'Invalid form config format.' });
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/ads', require('./routes/ad.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/subscriptions', require('./routes/subscription.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/locations', require('./routes/location.routes'));
app.use('/api/currencies', require('./routes/currency.routes'));
app.use('/api/v1/ads', require('./routes/import.routes'));
// Bids / Auctions
app.use('/api/bids', require('./routes/bid.routes'));
// Blogs
app.use('/api/blogs', require('./routes/blog.routes'));

// NOTE: auction sweep job is started after DB connection in startServer()

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// DATABASE CONNECTION
// ============================================

// Support an in-memory MongoDB for local development when MONGODB_URI is not provided.
let _mongodInstance; // if we start an in-memory server, keep reference for shutdown
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      // Start an in-memory MongoDB server for local development (no mongod required)
      // This is safe for development/testing only.
      const { MongoMemoryServer } = require('mongodb-memory-server');
      _mongodInstance = await MongoMemoryServer.create();
      mongoUri = _mongodInstance.getUri();
      console.log('⚠️  No MONGODB_URI provided — using in-memory MongoDB for development');
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);

    // In development, attempt a safe fallback to an in-memory MongoDB server
    // so the backend can still start for local testing / debugging.
    if (process.env.NODE_ENV === 'development') {
      try {
        console.warn('⚠️ Attempting to start an in-memory MongoDB server as a fallback (development only).');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        _mongodInstance = await MongoMemoryServer.create();
        const fallbackUri = _mongodInstance.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`✅ Connected to in-memory MongoDB: ${conn.connection.host}`);
        return;
      } catch (memErr) {
        console.error('❌ In-memory MongoDB fallback failed:', memErr && memErr.message ? memErr.message : memErr);
      }
    }

    // If not in development or fallback failed, exit with failure so the
    // problem is visible in production environments.
    process.exit(1);
  }
};

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();
  
  // Start Express Server
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ========================================');
    console.log(`🚀 AdBoard API Server Running`);
    console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
    console.log(`🚀 Port: ${PORT}`);
    console.log(`🚀 URL: http://localhost:${PORT}`);
    console.log('🚀 ========================================');
    console.log('');
  });

  // Start auction sweep job (runs every minute) AFTER DB connection
  try {
    const { runAuctionSweep } = require('./jobs/auction.job');
    // Run once on startup
    runAuctionSweep().catch(err => console.error('Initial auction sweep error:', err));
    // Schedule repeated runs (every 60 seconds)
    setInterval(() => {
      runAuctionSweep().catch(err => console.error('Scheduled auction sweep error:', err));
    }, 60 * 1000);
  } catch (err) {
    console.warn('Auction job not started:', err.message || err);
  }
};

// Handle Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  });
});

// Start the server
startServer();

module.exports = app;
