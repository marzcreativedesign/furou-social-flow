
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, GroupMember, MemberWithProfile } from './types';

export const GroupMembersService = {
  getGroupMembers: async (groupId: string): Promise<ApiResponse<MemberWithProfile[]>> => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id, group_id, user_id, is_admin,
          profiles:user_id (id, username, full_name, avatar_url, email)
        `)
        .eq('group_id', groupId);
      
      if (error) {
        return { data: null, error: { message: error.message } };
      }
      
      return { data: data as MemberWithProfile[], error: null };
    } catch (error) {
      console.error("Error fetching group members:", error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: null, error: { message } };
    }
  },

  addMemberToGroup: async (groupId: string, userId: string, isAdmin: boolean = false): Promise<ApiResponse<GroupMember>> => {
    try {
      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (existingMember) {
        return { data: existingMember as GroupMember, error: null };
      }
      
      // Add new member
      const { data, error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: userId,
          is_admin: isAdmin
        })
        .select()
        .single();
        
      if (error) {
        return { data: null, error: { message: error.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Error adding member to group:", error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: null, error: { message } };
    }
  },

  updateMember: async (groupId: string, userId: string, isAdmin: boolean): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('group_members')
        .update({ is_admin: isAdmin })
        .eq('group_id', groupId)
        .eq('user_id', userId);
        
      if (error) {
        return { data: null, error: { message: error.message } };
      }
      
      return { data: null, error: null };
    } catch (error) {
      console.error("Error updating group member:", error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: null, error: { message } };
    }
  },
  
  removeMember: async (groupId: string, userId: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);
        
      if (error) {
        return { data: null, error: { message: error.message } };
      }
      
      return { data: null, error: null };
    } catch (error) {
      console.error("Error removing group member:", error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: null, error: { message } };
    }
  }
};
