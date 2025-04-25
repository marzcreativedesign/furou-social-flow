
export type MemberRole = "owner" | "admin" | "member";

export interface GroupMember {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role: MemberRole;
  user_id: string;
  is_admin: boolean;
}

export interface MemberManagementProps {
  groupId: string;
  isOwner: boolean;
  isAdmin: boolean;
}
