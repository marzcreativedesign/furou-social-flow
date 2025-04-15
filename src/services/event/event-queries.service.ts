
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "./utils";
import { getCurrentUser } from "./utils";
import type { Event } from "@/types/event";

export const EventQueriesService = {
  async getEvents() {
    try {
      const user = await getCurrentUser();
      
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*)
        `)
        .or(`creator_id.eq.${user.id},is_public.eq.true`)
        .order("date", { ascending: true });
      
      if (error) {
        return handleError(error, "Erro ao buscar eventos");
      }
      
      const data = await Promise.all(eventsData.map(async event => {
        const { data: confirmations } = await supabase
          .from("event_confirmations")
          .select(`
            *,
            profiles:user_id(*)
          `)
          .eq("event_id", event.id);
        
        const { data: comments } = await supabase
          .from("comments")
          .select("*")
          .eq("event_id", event.id);
        
        const { data: groupEvents } = await supabase
          .from("group_events")
          .select(`
            *,
            groups(*)
          `)
          .eq("event_id", event.id);
        
        return {
          ...event,
          event_participants: confirmations || [],
          comments: comments || [],
          group_events: groupEvents || []
        } as Event;
      }));
      
      return { data, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos");
    }
  },
  
  async getUserEvents() {
    return this.getEvents();
  },
  
  async getPublicEvents() {
    try {
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*)
        `)
        .eq("is_public", true)
        .order("date", { ascending: true });
      
      if (error) {
        return handleError(error, "Erro ao buscar eventos públicos");
      }
      
      const data = await Promise.all(eventsData.map(async event => {
        const { data: confirmations } = await supabase
          .from("event_confirmations")
          .select(`
            *,
            profiles:user_id(*)
          `)
          .eq("event_id", event.id);
        
        const { data: comments } = await supabase
          .from("comments")
          .select("*")
          .eq("event_id", event.id);
        
        const { data: groupEvents } = await supabase
          .from("group_events")
          .select(`
            *,
            groups(*)
          `)
          .eq("event_id", event.id);
        
        return {
          ...event,
          event_participants: confirmations || [],
          comments: comments || [],
          group_events: groupEvents || []
        } as Event;
      }));
      
      return { data, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos públicos");
    }
  },
  
  async getEventById(id: string) {
    try {
      const { data: eventData, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*)
        `)
        .eq("id", id)
        .maybeSingle();
      
      if (error) {
        return handleError(error, "Erro ao buscar detalhes do evento");
      }
      
      if (eventData) {
        const eventWithExtras = {
          ...eventData,
          event_participants: [],
          comments: [],
          group_events: []
        } as Event;
        
        const { data: confirmations } = await supabase
          .from("event_confirmations")
          .select(`
            *,
            profiles:user_id(*)
          `)
          .eq("event_id", id);
        
        if (confirmations) {
          eventWithExtras.event_participants = confirmations.map(conf => ({
            id: conf.id,
            user_id: conf.user_id,
            status: conf.status || '',
            profiles: conf.profiles
          }));
        }
        
        const { data: comments } = await supabase
          .from("comments")
          .select("*")
          .eq("event_id", id);
        
        if (comments) {
          eventWithExtras.comments = comments;
        }
        
        const { data: groupEvents } = await supabase
          .from("group_events")
          .select(`
            *,
            groups(*)
          `)
          .eq("event_id", id);
        
        if (groupEvents) {
          eventWithExtras.group_events = groupEvents;
        }
        
        return { data: eventWithExtras, error: null };
      }
      
      return { data: null, error };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar detalhes do evento");
    }
  },
  
  async getUserCreatedEvents() {
    try {
      const user = await getCurrentUser();
      
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*)
        `)
        .eq("creator_id", user.id)
        .order("date", { ascending: true });
      
      if (error) {
        return handleError(error, "Erro ao buscar eventos do usuário");
      }
      
      const data = await Promise.all(eventsData.map(async event => {
        const { data: confirmations } = await supabase
          .from("event_confirmations")
          .select(`
            *,
            profiles:user_id(*)
          `)
          .eq("event_id", event.id);
        
        const { data: comments } = await supabase
          .from("comments")
          .select("*")
          .eq("event_id", event.id);
        
        const { data: groupEvents } = await supabase
          .from("group_events")
          .select(`
            *,
            groups(*)
          `)
          .eq("event_id", event.id);
        
        return {
          ...event,
          event_participants: confirmations || [],
          comments: comments || [],
          group_events: groupEvents || []
        } as Event;
      }));
      
      return { data, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos do usuário");
    }
  }
};
