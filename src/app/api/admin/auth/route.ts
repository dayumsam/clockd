// app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

/**
 * API route for admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { password } = data;
    
    // Get the admin password from environment variables
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Check if the password matches
    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Create a secure token
    const token = crypto.randomBytes(32).toString('hex');
    
    // In a production environment, you would store this token in a database
    // with an expiration time and associate it with the admin user
    
    // Set the cookie with the token
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'adminAuthToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'strict',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in admin auth API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}