// app/tv-dashboard/page.tsx
import WorkplaceHoursDashboard from '@/components/WorkplaceHoursDashboard';
import { AutoRefresh } from '@/services/refreshService';

export default function TVDashboard() {
  return (
    <>
      {/* Auto-refresh component that will reload the page every hour */}
      <AutoRefresh intervalMinutes={60} />
      
      {/* Main dashboard component */}
      <WorkplaceHoursDashboard />
    </>
  );
}