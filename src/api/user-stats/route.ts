// app/api/user-stats/[userId]/route.ts
export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
  ) {
    try {
      const { userId } = params;
      const user = await getUserById(userId);
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      
      const { startDate, endDate } = getWeekDates();
      const timeEntries = await fetchTimeEntries(user.apiToken, startDate, endDate);
      const userStats = calculateCurrentUserStats(user, timeEntries);
      
      return NextResponse.json({ 
        success: true, 
        data: userStats 
      });
    } catch (error) {
      console.error('Error in user stats API:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user stats' },
        { status: 500 }
      );
    }
  }