import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters');

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  );

// Name validation schema
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')
  .regex(
    /^[a-zA-Z\s'-]+$/,
    'Name can only contain letters, spaces, hyphens, and apostrophes'
  );

// Company name validation schema
export const companyNameSchema = z
  .string()
  .min(1, 'Company name is required')
  .max(100, 'Company name must be less than 100 characters')
  .regex(/^[a-zA-Z0-9\s&.,'-]+$/, 'Company name contains invalid characters');

// Login form validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

// Registration form validation schema
export const registrationSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    companyName: companyNameSchema,
    agreeToTerms: z.boolean().refine(val => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Password reset request validation schema
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

// Password reset validation schema
export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Input sanitization function
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Rate limiting helper
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (identifier: string): boolean => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier);

    if (!userAttempts || now > userAttempts.resetTime) {
      attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (userAttempts.count >= maxAttempts) {
      return false;
    }

    userAttempts.count++;
    return true;
  };
};

// CSRF token validation
export const validateCSRFToken = (
  token: string,
  sessionToken: string
): boolean => {
  if (!token || !sessionToken) return false;
  return token === sessionToken;
};

// Generate secure random token
export const generateSecureToken = (length: number = 32): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }

  return result;
};

// Password strength calculator
export const calculatePasswordStrength = (
  password: string
): {
  score: number;
  feedback: string[];
} => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Add numbers');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Add special characters');

  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    feedback.push('Avoid repeating characters');
  }

  if (/123|abc|qwe/i.test(password)) {
    score -= 1;
    feedback.push('Avoid common sequences');
  }

  return { score: Math.max(0, Math.min(5, score)), feedback };
};

// Session validation
export const validateSession = (sessionData: any): boolean => {
  if (!sessionData) return false;

  const now = Date.now();
  const expiresAt = sessionData.expiresAt;

  if (expiresAt && now > expiresAt) return false;

  return true;
};

// IP address validation
export const isValidIP = (ip: string): boolean => {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// User agent validation
export const isValidUserAgent = (userAgent: string): boolean => {
  if (!userAgent || userAgent.length < 10) return false;
  if (userAgent.length > 500) return false;

  // Check for suspicious patterns
  const suspiciousPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i];

  return !suspiciousPatterns.some(pattern => pattern.test(userAgent));
};
