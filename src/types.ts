// types.ts

// User model for our application
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    team: string;
    apiToken: string;
    weeklyTarget: number;
    isActive: boolean;
  }
  
  // User data after processing Toggl information
  export interface UserWithStats {
    id: string;
    name: string;
    avatar?: string;
    team: string;
    status: 'online' | 'away' | 'offline';
    hoursThisWeek: number;
    confirmedHours: string;
    weeklyTarget: number;
    achievement: string;
  }
  
  // Current user stats
  export interface CurrentUserStats {
    name: string;
    avatar?: string;
    team: string;
    hoursThisWeek: number;
    weeklyTarget: number;
    hoursWorkedPercentage: number;
    projectCompletion: number;
    avgDailyHours: number;
  }
  
  // Daily time entry
  export interface DailySession {
    name: string;
    startTime: string;
    endTime: string;
    duration: number; // in hours
    color: string;
  }
  
  // Response from Toggl API /me endpoint
  export interface TogglMeResponse {
    id: number;
    api_token: string;
    email: string;
    fullname: string;
    timezone: string;
    default_workspace_id: number;
    beginning_of_week: number;
    image_url: string;
    created_at: string;
    updated_at: string;
    openid_email: string;
    openid_enabled: boolean;
  }
  
  // Response from Toggl API for time entries
  export interface TogglTimeEntry {
    id: number;
    workspace_id: number;
    project_id: number | null;
    task_id: number | null;
    billable: boolean;
    start: string;
    stop: string | null;
    duration: number;
    description: string;
    tags: string[];
    tag_ids: number[];
    duronly: boolean;
    at: string;
    server_deleted_at: string | null;
    user_id: number;
    uid: number;
    wid: number;
    pid: number | null;
  }