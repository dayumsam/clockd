// services/togglApi.ts
import { User, TogglMeResponse, TogglTimeEntry, UserWithStats} from '../types';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';
import { togglTesting } from '../config/testingConfig';

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

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
 * Get today's start and end timestamps in the client's timezone, converted to UTC and returned as seconds since epoch
 * @param {string} timezone - The client's timezone (e.g., 'America/New_York', 'Europe/London')
 * @returns {Object} - An object containing start and end timestamps in seconds
 */
export const getTodayTimestamps = (timezone: string): { startTimestamp: number, endTimestamp: number } => {
  // Get today's date in the specified timezone
  const todayInTimezone = dayjs().tz(timezone);
  
  // Create start of day (00:00:00) in the specified timezone
  const startOfDayInTimezone = todayInTimezone.startOf('day');
  
  // Create end of day (23:59:59.999) in the specified timezone
  const endOfDayInTimezone = todayInTimezone.endOf('day');
  
  if (process.env.NODE_ENV === 'development' && togglTesting.logTimestamps) {
    console.table({
      'Server time': dayjs().format(),
      [`Today in ${timezone}`]: todayInTimezone.format(),
      [`Start of day in ${timezone}`]: startOfDayInTimezone.format(),
      [`End of day in ${timezone}`]: endOfDayInTimezone.format(),
      'Start of day in UTC': startOfDayInTimezone.utc().format(),
      'End of day in UTC': endOfDayInTimezone.utc().format(),
    });
  }
  
  // Convert to UTC and then to seconds since epoch
  return {
    startTimestamp: Math.floor(startOfDayInTimezone.valueOf() / 1000),
    endTimestamp: Math.floor(endOfDayInTimezone.valueOf() / 1000),
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

  if (process.env.NODE_ENV === 'development' && togglTesting.logApiUrls) {
    console.log(`https://api.track.toggl.com/api/v9/me/time_entries?since=${startTimestamp}&until=${endTimestamp}`);
  }
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
 * Formats a decimal hours value to hours and minutes (e.g., "8:27" instead of "8.45")
 * @param hours Decimal hours value
 * @returns Formatted string in "H:MM" format
 */
export const formatHoursToHoursMinutes = (hours: number): string => {
  // Calculate whole hours and remaining minutes
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  // Handle case where minutes round up to 60
  if (minutes === 60) {
    return `${wholeHours + 1}:00`;
  }
  
  // Return formatted string with padding for minutes
  return `${wholeHours}:${minutes.toString().padStart(2, '0')}`;
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

  if (process.env.NODE_ENV === 'development' && togglTesting.logTimeEntries) {
    console.table(timeEntries);
  }
  
  // Calculate total duration in seconds
  const totalDurationInSeconds = timeEntries.reduce((total, entry) => {
    if (!entry.stop || entry.duration < 0) {
      const startTime = new Date(entry.start).getTime();
      const now = new Date().getTime();
      return total + ((now - startTime) / 1000);
    }
    return total + Math.abs(entry.duration);
  }, 0);

  // Convert to decimal hours 
  const hours = totalDurationInSeconds / 3600;
  
  // Format as hours:minutes
  const formatted = formatHoursToHoursMinutes(hours);

  if (process.env.NODE_ENV === 'development' && togglTesting.logHoursWorked) {
    console.log(`Total hours worked today: ${hours} (${formatted})`);
  }
  
  return { 
    hours, 
    formatted 
  };
};

/**
 * Determines if a user is active based on their time entries
 * @param timeEntries Array of time entries
 * @returns 'online' if there's an active entry, 'away' otherwise
 */
export const getUserActiveStatus = (timeEntries: TogglTimeEntry[]): 'online' | 'away' | 'offline' => {
  // Check if there's any time entry without a stop time (active time entry)
  const hasActiveEntry = timeEntries.some(entry => !entry.stop);
  
  // Return 'online' if there's an active entry, 'away' otherwise
  return hasActiveEntry ? 'online' : 'away';
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

     // Determine user status based on active time entries
     const status = getUserActiveStatus(timeEntries);

    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar || "/api/placeholder/40/40",
      company: user.company,
      status: status,
      hoursToday: timeWorked.hours,
      hoursThisWeek: timeWorked.hours,
      progress: `+${timeWorked.hours.toFixed(1)}`,
    };
  } catch (error) {
    console.error(`Error processing Toggl data for user ${user.name}:`, error);
    return null;
  }
};
