/**
 * LegalEdge AI - Input Validation Schemas
 * Strict Zod schemas for all API request validation
 */

import { z } from 'zod';

// ==================== COMMON VALIDATORS ====================

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(255, 'Email too long')
  .transform((v) => v.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const sanitizedStringSchema = z
  .string()
  .transform((v) => v.trim())
  .refine((v) => !/<script|javascript:|data:/i.test(v), 'Invalid characters detected');

export const phoneSchema = z
  .string()
  .regex(/^[+]?[0-9]{10,15}$/, 'Invalid phone number format')
  .optional();

export const dateSchema = z
  .string()
  .datetime({ message: 'Invalid date format' })
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'));

// ==================== AUTHENTICATION SCHEMAS ====================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: sanitizedStringSchema.refine((v) => v.length >= 2, 'First name too short'),
  lastName: sanitizedStringSchema.refine((v) => v.length >= 2, 'Last name too short'),
  barCouncilNumber: z
    .string()
    .regex(/^[A-Z]{2}\/\d+\/\d{4}$/, 'Invalid Bar Council number format (e.g., DL/1234/2020)')
    .optional(),
  enrollmentNumber: sanitizedStringSchema.optional(),
  phone: phoneSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ==================== DRAFT FORMATTING SCHEMAS ====================

export const formatDraftSchema = z.object({
  rawText: z
    .string()
    .min(1, 'Text is required')
    .max(500000, 'Text too long (max 500KB)'),
  config: z.object({
    autoCapitalize: z.boolean().default(true),
    doubleSpacing: z.boolean().default(false),
    numbering: z.boolean().default(true),
    legalHeader: z.boolean().default(true),
    alignJustify: z.boolean().default(false),
    courtFormatting: z.boolean().default(true),
  }),
});

// ==================== LEGAL SEARCH SCHEMAS ====================

export const legalActTypeSchema = z.enum([
  'IPC', 'CRPC', 'CPC', 'CONSTITUTION', 'RTI_ACT',
  'EVIDENCE_ACT', 'BNS', 'BNSS', 'DV_ACT',
  'CONSUMER_PROTECTION', 'MOTOR_VEHICLES', 'IT_ACT', 'OTHER'
]);

export const sectionTypeSchema = z.enum(['SUBSTANTIVE', 'PROCEDURAL']);

export const legalSearchSchema = z.object({
  query: sanitizedStringSchema.refine((v) => v.length >= 1, 'Search query required'),
  actType: legalActTypeSchema.optional(),
  sectionType: sectionTypeSchema.optional(),
  category: sanitizedStringSchema.optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// ==================== LEGAL NOTICE SCHEMAS ====================

export const legalNoticeSchema = z.object({
  advocateName: sanitizedStringSchema.min(2, 'Advocate name required'),
  advocateAddress: sanitizedStringSchema.min(5, 'Advocate address required'),
  enrollmentNumber: sanitizedStringSchema.min(3, 'Enrollment number required'),
  senderName: sanitizedStringSchema.min(2, 'Sender name required'),
  senderFatherName: sanitizedStringSchema.min(2, 'Father name required'),
  senderAddress: sanitizedStringSchema.min(5, 'Sender address required'),
  recipientName: sanitizedStringSchema.min(2, 'Recipient name required'),
  recipientAddress: sanitizedStringSchema.min(5, 'Recipient address required'),
  subject: sanitizedStringSchema.min(5, 'Subject required'),
  relevantAct: sanitizedStringSchema.min(2, 'Relevant act required'),
  facts: sanitizedStringSchema.min(20, 'Facts must be detailed'),
  causeOfAction: sanitizedStringSchema.min(10, 'Cause of action required'),
  relevantSections: sanitizedStringSchema.min(2, 'Relevant sections required'),
  reliefSought: sanitizedStringSchema.min(5, 'Relief sought required'),
  demand: sanitizedStringSchema.min(10, 'Demand required'),
  timeLimitDays: z.number().int().min(7).max(90).default(15),
  noticeCost: z.number().min(0).max(1000000).default(5000),
});

// ==================== RTI APPLICATION SCHEMAS ====================

export const rtiApplicationSchema = z.object({
  applicantName: sanitizedStringSchema.min(2, 'Applicant name required'),
  applicantFatherName: sanitizedStringSchema.min(2, 'Father name required'),
  applicantAddress: sanitizedStringSchema.min(5, 'Address required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Valid 10-digit phone required'),
  email: emailSchema.optional(),
  department: sanitizedStringSchema.min(2, 'Department name required'),
  departmentAddress: sanitizedStringSchema.min(5, 'Department address required'),
  informationSought: sanitizedStringSchema.min(20, 'Information details required'),
  period: sanitizedStringSchema.optional(),
  paymentMode: z.enum(['IPO', 'DD', 'CASH', 'ONLINE', 'COURT_FEE_STAMP']),
  isBPL: z.boolean().default(false),
  place: sanitizedStringSchema.min(2, 'Place required'),
  type: z.enum(['APPLICATION', 'FIRST_APPEAL', 'COMPLAINT']),
  originalApplicationDate: dateSchema.optional(),
  groundsOfAppeal: sanitizedStringSchema.optional(),
});

// ==================== BAIL APPLICATION SCHEMAS ====================

export const bailApplicationSchema = z.object({
  applicantName: sanitizedStringSchema.min(2, 'Applicant name required'),
  fatherName: sanitizedStringSchema.min(2, 'Father name required'),
  address: sanitizedStringSchema.min(5, 'Address required'),
  firNumber: sanitizedStringSchema.min(1, 'FIR number required'),
  firDate: dateSchema,
  policeStation: sanitizedStringSchema.min(2, 'Police station required'),
  district: sanitizedStringSchema.min(2, 'District required'),
  state: sanitizedStringSchema.min(2, 'State required'),
  sections: sanitizedStringSchema.min(2, 'Sections required'),
  dateOfArrest: dateSchema,
  custodyDate: dateSchema,
  briefFacts: sanitizedStringSchema.min(20, 'Brief facts required'),
  grounds: z.array(sanitizedStringSchema).min(1, 'At least one ground required'),
  advocateName: sanitizedStringSchema.min(2, 'Advocate name required'),
  enrollmentNumber: sanitizedStringSchema.min(3, 'Enrollment number required'),
  courtName: sanitizedStringSchema.min(2, 'Court name required'),
  courtPlace: sanitizedStringSchema.min(2, 'Court place required'),
  bailSection: z.enum(['437', '438', '439']),
});

// ==================== CASE MANAGEMENT SCHEMAS ====================

export const caseStatusSchema = z.enum([
  'ACTIVE', 'PENDING_HEARING', 'DISPOSED', 'STAYED', 'TRANSFERRED', 'CLOSED'
]);

export const casePrioritySchema = z.enum(['URGENT', 'HIGH', 'MEDIUM', 'LOW']);

export const createCaseSchema = z.object({
  caseNumber: sanitizedStringSchema.min(1, 'Case number required'),
  caseTitle: sanitizedStringSchema.min(5, 'Case title required'),
  courtName: sanitizedStringSchema.min(2, 'Court name required'),
  caseType: sanitizedStringSchema.min(2, 'Case type required'),
  clientName: sanitizedStringSchema.min(2, 'Client name required'),
  oppositionName: sanitizedStringSchema.optional(),
  oppositionAdvocate: sanitizedStringSchema.optional(),
  filingDate: dateSchema.optional(),
  nextHearingDate: dateSchema.optional(),
  priority: casePrioritySchema.default('MEDIUM'),
  notes: sanitizedStringSchema.optional(),
});

export const updateCaseSchema = createCaseSchema.partial().extend({
  status: caseStatusSchema.optional(),
});

// ==================== FILING TRACKER SCHEMAS ====================

export const filingStatusSchema = z.enum(['PENDING', 'UPCOMING', 'OVERDUE', 'FILED', 'CANCELLED']);
export const filingPrioritySchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);

export const createFilingSchema = z.object({
  caseId: uuidSchema.optional(),
  applicationType: sanitizedStringSchema.min(2, 'Application type required'),
  description: sanitizedStringSchema.optional(),
  deadline: dateSchema,
  court: sanitizedStringSchema.optional(),
  notes: sanitizedStringSchema.optional(),
  priority: filingPrioritySchema.default('MEDIUM'),
});

export const updateFilingSchema = z.object({
  applicationType: sanitizedStringSchema.optional(),
  description: sanitizedStringSchema.optional(),
  deadline: dateSchema.optional(),
  court: sanitizedStringSchema.optional(),
  notes: sanitizedStringSchema.optional(),
  status: filingStatusSchema.optional(),
  priority: filingPrioritySchema.optional(),
});

// ==================== JURISDICTION SCHEMAS ====================

export const jurisdictionTypeSchema = z.enum(['POLICE_STATION', 'COURT', 'TRIBUNAL', 'COMMISSION']);

export const jurisdictionSearchSchema = z.object({
  query: sanitizedStringSchema.optional(),
  type: jurisdictionTypeSchema.optional(),
  state: sanitizedStringSchema.optional(),
  district: sanitizedStringSchema.optional(),
  city: sanitizedStringSchema.optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// ==================== PAGINATION SCHEMA ====================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type FormatDraftInput = z.infer<typeof formatDraftSchema>;
export type LegalSearchInput = z.infer<typeof legalSearchSchema>;
export type LegalNoticeInput = z.infer<typeof legalNoticeSchema>;
export type RTIApplicationInput = z.infer<typeof rtiApplicationSchema>;
export type BailApplicationInput = z.infer<typeof bailApplicationSchema>;
export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;
export type CreateFilingInput = z.infer<typeof createFilingSchema>;
export type UpdateFilingInput = z.infer<typeof updateFilingSchema>;
export type JurisdictionSearchInput = z.infer<typeof jurisdictionSearchSchema>;
