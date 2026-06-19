/**
 * LegalEdge AI - Authentication Middleware
 * JWT validation with HttpOnly cookie support
 */

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import type { AuthTokenPayload, UserRole, AuthenticatedUser } from '../types/index.js';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  sessionId: string;
}

// ==================== JWT TOKEN FUNCTIONS ====================

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload: {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
}): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
    },
    secret,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
      issuer: 'legaledge-api',
      audience: 'legaledge-client',
    }
  );
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(payload: {
  userId: string;
  sessionId: string;
}): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  return jwt.sign(
    {
      userId: payload.userId,
      sessionId: payload.sessionId,
      tokenVersion: 1,
    },
    secret,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
      issuer: 'legaledge-api',
      audience: 'legaledge-client',
    }
  );
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): AuthTokenPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.verify(token, secret, {
    issuer: 'legaledge-api',
    audience: 'legaledge-client',
  }) as AuthTokenPayload;
}

/**
 * Set secure cookies for tokens
 */
export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  const isProduction = process.env.NODE_ENV === 'production';
  const domain = process.env.COOKIE_DOMAIN || 'localhost';

  // Access token cookie - short expiry
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction || process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict',
    domain: isProduction ? domain : undefined,
    path: '/',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token cookie - longer expiry
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction || process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict',
    domain: isProduction ? domain : undefined,
    path: '/api/v1/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

/**
 * Clear auth cookies
 */
export function clearAuthCookies(res: Response): void {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
}

// ==================== AUTHENTICATION MIDDLEWARE ====================

/**
 * Main authentication middleware
 * Validates JWT from HttpOnly cookie or Authorization header
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from cookie or header
    let token = req.cookies?.accessToken;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    // Verify token
    const payload = verifyAccessToken(token);

    // Check if session is still valid
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      res.status(401).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'SESSION_INVALID',
          message: 'Session expired or revoked',
        },
      });
      return;
    }

    // Check user status
    if (session.user.status !== 'ACTIVE') {
      res.status(403).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Account is not active',
        },
      });
      return;
    }

    // Attach user to request
    (req as AuthenticatedRequest).user = {
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      role: session.user.role as UserRole,
      status: session.user.status as 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION',
      barCouncilNumber: session.user.barCouncilNumber || undefined,
      enrollmentNumber: session.user.enrollmentNumber || undefined,
    };
    (req as AuthenticatedRequest).sessionId = session.id;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Access token expired',
        },
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'TOKEN_INVALID',
          message: 'Invalid access token',
        },
      });
      return;
    }

    console.error('[AUTH_ERROR]', error);
    res.status(500).json({
      success: false,
      timestamp: new Date().toISOString(),
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication error',
      },
    });
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export async function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.accessToken || 
    req.headers.authorization?.substring(7);

  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (session && !session.revokedAt && session.expiresAt > new Date()) {
      (req as AuthenticatedRequest).user = {
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        role: session.user.role as UserRole,
        status: session.user.status as 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION',
        barCouncilNumber: session.user.barCouncilNumber || undefined,
        enrollmentNumber: session.user.enrollmentNumber || undefined,
      };
      (req as AuthenticatedRequest).sessionId = session.id;
    }
  } catch {
    // Ignore token errors for optional auth
  }

  next();
}

// ==================== AUTHORIZATION MIDDLEWARE ====================

/**
 * Role-based access control middleware
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      res.status(401).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      });
      return;
    }

    next();
  };
}

/**
 * Resource ownership validation
 * Ensures the authenticated user owns the requested resource
 */
export function validateOwnership(resourceUserIdField: string = 'userId') {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = (req as AuthenticatedRequest).user;
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

    if (!user) {
      res.status(401).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    // Admins can access any resource
    if (user.role === 'ADMIN') {
      next();
      return;
    }

    // Validate ownership
    if (resourceUserId && resourceUserId !== user.id) {
      res.status(403).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied to this resource',
        },
      });
      return;
    }

    next();
  };
}
