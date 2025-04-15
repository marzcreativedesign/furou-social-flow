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
        const { data: participants } = await supabase
          .from("event_participants")
          .select(`
            *,
            profiles(*)
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
          event_participants: participants || [],
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
        const { data: participants } = await supabase
          .from("event_participants")
          .select(`
            *,
            profiles(*)
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
          event_participants: participants || [],
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
        const data = {
          ...eventData,
          comments: [],
          event_participants: [],
          group_events: []
        } as Event;
        
        const { data: participants } = await supabase
          .from("event_participants")
          .select(`
            *,
            profiles(*)
          `)
          .eq("event_id", id);
        
        if (participants) {
          data.event_participants = participants;
        }
        
        const { data: groupEvents } = await supabase
          .from("group_events")
          .select(`
            *,
            groups(*)
          `)
          .eq("event_id", id);
        
        if (groupEvents) {
          data.group_events = groupEvents;
        }
        
        const { data: comments } = await supabase
          .from("comments")
          .select("*")
          .eq("event_id", id);
        
        if (comments) {
          data.comments = comments;
        }
        
        return { data, error: null };
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
        const { data: participants } = await supabase
          .from("event_participants")
          .select(`
            *,
            profiles(*)
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
          event_participants: participants || [],
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
