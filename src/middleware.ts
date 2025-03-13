// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('adminAuthToken')?.value;
  
  // If accessing admin routes and not authenticated
  if (request.nextUrl.pathname.startsWith('/admin') && adminToken !== 'authenticated') {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};