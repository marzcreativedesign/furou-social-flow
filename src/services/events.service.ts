
import { supabase } from "@/integrations/supabase/client";
import { Event, EventServiceResponse } from "@/types/event";
import { EventQueriesService } from "./event/queries";

export const EventsService = {
  getEvents: async (
    page: number = 1,
    pageSize: number = 6
  ): Promise<EventServiceResponse> => {
    try {
      const { data, error, count } = await supabase
        .from('events')
        .select('*, event_participants(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) {
        return { error };
      }

      const totalPages = count ? Math.ceil(count / pageSize) : 0;

      return {
        data: data as Event[],
        error: null,
        metadata: {
          totalPages,
          currentPage: page,
          count
        }
      };
    } catch (error: any) {
      console.error('Error fetching events:', error);
      return { error };
    }
  },

  searchEvents: async (
    query: string,
    location?: string,
    page: number = 1,
    pageSize: number = 6
  ): Promise<EventServiceResponse> => {
    try {
      let queryBuilder = supabase
        .from('events')
        .select('*, event_participants(*)', { count: 'exact' });

      // Adicionar condição para busca por título ou descrição
      if (query) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,description.ilike.%${query}%`
        );
      }

      // Adicionar condição para localização
      if (location) {
        queryBuilder = queryBuilder.ilike('location', `%${location}%`);
      }

      const { data, error, count } = await queryBuilder
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) {
        return { error };
      }

      const totalPages = count ? Math.ceil(count / pageSize) : 0;

      return {
        data: data as Event[],
        error: null,
        metadata: {
          totalPages,
          currentPage: page,
          count
        }
      };
    } catch (error: any) {
      console.error('Error searching events:', error);
      return { error };
    }
  },

  getEventById: async (eventId: string): Promise<{ data?: Event; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*, event_participants(*)')
        .eq('id', eventId)
        .single();

      if (error) return { error };

      return { data: data as Event, error: null };
    } catch (error: any) {
      console.error(`Error fetching event ${eventId}:`, error);
      return { error };
    }
  },

  createEvent: async (eventData: Partial<Event>): Promise<{ data?: Event; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select();

      if (error) return { error };

      return { data: data[0] as Event, error: null };
    } catch (error: any) {
      console.error('Error creating event:', error);
      return { error };
    }
  },

  updateEvent: async (
    eventId: string,
    eventData: Partial<Event>
  ): Promise<{ data?: Event; error: any }> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', eventId)
        .select();

      if (error) return { error };

      return { data: data[0] as Event, error: null };
    } catch (error: any) {
      console.error(`Error updating event ${eventId}:`, error);
      return { error };
    }
  },

  deleteEvent: async (eventId: string): Promise<{ success?: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) return { error };

      return { success: true, error: null };
    } catch (error: any) {
      console.error(`Error deleting event ${eventId}:`, error);
      return { error };
    }
  },

  confirmAttendance: async (
    eventId: string,
    userId: string
  ): Promise<{ success?: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('event_confirmations')
        .upsert(
          {
            event_id: eventId,
            user_id: userId,
            status: 'confirmed'
          },
          { onConflict: 'event_id, user_id' }
        );

      if (error) return { error };

      return { success: true, error: null };
    } catch (error: any) {
      console.error(`Error confirming attendance for event ${eventId}:`, error);
      return { error };
    }
  },

  declineAttendance: async (
    eventId: string,
    userId: string
  ): Promise<{ success?: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from('event_confirmations')
        .upsert(
          {
            event_id: eventId,
            user_id: userId,
            status: 'declined'
          },
          { onConflict: 'event_id, user_id' }
        );

      if (error) return { error };

      return { success: true, error: null };
    } catch (error: any) {
      console.error(`Error declining attendance for event ${eventId}:`, error);
      return { error };
    }
  },

  // Re-exportando serviços específicos para consultas de eventos
  ...EventQueriesService
};
