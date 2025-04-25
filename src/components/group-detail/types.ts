
export interface GroupMember {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role: "owner" | "admin" | "member";
  user_id: string;
  is_admin: boolean;
}

export interface MemberManagementProps {
  groupId: string;
  isOwner: boolean;
  isAdmin: boolean;
}
