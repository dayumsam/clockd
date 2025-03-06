// app/api/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { getUsersWithStats } from '@/services/userService';
import { getUserById } from '@/services/userService';
import { getWeekDates, fetchTimeEntries, calculateCurrentUserStats } from '@/services/togglApi';

// GET endpoint to fetch all users with their Toggl stats
export async function GET() {
  try {
    const usersWithStats = await getUsersWithStats();
    
    return NextResponse.json({ 
      success: true, 
      data: usersWithStats 
    });
  } catch (error) {
    console.error('Error in leaderboard API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}