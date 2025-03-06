// components/WorkplaceHoursDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Award, Briefcase, ArrowUpRight, ChevronDown, Search } from 'lucide-react';
import { UserWithStats, CurrentUserStats, DailySession } from '@/types';
import { LeaderboardEntry } from './ui/LeaderboardEntry';
import { StatProgress } from './ui/StatProgress';
import { DailySessionItem } from './ui/DailySessionItem';
import { TimeChart } from './ui/TimeChart';

import Header from './ui/Header';

// Auto-refresh interval in milliseconds (1 hour)
const REFRESH_INTERVAL = 60 * 60 * 1000;

const WorkplaceHoursDashboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<UserWithStats[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Display current date
  const currentDate = new Date();
  const options = { weekday: 'short', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions;
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  
  // Sample daily hours for the chart
  const dailyHours = [7.5, 8.2, 9.0, 7.2, 8.3];
  
  // Sample daily sessions
  const dailySessions: DailySession[] = [
    {
      name: 'Morning Session',
      startTime: '9:00',
      endTime: '12:30',
      duration: 3.5,
      color: 'bg-blue-500',
    },
    {
      name: 'Afternoon Session',
      startTime: '13:30',
      endTime: '18:00',
      duration: 4.5,
      color: 'bg-green-500',
    },
  ];

  // Fetch leaderboard data
  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/leaderboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setLeaderboardData(data.data);
        
        // For demo purposes, we're using the first user as the current user
        // In a real app, you would fetch the current user's data specifically
        if (data.data.length > 0) {
          await fetchCurrentUserStats('5'); // Hardcoded user ID for demo
        }
      } else {
        throw new Error(data.error || 'Failed to fetch leaderboard data');
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load leaderboard data. Please try again later.');
      console.error('Error fetching leaderboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch current user stats
  const fetchCurrentUserStats = async (userId: string) => {
    try {
      const response = await fetch(`/api/user-stats/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCurrentUser(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch user stats');
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
      // We don't set the main error state here to still show the leaderboard
    }
  };

  // Initial data fetch and set up auto-refresh
  useEffect(() => {
    fetchLeaderboardData();
    
    // Set up auto-refresh
    const intervalId = setInterval(() => {
      fetchLeaderboardData();
    }, REFRESH_INTERVAL);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-blue-50 min-h-screen text-slate-800 font-sans">
      {/* Header */}
      <Header currentUser={currentUser} activePage="dashboard" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-400 to-green-400 text-white p-8 md:p-12 h-[500px] rounded-b-3xl flex items-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-bold mb-2">MIX<br/>Mastermind</h1>
          {currentUser && (
            <>
              <div className="flex space-x-6 my-6">
                <div className="flex items-center space-x-1">
                  <Clock size={18} />
                  <span>{currentUser.hoursThisWeek}h</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase size={18} />
                  <span>{currentUser.weeklyTarget}h</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award size={18} />
                  <span>{currentUser.projectCompletion}%</span>
                </div>
              </div>
              <div className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <div className="flex items-center space-x-2">
                  <Award size={16} />
                  <span>{currentUser.hoursWorkedPercentage >= 100 ? 'Productive' : 'In Progress'}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Time chart */}
        <div className="absolute right-12 bottom-12 hidden lg:block">
          <TimeChart dailyHours={dailyHours} />
        </div>
      </section>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row p-4 gap-4">
        {/* Left Column - Leaderboard */}
        <div className="w-full lg:w-2/3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Award className="mr-2" size={20} />
              Hours leaderboard
            </h2>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search members..."
                  className="bg-white rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button className="text-gray-500">See more</button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading leaderboard data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          ) : (
            <>
              {/* Leaderboard entries */}
              <div className="space-y-2">
                {leaderboardData.map((entry, index) => (
                  <LeaderboardEntry
                    key={entry.id}
                    entry={entry}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column - Stats */}
        <div className="w-full lg:w-1/3">
          {currentUser && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                <span>Your Stats</span>
                <ChevronDown size={20} className="text-gray-500" />
              </h3>

              <div className="relative mb-6">
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{currentUser.hoursThisWeek}h</div>
                    <div className="text-sm text-gray-500">This week</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <StatProgress 
                  label="Weekly target" 
                  value={currentUser.hoursWorkedPercentage} 
                  color="bg-green-500" 
                />

                <StatProgress 
                  label="Project completion" 
                  value={currentUser.projectCompletion} 
                  color="bg-blue-500" 
                />

                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Daily average</div>
                      <div className="text-2xl font-bold">{currentUser.avgDailyHours}h</div>
                    </div>
                    <div className="text-sm text-green-500 flex items-center">
                      <ArrowUpRight size={16} className="mr-1" />
                      +0.5h
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg p-6 shadow-sm mt-4">
            <h3 className="text-xl font-bold mb-4">Today: {formattedDate}</h3>
            <div className="space-y-4">
              {dailySessions.map((session, index) => (
                <DailySessionItem key={index} session={session} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkplaceHoursDashboard;