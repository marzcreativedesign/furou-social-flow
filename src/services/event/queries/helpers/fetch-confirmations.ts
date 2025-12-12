
import { supabase } from "@/integrations/supabase/client";
import type { EventParticipant } from "@/types/event";

/**
 * Busca confirmações de eventos pelo ID do evento
 */
export async function fetchEventConfirmations(eventId: string): Promise<EventParticipant[]> {
  try {
    const { data, error } = await supabase
      .from("event_participants")
      .select(`
        id,
        user_id,
        event_id,
        status,
        created_at,
        profiles:user_id(full_name, avatar_url)
      `)
      .eq("event_id", eventId);

    if (error) {
      console.error("Erro ao buscar confirmações:", error);
      return [];
    }

    // Convert id to string for consistency in the application
    const participantsWithStatus = data.map(participant => ({
      ...participant,
      id: String(participant.id), // Convert to string
      status: participant.status || "confirmed" // Use status from DB or default to confirmed
    })) as EventParticipant[];

    return participantsWithStatus;
  } catch (error) {
    console.error("Erro inesperado ao buscar confirmações:", error);
    return [];
  }
}
