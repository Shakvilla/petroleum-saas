# Authentication System Deployment Guide

## Overview

This guide covers the deployment of the authentication system for the petroleum management platform, including environment setup, security configuration, and monitoring.

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL or MySQL database
- Redis for session storage and rate limiting
- SSL certificate for HTTPS
- Domain name with DNS configuration

## Environment Setup

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Application
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-here

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/petroleum_saas

# Redis
REDIS_URL=redis://localhost:6379
RATE_LIMIT_REDIS_URL=redis://localhost:6379

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
ENCRYPTION_KEY=your-32-character-encryption-key
JWT_SECRET=your-jwt-secret-key
CSRF_SECRET=your-csrf-secret-key

# CDN/Storage
CDN_URL=https://cdn.your-domain.com
UPLOAD_MAX_SIZE=10485760

# Monitoring
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id
```

### 2. Database Setup

#### PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_name VARCHAR(200),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  logo_url VARCHAR(500),
  primary_color VARCHAR(7),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_domain ON tenants(domain);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### 3. Redis Configuration

```redis
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

## Security Configuration

### 1. SSL/TLS Setup

#### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Firewall Configuration

```bash
# UFW rules
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5432/tcp  # PostgreSQL (restrict to specific IPs)
ufw allow 6379/tcp  # Redis (restrict to specific IPs)
ufw enable
```

### 3. Rate Limiting

#### Nginx Rate Limiting

```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=register:10m rate=3r/h;
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

# Apply rate limiting
location /auth/login {
    limit_req zone=login burst=5 nodelay;
    proxy_pass http://localhost:3000;
}

location /auth/register {
    limit_req zone=register burst=3 nodelay;
    proxy_pass http://localhost:3000;
}

location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://localhost:3000;
}
```

## Deployment Process

### 1. Build Application

```bash
# Install dependencies
npm ci

# Build application
npm run build

# Run tests
npm test
npm run test:e2e

# Lint and format
npm run lint
npm run format
```

### 2. Database Migration

```bash
# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 3. Deploy to Production

#### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

#### PM2 Ecosystem Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'petroleum-saas',
      script: 'npm',
      args: 'start',
      cwd: '/path/to/your/app',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
    },
  ],
};
```

#### Using Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/petroleum_saas
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=petroleum_saas
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Monitoring and Logging

### 1. Application Monitoring

#### Sentry Configuration

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

### 2. Log Management

#### Winston Configuration

```javascript
// lib/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'petroleum-saas' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
```

### 3. Health Checks

```javascript
// pages/api/health.js
export default function handler(req, res) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version,
  };

  res.status(200).json(health);
}
```

## Backup and Recovery

### 1. Database Backup

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="petroleum_saas"

# Create backup
pg_dump $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Database backup completed: db_backup_$DATE.sql.gz"
```

### 2. Automated Backup

```bash
# Add to crontab
0 2 * * * /path/to/backup-db.sh
```

## Performance Optimization

### 1. CDN Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/auth/:path*',
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

### 2. Caching Strategy

```javascript
// lib/cache.js
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  async get(key) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key, value, ttl = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key) {
    await redis.del(key);
  },
};
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check database URL format
   - Verify database server is running
   - Check firewall rules

2. **Redis Connection Issues**
   - Verify Redis server is running
   - Check Redis URL format
   - Verify Redis configuration

3. **SSL Certificate Issues**
   - Check certificate validity
   - Verify certificate chain
   - Check Nginx configuration

4. **Rate Limiting Issues**
   - Check Redis connection
   - Verify rate limit configuration
   - Monitor rate limit logs

### Debug Commands

```bash
# Check application status
pm2 status

# View application logs
pm2 logs petroleum-saas

# Check database connection
psql $DATABASE_URL -c "SELECT 1"

# Check Redis connection
redis-cli ping

# Check SSL certificate
openssl x509 -in certificate.crt -text -noout

# Check Nginx configuration
nginx -t

# Check firewall status
ufw status
```

## Maintenance

### Regular Tasks

1. **Weekly**
   - Review security logs
   - Check performance metrics
   - Update dependencies

2. **Monthly**
   - Review audit logs
   - Check certificate expiration
   - Update security patches

3. **Quarterly**
   - Security audit
   - Performance review
   - Backup testing

### Update Process

```bash
# 1. Backup current version
cp -r /app /app.backup.$(date +%Y%m%d)

# 2. Pull latest changes
git pull origin main

# 3. Install dependencies
npm ci

# 4. Run migrations
npm run db:migrate

# 5. Build application
npm run build

# 6. Restart application
pm2 restart petroleum-saas

# 7. Verify deployment
curl -f http://localhost:3000/api/health
```

This deployment guide ensures a secure, scalable, and maintainable authentication system for your petroleum management platform.
