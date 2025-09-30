import {
  emailSchema,
  passwordSchema,
  nameSchema,
  companyNameSchema,
  loginSchema,
  registrationSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  sanitizeInput,
  createRateLimiter,
  validateCSRFToken,
  generateSecureToken,
  calculatePasswordStrength,
  validateSession,
  isValidIP,
  isValidUserAgent,
} from '@/lib/auth-validation';

describe('Auth Validation', () => {
  describe('emailSchema', () => {
    it('validates correct email addresses', () => {
      expect(emailSchema.parse('test@example.com')).toBe('test@example.com');
      expect(emailSchema.parse('user.name+tag@domain.co.uk')).toBe(
        'user.name+tag@domain.co.uk'
      );
    });

    it('rejects invalid email addresses', () => {
      expect(() => emailSchema.parse('invalid-email')).toThrow();
      expect(() => emailSchema.parse('@example.com')).toThrow();
      expect(() => emailSchema.parse('test@')).toThrow();
      expect(() => emailSchema.parse('')).toThrow();
    });
  });

  describe('passwordSchema', () => {
    it('validates strong passwords', () => {
      expect(passwordSchema.parse('Password123!')).toBe('Password123!');
      expect(passwordSchema.parse('MyStr0ng#Pass')).toBe('MyStr0ng#Pass');
    });

    it('rejects weak passwords', () => {
      expect(() => passwordSchema.parse('weak')).toThrow();
      expect(() => passwordSchema.parse('password')).toThrow();
      expect(() => passwordSchema.parse('PASSWORD123')).toThrow();
      expect(() => passwordSchema.parse('Password123')).toThrow();
    });
  });

  describe('nameSchema', () => {
    it('validates correct names', () => {
      expect(nameSchema.parse('John')).toBe('John');
      expect(nameSchema.parse("O'Connor")).toBe("O'Connor");
      expect(nameSchema.parse('Jean-Pierre')).toBe('Jean-Pierre');
    });

    it('rejects invalid names', () => {
      expect(() => nameSchema.parse('John123')).toThrow();
      expect(() => nameSchema.parse('John@Doe')).toThrow();
      expect(() => nameSchema.parse('')).toThrow();
    });
  });

  describe('companyNameSchema', () => {
    it('validates correct company names', () => {
      expect(companyNameSchema.parse('Acme Corp')).toBe('Acme Corp');
      expect(companyNameSchema.parse('Smith & Associates')).toBe(
        'Smith & Associates'
      );
      expect(companyNameSchema.parse('Tech Co., Ltd.')).toBe('Tech Co., Ltd.');
    });

    it('rejects invalid company names', () => {
      expect(() => companyNameSchema.parse('Company@#$')).toThrow();
      expect(() => companyNameSchema.parse('')).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      };
      expect(loginSchema.parse(validData)).toEqual(validData);
    });

    it('rejects invalid login data', () => {
      expect(() =>
        loginSchema.parse({ email: 'invalid', password: 'pass' })
      ).toThrow();
    });
  });

  describe('registrationSchema', () => {
    it('validates correct registration data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        companyName: 'Test Company',
        agreeToTerms: true,
      };
      expect(registrationSchema.parse(validData)).toEqual(validData);
    });

    it('rejects mismatched passwords', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Different123!',
        companyName: 'Test Company',
        agreeToTerms: true,
      };
      expect(() => registrationSchema.parse(invalidData)).toThrow();
    });
  });

  describe('sanitizeInput', () => {
    it('removes potentially dangerous content', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        'scriptalert("xss")/script'
      );
      expect(sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")');
      expect(sanitizeInput('onclick="alert(\'xss\')"')).toBe("alert('xss')\"");
    });

    it('trims whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
    });
  });

  describe('createRateLimiter', () => {
    it('allows requests within limit', () => {
      const limiter = createRateLimiter(3, 1000);
      expect(limiter('user1')).toBe(true);
      expect(limiter('user1')).toBe(true);
      expect(limiter('user1')).toBe(true);
    });

    it('blocks requests exceeding limit', () => {
      const limiter = createRateLimiter(2, 1000);
      expect(limiter('user1')).toBe(true);
      expect(limiter('user1')).toBe(true);
      expect(limiter('user1')).toBe(false);
    });
  });

  describe('validateCSRFToken', () => {
    it('validates matching tokens', () => {
      expect(validateCSRFToken('token123', 'token123')).toBe(true);
    });

    it('rejects mismatched tokens', () => {
      expect(validateCSRFToken('token123', 'token456')).toBe(false);
      expect(validateCSRFToken('', 'token123')).toBe(false);
      expect(validateCSRFToken('token123', '')).toBe(false);
    });
  });

  describe('generateSecureToken', () => {
    it('generates tokens of correct length', () => {
      const token = generateSecureToken(16);
      expect(token).toHaveLength(16);
    });

    it('generates different tokens', () => {
      const token1 = generateSecureToken(32);
      const token2 = generateSecureToken(32);
      expect(token1).not.toBe(token2);
    });
  });

  describe('calculatePasswordStrength', () => {
    it('calculates strength for strong passwords', () => {
      const result = calculatePasswordStrength('MyStr0ng#Pass123');
      expect(result.score).toBeGreaterThan(3);
      expect(result.feedback).toHaveLength(0);
    });

    it('calculates strength for weak passwords', () => {
      const result = calculatePasswordStrength('weak');
      expect(result.score).toBeLessThan(3);
      expect(result.feedback.length).toBeGreaterThan(0);
    });
  });

  describe('validateSession', () => {
    it('validates active sessions', () => {
      const sessionData = {
        userId: '123',
        expiresAt: Date.now() + 3600000, // 1 hour from now
      };
      expect(validateSession(sessionData)).toBe(true);
    });

    it('rejects expired sessions', () => {
      const sessionData = {
        userId: '123',
        expiresAt: Date.now() - 3600000, // 1 hour ago
      };
      expect(validateSession(sessionData)).toBe(false);
    });

    it('rejects invalid session data', () => {
      expect(validateSession(null)).toBe(false);
      expect(validateSession(undefined)).toBe(false);
    });
  });

  describe('isValidIP', () => {
    it('validates correct IP addresses', () => {
      expect(isValidIP('192.168.1.1')).toBe(true);
      expect(isValidIP('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
    });

    it('rejects invalid IP addresses', () => {
      expect(isValidIP('256.256.256.256')).toBe(false);
      expect(isValidIP('not-an-ip')).toBe(false);
      expect(isValidIP('')).toBe(false);
    });
  });

  describe('isValidUserAgent', () => {
    it('validates normal user agents', () => {
      expect(
        isValidUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
      ).toBe(true);
    });

    it('rejects suspicious user agents', () => {
      expect(isValidUserAgent('sqlmap/1.0')).toBe(false);
      expect(isValidUserAgent('nikto/2.1.6')).toBe(false);
      expect(isValidUserAgent('')).toBe(false);
    });

    it('rejects user agents that are too long', () => {
      const longUA = 'A'.repeat(501);
      expect(isValidUserAgent(longUA)).toBe(false);
    });
  });
});
