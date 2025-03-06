// services/togglApi.ts
import { User, TogglMeResponse, TogglTimeEntry, UserWithStats, CurrentUserStats } from '../types';

// Base64 encode API token for authentication
const getAuthHeader = (apiToken: string): string => {
  return `Basic ${Buffer.from(`${apiToken}:api_token`).toString('base64')}`;
};

// Function to fetch user info from Toggl
export const fetchTogglUserInfo = async (apiToken: string): Promise<TogglMeResponse> => {
  try {
    const response = await fetch('https://api.track.toggl.com/api/v9/me', {
      headers: {
        'Authorization': getAuthHeader(apiToken),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Toggl user info:', error);
    throw error;
  }
};

// Function to fetch time entries from Toggl
export const fetchTimeEntries = async (
  apiToken: string, 
  startDate: string, 
  endDate: string
): Promise<TogglTimeEntry[]> => {
  try {
    const response = await fetch(
      `https://api.track.toggl.com/api/v9/me/time_entries?start_date=${startDate}&end_date=${endDate}`, {
      headers: {
        'Authorization': getAuthHeader(apiToken),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch time entries: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Toggl time entries:', error);
    throw error;
  }
};

// Calculate hours worked from time entries
export const calculateHoursWorked = (timeEntries: TogglTimeEntry[]): number => {
  const totalDurationInSeconds = timeEntries.reduce((total, entry) => {
    // If entry is running (no stop time), we calculate duration until now
    if (!entry.stop) {
      const startTime = new Date(entry.start).getTime();
      const now = new Date().getTime();
      return total + ((now - startTime) / 1000);
    }
    // For completed entries, use the duration field (which is in seconds)
    return total + Math.abs(entry.duration);
  }, 0);

  // Convert seconds to hours with 1 decimal point
  return Number((totalDurationInSeconds / 3600).toFixed(1));
};

// Function to get this week's start and end dates
export const getWeekDates = (): { startDate: string, endDate: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startDate = new Date(now);
  
  // Adjust to get Monday (1) as the start of the week
  // If today is Sunday (0), go back 6 days
  if (dayOfWeek === 0) {
    startDate.setDate(now.getDate() - 6);
  } else {
    // Otherwise go back (day of week - 1) days
    startDate.setDate(now.getDate() - (dayOfWeek - 1));
  }
  
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

// Generate a random online status for demo purposes
// In a real app, you would determine this based on recent activity
export const getRandomStatus = (): 'online' | 'away' | 'offline' => {
  const statuses: ('online' | 'away' | 'offline')[] = ['online', 'away', 'offline'];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};

// Process user data with Toggl stats
export const processUserWithTogglData = async (user: User): Promise<UserWithStats | null> => {
  try {
    const { startDate, endDate } = getWeekDates();
    const timeEntries = await fetchTimeEntries(user.apiToken, startDate, endDate);
    const hoursThisWeek = calculateHoursWorked(timeEntries);
    
    // Calculate achievement (difference from weekly target)
    const achievementValue = hoursThisWeek - user.weeklyTarget;
    const achievement = achievementValue >= 0 
      ? `+${achievementValue.toFixed(1)}` 
      : achievementValue.toFixed(1);
    
    // Format confirmed hours as "X/Y hours confirmed"
    const confirmedHours = `${Math.floor(hoursThisWeek)}/${user.weeklyTarget} hours confirmed`;
    
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar || "/api/placeholder/40/40",
      team: user.team,
      status: getRandomStatus(), // For demo, in production we'd determine this from activity
      hoursThisWeek,
      confirmedHours,
      weeklyTarget: user.weeklyTarget,
      achievement,
    };
  } catch (error) {
    console.error(`Error processing Toggl data for user ${user.name}:`, error);
    return null;
  }
};

// Calculate current user stats
export const calculateCurrentUserStats = (
  user: User, 
  timeEntries: TogglTimeEntry[]
): CurrentUserStats => {
  const hoursThisWeek = calculateHoursWorked(timeEntries);
  const hoursWorkedPercentage = Math.round((hoursThisWeek / user.weeklyTarget) * 100);
  
  // Get daily average by dividing by 5 work days
  const avgDailyHours = Number((hoursThisWeek / 5).toFixed(1));
  
  // This would come from project completion data in a real app
  // We're using a placeholder value here
  const projectCompletion = 85;
  
  return {
    name: user.name,
    avatar: user.avatar || "/api/placeholder/40/40",
    team: user.team,
    hoursThisWeek,
    weeklyTarget: user.weeklyTarget,
    hoursWorkedPercentage,
    projectCompletion,
    avgDailyHours,
  };
};