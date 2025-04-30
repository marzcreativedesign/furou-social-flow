
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "../utils";
import { fetchEventConfirmations } from "./helpers/fetch-confirmations";
import { fetchEventComments } from "./helpers/fetch-comments";
import type { Event } from "@/types/event";

export const GetEventsService = {
  /**
   * Busca eventos do usuário (criados ou participando)
   */
  async getUserEvents(userId: string) {
    try {
      const { data: events, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*)
        `)
        .or(`creator_id.eq.${userId},event_participants.user_id.eq.${userId}`)
        .order("date", { ascending: false });

      if (error) {
        return handleError(error, "Erro ao buscar eventos do usuário");
      }

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
        error: null
      };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos do usuário");
    }
  },

  /**
   * Busca eventos em que o usuário está confirmado
   */
  async getUserConfirmedEvents(userId: string) {
    try {
      const { data: events, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*),
          event_participants!inner(status, user_id)
        `)
        .eq("event_participants.user_id", userId)
        .eq("event_participants.status", "confirmed")
        .order("date", { ascending: false });

      if (error) {
        return handleError(error, "Erro ao buscar eventos confirmados");
      }

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
        error: null
      };
    } catch (error) {
      return handleError(
        error,
        "Erro inesperado ao buscar eventos confirmados"
      );
    }
  },

  /**
   * Busca eventos públicos
   */
  async getPublicEvents(page: number = 1, pageSize: number = 10) {
    try {
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data: events, error, count } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*)
        `, { count: "exact" })
        .eq("is_public", true)
        .order("date", { ascending: false })
        .range(start, end);

      if (error) {
        return handleError(error, "Erro ao buscar eventos públicos");
      }

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

      // Calcula metadados de paginação
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        data: eventsWithExtras,
        error: null,
        metadata: {
          totalPages,
          currentPage: page,
          pageSize,
          totalCount,
          count: totalCount
        }
      };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos públicos");
    }
  }
};
