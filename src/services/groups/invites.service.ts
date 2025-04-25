
import { supabase } from '@/integrations/supabase/client';

// Error interface for consistent error responses
interface ErrorResponse {
  message: string;
}

// Success response interface
interface SuccessResponse {
  success: boolean;
  message: string;
}

export const GroupInvitesService = {
  inviteUserToGroup: async (groupId: string, email: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Check if user is admin in the group
      const { data: adminCheck } = await supabase
        .from('group_members')
        .select('is_admin')
        .eq('group_id', groupId)
        .eq('user_id', userData.user.id)
        .eq('is_admin', true)
        .maybeSingle();
        
      if (!adminCheck) {
        throw new Error('Você não tem permissão para convidar usuários para este grupo');
      }
      
      // Find the invited user
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (!profileData || !profileData.id) {
        return { 
          data: null, 
          error: { message: 'Usuário não encontrado com este email' }
        };
      }
      
      // Get group name for the notification
      const { data: group } = await supabase
        .from('groups')
        .select('name')
        .eq('id', groupId)
        .single();
        
      // Create notification for the invited user
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: profileData.id,
          title: 'Convite para grupo',
          content: `Você foi convidado para participar do grupo "${group?.name}"`,
          type: 'group_invite',
          related_id: groupId
        });
        
      if (notificationError) {
        throw notificationError;
      }
      
      return { 
        data: { success: true, message: 'Convite enviado com sucesso' }, 
        error: null 
      };
    } catch (error) {
      console.error("Error inviting user to group:", error);
      return { 
        data: null, 
        error: error instanceof Error ? { message: error.message } : { message: 'Unknown error occurred' }
      };
    }
  }
};
