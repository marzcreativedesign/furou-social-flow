
export type GroupMemberProfile = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
}

export type GroupMember = {
  id: string;
  user_id: string;
  is_admin: boolean;
  profiles?: GroupMemberProfile;
}

export type CreateGroupData = {
  name: string;
  description?: string;
  image_url?: string;
}

export type Group = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}
