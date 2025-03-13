// components/WorkplaceHoursDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { UserWithStats, DailySession } from '@/types';
import { LeaderboardEntry } from './ui/LeaderboardEntry';
import { DailySessionItem } from './ui/DailySessionItem';
import { format } from 'date-fns';
import Header from './ui/Header';

// Auto-refresh interval in milliseconds (1 hour)
const REFRESH_INTERVAL = 60 * 60 * 1000;

const WorkplaceHoursDashboard: React.FC = () => {
    const [leaderboardData, setLeaderboardData] = useState<UserWithStats[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    useEffect(() => {
      const checkAdminAuth = async () => {
        try {
          const response = await fetch('/api/admin/check-auth', {
            method: 'GET',
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            setIsAdminAuthenticated(data.authenticated);
          }
        } catch (error) {
          console.error('Error checking admin authentication:', error);
        }
      };
      
      checkAdminAuth();
    }, []);
  
    const [formattedDate, setFormattedDate] = useState<string>('');
    
    useEffect(() => {
      setFormattedDate(format(new Date(), 'EEE, MMMM d'));
    }, []);
    
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
      console.log(new Date().toISOString());
      const response = await fetch(`/api/leaderboard?date=${new Date()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setLeaderboardData(data.data);
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
    <div className="min-h-screen bg-background text-slate-800 font-sans" >
      <Header 
  activePage="dashboard" 
  isAdminAuthenticated={isAdminAuthenticated} 
/>

      {/* Hero Section */}
      <section className="bg-secondary text-background p-8 md:p-12 md:pt-30 h-[350px] rounded-b-[3rem] flex items-center">

        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black font-lexend mb-2">MIX<br/>Mastermind</h1>
        </div>

      </section>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row p-12 gap-8 h-full" >

        {/* Left Column - Leaderboard */}
        <div className="w-full lg:w-5/6">
          <div className="flex items-center gap-8 justify-between mb-8">
            <h2 className="text-3xl  font-bold flex items-center">
              <Award className="mr-2" size={30} />
                Leaderboard
            </h2>

            <span className='text-2xl text-gray-300'>|</span>

          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 rounded-lg">
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
              
              <div className='px-2 py-4 text-gray-600'>{formattedDate}</div>
              <div className="space-y-4">
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((entry, index) => (
                    <LeaderboardEntry
                      key={entry.id}
                      entry={entry}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-center text-gray-500">Failed to load leaderboard data. Please try again later.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Column - Stats */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-3xl p-6 shadow-sm h-full">
            <h3 className="text-xl font-bold mb-4">Upcoming Events:</h3>
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