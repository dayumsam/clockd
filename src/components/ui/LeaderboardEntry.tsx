// components/ui/LeaderboardEntry.tsx
import React from 'react';
import { UserWithStats } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface LeaderboardEntryProps {
  entry: UserWithStats;
  index: number;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ entry, index }) => {
  return (
    <div className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="text-gray-500 font-medium">
          {String(index + 1).padStart(2, '0')}
        </div>
        
        <div className="relative">
          <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full" />
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
            entry.status === 'online' ? 'bg-green-500' : 
            entry.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
          } border-2 border-white`}></div>
        </div>
        
        <div>
          <div className="font-medium">{entry.name}</div>
          <div className="text-gray-500 text-sm">{entry.team}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm">
        <div className="text-gray-500">{entry.confirmedHours}</div>
        
        <div className={`flex items-center ${
          entry.achievement.startsWith('+') ? 'text-green-500' : 'text-red-500'
        }`}>
          {entry.achievement.startsWith('+') ? (
            <ArrowUpRight size={16} className="mr-1" />
          ) : (
            <ArrowUpRight size={16} className="mr-1 transform rotate-180" />
          )}
          {entry.achievement}h
        </div>
      </div>
    </div>
  );
};
