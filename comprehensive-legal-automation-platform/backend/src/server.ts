/**
 * LegalEdge AI - Main Server Entry Point
 * Enterprise-grade Express server with comprehensive security
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import middleware
import {
  securityHeaders,
  apiRateLimiter,
  securityLogger,
  validateOrigin,
  preventParamPollution,
  sanitizeRequestBody,
  verifyContentType,
  addSecurityHeaders,
} from './middleware/security.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import draftsRoutes from './routes/drafts.routes.js';
import legalRoutes from './routes/legal.routes.js';
import situationsRoutes from './routes/situations.routes.js';
import jurisdictionRoutes from './routes/jurisdiction.routes.js';
import departmentsRoutes from './routes/departments.routes.js';
import casesRoutes from './routes/cases.routes.js';

const app = express();
const PORT = parseInt(process.env.PORT || '4000');

// ==================== SECURITY MIDDLEWARE ====================

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Helmet security headers
app.use(securityHeaders);

// Additional security headers
app.use(addSecurityHeaders);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400, // 24 hours
}));

// Cookie parser
app.use(cookieParser());

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use(validateOrigin);
app.use(preventParamPollution);
app.use(sanitizeRequestBody);
app.use(verifyContentType);
app.use(securityLogger);

// ==================== HEALTH CHECK ====================

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    data: {
      status: 'healthy',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

// ==================== API ROUTES ====================

const API_PREFIX = '/api/v1';

// Authentication routes
app.use(`${API_PREFIX}/auth`, authRoutes);

// Draft formatting and generation routes
app.use(`${API_PREFIX}/drafts`, apiRateLimiter, draftsRoutes);

// Legal database routes
app.use(`${API_PREFIX}/legal`, legalRoutes);

// Situation analyzer routes
app.use(`${API_PREFIX}/situations`, situationsRoutes);

// Jurisdiction mapper routes
app.use(`${API_PREFIX}/jurisdiction`, jurisdictionRoutes);

// Government departments routes
app.use(`${API_PREFIX}/departments`, departmentsRoutes);

// Case management and filing tracker routes
app.use(`${API_PREFIX}/cases`, casesRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found',
    },
  });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[UNHANDLED_ERROR]', err);

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'An internal server error occurred'
    : err.message;

  res.status(500).json({
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
    },
  });
});

// ==================== SERVER STARTUP ====================

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🏛️  LegalEdge AI - Backend Server                            ║
║                                                                ║
║   Server running on port ${PORT}                                 ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(40)}║
║   API Prefix: ${API_PREFIX.padEnd(42)}║
║                                                                ║
║   Endpoints:                                                   ║
║   - POST   /api/v1/auth/login                                  ║
║   - POST   /api/v1/auth/register                               ║
║   - POST   /api/v1/auth/logout                                 ║
║   - POST   /api/v1/drafts/format                               ║
║   - POST   /api/v1/drafts/generate-notice                      ║
║   - POST   /api/v1/drafts/generate-rti                         ║
║   - POST   /api/v1/drafts/generate-bail                        ║
║   - GET    /api/v1/legal/search                                ║
║   - GET    /api/v1/legal/sections/:id                          ║
║   - GET    /api/v1/situations                                  ║
║   - GET    /api/v1/situations/analyze/:id                      ║
║   - GET    /api/v1/jurisdiction/search                         ║
║   - GET    /api/v1/departments                                 ║
║   - GET    /api/v1/cases/dashboard/summary                     ║
║   - CRUD   /api/v1/cases                                       ║
║   - CRUD   /api/v1/cases/filings                               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SERVER] SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('[SERVER] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[SERVER] SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('[SERVER] Server closed');
    process.exit(0);
  });
});

export default app;
