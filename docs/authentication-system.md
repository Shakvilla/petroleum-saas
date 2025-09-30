# Authentication System Documentation

## Overview

The authentication system provides secure, multi-tenant authentication for the petroleum management platform. It includes login, registration, password recovery, and social authentication features with comprehensive security measures and performance optimizations.

## Architecture

### Core Components

- **Authentication Layout**: Split-screen layout with form on left (40%) and visual marketing on right (60%)
- **Form Components**: Reusable form fields, buttons, and validation components
- **Security Layer**: Input validation, rate limiting, CSRF protection, and security headers
- **Multi-tenant Integration**: Tenant-aware authentication and branding
- **Performance Optimizations**: Lazy loading, caching, and bundle optimization

### File Structure

```
components/auth/
├── auth-layout.tsx              # Main authentication layout
├── visual-marketing-section.tsx # Right panel marketing content
├── tenant-branding.tsx          # Tenant-specific branding
├── form-field.tsx               # Reusable form input component
├── auth-button.tsx              # Styled button component
├── password-strength-indicator.tsx # Password validation UI
├── social-login-button.tsx      # Social authentication buttons
├── form-separator.tsx           # Visual form separator
├── login-page.tsx               # Login form implementation
├── register-page.tsx            # Registration form implementation
├── forgot-password-page.tsx     # Password recovery implementation
└── lazy-auth-components.tsx     # Lazy loading wrappers

lib/
├── auth-validation.ts           # Validation schemas and utilities
├── security-headers.ts          # Security configuration
└── auth-performance.ts          # Performance optimization utilities

app/auth/
├── layout.tsx                   # Authentication layout wrapper
├── login/page.tsx               # Login route
├── register/page.tsx            # Registration route
└── forgot-password/page.tsx     # Password recovery route
```

## Features

### 1. Authentication Pages

#### Login Page (`/auth/login`)

- Email and password authentication
- Social login (Google)
- Remember me functionality
- Form validation with real-time feedback
- Multi-tenant redirect logic

#### Registration Page (`/auth/register`)

- Multi-step form with validation
- Password strength indicator
- Company information collection
- Terms and conditions agreement
- Social signup option

#### Password Recovery (`/auth/forgot-password`)

- Email-based password reset
- Token-based password reset
- Multi-step flow with success states
- Resend email functionality

### 2. Security Features

#### Input Validation

- Zod schema validation
- Real-time form validation
- XSS prevention
- SQL injection protection
- Input sanitization

#### Rate Limiting

- Login attempt limiting (5 attempts per 15 minutes)
- Registration limiting (3 attempts per hour)
- Password reset limiting (3 attempts per hour)
- IP-based rate limiting

#### Security Headers

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

#### Password Security

- Minimum 8 characters
- Uppercase, lowercase, numbers, special characters
- Password strength calculation
- Common password detection
- Secure token generation

### 3. Multi-tenant Integration

#### Tenant Context

- Automatic tenant resolution from URL
- Tenant-specific branding and theming
- Tenant-aware redirects
- Isolated authentication flows

#### Tenant Branding

- Dynamic logo display
- Custom color schemes
- Tenant-specific messaging
- Branded email templates

### 4. Performance Optimizations

#### Lazy Loading

- Component-level code splitting
- Route-based lazy loading
- Suspense boundaries
- Loading states

#### Caching

- Password strength calculation cache
- Form validation cache
- Component preloading
- Image optimization

#### Bundle Optimization

- Dynamic imports
- Tree shaking
- Code splitting
- Performance monitoring

## Usage

### Basic Implementation

```tsx
import { LoginPage } from '@/components/auth/login-page';

export default function Login() {
  return <LoginPage />;
}
```

### With Lazy Loading

```tsx
import {
  LazyAuthWrapper,
  LazyLoginPage,
} from '@/components/auth/lazy-auth-components';

export default function Login() {
  return (
    <LazyAuthWrapper>
      <LazyLoginPage />
    </LazyAuthWrapper>
  );
}
```

### Custom Form Field

```tsx
import { FormField } from '@/components/auth/form-field';

<FormField
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
  placeholder="Enter your email"
/>;
```

### Password Strength Indicator

```tsx
import { PasswordStrengthIndicator } from '@/components/auth/password-strength-indicator';

<PasswordStrengthIndicator
  password={password}
  minLength={8}
  requireUppercase={true}
  requireLowercase={true}
  requireNumbers={true}
  requireSpecialChars={true}
/>;
```

## API Integration

### Authentication Endpoints

```typescript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}

// Registration
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "companyName": "Acme Corp",
  "agreeToTerms": true
}

// Password Reset Request
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}

// Password Reset
POST /api/auth/reset-password
{
  "token": "reset-token-123",
  "password": "NewPassword123!"
}
```

### Social Authentication

```typescript
// Google OAuth
GET /api/auth/google
// Redirects to Google OAuth

// OAuth Callback
GET /api/auth/google/callback?code=...
// Processes OAuth response
```

## Testing

### Unit Tests

```bash
# Run component tests
npm test components/auth

# Run validation tests
npm test lib/auth-validation

# Run with coverage
npm test -- --coverage
```

### E2E Tests

```bash
# Run authentication flow tests
npx playwright test auth.spec.ts

# Run in headed mode
npx playwright test auth.spec.ts --headed
```

### Test Coverage

- Component rendering and interactions
- Form validation and submission
- Error handling and edge cases
- Multi-tenant functionality
- Security features
- Performance optimizations

## Deployment

### Environment Variables

```env
# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=your-database-url

# Security
RATE_LIMIT_REDIS_URL=your-redis-url
ENCRYPTION_KEY=your-encryption-key
```

### Build Configuration

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components/auth'],
  },
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
```

### Security Headers

```javascript
// middleware.js
import { addSecurityHeaders } from '@/lib/security-headers';

export function middleware(request) {
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}
```

## Monitoring

### Performance Metrics

- Page load times
- Form submission times
- Authentication success rates
- Error rates and types
- User experience metrics

### Security Monitoring

- Failed login attempts
- Rate limit violations
- Suspicious activity detection
- CSRF token validation
- Input validation failures

### Analytics

- User registration funnel
- Authentication method usage
- Password recovery success rates
- Social login adoption
- Multi-tenant usage patterns

## Troubleshooting

### Common Issues

1. **Form validation not working**
   - Check Zod schema configuration
   - Verify form state management
   - Ensure proper error handling

2. **Social login failures**
   - Verify OAuth provider configuration
   - Check redirect URIs
   - Validate client credentials

3. **Performance issues**
   - Enable lazy loading
   - Check bundle size
   - Monitor network requests

4. **Multi-tenant issues**
   - Verify tenant resolution logic
   - Check tenant data availability
   - Validate redirect URLs

### Debug Mode

```typescript
// Enable debug logging
localStorage.setItem('auth-debug', 'true');

// View performance metrics
console.log(performance.getEntriesByType('navigation'));
```

## Contributing

### Development Setup

1. Install dependencies
2. Set up environment variables
3. Run development server
4. Execute tests
5. Check linting and formatting

### Code Standards

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Jest for testing
- Playwright for E2E testing

### Pull Request Process

1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Run full test suite
5. Submit pull request
6. Address review feedback

## License

This authentication system is part of the petroleum management platform and follows the same licensing terms.
