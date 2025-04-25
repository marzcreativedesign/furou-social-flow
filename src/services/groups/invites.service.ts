
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from './types';

export const GroupInvitesService = {
  inviteUserToGroup: async (groupId: string, email: string): Promise<ApiResponse<{success: boolean}>> => {
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData?.user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }
      
      // Check if user is admin in the group
      const { data: adminCheck } = await supabase
        .from('group_members')
        .select('is_admin')
        .eq('group_id', groupId)
        .eq('user_id', userData.user.id)
        .eq('is_admin', true)
        .single();
        
      if (!adminCheck) {
        return { data: null, error: { message: 'You don\'t have permission to invite users to this group' } };
      }
      
      // Find the invited user
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();
        
      if (!profileData) {
        return { data: null, error: { message: 'User not found with this email' } };
      }
      
      // Get group name for the notification
      const { data: group } = await supabase
        .from('groups')
        .select('name')
        .eq('id', groupId)
        .single();
        
      if (!group) {
        return { data: null, error: { message: 'Group not found' } };
      }
      
      // Create notification for the invited user
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: profileData.id,
          title: 'Group Invitation',
          content: `You've been invited to join the group "${group.name}"`,
          type: 'group_invite',
          related_id: groupId
        });
        
      if (notificationError) {
        return { data: null, error: { message: 'Failed to send invitation notification' } };
      }
      
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("Error inviting user to group:", error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: null, error: { message } };
    }
  }
};
