
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "./utils";
import { getCurrentUser } from "./utils";
import type { Event } from "@/types/event";

export const EventQueriesService = {
  async getEvents() {
    try {
      const user = await getCurrentUser();
      
      // Fetch events that are either created by the user or public
      // But don't include event_participants in the initial query to prevent recursion
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
      
      // If we need participants data, fetch it in a separate query
      if (eventsData && eventsData.length > 0) {
        const data = [...eventsData] as Event[];
        
        // For each event, fetch its participants
        for (let i = 0; i < data.length; i++) {
          const { data: participants, error: partError } = await supabase
            .from("event_participants")
            .select("*")
            .eq("event_id", data[i].id);
          
          if (!partError && participants) {
            data[i].event_participants = participants;
          } else {
            data[i].event_participants = [];
          }
        }
        
        return { data, error: null };
      }
      
      return { data: eventsData as Event[], error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos");
    }
  },
  
  async getUserEvents() {
    return this.getEvents();
  },
  
  async getPublicEvents() {
    try {
      // Fetch only public events without nested event_participants to avoid recursion
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
      
      // If we need participants data, fetch it in a separate query
      if (eventsData && eventsData.length > 0) {
        const data = [...eventsData] as Event[];
        
        // For each event, fetch its participants
        for (let i = 0; i < data.length; i++) {
          const { data: participants, error: partError } = await supabase
            .from("event_participants")
            .select("*")
            .eq("event_id", data[i].id);
          
          if (!partError && participants) {
            data[i].event_participants = participants;
          } else {
            data[i].event_participants = [];
          }
        }
        
        return { data, error: null };
      }
      
      return { data: eventsData as Event[], error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos públicos");
    }
  },
  
  async getEventById(id: string) {
    try {
      // Fetch the event without nested queries to avoid recursion
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
        const data = { ...eventData } as Event;
        
        // Fetch participants in a separate query
        const { data: participants, error: partError } = await supabase
          .from("event_participants")
          .select(`
            *,
            profiles(*)
          `)
          .eq("event_id", id);
        
        if (!partError && participants) {
          data.event_participants = participants;
        } else {
          data.event_participants = [];
        }
        
        // Fetch group events in a separate query
        const { data: groupEvents, error: groupError } = await supabase
          .from("group_events")
          .select(`
            *,
            groups(*)
          `)
          .eq("event_id", id);
        
        if (!groupError && groupEvents) {
          data.group_events = groupEvents;
        } else {
          data.group_events = [];
        }
        
        // Fetch comments in a separate query
        const { data: comments, error: commentsError } = await supabase
          .from("comments")
          .select("*")
          .eq("event_id", id);
        
        if (!commentsError && comments) {
          data.comments = comments;
        } else {
          data.comments = [];
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
      
      // Fetch events created by the user without nested queries to avoid recursion
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
      
      // If we need participants data, fetch it in a separate query
      if (eventsData && eventsData.length > 0) {
        const data = [...eventsData] as Event[];
        
        // For each event, fetch its participants
        for (let i = 0; i < data.length; i++) {
          const { data: participants, error: partError } = await supabase
            .from("event_participants")
            .select("*")
            .eq("event_id", data[i].id);
          
          if (!partError && participants) {
            data[i].event_participants = participants;
          } else {
            data[i].event_participants = [];
          }
        }
        
        return { data, error: null };
      }
      
      return { data: eventsData as Event[], error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos do usuário");
    }
  }
};
