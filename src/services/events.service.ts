
import { supabase } from '@/integrations/supabase/client';

/**
 * Serviço para gerenciar operações relacionadas a eventos
 */
export const EventsService = {
  /**
   * Listar eventos do usuário atual
   */
  getUserEvents: async () => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }
    
    // Lista eventos criados pelo usuário ou que está participando
    return await supabase
      .from('events')
      .select(`
        *,
        event_participants(*),
        group_events(*, groups(id, name))
      `)
      .or(`creator_id.eq.${user.user.id},event_participants.user_id.eq.${user.user.id}`)
      .order('date', { ascending: true });
  },

  /**
   * Listar eventos que o usuário está participando
   */
  getParticipatingEvents: async (userId: string) => {
    return await supabase
      .from('events')
      .select(`
        *,
        event_participants!inner(*)
      `)
      .eq('event_participants.user_id', userId)
      .eq('event_participants.status', 'confirmed');
  },

  /**
   * Listar eventos públicos
   */
  getPublicEvents: async () => {
    const { data: user } = await supabase.auth.getUser();
    
    const query = supabase
      .from('events')
      .select(`
        *,
        profiles:creator_id(*),
        event_participants(*)
      `)
      .eq('is_public', true)
      .order('date', { ascending: true });
      
    // Se o usuário estiver logado, não retornar eventos criados por ele
    if (user.user) {
      query.neq('creator_id', user.user.id);
    }
    
    return await query;
  },

  /**
   * Obter detalhes de um evento específico
   */
  getEventById: async (eventId: string) => {
    return await supabase
      .from('events')
      .select(`
        *,
        event_participants(*),
        comments(*),
        profiles:creator_id(*)
      `)
      .eq('id', eventId)
      .single();
  },

  /**
   * Criar um novo evento
   */
  createEvent: async (eventData: {
    title: string;
    description?: string;
    date: string;
    location?: string;
    is_public: boolean;
    image_url?: string;
  }) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          creator_id: user.user.id
        })
        .select();
        
      if (error) throw error;
      
      // Adicionar o criador como participante confirmado
      if (data && data.length > 0) {
        await supabase
          .from('event_participants')
          .insert({
            event_id: data[0].id,
            user_id: user.user.id,
            status: 'confirmed'
          });
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      return { data: null, error };
    }
  },

  /**
   * Participar de um evento
   */
  joinEvent: async (eventId: string, status: 'pending' | 'confirmed' = 'confirmed') => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.user.id,
          status
        });
        
      return { data, error };
    } catch (error) {
      console.error("Erro ao participar do evento:", error);
      return { data: null, error };
    }
  },

  /**
   * Atualizar status de participação em um evento
   */
  updateParticipationStatus: async (eventId: string, status: 'pending' | 'confirmed' | 'declined') => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('event_participants')
        .update({ status })
        .eq('event_id', eventId)
        .eq('user_id', user.user.id);
        
      return { data, error };
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      return { data: null, error };
    }
  },

  /**
   * Adicionar comentário a um evento
   */
  addComment: async (eventId: string, content: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          event_id: eventId,
          user_id: user.user.id,
          content
        });
        
      return { data, error };
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      return { data: null, error };
    }
  },

  /**
   * Obter comentários de um evento
   */
  getEventComments: async (eventId: string) => {
    return await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id(*)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });
  }
};
