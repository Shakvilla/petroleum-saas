import DOMPurify from 'dompurify';
import CryptoJS from 'crypto-js';

// XSS Prevention
export const sanitizeInput = (input: string): string => {
  if (typeof window === 'undefined') {
    // Server-side sanitization (basic)
    return input.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ''
    );
  }

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
};

export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html;
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ],
    ALLOWED_ATTR: ['class'],
    KEEP_CONTENT: true,
  });
};

// CSRF Protection
export const getCsrfToken = (): string | null => {
  if (typeof document === 'undefined') return null;

  const metaTag = document.querySelector('meta[name="csrf-token"]');
  return metaTag?.getAttribute('content') || null;
};

export const addCsrfHeader = (headers: HeadersInit = {}): HeadersInit => {
  const token = getCsrfToken();
  if (!token) return headers;

  return {
    ...headers,
    'X-CSRF-Token': token,
  };
};

// Input Validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Data Encryption
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key';

export const encryptData = (data: any): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

// Secure Storage
export const secureStorage = {
  setItem: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;

    try {
      const encrypted = encryptData(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  },

  getItem: (key: string): any => {
    if (typeof window === 'undefined') return null;

    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      return decryptData(encrypted);
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove data securely:', error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
    }
  },
};

// Content Security Policy
export const cspHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' wss: https:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),

  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Security Headers Middleware
export const securityHeaders = {
  ...cspHeaders,
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-XSS-Protection': '1; mode=block',
};

// Rate Limiting
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter(time => time > windowStart);

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter(time => time > windowStart);

    return Math.max(0, this.maxRequests - recentRequests.length);
  }
}

// Input Sanitization for Forms
export const sanitizeFormData = (
  data: Record<string, any>
): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// File Upload Security
export const validateFileUpload = (
  file: File
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB');
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }

  // Check for potentially dangerous file names
  const dangerousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.scr$/i,
    /\.pif$/i,
    /\.vbs$/i,
    /\.js$/i,
    /\.jar$/i,
  ];

  if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push('File type not allowed for security reasons');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
