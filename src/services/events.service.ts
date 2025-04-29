
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";

export class EventsService {
  /**
   * Busca eventos com paginação opcional
   */
  static async getEvents(page?: number, pageSize?: number): Promise<{ data: any; error: any }> {
    try {
      let query = supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*),
          event_participants:event_participants(*)
        `)
        .order("date", { ascending: true });

      if (page !== undefined && pageSize !== undefined) {
        const start = (page - 1) * pageSize;
        const end = page * pageSize - 1;
        query = query.range(start, end);
      }

      const { data, error } = await query;

      return { data: data as Event[], error };
    } catch (error) {
      console.error("Error fetching events:", error);
      return { data: null, error };
    }
  }

  /**
   * Busca eventos públicos
   */
  static async getPublicEvents(page?: number, pageSize?: number): Promise<{ data: any; error: any }> {
    try {
      let query = supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*),
          event_participants:event_participants(*)
        `)
        .eq("is_public", true)
        .order("date", { ascending: true });

      if (page !== undefined && pageSize !== undefined) {
        const start = (page - 1) * pageSize;
        const end = page * pageSize - 1;
        query = query.range(start, end);
      }

      const { data, error } = await query;

      return { data: data as Event[], error };
    } catch (error) {
      console.error("Error fetching public events:", error);
      return { data: null, error };
    }
  }

  /**
   * Busca um evento pelo ID
   */
  static async getEventById(id: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*),
          event_participants:event_participants(*)
        `)
        .eq("id", id)
        .single();

      return { data: data as Event, error };
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      return { data: null, error };
    }
  }

  /**
   * Cria um novo evento
   */
  static async createEvent(eventData: any): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert([eventData])
        .select();

      return { data: data?.[0], error };
    } catch (error) {
      console.error("Error creating event:", error);
      return { data: null, error };
    }
  }

  /**
   * Atualiza um evento existente
   */
  static async updateEvent(id: string, eventData: any): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", id)
        .select();

      return { data: data?.[0], error };
    } catch (error) {
      console.error("Error updating event:", error);
      return { data: null, error };
    }
  }

  /**
   * Exclui um evento
   */
  static async deleteEvent(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      return { error };
    } catch (error) {
      console.error("Error deleting event:", error);
      return { error };
    }
  }
  
  /**
   * Função para confirmar participação em um evento
   */
  static async joinEvent(eventId: string, userId: string): Promise<{ data: any; error: any }> {
    try {
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
  }
  
  /**
   * Função para declinar participação em um evento
   */
  static async declineEvent(eventId: string, userId: string): Promise<{ data: any; error: any }> {
    try {
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
  }
}
