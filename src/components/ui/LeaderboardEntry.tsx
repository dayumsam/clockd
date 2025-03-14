// components/ui/LeaderboardEntry.tsx
import React from 'react';
import Image from 'next/image'
import { UserWithStats } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { formatHoursHumanReadable } from '@/utils/timeUtils';

interface LeaderboardEntryProps {
  entry: UserWithStats;
  index: number;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ entry, index }) => {
  const readableTime = formatHoursHumanReadable(entry.hoursToday);
  
  // Position styling logic
  const getPositionStyle = (position: number) => {
    switch(position) {
      case 0: // 1st place
        return "text-amber-500 bg-amber-50"; // Gold
      case 1: // 2nd place
        return "text-slate-400 bg-slate-50"; // Silver
      case 2: // 3rd place
        return "text-amber-700 bg-amber-50"; // Bronze
      default:
        return "text-gray-500 bg-white"; // Default
    }
  };
  
  const positionStyle = getPositionStyle(index);
  const isTopThree = index < 3;

  return (
    <div className={`bg-white rounded-3xl py-4 px-8 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow border-l-4 border-secondary ${isTopThree ? ' border-' + (index === 0 ? 'amber-500' : index === 1 ? 'slate-400' : 'amber-700') : ''}`}>
      <div className="flex items-center space-x-8">
        <div className={`${positionStyle} text-3xl font-bold font-oswald rounded-full ${isTopThree ? 'w-12 h-12 flex items-center justify-center' : ''}`}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {!isTopThree && <span className='text-2xl text-gray-300'>|</span>}

        <div className="relative">
          <Image
            src={entry.avatar || "./temp.png"}
            width={500}
            height={500}
            alt="User Image"
            className='w-12 h-12 rounded-full'
          />
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
            entry.status === 'online' ? 'bg-green-500' : 
            entry.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
          } border-2 border-white`}></div>
          
          {isTopThree && (
            <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
              index === 0 ? 'bg-amber-500' : 
              index === 1 ? 'bg-slate-400' : 
              'bg-amber-700'
            } text-white text-xs font-bold`}>
              {index + 1}
            </div>
          )}
        </div>
        
        <div>
          <div className="font-medium text-xl font-lexend capitalize">{entry.name}</div>
          <div className="text-gray-500 text-sm">{entry.company}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm">
        <div className={`text-2xl font-bold font-oswald ${isTopThree ? (index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : 'text-amber-700') : 'text-secondary'}`}>
          {readableTime}
        </div>
        
        <div className={`flex items-center ${
          entry.progress.startsWith('+') ? 'text-green-500' : 'text-red-500'
        }`}>
          {entry.progress.startsWith('+') ? (
            <ArrowUpRight size={16} className="mr-1" />
          ) : (
            <ArrowUpRight size={16} className="mr-1 transform rotate-180" />
          )}
          {entry.progress}h
        </div>
      </div>
    </div>
  );
};