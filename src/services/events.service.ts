
import { supabase } from "@/integrations/supabase/client";

export const EventsService = {
  async getEvents() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: new Error("User not authenticated") };

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles:creator_id(*),
          event_participants(
            status,
            user_id,
            profiles:user_id(*)
          )
        `)
        .or(`creator_id.eq.${user.id},event_participants.user_id.eq.${user.id}`)
        .order('date', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getPublicEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles:creator_id(*),
          event_participants(
            status,
            user_id,
            profiles:user_id(*)
          )
        `)
        .eq('is_public', true)
        .order('date', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getEventById(id: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles:creator_id(*),
          event_participants(
            status,
            user_id,
            profiles:user_id(*)
          ),
          comments(
            *,
            profiles:user_id(*)
          )
        `)
        .eq('id', id)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createEvent(eventData: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: new Error("User not authenticated") };

      const { data, error } = await supabase
        .from('events')
        .insert({ ...eventData, creator_id: user.id })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateEvent(id: string, eventData: any) {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteEvent(id: string) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      return { error };
    }
  },

  async joinEvent(eventId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: new Error("User not authenticated") };

      const { data, error } = await supabase
        .from('event_participants')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status: 'confirmed'
        })
        .select();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async declineEvent(eventId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: new Error("User not authenticated") };

      const { data, error } = await supabase
        .from('event_participants')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status: 'declined'
        })
        .select();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};
