// utils/timeUtils.ts

/**
 * Formats a decimal hours value to hours and minutes (e.g., "8:27" instead of "8.45")
 * @param hours Decimal hours value
 * @returns Formatted string in "H:MM" format
 */
export const formatHoursToHoursMinutes = (hours: number): string => {
    if (isNaN(hours) || hours < 0) {
      return '0:00';
    }
    
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
   * Formats seconds to hours and minutes (e.g., "8:27" instead of "8.45")
   * @param seconds Total seconds
   * @returns Formatted string in "H:MM" format
   */
  export const formatSecondsToHoursMinutes = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) {
      return '0:00';
    }
    
    const hours = seconds / 3600;
    return formatHoursToHoursMinutes(hours);
  };
  
  /**
   * Converts hours:minutes format to decimal hours
   * @param timeString Time string in format "H:MM" or "HH:MM"
   * @returns Decimal hours as a number
   */
  export const hoursMinutesToDecimal = (timeString: string): number => {
    // Handle empty or invalid input
    if (!timeString || !timeString.includes(':')) {
      return 0;
    }
    
    const [hoursStr, minutesStr] = timeString.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return 0;
    }
    
    return hours + (minutes / 60);
  };
  
  /**
   * Converts milliseconds to a human-readable duration string
   * @param ms Milliseconds
   * @param includeSeconds Whether to include seconds in the output
   * @returns Formatted duration string (e.g., "2h 15m" or "2h 15m 30s")
   */
  export const formatDuration = (ms: number, includeSeconds = false): string => {
    if (isNaN(ms) || ms < 0) {
      return '0m';
    }
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    
    let result = '';
    
    if (hours > 0) {
      result += `${hours}h `;
    }
    
    if (remainingMinutes > 0 || hours === 0) {
      result += `${remainingMinutes}m`;
    }
    
    if (includeSeconds && remainingSeconds > 0) {
      result += ` ${remainingSeconds}s`;
    }
    
    return result.trim();
  };
  
  /**
   * Adds two time strings in "H:MM" format
   * @param time1 First time string
   * @param time2 Second time string
   * @returns Result of addition in "H:MM" format
   */
  export const addTimes = (time1: string, time2: string): string => {
    const decimal1 = hoursMinutesToDecimal(time1);
    const decimal2 = hoursMinutesToDecimal(time2);
    return formatHoursToHoursMinutes(decimal1 + decimal2);
  };
  
  /**
   * Converts a date object to a time string in "HH:MM" format
   * @param date Date object
   * @returns Time string in "HH:MM" format
   */
  export const formatTimeFromDate = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  /**
   * Calculates the time difference between two Date objects or ISO strings
   * @param start Start date (Date object or ISO string)
   * @param end End date (Date object or ISO string)
   * @returns Formatted duration in "H:MM" format
   */
  export const calculateTimeDifference = (
    start: Date | string,
    end: Date | string
  ): string => {
    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);
    
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffSeconds = diffMs / 1000;
    const diffHours = diffSeconds / 3600;
    
    return formatHoursToHoursMinutes(diffHours);
  };
  
  /**
   * Formats the time as a human-readable string based on the value
   * @param hours Decimal hours
   * @returns Formatted string (e.g., "2h 15m" or "15m" if less than an hour)
   */
  export const formatHoursHumanReadable = (hours: number): string => {
    if (isNaN(hours) || hours < 0) {
      return '0m';
    }
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes}m`;
    }
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    
    return `${wholeHours}h ${minutes}m`;
  };