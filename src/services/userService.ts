// services/userService.ts
import { User } from '../types';
import { processUserWithTogglData } from './togglApi';

// Get users from database
export const getUsers = async (): Promise<User[]> => {
  // This would typically fetch from a database
  // For now, we're returning mock data
  return [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      avatar: '/api/placeholder/40/40',
      team: 'Design Team',
      apiToken: 'api_token_1',
      weeklyTarget: 40,
      isActive: true,
    },
    {
      id: '2',
      name: 'David Chen',
      email: 'david.chen@example.com',
      avatar: '/api/placeholder/40/40',
      team: 'Development',
      apiToken: 'api_token_2',
      weeklyTarget: 40,
      isActive: true,
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@example.com',
      avatar: '/api/placeholder/40/40',
      team: 'Marketing',
      apiToken: 'api_token_3',
      weeklyTarget: 40,
      isActive: true,
    },
    {
      id: '4',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      avatar: '/api/placeholder/40/40',
      team: 'Customer Support',
      apiToken: 'api_token_4',
      weeklyTarget: 40,
      isActive: true,
    },
    {
      id: '5',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      avatar: '/api/placeholder/40/40',
      team: 'Product',
      apiToken: 'api_token_5',
      weeklyTarget: 40,
      isActive: true,
    },
  ];
};

// Get users with their Toggl stats
export const getUsersWithStats = async () => {
  try {
    const users = await getUsers();
    const activeUsers = users.filter(user => user.isActive);
    
    const userStatsPromises = activeUsers.map(user => processUserWithTogglData(user));
    const userStatsResults = await Promise.all(userStatsPromises);
    
    // Filter out null results (users whose data couldn't be fetched)
    const userStats = userStatsResults.filter(result => result !== null);
    
    // Sort by hours worked in descending order
    return userStats.sort((a, b) => {
      if (a && b) {
        return b.hoursThisWeek - a.hoursThisWeek;
      }
      return 0;
    });
  } catch (error) {
    console.error('Error fetching users with stats:', error);
    throw error;
  }
};

// Get a specific user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  const users = await getUsers();
  return users.find(user => user.id === userId) || null;
};

// In a real app, you would have functions to:
// - createUser
// - updateUser
// - deleteUser
// - updateUserApiToken
// etc.