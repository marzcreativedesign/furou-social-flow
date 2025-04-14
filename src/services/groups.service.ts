
import { supabase } from '@/integrations/supabase/client';

/**
 * Serviço para gerenciar operações relacionadas a grupos
 */
export const GroupsService = {
  /**
   * Listar grupos do usuário atual
   */
  getUserGroups: async () => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }
    
    return await supabase
      .from('group_members')
      .select(`
        *,
        groups(*)
      `)
      .eq('user_id', user.user.id);
  },

  /**
   * Obter detalhes de um grupo específico
   */
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

  /**
   * Criar um novo grupo
   */
  createGroup: async (groupData: {
    name: string;
    description?: string;
    image_url?: string;
  }) => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }
    
    // Create the group
    const { data: createdGroup, error: groupError } = await supabase
      .from('groups')
      .insert(groupData)
      .select();
      
    if (groupError || !createdGroup || createdGroup.length === 0) {
      throw new Error(groupError?.message || 'Erro ao criar grupo');
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

  /**
   * Adicionar um evento ao grupo
   */
  addEventToGroup: async (groupId: string, eventId: string) => {
    return await supabase
      .from('group_events')
      .insert({
        group_id: groupId,
        event_id: eventId
      });
  }
};
