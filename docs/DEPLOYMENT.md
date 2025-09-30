# Deployment Guide

This guide covers deployment strategies and best practices for the Petroleum Management System frontend.

## Table of Contents

- [Overview](#overview)
- [Environment Setup](#environment-setup)
- [Build Process](#build-process)
- [Deployment Platforms](#deployment-platforms)
- [Environment Variables](#environment-variables)
- [Performance Optimization](#performance-optimization)
- [Security Configuration](#security-configuration)
- [Monitoring and Logging](#monitoring-and-logging)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)

## Overview

The Petroleum Management System frontend is built with Next.js 15 and can be deployed to various platforms. This guide covers the most common deployment scenarios and best practices.

### Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Edge      │    │   Application   │    │   Backend API   │
│                 │    │                 │    │                 │
│ • Static Assets │    │ • Next.js App   │    │ • REST API      │
│ • Images        │    │ • Server Routes │    │ • WebSocket     │
│ • Fonts         │    │ • API Routes    │    │ • Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Environment Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git 2.30.0 or higher
- Access to deployment platform

### Local Development

1. **Clone Repository**

```bash
git clone <repository-url>
cd petroleum-saas
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Configuration**

```bash
cp .env.example .env.local
```

4. **Start Development Server**

```bash
npm run dev
```

## Build Process

### Production Build

```bash
# Install dependencies
npm ci

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Start production server
npm run start
```

### Build Optimization

```bash
# Analyze bundle size
npm run analyze

# Check for unused dependencies
npx depcheck

# Audit dependencies
npm audit
```

### Build Configuration

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

## Deployment Platforms

### Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Setup

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
vercel --prod
```

#### Configuration

Create `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_WEBSOCKET_URL": "@websocket-url"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### Environment Variables

Set in Vercel dashboard:

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_WEBSOCKET_URL`: WebSocket URL
- `NEXT_PUBLIC_ANALYTICS_ID`: Analytics ID
- `NEXT_PUBLIC_STORAGE_SECRET_KEY`: Storage encryption key

### Netlify

#### Setup

1. **Install Netlify CLI**

```bash
npm i -g netlify-cli
```

2. **Login to Netlify**

```bash
netlify login
```

3. **Deploy**

```bash
netlify deploy --prod
```

#### Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Docker

#### Dockerfile

```dockerfile
# Use the official Node.js 18 image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://backend:3001
      - NEXT_PUBLIC_WEBSOCKET_URL=ws://backend:3001
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    image: petroleum-backend:latest
    ports:
      - '3001:3001'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/petroleum
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=petroleum
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### AWS

#### AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your Git repository
   - Select branch and build settings

2. **Build Settings**

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

#### AWS S3 + CloudFront

1. **Build and Export**

```bash
npm run build
npm run export
```

2. **Upload to S3**

```bash
aws s3 sync out/ s3://your-bucket-name --delete
```

3. **CloudFront Distribution**
   - Create CloudFront distribution
   - Set S3 bucket as origin
   - Configure caching behaviors
   - Set up custom error pages

### Google Cloud Platform

#### Cloud Run

1. **Dockerfile** (same as above)

2. **Deploy**

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/petroleum-frontend

# Deploy to Cloud Run
gcloud run deploy petroleum-frontend \
  --image gcr.io/PROJECT-ID/petroleum-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Environment Variables

### Required Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.petroleum.com
NEXT_PUBLIC_WEBSOCKET_URL=wss://ws.petroleum.com

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Security
NEXT_PUBLIC_STORAGE_SECRET_KEY=your-secret-key

# Environment
NODE_ENV=production
```

### Optional Variables

```bash
# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Segment (Analytics)
NEXT_PUBLIC_SEGMENT_WRITE_KEY=your-segment-key

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Environment-Specific Configuration

```typescript
// lib/config.ts
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  websocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001',
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  storageSecretKey: process.env.NEXT_PUBLIC_STORAGE_SECRET_KEY || 'default-key',
  isProduction: process.env.NODE_ENV === 'production',
  enablePWA: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
};
```

## Performance Optimization

### Build Optimization

```javascript
// next.config.mjs
const nextConfig = {
  // Enable compression
  compress: true,

  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Optimize CSS
  experimental: {
    optimizeCss: true,
  },

  // Bundle analysis
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};
```

### CDN Configuration

```javascript
// next.config.mjs
const nextConfig = {
  // CDN configuration
  assetPrefix:
    process.env.NODE_ENV === 'production' ? 'https://cdn.petroleum.com' : '',

  // Image optimization
  images: {
    domains: ['cdn.petroleum.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
```

### Caching Strategy

```javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

## Security Configuration

### Security Headers

```javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
          },
        ],
      },
    ];
  },
};
```

### HTTPS Configuration

```javascript
// next.config.mjs
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://petroleum.com/$1',
        permanent: true,
      },
    ];
  },
};
```

## Monitoring and Logging

### Error Tracking

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});
```

### Performance Monitoring

```typescript
// lib/analytics.ts
export function trackPerformance(name: string, value: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name,
      value,
    });
  }
}

// Track Core Web Vitals
export function trackWebVitals() {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(trackPerformance);
      getFID(trackPerformance);
      getFCP(trackPerformance);
      getLCP(trackPerformance);
      getTTFB(trackPerformance);
    });
  }
}
```

### Health Checks

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check database connection
    // Check external services
    // Check system resources

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: .next

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: .next

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: '18'

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run type-check
    - npm run lint
    - npm run test
    - npm run test:e2e
  artifacts:
    reports:
      junit: test-results.xml
    coverage_report:
      coverage_format: cobertura
      path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next
    expire_in: 1 hour

deploy:
  stage: deploy
  image: node:${NODE_VERSION}
  script:
    - npm install -g vercel
    - vercel --token $VERCEL_TOKEN --prod
  only:
    - main
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all environment variables are set
   - Check for TypeScript errors
   - Ensure all dependencies are installed

2. **Runtime Errors**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check CORS configuration
   - Verify environment variables

3. **Performance Issues**
   - Analyze bundle size
   - Check for memory leaks
   - Optimize images and assets
   - Implement proper caching

### Debugging Commands

```bash
# Check build output
npm run build

# Analyze bundle
npm run analyze

# Check for security vulnerabilities
npm audit

# Check for unused dependencies
npx depcheck

# Check TypeScript errors
npm run type-check

# Run linting
npm run lint
```

### Log Analysis

```bash
# View application logs
vercel logs

# View build logs
vercel logs --build

# View function logs
vercel logs --function
```

### Performance Monitoring

```bash
# Lighthouse audit
npx lighthouse https://your-domain.com --output html

# Bundle analysis
npm run analyze

# Performance testing
npm run test:performance
```

## Best Practices

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Security headers implemented
- [ ] HTTPS enabled
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Health checks implemented
- [ ] Backup strategy in place
- [ ] Rollback plan prepared

### Security Checklist

- [ ] Content Security Policy configured
- [ ] XSS protection enabled
- [ ] CSRF protection implemented
- [ ] Input validation in place
- [ ] Secure headers configured
- [ ] Dependencies updated
- [ ] Secrets properly managed

### Performance Checklist

- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Caching strategy configured
- [ ] CDN configured
- [ ] Bundle size optimized
- [ ] Core Web Vitals monitored
- [ ] Performance budgets set

This deployment guide provides comprehensive coverage of deploying the Petroleum Management System frontend. For additional support or questions, please refer to the development team or create an issue in the project repository.
