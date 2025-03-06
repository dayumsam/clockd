// components/ui/TimeChart.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface TimeChartProps {
  dailyHours: number[];
}

export const TimeChart: React.FC<TimeChartProps> = ({ dailyHours }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
  // Find max hours for scaling
  const maxHours = Math.max(...dailyHours, 8); // At least 8 hours for scale
  
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 w-full md:w-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Working time</h3>
        <button className="flex items-center space-x-1 text-sm">
          <span>Weekdays</span>
          <ChevronDown size={16} />
        </button>
      </div>
      
      <div className="flex justify-between items-end h-32 mb-2">
        {daysOfWeek.map((day, index) => {
          const heightPercentage = (dailyHours[index] / maxHours) * 100;
          const height = `${Math.max(10, heightPercentage)}%`;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-12 rounded-full ${
                  dailyHours[index] > 8 ? 'bg-orange-500' : 'bg-white bg-opacity-40'
                }`}
                style={{ height: `${height}` }}
              ></div>
              <div className="mt-2 text-sm">{day}</div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between text-sm px-2">
        {dailyHours.map((hours, index) => (
          <div key={index}>{hours}h</div>
        ))}
      </div>
    </div>
  );
};