import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityHeaders } from '@/lib/security';

// Tenant resolution strategies
function resolveTenantFromRequest(request: NextRequest): string | null {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Strategy 1: Subdomain-based (tenant.petromanager.com)
  if (hostname.includes('.')) {
    const subdomain = hostname.split('.')[0];
    if (
      subdomain !== 'www' &&
      subdomain !== 'app' &&
      subdomain !== 'localhost'
    ) {
      return subdomain;
    }
  }

  // Strategy 2: Path-based (/tenant/...)
  const pathMatch = pathname.match(/^\/([^\/]+)/);
  if (pathMatch && pathMatch[1] !== 'api' && pathMatch[1] !== '_next') {
    return pathMatch[1];
  }

  // Strategy 3: Custom domain (check against known custom domains)
  if (hostname !== 'localhost' && !hostname.includes('petromanager.com')) {
    // For now, use the full hostname as tenant ID for custom domains
    return hostname.replace(/\./g, '-');
  }

  return null;
}

// Validate tenant ID format
function isValidTenantId(tenantId: string): boolean {
  // Basic validation: alphanumeric, hyphens, underscores only
  return (
    /^[a-zA-Z0-9-_]+$/.test(tenantId) &&
    tenantId.length > 0 &&
    tenantId.length <= 50
  );
}

// Security headers for tenant isolation
function addSecurityHeaders(
  response: NextResponse,
  tenantId: string
): NextResponse {
  // Add tenant-specific security headers
  response.headers.set('X-Tenant-ID', tenantId);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy with tenant isolation
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.petromanager.com; frame-ancestors 'none';`
  );

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tenantId = resolveTenantFromRequest(request);

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/manifest.json')
  ) {
    return NextResponse.next();
  }

  // Create response
  const response = NextResponse.next();

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-CSRF-Token, X-Tenant-ID'
    );
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: response.headers });
  }

  // Handle tenant resolution
  if (tenantId) {
    // Validate tenant ID
    if (!isValidTenantId(tenantId)) {
      return new NextResponse('Invalid tenant identifier', { status: 400 });
    }

    // Add tenant context to headers
    response.headers.set('X-Tenant-ID', tenantId);

    // Add security headers
    return addSecurityHeaders(response, tenantId);
  }

  // Handle root domain access
  if (pathname === '/' || pathname === '') {
    // Redirect to default tenant or tenant selection page
    return NextResponse.redirect(new URL('/tenant-selection', request.url));
  }

  // Handle tenant-specific routes - all routes are now under [tenant]
  if (
    pathname.startsWith('/') &&
    pathname !== '/' &&
    pathname !== '/tenant-selection'
  ) {
    const pathParts = pathname.split('/');
    if (pathParts.length >= 2) {
      const extractedTenantId = pathParts[1];

      if (!isValidTenantId(extractedTenantId)) {
        return new NextResponse('Invalid tenant identifier', { status: 400 });
      }

      // Add tenant context to headers
      response.headers.set('X-Tenant-ID', extractedTenantId);

      return addSecurityHeaders(response, extractedTenantId);
    }
  }

  // Default response
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
