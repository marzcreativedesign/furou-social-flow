
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "../utils";
import { fetchEventConfirmations } from "./helpers/fetch-confirmations";
import { fetchEventComments } from "./helpers/fetch-comments";
import type { Event, PaginationMetadata } from "@/types/event";

export const GetEventsPaginatedService = {
  /**
   * Busca eventos com paginação
   */
  async getEventsPaginated(page: number = 1, pageSize: number = 10) {
    try {
      // Calcula o início e fim do intervalo para paginação
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      // Busca os eventos
      const { data: events, error, count } = await supabase
        .from("events")
        .select("*, profiles:creator_id(*)", { count: "exact" })
        .order("date", { ascending: false })
        .range(start, end);

      if (error) {
        return handleError(error, "Erro ao buscar eventos paginados");
      }

      // Calcula metadados de paginação
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      const metadata: PaginationMetadata = {
        totalPages,
        currentPage: page,
        pageSize,
        totalCount,
        count: totalCount
      };

      // Para cada evento, busca os participantes e comentários
      const eventsWithExtras = await Promise.all(
        events.map(async (event) => {
          const eventId = event.id;
          const [eventParticipants, comments] = await Promise.all([
            fetchEventConfirmations(eventId),
            fetchEventComments(eventId)
          ]);

          return {
            ...event,
            event_participants: eventParticipants,
            comments: comments
          } as unknown as Event;
        })
      );

      return {
        data: eventsWithExtras,
        metadata,
        error: null
      };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos paginados");
    }
  },

  /**
   * Busca eventos públicos com paginação
   */
  async getPublicEventsPaginated(page: number = 1, pageSize: number = 10) {
    try {
      // Calcula o início e fim do intervalo para paginação
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      // Busca os eventos públicos
      const { data: events, error, count } = await supabase
        .from("events")
        .select("*, profiles:creator_id(*)", { count: "exact" })
        .eq("is_public", true)
        .order("date", { ascending: false })
        .range(start, end);

      if (error) {
        return handleError(error, "Erro ao buscar eventos públicos paginados");
      }

      // Calcula metadados de paginação
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      const metadata: PaginationMetadata = {
        totalPages,
        currentPage: page,
        pageSize,
        totalCount,
        count: totalCount
      };

      // Para cada evento, busca os participantes e comentários
      const eventsWithExtras = await Promise.all(
        events.map(async (event) => {
          const eventId = event.id;
          const [eventParticipants, comments] = await Promise.all([
            fetchEventConfirmations(eventId),
            fetchEventComments(eventId)
          ]);

          return {
            ...event,
            event_participants: eventParticipants,
            comments: comments
          } as unknown as Event;
        })
      );

      return {
        data: eventsWithExtras,
        metadata,
        error: null
      };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos públicos paginados");
    }
  },

  /**
   * Busca eventos por usuário com paginação
   */
  async getUserEventsPaginated(userId: string, page: number = 1, pageSize: number = 10) {
    try {
      // Calcula o início e fim do intervalo para paginação
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      // Busca os eventos do usuário (criados ou participando)
      const { data: events, error, count } = await supabase
        .from("events")
        .select("*, profiles:creator_id(*)", { count: "exact" })
        .or(`creator_id.eq.${userId},event_participants.user_id.eq.${userId}`)
        .order("date", { ascending: false })
        .range(start, end);

      if (error) {
        return handleError(
          error,
          "Erro ao buscar eventos do usuário paginados"
        );
      }

      // Calcula metadados de paginação
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      const metadata: PaginationMetadata = {
        totalPages,
        currentPage: page,
        pageSize,
        totalCount,
        count: totalCount
      };

      // Para cada evento, busca os participantes e comentários
      const eventsWithExtras = await Promise.all(
        events.map(async (event) => {
          const eventId = event.id;
          const [eventParticipants, comments] = await Promise.all([
            fetchEventConfirmations(eventId),
            fetchEventComments(eventId)
          ]);

          return {
            ...event,
            event_participants: eventParticipants,
            comments: comments
          } as unknown as Event;
        })
      );

      return {
        data: eventsWithExtras,
        metadata,
        error: null
      };
    } catch (error) {
      return handleError(
        error,
        "Erro inesperado ao buscar eventos do usuário paginados"
      );
    }
  }
};
