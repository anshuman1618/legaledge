/**
 * LegalEdge AI - Security Middleware
 * Comprehensive security measures for API protection
 */

import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// ==================== RATE LIMITING ====================

/**
 * General API rate limiter - 60 requests per minute
 */
export const apiRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '60'),
  message: {
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use user ID if authenticated, otherwise IP
    const userId = (req as AuthenticatedRequest).user?.id;
    return userId || req.ip || 'anonymous';
  },
});

/**
 * Strict rate limiter for authentication endpoints - 5 requests per minute
 */
export const authRateLimiter = rateLimit({
  windowMs: 60000,
  max: 5,
  message: {
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for search/database lookup endpoints - 30 requests per minute
 */
export const searchRateLimiter = rateLimit({
  windowMs: 60000,
  max: 30,
  message: {
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      code: 'SEARCH_RATE_LIMIT_EXCEEDED',
      message: 'Too many search requests, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== HELMET SECURITY HEADERS ====================

/**
 * Strict Content Security Policy configuration
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for legal documents
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

// ==================== CUSTOM SECURITY MIDDLEWARE ====================

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    sessionId: string;
  };
}

/**
 * Validate request origin
 */
export function validateOrigin(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');

  if (process.env.NODE_ENV === 'production' && origin) {
    const isAllowed = allowedOrigins.some((allowed) =>
      origin.startsWith(allowed.trim())
    );
    if (!isAllowed) {
      res.status(403).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'FORBIDDEN_ORIGIN',
          message: 'Request origin not allowed',
        },
      });
      return;
    }
  }

  next();
}

/**
 * Log security events
 */
export function securityLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as AuthenticatedRequest).user?.id,
    };

    // Log failed auth attempts
    if (res.statusCode === 401 || res.statusCode === 403) {
      console.warn('[SECURITY]', JSON.stringify(logEntry));
    } else if (process.env.NODE_ENV === 'development') {
      console.log('[REQUEST]', JSON.stringify(logEntry));
    }
  });

  next();
}

/**
 * Prevent parameter pollution
 */
export function preventParamPollution(req: Request, res: Response, next: NextFunction): void {
  // Convert array params to single values (take last)
  for (const key in req.query) {
    if (Array.isArray(req.query[key])) {
      const arr = req.query[key] as string[];
      req.query[key] = arr[arr.length - 1];
    }
  }
  next();
}

/**
 * Sanitize request body - remove potential XSS vectors
 */
export function sanitizeRequestBody(req: Request, res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  next();
}

function sanitizeObject(obj: Record<string, unknown>): void {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Remove potential script injections
      obj[key] = (obj[key] as string)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key] as Record<string, unknown>);
    }
  }
}

/**
 * Verify request content type
 */
export function verifyContentType(req: Request, res: Response, next: NextFunction): void {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType?.includes('application/json')) {
      res.status(415).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'UNSUPPORTED_MEDIA_TYPE',
          message: 'Content-Type must be application/json',
        },
      });
      return;
    }
  }
  next();
}

/**
 * Add security response headers
 */
export function addSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  
  next();
}
