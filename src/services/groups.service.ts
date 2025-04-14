
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
  }
};
