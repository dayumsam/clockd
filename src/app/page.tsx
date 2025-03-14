// app/tv-dashboard/page.tsx
'use client';

import WorkplaceHoursDashboard from '@/components/WorkplaceHoursDashboard';
import { useEffect } from 'react';

const REFRESH_INTERVAL = 1 * 60 * 1000; // 1 minute

export default function TVDashboard() {
  // Set up auto-refresh
  useEffect(() => {
    // Set up the refresh interval
    const intervalId = setInterval(() => {
      // Reload the page
      window.location.reload();
    }, REFRESH_INTERVAL);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <WorkplaceHoursDashboard />
  );
}