// services/togglApi.ts
import { User, TogglMeResponse, TogglTimeEntry, UserWithStats} from '../types';

/**
 * Use API token directly without additional encoding
 * @param {string} apiToken - The API token for authentication
 * @returns {string} - The authorization header
 */
const getAuthHeader = (apiToken: string): string => {
  return `Basic ${apiToken}`;
};

/**
 * Fetch user info from Toggl
 * @param {string} apiToken - The API token for authentication
 * @returns {Promise<TogglMeResponse>} - The user info response from Toggl
 * @throws Will throw an error if the fetch operation fails
 */
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

/**
 * Fetch time entries from Toggl
 * @param {string} apiToken - The API token for authentication
 * @param {string} startDate - The start date for fetching time entries
 * @returns {Promise<TogglTimeEntry[]>} - The time entries response from Toggl
 * @throws Will throw an error if the fetch operation fails
 */
export const fetchTimeEntries = async (
  apiToken: string, 
  startDate: string, 
): Promise<TogglTimeEntry[]> => {
  try {
    const response = await fetch(
      `https://api.track.toggl.com/api/v9/me/time_entries?start_date=${startDate}`, {
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

/**
 * Get today's start and end timestamps in the client's timezone in RFC3339 format and then converted into seconds
 * @param {string} timezone - The client's timezone
 * @returns {Object} - An object containing start and end timestamps in seconds
 */
export const getTodayTimestamps = (timezone: string): { startTimestamp: number, endTimestamp: number } => {
  const now = new Date();
  now.setHours(0, 0, 0, 0)
  const startOfDay = new Date(now.toLocaleString('en-US', { timeZone: timezone }));

  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  const startTimestampRFC3339 = startOfDay.toISOString();
  const endTimestampRFC3339 = endOfDay.toISOString();

  return {
    startTimestamp: Math.floor(new Date(startTimestampRFC3339).getTime() / 1000),
    endTimestamp: Math.floor(new Date(endTimestampRFC3339).getTime() / 1000),
  };
};

/**
 * Fetch time entries for today from Toggl
 * @param {string} apiToken - The API token for authentication
 * @param {string} timezone - The client's timezone
 * @returns {Promise<TogglTimeEntry[]>} - The time entries response from Toggl
 * @throws Will throw an error if the fetch operation fails
 */
export const fetchTodayTimeEntries = async (
  apiToken: string,
  timezone: string
): Promise<TogglTimeEntry[]> => {
  const { startTimestamp, endTimestamp } = getTodayTimestamps(timezone);

  try {
    const response = await fetch(
      `https://api.track.toggl.com/api/v9/me/time_entries?since=${startTimestamp}&until=${endTimestamp}`, {
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

/**
 * Calculate hours worked from time entries
 * @param timeEntries List of time entries from Toggl API
 * @returns Number of hours worked with 1 decimal place
 */
export const calculateHoursWorkedToday = (timeEntries: TogglTimeEntry[]): number => {
  // Calculate total duration in seconds
  const totalDurationInSeconds = timeEntries.reduce((total, entry) => {
    if (!entry.stop || entry.duration < 0) {
      const startTime = new Date(entry.start).getTime();
      const now = new Date().getTime();
      return total + ((now - startTime) / 1000);
    }
    return total + Math.abs(entry.duration);
  }, 0);

  // Convert to decimal hours with 1 decimal place
  return Number((totalDurationInSeconds / 3600).toFixed(1));
};

/**
 * Calculate and format time worked today as hours:minutes
 * @param timeEntries List of time entries from Toggl API
 * @returns Formatted string in hours:minutes format (e.g. "0:28" or "1:45")
 */
export const formatTimeWorkedToday = (timeEntries: TogglTimeEntry[]): string => {
  // Calculate total duration in seconds
  const totalDurationInSeconds = timeEntries.reduce((total, entry) => {
    if (!entry.stop || entry.duration < 0) {
      const startTime = new Date(entry.start).getTime();
      const now = new Date().getTime();
      return total + ((now - startTime) / 1000);
    }
    return total + Math.abs(entry.duration);
  }, 0);

  // Convert to hours and minutes
  const totalMinutes = Math.floor(totalDurationInSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  // Format as hours:minutes with leading zero for minutes if needed
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Calculate and return both numeric hours and formatted time
 * @param timeEntries List of time entries from Toggl API
 * @returns Object with hours (decimal) and formatted (hours:minutes)
 */
export const getTimeWorkedToday = (timeEntries: TogglTimeEntry[]): { 
  hours: number; 
  formatted: string; 
} => {
  // Calculate total duration in seconds
  const totalDurationInSeconds = timeEntries.reduce((total, entry) => {
    if (!entry.stop || entry.duration < 0) {
      const startTime = new Date(entry.start).getTime();
      const now = new Date().getTime();
      return total + ((now - startTime) / 1000);
    }
    return total + Math.abs(entry.duration);
  }, 0);

  // Convert to decimal hours (with 1 decimal place)
  const hours = Number((totalDurationInSeconds / 3600).toFixed(1));
  
  // Convert to hours:minutes format
  const totalMinutes = Math.floor(totalDurationInSeconds / 60);
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formatted = `${wholeHours}:${minutes.toString().padStart(2, '0')}`;
  
  return { hours, formatted };
};

/**
 * Process user data with Toggl stats
 * @param {User} user - The user object
 * @param {string} timezone - The client's timezone
 * @returns {Promise<UserWithStats | null>} - The user object with stats or null if an error occurs
 */
export const processUserWithTogglData = async (user: User, timezone: string): Promise<UserWithStats | null> => {
  try {
    const timeEntries = await fetchTodayTimeEntries(user.apiToken, timezone);
    const timeWorked = getTimeWorkedToday(timeEntries);

    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar || "/api/placeholder/40/40",
      company: user.company,
      status: getRandomStatus(),
      hoursThisWeek: timeWorked.hours,
      progress: `+${timeWorked.hours.toFixed(1)}`,
    };
  } catch (error) {
    console.error(`Error processing Toggl data for user ${user.name}:`, error);
    return null;
  }
};

/**
 * Generate a random online status for demo purposes
 * @returns {'online' | 'away' | 'offline'} - The random status
 */
export const getRandomStatus = (): 'online' | 'away' | 'offline' => {
  const statuses: ('online' | 'away' | 'offline')[] = ['online', 'away', 'offline'];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};