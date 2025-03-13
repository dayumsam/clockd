// app/api/admin/auth/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// app/api/admin/logout/route.ts
export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete('adminAuthToken');
    return NextResponse.json({ success: true });
  }