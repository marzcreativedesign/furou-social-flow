
import { supabase } from '@/integrations/supabase/client';
import { Group, CreateGroupRequest, ApiResponse } from './types';

export const GroupsService = {
  getUserGroups: async (): Promise<ApiResponse<Array<{
    id: string;
    user_id: string;
    is_admin: boolean;
    groups?: Group;
  }>>> => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData?.user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }
      
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id, user_id, is_admin, 
          groups:group_id(
            id, name, description, image_url, created_at, updated_at
          )
        `)
        .eq('user_id', userData.user.id);
        
      if (error) {
        return { data: null, error: { message: error.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching user groups:", error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: null, error: { message } };
    }
  },

  getGroupById: async (groupId: string): Promise<ApiResponse<Group & { group_members: Array<{id: string, user_id: string, is_admin: boolean}> }>> => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          id, name, description, image_url, created_at, updated_at,
          group_members(id, user_id, is_admin)
        `)
        .eq('id', groupId)
        .single();
        
      if (error) {
        return { data: null, error: { message: error.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching group:", error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: null, error: { message } };
    }
  },

  createGroup: async (data: CreateGroupRequest): Promise<ApiResponse<Group>> => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData?.user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }
      
      // Insert new group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: data.name,
          description: data.description,
          image_url: data.image_url
        })
        .select()
        .single();
        
      if (groupError || !group) {
        return { data: null, error: { message: groupError?.message || 'Failed to create group' } };
      }
      
      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: userData.user.id,
          is_admin: true
        });
        
      if (memberError) {
        // Rollback - delete the group if member creation fails
        await supabase.from('groups').delete().eq('id', group.id);
        return { data: null, error: { message: memberError.message } };
      }
      
      return { data: group, error: null };
    } catch (error) {
      console.error("Error creating group:", error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: null, error: { message } };
    }
  }
};
