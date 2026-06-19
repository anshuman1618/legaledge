/**
 * LegalEdge AI - Government Departments Routes
 * Administrative hierarchy and officer mapping
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { searchRateLimiter } from '../middleware/security.js';
import { optionalAuthenticate } from '../middleware/auth.js';
import type { APIResponse, Department } from '../types/index.js';

const router = Router();
const prisma = new PrismaClient();

// ==================== GET ALL DEPARTMENTS ====================

router.get('/', searchRateLimiter, optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string | undefined;

    const where: Record<string, unknown> = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { ministry: { contains: query, mode: 'insensitive' } },
        { functions: { has: query } },
      ];
    }

    const departments = await prisma.department.findMany({
      where,
      include: {
        officers: {
          orderBy: { rank: 'asc' },
        },
        rtiMatrix: true,
      },
      orderBy: { name: 'asc' },
    });

    const formattedDepartments: Department[] = departments.map((d) => ({
      id: d.id,
      name: d.name,
      ministry: d.ministry,
      functions: d.functions,
      relevantActs: d.relevantActs,
      contactInfo: d.contactInfo || undefined,
      officers: d.officers.map((o) => ({
        id: o.id,
        rank: o.rank,
        designation: o.designation,
        role: o.role,
        powers: o.powers,
        appointedUnder: o.appointedUnder,
      })),
      rtiMatrix: d.rtiMatrix
        ? {
            publicInfoOfficer: d.rtiMatrix.publicInfoOfficer,
            firstAppellateAuthority: d.rtiMatrix.firstAppellateAuthority,
            processingPeriodDays: d.rtiMatrix.processingPeriodDays,
          }
        : undefined,
    }));

    const response: APIResponse<Department[]> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: formattedDepartments,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_DEPARTMENTS_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching departments',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET DEPARTMENT BY ID ====================

router.get('/:id', searchRateLimiter, optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        officers: {
          orderBy: { rank: 'asc' },
        },
        rtiMatrix: true,
      },
    });

    if (!department) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Department not found',
        },
      };
      res.status(404).json(response);
      return;
    }

    const formatted: Department = {
      id: department.id,
      name: department.name,
      ministry: department.ministry,
      functions: department.functions,
      relevantActs: department.relevantActs,
      contactInfo: department.contactInfo || undefined,
      officers: department.officers.map((o) => ({
        id: o.id,
        rank: o.rank,
        designation: o.designation,
        role: o.role,
        powers: o.powers,
        appointedUnder: o.appointedUnder,
      })),
      rtiMatrix: department.rtiMatrix
        ? {
            publicInfoOfficer: department.rtiMatrix.publicInfoOfficer,
            firstAppellateAuthority: department.rtiMatrix.firstAppellateAuthority,
            processingPeriodDays: department.rtiMatrix.processingPeriodDays,
          }
        : undefined,
    };

    const response: APIResponse<Department> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: formatted,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_DEPARTMENT_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching department',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET DEPARTMENT HIERARCHY ====================

router.get('/:id/hierarchy', searchRateLimiter, optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        officers: {
          orderBy: { rank: 'asc' },
        },
        rtiMatrix: true,
      },
    });

    if (!department) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Department not found',
        },
      };
      res.status(404).json(response);
      return;
    }

    const hierarchy = {
      departmentId: department.id,
      departmentName: department.name,
      ministry: department.ministry,
      officers: department.officers.map((o) => ({
        rank: o.rank,
        designation: o.designation,
        role: o.role,
        powers: o.powers,
        appointedUnder: o.appointedUnder,
        reportsTo: o.rank > 1 
          ? department.officers.find((p) => p.rank === o.rank - 1)?.designation || null
          : null,
      })),
      rtiMatrix: department.rtiMatrix
        ? {
            publicInfoOfficer: department.rtiMatrix.publicInfoOfficer,
            firstAppellateAuthority: department.rtiMatrix.firstAppellateAuthority,
            processingPeriodDays: department.rtiMatrix.processingPeriodDays,
          }
        : null,
      relevantActs: department.relevantActs,
      contactInfo: department.contactInfo,
    };

    const response: APIResponse<typeof hierarchy> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: hierarchy,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_HIERARCHY_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching hierarchy',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== SEARCH DEPARTMENTS ====================

router.get('/search/query', searchRateLimiter, async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';

    if (!query.trim()) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Search query is required',
        },
      };
      res.status(400).json(response);
      return;
    }

    const departments = await prisma.department.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { ministry: { contains: query, mode: 'insensitive' } },
          { functions: { hasSome: [query] } },
          { relevantActs: { hasSome: [query] } },
        ],
      },
      include: {
        officers: {
          orderBy: { rank: 'asc' },
          take: 3,
        },
      },
      take: 10,
    });

    const results = departments.map((d) => ({
      id: d.id,
      name: d.name,
      ministry: d.ministry,
      topOfficers: d.officers.map((o) => o.designation),
    }));

    const response: APIResponse<typeof results> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: results,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[SEARCH_DEPARTMENTS_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during search',
      },
    };
    res.status(500).json(response);
  }
});

export default router;
