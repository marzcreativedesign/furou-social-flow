
import { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { mockGroups, getUserGroups, getPublicGroups, getGroupById, getPendingGroupInvites } from "@/data/mockData";

export interface Group {
  id: string;
  name: string;
  description: string;
  image_url: string;
  type: "public" | "private";
  creator_id: string;
  created_at: string;
  members: GroupMember[];
  events_count: number;
  members_count: number;
}

export interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  role: "admin" | "member";
  profiles: any;
}

export interface GroupInvite {
  id: string;
  group_id: string;
  user_id: string;
  invited_by: string;
  status: string;
  created_at: string;
  group: Group;
}

export const useGroups = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Get user's groups
  const myGroups = useMemo(() => {
    if (!user) return [];
    return getUserGroups(user.id) as Group[];
  }, [user]);

  // Get public groups
  const publicGroups = useMemo(() => {
    return getPublicGroups() as Group[];
  }, []);

  // Get pending invites
  const pendingInvites = useMemo(() => {
    if (!user) return [];
    return getPendingGroupInvites(user.id) as GroupInvite[];
  }, [user]);

  // Filter groups by search
  const filteredMyGroups = useMemo(() => {
    if (!searchQuery) return myGroups;
    const query = searchQuery.toLowerCase();
    return myGroups.filter(group => 
      group.name.toLowerCase().includes(query) ||
      group.description?.toLowerCase().includes(query)
    );
  }, [myGroups, searchQuery]);

  const filteredPublicGroups = useMemo(() => {
    if (!searchQuery) return publicGroups;
    const query = searchQuery.toLowerCase();
    return publicGroups.filter(group => 
      group.name.toLowerCase().includes(query) ||
      group.description?.toLowerCase().includes(query)
    );
  }, [publicGroups, searchQuery]);

  // Actions
  const joinGroup = useCallback(async (groupId: string) => {
    console.log("Mock: Joining group", groupId);
    return { success: true };
  }, []);

  const leaveGroup = useCallback(async (groupId: string) => {
    console.log("Mock: Leaving group", groupId);
    return { success: true };
  }, []);

  const acceptInvite = useCallback(async (inviteId: string) => {
    console.log("Mock: Accepting invite", inviteId);
    return { success: true };
  }, []);

  const declineInvite = useCallback(async (inviteId: string) => {
    console.log("Mock: Declining invite", inviteId);
    return { success: true };
  }, []);

  const createGroup = useCallback(async (data: Partial<Group>) => {
    console.log("Mock: Creating group", data);
    return { success: true, groupId: `group-new-${Date.now()}` };
  }, []);

  return {
    myGroups: filteredMyGroups,
    publicGroups: filteredPublicGroups,
    pendingInvites,
    loading: false,
    searchQuery,
    setSearchQuery,
    joinGroup,
    leaveGroup,
    acceptInvite,
    declineInvite,
    createGroup,
    getGroupById: (id: string) => getGroupById(id) as Group | null
  };
};
