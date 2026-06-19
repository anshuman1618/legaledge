/**
 * LegalEdge AI - Frontend Security Utilities
 * XSS prevention, input sanitization, and secure text handling
 */

// ==================== XSS PREVENTION ====================

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes script tags, event handlers, and dangerous protocols
 */
export function sanitizeHTML(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: and data: protocols
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    // Remove dangerous tags
    .replace(/<(iframe|object|embed|link|style|meta|base|form|input|button)[^>]*>/gi, '')
    // Escape remaining HTML entities
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Sanitize plain text input
 * Removes potentially dangerous characters while preserving legal document formatting
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Sanitize user input for form fields
 */
export function sanitizeFormInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

// ==================== INPUT VALIDATION ====================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate Bar Council number format
 */
export function isValidBarCouncilNumber(number: string): boolean {
  // Format: STATE/NUMBER/YEAR (e.g., DL/1234/2020)
  const barRegex = /^[A-Z]{2}\/\d+\/\d{4}$/;
  return barRegex.test(number);
}

// ==================== DATA SANITIZATION ====================

/**
 * Sanitize object for API submission
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    const value = sanitized[key];
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeFormInput(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeFormInput(item) : item
      );
    }
  }
  
  return sanitized;
}

// ==================== SECURE DISPLAY ====================

/**
 * Escape HTML for safe display in text content
 */
export function escapeHTML(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

/**
 * Create safe HTML content that can be rendered
 */
export function createSafeHTML(content: string): { __html: string } {
  return { __html: sanitizeHTML(content) };
}

// ==================== RATE LIMITING (Client-side) ====================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Client-side rate limiting for form submissions
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false;
  }
  
  entry.count++;
  return true;
}

/**
 * Reset rate limit for a key
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

// ==================== SECURE STORAGE ====================

/**
 * Store non-sensitive data in sessionStorage (not for tokens!)
 */
export function secureSessionStore(key: string, value: string): void {
  try {
    // Don't store sensitive data
    if (key.toLowerCase().includes('token') || key.toLowerCase().includes('password')) {
      console.warn('Attempt to store sensitive data blocked');
      return;
    }
    sessionStorage.setItem(key, value);
  } catch {
    console.warn('SessionStorage not available');
  }
}

/**
 * Retrieve data from sessionStorage
 */
export function secureSessionRetrieve(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Clear session storage
 */
export function clearSecureSession(): void {
  try {
    sessionStorage.clear();
  } catch {
    // Ignore
  }
}

// ==================== CSRF PROTECTION ====================

/**
 * Generate a CSRF token for form protection
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store CSRF token for session
 */
let csrfToken: string | null = null;

export function getCSRFToken(): string {
  if (!csrfToken) {
    csrfToken = generateCSRFToken();
  }
  return csrfToken;
}

export function refreshCSRFToken(): string {
  csrfToken = generateCSRFToken();
  return csrfToken;
}
