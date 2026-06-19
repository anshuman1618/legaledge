/**
 * LegalEdge AI - Situation Analyzer Routes
 * Real-time legal situation mapping
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { searchRateLimiter } from '../middleware/security.js';
import { optionalAuthenticate } from '../middleware/auth.js';
import type { APIResponse, Situation } from '../types/index.js';

const router = Router();
const prisma = new PrismaClient();

// ==================== GET ALL SITUATIONS ====================

router.get('/', searchRateLimiter, optionalAuthenticate, async (_req: Request, res: Response) => {
  try {
    const situations = await prisma.situation.findMany({
      include: {
        sectionMappings: {
          include: {
            section: {
              select: {
                id: true,
                actType: true,
                sectionNumber: true,
                title: true,
                description: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formattedSituations: Situation[] = situations.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      icon: s.icon,
      substantiveSections: s.sectionMappings
        .filter((m) => m.sectionType === 'SUBSTANTIVE')
        .map((m) => ({
          sectionId: m.section.id,
          code: `${m.section.actType} ${m.section.sectionNumber}`,
          act: m.section.actType,
          description: m.description || m.section.title,
        })),
      proceduralSections: s.sectionMappings
        .filter((m) => m.sectionType === 'PROCEDURAL')
        .map((m) => ({
          sectionId: m.section.id,
          code: `${m.section.actType} ${m.section.sectionNumber}`,
          act: m.section.actType,
          description: m.description || m.section.title,
        })),
      competentAuthorities: s.competentAuthorities,
      futureApplications: s.futureApplications as Situation['futureApplications'],
      recommendedDrafts: s.recommendedDrafts,
    }));

    const response: APIResponse<Situation[]> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: formattedSituations,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_SITUATIONS_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching situations',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET SITUATION BY ID ====================

router.get('/analyze/:id', searchRateLimiter, optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const situation = await prisma.situation.findFirst({
      where: {
        OR: [
          { id },
          { name: { contains: id, mode: 'insensitive' } },
        ],
      },
      include: {
        sectionMappings: {
          include: {
            section: {
              include: {
                caseLaws: {
                  take: 2,
                  orderBy: { year: 'desc' },
                },
              },
            },
          },
        },
      },
    });

    if (!situation) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Situation not found',
        },
      };
      res.status(404).json(response);
      return;
    }

    const formattedSituation: Situation = {
      id: situation.id,
      name: situation.name,
      description: situation.description,
      icon: situation.icon,
      substantiveSections: situation.sectionMappings
        .filter((m) => m.sectionType === 'SUBSTANTIVE')
        .map((m) => ({
          sectionId: m.section.id,
          code: `${m.section.actType} ${m.section.sectionNumber}`,
          act: m.section.actType,
          description: m.description || m.section.title,
        })),
      proceduralSections: situation.sectionMappings
        .filter((m) => m.sectionType === 'PROCEDURAL')
        .map((m) => ({
          sectionId: m.section.id,
          code: `${m.section.actType} ${m.section.sectionNumber}`,
          act: m.section.actType,
          description: m.description || m.section.title,
        })),
      competentAuthorities: situation.competentAuthorities,
      futureApplications: situation.futureApplications as Situation['futureApplications'],
      recommendedDrafts: situation.recommendedDrafts,
    };

    const response: APIResponse<Situation> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: formattedSituation,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[ANALYZE_SITUATION_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while analyzing the situation',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== SEARCH SITUATIONS ====================

router.get('/search', searchRateLimiter, optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const query = (req.query.query as string) || '';

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

    const situations = await prisma.situation.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        sectionMappings: {
          include: {
            section: {
              select: {
                actType: true,
                sectionNumber: true,
                title: true,
              },
            },
          },
        },
      },
    });

    const formattedSituations: Situation[] = situations.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      icon: s.icon,
      substantiveSections: s.sectionMappings
        .filter((m) => m.sectionType === 'SUBSTANTIVE')
        .map((m) => ({
          code: `${m.section.actType} ${m.section.sectionNumber}`,
          act: m.section.actType,
          description: m.description || m.section.title,
        })),
      proceduralSections: s.sectionMappings
        .filter((m) => m.sectionType === 'PROCEDURAL')
        .map((m) => ({
          code: `${m.section.actType} ${m.section.sectionNumber}`,
          act: m.section.actType,
          description: m.description || m.section.title,
        })),
      competentAuthorities: s.competentAuthorities,
      futureApplications: s.futureApplications as Situation['futureApplications'],
      recommendedDrafts: s.recommendedDrafts,
    }));

    const response: APIResponse<Situation[]> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: formattedSituations,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[SEARCH_SITUATIONS_ERROR]', error);
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
