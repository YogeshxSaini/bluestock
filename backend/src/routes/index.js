import express from 'express';
import authRoutes from './auth.routes.js';
import companyRoutes from './company.routes.js';

const router = express.Router();

/**
 * Root API endpoint
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Company Registration & Verification API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        verifyEmail: 'GET /api/auth/verify-email',
        verifyMobile: 'POST /api/auth/verify-mobile',
      },
      company: {
        register: 'POST /api/company/register',
        profile: 'GET /api/company/profile',
        update: 'PUT /api/company/profile',
        uploadLogo: 'POST /api/company/upload-logo',
        uploadBanner: 'POST /api/company/upload-banner',
      },
    },
  });
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  const uptime = process.uptime();
  const uptimeFormatted = {
    days: Math.floor(uptime / 86400),
    hours: Math.floor((uptime % 86400) / 3600),
    minutes: Math.floor((uptime % 3600) / 60),
    seconds: Math.floor(uptime % 60),
  };

  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      formatted: `${uptimeFormatted.days}d ${uptimeFormatted.hours}h ${uptimeFormatted.minutes}m ${uptimeFormatted.seconds}s`,
    },
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
    },
    node: process.version,
    env: process.env.NODE_ENV || 'development',
  });
});

/**
 * Mount routes
 */
router.use('/auth', authRoutes);
router.use('/company', companyRoutes);

export default router;
