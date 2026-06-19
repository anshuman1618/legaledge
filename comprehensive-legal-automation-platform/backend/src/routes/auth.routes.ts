/**
 * LegalEdge AI - Authentication Routes
 * Secure login, logout, registration, and session management
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  authenticate,
  type AuthenticatedRequest,
} from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/security.js';
import { loginSchema, registerSchema } from '../utils/validation.js';
import type { APIResponse, LoginResponse, AuthenticatedUser } from '../types/index.js';

const router = Router();
const prisma = new PrismaClient();

// ==================== LOGIN ====================

router.post('/login', authRateLimiter, async (req: Request, res: Response) => {
  try {
    // Validate input
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors[0]?.message || 'Invalid input',
        },
      };
      res.status(400).json(response);
      return;
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Log failed attempt
      await prisma.auditLog.create({
        data: {
          action: 'FAILED_LOGIN',
          resourceType: 'auth',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          metadata: { email, reason: 'user_not_found' },
        },
      });

      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      };
      res.status(401).json(response);
      return;
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'ACCOUNT_LOCKED',
          message: 'Account is temporarily locked. Please try again later.',
        },
      };
      res.status(423).json(response);
      return;
    }

    // Verify password
    const isValidPassword = await argon2.verify(user.passwordHash, password);

    if (!isValidPassword) {
      // Increment failed attempts
      const failedAttempts = user.failedLoginAttempts + 1;
      const updateData: { failedLoginAttempts: number; lockedUntil?: Date } = {
        failedLoginAttempts: failedAttempts,
      };

      // Lock account after 5 failed attempts
      if (failedAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'FAILED_LOGIN',
          resourceType: 'auth',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          metadata: { reason: 'invalid_password', attempts: failedAttempts },
        },
      });

      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      };
      res.status(401).json(response);
      return;
    }

    // Check account status
    if (user.status !== 'ACTIVE') {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Account is not active. Please contact support.',
        },
      };
      res.status(403).json(response);
      return;
    }

    // Create session
    const sessionId = uuidv4();
    const refreshToken = generateRefreshToken({ userId: user.id, sessionId });
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    });

    // Store session
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        refreshToken,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Reset failed attempts and update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: req.ip,
      },
    });

    // Log successful login
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        resourceType: 'auth',
        resourceId: sessionId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    // Set secure cookies
    setAuthCookies(res, accessToken, refreshToken);

    const authUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      barCouncilNumber: user.barCouncilNumber || undefined,
      enrollmentNumber: user.enrollmentNumber || undefined,
    };

    const response: APIResponse<LoginResponse> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        user: authUser,
        accessToken,
        expiresIn: 900, // 15 minutes in seconds
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during login',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== REGISTER ====================

router.post('/register', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors[0]?.message || 'Invalid input',
        },
      };
      res.status(400).json(response);
      return;
    }

    const { email, password, firstName, lastName, barCouncilNumber, enrollmentNumber, phone } = validation.data;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          barCouncilNumber ? { barCouncilNumber } : {},
        ],
      },
    });

    if (existingUser) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'USER_EXISTS',
          message: existingUser.email === email 
            ? 'Email already registered' 
            : 'Bar Council number already registered',
        },
      };
      res.status(409).json(response);
      return;
    }

    // Hash password with Argon2id
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        barCouncilNumber,
        enrollmentNumber,
        phone,
        status: 'PENDING_VERIFICATION',
      },
    });

    // Log registration
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREATE',
        resourceType: 'user',
        resourceId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    const response: APIResponse<{ message: string }> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        message: 'Registration successful. Please verify your email to activate your account.',
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during registration',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== LOGOUT ====================

router.post('/logout', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;

    // Revoke session
    await prisma.session.update({
      where: { id: authReq.sessionId },
      data: { revokedAt: new Date() },
    });

    // Log logout
    await prisma.auditLog.create({
      data: {
        userId: authReq.user.id,
        action: 'LOGOUT',
        resourceType: 'auth',
        resourceId: authReq.sessionId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    // Clear cookies
    clearAuthCookies(res);

    const response: APIResponse<{ message: string }> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: { message: 'Logged out successfully' },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[LOGOUT_ERROR]', error);
    clearAuthCookies(res);
    
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during logout',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== REFRESH TOKEN ====================

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NO_REFRESH_TOKEN',
          message: 'Refresh token required',
        },
      };
      res.status(401).json(response);
      return;
    }

    // Find session by refresh token
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      clearAuthCookies(res);
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid or expired refresh token',
        },
      };
      res.status(401).json(response);
      return;
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      sessionId: session.id,
    });

    // Set new access token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    const response: APIResponse<{ accessToken: string; expiresIn: number }> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        accessToken: newAccessToken,
        expiresIn: 900,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[REFRESH_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during token refresh',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET CURRENT USER ====================

router.get('/me', authenticate, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  
  const response: APIResponse<AuthenticatedUser> = {
    success: true,
    timestamp: new Date().toISOString(),
    data: authReq.user,
  };

  res.status(200).json(response);
});

export default router;
