
// Basic type definitions for group-related data
export interface Group {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  is_admin: boolean;
  joined_at?: string;
}

export interface GroupMemberProfile {
  id: string;
  user_id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
}

export interface GroupMemberWithProfile extends GroupMember {
  profile?: GroupMemberProfile;
}

// Simple request/response types
export interface CreateGroupRequest {
  name: string;
  description?: string;
  image_url?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: { message: string } | null;
}
