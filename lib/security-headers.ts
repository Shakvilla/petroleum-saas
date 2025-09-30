import { NextResponse } from 'next/server';

// Security headers configuration
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Content Security Policy
export const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.petromanager.com wss://api.petromanager.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`;

// Add security headers to response
export const addSecurityHeaders = (response: NextResponse): NextResponse => {
  // Add standard security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add CSP header
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
};

// CORS configuration for API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin':
    process.env.NODE_ENV === 'production'
      ? 'https://petromanager.com'
      : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-CSRF-Token, X-Tenant-ID',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

// Add CORS headers to response
export const addCorsHeaders = (response: NextResponse): NextResponse => {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
};

// Rate limiting configuration
export const rateLimitConfig = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  registration: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  general: {
    maxAttempts: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};

// Session security configuration
export const sessionConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

// Password policy configuration
export const passwordPolicy = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxConsecutiveChars: 3,
  forbiddenWords: ['password', '123456', 'qwerty', 'admin', 'user'],
};

// Account lockout configuration
export const lockoutConfig = {
  maxFailedAttempts: 5,
  lockoutDuration: 30 * 60 * 1000, // 30 minutes
  maxLockouts: 3,
  permanentLockout: true,
};

// Token expiration configuration
export const tokenConfig = {
  accessToken: 15 * 60 * 1000, // 15 minutes
  refreshToken: 7 * 24 * 60 * 60 * 1000, // 7 days
  passwordReset: 60 * 60 * 1000, // 1 hour
  emailVerification: 24 * 60 * 60 * 1000, // 24 hours
};

// Audit log configuration
export const auditConfig = {
  logLevels: ['info', 'warn', 'error'],
  sensitiveFields: ['password', 'token', 'secret'],
  maxLogSize: 100 * 1024 * 1024, // 100MB
  retentionDays: 90,
};

// Security event types
export const securityEvents = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
  PASSWORD_RESET: 'password_reset',
  ACCOUNT_LOCKED: 'account_locked',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  CSRF_VIOLATION: 'csrf_violation',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
} as const;

// Security middleware
export const securityMiddleware = {
  // Validate request origin
  validateOrigin: (request: Request): boolean => {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        'https://petromanager.com',
        'https://www.petromanager.com',
      ];

      return !origin || allowedOrigins.includes(origin);
    }

    return true;
  },

  // Validate request size
  validateRequestSize: (
    request: Request,
    maxSize: number = 1024 * 1024
  ): boolean => {
    const contentLength = request.headers.get('content-length');
    return !contentLength || parseInt(contentLength) <= maxSize;
  },

  // Validate request method
  validateMethod: (request: Request, allowedMethods: string[]): boolean => {
    return allowedMethods.includes(request.method);
  },

  // Check for suspicious patterns
  detectSuspiciousActivity: (request: Request): boolean => {
    const userAgent = request.headers.get('user-agent') || '';
    const suspiciousPatterns = [
      /sqlmap/i,
      /nikto/i,
      /nmap/i,
      /masscan/i,
      /zap/i,
      /burp/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  },
};
