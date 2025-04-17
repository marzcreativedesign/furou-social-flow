import { supabase } from "@/integrations/supabase/client";
import { handleError } from "../utils";
import { getCurrentUser } from "../utils";
import { fetchEventConfirmations } from "./helpers/fetch-confirmations";
import { fetchEventComments } from "./helpers/fetch-comments";
import { fetchGroupEvents } from "./helpers/fetch-group-events";

export const GetEventsPaginatedService = {
  async getEvents(page = 1, pageSize = 6) {
    try {
      const user = await getCurrentUser();
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      
      // Primeiro, obter a contagem total para calcular as páginas
      const { count, error: countError } = await supabase
        .from("events")
        .select('*', { count: 'exact', head: true })
        .or(`creator_id.eq.${user.id},is_public.eq.true`);
      
      if (countError) {
        return handleError(countError, "Erro ao obter contagem de eventos");
      }
      
      // Em seguida, obter os eventos paginados
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*)
        `)
        .or(`creator_id.eq.${user.id},is_public.eq.true`)
        .order("date", { ascending: true })
        .range(start, end);
      
      if (error) {
        return handleError(error, "Erro ao buscar eventos");
      }
      
      const data = await Promise.all(eventsData.map(async event => {
        const eventParticipants = await fetchEventConfirmations(event.id);
        const comments = await fetchEventComments(event.id);
        const groupEvents = await fetchGroupEvents(event.id);
        
        return {
          ...event,
          event_participants: eventParticipants,
          comments: comments || [],
          group_events: groupEvents || []
        };
      }));
      
      return { 
        data, 
        metadata: {
          totalCount: count,
          totalPages: Math.ceil(count / pageSize),
          currentPage: page,
          pageSize: pageSize
        }, 
        error: null 
      };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos");
    }
  },

  async getPublicEvents(page = 1, pageSize = 6) {
    try {
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      
      // Obter contagem total
      const { count, error: countError } = await supabase
        .from("events")
        .select('*', { count: 'exact', head: true })
        .eq("is_public", true);
      
      if (countError) {
        return handleError(countError, "Erro ao obter contagem de eventos públicos");
      }
      
      // Obter eventos paginados
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*)
        `)
        .eq("is_public", true)
        .order("date", { ascending: true })
        .range(start, end);
      
      if (error) {
        return handleError(error, "Erro ao buscar eventos públicos");
      }
      
      const data = await Promise.all(eventsData.map(async event => {
        const eventParticipants = await fetchEventConfirmations(event.id);
        const comments = await fetchEventComments(event.id);
        const groupEvents = await fetchGroupEvents(event.id);
        
        return {
          ...event,
          event_participants: eventParticipants,
          comments: comments || [],
          group_events: groupEvents || []
        };
      }));
      
      return { 
        data, 
        metadata: {
          totalCount: count,
          totalPages: Math.ceil(count / pageSize),
          currentPage: page,
          pageSize: pageSize
        },
        error: null 
      };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos públicos");
    }
  },

  async getUserCreatedEvents(page = 1, pageSize = 6) {
    try {
      const user = await getCurrentUser();
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      
      // Obter contagem total
      const { count, error: countError } = await supabase
        .from("events")
        .select('*', { count: 'exact', head: true })
        .eq("creator_id", user.id);
      
      if (countError) {
        return handleError(countError, "Erro ao obter contagem de eventos do usuário");
      }
      
      // Obter eventos paginados
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*)
        `)
        .eq("creator_id", user.id)
        .order("date", { ascending: true })
        .range(start, end);
      
      if (error) {
        return handleError(error, "Erro ao buscar eventos do usuário");
      }
      
      const data = await Promise.all(eventsData.map(async event => {
        const eventParticipants = await fetchEventConfirmations(event.id);
        const comments = await fetchEventComments(event.id);
        const groupEvents = await fetchGroupEvents(event.id);
        
        return {
          ...event,
          event_participants: eventParticipants,
          comments: comments || [],
          group_events: groupEvents || []
        };
      }));
      
      return { 
        data, 
        metadata: {
          totalCount: count,
          totalPages: Math.ceil(count / pageSize),
          currentPage: page,
          pageSize: pageSize
        },
        error: null 
      };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos do usuário");
    }
  }
};
