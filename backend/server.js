const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
require('dotenv').config();

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
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

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
const path = require('path');
const fs = require('fs');
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
// Bids / Auctions
app.use('/api/bids', require('./routes/bid.routes'));

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
