
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "../utils";
import { getCurrentUser } from "../utils";
import { fetchEventConfirmations } from "./helpers/fetch-confirmations";
import { fetchEventComments } from "./helpers/fetch-comments";
import { fetchGroupEvents } from "./helpers/fetch-group-events";
import { Event, PaginationMetadata } from "@/types/event";
import { ExploreEventsResponse } from "@/types/explore";

/**
 * Serviço otimizado para obter eventos com paginação
 * Implementa estratégias de performance como:
 * - Paginação usando range para limitar dados recuperados
 * - Consultas JOIN eficientes para reduzir subconsultas
 * - Seleção apenas dos campos necessários
 */
export const GetEventsPaginatedService = {
  /**
   * Obtém eventos (públicos e do usuário atual) com paginação
   */
  async getEvents(page = 1, pageSize = 6) {
    try {
      console.time('getEventsPaginated');
      const user = await getCurrentUser();
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      
      // Primeiro, obter a contagem total para calcular as páginas
      const { count, error: countError } = await supabase
        .from("events")
        .select('*', { count: 'exact', head: true })
        .or(`creator_id.eq.${user.id},is_public.eq.true`);
      
      if (countError) {
        console.timeEnd('getEventsPaginated');
        return handleError(countError, "Erro ao obter contagem de eventos");
      }
      
      // Em seguida, obter os eventos paginados com JOIN eficiente
      const { data: eventsData, error } = await supabase
        .from("events")
        .select(`
          id,
          title,
          date,
          location,
          description,
          image_url,
          is_public,
          creator_id,
          profiles:creator_id(id, full_name, avatar_url)
        `)
        .or(`creator_id.eq.${user.id},is_public.eq.true`)
        .order("date", { ascending: true })
        .range(start, end);
      
      if (error) {
        console.timeEnd('getEventsPaginated');
        return handleError(error, "Erro ao buscar eventos");
      }
      
      // Processar dados necessários em paralelo para maior eficiência
      const data = await Promise.all(eventsData.map(async event => {
        // Obter apenas dados essenciais de forma eficiente
        const eventParticipants = await fetchEventConfirmations(event.id);
        
        // Lazy-load: buscar dados adicionais apenas quando necessário
        // Estes dados geralmente não são necessários na listagem, apenas no detalhe
        // const comments = await fetchEventComments(event.id);
        const groupEvents = await fetchGroupEvents(event.id);
        
        return {
          ...event,
          event_participants: eventParticipants,
          comments: [], // Otimização: não carrega comentários na listagem
          group_events: groupEvents || []
        } as Event;
      }));
      
      const metadata: PaginationMetadata = {
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        pageSize: pageSize
      };
      
      console.timeEnd('getEventsPaginated');
      return { 
        data, 
        metadata, 
        error: null 
      };
    } catch (error) {
      console.timeEnd('getEventsPaginated');
      return handleError(error, "Erro inesperado ao buscar eventos");
    }
  },

  /**
   * Obtém eventos públicos com paginação
   */
  async getPublicEvents(page = 1, pageSize = 6): Promise<ExploreEventsResponse> {
    try {
      console.time('getPublicEventsPaginated');
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      
      // Obter contagem total otimizada
      const { count, error: countError } = await supabase
        .from("events")
        .select('id', { count: 'exact', head: true })
        .eq("is_public", true);
      
      if (countError) {
        console.timeEnd('getPublicEventsPaginated');
        return handleError(countError, "Erro ao obter contagem de eventos públicos");
      }
      
      // Obter eventos paginados com seleção otimizada de campos
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
        .order("date", { ascending: true })
        .range(start, end);
      
      if (error) {
        console.timeEnd('getPublicEventsPaginated');
        return handleError(error, "Erro ao buscar eventos públicos");
      }
      
      // Processar dados em paralelo para melhor performance
      const data = await Promise.all(eventsData.map(async event => {
        const eventParticipants = await fetchEventConfirmations(event.id);
        
        // Otimização: não carregamos dados desnecessários na listagem
        return {
          ...event,
          event_participants: eventParticipants,
          comments: [],
          group_events: []
        } as Event;
      }));
      
      console.timeEnd('getPublicEventsPaginated');
      return { 
        data, 
        metadata: {
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
          currentPage: page,
          pageSize: pageSize
        },
        error: null 
      };
    } catch (error) {
      console.timeEnd('getPublicEventsPaginated');
      return handleError(error, "Erro inesperado ao buscar eventos públicos");
    }
  },

  /**
   * Obtém eventos criados pelo usuário logado com paginação
   */
  async getUserCreatedEvents(page = 1, pageSize = 6) {
    try {
      console.time('getUserCreatedEventsPaginated');
      const user = await getCurrentUser();
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      
      // Obter contagem total
      const { count, error: countError } = await supabase
        .from("events")
        .select('id', { count: 'exact', head: true })
        .eq("creator_id", user.id);
      
      if (countError) {
        console.timeEnd('getUserCreatedEventsPaginated');
        return handleError(countError, "Erro ao obter contagem de eventos do usuário");
      }
      
      // Obter eventos paginados com campos selecionados especificamente
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
        .order("date", { ascending: true })
        .range(start, end);
      
      if (error) {
        console.timeEnd('getUserCreatedEventsPaginated');
        return handleError(error, "Erro ao buscar eventos do usuário");
      }
      
      const data = await Promise.all(eventsData.map(async event => {
        const eventParticipants = await fetchEventConfirmations(event.id);
        
        // Lazy-loading de dados adicionais
        return {
          ...event,
          event_participants: eventParticipants,
          comments: [],
          group_events: []
        } as Event;
      }));
      
      console.timeEnd('getUserCreatedEventsPaginated');
      return { 
        data, 
        metadata: {
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
          currentPage: page,
          pageSize: pageSize
        },
        error: null 
      };
    } catch (error) {
      console.timeEnd('getUserCreatedEventsPaginated');
      return handleError(error, "Erro inesperado ao buscar eventos do usuário");
    }
  }
};
