// app/api/admin/check-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the token from the cookies in the request
  const adminToken = request.cookies.get('adminAuthToken')?.value;

  // If no token is found or the token is invalid, return unauthorized
  if (!adminToken) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
  // Return authenticated: true if token is present and valid
  return NextResponse.json({ authenticated: true });
}