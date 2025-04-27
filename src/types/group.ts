
export interface Group {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  member_count?: number;
}

export interface GroupStats {
  membersCount: number;
  eventsCount: number;
  activeEventsCount: number;
}

export interface GroupAdminInfo {
  id: string;
  name: string;
  image: string;
  isAdmin: boolean;
}

export interface GroupWithMembers extends Group {
  group_members?: Array<{
    id: string;
    user_id: string;
    is_admin: boolean;
    profile?: {
      full_name?: string;
      username?: string;
      avatar_url?: string;
      email?: string;
    };
  }>;
}

// Add a new interface for the member with stats specifically for the ranking component
export interface MemberWithStats {
  id: string;
  name: string;
  image: string;
  isAdmin: boolean;
  stats: {
    participated: number;
    missed: number;
    pending: number;
  };
}
