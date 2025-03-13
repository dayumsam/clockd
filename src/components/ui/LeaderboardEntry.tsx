// components/ui/LeaderboardEntry.tsx
import React from 'react';
import Image from 'next/image'
import { UserWithStats } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface LeaderboardEntryProps {
  entry: UserWithStats;
  index: number;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ entry, index }) => {
  return (
    <div className="bg-white rounded-3xl py-4 px-8 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-8">
        <div className="text-gray-500 text-3xl font-bold font-oswald">
          {String(index + 1).padStart(2, '0')}
        </div>

        <span className='text-2xl text-gray-300'>|</span>

        
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
        </div>
        
        <div>
          <div className="font-medium text-xl font-lexend">{entry.name}</div>
          <div className="text-gray-500 text-sm">{entry.company}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm">
        <div className="text-gray-500 text-2xl font-bold text-secondary font-oswald">{entry.hoursThisWeek} hrs</div>
        
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
