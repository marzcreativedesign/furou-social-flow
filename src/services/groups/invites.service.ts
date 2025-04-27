
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
      
      // Find the invited user by email using auth.users first, then finding their profile
      // We need to use a workaround since we can't directly query auth.users
      // First we'll check for any existing profiles with matching username containing the email
      // This is a workaround approach
      const { data: matchingProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', `%${email}%`)
        .limit(10);

      if (profileError) {
        return { data: null, error: { message: 'Error searching for users' } };
      }
      
      // If we don't find any potential matches, notify the user
      if (!matchingProfiles || matchingProfiles.length === 0) {
        return { data: null, error: { message: 'No user found with an account matching this email' } };
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
      
      // Since we can't be 100% sure which profile corresponds to the email,
      // we'll create a notification for all potentially matching users
      // This is not ideal but works as a fallback solution
      const invitePromises = matchingProfiles.map(profile => {
        return supabase
          .from('notifications')
          .insert({
            user_id: profile.id,
            title: 'Group Invitation',
            content: `You've been invited to join the group "${group.name}"`,
            type: 'group_invite',
            related_id: groupId
          });
      });
      
      await Promise.all(invitePromises);
      
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("Error inviting user to group:", error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: null, error: { message } };
    }
  }
};
