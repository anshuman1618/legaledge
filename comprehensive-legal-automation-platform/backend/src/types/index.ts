/**
 * LegalEdge AI - Core Type Definitions
 * Enterprise-grade type safety for all API interactions
 */

// ==================== API RESPONSE TYPES ====================

export interface APIResponse<T> {
  success: boolean;
  timestamp: string;
  data: T;
  error?: APIError;
  meta?: APIMeta;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface APIMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}

// ==================== AUTHENTICATION TYPES ====================

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  tokenVersion: number;
  iat: number;
  exp: number;
}

export type UserRole = 'ADVOCATE' | 'SENIOR_ADVOCATE' | 'PARALEGAL' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  barCouncilNumber?: string;
  enrollmentNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  accessToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  barCouncilNumber?: string;
  enrollmentNumber?: string;
  phone?: string;
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardSummary {
  activeCase: number;
  pendingFilings: number;
  overdueFilings: number;
  upcomingHearings: number;
  totalDrafts: number;
  recentActivity: ActivityItem[];
  filingCountdowns: FilingCountdown[];
  caseStatusBreakdown: Record<string, number>;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  resourceId?: string;
}

export interface FilingCountdown {
  id: string;
  applicationType: string;
  caseName?: string;
  deadline: string;
  daysRemaining: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'UPCOMING' | 'OVERDUE';
}

// ==================== DRAFT FORMATTING TYPES ====================

export interface FormatDraftRequest {
  rawText: string;
  config: FormatConfig;
}

export interface FormatConfig {
  autoCapitalize: boolean;
  doubleSpacing: boolean;
  numbering: boolean;
  legalHeader: boolean;
  alignJustify: boolean;
  courtFormatting: boolean;
}

export interface FormatDraftResponse {
  formattedText: string;
  statistics: {
    originalLength: number;
    formattedLength: number;
    paragraphCount: number;
    wordCount: number;
  };
}

// ==================== LEGAL DATABASE TYPES ====================

export type LegalActType = 
  | 'IPC' | 'CRPC' | 'CPC' | 'CONSTITUTION' | 'RTI_ACT' 
  | 'EVIDENCE_ACT' | 'BNS' | 'BNSS' | 'DV_ACT' 
  | 'CONSUMER_PROTECTION' | 'MOTOR_VEHICLES' | 'IT_ACT' | 'OTHER';

export type SectionType = 'SUBSTANTIVE' | 'PROCEDURAL';

export interface LegalSection {
  id: string;
  actType: LegalActType;
  sectionNumber: string;
  title: string;
  description: string;
  ingredients: string[];
  punishment?: string;
  sectionType: SectionType;
  category: string;
  relatedSections: string[];
  caseLaws: CaseLaw[];
}

export interface CaseLaw {
  id: string;
  caseName: string;
  citation: string;
  year: number;
  court: string;
  summary: string;
  ratio?: string;
  relevance?: string;
}

export interface LegalSearchRequest {
  query: string;
  actType?: LegalActType;
  sectionType?: SectionType;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface LegalSearchResponse {
  sections: LegalSection[];
  total: number;
  query: string;
}

// ==================== SECTION INGREDIENTS TYPES ====================

export interface SectionIngredients {
  sectionId: string;
  sectionNumber: string;
  title: string;
  actType: LegalActType;
  ingredients: IngredientItem[];
  punishment?: string;
  relatedSections: string[];
  caseLaws: CaseLaw[];
}

export interface IngredientItem {
  id: string;
  index: number;
  text: string;
  isEssential: boolean;
}

export interface IngredientVerification {
  sectionId: string;
  checkedIngredients: string[];
  allSatisfied: boolean;
  satisfiedCount: number;
  totalCount: number;
}

// ==================== DRAFT GENERATION TYPES ====================

export type DraftType = 
  | 'LEGAL_NOTICE' | 'RTI_APPLICATION' | 'RTI_FIRST_APPEAL' | 'RTI_COMPLAINT'
  | 'BAIL_APPLICATION' | 'ANTICIPATORY_BAIL' | 'WRIT_PETITION' 
  | 'CRIMINAL_COMPLAINT' | 'CONSUMER_COMPLAINT' | 'DIVORCE_PETITION'
  | 'POLICE_COMPLAINT' | 'CIVIL_SUIT' | 'OTHER';

export interface LegalNoticeRequest {
  advocateName: string;
  advocateAddress: string;
  enrollmentNumber: string;
  senderName: string;
  senderFatherName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  subject: string;
  relevantAct: string;
  facts: string;
  causeOfAction: string;
  relevantSections: string;
  reliefSought: string;
  demand: string;
  timeLimitDays: number;
  noticeCost: number;
}

export interface RTIApplicationRequest {
  applicantName: string;
  applicantFatherName: string;
  applicantAddress: string;
  phone: string;
  email?: string;
  department: string;
  departmentAddress: string;
  informationSought: string;
  period?: string;
  paymentMode: 'IPO' | 'DD' | 'CASH' | 'ONLINE' | 'COURT_FEE_STAMP';
  isBPL: boolean;
  place: string;
  type: 'APPLICATION' | 'FIRST_APPEAL' | 'COMPLAINT';
  originalApplicationDate?: string;
  groundsOfAppeal?: string;
}

export interface BailApplicationRequest {
  applicantName: string;
  fatherName: string;
  address: string;
  firNumber: string;
  firDate: string;
  policeStation: string;
  district: string;
  state: string;
  sections: string;
  dateOfArrest: string;
  custodyDate: string;
  briefFacts: string;
  grounds: string[];
  advocateName: string;
  enrollmentNumber: string;
  courtName: string;
  courtPlace: string;
  bailSection: '437' | '438' | '439';
}

export interface GeneratedDraft {
  id: string;
  type: DraftType;
  title: string;
  content: string;
  generatedAt: string;
}

// ==================== SITUATION ANALYZER TYPES ====================

export interface Situation {
  id: string;
  name: string;
  description: string;
  icon: string;
  substantiveSections: SectionReference[];
  proceduralSections: SectionReference[];
  competentAuthorities: string[];
  futureApplications: FutureApplication[];
  recommendedDrafts: string[];
  statutoryTimelines?: Record<string, string>;
}

export interface SectionReference {
  sectionId?: string;
  code: string;
  act: string;
  description: string;
}

export interface FutureApplication {
  name: string;
  timeline: string;
  description: string;
  limitationPeriod?: string;
}

// ==================== JURISDICTION TYPES ====================

export type JurisdictionType = 'POLICE_STATION' | 'COURT' | 'TRIBUNAL' | 'COMMISSION';

export interface Jurisdiction {
  id: string;
  type: JurisdictionType;
  name: string;
  address: string;
  jurisdictionArea: string;
  competentMatters: string[];
  state: string;
  district: string;
  city?: string;
  contactPhone?: string;
  contactEmail?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface JurisdictionSearchRequest {
  query?: string;
  type?: JurisdictionType;
  state?: string;
  district?: string;
  city?: string;
  limit?: number;
  offset?: number;
}

// ==================== DEPARTMENT TYPES ====================

export interface Department {
  id: string;
  name: string;
  ministry: string;
  functions: string[];
  relevantActs: string[];
  contactInfo?: string;
  officers: OfficerHierarchy[];
  rtiMatrix?: RTIMatrix;
}

export interface OfficerHierarchy {
  id: string;
  rank: number;
  designation: string;
  role: string;
  powers: string[];
  appointedUnder: string;
}

export interface RTIMatrix {
  publicInfoOfficer: string;
  firstAppellateAuthority: string;
  processingPeriodDays: number;
}

// ==================== CASE MANAGEMENT TYPES ====================

export type CaseStatus = 'ACTIVE' | 'PENDING_HEARING' | 'DISPOSED' | 'STAYED' | 'TRANSFERRED' | 'CLOSED';
export type CasePriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Case {
  id: string;
  caseNumber: string;
  caseTitle: string;
  courtName: string;
  caseType: string;
  clientName: string;
  oppositionName?: string;
  oppositionAdvocate?: string;
  filingDate?: string;
  nextHearingDate?: string;
  lastHearingDate?: string;
  status: CaseStatus;
  priority: CasePriority;
  stage?: string;
  notes?: string;
  hearings: Hearing[];
}

export interface Hearing {
  id: string;
  hearingDate: string;
  bench?: string;
  purpose?: string;
  outcome?: string;
  nextSteps?: string;
  orderPassed?: string;
}

export interface CreateCaseRequest {
  caseNumber: string;
  caseTitle: string;
  courtName: string;
  caseType: string;
  clientName: string;
  oppositionName?: string;
  oppositionAdvocate?: string;
  filingDate?: string;
  nextHearingDate?: string;
  priority?: CasePriority;
  notes?: string;
}

// ==================== FILING TRACKER TYPES ====================

export type FilingStatus = 'PENDING' | 'UPCOMING' | 'OVERDUE' | 'FILED' | 'CANCELLED';
export type FilingPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface FilingTracker {
  id: string;
  caseId?: string;
  caseName?: string;
  applicationType: string;
  description?: string;
  deadline: string;
  court?: string;
  notes?: string;
  status: FilingStatus;
  priority: FilingPriority;
  daysRemaining: number;
  filedAt?: string;
}

export interface CreateFilingRequest {
  caseId?: string;
  applicationType: string;
  description?: string;
  deadline: string;
  court?: string;
  notes?: string;
  priority?: FilingPriority;
}

export interface UpdateFilingRequest {
  applicationType?: string;
  description?: string;
  deadline?: string;
  court?: string;
  notes?: string;
  status?: FilingStatus;
  priority?: FilingPriority;
}

// ==================== AUDIT TYPES ====================

export type AuditAction = 
  | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' 
  | 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' 
  | 'PASSWORD_CHANGE' | 'EXPORT' | 'DOWNLOAD';

export interface AuditLogEntry {
  id: string;
  userId?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
