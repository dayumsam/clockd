// services/userService.ts
import { User, UserWithStats } from '../types';
import { processUserWithTogglData } from './togglApi';
import { supabase } from '../config/supabaseClient';
import { decrypt } from '../config/encryption';

// Get users from database
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('isactive', true);
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    // Transform data to match User type
    return data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 10) + 1}`,
      company: user.company || 'N/A',
      apiToken: user.apitoken,
      isActive: user.isactive
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

// Get users with their Toggl stats
export const getUsersWithStats = async (timezone: string): Promise<UserWithStats[]> => {
  try {
    const users = await getUsers();
    
    // Decrypt API tokens and process with Toggl
    const userStatsPromises = users.map(user => {
      // Decrypt the API token before passing to Toggl
      const decryptedUser = {
        ...user,
        apiToken: decrypt(user.apiToken)
      };
      
      return processUserWithTogglData(decryptedUser, timezone);
    });
    
    const userStatsResults = await Promise.allSettled(userStatsPromises);
    
    // Filter out rejected promises and null results
    const userStats = userStatsResults
      .filter((result): result is PromiseFulfilledResult<UserWithStats | null> => 
        result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value as UserWithStats);
    
    // Sort by hours worked in descending order
    return userStats.sort((a, b) => b.hoursThisWeek - a.hoursThisWeek);
  } catch (error) {
    console.error('Error fetching users with stats:', error);
    throw new Error('Failed to fetch user statistics');
  }
};

// Get a specific user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar || `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 10) + 1}`,
      company: data.company || 'N/A',
      apiToken: data.apitoken,
      isActive: data.isactive
    };
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return null;
  }
};

// Create a new user
export const createUser = async (userData: Omit<User, 'id'>): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          company: userData.company,
          apitoken: userData.apiToken,
          isactive: userData.isActive
        }
      ])
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar || `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 10) + 1}`,
      company: data.company || 'N/A',
      apiToken: data.apitoken,
      isActive: data.isactive
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

// Update an existing user
export const updateUser = async (userId: string, userData: Partial<User>): Promise<User | null> => {
  try {
    const updateData: Record<string, unknown> = {};
    
    // Map User fields to database fields
    if (userData.name) updateData.name = userData.name;
    if (userData.email) updateData.email = userData.email;
    if (userData.avatar) updateData.avatar = userData.avatar;
    if (userData.company) updateData.company = userData.company;
    if (userData.apiToken) updateData.apitoken = userData.apiToken;
    if (userData.isActive !== undefined) updateData.isactive = userData.isActive;
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar || `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 10) + 1}`,
      company: data.company || 'N/A',
      apiToken: data.apitoken,
      isActive: data.isactive
    };
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw new Error(`Failed to update user with ID ${userId}`);
  }
};

// Delete a user
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw new Error(`Failed to delete user with ID ${userId}`);
  }
};

// Update user API token
export const updateUserApiToken = async (userId: string, apiToken: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ apitoken: apiToken })
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating API token for user ${userId}:`, error);
    throw new Error(`Failed to update API token for user ${userId}`);
  }
};

// Toggle user active status
export const toggleUserActiveStatus = async (userId: string, isActive: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ isactive: isActive })
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error toggling active status for user ${userId}:`, error);
    throw new Error(`Failed to toggle active status for user ${userId}`);
  }
};