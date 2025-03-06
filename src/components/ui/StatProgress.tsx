// components/ui/StatProgress.tsx
import React from 'react';

interface StatProgressProps {
  label: string;
  value: number;
  color: string;
}

export const StatProgress: React.FC<StatProgressProps> = ({ label, value, color }) => {
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full`} 
          style={{ width: `${Math.min(value, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};