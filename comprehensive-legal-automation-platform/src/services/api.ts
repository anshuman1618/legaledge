/**
 * LegalEdge AI - Frontend API Service
 * Secure API client with automatic token refresh and error handling
 */

declare const __API_URL__: string | undefined;
const API_BASE_URL = (typeof __API_URL__ !== 'undefined' ? __API_URL__ : null) || 'http://localhost:4000/api/v1';

// ==================== TYPES ====================

export interface APIResponse<T> {
  success: boolean;
  timestamp: string;
  data: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  barCouncilNumber?: string;
  enrollmentNumber?: string;
}

export interface FormatConfig {
  autoCapitalize: boolean;
  doubleSpacing: boolean;
  numbering: boolean;
  legalHeader: boolean;
  alignJustify: boolean;
  courtFormatting: boolean;
}

// ==================== API CLIENT ====================

class APIClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include', // Include cookies
      ...options,
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const result = await response.json();

      // Handle token expiry - attempt refresh
      if (response.status === 401 && result.error?.code === 'TOKEN_EXPIRED') {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request
          return this.request<T>(method, endpoint, data, options);
        }
      }

      return result;
    } catch (error) {
      console.error('[API_ERROR]', error);
      return {
        success: false,
        timestamp: new Date().toISOString(),
        data: null as T,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred. Please check your connection.',
        },
      };
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success && result.data?.accessToken) {
        this.accessToken = result.data.accessToken;
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: AuthUser; accessToken: string; expiresIn: number }>(
      'POST',
      '/auth/login',
      { email, password }
    );
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    barCouncilNumber?: string;
    enrollmentNumber?: string;
    phone?: string;
  }) {
    return this.request<{ message: string }>('POST', '/auth/register', data);
  }

  async logout() {
    const result = await this.request<{ message: string }>('POST', '/auth/logout');
    this.accessToken = null;
    return result;
  }

  async getCurrentUser() {
    return this.request<AuthUser>('GET', '/auth/me');
  }

  // Draft endpoints
  async formatDraft(rawText: string, config: FormatConfig) {
    return this.request<{
      formattedText: string;
      statistics: {
        originalLength: number;
        formattedLength: number;
        paragraphCount: number;
        wordCount: number;
      };
    }>('POST', '/drafts/format', { rawText, config });
  }

  async generateLegalNotice(data: Record<string, unknown>) {
    return this.request<{
      id: string;
      type: string;
      title: string;
      content: string;
      generatedAt: string;
    }>('POST', '/drafts/generate-notice', data);
  }

  async generateRTI(data: Record<string, unknown>) {
    return this.request<{
      id: string;
      type: string;
      title: string;
      content: string;
      generatedAt: string;
    }>('POST', '/drafts/generate-rti', data);
  }

  async generateBailApplication(data: Record<string, unknown>) {
    return this.request<{
      id: string;
      type: string;
      title: string;
      content: string;
      generatedAt: string;
    }>('POST', '/drafts/generate-bail', data);
  }

  async getDrafts(page = 1, limit = 20) {
    return this.request<Array<{
      id: string;
      type: string;
      title: string;
      status: string;
      version: number;
      createdAt: string;
      updatedAt: string;
    }>>('GET', `/drafts?page=${page}&limit=${limit}`);
  }

  async getDraft(id: string) {
    return this.request<{
      id: string;
      type: string;
      title: string;
      content: string;
      formData: Record<string, unknown>;
      status: string;
      createdAt: string;
    }>('GET', `/drafts/${id}`);
  }

  // Legal database endpoints
  async searchLegal(query: string, params?: {
    actType?: string;
    sectionType?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams({ query, ...params as Record<string, string> });
    return this.request<{
      sections: Array<{
        id: string;
        actType: string;
        sectionNumber: string;
        title: string;
        description: string;
        ingredients: string[];
        punishment?: string;
        sectionType: string;
        category: string;
        relatedSections: string[];
        caseLaws: Array<{
          id: string;
          caseName: string;
          citation: string;
          year: number;
          court: string;
          summary: string;
          relevance?: string;
        }>;
      }>;
      total: number;
      query: string;
    }>('GET', `/legal/search?${searchParams}`);
  }

  async getSection(id: string) {
    return this.request<{
      id: string;
      actType: string;
      sectionNumber: string;
      title: string;
      description: string;
      ingredients: string[];
      punishment?: string;
      sectionType: string;
      category: string;
      relatedSections: string[];
      caseLaws: Array<{
        id: string;
        caseName: string;
        citation: string;
        year: number;
        court: string;
        summary: string;
        ratio?: string;
        relevance?: string;
      }>;
    }>('GET', `/legal/sections/${id}`);
  }

  async getSectionIngredients(id: string) {
    return this.request<{
      sectionId: string;
      sectionNumber: string;
      title: string;
      actType: string;
      ingredients: Array<{
        id: string;
        index: number;
        text: string;
        isEssential: boolean;
      }>;
      punishment?: string;
      relatedSections: string[];
      caseLaws: Array<{
        id: string;
        caseName: string;
        citation: string;
        year: number;
        court: string;
        summary: string;
      }>;
    }>('GET', `/legal/analyzer/ingredients/${id}`);
  }

  async getActTypes() {
    return this.request<Array<{ type: string; count: number }>>('GET', '/legal/acts');
  }

  async getCategories() {
    return this.request<Array<{ name: string; count: number }>>('GET', '/legal/categories');
  }

  // Situation analyzer endpoints
  async getSituations() {
    return this.request<Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      substantiveSections: Array<{ code: string; act: string; description: string }>;
      proceduralSections: Array<{ code: string; act: string; description: string }>;
      competentAuthorities: string[];
      futureApplications: Array<{ name: string; timeline: string; description: string }>;
      recommendedDrafts: string[];
    }>>('GET', '/situations');
  }

  async analyzeSituation(id: string) {
    return this.request<{
      id: string;
      name: string;
      description: string;
      icon: string;
      substantiveSections: Array<{ sectionId?: string; code: string; act: string; description: string }>;
      proceduralSections: Array<{ sectionId?: string; code: string; act: string; description: string }>;
      competentAuthorities: string[];
      futureApplications: Array<{ name: string; timeline: string; description: string }>;
      recommendedDrafts: string[];
    }>('GET', `/situations/analyze/${id}`);
  }

  // Jurisdiction endpoints
  async searchJurisdictions(params?: {
    query?: string;
    type?: string;
    state?: string;
    district?: string;
    city?: string;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams(params as Record<string, string>);
    return this.request<Array<{
      id: string;
      type: string;
      name: string;
      address: string;
      jurisdictionArea: string;
      competentMatters: string[];
      state: string;
      district: string;
      city?: string;
      contactPhone?: string;
      contactEmail?: string;
    }>>('GET', `/jurisdiction/search?${searchParams}`);
  }

  async getStates() {
    return this.request<Array<{ name: string; count: number }>>('GET', '/jurisdiction/meta/states');
  }

  async getDistricts(state: string) {
    return this.request<Array<{ name: string; count: number }>>('GET', `/jurisdiction/meta/districts/${state}`);
  }

  // Department endpoints
  async getDepartments(query?: string) {
    const url = query ? `/departments?query=${encodeURIComponent(query)}` : '/departments';
    return this.request<Array<{
      id: string;
      name: string;
      ministry: string;
      functions: string[];
      relevantActs: string[];
      contactInfo?: string;
      officers: Array<{
        id: string;
        rank: number;
        designation: string;
        role: string;
        powers: string[];
        appointedUnder: string;
      }>;
      rtiMatrix?: {
        publicInfoOfficer: string;
        firstAppellateAuthority: string;
        processingPeriodDays: number;
      };
    }>>('GET', url);
  }

  async getDepartmentHierarchy(id: string) {
    return this.request<{
      departmentId: string;
      departmentName: string;
      ministry: string;
      officers: Array<{
        rank: number;
        designation: string;
        role: string;
        powers: string[];
        appointedUnder: string;
        reportsTo: string | null;
      }>;
      rtiMatrix: {
        publicInfoOfficer: string;
        firstAppellateAuthority: string;
        processingPeriodDays: number;
      } | null;
      relevantActs: string[];
      contactInfo?: string;
    }>('GET', `/departments/${id}/hierarchy`);
  }

  // Case management endpoints
  async getDashboardSummary() {
    return this.request<{
      activeCase: number;
      pendingFilings: number;
      overdueFilings: number;
      upcomingHearings: number;
      totalDrafts: number;
      recentActivity: Array<{
        id: string;
        type: string;
        description: string;
        timestamp: string;
      }>;
      filingCountdowns: Array<{
        id: string;
        applicationType: string;
        caseName?: string;
        deadline: string;
        daysRemaining: number;
        priority: string;
        status: string;
      }>;
      caseStatusBreakdown: Record<string, number>;
    }>('GET', '/cases/dashboard/summary');
  }

  async getCases(page = 1, limit = 20, status?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    return this.request<Array<{
      id: string;
      caseNumber: string;
      caseTitle: string;
      courtName: string;
      caseType: string;
      clientName: string;
      status: string;
      priority: string;
      nextHearingDate?: string;
    }>>('GET', `/cases?${params}`);
  }

  async createCase(data: Record<string, unknown>) {
    return this.request<{ id: string; message: string }>('POST', '/cases', data);
  }

  async updateCase(id: string, data: Record<string, unknown>) {
    return this.request<{ id: string; message: string }>('PUT', `/cases/${id}`, data);
  }

  async getFilings() {
    return this.request<Array<{
      id: string;
      caseId?: string;
      caseName?: string;
      applicationType: string;
      description?: string;
      deadline: string;
      court?: string;
      notes?: string;
      status: string;
      priority: string;
      daysRemaining: number;
      filedAt?: string;
    }>>('GET', '/cases/filings/all');
  }

  async createFiling(data: Record<string, unknown>) {
    return this.request<{ id: string; message: string }>('POST', '/cases/filings', data);
  }

  async updateFiling(id: string, data: Record<string, unknown>) {
    return this.request<{ message: string }>('PUT', `/cases/filings/${id}`, data);
  }

  async deleteFiling(id: string) {
    return this.request<{ message: string }>('DELETE', `/cases/filings/${id}`);
  }
}

// Export singleton instance
export const api = new APIClient(API_BASE_URL);
export default api;
