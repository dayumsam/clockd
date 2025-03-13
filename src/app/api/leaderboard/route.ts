// app/api/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { getUsersWithStats } from '@/services/userService';

export async function GET() {
  try {
    const usersWithStats = await getUsersWithStats('America/New_York'); // Pass the timezone
    return NextResponse.json({ 
      success: true, 
      data: usersWithStats 
    });
  } catch (error) {
    console.error('Error in leaderboard API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch leaderboard data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}