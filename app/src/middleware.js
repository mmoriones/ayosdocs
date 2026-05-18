import { NextResponse } from 'next/server';

/**
 * Next.js Middleware for Host-based routing and Security.
 * - Redirects/Blocks /admin access on the main domain.
 * - Internal rewrites admin.ayosdocs.com to the /admin folder.
 */
export function middleware(request) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  
  console.log(`[Middleware] Host: ${host}, Path: ${url.pathname}`);

  // 1. Logic for admin.ayosdocs.com
  if (host.includes('admin.ayosdocs.com')) {
    // If the path is just '/', rewrite to internal '/admin'
    // If the path is something else, like '/users', rewrite to '/admin/users'
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // 2. Prevent access to /admin on the main ayosdocs.com domain
  // We use a regex or check if host DOES NOT start with 'admin.'
  if (!host.startsWith('admin.') && url.pathname.startsWith('/admin')) {
    // Return a 404 response internally
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

// Ensure middleware only runs on relevant paths for performance
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
