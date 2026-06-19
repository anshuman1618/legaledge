/**
 * LegalEdge AI - Legal Database Routes
 * Statutory sections, case laws, and ingredients analysis
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { searchRateLimiter } from '../middleware/security.js';
import { optionalAuthenticate } from '../middleware/auth.js';
import { legalSearchSchema } from '../utils/validation.js';
import type { APIResponse, LegalSection, SectionIngredients, LegalSearchResponse } from '../types/index.js';

const router = Router();
const prisma = new PrismaClient();

// ==================== SEARCH LEGAL SECTIONS ====================

router.get('/search', searchRateLimiter, optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const validation = legalSearchSchema.safeParse({
      query: req.query.query,
      actType: req.query.actType,
      sectionType: req.query.sectionType,
      category: req.query.category,
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

    const { query, actType, sectionType, category, limit, offset } = validation.data;

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
      OR: [
        { sectionNumber: { contains: query, mode: 'insensitive' } },
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (actType) {
      where.actType = actType;
    }

    if (sectionType) {
      where.sectionType = sectionType;
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    const [sections, total] = await Promise.all([
      prisma.legalSection.findMany({
        where,
        include: {
          caseLaws: {
            take: 5,
            orderBy: { year: 'desc' },
          },
        },
        skip: offset,
        take: limit,
        orderBy: [
          { actType: 'asc' },
          { sectionNumber: 'asc' },
        ],
      }),
      prisma.legalSection.count({ where }),
    ]);

    // Transform to API format
    const formattedSections: LegalSection[] = sections.map((s) => ({
      id: s.id,
      actType: s.actType as LegalSection['actType'],
      sectionNumber: s.sectionNumber,
      title: s.title,
      description: s.description,
      ingredients: s.ingredients as string[],
      punishment: s.punishment || undefined,
      sectionType: s.sectionType as LegalSection['sectionType'],
      category: s.category,
      relatedSections: s.relatedSections,
      caseLaws: s.caseLaws.map((cl) => ({
        id: cl.id,
        caseName: cl.caseName,
        citation: cl.citation,
        year: cl.year,
        court: cl.court,
        summary: cl.summary,
        ratio: cl.ratio || undefined,
        relevance: cl.relevance || undefined,
      })),
    }));

    const response: APIResponse<LegalSearchResponse> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        sections: formattedSections,
        total,
        query,
      },
      meta: {
        limit,
        total,
        hasMore: offset + sections.length < total,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[LEGAL_SEARCH_ERROR]', error);
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

// ==================== GET SECTION DETAILS ====================

router.get('/sections/:id', searchRateLimiter, optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const section = await prisma.legalSection.findUnique({
      where: { id },
      include: {
        caseLaws: {
          orderBy: { year: 'desc' },
        },
      },
    });

    if (!section) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Section not found',
        },
      };
      res.status(404).json(response);
      return;
    }

    const formattedSection: LegalSection = {
      id: section.id,
      actType: section.actType as LegalSection['actType'],
      sectionNumber: section.sectionNumber,
      title: section.title,
      description: section.description,
      ingredients: section.ingredients as string[],
      punishment: section.punishment || undefined,
      sectionType: section.sectionType as LegalSection['sectionType'],
      category: section.category,
      relatedSections: section.relatedSections,
      caseLaws: section.caseLaws.map((cl) => ({
        id: cl.id,
        caseName: cl.caseName,
        citation: cl.citation,
        year: cl.year,
        court: cl.court,
        summary: cl.summary,
        ratio: cl.ratio || undefined,
        relevance: cl.relevance || undefined,
      })),
    };

    const response: APIResponse<LegalSection> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: formattedSection,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_SECTION_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching section details',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET SECTION INGREDIENTS ====================

router.get('/analyzer/ingredients/:id', searchRateLimiter, optionalAuthenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by section number
    let section = await prisma.legalSection.findUnique({
      where: { id },
      include: {
        caseLaws: {
          take: 3,
          orderBy: { year: 'desc' },
        },
      },
    });

    // If not found by ID, try by section number
    if (!section) {
      section = await prisma.legalSection.findFirst({
        where: {
          sectionNumber: { contains: id, mode: 'insensitive' },
          isActive: true,
        },
        include: {
          caseLaws: {
            take: 3,
            orderBy: { year: 'desc' },
          },
        },
      });
    }

    if (!section) {
      const response: APIResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Section not found',
        },
      };
      res.status(404).json(response);
      return;
    }

    const ingredients = (section.ingredients as string[]).map((text, index) => ({
      id: `${section.id}-ing-${index}`,
      index,
      text,
      isEssential: true,
    }));

    const result: SectionIngredients = {
      sectionId: section.id,
      sectionNumber: section.sectionNumber,
      title: section.title,
      actType: section.actType as SectionIngredients['actType'],
      ingredients,
      punishment: section.punishment || undefined,
      relatedSections: section.relatedSections,
      caseLaws: section.caseLaws.map((cl) => ({
        id: cl.id,
        caseName: cl.caseName,
        citation: cl.citation,
        year: cl.year,
        court: cl.court,
        summary: cl.summary,
        ratio: cl.ratio || undefined,
        relevance: cl.relevance || undefined,
      })),
    };

    const response: APIResponse<SectionIngredients> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_INGREDIENTS_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching ingredients',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET ACT TYPES ====================

router.get('/acts', searchRateLimiter, async (_req: Request, res: Response) => {
  try {
    const acts = await prisma.legalSection.groupBy({
      by: ['actType'],
      where: { isActive: true },
      _count: { id: true },
    });

    const actInfo = acts.map((a) => ({
      type: a.actType,
      count: a._count.id,
    }));

    const response: APIResponse<typeof actInfo> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: actInfo,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_ACTS_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching act types',
      },
    };
    res.status(500).json(response);
  }
});

// ==================== GET CATEGORIES ====================

router.get('/categories', searchRateLimiter, async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.legalSection.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { id: true },
      orderBy: { category: 'asc' },
    });

    const categoryInfo = categories.map((c) => ({
      name: c.category,
      count: c._count.id,
    }));

    const response: APIResponse<typeof categoryInfo> = {
      success: true,
      timestamp: new Date().toISOString(),
      data: categoryInfo,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[GET_CATEGORIES_ERROR]', error);
    const response: APIResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      data: null,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching categories',
      },
    };
    res.status(500).json(response);
  }
});

export default router;
