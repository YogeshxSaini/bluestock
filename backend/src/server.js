import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import config from './config/index.js';
import { initializeCloudinary } from './config/cloudinary.js';
import { initializeFirebase } from './config/firebase.js';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

// Initialize Express app
const app = express();

// Initialize external services
initializeCloudinary();
initializeFirebase();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = (config.cors.origin || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

// Include common dev ports by default
if (!allowedOrigins.includes('http://localhost:5174')) {
  allowedOrigins.push('http://localhost:5174');
}

// Allowed domain patterns for tunnels
const allowedPatterns = [
  /\.trycloudflare\.com$/,
  /\.ngrok\.io$/,
  /\.ngrok-free\.app$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (allowedOrigins.includes(origin)) return callback(null, true);
      
      // Check if origin matches any allowed pattern
      try {
        const originHost = new URL(origin).hostname;
        if (allowedPatterns.some(pattern => pattern.test(originHost))) {
          return callback(null, true);
        }
      } catch (e) {
        // Invalid origin URL
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Request logging in development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });
}

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Company Registration & Verification API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server (skip in test environment)
const PORT = config.port;
let server;

if (config.nodeEnv !== 'test') {
  server = app.listen(PORT, () => {
    console.log('🚀 ============================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🚀 Environment: ${config.nodeEnv}`);
    console.log(`🚀 API URL: http://localhost:${PORT}/api`);
    console.log('🚀 ============================================');
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  console.log('⚠️  SIGINT signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

export default app;
