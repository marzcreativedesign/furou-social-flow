
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "../utils";
import { getCurrentUser } from "../utils";
import { fetchEventConfirmations } from "./helpers/fetch-confirmations";
import { fetchEventComments } from "./helpers/fetch-comments";
import { fetchGroupEvents } from "./helpers/fetch-group-events";
import type { Event } from "@/types/event";

export const GetEventsService = {
  async getEvents() {
    try {
      const user = await getCurrentUser();
      
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          id,
          title,
          date,
          location,
          image_url,
          is_public,
          profiles:creator_id(id, full_name, avatar_url)
        `)
        .or(`creator_id.eq.${user.id},is_public.eq.true`)
        .order("date", { ascending: true });
      
      if (error) {
        return handleError(error, "Erro ao buscar eventos");
      }
      
      const data = await Promise.all(eventsData.map(async event => {
        const eventParticipants = await fetchEventConfirmations(event.id);
        
        // Otimização: obter comentários e grupos apenas quando necessário
        let comments = [];
        let groupEvents = [];
        
        return {
          ...event,
          event_participants: eventParticipants,
          comments,
          group_events: groupEvents
        } as Event;
      }));
      
      return { data, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos");
    }
  },

  async getPendingInvites() {
    try {
      const user = await getCurrentUser();
      
      // Buscar diretamente as confirmações de eventos com status pendente ou convidado
      const { data: participations, error: participationsError } = await supabase
        .from("event_confirmations")
        .select(`
          id, 
          event_id,
          status
        `)
        .eq("user_id", user.id)
        .in("status", ["invited", "pending"]);
      
      if (participationsError) {
        return handleError(participationsError, "Erro ao buscar participações pendentes");
      }
      
      if (!participations || participations.length === 0) {
        return { data: [], error: null };
      }
      
      // Extrair IDs dos eventos para buscar detalhes
      const eventIds = participations.map(p => p.event_id);
      
      // Buscar apenas os dados necessários dos eventos
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select(`
          id,
          title,
          date,
          location,
          image_url
        `)
        .in("id", eventIds);
      
      if (eventsError) {
        return handleError(eventsError, "Erro ao buscar eventos pendentes");
      }
      
      // Combinar os dados de eventos com seus status
      const pendingInvites = eventsData.map(event => {
        const participation = participations.find(p => p.event_id === event.id);
        return {
          ...event,
          status: participation?.status
        };
      });
      
      return { data: pendingInvites, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar convites pendentes");
    }
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
        const eventParticipants = await fetchEventConfirmations(event.id);
        const comments = await fetchEventComments(event.id);
        const groupEvents = await fetchGroupEvents(event.id);
        
        return {
          ...event,
          event_participants: eventParticipants,
          comments: comments || [],
          group_events: groupEvents || []
        } as Event;
      }));
      
      return { data, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos públicos");
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
        const eventParticipants = await fetchEventConfirmations(event.id);
        const comments = await fetchEventComments(event.id);
        const groupEvents = await fetchGroupEvents(event.id);
        
        return {
          ...event,
          event_participants: eventParticipants,
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
