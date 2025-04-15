
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "../utils";
import { fetchEventConfirmations } from "./helpers/fetch-confirmations";
import { fetchEventComments } from "./helpers/fetch-comments";
import { fetchGroupEvents } from "./helpers/fetch-group-events";
import type { Event } from "@/types/event";

export const GetEventByIdService = {
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
        const eventParticipants = await fetchEventConfirmations(id);
        const comments = await fetchEventComments(id);
        const groupEvents = await fetchGroupEvents(id);
        
        const eventWithExtras = {
          ...eventData,
          event_participants: eventParticipants,
          comments: comments || [],
          group_events: groupEvents || []
        } as Event;
        
        return { data: eventWithExtras, error: null };
      }
      
      return { data: null, error };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar detalhes do evento");
    }
  }
};
