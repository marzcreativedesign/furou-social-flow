
import { GetEventsService } from "./queries/get-events.service";
import { GetEventByIdService } from "./queries/get-event-by-id.service";
import { GetEventsPaginatedService } from "./queries/get-events-paginated.service";
import { supabase } from "@/integrations/supabase/client";

/**
 * EventService - Unified service for event operations
 * Optimized with cached batch operations where possible
 */
export const EventService = {
  // Query operations
  async getPublicEvents(page: number = 1, pageSize: number = 10) {
    return GetEventsService.getPublicEvents(page, pageSize);
  },

  async getUserEvents(userId: string) {
    return GetEventsService.getUserEvents(userId);
  },
  
  async getUserConfirmedEvents(userId: string) {
    return GetEventsService.getUserConfirmedEvents(userId);
  },
  
  async getEventsPaginated(page: number, pageSize: number) {
    return GetEventsPaginatedService.getEventsPaginated(page, pageSize);
  },

  async getEventById(id: string) {
    return GetEventByIdService.getEventById(id);
  },

  // Mutation operations
  async createEvent(eventData: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: new Error("User not authenticated"), data: null };

      const { data, error } = await supabase
        .from("events")
        .insert({ ...eventData, creator_id: user.id })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { error, data: null };
    }
  },

  async updateEvent(id: string, eventData: any) {
    try {
      const { data, error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { error, data: null };
    }
  },

  async deleteEvent(id: string) {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      return { error };
    } catch (error) {
      return { error };
    }
  },

  async joinEvent(eventId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: new Error("User not authenticated"), data: null };

      const { data, error } = await supabase
        .from("event_participants")
        .insert({
          event_id: eventId,
          user_id: user.id,
          status: "confirmed"
        })
        .select();

      return { data, error };
    } catch (error) {
      return { error, data: null };
    }
  },

  async declineEvent(eventId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: new Error("User not authenticated"), data: null };

      const { data, error } = await supabase
        .from("event_participants")
        .update({ status: "declined" })
        .match({ event_id: eventId, user_id: user.id })
        .select();

      return { data, error };
    } catch (error) {
      return { error, data: null };
    }
  },

  async getPendingInvites() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: new Error("User not authenticated"), data: null };

      // More efficient query using a single join
      const { data, error } = await supabase
        .from("event_participants")
        .select(`
          status,
          events:event_id (*)
        `)
        .eq("user_id", user.id)
        .eq("status", "invited");

      if (error) {
        return { error, data: null };
      }

      // Transform data to expected format
      const pendingInvites = data.map(record => ({
        ...record.events,
        status: record.status
      }));

      return { data: pendingInvites, error: null };
    } catch (error) {
      return { error, data: null };
    }
  }
};
