
import { supabase } from '@/integrations/supabase/client';
import type { CreateGroupData } from './types';
export * from './types';

export const GroupsService = {
  getUserGroups: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id, user_id, is_admin, 
          groups:group_id(
            id, name, description, image_url, created_at
          )
        `)
        .eq('user_id', user.user.id);
        
      return { data, error };
    } catch (error) {
      console.error("Error fetching user groups:", error);
      return { data: null, error };
    }
  },

  getGroupById: async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          id, name, description, image_url, created_at,
          group_members(id, user_id, is_admin)
        `)
        .eq('id', groupId)
        .single();
        
      return { data, error };
    } catch (error) {
      console.error("Error fetching group:", error);
      return { data: null, error };
    }
  },

  createGroup: async (data: CreateGroupData) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data: createdGroup, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: data.name,
          description: data.description,
          image_url: data.image_url
        })
        .select()
        .single();
        
      if (groupError || !createdGroup) {
        throw groupError || new Error('Error creating group');
      }
      
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: createdGroup.id,
          user_id: user.user.id,
          is_admin: true
        });
        
      if (memberError) {
        console.error("Error adding member:", memberError);
        await supabase
          .from('groups')
          .delete()
          .eq('id', createdGroup.id);
          
        throw memberError;
      }
      
      return { data: createdGroup, error: null };
    } catch (error) {
      console.error("Error creating group:", error);
      return { data: null, error };
    }
  }
};

export { GroupMembersService } from './members.service';
export { GroupInvitesService } from './invites.service';
export { GroupEventsService } from './events.service';
