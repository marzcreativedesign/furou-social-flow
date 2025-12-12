
import { supabase } from "@/integrations/supabase/client";

export const EventParticipantService = {
  /**
   * Função para confirmar participação em um evento
   */
  async joinEvent(eventId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const userId = user.id;
      
      const { data, error } = await supabase
        .from('event_participants')
        .upsert(
          {
            event_id: eventId,
            user_id: userId,
            status: 'confirmed'
          },
          {
            onConflict: 'event_id,user_id',
            ignoreDuplicates: false,
          }
        )
        .select();

      return { data, error };
    } catch (error) {
      console.error('Error joining event:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Função para declinar participação em um evento
   */
  async declineEvent(eventId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const userId = user.id;
      
      const { data, error } = await supabase
        .from('event_participants')
        .upsert(
          {
            event_id: eventId,
            user_id: userId,
            status: 'declined'
          },
          {
            onConflict: 'event_id,user_id',
            ignoreDuplicates: false,
          }
        )
        .select();

      return { data, error };
    } catch (error) {
      console.error('Error declining event:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Busca convites pendentes para o usuário atual
   */
  async getPendingInvites() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: [], error: new Error("User not authenticated") };
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          date,
          location,
          image_url,
          event_participants!inner(status, user_id)
        `)
        .eq('event_participants.user_id', user.id)
        .eq('event_participants.status', 'invited')
        .order('date', { ascending: true });
        
      if (error) throw error;
      
      // Process invites to include status
      const invites = data?.map(event => ({
        ...event,
        status: 'invited'
      }));
      
      return { data: invites, error: null };
    } catch (error) {
      console.error('Error fetching pending invites:', error);
      return { data: [], error };
    }
  }
};
