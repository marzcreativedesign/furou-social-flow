import { supabase } from '@/integrations/supabase/client';

export const GroupsService = {
  getUserGroups: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner(user_id)
        `)
        .eq('group_members.user_id', user.user.id);
        
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
          *,
          group_members(*),
          group_events(*, events(*))
        `)
        .eq('id', groupId)
        .single();
        
      return { data, error };
    } catch (error) {
      console.error("Error fetching group:", error);
      return { data: null, error };
    }
  },

  getGroupMembers: async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          profiles:user_id(*)
        `)
        .eq('group_id', groupId);
        
      return { data, error };
    } catch (error) {
      console.error("Error fetching group members:", error);
      return { data: null, error };
    }
  },
  
  getGroupEvents: async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          group_events!inner(*)
        `)
        .eq('group_events.group_id', groupId);
        
      return { data, error };
    } catch (error) {
      console.error("Error fetching group events:", error);
      return { data: null, error };
    }
  },

  createGroup: async (data: {
    name: string;
    description?: string;
    image_url?: string;
  }) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      // Create the group
      const { data: createdGroup, error: groupError } = await supabase
        .from('groups')
        .insert(data)
        .select()
        .single();
        
      if (groupError || !createdGroup) {
        throw new Error(groupError?.message || 'Error creating group');
      }
      
      // Add the creator as an admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: createdGroup.id,
          user_id: user.user.id,
          is_admin: true
        });
        
      if (memberError) {
        throw new Error(memberError.message);
      }
      
      return [createdGroup];
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  },
  
  addMemberToGroup: async (groupId: string, userId: string, isAdmin: boolean = false) => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: userId,
          is_admin: isAdmin
        });
        
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
  },
  
  addEventToGroup: async (groupId: string, eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_events')
        .insert({
          group_id: groupId,
          event_id: eventId
        });
        
      return { data, error };
    } catch (error) {
      console.error("Error adding event to group:", error);
      return { data: null, error };
    }
  }
};
