
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
    
    return await supabase
      .from('events')
      .select(`
        *,
        event_participants!inner(*),
        group_events(*, groups(*))
      `)
      .eq('event_participants.user_id', user.user.id)
      .order('date', { ascending: true });
  },

  /**
   * Listar eventos que o usuário está participando
   */
  getParticipatingEvents: async (userId: string) => {
    return await supabase
      .from('event_participants')
      .select(`
        *,
        events(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'confirmed');
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
        event_participants(*),
        profiles:creator_id(*)
      `)
      .eq('is_public', true)
      .order('date', { ascending: true });
      
    // If user is logged in, don't return their own created events
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
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }
    
    return await supabase
      .from('events')
      .insert({
        ...eventData,
        creator_id: user.user.id
      })
      .select();
  },

  /**
   * Participar de um evento
   */
  joinEvent: async (eventId: string, status: 'pending' | 'confirmed' = 'confirmed') => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }
    
    return await supabase
      .from('event_participants')
      .insert({
        event_id: eventId,
        user_id: user.user.id,
        status
      });
  },

  /**
   * Atualizar status de participação em um evento
   */
  updateParticipationStatus: async (eventId: string, status: 'pending' | 'confirmed' | 'declined') => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }
    
    return await supabase
      .from('event_participants')
      .update({ status })
      .eq('event_id', eventId)
      .eq('user_id', user.user.id);
  },

  /**
   * Adicionar comentário a um evento
   */
  addComment: async (eventId: string, content: string) => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Usuário não autenticado');
    }
    
    return await supabase
      .from('comments')
      .insert({
        event_id: eventId,
        user_id: user.user.id,
        content
      });
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
