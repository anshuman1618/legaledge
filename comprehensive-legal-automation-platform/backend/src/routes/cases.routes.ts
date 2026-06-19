/**
 * LegalEdge AI - Case Management & Filing Tracker Routes
 * CRUD operations for cases and filing deadlines
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, type AuthenticatedRequest } from '../middleware/auth.js';
import { apiRateLimiter } from '../middleware/security.js';
import { 
  createCaseSchema, 
  updateCaseSchema, 
  createFilingSchema, 
  updateFilingSchema,
  paginationSchema 
} from '../utils/validation.js';
import { encryptData, decryptData } from '../utils/encryption.js';
import type { APIResponse, Case, FilingTracker, DashboardSummary } from '../types/index.js';

const router = Router();
const prisma = new PrismaClient();

// ==================== DASHBOARD SUMMARY ====================

router.get('/dashboard/summary', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.id;
    const now = new Date();

    // Aggregate dashboard data
    const [
      activeCases,
      pendingFilings,
      overdueFilings,
      upcomingHearings,
      totalDrafts,
      recentFilings,
      casesByStatus,
    ] = await Promise.all([
      prisma.case.count({
        where: { userId, status: { in: ['ACTIVE', 'PENDING_HEARING'] } },
      }),
      prisma.filingTracker.count({
        where: { userId, status: 'PENDING' },
      }),
      prisma.filingTracker.count({
        where: { userId, status: 'OVERDUE' },
      }),
      prisma.case.count({
        where: {
          userId,
          nextHearingDate: { gte: now, lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.draft.count({ where: { userId } }),
      prisma.filingTracker.findMany({
        where: { userId, status: { in: ['PENDING', 'UPCOMING'] } },
        orderBy: { deadline: 'asc' },
        take: 5,
        include: { case: { select: { caseTitle: true } } },
      }),
      prisma.case.groupBy({
        by: ['status'],
        where: { userId },
        _count: { id: true },
      }),
    ]);

    // Calculate countdown for filings
    const filingCountdowns = recentFilings.map((f) => {
      const deadline = new Date(f.deadline);
      const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        id: f.id,
        applicationType: f.applicationType,
        caseName: f.case?.caseTitle,
        deadline: f.deadline.toISOString(),
        daysRemaining,
        priority: f.priority as 'HIGH' | 'MEDIUM' | 'LOW',
        status: daysRemaining < 0 ? 'OVERDUE' : daysRemaining <= 3 ? 'UPCOMING' : 'PENDING',
      };
    });

    // Case status breakdown
    const caseStatusBreakdown: Record<string, number> = {};
    casesByStatus.forEach((c) => {
      caseStatusBreakdown[c.status] = c._count.id;
    });

    const summary: DashboardSummary = {
      activeCase: activeCases,
      pendingFilings,
      overdueFilings,
      upcomingHearings,
      totalDrafts,
      recentActivity: [],
      filingCountdowns,
      caseStatusBreakdown,
    };

    const response: APIResponse<DashboardSummary> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: summary,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[DASHBOARD_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching dashboard data',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== CASE CRUD ====================

// Get all cases
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const pagination = paginationSchema.parse(req.query);
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const status = req.query.status as string | undefined;
    const where: Record<string, unknown> = { userId: authReq.user.id };
    if (status) {
      where.status = status;
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        include: {
          hearings: {
            orderBy: { hearingDate: 'desc' },
            take: 3,
          },
          _count: { select: { filingTrackers: true } },
        },
        skip: offset,
        take: limit,
        orderBy: { nextHearingDate: 'asc' },
      }),
      prisma.case.count({ where }),
    ]);

    const formattedCases: Case[] = cases.map((c) => ({
      id: c.id,
      caseNumber: c.caseNumber,
      caseTitle: c.caseTitle,
      courtName: c.courtName,
      caseType: c.caseType,
      clientName: c.clientName,
      oppositionName: c.oppositionName || undefined,
      oppositionAdvocate: c.oppositionAdvocate || undefined,
      filingDate: c.filingDate?.toISOString(),
      nextHearingDate: c.nextHearingDate?.toISOString(),
      lastHearingDate: c.lastHearingDate?.toISOString(),
      status: c.status as Case['status'],
      priority: c.priority as Case['priority'],
      stage: c.stage || undefined,
      notes: c.notes || undefined,
      hearings: c.hearings.map((h) => ({
        id: h.id,
        hearingDate: h.hearingDate.toISOString(),
        bench: h.bench || undefined,
        purpose: h.purpose || undefined,
        outcome: h.outcome || undefined,
        nextSteps: h.nextSteps || undefined,
        orderPassed: h.orderPassed || undefined,
      })),
    }));

    const response: APIResponse<Case[]> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: formattedCases,
      meta: { page, limit, total, hasMore: offset + cases.length < total },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_CASES_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching cases',
      },
    };
    res.status(500).json(response);
  }
});

// Create case
router.post('/', authenticate, apiRateLimiter, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const validation = createCaseSchema.safeParse(req.body);

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

    const data = validation.data;

    // Encrypt sensitive client data
    const clientEncrypted = encryptData(JSON.stringify({
      clientName: data.clientName,
      additionalDetails: req.body.clientDetails || null,
    }));

    const caseRecord = await prisma.case.create({
      data: {
        userId: authReq.user.id,
        caseNumber: data.caseNumber,
        caseTitle: data.caseTitle,
        courtName: data.courtName,
        caseType: data.caseType,
        clientName: data.clientName,
        clientEncrypted,
        oppositionName: data.oppositionName,
        oppositionAdvocate: data.oppositionAdvocate,
        filingDate: data.filingDate ? new Date(data.filingDate) : null,
        nextHearingDate: data.nextHearingDate ? new Date(data.nextHearingDate) : null,
        priority: data.priority,
        notes: data.notes,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authReq.user.id,
        action: 'CREATE',
        resourceType: 'case',
        resourceId: caseRecord.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    const response: APIResponse<{ id: string; message: string }> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: { id: caseRecord.id, message: 'Case created successfully' },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('[CREATE_CASE_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while creating the case',
      },
    };
    res.status(500).json(response);
  }
});

// Get single case
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;

    const caseRecord = await prisma.case.findFirst({
      where: { id, userId: authReq.user.id },
      include: {
        hearings: { orderBy: { hearingDate: 'desc' } },
        filingTrackers: { orderBy: { deadline: 'asc' } },
      },
    });

    if (!caseRecord) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Case not found',
        },
      };
      res.status(404).json(response);
      return;
    }

    // Decrypt sensitive data if needed
    let decryptedClientData = null;
    if (caseRecord.clientEncrypted) {
      try {
        decryptedClientData = JSON.parse(decryptData(caseRecord.clientEncrypted));
      } catch {
        // Decryption failed, use stored client name
      }
    }

    const response: APIResponse<typeof caseRecord & { decryptedClientData: typeof decryptedClientData }> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: { ...caseRecord, decryptedClientData },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_CASE_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching the case',
      },
    };
    res.status(500).json(response);
  }
});

// Update case
router.put('/:id', authenticate, apiRateLimiter, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const validation = updateCaseSchema.safeParse(req.body);

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

    // Verify ownership
    const existing = await prisma.case.findFirst({
      where: { id, userId: authReq.user.id },
    });

    if (!existing) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Case not found',
        },
      };
      res.status(404).json(response);
      return;
    }

    const data = validation.data;
    const updated = await prisma.case.update({
      where: { id },
      data: {
        ...data,
        filingDate: data.filingDate ? new Date(data.filingDate) : undefined,
        nextHearingDate: data.nextHearingDate ? new Date(data.nextHearingDate) : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authReq.user.id,
        action: 'UPDATE',
        resourceType: 'case',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { changes: Object.keys(data) },
      },
    });

    const response: APIResponse<{ id: string; message: string }> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: { id: updated.id, message: 'Case updated successfully' },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[UPDATE_CASE_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while updating the case',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== FILING TRACKER CRUD ====================

// Get all filings
router.get('/filings/all', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const now = new Date();

    const filings = await prisma.filingTracker.findMany({
      where: { userId: authReq.user.id },
      include: { case: { select: { caseTitle: true, caseNumber: true } } },
      orderBy: { deadline: 'asc' },
    });

    const formattedFilings: FilingTracker[] = filings.map((f) => {
      const deadline = new Date(f.deadline);
      const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: f.id,
        caseId: f.caseId || undefined,
        caseName: f.case?.caseTitle,
        applicationType: f.applicationType,
        description: f.description || undefined,
        deadline: f.deadline.toISOString(),
        court: f.court || undefined,
        notes: f.notes || undefined,
        status: f.status as FilingTracker['status'],
        priority: f.priority as FilingTracker['priority'],
        daysRemaining,
        filedAt: f.filedAt?.toISOString(),
      };
    });

    const response: APIResponse<FilingTracker[]> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: formattedFilings,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_FILINGS_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching filings',
      },
    };
    res.status(500).json(response);
  }
});

// Create filing
router.post('/filings', authenticate, apiRateLimiter, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const validation = createFilingSchema.safeParse(req.body);

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

    const data = validation.data;

    // Verify case ownership if caseId provided
    if (data.caseId) {
      const caseExists = await prisma.case.findFirst({
        where: { id: data.caseId, userId: authReq.user.id },
      });
      if (!caseExists) {
        const response: APIResponse<null> = {
          success: false,
          timestamp: new Date().toISOString(),
          data: null,
          error: {
            code: 'NOT_FOUND',
            message: 'Case not found',
          },
        };
        res.status(404).json(response);
        return;
      }
    }

    const filing = await prisma.filingTracker.create({
      data: {
        userId: authReq.user.id,
        caseId: data.caseId,
        applicationType: data.applicationType,
        description: data.description,
        deadline: new Date(data.deadline),
        court: data.court,
        notes: data.notes,
        priority: data.priority,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authReq.user.id,
        action: 'CREATE',
        resourceType: 'filing',
        resourceId: filing.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    const response: APIResponse<{ id: string; message: string }> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: { id: filing.id, message: 'Filing tracker created successfully' },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('[CREATE_FILING_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while creating the filing',
      },
    };
    res.status(500).json(response);
  }
});

// Update filing
router.put('/filings/:id', authenticate, apiRateLimiter, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const validation = updateFilingSchema.safeParse(req.body);

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

    const existing = await prisma.filingTracker.findFirst({
      where: { id, userId: authReq.user.id },
    });

    if (!existing) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Filing not found',
        },
      };
      res.status(404).json(response);
      return;
    }

    const data = validation.data;
    const updateData: Record<string, unknown> = { ...data };
    
    if (data.deadline) {
      updateData.deadline = new Date(data.deadline);
    }
    
    if (data.status === 'FILED') {
      updateData.filedAt = new Date();
    }

    await prisma.filingTracker.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId: authReq.user.id,
        action: 'UPDATE',
        resourceType: 'filing',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    const response: APIResponse<{ message: string }> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: { message: 'Filing updated successfully' },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[UPDATE_FILING_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while updating the filing',
      },
    };
    res.status(500).json(response);
  }
});

// Delete filing
router.delete('/filings/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;

    const existing = await prisma.filingTracker.findFirst({
      where: { id, userId: authReq.user.id },
    });

    if (!existing) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Filing not found',
        },
      };
      res.status(404).json(response);
      return;
    }

    await prisma.filingTracker.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: authReq.user.id,
        action: 'DELETE',
        resourceType: 'filing',
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    const response: APIResponse<{ message: string }> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: { message: 'Filing deleted successfully' },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[DELETE_FILING_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while deleting the filing',
      },
    };
    res.status(500).json(response);
  }
});

export default router;
