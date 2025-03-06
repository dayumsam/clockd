'use client'

// services/refreshService.ts
// This service is responsible for refreshing data automatically with a full page reload
// Useful for a dashboard that's displayed on a TV and doesn't need user interaction

export const setupAutoRefresh = (intervalMinutes: number = 60) => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Convert minutes to milliseconds
    const interval = intervalMinutes * 60 * 1000;
    
    // Set up the refresh interval
    const intervalId = setInterval(() => {
      // Reload the page
      window.location.reload();
    }, interval);
    
    // Return the interval ID so it can be cleared if needed
    return intervalId;
  };
  
  // Component to enable auto-refresh functionality
  import { useEffect } from 'react';
  
  interface AutoRefreshProps {
    intervalMinutes?: number;
  }
  
  export const AutoRefresh: React.FC<AutoRefreshProps> = ({ 
    intervalMinutes = 60 // Default to refresh every hour
  }) => {
    useEffect(() => {
      const intervalId = setupAutoRefresh(intervalMinutes);
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [intervalMinutes]);
    
    // This component doesn't render anything
    return null;
  };