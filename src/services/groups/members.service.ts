
import { supabase } from '@/integrations/supabase/client';
import { GroupMember } from './types';

export const GroupMembersService = {
  getGroupMembers: async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id, user_id, is_admin,
          profiles:user_id(id, username, full_name, avatar_url, email)
        `)
        .eq('group_id', groupId);
      
      return { 
        data: data as unknown as GroupMember[], 
        error 
      };
    } catch (error) {
      console.error("Error fetching group members:", error);
      return { data: null, error };
    }
  },

  addMemberToGroup: async (groupId: string, userId: string, isAdmin: boolean = false) => {
    try {
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (existingMember) {
        return { data: existingMember, error: null };
      }
      
      const { data, error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: userId,
          is_admin: isAdmin
        })
        .select()
        .single();
        
      return { data, error };
    } catch (error) {
      console.error("Error adding member to group:", error);
      return { data: null, error };
    }
  },

  updateMember: async (groupId: string, userId: string, isAdmin: boolean) => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .update({ is_admin: isAdmin })
        .eq('group_id', groupId)
        .eq('user_id', userId);
        
      return { data, error };
    } catch (error) {
      console.error("Error updating group member:", error);
      return { data: null, error };
    }
  },
  
  removeMember: async (groupId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);
        
      return { data, error };
    } catch (error) {
      console.error("Error removing group member:", error);
      return { data: null, error };
    }
  }
};
