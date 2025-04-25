
import { supabase } from '@/integrations/supabase/client';

export const GroupInvitesService = {
  inviteUserToGroup: async (groupId: string, email: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data: isAdmin } = await supabase
        .from('group_members')
        .select('is_admin')
        .eq('group_id', groupId)
        .eq('user_id', user.user.id)
        .eq('is_admin', true)
        .maybeSingle();
        
      if (!isAdmin) {
        throw new Error('Você não tem permissão para convidar usuários para este grupo');
      }
      
      const { data: invitedUserResult } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      // Simplify type handling to avoid deep instantiation
      if (!invitedUserResult || !invitedUserResult.id) {
        return { 
          data: null, 
          error: { message: 'Usuário não encontrado com este email' }
        };
      }
      
      const { data: group } = await supabase
        .from('groups')
        .select('name')
        .eq('id', groupId)
        .single();
        
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: invitedUserResult.id,
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
      return { data: null, error };
    }
  }
};
