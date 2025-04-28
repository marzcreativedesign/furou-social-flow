
export interface Group {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
  } | null;
}

export interface GroupInvite {
  id: string;
  group_id: string;
  inviter_id: string | null;
  invitee_email: string;
  invite_code: string;
  status: 'pending' | 'accepted' | 'expired';
  viewed: boolean;
  created_at: string;
  expires_at: string;
  group?: Group;
  inviter?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  type?: string;
}

export interface CreateInviteRequest {
  group_id: string;
  invitee_email: string;
}

export interface RankingUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  count: number;
}
