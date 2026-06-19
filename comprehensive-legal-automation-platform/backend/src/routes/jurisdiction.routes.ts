/**
 * LegalEdge AI - Jurisdiction Routes
 * Police stations, courts, and tribunals mapping
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { searchRateLimiter } from '../middleware/security.js';
import { optionalAuthenticate } from '../middleware/auth.js';
import { jurisdictionSearchSchema } from '../utils/validation.js';
import type { APIResponse, Jurisdiction } from '../types/index.js';

const router = Router();
const prisma = new PrismaClient();

// ==================== SEARCH JURISDICTIONS ====================

router.get('/search', searchRateLimiter, optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const validation = jurisdictionSearchSchema.safeParse({
      query: req.query.query,
      type: req.query.type,
      state: req.query.state,
      district: req.query.district,
      city: req.query.city,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
    });

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

    const { query, type, state, district, city, limit, offset } = validation.data;

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { jurisdictionArea: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        { state: { contains: query, mode: 'insensitive' } },
        { district: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (state) {
      where.state = { contains: state, mode: 'insensitive' };
    }

    if (district) {
      where.district = { contains: district, mode: 'insensitive' };
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    const [jurisdictions, total] = await Promise.all([
      prisma.jurisdiction.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: [
          { type: 'asc' },
          { name: 'asc' },
        ],
      }),
      prisma.jurisdiction.count({ where }),
    ]);

    const formattedJurisdictions: Jurisdiction[] = jurisdictions.map((j) => ({
      id: j.id,
      type: j.type as Jurisdiction['type'],
      name: j.name,
      address: j.address,
      jurisdictionArea: j.jurisdictionArea,
      competentMatters: j.competentMatters,
      state: j.state,
      district: j.district,
      city: j.city || undefined,
      contactPhone: j.contactPhone || undefined,
      contactEmail: j.contactEmail || undefined,
      coordinates: j.latitude && j.longitude 
        ? { latitude: j.latitude, longitude: j.longitude }
        : undefined,
    }));

    const response: APIResponse<Jurisdiction[]> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: formattedJurisdictions,
      meta: {
        limit,
        total,
        hasMore: offset + jurisdictions.length < total,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[JURISDICTION_SEARCH_ERROR]', error);
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

// ==================== GET JURISDICTION BY ID ====================

router.get('/:id', searchRateLimiter, optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const jurisdiction = await prisma.jurisdiction.findUnique({
      where: { id },
    });

    if (!jurisdiction) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Jurisdiction not found',
        },
      };
      res.status(404).json(response);
      return;
    }

    const formatted: Jurisdiction = {
      id: jurisdiction.id,
      type: jurisdiction.type as Jurisdiction['type'],
      name: jurisdiction.name,
      address: jurisdiction.address,
      jurisdictionArea: jurisdiction.jurisdictionArea,
      competentMatters: jurisdiction.competentMatters,
      state: jurisdiction.state,
      district: jurisdiction.district,
      city: jurisdiction.city || undefined,
      contactPhone: jurisdiction.contactPhone || undefined,
      contactEmail: jurisdiction.contactEmail || undefined,
      coordinates: jurisdiction.latitude && jurisdiction.longitude 
        ? { latitude: jurisdiction.latitude, longitude: jurisdiction.longitude }
        : undefined,
    };

    const response: APIResponse<Jurisdiction> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: formatted,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_JURISDICTION_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching jurisdiction',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET STATES ====================

router.get('/meta/states', searchRateLimiter, async (_req: Request, res: Response) => {
  try {
    const states = await prisma.jurisdiction.groupBy({
      by: ['state'],
      where: { isActive: true },
      _count: { id: true },
      orderBy: { state: 'asc' },
    });

    const stateList = states.map((s) => ({
      name: s.state,
      count: s._count.id,
    }));

    const response: APIResponse<typeof stateList> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: stateList,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_STATES_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching states',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET DISTRICTS BY STATE ====================

router.get('/meta/districts/:state', searchRateLimiter, async (req: Request, res: Response) => {
  try {
    const { state } = req.params;

    const districts = await prisma.jurisdiction.groupBy({
      by: ['district'],
      where: {
        isActive: true,
        state: { contains: state, mode: 'insensitive' },
      },
      _count: { id: true },
      orderBy: { district: 'asc' },
    });

    const districtList = districts.map((d) => ({
      name: d.district,
      count: d._count.id,
    }));

    const response: APIResponse<typeof districtList> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: districtList,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_DISTRICTS_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching districts',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET TYPE STATISTICS ====================

router.get('/meta/types', searchRateLimiter, async (_req: Request, res: Response) => {
  try {
    const types = await prisma.jurisdiction.groupBy({
      by: ['type'],
      where: { isActive: true },
      _count: { id: true },
    });

    const typeStats = types.map((t) => ({
      type: t.type,
      count: t._count.id,
    }));

    const response: APIResponse<typeof typeStats> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: typeStats,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_TYPE_STATS_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching type statistics',
      },
    };
    res.status(500).json(response);
  }
});

export default router;
