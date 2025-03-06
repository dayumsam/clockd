
// components/ui/DailySessionItem.tsx
import React from 'react';
import { DailySession } from '@/types';

interface DailySessionItemProps {
  session: DailySession;
}

export const DailySessionItem: React.FC<DailySessionItemProps> = ({ session }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div className={`w-2 h-10 ${session.color} rounded-full mr-4`}></div>
        <div>
          <div className="font-medium">{session.name}</div>
          <div className="text-sm text-gray-500">{session.startTime} - {session.endTime}</div>
        </div>
      </div>
      <div className="text-lg font-medium">{session.duration}h</div>
    </div>
  );
};