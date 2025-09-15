import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
  // Skip middleware for public routes
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/init-db',
    '/api/migrate-data',
    '/api/migrate-notifications',
    '/api/jobs',
    '/api/create-demo-users',
    '/api/users',
    '/api/notifications',
    '/api/messages',
    '/api/load-report-templates',
    '/api/reports',
    '/api/report-templates',
    '/api/check-schema',
    '/api/migrate-reports-table',
    '/api/job-assignments',
    '/api/migrate-job-assignments',
    '/api/job-assignments/submit'
  ];
  
  // Check for dynamic routes
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith('/api/report-templates/') ||
    request.nextUrl.pathname.startsWith('/api/reports/') && request.nextUrl.pathname.includes('/generate-pdf');
    
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Skip middleware for non-API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Verify token for protected API routes
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Add user info to request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.userId.toString());
  requestHeaders.set('x-user-email', user.email);
  requestHeaders.set('x-user-role', user.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/api/:path*',
};


