
import { supabase } from '@/integrations/supabase/client';

export const GroupsService = {
  getUserGroups: async () => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    return await supabase
      .from('group_members')
      .select(`
        *,
        groups(*)
      `)
      .eq('user_id', user.user.id);
  },

  getGroupById: async (groupId: string) => {
    return await supabase
      .from('groups')
      .select(`
        *,
        group_members(*),
        group_events(*, events(*))
      `)
      .eq('id', groupId)
      .single();
  },

  getGroupMembers: async (groupId: string) => {
    return await supabase
      .from('group_members')
      .select(`
        *,
        profiles:user_id(*)
      `)
      .eq('group_id', groupId);
  },
  
  getGroupEvents: async (groupId: string) => {
    return await supabase
      .from('group_events')
      .select(`
        *,
        events(*)
      `)
      .eq('group_id', groupId);
  },

  createGroup: async (data: {
    name: string;
    description?: string;
    image_url?: string;
  }) => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // Create the group
    const { data: createdGroup, error: groupError } = await supabase
      .from('groups')
      .insert(data)
      .select();
      
    if (groupError || !createdGroup || createdGroup.length === 0) {
      throw new Error(groupError?.message || 'Error creating group');
    }
    
    // Add the creator as an admin member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: createdGroup[0].id,
        user_id: user.user.id,
        is_admin: true
      });
      
    if (memberError) {
      throw new Error(memberError.message);
    }
    
    return createdGroup;
  },
  
  addMemberToGroup: async (groupId: string, userId: string, isAdmin: boolean = false) => {
    return await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: userId,
        is_admin: isAdmin
      });
  },
  
  updateMember: async (groupId: string, userId: string, isAdmin: boolean) => {
    return await supabase
      .from('group_members')
      .update({ is_admin: isAdmin })
      .eq('group_id', groupId)
      .eq('user_id', userId);
  },
  
  removeMember: async (groupId: string, userId: string) => {
    return await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
  },
  
  addEventToGroup: async (groupId: string, eventId: string) => {
    return await supabase
      .from('group_events')
      .insert({
        group_id: groupId,
        event_id: eventId
      });
  }
};
