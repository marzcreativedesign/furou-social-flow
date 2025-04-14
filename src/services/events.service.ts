
import { supabase } from '@/integrations/supabase/client';

/**
 * Serviço para gerenciar operações relacionadas a eventos
 */
export const EventsService = {
  /**
   * Listar eventos do usuário atual
   */
  getUserEvents: async () => {
    return await supabase
      .from('events')
      .select(`
        *,
        event_participants(*),
        group_events(*, groups(*))
      `)
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
    return await supabase
      .from('events')
      .select(`
        *,
        event_participants(*)
      `)
      .eq('is_public', true)
      .order('date', { ascending: true });
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
        comments(*)
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
  }
};
