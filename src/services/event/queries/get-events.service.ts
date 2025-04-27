
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "../utils";
import { getCurrentUser } from "../utils";
import { fetchEventConfirmations } from "./helpers/fetch-confirmations";
import { fetchEventComments } from "./helpers/fetch-comments";
import { fetchGroupEvents } from "./helpers/fetch-group-events";
import type { Event } from "@/types/event";

// Chaves de cache para armazenar resultados recentes
const CACHE_KEYS = {
  USER_EVENTS: 'user_events',
  PUBLIC_EVENTS: 'public_events',
  PENDING_INVITES: 'pending_invites',
  USER_CREATED_EVENTS: 'user_created_events'
};

export const GetEventsService = {
  async getEvents() {
    try {
      console.time('getEvents');
      const user = await getCurrentUser();
      
      // Seleção otimizada de campos - apenas os necessários para listagem
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          id,
          title,
          date,
          location,
          image_url,
          is_public,
          creator_id,
          profiles:creator_id(id, full_name, avatar_url)
        `)
        .or(`creator_id.eq.${user.id},is_public.eq.true`)
        .order("date", { ascending: true });
      
      if (error) {
        console.timeEnd('getEvents');
        return handleError(error, "Erro ao buscar eventos");
      }
      
      // Processamento em paralelo para melhor performance
      const data = await Promise.all(eventsData.map(async event => {
        // Obter apenas os participantes - prioritários para a exibição
        const eventParticipants = await fetchEventConfirmations(event.id);
        
        // Otimização: não buscar comentários e grupos na listagem inicial
        // Estes dados serão carregados sob demanda quando necessário
        
        return {
          ...event,
          event_participants: eventParticipants,
          comments: [], // Lazy loading - não carregar comentários na listagem
          group_events: [] // Lazy loading - carregar apenas quando necessário
        } as Event;
      }));
      
      console.timeEnd('getEvents');
      return { data, error: null };
    } catch (error) {
      console.timeEnd('getEvents');
      return handleError(error, "Erro inesperado ao buscar eventos");
    }
  },

  async getPendingInvites() {
    try {
      console.time('getPendingInvites');
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
        console.timeEnd('getPendingInvites');
        return handleError(participationsError, "Erro ao buscar participações pendentes");
      }
      
      if (!participations || participations.length === 0) {
        console.timeEnd('getPendingInvites');
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
        console.timeEnd('getPendingInvites');
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
      
      console.timeEnd('getPendingInvites');
      return { data: pendingInvites, error: null };
    } catch (error) {
      console.timeEnd('getPendingInvites');
      return handleError(error, "Erro inesperado ao buscar convites pendentes");
    }
  },

  async getPublicEvents() {
    try {
      console.time('getPublicEvents');
      
      // Usar JOIN para buscar dados de criador em uma única consulta
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          id,
          title,
          date,
          location,
          image_url,
          is_public,
          creator_id,
          profiles:creator_id(id, full_name, avatar_url)
        `)
        .eq("is_public", true)
        .order("date", { ascending: true });
      
      if (error) {
        console.timeEnd('getPublicEvents');
        return handleError(error, "Erro ao buscar eventos públicos");
      }
      
      // Processamento paralelo para melhor performance
      const data = await Promise.all(eventsData.map(async event => {
        // Obter apenas dados essenciais para a listagem
        const eventParticipants = await fetchEventConfirmations(event.id);
        
        return {
          ...event,
          event_participants: eventParticipants,
          comments: [], // Lazy loading
          group_events: [] // Lazy loading
        } as Event;
      }));
      
      console.timeEnd('getPublicEvents');
      return { data, error: null };
    } catch (error) {
      console.timeEnd('getPublicEvents');
      return handleError(error, "Erro inesperado ao buscar eventos públicos");
    }
  },

  async getUserCreatedEvents() {
    try {
      console.time('getUserCreatedEvents');
      const user = await getCurrentUser();
      
      // Seleção otimizada de dados
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          id,
          title,
          date,
          location,
          image_url,
          is_public,
          creator_id,
          profiles:creator_id(id, full_name, avatar_url)
        `)
        .eq("creator_id", user.id)
        .order("date", { ascending: true });
      
      if (error) {
        console.timeEnd('getUserCreatedEvents');
        return handleError(error, "Erro ao buscar eventos do usuário");
      }
      
      // Processamento paralelo para melhor performance
      const data = await Promise.all(eventsData.map(async event => {
        const eventParticipants = await fetchEventConfirmations(event.id);
        
        return {
          ...event,
          event_participants: eventParticipants,
          comments: [], // Lazy loading
          group_events: [] // Lazy loading
        } as Event;
      }));
      
      console.timeEnd('getUserCreatedEvents');
      return { data, error: null };
    } catch (error) {
      console.timeEnd('getUserCreatedEvents');
      return handleError(error, "Erro inesperado ao buscar eventos do usuário");
    }
  }
};
